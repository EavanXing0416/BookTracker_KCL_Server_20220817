//notice: 
//for each book's journey, if it has n provenance, 
//then there'll be only (n-1) paths in the middle 
//wich depict the movement from one place to another

function drawOverviewMap(locName, lats, lngs, mapID, n) {
    var arcColor = d3.scaleSequential().domain([1, n]).interpolator(d3.interpolateViridis);
    var movingMarkerPointList = [
        [lats[0], lngs[0]]
    ]
    for (j = 0; j < n - 1; j++) {
        //console.log(n)
        colorNow = arcColor(j + 1)
            //console.log(arcColor)
        var arc_data = {
                startLoc: locName[j],
                endLoc: locName[j + 1],
                arc_start: [lats[j], lngs[j]],
                arc_end: [lats[j + 1], lngs[j + 1]]
            }
            //console.log(arc_data.arc_end, arc_data.arc_start)

        if (arc_data.arc_start[0] == arc_data.arc_end[0] && arc_data.arc_start[1] == arc_data.arc_end[1]) {
            console.log((j + 2) + ' / ' + n + ': same location with the previous one')

            var movingPathPoints = circleToPolyline(0.6, lats[j + 1], lngs[j + 1], 0.05)
            movingMarkerPointList = movingMarkerPointList.concat(movingPathPoints)

            L.polygon(movingPathPoints, {
                color: '#196363',
                opacity: 0.4,
                fillColor: '#196363',
                fillOpacity: 0
            }).addTo(mapID)

        } else {
            var arc = L.Polyline.Arc(arc_data.arc_start, arc_data.arc_end, {
                //color: colorNow,
                //'#4275f5'- the blueish
                color: '#196363',
                vertices: 100,
                opacity: 0.6
            }).addTo(mapID);
            //console.log(arc._latlngs)
            var arcPathList = arc._latlngs.map(({ lat, lng }) => [lat, lng])
            console.log(arcPathList)
            movingMarkerPointList = movingMarkerPointList.concat(arcPathList)
                /*
                movingMarkerPointList = movingMarkerPointList.concat([
                    [lats[j + 1], lngs[j + 1]]
                ])
                */

        }
        //return arc_data

    }
    console.log(movingMarkerPointList)
    var myMovingMarker = L.Marker.movingMarker(movingMarkerPointList, 30000).addTo(mapID);
    var myPolylineMotion = L.motion.polyline(movingMarkerPointList, { color: 'lightblue' }, { auto: false, duration: 30000 }).addTo(mapID)

    //myMovingMarker.start();
    myMovingMarker.once('click', function(e) {
        myMovingMarker.start();
        myPolylineMotion.motionStart();
        //console.log(e)
        //myMovingMarker.closePopup();
        //myMovingMarker.unbindPopup();
        myMovingMarker.on('click', function() {
            if (myMovingMarker.isRunning()) {
                myMovingMarker.pause();
                myPolylineMotion.motionToggle();
                //console.log(e.sourceTarget._currentIndex);
                //console.log(e.sourceTarget._currentLine);
            } else {
                myMovingMarker.start();
                myPolylineMotion.motionToggle();
                //console.log(e.sourceTarget._currentIndex);
                //console.log(e.sourceTarget._currentLine);
            }
        });
        //setTimeout(function() {
        //    myMovingMarker.bindPopup('<b>Click to start/pause</b>').openPopup();
        //}, 2000);
    });
    //var myPolylineMotion = L.motion.polyline(movingMarkerPointList, { color: 'lightblue' }, {duration: 30000 }).addTo(mapID)


    //myMovingMarker.bindPopup('<b>Click to start/pause</b>', { closeOnClick: false });
    //myMovingMarker.openPopup();
}


//circle to polyline
function circleToPolyline(r, cylat, cxlng, alpha) {
    //let r = 52.71; // the radius of the circle
    //let cx = 317.5; // the x coord of the center of the circle
    //let cy = 108.5; // the y coord of the center of the circle
    //let alpha = 0.5
    let circlePath = []; // the points for the polyline

    for (let a = 0; a <= 2 * Math.PI; a += alpha) {
        //let xlng = cxlng + r * Math.cos(a);
        let xlng = cxlng - r + r * Math.cos(a);
        let ylat = cylat + r * Math.sin(a);
        //circlePath += `${x}, ${y} `;
        circlePath.push([ylat, xlng]);
    }
    //circlepath += `${cx + r}, ${cy} `;

    circlePath.push([cylat, cxlng - r + r]);
    console.log(circlePath);
    return circlePath
}

//circleToPolyline(16, 0, 0, 0.75);





// set the atribute points for the polyline
//poly.setAttributeNS(null, "points", points)


