//const W = document.documentElement.clientWidth / 3
const W = document.getElementById('overallHeatmap-container').offsetWidth;
const H = document.documentElement.clientHeight
    //console.log(W, H)
const margin = { top: W * 0.06, right: W * 0.02, bottom: W * 0.02, left: W * 0.1 },
    width = W - margin.left - margin.right,
    height = 0.9 * H - margin.top - margin.bottom;



//change the style of the Info Panel & STB-containers
var InfoPanel = document.getElementById("infoPanel-container");
InfoPanel.setAttribute("style", "height:" + (0.18 * H) + "px");

var Stb1 = document.getElementById("Storyboard1-container");
Stb1.setAttribute("style", "height:" + (0.75 * H) + "px");

var stbContainer = document.getElementById("STB-container");
stbContainer.setAttribute("style", "height:" + (0.8 * H) + "px");

var overallHeatmapContainer = document.getElementById("overallHeatmap-container");
overallHeatmapContainer.setAttribute("style", "height:" + (0.28 * H) + "px");


var subHeatmapContainer = document.getElementById("subHeatmap-container");
subHeatmapContainer.setAttribute("style", "height:" + (0.70 * H) + "px")

var legend1 = document.getElementById("Heatmap1-Legend");
var legend2 = document.getElementById("Heatmap2-Legend");
var legend3 = document.getElementById("Heatmap3-Legend");
legend1.setAttribute("style", "height:" + (0.01 * H) + "px")
legend2.setAttribute("style", "height:" + (0.01 * H) + "px")
legend3.setAttribute("style", "height:" + (0.01 * H) + "px")


//Read the data
//example data："https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
//initial the three heatmaps
d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/heatmap1_bycountry.csv").then(function(data) {
    drawHeatmap(data, `1`, `freq`);
    //$("#alphabetical").on('click', updateHeatmap1(data, `1`, `alphabetical`))
    //$("#freq").on('click', updateHeatmap1(data, `1`, `freq`))
})

d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/heatmap2_bycountry.csv").then(function(data) {
    drawHeatmap(data, `2`);
})

d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/heatmap3_bycountry.csv").then(function(data) {
    drawHeatmap(data, `3`);
})


