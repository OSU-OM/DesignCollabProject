var svg = d3.select("svg");

var radius = 180;

var pieChart = svg.append("g").attr("transform", "translate(" + (radius + 200) + "," + (radius + 200) + ")");

var colors = d3.scaleOrdinal([
    "#dbf4ad",
    "#6df2ff",
    "#8f3985",
    "#40798c",
    "#4c3a2b"
])

var pie = d3.pie().value(function (d) {
    return d.Funding;
});

var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 15);

var labelArc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 15);

var label = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius + 25);

d3.csv("tempData.csv", function (data) {
    var arc = pieChart.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) {
            return colors(d.data.School);
        })

    //Non-Rotated Labels:
    /*
    arc.append("text")
        .attr("transform", function (d) {
            var c = labelArc.centroid(d);
            return "translate(" + c[0] * 1.1 + "," + c[1] * 0.9 + ")";
        })
        .attr("dy", "0.35em")
        .attr("class", "labels")
        .attr('text-anchor', 'middle')
        .text(function (d) { return d.data.School; });
    */

    //Rotated Labels
    //Adapted from http://bl.ocks.org/vigorousnorth/7331bb51d4f0c2ae0314
    arc.append("text")
        .attr("transform", function (d) {
            var midAngle = d.startAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
            return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180 / Math.PI) + ")";
        })
        .attr("dy", ".35em")
        .attr("class", "labels")
        .style("text-anchor", function (d) {
            var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;    //Need to work on this, anchoring is off
            if (rads >= Math.PI / 4 && rads <= 3 * Math.PI / 4) {
                return "start";
            } else if (rads >= 5 * Math.PI / 4 && rads <= 7 * Math.PI / 4) {
                return "end";
            } else {
                return "middle";
            }
        })        .text(function (d) { return (d.data.Funding > 10000) ? d.data.School : null; });
});