/////pirChart data and Config
function generatePieData(lats, lngs, n, book_i) {
    var pieColor = d3.scaleSequential().domain([1, n * 10 + 10]).interpolator(d3.interpolateGreens);
    //console.log(pieColor)
    //var currentColor = pieColor(n + 5)
    //var currentStroke = pieColor(n + 3)
    var currentColor = 'lightblue'
    var currentStroke = 'blue'
    var pieData = []
        //var pieConfig = { fillStyle: null, strokeStyle: null, lineWidth: 4 }
    var fill, stroke, lineW
        //    console.log(book_i)

    for (j = 0; j < n; j++) {
        //console.log(j)
        //console.log(book_i)
        if (j == book_i) {
            fill = currentColor
            stroke = currentStroke
            lineW = 8
        } else {
            fill = pieColor(j * 10 + 1)
                //stroke = pieColor(j + 1)
            stroke = 'grey'
            lineW = 4
        }
        //console.log(fill)
        pieData.push({ name: 'prov' + (j + 1), value: 1, style: { fillStyle: fill, strokeStyle: stroke, lineWidth: lineW } })
            //console.log(pieData)

    }

    console.log(pieData)

    return pieData;
}


function drawPieGlyph(lats, lngs, mapID, n, pieData) {
    for (j = 0; j < n; j++) {
        var coor = [lats[j], lngs[j]]
        L.piechartMarker(
            L.latLng(coor), {
                radius: 16,
                riseOnHover: false,
                data: pieData
            }
        ).addTo(mapID);
    }
}

/*
L.piechartMarker(
            L.latLng([37.683, -122.4536]), {
                radius: 50,
                data: [
                    { name: 'Boots', value: 500 },
                    { name: 'Big Boots', value: 200 },
                    { name: 'Sneakers', value: 700 },
                    { name: 'Shoes', value: 350 },
                    { name: 'Moccasins', value: 100 },
                    { name: 'Bare foot', value: 200 }
                ]
            }
        ).addTo(map0);
*/


function prepareStopLineData(locName, cityName) {
    provStopData = []
    var provN = locName.length
    var stopColor = d3.scaleSequential().domain([1, provN * 10 + 10]).interpolator(d3.interpolateGreens)

    for (i = 0; i < provN; i++) {
        var provNumber = i + 1
        var provLoc
        if (locName[i] == 'United Kingdom') {
            provLoc = 'UK'
        } else if (locName[i] == 'United States') {
            provLoc = 'US'
        } else if (locName[i] == 'NoInfo') {
            provLoc = '--'
        } else {
            provLoc = locName[i]
        }
        var provCity
        if (cityName[i] == 'NoInfo' || cityName[i] == 'None') {
            provCity = '--'
        } else if (cityName[i] == locName[i]) {
            provCity = '--'
        } else {
            provCity = cityName[i]
        }

        provStopData.push({ 'provNumber': provNumber, 'provLoc': provLoc, 'provCity': provCity, 'circleColor': stopColor(i * 10 + 1) })
    }

    //console.log(provStopData)
    return provStopData

}

function drawStopLine(provStopData, locName, divContainer, parentH) {
    var divWidth = document.getElementById('book-1-info').clientWidth
        //document.getElementById(divContainer).clientWidth
        //var divHeight = document.getElementById(divContainer).clientHeight
    var divHeight = parentH * 0.06
    console.log(divWidth, divHeight)
    var provN = locName.length

    //draw circles & Location Names
    const cxBase = 0.925 * divWidth / (provN - 1);
    const cxOffset = 0.025 * divWidth;

    // Make SVG container  
    divContainerId = '#' + divContainer
    console.log(divContainerId)
    var svgContainer = d3.select(divContainerId)
        .append("svg")
        .attr("width", divWidth)
        .attr("height", divHeight);

    // This function will iterate your data
    provStopData.map(function(props, index) {
        var cx = cxBase * (index) + cxOffset; // Here CX is calculated
        var cx_next
        if (index < provN - 1) {
            cx_next = cx + cxBase
        } else {
            cx_next = cx
        }
        var cr = 10
        var elem = svgContainer.selectAll("div").data(provStopData);

        var elemEnter = elem.enter()
            .append("g")

        var lines = elemEnter.append("line")
            .style("stroke", "darkgrey")
            .attr("x1", cx)
            .attr("x2", cx_next)
            .attr("y1", divHeight / 4)
            .attr("y2", divHeight / 4)

        var circles = elemEnter.append("circle")
            .attr("cx", cx)
            .attr("cy", divHeight / 4)
            .attr("r", cr)
            .style("fill", props.circleColor);

        var Numbers = elemEnter
            .append("text")
            .style("fill", "black")
            .attr("dy", function(d) {
                return divHeight / 4 + 3.5;
            })
            .attr("dx", function(d) {
                return cx - String(props.provNumber).length * 3.5;
            })
            .text(function(d) {
                return props.provNumber
            });

        var countryNames = elemEnter
            .append("text")
            .style("fill", "black")
            .attr("class", "stopLineLocName")
            .attr("dy", function(d) {
                return divHeight / 4 + 2.5 * cr;
            })
            .attr("dx", function(d) {
                return cx - props.provLoc.length * 2.25
                    //return cx - props.provLoc.length * 3.5
            })
            .text(function(d) {
                return props.provLoc
            });

        var cityNames = elemEnter
            .append("text")
            .style("fill", "darkgrey")
            .attr("class", "stopLineCityName")
            .attr("dy", function(d) {
                return divHeight / 4 + 4 * cr;
            })
            .attr("dx", function(d) {
                return cx - props.provLoc.length * 2.25
                    //return cx - props.provLoc.length * 3.5
            })
            .text(function(d) {
                return props.provCity
            });

    });




}