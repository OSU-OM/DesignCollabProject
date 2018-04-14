var svg = d3.select("svg");

var radius = 200;
var x = radius;
var y = radius + 50;

var pieChart = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");

/*
var colors = d3.scaleOrdinal([
    "#dbf4ad",
    "#6df2ff",
    "#8f3985",
    "#40798c",
    "#4c3a2b"
])
*/

var colors = d3.scaleOrdinal(["#dbf4ad", "#6df2ff", "#8f3985", "#40798c", "#4c3a2b"]);

var pie = d3.pie().value(function (d) {
    return d.OperatingExpenditures;
});

var path = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 20);

d3.csv("Data/2016-2017/FundingVsEnrollment.csv", function (data) {

    var arc = pieChart.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) {
            return colors(d.data.District);
        })
        .on("mouseover", function (d) {

            d3.select("#l").remove();  //Delete previous label if one exists
            d3.select("#oe").remove();  //Delete previous Operating Expenditures label if it exists (although probably don't *really* need to do this since it's static)
            d3.select("#f").remove();  //Delete previous funding label if it exists


            svg.append("text")
                .attr("transform", "translate(" + (x + 150) + "," + (y - 175) + ")")
                .attr("dy", "0.35em")
                .attr("id", "l")
                .attr("class", "labels")
                .attr('text-anchor', 'right')
                .attr("fill", colors(d.data.District))
                .text(d.data.District)

            svg.append("text")
                .attr("transform", "translate(" + (x + 200) + "," + (y - 75) + ")")
                .attr("dy", "0.35em")
                .attr("id", "oe")
                .attr("class", "oe")
                .attr('text-anchor', 'right')
                .attr("fill", "#ffffff")
                .text("Operating Expenditures:")

            svg.append("text")
                .attr("transform", "translate(" + (x + 220) + "," + y + ")")
                .attr("dy", "0.35em")
                .attr("id", "f")
                .attr("class", "funds")
                .attr('text-anchor', 'right')
                .attr("fill", "#ffffff")
                .text("$" + parseInt(d.data.OperatingExpenditures))
        })
});