//projections:
let width_map = document.querySelector('#FDEB-container svg').clientWidth;
console.log(width_map);
let height_map = document.querySelector('#FDEB-container svg').clientHeight;
console.log(height_map);

const projection = d3.geoEquirectangular() //other projections: geoNaturalEarth1()
    .scale(130)
    .translate([width_map / 2, height_map / 2])
    .center([0, 0]);

const geoGenerator = d3.geoPath()
    .projection(projection);

//zoom functions:
let zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([
        [0, 0],
        [width_map, height_map]
    ])
    .on('zoom', handleZoom);

function handleZoom(e) {
    d3.selectAll('#FDEB-container svg g')
        .attr('transform', e.transform);
}

function initZoom() {
    d3.select('#FDEB-container svg')
        .call(zoom);
}

initZoom();

//Import the example data
Promise.all([
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"), //geojson 
    d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/edges.json"), //edges
    d3.json("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/nodes.json") //nodes
]).then(

    function(initialize) {
        var geojson = initialize[0];
        var edges = initialize[1];
        var nodes = initialize[2];
        //console.log(edges);
        console.log(nodes);

        //using geo projection
        projectionNodes(projection, nodes)
        console.log(nodes)

        var svg = d3.select("#FDEB-container svg .nodes_edges");

        drawBasemap(geojson);

        drawEdges(svg, edges, nodes);
        drawNodes(svg, nodes);

    }
)

function projectionNodes(projection, nodes) {
    for (var i = 0; i < Object.keys(nodes).length; i++) {
        var projectionLonLat = projection([nodes[i].x, nodes[i].y])
        nodes[i].x = projectionLonLat[0]
        nodes[i].y = projectionLonLat[1]
    }
}

function drawNodes(svg, nodes) {
    for (var i = 0; i < Object.keys(nodes).length; i++) {
        //console.log(nodes[i]);
        svg.append("circle")
            .attr("cx", nodes[i].x)
            .attr("cy", nodes[i].y)
            .attr("r", 1.5)
            .style("fill", "#ffee00")
            .style("fill-opacity", 0.5);
    }
}

function drawEdges(svg, edges, nodes) {
    //Run the FDEB algorithm using nodes and edgesn data
    var fbundling = d3.ForceEdgeBundling()
        .step_size(0.1)
        .compatibility_threshold(0.2)
        .nodes(nodes)
        .edges(edges);
    var results = fbundling();
    //Define d3line to draw curves
    var d3line = d3.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .curve(d3.curveLinear);

    for (var i = 0; i < results.length; i++) {
        //console.log(d3line(results[i]));
        svg.append("path").attr("d", d3line(results[i]))
            .style("stroke-width", 1)
            .style("stroke", "#ff2222")
            .style("fill", "none")
            .style('stroke-opacity', 0.2);
    }

}

/*
var nodes = {
    "0": { "x": 922.24444, "y": 347.29444 },
    "1": { "x": 814.42222, "y": 409.16111 },
    "2": { "x": 738, "y": 427.33333000000005 },
    "3": { "x": 784.5, "y": 381.33333 },
    "4": { "x": 1066.09167, "y": 350.40278 },
    "5": { "x": 925.4861099999999, "y": 313.275 }
}
*/
/*
var edges = [{ "source": "0", "target": "1" },
    { "source": "4", "target": "2" },
    { "source": "0", "target": "3" },
    { "source": "0", "target": "4" },
    { "source": "2", "target": "5" },
    { "source": "3", "target": "2" },
    { "source": "3", "target": "4" }
]
*/

// Handling the hover on the basemap
function handleMouseover(e, d) {
    //let centroid = geoGenerator.centroid(d);
    //console.log(centroid)
    d3.select('#FDEB-container .info')
        .text('Current Country: ' + d.properties.name);

    //d3.select('FDEB-container .centroid')
    //    .style('display', 'inline')
    //    .attr('transform', 'translate(' + centroid + ')');
}

function drawBasemap(geojson) {
    let u = d3.select('#FDEB-container g.map')
        .selectAll('path')
        .data(geojson.features)
    u.enter()
        .append('path')
        .attr('d', geoGenerator)
        .on('mouseover', handleMouseover)
        .attr("fill", "#eee")
        .style("stroke", "#ccc");
}