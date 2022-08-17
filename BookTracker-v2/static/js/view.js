// Actions after click submit button
$("#myInput-submit").click(function() {
    var selectedid
    var prov_id
    var selectedid_imprint
    var prov_id_imprint
    var start1 = $("#myInput-start1").val()
    var end1 = $('#myInput-end1').val()
    var start2 = $("#myInput-start2").val()
    var end2 = $('#myInput-end2').val()
    var countryfrom = $('#myInput-CountryFrom').val()
    var countryfromexclude = $('#myInput-CountryFromExclude').val()
    var placefrom = $('#myInput-PlaceFrom').val()
    var placefromexclude = $('#myInput-PlaceFromExclude').val()
    var countryto = $('#myInput-CountryTo').val()
    var countrytoexclude = $('#myInput-CountryToExclude').val()
    var placeto = $('#myInput-PlaceTo').val()
    var placetoexclude = $('#myInput-PlaceToExclude').val()
    var data = {
        "start": [start1, start2],
        "end": [end1, end2],
        "locationfrom": [countryfrom, countryfromexclude, placefrom, placefromexclude],
        "locationto": [countryto, countrytoexclude, placeto, placetoexclude],
    }
    console.log(data)


    $.ajax({
        type: 'POST',
        url: "/view_send",
        data: JSON.stringify(data),
        contentType: 'application/json; charset=UTF-8',
        async: false,
        success: function(response) {
            console.log(response);
            selectedid = JSON.parse(response)['id']
            prov_id = JSON.parse(response)['prov_id'] //the selected single provpath auto id
            selectedid_imprint = JSON.parse(response)['id_imprint']
            prov_id_imprint = JSON.parse(response)['prov_id_imprint'] //the selected single provpath auto id

            console.log(selectedid)
            console.log(prov_id)
            console.log(selectedid_imprint)
            console.log(prov_id_imprint)

            //other functions related to the response (the selected ids)

            //alert('Success!!!');
        },
        error: function(error) {
            alert('Failed :(');
        }
    });

    //Clear SVG g div & create new one
    //trajectory map related:
    d3.select('#map g.locations').remove();
    d3.select('#map svg').append('g').attr('class', 'locations');

    d3.select('#map g.movements').remove();
    d3.select('#map svg').append('g').attr('class', 'movements');

    d3.select('#map g.highlight_path').remove();
    d3.select('#map svg').append('g').attr('class', 'highlight_path')

    //chord diagram related:
    d3.select('#chord-country').remove();
    d3.select('#chord-country-container').append('div').attr('id', 'chord-country').style('height', '440px')

    d3.select('#chord-city').remove();
    d3.select('#chord-city-container').append('div').attr('id', 'chord-city').style('height', '440px')

    //leaflet map related:
    d3.select('#leafletmap').remove();
    d3.select('#leaflet_tab_box').append('div').attr('id', 'leafletmap').style('width', "720px").style('height', "500px").style('margin', 'auto');

    if ($("#optionsRadios2").is(":checked")) {
        selectedid = selectedid_imprint
        prov_id = prov_id_imprint
    }

    Promise.all([
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_provpath_new.csv"),
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
    ]).then(

        function(initialize) {
            console.log(selectedid)
            let Dantedata = initialize[0]
            let ProvPath = initialize[1]
            let Flat = initialize[2]
            let PathStartEnd = initialize[3]
                //selected record based on ctrl panel inputs:
            let Dantedata_selected = Dantedata.filter(item => selectedid.indexOf(+item.Id) > -1)
            let ProvPath_selected = ProvPath.filter(item => prov_id.indexOf(+item.auto_id) > -1)
            let Flat_selected = Flat.filter(item => selectedid.indexOf(+item.Id) > -1)
            let PathStartEnd_selected = PathStartEnd.filter(item => selectedid.indexOf(+item.Id) > -1)
                //console.log(PathStartEnd_selected)

            parseRawData(Dantedata_selected)
            createTable(Dantedata_selected, Flat_selected)
            highlightPath(ProvPath_selected)
            drawLeafletMap(Dantedata_selected, PathStartEnd_selected, initialLeafletMap)

            //Chord Diagram
            let Danteprov_selected = ProvPath.filter(item => selectedid.indexOf(+item.Id) > -1)
            let Danteprov_area_selected = Danteprov_selected.map(d => [d['area1'], d['area2']])
            let Danteprov_place_selected = Danteprov_selected.map(d => [d['place1'], d['place2']])
                //console.log(Danteprov_area)
                //console.log(Danteprov_place)
            console.log(Danteprov_area_selected);

            console.log(groupArraybyLocation(Danteprov_area_selected));
            //console.log(groupArraybyLocation(Danteprov_place));
            //drawChordDiagram(groupArraybyLocation(Danteprov_area_selected))
            drawChordDiagramOnCountry(groupArraybyLocation(Danteprov_area_selected))
            drawChordDiagramOnCity(groupArraybyLocation(Danteprov_place_selected))


        })

})

