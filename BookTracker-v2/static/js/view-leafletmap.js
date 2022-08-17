//Leaflet Map

// mapid is the id of the div where the map will appear
function initialLeafletMap(mapid, copyid, latlngs_data, end_point) {

    //invalidate size
    var leafletmapTab = document.getElementById('leafletmap');
    var observer = new MutationObserver(function() {
        if (leafletmapTab.style.display != 'none') {
            map.invalidateSize();
        }
    });
    observer.observe(leafletmapTab, { attributes: true });


    //const map = L.map(mapid).setView([40, 16], 2); // center position + zoom
    grayscale = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            maxZoom: 20,
            minZoom: 1.5,
        });
    colorscale = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 20,
            minZoom: 1.5,
        });
    var map = L.map(mapid, {
        center: [40, 16],
        //center: [40, 16] geo-coordinator of Florence
        zoom: 2,
        layers: [grayscale, colorscale],
        fullscreenControl: true,
        // OR
        fullscreenControl: {
            pseudoFullscreen: false // if true, fullscreen to page width and height
        }
    });

    //var polyline = L.polyline(latlngs_data, { color: 'lightblue', opacity: '0.5', width: '2' }).addTo(map);
    // zoom the map to the polyline
    //map.fitBounds(polyline.getBounds());
    //give each book record a group layer
    var EachBook = [];
    for (var i = 0; i < copyid.length; i++) {
        EachBook.push({ 'label': copyid[i], 'layer': [] })
    }
    console.log(EachBook)
        //
    var mkArray = []; //End Point Markers Layer Group
    for (var i = 0; i < end_point.length; i++) {
        mkArray.push(L.circleMarker(end_point[i], { opacity: '0.6', radius: 10, color: 'purple' }).bindPopup('ID: ' + copyid[i]));
        //push to the enach book layer group
        EachBook[i]['layer'].push(L.circleMarker(end_point[i], { opacity: '0.6', radius: 10, color: 'purple' }).bindPopup('ID: ' + copyid[i]))
    }

    var middlemkArray = []; //Middle Point Markers Layer Group 
    var middlemkcolorArray = [] //Middle Point Markers with categorical color Layer Group
    var middlemkgradientArray = [] //Middle Point Markers with categorical & gradient color Layer Group
    var plArray = []; //Basic Polyline Layer Group
    var plColorArray = []; //Categorical Polyline Layer Group
    var pldecorArray = []; //Arrow Polyline Decor Layer Group
    var movingmkArray = []; //Moving Marker Layer Group
    var polycolor = [];


    for (var i = 0; i < latlngs_data.length; i++) {
        //gradient color array 13 level:
        /*
        var Red = ['#ffdbdb', '#f7c5c5', '#f0afb0', '#e89b9c', '#e18789', '#d97478', '#d16367', '#ca5258', '#c24349', '#bb343c', '#b32630', '#ac1a24', '#a40e1a']
        var Orange = ['#ffeee2', '#fce4d3', '#f9dac5', '#f6d1b7', '#f3c7a9', '#f0be9b', '#edb58e', '#eaac81', '#e7a374', '#e49a68', '#e1925b', '#de8950', '#db8144']
        var Yellow = ['#fcfade', '#faf6cf', '#f7f3c1', '#f5efb2', '#f2eba4', '#f0e797', '#ede289', '#ebde7c', '#e9d96f', '#e6d562', '#e4d055', '#e1cb49', '#dfc63d']
        var Green = ['#e2fce6', '#d3f5d7', '#c5eec8', '#b8e7b8', '#addfab', '#a3d89e', '#9ad192', '#93ca86', '#8cc37b', '#85bb70', '#80b466', '#7bad5c', '#76a653']
        var Blue = ['#dff2fd', '#cee8f7', '#bddef1', '#add4ec', '#9dcae6', '#8ec1e0', '#80b7da', '#72aed5', '#65a5cf', '#589cc9', '#4c93c4', '#408abe', '#3582b8']
        var Purple = ['#e3e3ff', '#d1d0f2', '#bfbde6', '#afacd9', '#a09bcd', '#928bc0', '#847cb4', '#786ea7', '#6c609a', '#61548e', '#564881', '#4c3d75', '#433368']
        var colorMatrix = [Red, Orange, Yellow, Green, Blue, Purple]
        */
        //gradient color array 5 level:
        var Red = ['#ffdbdb', '#e89b9c', '#d16367', '#bb343c', '#a40e1a']
        var Orange = ['#ffeee2', '#f6d1b7', '#edb58e', '#e49a68', '#db8144']
        var Yellow = ['#fcfade', '#f5efb2', '#ede289', '#e6d562', '#dfc63d']
        var Green = ['#e2fce6', '#b8e7b8', '#9ad192', '#85bb70', '#76a653']
        var Blue = ['#dff2fd', '#add4ec', '#80b7da', '#589cc9', '#3582b8']
        var Purple = ['#e3e3ff', '#afacd9', '#847cb4', '#61548e', '#433368']
        var colorMatrix = [Red.reverse(), Blue.reverse(), Yellow.reverse(), Purple.reverse(), Orange.reverse(), Green.reverse()]


        var colorstart = ['#ffdbdb', '#ffeee2', '#fcfade', '#e2fce6', '#dff2fd', '#e3e3ff']
        var colorend = ['#a40e1a', '#db8144', '#dfc63d', '#76a653', '#3582b8', '#433368']
        var gradientcolor = []

        //var ColorTones = ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'] //Pastel
        var ColorTones = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#fdb462', '#b3de69', '#fccde5']
            //var coloruse = ColorTones[i % 5]
        var coloruse = ColorTones[i % ColorTones.length]
        for (var j = 0; j < latlngs_data[i].length; j++) {
            middlemkArray.push(L.circleMarker(latlngs_data[i][j], { opacity: '0.4', radius: 4, color: 'purple' }).bindPopup('ID: ' + copyid[i]));
            middlemkcolorArray.push(L.circleMarker(latlngs_data[i][j], { opacity: '0.4', radius: 4, color: coloruse }).bindPopup('ID: ' + copyid[i]))
            EachBook[i]['layer'].push(L.circleMarker(latlngs_data[i][j], { opacity: '0.4', radius: 4, color: 'purple' }).bindPopup('ID: ' + copyid[i]));
        }

        //gradient color
        var leafletPolycolor = require('leaflet-polycolor'); //LeafletPolycolor API
        leafletPolycolor.default(L); //LeafletPolycolor API

        var color_id = i % 6


        for (var j = 0; j < latlngs_data[i].length; j++) {
            inner_color_index = Math.floor(j * 5 / latlngs_data[i].length)
            gradientcolor.push(colorMatrix[color_id][inner_color_index])
                //gradientcolor = gradientcolor.concat([colorstart[color_id]]).concat(Array(latlngs_data[i].length - 2).fill(null)).concat([colorend[color_id]])
            middlemkgradientArray.push(L.circleMarker(latlngs_data[i][j], { opacity: '0.4', radius: 4, color: colorMatrix[color_id][inner_color_index] }).bindPopup('ID: ' + copyid[i]))

        }
        //console.log(gradientcolor)
        polycolor.push(L.polycolor(latlngs_data[i], {
            colors: gradientcolor,
            weight: 2.5
        }));

        EachBook[i]['layer'].push(L.polycolor(latlngs_data[i], {
            colors: gradientcolor,
            weight: 2.5
        }));

        //solid and categorical color
        plArray.push(L.polyline(latlngs_data[i], { color: 'purple', opacity: '0.5', width: '3', className: 'mypolyline' + copyid[i] }));
        plColorArray.push(L.polyline(latlngs_data[i], { color: coloruse, opacity: '0.9', width: '2.5', className: 'mypolyline' + copyid[i] }));


        //EachBook[i]['layer'].push(L.polyline(latlngs_data[i], { color: coloruse, opacity: '0.5', width: '2.5', className: 'mypolyline' + copyid[i] }));

        pldecorArray.push(L.polylineDecorator(latlngs_data[i], {
            patterns: [
                { offset: 25, repeat: 30, symbol: L.Symbol.arrowHead({ pixelSize: 7, pathOptions: { color: '#666666', fillOpacity: 0.9, weight: 0 } }) }
            ]
        }));
        if (latlngs_data[i].length == 1) {
            movingmkArray.push(L.Marker.movingMarker([latlngs_data[i][0], latlngs_data[i][0]], Array(latlngs_data[i].length).fill(10000 / (latlngs_data[i].length)), { autostart: true, loop: true }));
            EachBook[i]['layer'].push(L.Marker.movingMarker([latlngs_data[i][0], latlngs_data[i][0]], Array(latlngs_data[i].length).fill(10000 / (latlngs_data[i].length)), { autostart: true, loop: true }));
        } else {
            movingmkArray.push(L.Marker.movingMarker(latlngs_data[i], Array(latlngs_data[i].length - 1).fill(10000 / (latlngs_data[i].length - 1)), { autostart: true, loop: true }));
            EachBook[i]['layer'].push(L.Marker.movingMarker(latlngs_data[i], Array(latlngs_data[i].length - 1).fill(10000 / (latlngs_data[i].length - 1)), { autostart: true, loop: true }));
        }
    }
    //console.log(movingmkArray)

    var markers = L.layerGroup(mkArray);
    var middlemk = L.layerGroup(middlemkArray);
    var middlemkcolor = L.layerGroup(middlemkcolorArray)
    var middlemkgradient = L.layerGroup(middlemkgradientArray)
    var polylines = L.layerGroup(plArray);
    var polylinescolor = L.layerGroup(plColorArray);
    var pldecor = L.layerGroup(pldecorArray);
    var movingmk = L.layerGroup(movingmkArray);
    var polylinegradientcolor = L.layerGroup(polycolor)


    /*Previous Control
        var baseMaps = {
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Grayscale</span>": grayscale,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Colorscale</span>": colorscale
        };

        var overlayMaps = {
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>End-points</span>": markers,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Middle-points</span>": middlemk,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Paths</span>": polylines,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Paths-coloured</span>": polylinescolor,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>Direction</span>": pldecor,
            "<span style='color: grey; position: relative; top:0.75rem; left:0.75rem; padding: 0.75rem;'>MovingMarker</span>": movingmk,
        };
    */


    //collapes control panel
    var baseTree = {
        label: "<span style='color: black; position: relative; top:0.3rem; left:0.75rem; padding: 0.75rem;'>Base Map</span>",
        //noShow: true,
        children: [{
                label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding: 0.75rem;'>Grayscale</span>",
                layer: grayscale,
            },
            {
                label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding: 0.75rem;'>Colorscale</span>",
                layer: colorscale,
            },
        ]
    };
    var ctl = L.control.layers.tree(baseTree, null, {
        namedToggle: true,
        collapseAll: '------- Collapse All -------',
        expandAll: '------- Expand  All --------',
        collapsed: false,
    });

    ctl.addTo(map).collapseTree().expandSelected();

    //Over Layer
    for (var i = 0; i < EachBook.length; i++) {
        EachBook[i]['label'] = "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding: 0.75rem;'>" + EachBook[i]['label'] + "</span>"
        EachBook[i]['layer'] = L.layerGroup(EachBook[i]['layer'])
    }

    var hasAllUnSelected = function() {
        return function(ev, domNode, treeNode, map) {
            var anySelected = false;

            function iterate(node) {
                if (node.layer && !node.radioGroup) {
                    anySelected = anySelected || map.hasLayer(node.layer);
                }
                if (node.children && !anySelected) {
                    node.children.forEach(function(element) { iterate(element); });
                }
            }
            iterate(treeNode);
            return !anySelected;
        };
    };

    var OverLayer = [{
            label: "<span style='color: black; position: relative; top:0.3rem; left:0.75rem; padding: 0.75rem;'>Polylines</span>",
            selectAllCheckbox: true,
            children: [
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Solid Color</span>", layer: polylines },
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Categorical Color</span>", layer: polylinescolor },
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Gradient Color</span>", layer: polylinegradientcolor },
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>W/O Arrow</span>", layer: pldecor },
            ]
        },
        {
            label: "<span style='color: black; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Marker</span>",
            selectAllCheckbox: true,
            children: [
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Moving Marker</span>", layer: movingmk },
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Starting Point</span>", layer: L.circleMarker(latlngs_data[0][0], { opacity: '0.9', radius: 6, color: 'purple' }) },
                { label: "<span style='color: #666; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Ending Point</span>", layer: markers },
                {
                    label: "<span style='color: #666; position: relative; top:0.3rem; left:0.5rem; padding-left: 0.5rem;'>Passing Point</span>",
                    selectAllCheckbox: true,
                    children: [
                        { label: "<span style='color: #888; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Solid Color</span>", layer: middlemk },
                        { label: "<span style='color: #888; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Categorical Color</span>", layer: middlemkcolor },
                        { label: "<span style='color: #888; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Gradient Color</span>", layer: middlemkgradient }
                    ]
                }
            ]
        },
        {
            label: "<span style='color: black; position: relative; top:0.3rem; left:0.75rem; padding-left: 0.75rem;'>Highlight Books</span>",
            selectAllCheckbox: true,
            children: EachBook,
        }
    ];

    //
    //L.control.layers(baseMaps, overlayMaps).addTo(map);

    ctl.setOverlayTree(OverLayer).collapseTree(true).expandSelected(true);


}

