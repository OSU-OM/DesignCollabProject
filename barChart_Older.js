//Chart derived from this example: https://bl.ocks.org/mbostock/3886394

var svg = d3.select("svg"),
    width = 700,
    height = 300,
    g = svg.append("g").attr("transform", "translate(" + 400 + "," + 600 + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#dbf4ad", "#6df2ff", "#8f3985", "#40798c", "#4c3a2b", "#dbf4ad", "#6df2ff"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

var primaryChart = d3.select("#primaryChart");
var district = primaryChart.key;

d3.csv("data.csv", type, function (error, data) {
    if (error) throw error;

    data.sort(function (a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

    x.domain(data.map(function (d) { return d.State; }));
    z.domain(data.columns.slice(1));

    var serie = g.selectAll(".serie")
        .data(stack.keys(data.columns.slice(1))(data))
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function (d) { return z(d.key); });

    serie.selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.State); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "barX")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "barY")
        .call(d3.axisLeft(y).ticks(10, "%"));

    var legend = serie.append("g")
        .attr("class", "legend")
        .attr("transform", function (d) { var d = d[d.length - 1]; return "translate(" + (x(d.data.State) + x.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")"; });

    legend.append("line")
        .attr("x1", -6)
        .attr("x2", 6)
        .attr("stroke", "#000");

    legend.append("text")
        .attr("x", 9)
        .attr("dy", "0.35em")
        .attr("class", "barChart")
        .text(function (d) { return d.key; });
});

function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}