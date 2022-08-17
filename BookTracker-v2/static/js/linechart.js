// set the dimensions and margins of the graph
let margin = { top: 10, right: 100, bottom: 30, left: 30 }
let width = document.querySelector('#linechart svg').clientWidth;
console.log(width)
let height = document.querySelector('#linechart svg').clientHeight;
console.log(height)

// select svg object to the body of the page
const svg2 = d3.select("#linechart svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
Promise.all([
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv"), // Position of example circles
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481.csv")
]).then(

    function(initialize) {
        let data = initialize[0] //load example data
        let Dantedata = initialize[1]
        console.log(data)
        console.log(Dantedata)

        // List of groups (here I have one group per column)
        const allgroup = []
        Dantedata.forEach(function(row, i) {
            bookId = row.Id
            allgroup.push(bookId)
        })
        console.log(allgroup)

        const allGroup = ["valueA", "valueB", "valueC"]

        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(d => d) // text showed in the menu
            .attr("value", d => d) // corresponding value returned by the button

        // Add X axis --> it is a date format
        const x = d3.scaleLinear()
            .domain([0, 10])
            .range([0, width]);
        svg2.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 20])
            .range([height, 0]);
        svg2.append("g")
            .call(d3.axisLeft(y));

        // Initialize line with group a
        const line = svg2
            .append('g')
            .append("path")
            .datum(data)
            .attr("d", d3.line()
                .x(d => x(+d.time))
                .y(d => y(+d.valueA))
            )
            .attr("stroke", "black")
            .style("stroke-width", 2)
            .style("fill", "none")

        // Initialize dots with group a
        const dot = svg2
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr("cx", d => x(+d.time))
            .attr("cy", d => y(+d.valueA))
            .attr("r", 3)
            .style("fill", "#69b3a2")


        // A function that update the chart
        function update(selectedGroup) {

            // Create new data with the selection?
            const dataFilter = data.map(function(d) { return { time: d.time, value: d[selectedGroup] } })

            // Give these new data to update line
            line
                .datum(dataFilter)
                .transition()
                .duration(500)
                .attr("d", d3.line()
                    .x(d => x(+d.time))
                    .y(d => y(+d.value))
                )
            dot
                .data(dataFilter)
                .transition()
                .duration(500)
                .attr("cx", d => x(+d.time))
                .attr("cy", d => y(+d.value))
        }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(event, d) {
            // recover the option that has been chosen
            let selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
            update(selectedOption)
        })

    })