function drawLeafletMap(Dantedata, PathStartEnd, initialLeafletMap) {
    let alllatlang = []
    let Id = []
    let allendpoints = []
    for (var i = 0; i < Dantedata.length; i++) {
        //Dantedata.forEach(function(row, i) {
        //console.log(i) //show the index
        //const bookId = row.Id
        //const lon = JSON.parse(row.locationLonFilled.replace(/NoInfo/g, null))
        //const lat = JSON.parse(row.locationLatFilled.replace(/NoInfo/g, null))
        const bookId = Dantedata[i].Id
        const lon = JSON.parse(Dantedata[i].locationLonFilled.replace(/NoInfo/g, null))
        const lat = JSON.parse(Dantedata[i].locationLatFilled.replace(/NoInfo/g, null))
        const endpoint = { lat: PathStartEnd[i].end_lat, lon: PathStartEnd[i].end_lon }


        var latlang = []
        var eachlatlang = []
        for (var j = 0; j < lon.length; j++) {
            //console.log(j)
            eachlatlang = [lat[j], lon[j]]
            latlang.push(eachlatlang)
        }
        //console.log(latlang)
        alllatlang.push(latlang)
            //console.log(alllatlang)
        Id.push(bookId)
        allendpoints.push(endpoint)
            //})
    }
    console.log(alllatlang)
    console.log(Id)
    console.log(allendpoints)
    initialLeafletMap('leafletmap', Id, alllatlang, allendpoints)
}



//Call data to initialize the leaflet map
Promise.all([
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv"), // Position of example circles
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_provpath_new.csv"),
    //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
]).then(
    function(initialize) {
        let Dantedata = initialize[0]
        let ProvPath = initialize[1]
        let PathStartEnd = initialize[2]
            //console.log(Dantedata)
            //console.log(ProvPath)
            //console.log(PathStartEnd)

        drawLeafletMap(Dantedata, PathStartEnd, initialLeafletMap);
    })