//Functions on drawing Heatmaps
const drawHeatmap = function(data, heatmapNumber, order) {
    // append the svg object to the body of the page
    if (heatmapNumber == 1) {
        var heatmapH = 0.6 * document.getElementById('overallHeatmap-container').offsetHeight
            //var heatmapH = H * 0.25
    } else {
        var heatmapH = 0.8 * document.getElementById('subHeatmap-container').offsetHeight
            //var heatmapH = H * 0.55
    }
    var svg = d3.select(`#Heatmap${heatmapNumber}-container`)
        .append("svg")
        //"width", width + margin.left + margin.right)
        .attr("width", (width + margin.left + margin.right))
        .attr("height", heatmapH + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    var myGroups = Array.from(new Set(data.map(d => d.group)))
    var myVars = Array.from(new Set(data.map(d => d.variable)))
    var maxValue = d3.max(Array.from(new Set(data.map(d => d.value))).map(Number))
        //console.log('Max value is:' + maxValue)
        //var showData = Array.from(new Set(data.map(d => d.value))).map(Number)
        //console.log(showData)
        //console.log(d3.max(showData))
    if (heatmapNumber == 1) {
        var myVars_alphabetical = ['Austria', 'Belarus', 'Belgium', 'Brazil', 'Denmark', 'France', 'Germany', 'Greece', 'Italy', 'Japan', 'Latvia', 'Netherlands', 'Poland', 'Russia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'United States', 'Vatican City', 'NoInfo']
        var myVars_freq = ['Italy', 'United Kingdom', 'United States', 'NoInfo', 'France', 'Germany', 'Japan', 'Vatican City', 'Russia', 'Spain', 'Greece', 'Austria', 'Belgium', 'Netherlands', 'Switzerland', 'Brazil', 'Denmark', 'Latvia', 'Ukraine', 'Belarus', 'Poland', 'Slovenia', 'Sweden']
        var xLabel

        var myGroups_alphabetical = ['Austria', 'Belarus', 'Belgium', 'Brazil', 'Denmark', 'France', 'Germany', 'Greece', 'Italy', 'Japan', 'Latvia', 'Netherlands', 'Poland', 'Russia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'United States', 'Vatican City', 'NoInfo']
        var myGroups_freq = ['Italy', 'United Kingdom', 'NoInfo', 'United States', 'Germany', 'France', 'Japan', 'Spain', 'Greece', 'Vatican City', 'Austria', 'Netherlands', 'Russia', 'Ukraine', 'Belgium', 'Brazil', 'Denmark', 'Latvia', 'Slovenia', 'Belarus', 'Poland', 'Sweden', 'Switzerland']
        var yLabel
        if (order == 'alphabetical') {
            xLabel = myVars_alphabetical
            yLabel = myGroups_alphabetical
                //console.log('alphabetical')
        } else if (order == 'freq') {
            xLabel = myVars_freq
            yLabel = myGroups_freq
                //console.log('frequency')
        }
    } else {
        var xLabel = myGroups
        var yLabel = myVars
    }
    //console.log(myGroups)
    //console.log(myVars)
    //console.log(maxValue)
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width - W * 0.05])
        .domain(xLabel)
        .padding(0.10);

    if (heatmapNumber == '2') {
        var xTickLabel = ['1401-1450', '1451-1500', '1501-1550', '1551-1600', '1601-1650', '1651-1700', '1701-1750', '1751-1800', '1801-1850', '1851-1900', '1901-1950', '1951-2000', '2001-']
        var xScale = d3.axisTop(x).tickSize(0).tickFormat((d, i) => xTickLabel[i])
            //var xScale = d3.axisTop(x).tickSize(0).ticks(13).tickValues(['1401-1450', '1451-1500', '1501-1550', '1551-1600', '1601-1650', '1651-1700', '1701-1750', '1751-1800', '1801-1850', '1851-1900', '1901-1950', '1951-2000', '2001-2022'])
    } else {
        var xScale = d3.axisTop(x).tickSize(0)
    }

    svg.append("g")
        .style("font-size", 5)
        //.attr("transform", `translate(0, ${height})`)
        .attr("transform", `translate(0,0)`)
        //.call(d3.axisTop(x).tickSize(0))
        .call(xScale)
        .selectAll("text")
        .attr("transform", "translate(0,-0)rotate(-40)")
        .style("text-anchor", "start")
        .style("font-size", 6)
        //.style("fill", "#69a3b2")
        //.select(".domain").remove()

    svg.append("g")
        .attr("text-anchor", "middle")
        .style("font-size", 8)
        .attr("transform", "translate(" + width / 2 + "," + -margin.top / 4 + ")")
        .text("Destination");


    // Build Y scales and axis:
    var y = d3.scaleBand()
        //.range([height, 0])
        .range([0, heatmapH])
        .domain(yLabel)
        .padding(0.10);
    svg.append("g")
        .style("font-size", 6)
        .call(d3.axisLeft(y).tickSize(0))
        //.selectAll("text")
        //.attr("transform", "translate(-3,-15)rotate(-25)")
        //.style("text-anchor", "end")
        //.style("font-size", 6)
        //.select(".domain").remove()
    svg.append("g")
        .attr("text-anchor", "middle")
        .style("font-size", 8)
        .attr("transform", "translate(" + -margin.left / 4 + "," + heatmapH / 2 + ")rotate(-90)")
        .text("Origin");

    // Build color scale
    var myColor
    if (heatmapNumber == 1) {
        myColor = d3.scaleSequentialLog()
            //myColor = d3.scaleSequentialSymlog()
            //.interpolator(d3.interpolateYlGnBu)
            .interpolator(d3.interpolateBuPu)
            .domain([0.4, maxValue])
    } else {

        myColor = d3.scaleSequentialPow()
            //.interpolator(d3.interpolateYlGnBu)
            .interpolator(d3.interpolateBuPu)
            .domain([0, maxValue])
    }
    // create a tooltip
    var tooltip = d3.select(`#Heatmap${heatmapNumber}-container`)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "0px")
        .style("border-radius", "0px")
        .style("padding", "0px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(event, d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }


    var mousemove = function(event, d) {
        if (heatmapNumber == 1) {
            var text = `${d.value} times of transfers from ${d.variable} to ${d.group}`
        } else if (heatmapNumber == 2) {
            var text = `Book (ID: ${d.variable}) has ${d.value} times of transfers in the ${d.group} th century`
        } else {
            var text = `Book (ID: ${d.variable}) has ${d.value} provenances in ${d.group}`
        }
        tooltip
            .text(text)
            .style("left", (event.x) * 0.5 + "px")
            .style("top", (event.y) * 0.5 + "px")
            .style("font-size", 8)
    }
    var mouseleave = function(event, d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    //show the selected book ids
    var mouseclick = function(event, d) {
        if (heatmapNumber == 1) {
            var selected = d.detail.split(",")
            var uniqueIdSet = new Set(selected)
            var selectedID = Array.from(uniqueIdSet)
        } else {
            var selectedID = d.variable.split(",")
        }
        console.log(selectedID)
        document.getElementById('selectedIdBox').value = selectedID

        updateSTB(selectedID)
            //functions to draw the STB ...
    }

    // add the squares
    svg.selectAll()
        .data(data, function(d) {
            if (heatmapNumber == 1) {
                return d.group + ':' + d.detail;
            } else {
                return d.group + ':' + d.variable;
            }
        })
        .join("rect")
        .attr("x", function(d) {
            if (heatmapNumber == 1) {
                return x(d.variable);
            } else {
                return x(d.group);
            }
        })
        .attr("y", function(d) {
            if (heatmapNumber == 1) {
                return y(d.group);
            } else {
                return y(d.variable);
            }
        })
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) { return myColor(d.value) })
        .style("stroke-width", 2)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", mouseclick)

    if (heatmapNumber == 1) {
        drawLegend({
            heatmapNumber: heatmapNumber,
            color: myColor,
            title: "Number of transfers:",
            tickFormat: ",d",
            ticks: 12
        })
    } else {
        if (heatmapNumber == 2) {
            titletext = "Number of transfers:"
        } else {
            titletext = "Number of provenances:"
        }
        drawLegend({
            heatmapNumber: heatmapNumber,
            color: myColor,
            title: titletext
        })
    }

    // Add title to graph
    /*
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("Heatmap1: Origin-Destination");
    */
    // Add subtitle to graph
    /*svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("A short description of the take-away message of this chart.");
    */
    //Add sequential color legend

};


