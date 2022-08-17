//Initial Base Map
let width_map = document.querySelector('#map svg').clientWidth;
let height_map = document.querySelector('#map svg').clientHeight;

//zoom functions:
let zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([
        [0, 0],
        [width_map, height_map]
    ])
    .on('zoom', handleZoom);

function handleZoom(e) {
    d3.selectAll('#map svg g')
        .attr('transform', e.transform);
}

function initZoom() {
    d3.select('#map svg')
        .call(zoom);
}


//projections:
const projection = d3.geoEquirectangular() //other projections: geoNaturalEarth1()
    .scale(130)
    .translate([width_map / 2, height_map / 2])
    .center([0, -3]);

const geoGenerator = d3.geoPath()
    .projection(projection);

// Handling the hover on the basemap
function handleMouseover(e, d) {
    let bounds = geoGenerator.bounds(d);
    let centroid = geoGenerator.centroid(d);
    //let pixelArea = geoGenerator.area(d);
    //let measure = geoGenerator.measure(d);

    d3.select('#map .info')
        .text('Current Country : ' + d.properties.name)
        //.text(d.properties.name + ' (path.area = ' + pixelArea.toFixed(1) + ' path.measure = ' + measure.toFixed(1) + ')');

    d3.select('#map .bounding-box rect')
        .attr('x', bounds[0][0])
        .attr('y', bounds[0][1])
        .attr('width', bounds[1][0] - bounds[0][0])
        .attr('height', bounds[1][1] - bounds[0][1]);

    d3.select('#map .centroid')
        .style('display', 'inline')
        .attr('transform', 'translate(' + centroid + ')');
}

function drawBasemap(geojson) {
    let u = d3.select('#map g.basemap')
        .selectAll('path')
        .data(geojson.features)
    u.enter()
        .append('path')
        .attr('d', geoGenerator)
        .on('mouseover', handleMouseover)
        .attr("fill", "#eee")
        .style("stroke", "#ccc");
}

// Request data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson") //world shape data
    .then(function(json) {
        drawBasemap(json)
    });



// Actions after click submit button
$("#myInput-submit").click(function() {
    var selectedid
    var prov_id
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
            console.log(selectedid)
            console.log(prov_id)

            //other functions related to the response (the selected ids)

            //alert('Success!!!');
        },
        error: function(error) {
            alert('Failed :(');
        }
    });

    //Clear SVG g
    d3.select('#map g.locations').remove();
    d3.select('#map svg').append('g').attr('class', 'locations');

    d3.select('#map g.movements').remove();
    d3.select('#map svg').append('g').attr('class', 'movements');

    d3.select('#map g.highlight_path').remove();
    d3.select('#map svg').append('g').attr('class', 'highlight_path')

    Promise.all([
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_provpath_new.csv"),
        //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
        //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
    ]).then(

        function(initialize) {
            //let data = initialize[0] //load example data
            let Dantedata = initialize[0]
            let ProvPath = initialize[1]
                //console.log(Dantedata)
                //console.log(selectedid)
                //console.log(typeof(selectedid))

            let Dantedata_selected = Dantedata.filter(item => selectedid.indexOf(+item.Id) > -1)
            let ProvPath_selected = ProvPath.filter(item => prov_id.indexOf(+item.auto_id) > -1)
            console.log(ProvPath_selected)

            parseRawData(Dantedata_selected)
            createTable(Dantedata_selected)

            highlightPath(ProvPath_selected)



        })

})

//Select Dante Data based on certain ids
function selectData(wholedata, selectedid) {
    return wholedata.filter(row => selectedid.indexOf(row.Id) > -1)
}

// Highlight the selected paths
function highlightPath(provpathdata) {
    let link = []
    provpathdata.forEach(function(row) {
        source = [+row.lon1, +row.lat1]
        target = [+row.lon2, +row.lat2]
        topush = { type: "LineString", coordinates: [source, target] }
        link.push(topush)
    })

    //console.log(link)

    let provpath = d3.select('#map g.highlight_path').selectAll("provPath").data(link)
    provpath.enter() // Add the path
        .append("path")
        .attr("d", function(d) { return geoGenerator(d) })
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("stroke-width", 1.2)
        .style("opacity", 0.3)
        //.style("visibility", "hidden") //set visibility to hidden when initializing
}



