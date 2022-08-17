//var W2 = W * 2
W2 = document.getElementById('Storyboard1-container').offsetWidth;
//alert(W2)
var width2 = W2 - margin.left - margin.right,
    height2 = height;
//height2 = document.getElementById('Storyboard2-container').offsetHeight;



//StoryTelling Board-1 : add multiple story boards (static)
/*
var stbContainer = d3.select('#Storyboard1-container')
    .append('div')
    .attr('id', 'stb-container')
    .style('position', 'relative')
    .style('top', margin.top + "px")
    .style('left', margin.left + "px")
    .style('width', width2 + "px")
    .style('height', height2 + "px")
    .style('background-color', 'lightblue')
*/

//Funrctions to draw multiple STB
var testID = ["02141553", "02013851", "02141122", "02001011"]
    /*var testObj = {
        "Id": "02141122",
        "holdingInstitution": "{u'country': u'DE', u'isil': u'DE-14', u'name': u'Dresden, Sächsische Landes- und Universitätsbibliothek', u'short': u'DresdenSLUB'}",
        "NumOfProv": "6",
        "locationName": "[Italy, Italy, NoInfo, Germany, Germany, Germany]",
        "locationType": "[accurate, accurate, NoInfo, accurate, accurate, accurate]",
        "MEIlink": "https://data.cerl.org/mei/02141122",
        "startType": "[accurate, accurate, accurate, approx, accurate, accurate]",
        "endType": "[accurate, accurate, approx, accurate, accurate, accurate]",
        "locationLatFilled": "[43.77925, 43.77925, 43.77925, 51.05089, 51.05089, 51.05089]",
        "locationLonFilled": "[11.24626, 11.24626, 11.24626, 13.73832, 13.73832, 13.73832]",
        "timeStartFilled": "[1481, 1486, 1501, 1700, 1768, 1775]",
        "timeEndFilled": "[1481, 1560, 1800, 1763, 1775, 2021]"
    }
    */


/////////////////////////////////////////////////////////////////////////////
/////////////////Promise load data for drawing STB 1 2 3/////////////////////

Promise.all([
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
    d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes.json"),
    d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/edges.json"),
]).then(
    function(initialize) {
        let dante = initialize[0]
        let EBnodes = initialize[1]
        let EBedges = initialize[2]

        console.log(dante)
        console.log(EBnodes)

        var danteObj = {}
        dante.forEach((element, index) => {
            danteObj[element.Id] = element
        })
        var subdata = generateTableSubset(danteObj, testID)
        var danteSub = subdata.Arr
        var danteObjSub = subdata.Obj

        drawStb1(danteSub)
            //drawStb2(danteObjSub, testID)

        //console.log(dante[0].NumOfProv)
        //drawLeafletMap(Dantedata, PathStartEnd, initialLeafletMap);
        drawStb2(EBnodes, EBedges, testID)
    })


/////////////////////////////////////////////////////////////////////////////
//////////////////Pre request functions for drawing stb1/////////////////////
function generateTableSubset(dataObj, selectedList) {
    var dataArrSub = []
    var dataObjSub = {}
    for (var i = 0; i < selectedList.length; i++) {
        var selectedBook = dataObj[selectedList[i]]
        dataArrSub.push(selectedBook)
        dataObjSub[selectedList[i]] = selectedBook
        console.log(dataObjSub)
    }
    var subTableData = { Arr: dataArrSub, Obj: dataObjSub }
    console.log(subTableData)
    return subTableData
}

