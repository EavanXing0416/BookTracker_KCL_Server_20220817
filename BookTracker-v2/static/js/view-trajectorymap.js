//Initial Base Map
let width_map = document.querySelector('#map svg').clientWidth;
let height_map = document.querySelector('#map svg').clientHeight;


//zoom functions:
/* Old Zoom
let zoom = d3.zoom()
    .scaleExtent([-1, 2])
    //.translateExtent([
    //    [0, 0],
    //    [width_map, height_map]
    //])
    .on('zoom', handleZoom);

function handleZoom(e) {
    d3.selectAll('#map svg g')
        .attr('transform', e.transform);
}

function initZoom() {
    d3.select('#map svg')
        .call(zoom);
}

initZoom();
d3.select("#map svg").call(zoom.transform, d3.zoomIdentity.scale(1).translate(0, 0));
*/

//New Zoom
let zoom = d3.zoom()
    .scaleExtent([0.25, 10])
    .on('zoom', handleZoom);

function initZoom() {
    d3.select('#map svg')
        .call(zoom);
}

function handleZoom(e) {
    d3.selectAll('#map svg g')
        .attr('transform', e.transform);
}

function zoomIn() {
    d3.select('#map svg')
        .transition()
        .call(zoom.scaleBy, 2);
}

function zoomOut() {
    d3.select('#map svg')
        .transition()
        .call(zoom.scaleBy, 0.5);
}

function resetZoom() {
    d3.select('#map svg')
        .transition()
        .call(zoom.scaleTo, 1);
}

function center() {
    d3.select('#map svg')
        .transition()
        .call(zoom.translateTo, 0.5 * width_map, 0.5 * height_map);
}

function panLeft() {
    d3.select('#map svg')
        .transition()
        .call(zoom.translateBy, -50, 0);
}

function panRight() {
    d3.select('#map svg')
        .transition()
        .call(zoom.translateBy, 50, 0);
}

initZoom();
//


//projections:
const projection = d3.geoMercator() //other projections: geoNaturalEarth1(), geoMercator()--same as leaflet,geoEquirectangular()
    .scale(110)
    .translate([height_map / 2, height_map / 2])
    .center([0, 35]);

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

//Select Dante Data based on certain ids (not using in this file)
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
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_flat.csv"),
    //d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv"),
]).then(

    function(initialize) {
        let Dantedata = initialize[0]
        let Danteprov = initialize[1]
        let Flat = initialize[2]
        let Danteprov_area = Danteprov.map(d => [d['area1'], d['area2']])
        let Danteprov_place = Danteprov.map(d => [d['place1'], d['place2']])
            //console.log(Danteprov_area)
            //console.log(Danteprov_place)
            //console.log(groupArraybyLocation(Danteprov_area));
            //console.log(groupArraybyLocation(Danteprov_place));
        drawChordDiagramOnCountry(groupArraybyLocation(Danteprov_area))
        drawChordDiagramOnCity(groupArraybyLocation(Danteprov_place))

        //creat table for all copies
        createTable(Dantedata, Flat);

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