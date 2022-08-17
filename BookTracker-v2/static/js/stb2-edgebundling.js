/** 
var d3Overlay = L.d3SvgOverlay(function(selection, projection) {

    var updateNodeSelection = selection.selectAll('circle').data(nodesList);
    updateNodeSelection.enter()
        .append('circle')
        .attr("cx", function(d) { return projection.latLngToLayerPoint([+d.x, +d.y]).x })
        .attr("cy", function(d) { return projection.latLngToLayerPoint([+d.x, +d.y]).y })
        .attr("r", 1.5)
        .style("fill", "#ffee00")
        .style("fill-opacity", 0.5);;

    //var updateEdgeSelection = selection.selectAll('path').data(edges);
    //updateEdgeSelection.enter()
    //    .append('path')


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


});

*/

function generateEBedges(proj, nodes, edges, step_size, compatibility_threshold) {
    var fbundling = d3.ForceEdgeBundling()
        .step_size(0.1)
        .compatibility_threshold(0.2)
        .nodes(nodes)
        .edges(edges);
    var results = fbundling();
    console.log(results)

    //Define d3line to draw curves
    var getCurvePath = d3.line()
        .x(function(d) {
            return proj.latLngToLayerPoint([+d.y, +d.x]).x;
        })
        .y(function(d) {
            return proj.latLngToLayerPoint([+d.y, +d.x]).x;
        })
        .curve(d3.curveLinear);

    //console.log(results)
    for (var i = 0; i < results.length; i++) {
        console.log(results[i])
        console.log(getCurvePath(results[i]));
    }

}

/* 
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
*/