// functions to draw movements and locations
function drawLocations(dotsOnMap, bookId) {
    let l = d3.select('#map g.locations')
    l.append("circle")
        .attr("class", 'dots' + bookId)
        .attr("cx", dotsOnMap[0])
        .attr("cy", dotsOnMap[1])
        .attr("r", 3)
        .style("fill", "#69b3a2")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 0.3)
        .attr("stroke-opacity", 0.3)
        .attr("fill-opacity", 0.3);
}

function drawMovements(movement_cleaned, bookId) {
    let m = d3.select('#map g.movements').selectAll("myPath").data(movement_cleaned)
    m.enter()
        .append("path")
        .attr("class", 'path' + bookId)
        .attr("d", function(d) { return geoGenerator(d) })
        .style("fill", "none")
        .style("stroke", "#333333")
        .style("stroke-width", 1)
        .style("opacity", 0.25)

}

function parseRawData(rawdata) {
    rawdata.forEach(function(row, i) {
        //console.log(i) //show the index
        const bookId = row.Id
            //console.log(bookId)
        const lon = row.locationLonFilled
        const lat = row.locationLatFilled
        const lon_parsed = JSON.parse(lon.replace(/NoInfo/g, null))
        const lat_parsed = JSON.parse(lat.replace(/NoInfo/g, null))
            //console.log(lat_parsed)
        const Lon = []
        const Lat = []
        const movement = []
        const movement_cleaned = [] //drop all the null values
        const locs = [
            [lon_parsed[0]],
            [lat_parsed[0]]
        ]
        const locs_cleaned = [
                [lon_parsed[0]],
                [lat_parsed[0]]
            ] //drop all the null values

        //locs is an Array of Arrays: [[dotsLon Array],[dotsLatArray]]

        var source_temp = [lon_parsed[0], lat_parsed[0]] //set default not null value
        var target_temp = [lon_parsed[0], lat_parsed[0]]

        for (var j = 1; j < lon_parsed.length; j++) {
            //console.log(j)
            var lonArray = [lon_parsed[j - 1], lon_parsed[j]]
                //console.log(lonArray)
            Lon.push(lonArray)
            var latArray = [lat_parsed[j - 1], lat_parsed[j]]
                //console.log(latArray)
            Lat.push(latArray)

            var source = [lon_parsed[j - 1], lat_parsed[j - 1]]
            var target = [lon_parsed[j], lat_parsed[j]]
            var topush = { type: "LineString", coordinates: [source, target] }
            movement.push(topush)
            locs[0].push(lon_parsed[j])
            locs[1].push(lat_parsed[j])


            var source_cleaned
            var target_cleaned
            var topush_cleaned
            if (lon_parsed[j - 1] !== null) {
                if (lon_parsed[j] !== null) {
                    source_cleaned = [lon_parsed[j - 1], lat_parsed[j - 1]]
                    target_cleaned = [lon_parsed[j], lat_parsed[j]]
                    topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                    movement_cleaned.push(topush_cleaned)
                    source_temp = source_cleaned
                    target_temp = target_cleaned
                } else {
                    source_cleaned = [lon_parsed[j - 1], lat_parsed[j - 1]]
                    target_cleaned = target_temp
                    topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                    movement_cleaned.push(topush_cleaned)
                    source_temp = source_cleaned
                }
            } else {
                if (lon_parsed[j] !== null) {
                    source_cleaned = source_temp
                    target_cleaned = [lon_parsed[j], lat_parsed[j]]
                    topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                    movement_cleaned.push(topush_cleaned)
                    target_temp = target_cleaned
                } else {
                    source_cleaned = source_temp
                    target_cleaned = target_temp
                    topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                    movement_cleaned.push(topush_cleaned)
                }
            }

            if (lon_parsed[j] !== null) {
                locs_cleaned[0].push(lon_parsed[j])
                locs_cleaned[1].push(lat_parsed[j])
            }

            drawMovements(movement_cleaned, bookId)

            // Draw all the dots in this provenance
            for (var dot = 0; dot < locs_cleaned[0].length; dot++) {

                var dotsLon = locs_cleaned[0][dot]
                var dotsLat = locs_cleaned[1][dot]
                var dots = [dotsLon, dotsLat]
                    //console.log(dots)
                var dotsOnMap = projection(dots)
                    //console.log(dotsOnMap)

                drawLocations(dotsOnMap, bookId)

            }
        }

    })
}

