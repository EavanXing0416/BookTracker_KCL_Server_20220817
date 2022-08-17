$("#myInput-SingleSubmit").click(function() {
            var singlecopy = $("#myInput-SingleCopy").val()
            var data = {
                "singlecopy": singlecopy,
            }
            console.log(data)

            d3.select('#map g.locations').remove();
            d3.select('#map g.movements').remove();
            d3.select('#map svg').append('g').attr('class', 'movements')
            $.ajax({
                url: "/send_message2",
                type: "POST",
                async: true,
                data: data,
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    //alert('success')
                    response.forEach(function(row) {
                        const bookId = row.Id
                        var link = []
                        var source = [+row.lon1, +row.lat1]
                        var target = [+row.lon2, +row.lat2]
                        var topush = { type: "LineString", coordinates: [source, target] }
                        link.push(topush)
                        console.log(link)
                        drawMovements(link, bookId)
                    })



                },
                error: function(error) {
                    console.log(error);
                }
            })

        }











        // div container: #map: weight = 900, height = 500
        // Create the projection and path of the basemap
        // the padding of the container is 1rem == 16px
        let width_map = document.querySelector('#map-singlepath svg').clientWidth;
        //console.log(width_map)
        let height_map = document.querySelector('#map-singlepath svg').clientHeight;
        //console.log(height_map)


        //zoom functions:
        let zoom = d3.zoom()
            .scaleExtent([1, 5])
            .translateExtent([
                [0, 0],
                [width_map, height_map]
            ])
            .on('zoom', handleZoom);

        function handleZoom(e) {
            d3.selectAll('#map-singlepath svg g')
                .attr('transform', e.transform);
        }

        function initZoom() {
            d3.select('#map-singlepath svg')
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
            let pixelArea = geoGenerator.area(d);
            let bounds = geoGenerator.bounds(d);
            let centroid = geoGenerator.centroid(d);
            //let measure = geoGenerator.measure(d);

            d3.select('#map-singlepath .info')
                .text('Current Country: ' + d.properties.name)
                //.text(d.properties.name + ' (path.area = ' + pixelArea.toFixed(1) + ' path.measure = ' + measure.toFixed(1) + ')');

            d3.select('#map-singlepath .bounding-box rect')
                .attr('x', bounds[0][0])
                .attr('y', bounds[0][1])
                .attr('width', bounds[1][0] - bounds[0][0])
                .attr('height', bounds[1][1] - bounds[0][1]);

            d3.select('#map-singlepath .centroid')
                .style('display', 'inline')
                .attr('transform', 'translate(' + centroid + ')');
        }

        function drawBasemap(geojson) {
            let u = d3.select('#map-singlepath g.basemap')
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





        // functions to draw movements and locations
        function drawLocations(dotsOnMap, bookId) {
            let l = d3.select('#map-singlepath g.locations')
            l.append("circle")
                .attr("id", bookId)
                .attr("cx", dotsOnMap[0])
                .attr("cy", dotsOnMap[1])
                .attr("r", 1)
                .style("fill", "#000000")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 0.3)
                .attr("stroke-opacity", 0.3)
                .attr("fill-opacity", 0.3);
        }

        function drawMovements(movement_cleaned, bookId) {
            let m = d3.select('#map-singlepath g.movements').selectAll("myPath").data(movement_cleaned)
            m.enter()
                .append("path")
                .attr("id", bookId)
                .attr("d", function(d) { return geoGenerator(d) })
                .style("fill", "none")
                .style("stroke", "#000000")
                .style("stroke-width", 1)
                .style("opacity", 0.1)

        }

        // Draw trajectories
        const svg = d3.select('#map-singlepath svg')
        Promise.all([
            d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectionmap.csv"), // Position of example circles
            d3.csv('https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv')
        ]).then(

            function(initialize) {
                //let data = initialize[0] //load example data
                let Dantedata = initialize[1]
                console.log(Dantedata)

                //try to print several of Dante book movement

                Dantedata.forEach(function(row, i) {
                    //console.log(i) //show the index
                    const bookId = row.Id
                        //console.log(bookId)
                    const lon = row.locationLonFilled
                    const lat = row.locationLatFilled
                    const lon_parsed = JSON.parse(lon.replace(/NoInfo/g, null))
                    const lat_parsed = JSON.parse(lat.replace(/NoInfo/g, null))
                    console.log(lat_parsed)
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


                    //console.log(Lon)
                    //console.log(Lat)
                    //console.log(movement)
                    //console.log(locs)

                    // Draw all the movements
                    drawMovements(movement_cleaned, bookId)
                        /*
                        m.selectAll("myPath")
                            .data(movement_cleaned)
                            .enter()
                            .append("path")
                            .attr("d", function(d) { return geoGenerator(d) })
                            .style("fill", "none")
                            .style("stroke", "black")
                            .style("stroke-width", 1)
                            .style("opacity", 0.3)
                        */

                    // Draw all the dots in this provenance
                    for (var dot = 0; dot < locs_cleaned[0].length; dot++) {

                        var dotsLon = locs_cleaned[0][dot]
                        var dotsLat = locs_cleaned[1][dot]
                        var dots = [dotsLon, dotsLat]
                            //console.log(dots)
                        var dotsOnMap = projection(dots)
                            //console.log(dotsOnMap)

                        drawLocations(dotsOnMap, bookId)
                            /*
                            svg.select('#map g.locations')
                                //.select("circle")
                                //.data(dotsOnMap)
                                //.enter()
                                .append("circle")
                                //.attr("cx", function(d) {
                                //    console.log(d)
                                //    return d[0];
                                //})
                                .attr("cx", dotsOnMap[0])
                                .attr("cy", dotsOnMap[1])
                                .attr("r", 2)
                                .style("fill", "69b3a2")
                                .attr("stroke", "#69b3a2")
                                .attr("stroke-width", 0.5)
                                .attr("fill-opacity", 0.3);


                            */

                    }



                })

                /*
                        // Example Code: Reformat the list of link. Note that columns in csv file are called long1, long2, lat1, lat2
                        const link = []
                        data.forEach(function(row) {
                            source = [+row.long1, +row.lat1]
                            target = [+row.long2, +row.lat2]
                            topush = { type: "LineString", coordinates: [source, target] }
                            link.push(topush)
                        })

                        console.log(link)

                        // Add the path
                        svg.selectAll("myPath")
                            .data(link)
                            .join("path")
                            .attr("d", function(d) { return geoGenerator(d) })
                            .style("fill", "none")
                            .style("stroke", "#69b3a2")
                            .style("stroke-width", 1)

                */
            })

        initZoom();

        /* Example Code: Draw all the dots on the map
        //var dots = 
        svg.select('#map .locations')
            .selectAll("circle")
            .data(locs)
            .enter().append("circle")
            //.join("circle")
            .attr("cx", function(d) {
                //console.log(projection(d))
                return projection([d[1], d[0]])[0];
            })
            .attr("cy", function(d) { return projection([d[1], d[0]])[1]; })
            .attr("r", 2)
            .style("fill", "69b3a2")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 0.5)
            .attr("fill-opacity", 0.3);
        */

        input = document.getElementById("myInput-id"); console.log(input)