function drawStb1(data) {
    var stb1Table = document.getElementById("stb1TableBody");
    stb1Table.style.width = width2
    var stb1TableHTML = '';

    //i will iterate through all the selected books
    var totalNumberOfBooks = data.length
        //var totalNumberOfBooks = 3
    for (var i = 0; i < totalNumberOfBooks; i++) {
        //console.log('i=' + i)
        //stb1TableHTML += ' <tr><th scope="row" style="width:' + (0.01 * width2) + 'px">' + (i + 1) + '</th><td style="width:' + (0.04 * width2) + 'px">' + data[i].Id + '</td><td><div id="book-' + (i + 1) + '"' + ' class="outer-box" style="width:' + (0.9 * width2) + 'px"></div></td></tr>'
        //stb1TableHTML += ' <tr><th scope="row" style="width:' + (0.005 * width2) + 'px">' + (i + 1) + '</th><td><div id="book-' + (i + 1) + '-stat" style="width:' + (0.195 * width2) + 'px"><p>' + data[i].Id + '</p><div id="book-' + (i + 1) + '-radar"></div></div></td>' + '<td><div id="book-' + (i + 1) + '-overview"' + 'style="width:' + (0.4 * width2) + 'px; height:' + (height / 3) + 'px"></div></td>' + '<td><div id="book-' + (i + 1) + '"' + ' class="outer-box" style="width:' + (0.4 * width2) + 'px"></div></td></tr>'
        stb1TableHTML += ' <tr><th scope="row" style="width:' + (0.005 * width2) + 'px">' + (i + 1) + '</th><td><div id= "book-' + (i + 1) + '-info" style="width:' + (0.645 * width2) + 'px; height: ' + (height * 0.4) + 'px">' + '<div id="book-' + (i + 1) + '-stat" class="stb1StatContainer" style="width:' + (0.185 * width2) + 'px; height:' + (height / 3) + '"><div id="book-' + (i + 1) + '-radar"></div><!--p>Book ID: ' + data[i].Id + '</p--></div>' + '<div id="book-' + (i + 1) + '-overview" class="stb1OverviewContainer"' + 'style="width:' + (0.46 * width2) + 'px; height:' + (height / 3) + 'px"></div><div id="book-' + (i + 1) + '-stop" class="stb1StopContainer" style="width:' + (0.185 * width2) + 'px; height=' + (height * 0.07) + 'px"></div></div></td>' + '<td><div id="book-' + (i + 1) + '"' + ' class="outer-box" style="width:' + (0.35 * width2) + 'px"></div></td></tr>'

        stb1Table.innerHTML = stb1TableHTML

        //$('#book-' + (i + 1) + '-stat').append($('<a/>', { 'id': 'book-' + (i + 1) + '-IdBtn', 'class': 'btn btn-info btn-sm', 'href': "https://google.com" }))
        //<a href="https://data.cerl.org/mei/02141082" class="btn btn-info btn-sm">02141553/</a>
    }

    for (var i = 0; i < totalNumberOfBooks; i++) {
        var idInt = data[i].Id
        var idStr
        if (String(idInt).length == 7) {
            idStr = '0' + String(idInt)
        } else if (String(idInt).length == 6) {
            idStr = '00' + String(idInt)
        } else {
            idStr = String(idInt)
        }
        $('#book-' + (i + 1) + '-stat').append($('<a/>', { 'id': 'book-' + (i + 1) + '-IdBtn', 'class': 'btn btn-info btn-sm', 'href': 'https://data.cerl.org/mei/' + idStr }).text(idStr))

        $('#book-' + (i + 1)).append($('<div/>', { 'id': 'book-' + (i + 1) + '-inner', 'class': 'inner-box', 'height': height2 / 3 }))
            //var NumberOfProvs = dante[i].length
        var eachbookdata = data[i]
        var eachbooklon = JSON.parse(eachbookdata.locationLonFilled.replace(/NoInfo/g, null))
        var eachbooklat = JSON.parse(eachbookdata.locationLatFilled.replace(/NoInfo/g, null))
        var eachbookTimeStart = JSON.parse(eachbookdata.timeStartFilled.replace(/NoInfo/g, null))
        var eachbookTimeEnd = JSON.parse(eachbookdata.timeEndFilled.replace(/NoInfo/g, null))
            //data completeness of each book
        var eachbookTimeStartType = eachbookdata.startType.substr(1, eachbookdata.startType.length - 2).split(", ")
        var eachbookTimeEndType = eachbookdata.endType.substr(1, eachbookdata.endType.length - 2).split(", ")
        var eachbookLocationType = eachbookdata.locationType.substr(1, eachbookdata.locationType.length - 2).split(", ")
            //console.log(eachbookdata.startType)
            //console.log(eachbookTimeStartType)
            //console.log(eachbookTimeEndType)
            //console.log(eachbookLocationType)

        var eachbookLocName = eachbookdata.locationName.substr(1, eachbookdata.locationName.length - 2).split(", ")
        var eachbookPlaceName = eachbookdata.placeName.substr(1, eachbookdata.placeName.length - 2).split(", ")
        console.log(eachbookLocName)
        console.log(eachbookPlaceName)
        var n = eachbookdata.NumOfProv
        var latlngsList = [
                [43.77925, 11.24626]
            ]
            //color #b1c7b3,#f1eac8,#e5b9ad
        var radar_data = [{
                name: 'Start Time',
                axes: [],
                color: '#72aaa1'
            },
            {
                name: 'End Time',
                axes: [],
                color: '#f1eac8'
            },
            {
                name: 'Location',
                axes: [],
                color: '#e5b9ad'
            }
        ];
        radar_data[0].axes = radarDataMapping(eachbookTimeStartType, radar_data[0].axes)
        radar_data[1].axes = radarDataMapping(eachbookTimeEndType, radar_data[1].axes)
        radar_data[2].axes = radarDataMapping(eachbookLocationType, radar_data[2].axes)
        console.log(radar_data)
        RadarChart('#book-' + (i + 1) + '-radar', radar_data, radarChartOptions)
            //

        //draw overview map
        ///////initial the basemap
        var map0 = L.map('book-' + (i + 1) + '-overview').setView([40, 16], 3)
        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                maxZoom: 20,
                minZoom: 1,
            }).addTo(map0);
        map0.addControl(new L.Control.Fullscreen());
        var leafletmap0Tab = document.getElementById('book-' + (i + 1) + '-overview');
        var observer = new MutationObserver(function() {
            if (leafletmap0Tab.style.display != 'none') {
                map0.invalidateSize();
            }
        });
        observer.observe(leafletmap0Tab, { attributes: true });

        ////////draw arcs for each prov
        console.log(eachbookdata)
        drawOverviewMap(eachbookLocName, eachbooklat, eachbooklon, map0, n)

        ///////add moving marker go along each prov via straight line
        for (book_j = 0; book_j < n; book_j++) {
            var coor = [eachbooklat[book_j], eachbooklon[book_j]]
            L.piechartMarker(
                L.latLng(coor), {
                    radius: 16,
                    data: generatePieData(eachbooklat, eachbooklon, n, book_j)
                }
            ).addTo(map0);
            var myIcon = L.divIcon({
                className: 'prov-num-icon',
                html: book_j + 1,
                iconAnchor: [5, 5]
            });
            // you can set .prov-num-icon styles in CSS

            label = L.marker(coor, {
                icon: myIcon
            }).addTo(map0);
        }
        //draw stop line
        console.log(i)
        drawStopLine(prepareStopLineData(eachbookLocName, eachbookPlaceName), eachbookLocName, 'book-' + (i + 1) + '-stop', height)

        // draw sub maps for each book
        for (var j = 0; j < n - 1; j++) {
            //initial each base map
            $('#book-' + (i + 1) + '-inner').append($('<div/>', { 'id': 'book' + (i + 1) + 'prov' + j, 'width': height2 / 2, 'height': height2 / 3 }))
                ///add a label to each sub base map
                //$('#book-' + (i + 1) + '-inner').append($('<div/>', { 'id': 'book' + (i + 1) + 'prov' + j + 'label', 'background-color': 'blue', "z-index": 9999 })).append("prov label")
                ///add the leaflet base map
            var leafletmap1Tab = document.getElementById('book' + (i + 1) + 'prov' + j);
            var observer = new MutationObserver(function() {
                if (leafletmap1Tab.style.display != 'none') {
                    map1.invalidateSize();
                }
            });
            observer.observe(leafletmap1Tab, { attributes: true });

            var map1 = L.map('book' + (i + 1) + 'prov' + j).setView([40, 16], 3)
            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                    maxZoom: 10,
                    minZoom: 1,
                }).addTo(map1);


            //draw text label
            var legend = L.control({ position: "bottomleft" });

            legend.onAdd = function(map) {
                var div = L.DomUtil.create("div", "legend");
                div.innerHTML += "<h6>prov." + (j + 1) + " ==> prov." + (j + 2) + "</h6>";
                //div.innerHTML += '<i style="background: #477AC2"></i><span>Water</span><br>';
                //div.innerHTML += '<i style="background: #448D40"></i><span>Forest</span><br>';
                //div.innerHTML += '<i style="background: #E6E696"></i><span>Land</span><br>';
                //div.innerHTML += '<i style="background: #E8E6E0"></i><span>Residential</span><br>';
                //div.innerHTML += '<i style="background: #FFFFFF"></i><span>Ice</span><br>';
                //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
                return div;
            };

            legend.addTo(map1);

            //draw paths
            var latlng = [eachbooklat[j], eachbooklon[j]]
            var nextlatlng = [eachbooklat[j + 1], eachbooklon[j + 1]]
            var nextlatlngList = [latlng, nextlatlng]
            latlngsList.push(nextlatlng)
                //circlesList.push(nextlatlng)
            var timestrat = eachbookTimeStart[j]
            var timestarttype = eachbookTimeStartType[j] //accurate, approx, NoInfo
            var timeend = eachbookTimeEnd[j]
            var timeendtype = eachbookTimeEndType[j]
            var locationtype = eachbookLocationType[j]

            // draw line for past provenance
            L.polyline(latlngsList, { color: '#196363', opacity: '0.9', width: '20' }).addTo(map1);
            // draw line for the next provenance
            L.polyline(nextlatlngList, { color: 'white', opacity: '0.7', width: '20', dashArray: '5,10' }).addTo(map1);

            //draw past circles
            latlngsList.forEach(function(coord) {
                var circle = L.circleMarker(coord, {
                    color: 'grey',
                    width: 1,
                    fillColor: '#196363',
                    fillOpacity: 0.7,
                    radius: 10
                }).addTo(map1);
            });
            //draw next circle

            L.circleMarker(latlng, { fillOpacity: '0.8', radius: 10, fillColor: 'lightblue', color: 'blue', width: 2, dashArray: '2,6' }).addTo(map1);

            //radar data uncertainty color: #"72aaa1" start time, "#f1eac8" end time, "#e5b9ad" location
            if (locationtype == 'approx') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 11, fillColor: '#e5b9ad', color: '#e5b9ad' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 13, fillColor: '#e5b9ad', color: '#e5b9ad' }).addTo(map1);
            }

            if (timestarttype == 'approx') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 14, fillColor: '#72aaa1', color: '#72aaa1' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 16, fillColor: '#72aaa1', color: '#72aaa1' }).addTo(map1);
            }

            if (timeendtype == 'approx') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 17, fillColor: '#f1eac8', color: '#f1eac8' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circleMarker(latlng, { fillOpacity: '0.5', radius: 19, fillColor: '#f1eac8', color: '#f1eac8' }).addTo(map1);
            }

            L.circleMarker(latlng, { opacity: '0.1', radius: 10, color: 'lightblue' }).bindPopup('prov: ' + (j + 1) + '/' + (n - 1)).addTo(map1);

            //var bondsZoom = map1.getBoundsZoom(latlngsList);
            //var bonds = map1.fitBounds(latlngsList);
            //console.log(bonds, bondsZoom)
        }

        //fit bounds

        //draw Polylines for each selected book
        //categorical color
        //var colorTones = ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600']
        //L.polyline(latlngsList, { color: colorTones[i], opacity: '0.8', width: '50' }).addTo(map2);
        //L.circleMarker(latlngsList, { opacity: '0.8', radius: 4, color: colorTones[i] }).addTo(map2);
    }
}