//Actions after click search by id button
/* html elements
<label for="myInput-searchId ">Book Id </label>
<input type="text" id="myInput-searchId" placeholder="For multiple values, please separated by comma..." style="width: 60%; margin-bottom:1rem ">
<input id="myInput-submitId" type="button" value="Search" style="position:absolute; right: 1rem; width: 15%;">
*/
$("#myInput-submitId").click(function() {
    var selectedid = $("#myInput-searchId").val().split(',').map(x => +x)
    console.log(selectedid);
    //Clear SVG g div & create new one
    //trajectory map related:
    d3.select('#map g.locations').remove();
    d3.select('#map svg').append('g').attr('class', 'locations');

    d3.select('#map g.movements').remove();
    d3.select('#map svg').append('g').attr('class', 'movements');

    d3.select('#map g.highlight_path').remove();
    d3.select('#map svg').append('g').attr('class', 'highlight_path');

    //chord diagram related:
    d3.select('#chord-country').remove();
    d3.select('#chord-country-container').append('div').attr('id', 'chord-country').style('height', '440px')

    d3.select('#chord-city').remove();
    d3.select('#chord-city-container').append('div').attr('id', 'chord-city').style('height', '440px')

    //leaflet map related:
    d3.select('#leafletmap').remove();
    d3.select('#leaflet_tab_box').append('div').attr('id', 'leafletmap').style('width', "720px").style('height', "500px").style('margin', 'auto');



    Promise.all([
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_provpath_new.csv"),
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
    ]).then(
        function(initialize) {
            let Dantedata = initialize[0]
            let ProvPath = initialize[1]
            let Flat = initialize[2]
            let PathStartEnd = initialize[3]
                //selected record based on ctrl panel inputs:
            console.log(selectedid[0] == 0)
            var Dantedata_selected, ProvPath_selected, Flat_selected, PathStartEnd_selected, Danteprov_selected
            if (selectedid[0] == 0) {
                Dantedata_selected = Dantedata
                ProvPath_selected = ProvPath
                Flat_selected = Flat
                PathStartEnd_selected = PathStartEnd
                Danteprov_selected = ProvPath
            } else {
                Dantedata_selected = Dantedata.filter(item => selectedid.indexOf(+item.Id) > -1)
                ProvPath_selected = ProvPath.filter(item => selectedid.indexOf(+item.Id) > -1)
                Flat_selected = Flat.filter(item => selectedid.indexOf(+item.Id) > -1)
                PathStartEnd_selected = PathStartEnd.filter(item => selectedid.indexOf(+item.Id) > -1)
                Danteprov_selected = ProvPath.filter(item => selectedid.indexOf(+item.Id) > -1) //chord
            }
            console.log(PathStartEnd)
            console.log(PathStartEnd_selected)
            console.log('hello:' + selectedid)

            parseRawData(Dantedata_selected)
            createTable(Dantedata_selected, Flat_selected)
            highlightPath(ProvPath_selected)
            drawLeafletMap(Dantedata_selected, PathStartEnd_selected, initialLeafletMap)

            //Chord Diagram
            let Danteprov_area_selected = Danteprov_selected.map(d => [d['area1'], d['area2']])
            let Danteprov_place_selected = Danteprov_selected.map(d => [d['place1'], d['place2']])
                //console.log(Danteprov_area)
                //console.log(Danteprov_place)
            console.log(Danteprov_area_selected);

            console.log(groupArraybyLocation(Danteprov_area_selected));
            //console.log(groupArraybyLocation(Danteprov_place));
            //drawChordDiagram(groupArraybyLocation(Danteprov_area_selected))
            drawChordDiagramOnCountry(groupArraybyLocation(Danteprov_area_selected))
            drawChordDiagramOnCity(groupArraybyLocation(Danteprov_place_selected))

        })

})