//drawLegend
function drawLegend({
    color,
    title,
    heatmapNumber,
    tickSize = 10,
    width = 300,
    height = 9 + tickSize,
    marginTop = 5,
    marginRight = 2,
    marginBottom = 1 + tickSize,
    marginLeft = 10,
    ticks = width / 80,
    tickFormat,
    tickValues
} = {}) {
    var legend = d3.select(`#Heatmap${heatmapNumber}-Legend`)
        .append("svg")

    legend
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;

    // Continuous
    if (color.interpolate) {
        const n = Math.min(color.domain().length, color.range().length);

        x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

        legend.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }

    // Sequential
    else if (color.interpolator) {
        x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
                range() {
                    return [marginLeft, width - marginRight];
                }
            });

        legend.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());

        // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }
    }

    // Threshold
    else if (color.invertExtent) {
        const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
            :
            color.quantiles ? color.quantiles() // scaleQuantile
            :
            color.domain(); // scaleThreshold

        const thresholdFormat = tickFormat === undefined ? d => d :
            typeof tickFormat === "string" ? d3.format(tickFormat) :
            tickFormat;

        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        legend.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);

        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }

    // Ordinal
    else {
        x = d3.scaleBand()
            .domain(color.domain())
            .rangeRound([marginLeft, width - marginRight]);

        legend.append("g")
            .selectAll("rect")
            .data(color.domain())
            .join("rect")
            .attr("x", x)
            .attr("y", marginTop)
            .attr("width", Math.max(0, x.bandwidth() - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", color);

        tickAdjust = () => {};
    }

    legend.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("font-size", "6px")
            .text(title));

    return legend.node();
}

function ramp(color, n = 256) {
    var canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
    }
    return canvas;
}



function updateHeatmap(order) {
    // append the svg object to the body of the page
    d3.selectAll('#Heatmap1-container svg').remove();
    d3.selectAll('#Heatmap1-Legend svg').remove();
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/heatmap1_bycountry.csv").then(function(data) {
        drawHeatmap(data, `1`, order);
    })
}