/////////////////////////////////////////////////////////////////////////////
//////////////////Pre request functions for drawing stb2/////////////////////

//StoryTelling Board-2 : add single story board (static)
/**
    d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes.json",
    function(data) {
        drawStb2(data);
    });
 */
function drawStb2(nodes, edges, selectedID) {
    //set container and basemap
    var stb2Container = d3.select('#Storyboard2-container')
        .append('div')
        .attr('id', 'stb2-container')
        .style('position', 'relative')
        .style('top', 0.5 * margin.top + "px")
        .style('left', 0.5 * margin.left + "px")
        .style('width', width2 + "px")
        .style('height', height2 + "px")
        .style('background-color', 'lightgrey')

    var map2 = L.map('stb2-container').setView([40, 16], 2.5)
    var basemap = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            maxZoom: 20,
            minZoom: 1,
        })
    basemap.addTo(map2);

    var leafletmap2Tab = document.getElementById('stb2-container');
    var observer = new MutationObserver(function() {
        if (leafletmap2Tab.style.display != 'none') {
            map2.invalidateSize();
        }
    });
    observer.observe(leafletmap2Tab, { attributes: true });

    // the nodes and edges
    var nodesForMap = Object.values(nodes)
        //console.log(nodesForMap)
        //var edgesForMap = edges
        //console.log(edgesForMap)

    // add on overlay on the leaflet basemap
    var EBnodesLayer = L.d3SvgOverlay(function(sel, proj) {
        var coor = [nodesForMap[0].y, nodesForMap[0].x]
            //console.log(coor)
        var coorMap = proj.latLngToLayerPoint(coor)
            //console.log(coorMap)

        var nodesUpd = sel.selectAll('circle').data(nodesForMap);

        nodesUpd.enter()
            .append('circle')
            //.attr('r',function(d){return Math.log2(d.population) - minLogPop + 2;})
            .attr('r', 6)
            .attr('cx', function(d) {
                //alert('yes');
                //console.log(proj.latLngToLayerPoint([+d.x, +d.y]));
                return proj.latLngToLayerPoint([+d.y, +d.x]).x;
            })
            .attr('cy', function(d) { return proj.latLngToLayerPoint([+d.y, +d.x]).y; })
            .attr('fill', 'lightblue')
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            //.attr('fill',function(d){return (d.place == 'city') ? "red" : "blue";});
    });
    var EBedgesLayer = L.d3SvgOverlay(function(sel, proj) {

        //console.log(nodes)
        //console.log(edges)
        //step size =  0.05
        var fbundling = d3.ForceEdgeBundling()
            .step_size(0.05)
            .compatibility_threshold(0.6)
            .nodes(nodes)
            .edges(edges);
        var results = fbundling();

        function getCurvePath(data) {
            curveList = []
            for (var i = 0; i < data.length; i++) {
                var eachpathdata = data[i]
                var eachcurve = d3.line()
                    .x(function(d) {
                        return proj.latLngToLayerPoint([+d.y, +d.x]).x;
                    })
                    .y(function(d) {
                        return proj.latLngToLayerPoint([+d.y, +d.x]).y;
                    })
                    .curve(d3.curveLinear);
                curveList.push(eachcurve(eachpathdata))
            }
            //console.log(curveList)
            return curveList
        }


        var EBPathList = []
        for (var i = 0; i < results.length; i++) {
            eachPath = [getCurvePath(results[i])]
            coorList = results[i].map(function(d) {
                    var projX = proj.latLngToLayerPoint([+d.y, +d.x]).x
                    var projY = proj.latLngToLayerPoint([+d.y, +d.x]).y
                    return [projX, projY]
                })
                //console.log(coorList)
                //console.log(eachPath)
            EBPathList.push(coorList)
                //EBPathList.push(eachPath)
        }
        //console.log(EBPathList)

        //draw all the EB edges

        var edgesUpd = sel.selectAll('path').data(results);

        edgesUpd.enter()
            .append("path")
            .attr("d", getCurvePath(results))
            .style("stroke-width", 1)
            .style("stroke", "#196363")
            .style("fill", "none")
            .style('stroke-opacity', 0.2);

    });

    var NormaledgesLayer = L.d3SvgOverlay(function(sel, proj) {
        var fbundling = d3.ForceEdgeBundling()
            .step_size(0)
            .compatibility_threshold(0.6)
            .nodes(nodes)
            .edges(edges);
        var results = fbundling();

        function getCurvePath(data) {
            curveList = []
            for (var i = 0; i < data.length; i++) {
                var eachpathdata = data[i]
                var eachcurve = d3.line()
                    .x(function(d) {
                        return proj.latLngToLayerPoint([+d.y, +d.x]).x;
                    })
                    .y(function(d) {
                        return proj.latLngToLayerPoint([+d.y, +d.x]).y;
                    })
                    .curve(d3.curveLinear);
                curveList.push(eachcurve(eachpathdata))
            }
            return curveList
        }

        var EBPathList = []
        for (var i = 0; i < results.length; i++) {
            eachPath = [getCurvePath(results[i])]
            coorList = results[i].map(function(d) {
                var projX = proj.latLngToLayerPoint([+d.y, +d.x]).x
                var projY = proj.latLngToLayerPoint([+d.y, +d.x]).y
                return [projX, projY]
            })

            EBPathList.push(coorList)
                //EBPathList.push(eachPath)
        }
        //console.log(EBPathList)

        //draw all the EB edges

        var edgesUpd = sel.selectAll('path').data(results);

        edgesUpd.enter()
            .append("path")
            .attr("d", getCurvePath(results))
            .style("stroke-width", 1)
            .style("stroke", "#196363")
            .style("fill", "none")
            .style('stroke-opacity', 0.2);

    });

    var circles = EBnodesLayer
    var paths = EBedgesLayer
    var normalpaths = NormaledgesLayer

    var Locations = L.layerGroup([circles]);
    var Paths_EB = L.layerGroup([paths, circles]);
    var Paths = L.layerGroup([normalpaths, circles]);

    //layerControl.addOverlay(Locations, "Locations");
    //layerControl.addOverlay(Paths, "Paths");
    //layerControl.addOverlay(Paths_EB, "Bundled Paths");
    //var overlays = { "Locations": Locations, "Paths": Paths, "Bundled Paths": Paths_EB };
    var overlays = { "Paths": Paths, "Bundled Paths": Paths_EB };
    var layerControl = L.control.layers(overlays).addTo(map2);


    //EBedgesLayer.addTo(map2);
    //EBnodesLayer.addTo(map2);
    ///
    ////////try to draw curves with L.polyline
    /** 
    var fbundling = d3.ForceEdgeBundling()
        .step_size(0)
        .compatibility_threshold(0.5)
        .nodes(nodes)
        .edges(edges);
    var results = fbundling();
    //console.log(results)
    for (i = 0; i < results.length; i++) {
        var coor = results[i].map(e => [e.y, e.x])
        console.log(coor)
        L.polyline(coor, { color: '#196363', opacity: '0.5', width: '3' }).addTo(map2);
    }

    //testCoor = results[0]
*/

    /*
        Promise.all([
            //d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"), //geojson 
            d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/edges.json"), //edges
            d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes.json"), //nodes
            //d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/edges_withID"), //edges
            //d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes_withID.json") //nodes

        ]).then(

            function(initialize) {

                var edges = initialize[0];
                var nodes = initialize[1];
                //var edges_withID = initialize[2];
                //var nodes_withID = initialize[3];

                nodesForMap = Object.values(nodes)
                console.log(nodesForMap)
                    //console.log(edges);
                    //console.log(nodes);

                EBLayer.addTo(map2);

            });
        */
    /////////////////



    //draw the whole journgey of selected books
    /*
    numOfBooks = IdList.length
    for (var i = 0; i < numOfBooks; i++) {
        var eachbookdata = data[IdList[i]]
        console.log(eachbookdata)
        var eachbooklon = JSON.parse(eachbookdata.locationLonFilled.replace(/NoInfo/g, null))
        var eachbooklat = JSON.parse(eachbookdata.locationLatFilled.replace(/NoInfo/g, null))
        var eachbookTimeStart = JSON.parse(eachbookdata.timeStartFilled.replace(/NoInfo/g, null))
        var eachbookTimeEnd = JSON.parse(eachbookdata.timeEndFilled.replace(/NoInfo/g, null))
        var eachbookTimeStartType = eachbookdata.startType.substr(1, eachbookdata.startType.length - 2).split(",")
        console.log(eachbookTimeStartType)
        var eachbookTimeEndType = eachbookdata.endType.substr(1, eachbookdata.endType.length - 2).split(",")
        console.log(eachbookTimeEndType)
        var eachbookLocationType = eachbookdata.locationType.substr(1, eachbookdata.locationType.length - 2).split(",")
        console.log(eachbookLocationType)
        var n = eachbookdata.NumOfProv
        var latlngsList = []
        for (var j = 0; j < n; j++) {
            var latlng = [eachbooklat[j], eachbooklon[j]]
            var timestrat = eachbookTimeStart[j]
            var timestarttype = eachbookTimeStartType[j] //accurate, approx, NoInfo
            var timeend = eachbookTimeEnd[j]
            var timeendtype = eachbookTimeEndType[j]
            var locationtype = eachbookLocationType[j]
            latlngsList.push(latlng)
                //draw circles
            if (locationtype == 'approx') {
                L.circle(latlng, { fillOpacity: '0.7', radius: 30, fillColor: '#3f424c' }).addTo(map2);
            } else if (locationtype == 'NoInfo') {
                L.circle(latlng, { fillOpacity: '0.5', radius: 20, fillColor: '#3f424c' }).addTo(map2);
            }

            if (timestarttype == 'approx') {
                L.circle(latlng, { fillOpacity: '0.7', radius: 300, fillColor: '#124c43' }).addTo(map2);
            } else if (locationtype == 'NoInfo') {
                L.circle(latlng, { fillOpacity: '0.5', radius: 200, fillColor: '#124c43' }).addTo(map2);
            }

            if (timeendtype == 'approx') {
                L.circleMarker(latlng, { opacity: '0.7', radius: 30, color: '#ff764d' }).addTo(map2);
            } else if (locationtype == 'NoInfo') {
                L.circleMarker(latlng, { opacity: '0.5', radius: 20, color: '#ff764d' }).addTo(map2);
            }

            L.circleMarker(latlng, { opacity: '0.2', radius: 10, color: 'black' }).bindPopup('prov: ' + (j + 1) + '/' + n).addTo(map2);
        }
        console.log(latlngsList)

        //draw Polylines for each selected book
        //categorical color
        var colorTones = ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600']
        L.polyline(latlngsList, { color: colorTones[i], opacity: '0.8', width: '50' }).addTo(map2);
        //L.circleMarker(latlngsList, { opacity: '0.8', radius: 4, color: colorTones[i] }).addTo(map2);

        //... add more attr
        //console.log(eachbooklat)

    }
    */
}



