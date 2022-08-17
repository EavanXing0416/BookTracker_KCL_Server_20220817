//draw Cord Diagram

//Group by function:
function groupArraybyLocation(arr = []) {
    let map = new Map()
    for (let i = 0; i < arr.length; i++) {
        const s = JSON.stringify(arr[i]);
        if (!map.has(s)) {
            map.set(s, {
                source: arr[i][0],
                target: arr[i][1],
                value: 1,
            });
        } else {
            map.get(s).value++;
        }
    }
    const res = Array.from(map.values())
    return res;
};



//Draw Chord function: country level
function drawChordDiagramOnCountry(data) {
    let width = 480
    let height = 480
    let innerRadius = Math.min(width, height) * 0.25 - 25
    let outerRadius = innerRadius + 5
    let formatValue = x => `${x.toFixed(0)} time(s)`

    let names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    console.log(names)
    let index = new Map(names.map((name, i) => [name, i]))
    let matrix = Array.from(index, () => new Array(names.length).fill(0))
    for (const { source, target, value }
        of data) { matrix[index.get(source)][index.get(target)] += value; }
    console.log(matrix)

    let chord = d3.chordDirected()
        .padAngle(0.4 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    let ribbon = d3.ribbonArrow()
        .radius(innerRadius)
        .padAngle(0.1 / innerRadius)

    let color = d3.scaleOrdinal(names, d3.schemeSet3.concat(d3.schemeCategory10))

    //start drawing
    const svg = d3.select('#chord-country')
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 4, width, height]);

    const chords = chord(matrix);

    //const textId = DOM.uid("text");


    svg.append("path")
        //.attr("id", textId.id)
        .attr("fill", "none")
        .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

    svg.append("g")
        .attr("fill-opacity", 0.90)
        .selectAll("g")
        .data(chords)
        .join("path")
        .attr("d", ribbon)
        .attr("fill", d => color(names[d.source.index]))
        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${names[d.source.index]} -> ${names[d.target.index]}:  ${formatValue(d.source.value)}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 3)
        .selectAll("g")
        .data(chords.groups)
        .join("g")
        .call(g => g.append("path")
            .attr("d", arc)
            .attr("fill", d => color(names[d.index]))
            .attr("stroke", "#fff"))
        .call(g => g.append("text")
            .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
            .attr("dy", "0.35em")
            .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 0.5})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
            .text(d => names[d.index]))
        //.attr("dy", -4)
        //.append("textPath")
        //.attr("xlink:href", textId.href)
        //.attr("startOffset", d => d.startAngle * outerRadius)
        //.text(d => names[d.index]))
        .call(g => g.append("title")
            .text(d => `${names[d.index]}
    export ${formatValue(d3.sum(matrix[d.index]))}
    import ${formatValue(d3.sum(matrix, row => row[d.index]))}`));
}

//Draw Chord function: city level
function drawChordDiagramOnCity(data) {
    let width = 480
    let height = 480
    let innerRadius = Math.min(width, height) * 0.25 - 25
    let outerRadius = innerRadius + 5
    let formatValue = x => `${x.toFixed(0)} time(s)`

    let names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    console.log(names)
    let index = new Map(names.map((name, i) => [name, i]))
    let matrix = Array.from(index, () => new Array(names.length).fill(0))
    for (const { source, target, value }
        of data) { matrix[index.get(source)][index.get(target)] += value; }
    console.log(matrix)

    let chord = d3.chordDirected()
        .padAngle(0.4 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    let ribbon = d3.ribbonArrow()
        .radius(innerRadius)
        .padAngle(0.1 / innerRadius)

    let color = d3.scaleOrdinal(names, d3.schemeSet3.concat(d3.schemeCategory10))

    //start drawing
    const svg = d3.select('#chord-city')
        .append("svg")
        .attr("viewBox", [-width / 2, -height / 4, width, height]);

    const chords = chord(matrix);

    //const textId = DOM.uid("text");


    svg.append("path")
        //.attr("id", textId.id)
        .attr("fill", "none")
        .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

    svg.append("g")
        .attr("fill-opacity", 0.90)
        .selectAll("g")
        .data(chords)
        .join("path")
        .attr("d", ribbon)
        .attr("fill", d => color(names[d.source.index]))
        .style("mix-blend-mode", "multiply")
        .append("title")
        .text(d => `${names[d.source.index]} -> ${names[d.target.index]}:  ${formatValue(d.source.value)}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 3)
        .selectAll("g")
        .data(chords.groups)
        .join("g")
        .call(g => g.append("path")
            .attr("d", arc)
            .attr("fill", d => color(names[d.index]))
            .attr("stroke", "#fff"))
        .call(g => g.append("text")
            .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
            .attr("dy", "0.35em")
            .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 0.5})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
            .text(d => names[d.index]))
        //.attr("dy", -4)
        //.append("textPath")
        //.attr("xlink:href", textId.href)
        //.attr("startOffset", d => d.startAngle * outerRadius)
        //.text(d => names[d.index]))
        .call(g => g.append("title")
            .text(d => `${names[d.index]}
    export ${formatValue(d3.sum(matrix[d.index]))}
    import ${formatValue(d3.sum(matrix, row => row[d.index]))}`));
}