// When did not initialize with ctrl panel, draw whole movements and locations first.
// Draw trajectories
const svg = d3.select('#map svg')
Promise.all([
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_provpath.csv"),
    //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
    //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
]).then(

    function(initialize) {
        //let data = initialize[0] //load example data
        let Dantedata = initialize[0]
        let Danteprov = initialize[1]
        let Danteprov_area = Danteprov.map(d => [d['area1'], d['area2']])
        let Danteprov_place = Danteprov.map(d => [d['place1'], d['place2']])
            //console.log(Danteprov_area)
            //console.log(Danteprov_place)
        console.log(groupArraybyLocation(Danteprov_area));
        //console.log(groupArraybyLocation(Danteprov_place));
        drawChordDiagram(groupArraybyLocation(Danteprov_area))


        //try to print several of Dante book movement

        Dantedata.forEach(function(row, i) {
            //console.log(i) //show the index
            const bookId = row.Id
                //console.log(bookId)
            const lon = row.locationLonFilled
            const lat = row.locationLatFilled
            const lon_parsed = JSON.parse(lon.replace(/NoInfo/g, null))
            const lat_parsed = JSON.parse(lat.replace(/NoInfo/g, null))
                //console.log(lat_parsed)
            const Lon = []
            const Lat = []
            const movement = []
            const movement_cleaned = [] //drop all the null values
            const locs = [
                [lon_parsed[0]],
                [lat_parsed[0]]
            ]
            const locs_cleaned = [
                    [lon_parsed[0]],
                    [lat_parsed[0]]
                ] //drop all the null values

            //locs is an Array of Arrays: [[dotsLon Array],[dotsLatArray]]

            var source_temp = [lon_parsed[0], lat_parsed[0]] //set default not null value
            var target_temp = [lon_parsed[0], lat_parsed[0]]

            for (var j = 1; j < lon_parsed.length; j++) {
                //console.log(j)
                var lonArray = [lon_parsed[j - 1], lon_parsed[j]]
                    //console.log(lonArray)
                Lon.push(lonArray)
                var latArray = [lat_parsed[j - 1], lat_parsed[j]]
                    //console.log(latArray)
                Lat.push(latArray)

                var source = [lon_parsed[j - 1], lat_parsed[j - 1]]
                var target = [lon_parsed[j], lat_parsed[j]]
                var topush = { type: "LineString", coordinates: [source, target] }
                movement.push(topush)
                locs[0].push(lon_parsed[j])
                locs[1].push(lat_parsed[j])


                var source_cleaned
                var target_cleaned
                var topush_cleaned
                if (lon_parsed[j - 1] !== null) {
                    if (lon_parsed[j] !== null) {
                        source_cleaned = [lon_parsed[j - 1], lat_parsed[j - 1]]
                        target_cleaned = [lon_parsed[j], lat_parsed[j]]
                        topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                        movement_cleaned.push(topush_cleaned)
                        source_temp = source_cleaned
                        target_temp = target_cleaned
                    } else {
                        source_cleaned = [lon_parsed[j - 1], lat_parsed[j - 1]]
                        target_cleaned = target_temp
                        topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                        movement_cleaned.push(topush_cleaned)
                        source_temp = source_cleaned
                    }
                } else {
                    if (lon_parsed[j] !== null) {
                        source_cleaned = source_temp
                        target_cleaned = [lon_parsed[j], lat_parsed[j]]
                        topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                        movement_cleaned.push(topush_cleaned)
                        target_temp = target_cleaned
                    } else {
                        source_cleaned = source_temp
                        target_cleaned = target_temp
                        topush_cleaned = { type: "LineString", coordinates: [source_cleaned, target_cleaned] }
                        movement_cleaned.push(topush_cleaned)
                    }
                }

                if (lon_parsed[j] !== null) {
                    locs_cleaned[0].push(lon_parsed[j])
                    locs_cleaned[1].push(lat_parsed[j])
                }

            }



            // Draw all the movements
            drawMovements(movement_cleaned, bookId)

            for (var dot = 0; dot < locs_cleaned[0].length; dot++) {

                var dotsLon = locs_cleaned[0][dot]
                var dotsLat = locs_cleaned[1][dot]
                var dots = [dotsLon, dotsLat]
                    //console.log(dots)
                var dotsOnMap = projection(dots)
                    //console.log(dotsOnMap)

                drawLocations(dotsOnMap, bookId)

            }



        })

    })