//StoryTelling Board-3 : add single story board (animated)

var map3Container = d3.select('#Storyboard3-container')
    .append('div')
    .attr('id', 'map3-container')
    //.style('position', 'absolute')
    .style('top', 0.5 * margin.top + "px")
    .style('left', 0.5 * margin.left + "px")
    .style('width', width2 + "px")
    .style('height', height2 + "px")
    .style('background-color', 'lightblue')

//adjust to center
var leafletmap3Tab = document.getElementById('map3-container');
var observer = new MutationObserver(function() {
    if (leafletmap3Tab.style.display != 'none') {
        map3.invalidateSize();
    }
});
observer.observe(leafletmap3Tab, { attributes: true });
//const map = L.map('map-container').setView([40, 16], 2); // center position + zoom

var grayscale = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        maxZoom: 20,
        minZoom: 3,
    });
var colorscale = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 20,
        minZoom: 3,
    });
var map3 = L.map('map3-container', {
    center: [40, 16],
    //center: [40, 16] geo-coordinator of Florence
    zoom: 5,
    layers: [grayscale, colorscale],
    fullscreenControl: true,
    // OR
    fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
    }
});

//add ctl panel of the two base maps
var baseMaps = {
    "Grayscale": grayscale,
    "Colorscale": colorscale
};

