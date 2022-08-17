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

Promise.all([
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
]).then(
    function(initialize) {
        let dante = initialize[0]
        console.log(dante)
        var danteObj = {}
        dante.forEach((element, index) => {
                danteObj[element.Id] = element
            })
            //console.log(dante.length)
            //console.log(Object.keys(danteObj).length)
        var subdata = generateTableSubset(danteObj, testID)
        var danteSub = subdata.Arr
        var danteObjSub = subdata.Obj

        drawStb1(danteSub)
        drawStb2(danteObjSub, testID)

        //console.log(dante[0].NumOfProv)
        //drawLeafletMap(Dantedata, PathStartEnd, initialLeafletMap);
    })

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
        stb1TableHTML += ' <tr><th scope="row" style="width:' + (0.005 * width2) + 'px">' + (i + 1) + '</th><td><div id="book-' + (i + 1) + '-stat" style="width:' + (0.075 * width2) + 'px"><p>' + data[i].Id + '</p><div class="radar"></div></div>' + '</td><td><div id="book-' + (i + 1) + '"' + ' class="outer-box" style="width:' + (0.9 * width2) + 'px"></div></td></tr>'

        stb1Table.innerHTML = stb1TableHTML
    }

    for (var i = 0; i < totalNumberOfBooks; i++) {
        $('#book-' + (i + 1)).append($('<div/>', { 'id': 'book-' + (i + 1) + '-inner', 'class': 'inner-box', 'height': height2 / 3 }))
            //var NumberOfProvs = dante[i].length
        var eachbookdata = data[i]
        var eachbooklon = JSON.parse(eachbookdata.locationLonFilled.replace(/NoInfo/g, null))
        var eachbooklat = JSON.parse(eachbookdata.locationLatFilled.replace(/NoInfo/g, null))
        var eachbookTimeStart = JSON.parse(eachbookdata.timeStartFilled.replace(/NoInfo/g, null))
        var eachbookTimeEnd = JSON.parse(eachbookdata.timeEndFilled.replace(/NoInfo/g, null))
            //data completeness of each book
        var eachbookTimeStartType = eachbookdata.startType.substr(1, eachbookdata.startType.length - 2).split(",")
        var eachbookTimeEndType = eachbookdata.endType.substr(1, eachbookdata.endType.length - 2).split(",")
        var eachbookLocationType = eachbookdata.locationType.substr(1, eachbookdata.locationType.length - 2).split(",")
        var n = eachbookdata.NumOfProv
        var latlngsList = [
                [43.77925, 11.24626]
            ]
            /*
            var circlesList = [
                [43.77925, 11.24626]
            ]
            */
        for (var j = 0; j < n - 1; j++) {
            //initial each base map
            $('#book-' + (i + 1) + '-inner').append($('<div/>', { 'id': 'book' + (i + 1) + 'prov' + j, 'width': height2 / 2, 'height': height2 / 3 }))

            var leafletmap1Tab = document.getElementById('book' + (i + 1) + 'prov' + j);
            var observer = new MutationObserver(function() {
                if (leafletmap1Tab.style.display != 'none') {
                    map1.invalidateSize();
                }
            });
            observer.observe(leafletmap1Tab, { attributes: true });

            var map1 = L.map('book' + (i + 1) + 'prov' + j).setView([40, 16], 2)
            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                    maxZoom: 10,
                    minZoom: 2,
                }).addTo(map1);

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
            L.polyline(latlngsList, { color: '#003f5c', opacity: '0.9', width: '20' }).addTo(map1);
            // draw line for the next provenance
            L.polyline(nextlatlngList, { color: '#ef5675', opacity: '0.5', width: '100' }).addTo(map1);

            //draw past circles
            latlngsList.forEach(function(coord) {
                var circle = L.circle(coord, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 5
                }).addTo(map1);
            });
            //draw next circle
            if (locationtype == 'approx') {
                L.circle(latlng, { fillOpacity: '0.7', radius: 30, fillColor: '#3f424c' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circle(latlng, { fillOpacity: '0.5', radius: 20, fillColor: '#3f424c' }).addTo(map1);
            }

            if (timestarttype == 'approx') {
                L.circle(latlng, { fillOpacity: '0.7', radius: 300, fillColor: '#124c43' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circle(latlng, { fillOpacity: '0.5', radius: 200, fillColor: '#124c43' }).addTo(map1);
            }

            if (timeendtype == 'approx') {
                L.circleMarker(latlng, { opacity: '0.7', radius: 30, color: '#ff764d' }).addTo(map1);
            } else if (locationtype == 'NoInfo') {
                L.circleMarker(latlng, { opacity: '0.5', radius: 20, color: '#ff764d' }).addTo(map1);
            }

            L.circleMarker(latlng, { opacity: '0.4', radius: 10, color: 'black' }).bindPopup('prov: ' + (j + 1) + '/' + (n - 1)).addTo(map1);




            var bondsZoom = map1.getBoundsZoom(latlngsList);
            var bonds = map1.fitBounds(latlngsList);
            console.log(bonds, bondsZoom)
        }

        //fit bounds

        //draw Polylines for each selected book
        //categorical color
        //var colorTones = ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600']
        //L.polyline(latlngsList, { color: colorTones[i], opacity: '0.8', width: '50' }).addTo(map2);
        //L.circleMarker(latlngsList, { opacity: '0.8', radius: 4, color: colorTones[i] }).addTo(map2);
    }
}






//StoryTelling Board-2 : add single story board (static)

var stb2Container = d3.select('#Storyboard2-container')
    .append('div')
    .attr('id', 'stb2-container')
    .style('position', 'relative')
    .style('top', 0.5 * margin.top + "px")
    .style('left', 0.5 * margin.left + "px")
    .style('width', width2 + "px")
    .style('height', height2 + "px")
    .style('background-color', 'lightgrey')

function drawStb2(data, IdList) {
    //set container and basemap
    var map2 = L.map('stb2-container').setView([40, 16], 5)
    L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            maxZoom: 20,
            minZoom: 3,
        }).addTo(map2);
    var leafletmap2Tab = document.getElementById('stb2-container');
    var observer = new MutationObserver(function() {
        if (leafletmap2Tab.style.display != 'none') {
            map2.invalidateSize();
        }
    });
    observer.observe(leafletmap2Tab, { attributes: true });

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
    ]).then(
        function(initialize) {
            let dante = initialize[0]
            console.log(dante)
            console.log(testID)

            if (testID[0] == "None") {
                alert("No book is selected : (")
            } else {
                //var IDList = testID.map(x => '0'.repeat(8 - x.length()) + x);
                var IDList = testID.map(x => '0' + x);
                console.log(IDList);

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
                drawStb2(danteObjSub, IDList)
            }

        })
}