initZoom();



// Table related functions
function createTable(data) {
    const data_parsed = []
    data.forEach(function(row, i) {
        //console.log(i) //show the index
        //const hI = JSON.parse(row.holdingInstitution.replace(/"/g, `'`).replace(/u'/g, `"`).replace(/':/g, `":`).replace(/',/g, `",`).replace(/'}/g, `"}`))
        const NOP = JSON.parse(row.NumOfProv)
        const pN = JSON.parse(row.placeName.replace(/"/g, `'`).replace(/]/g, `"]`).replace(/, /g, `", "`).replace(`[`, `["`).replace(/NoInfo/g, 'Not Known'))
            //console.log(row.placeName)
        const lN = JSON.parse(row.locationName.replace(/"/g, `'`).replace(/]/g, `"]`).replace(/, /g, `", "`).replace(`[`, `["`).replace(/NoInfo/g, 'Not Known'))
        const tS = JSON.parse(row.timeStartFilled.replace(/NoInfo/g, null))
        const tE = JSON.parse(row.timeEndFilled.replace(/NoInfo/g, null))
        const tC = JSON.parse(row.timeCentury.replace(/"/g, 'OMG').replace(/'/g, '"').replace(/OMG/g, "'").replace(/NoInfo/g, '[]'))
        data_parsed.push({ Id: row.Id, NOP: NOP, lN: lN, pN: pN, tS: tS, tE: tE, tC: tC, Today: row.Today, MEIlink: row.MEIlink })
    });
    /*console.log(data_parsed)*/

    d3.select('#table-container tbody')
        .selectAll('tr')
        .data(data_parsed)
        .join('tr')
        .html(function(d) {
            let html = '<tr>';
            html += '<td style="width:10%">' + d.Id + '</td>';

            html += '<td style="width:10%">' + ' <a href="' + d.MEIlink + '">Link</a>' + '</td>';
            //if (d.hI['country'] == undefined) {
            //    html += '<td style="width:20%">' + d.hI.short.toString() + '</td>';
            //} else { html += '<td style="width:20%">' + d.hI.country.toString() + '<br/>' + d.hI.short.toString() + '</td>'; }

            html += '<td style="width:10%">' + (+d.NOP - 1) + '</td>';
            html += '<td style="width:10%">' + d.lN.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.pN.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tS.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tE.toString().replace(/,/g, '<br/>') + '</td>';

            html += '<td style="width:10%">' + d.Today + '</td>';
            html += '</tr>';
            return html;
        });
}

function searchBook() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput-id");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        console.log(td)
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";

            } else {
                tr[i].style.display = "none";

            }
        }
    }


}

function highlightSinglePath() {
    var input, filter, singlepath, singledots, p, d;
    input = document.getElementById("myInput-id");
    filter = input.value;
    console.log(filter)
    singlepath = document.getElementsByClassName('path' + filter)
    singledots = document.getElementsByClassName('dots' + filter)

    // set all the dots and paths' opacity to 0.01 if they are not
    /*
    var allpath = document.getElementsByClassName('movements');
    var alldots = document.getElementsByClassName('locations');
    var i, j;
    for (i = 0; i < allpath.length; i++) {
        console.log(allpath[i].attr)
        if (allpath[i].style.opacity != 0.01) {
            allpath[i].style.opacity = 0.01;
        } else {
            allpath[i].style.opacity = 0.25;
        }
    }

    for (j = 0; j < alldots.length; j++) {
        if (alldots[j].style.opacity != 0.01) {
            alldots[j].style.opacity = 0.01;
        } else {
            alldots[j].style.opacity = 0.3;
        }
    }
    */

    //highlight the seletced paths and dots with high opacity and larger size
    for (p = 0; p < singlepath.length; p++) {
        singlepath[p].setAttribute("style", "fill: none; stroke-width: 4; stroke: #660000; opacity: 1; z-index: 1");
        /*
        singlepath[p].style.stroke.width = 4;
        singlepath[p].style.stroke = '#660000';
        singlepath[p].style.opacity = 1;
        singlepath[p].style.zIndex = '1000';*/
    }
    for (d = 0; d < singledots.length; d++) {
        singledots[d].setAttribute("style", "r: 6; fill: #660000; opacity: 1; z-index: 1");
        /*
        singledots[d].style.r = 6;
        singledots[d].style.fill = '#660000';
        singledots[p].style.opacity = 1;
        singledots[p].style.zIndex = '1000';*/
    }
}


//draw Cord Diagram
//Group by function:
function groupArraybyLocation(arr = []) {
    let map = new Map()
    for (let i = 0; i < arr.length; i++) {
        const s = JSON.stringify(arr[i]);
        if (!map.has(s)) {
            map.set(s, {
                source: arr[i][0],
                target: arr[i][1],
                value: 1,
            });
        } else {
            map.get(s).value++;
        }
    }
    const res = Array.from(map.values())
    return res;
};
//Draw Chord function:
function drawChordDiagram(data) {
    let width = 460
    let height = 460
    let innerRadius = Math.min(width, height) * 0.25 - 10
    let outerRadius = innerRadius + 5
    let formatValue = x => `${x.toFixed(0)} copies`

    let names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    console.log(names)
    let index = new Map(names.map((name, i) => [name, i]))
    let matrix = Array.from(index, () => new Array(names.length).fill(0))
    for (const { source, target, value }
        of data) { matrix[index.get(source)][index.get(target)] += value; }
    console.log(matrix)

    let chord = d3.chordDirected()
        .padAngle(0.5 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    let ribbon = d3.ribbonArrow()
        .radius(innerRadius - 1)
        .padAngle(2 / innerRadius)

    let color = d3.scaleOrdinal(names, d3.schemeSet3.concat(d3.schemeCategory10))

    //start drawing
    const svg = d3.select('#chord')
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const chords = chord(matrix);

    //const textId = DOM.uid("text");


    svg.append("path")
        //.attr("id", textId.id)
        .attr("fill", "none")
        .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

    svg.append("g")
        .attr("fill-opacity", 0.90)
        .selectAll("g")
        .data(chords)
        .join("path")
        .attr("d", ribbon)
        .attr("fill", d => color(names[d.source.index]))
        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${names[d.source.index]} -> ${names[d.target.index]}:  ${formatValue(d.source.value)}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 3)
        .selectAll("g")
        .data(chords.groups)
        .join("g")
        .call(g => g.append("path")
            .attr("d", arc)
            .attr("fill", d => color(names[d.index]))
            .attr("stroke", "#fff"))
        .call(g => g.append("text")
            .attr("dy", -4)
            .append("textPath")
            //.attr("xlink:href", textId.href)
            .attr("startOffset", d => d.startAngle * outerRadius)
            .text(d => names[d.index]))
        .call(g => g.append("title")
            .text(d => `${names[d.index]}
    export ${formatValue(d3.sum(matrix[d.index]))}
    import ${formatValue(d3.sum(matrix, row => row[d.index]))}`));
}