var layerControl = L.control.layers(baseMaps).addTo(map3);

//Test Geojson:
//var testID = ["02141553", "02141122"]
//strat[1481, 1481, 1481, 1743, 1815, 1821, 1821, 1839, 1849, 1884, 1884, 1891, 1891, 1894, 1903, 1924]
//end  [1481, 1550, 1550, 1815, 1821, 1821, 1839, 1849, 1884, 1884, 1891, 1891, 1894, 1903, 1924, 2021]"
//lan[43.77925, 43.77925, 43.77925, 51.50853, 52.28107, 51.50853, 52.03127, 51.50853, 51.50853, 51.50853, 51.50853, 51.50853, 40.85216, 55.63594, 40.71427, 40.71427]
//lng[11.24626, 11.24626, 11.24626, -0.12574, -1.00095, -0.12574, -1.01815, -0.12574, -0.12574, -0.12574, -0.12574, -0.12574, 14.26811, -3.46807, -74.00597, -74.00597]

//start "[1481, 1486, 1501, 1700, 1768, 1775]"
//end "[1481, 1560, 1800, 1763, 1775, 2021]"
//lan "[43.77925, 43.77925, 43.77925, 51.05089, 51.05089, 51.05089]"
//lng "[11.24626, 11.24626, 11.24626, 13.73832, 13.73832, 13.73832]"
var path = {
    type: "FeatureCollection",
    features: [{
            type: "Feature",
            properties: {
                start: "1481-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "LineString",
                coordinates: [
                    [11.24626, 43.77925],
                    [11.24626, 43.77925],
                    [11.24626, 43.77925],
                    [-0.12574, 51.50853],
                    [-1.00095, 52.28107],
                    [-0.12574, 51.50853],
                    [-1.01815, 52.03127],
                    [-0.12574, 51.50853],
                    [-0.12574, 51.50853],
                    [-0.12574, 51.50853],
                    [-0.12574, 51.50853],
                    [-0.12574, 51.50853],
                    [14.26811, 40.85216],
                    [-3.46807, 55.63594],
                    [-74.00597, 40.71427],
                    [-74.00597, 40.71427],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1481-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "LineString",
                coordinates: [
                    [11.24626, 43.77925],
                    [11.24626, 43.77925],
                    [11.24626, 43.77925],
                    [13.73832, 51.05089],
                    [13.73832, 51.05089],
                    [13.73832, 51.05089],
                ],
            },
        },
    ],
};

var points = {
    type: "FeatureCollection",
    features: [{
            type: "Feature",
            properties: {
                start: "1481-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [11.24626, 43.77925],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1743-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1815-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-1.00095, 52.28107],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1821-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1821-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-1.01815, 52.03127],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1839-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1849-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1884-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1884-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1891-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-0.12574, 51.50853],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1891-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [14.26811, 40.85216],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1894-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-3.46807, 55.63594],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1903-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-74.00597, 40.71427],
            },
        },
        {
            type: "Feature",
            properties: {
                start: "1924-01-01",
                end: "2021-12-31",
            },
            geometry: {
                type: "Point",
                coordinates: [-74.00597, 40.71427],
            },
        },
    ],
};

var slider = L.timelineSliderControl({
    formatOutput: function(date) {
        return moment(date).format("YYYY");
    },
});
map3.addControl(slider);


var pathStyle = {
    "color": "#827e7a",
    "weight": 10,
    "opacity": 0.65
};
var pathTimeline = L.timeline(path, { style: pathStyle });
pathTimeline.addTo(map3);

var pointTimeline = L.timeline(points);
pointTimeline.addTo(map3);
//
/*
for (var i = 0; i < points.length; i++) {
    var data = points.features[i]
    console.log(data)

    var circleTimeline = L.timeline(data, {
        getInterval: function(data) {
            return {
                start: data.properties.start,
                end: data.properties.end
            };
        },
        circleToLayer: function(data) {
            var latlng = data.geometry.coordinates
            return L.circleMarker(latlng, {
                radius: 10,
                color: "blue",
                fillColor: "lightblue",
            }).bindPopup(
                'The prov is: ' + (i + 1) + ' / ' + points.length + ' :)'
            );
        }
    })
    slider.addTimelines(circleTimeline);
}
*/
/*
var circleTimeline = L.timeline(points, {
    
    pointToLayer: function(points) {
        var latlng = data.geometry.coordinates
        return L.circleMarker(latlng, {
            radius: 10,
            color: "blue",
            fillColor: "lightblue",
        }).bindPopup(
            'The prov is: ' + (i + 1) + ' / ' + points.length + ' :)'
        );
    }
})
slider.addTimelines(circleTimeline);
*/

slider.addTimelines(pathTimeline, pointTimeline);





//update function
function updateSTB(testID) {
    // append the svg object to the body of the page
    d3.selectAll('#stb1TableBody').remove();
    d3.selectAll('#stb2-container').remove();

    d3.select('#stb1Table')
        .append('tbody')
        .attr('id', 'stb1TableBody')

    d3.select('#Storyboard2-container')
        .append('div')
        .attr('id', 'stb2-container')
        .style('position', 'relative')
        .style('top', 0.5 * margin.top + "px")
        .style('left', 0.5 * margin.left + "px")
        .style('width', width2 + "px")
        .style('height', height2 + "px")
        .style('background-color', 'lightgrey')


    Promise.all([
        d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
        d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes.json"),
        d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/edges.json"),
    ]).then(
        function(initialize) {
            let dante = initialize[0]
            console.log(dante)
            console.log(testID)
            let EBnodes = initialize[1]
            let EBedges = initialize[2]
            console.log(EBnodes)
            console.log(EBedges)

            if (testID[0] == "None") {
                alert("No book is selected : (")
            } else {
                var IDList = testID.map(x => '0'.repeat(8 - x.length) + x);
                //var IDList = testID.map(x => '0' + x);
                //console.log(IDList)

                var danteObj = {}
                dante.forEach((element, index) => {
                        danteObj[element.Id] = element
                    })
                    //console.log(dante.length)
                    //console.log(Object.keys(danteObj).length)


                var subdata = generateTableSubset(danteObj, IDList)
                var danteSub = subdata.Arr
                var danteObjSub = subdata.Obj


                drawStb1(danteSub)
                drawStb2(EBnodes, EBedges, testID)
            }

        })
}