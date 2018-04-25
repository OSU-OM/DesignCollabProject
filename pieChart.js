var radius = 180;
var x = radius;
var y = radius + 80;

/*
var colors = d3.scaleOrdinal([
    "#dbf4ad",
    "#6df2ff",
    "#8f3985",
    "#40798c",
    "#4c3a2b"
])
*/

//TODO
//Sort alphabetically
//Use only central Ohio districts
//Use colors to convey some kind of stat?
//Need:
//Enrollment, grad rate. proficiency
//Click pie slice to change visualization data

var svg = d3.select("svg")
    .append("g")
    .attr("id", "pieChart")
    .attr("transform", "translate(" + (x + 100) + "," + y + ")");

var colors = d3.scaleOrdinal([
    "#00BFB2",
    "#105370",
    "#F4D35E",
    "#EE964B",
    "#F95738",
    '#FAEDCA',
    '#C1DBB3',
    '#7EBC89'
])

var pieData = d3.pie().value(function (d) {
    return d.OperatingExpenditures;
});

var outerRadius = radius,
    innerRadius = radius-60,
    cornerRadius = 10;

var labelArc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

var label = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(outerRadius + 25);

var this_js_script = $('script[src*=somefile]'); // or better regexp to get the file name..
var key = this_js_script.attr('data-my_var_1');

	function arcTweenRad(outerRadius, delay) {
	
  return function() {
    d3.select(this).transition().delay(delay).attrTween("d", function(d) {
      var i = d3.interpolate(d.outerRadius, outerRadius);
      return function(t) { d.outerRadius = i(t); return arc(d); };
    });
  };
}

function arcTweenAng(newAngle) {
 return function(d) {
var interpolate = d3.interpolate(d.endAngle, newAngle);
return function(t) {
d.endAngle = interpolate(t);	
 return arc(d);
     };
  };
}
 
var width = 1200,
    height = 1000;

var formatDollarAmount = d3.format(",.2f");

var arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

var rect = svg.append("rect")
    .attr("x", (-radius * 2))
    .attr("y", ((-radius) - 50))
    .attr("width", ((radius * 2) + 400))
    .attr("height", 3)
    .attr("fill", "#105370");
	
d3.csv("Data/2016-2017/FundingVsEnrollment.csv", function (csvData) {
	arcDat = svg.selectAll("path")
    .data(pieData(csvData));
	
	var Hover = false;
	
    Paths = arcDat.enter().append("path")
        .each(function (d) { d.outerRadius = innerRadius; })
        .attr("d", arc)
        .attr("fill", function (d) {
            return colors(d.data.District);
        })
        .style("opacity", 0)
        .on("mouseenter", arcTweenRad(outerRadius + 10, 0))
        .on("mouseover", function (d) {
            d3.select("#l").remove();  //Delete previous label if one exists
            d3.select("#oe").remove();  //Delete previous Operating Expenditures label if it exists (although probably don't *really* need to do this since it's static)
            d3.select("#f").remove();  //Delete previous funding label if it exists

            svg.append("text")
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 175) + ")")
                .attr("dy", "0.35em")
                .attr("id", "l")
                .attr("class", "labels")
                .attr('text-anchor', 'left')
                .text(d.data.District)

            svg.append("text")
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 50) + ")")
                .attr("dy", "0.35em")
                .attr("id", "oe")
                .attr("class", "oe")
                .attr('text-anchor', 'left')
                .text("OPERATING EXPENDITURES")

            svg.append("text")
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 110) + ")")
                .attr("dy", "0.35em")
                .attr("id", "f")
                .attr("class", "funds")
                .attr('text-anchor', 'left')
                .text("$" + formatDollarAmount(d.data.OperatingExpenditures))

        })
        .on("click", function (d) {
            key = d.data.District;

            d3.select("#primaryChart")
                .attr("data-key", key);       //Update key with the currently selected district
      })
      .on("mouseout", arcTweenRad(outerRadius , 150));

	Paths.transition()
    .duration(function (d,i) {return 200*d.endAngle})	
	.style("opacity", 1)
	.transition()
	.attrTween("d", arcTweenRad(outerRadius,0));
});