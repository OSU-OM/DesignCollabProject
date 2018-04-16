//Gauge chart derived from here: https://stackoverflow.com/questions/44164912/d3-gauge-chart-with-labels-and-percentages

var data = [45, 33, 66, 50, 90]

var svg = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + 50 + "," + 450 + ")");

var colors = d3.scaleOrdinal([
    "#dbf4ad",
    "#6df2ff",
    "#8f3985",
    "#40798c",
    "#4c3a2b"
])

var arcs = data.map((v, i) => {
    return d3.arc()
        .innerRadius(i * 20 + 60)
        .outerRadius((i + 1) * 20 - 5 + 60)
});


var pieData = data.map((v, i) => {
    return [{ value: v * 0.75, arc: arcs[i] }, { value: (100 - v) * 0.75, arc: arcs[i] }, { value: 100 * 0.25, arc: arcs[i] }]
})


var pie = d3.pie()
    .sort(null)
    .value(d => d.value)


var g = svg.selectAll('g').data(pieData).enter().append('g').attr('transform', 'translate(250,250) rotate(180)').attr('fill-opacity', (d, i) => 2 / (i + 1))

// progress
g.selectAll('path').data(d => { return pie(d) }).enter().append('path').attr('d', d => { return d.data.arc(d) })
    .attr('fill', (d, i) => i == 0 ? 'blue' : 'none')

svg.selectAll('g').each(function (d) {
    var el = d3.select(this);
    el.selectAll('path').each((r, i) => {

        if (i == 1) {
            var centroid = r.data.arc.centroid({ startAngle: r.startAngle + 0.05, endAngle: r.startAngle + 0.001 + 0.05 })
            g.append('text').text(100 - Math.floor(r.value) + '%').attr('transform', `translate(${centroid[0]},${centroid[1]}) rotate(${180 / Math.PI * (r.startAngle) + 7})`).attr('alignment-baseline', 'middle')
        }

    })
})
