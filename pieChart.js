var radius = 200;
var x = radius;
var y = radius + 50;

var colors = d3.scaleOrdinal([
    "#dbf4ad",
    "#6df2ff",
    "#8f3985",
    "#40798c",
    "#4c3a2b"
])

var pieData = d3.pie().value(function (d) {
    return d.OperatingExpenditures;
});

var outerRadius = radius,
    innerRadius = radius-45,
    cornerRadius = 10;

var labelArc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

var label = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(outerRadius + 25);

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

var pie = d3.pie()
    .padAngle(.02);

var arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

var arcStart = d3.arc()
    .padRadius(10)
    .innerRadius(1)
	.outerRadius(10);

var svg = d3.select("svg")
  .append("g")
    .attr("transform", "translate(" + (x+100) + "," + y + ")");
	
	
//startup	
		//d3.selectAll("h1").transition().style("color","green");
	
	
	
d3.csv("Data/2016-2017/FundingVsEnrollment.csv", function (csvData) {
console.log("running");
	arcDat = svg.selectAll("path")
    .data(pieData(csvData));
	
	var Hover = false;
	
  Paths = arcDat.enter().append("path")
    .each(function(d) { d.outerRadius = innerRadius; })
    .attr("d", arc)
	.attr("fill", function (d) {
            return colors(d.data.District);
        })
	.style("opacity", 0)
	.on("mouseenter",arcTweenRad(outerRadius+10, 0))
    .on("mouseover", function (d) {

		
	d3.select("#l").remove();  //Delete previous label if one exists
            d3.select("#oe").remove();  //Delete previous Operating Expenditures label if it exists (although probably don't *really* need to do this since it's static)
            d3.select("#f").remove();  //Delete previous funding label if it exists


            svg.append("text")
                .attr("transform", "translate(" + ( 150) + "," + (175) + ")")
                .attr("dy", "0.35em")
                .attr("id", "l")
                .attr("class", "labels")
                .attr('text-anchor', 'right')
				.attr("fill", "#ffffff")
                //.attr("fill", colors(d.data.District))
                .text(d.data.District)

            svg.append("text")
                .attr("transform", "translate(" + (200) + "," + (75) + ")")
                .attr("dy", "0.35em")
                .attr("id", "oe")
                .attr("class", "oe")
                .attr('text-anchor', 'right')
                .attr("fill", "#ffffff")
                .text("Operating Expenditures:")

            svg.append("text")
                .attr("transform", "translate(" + (220) + "," + 0+ ")")
                .attr("dy", "0.35em")
                .attr("id", "f")
                .attr("class", "funds")
                .attr('text-anchor', 'right')
                .attr("fill", "#ffffff")
                .text("$" + formatDollarAmount(d.data.OperatingExpenditures))

	}
	)
    .on("mouseout", arcTweenRad(outerRadius , 150));
	//.on("load",arcTweenRad(outerRadius-20, 150));

	//d3.selectAll("path").transition()
	Paths.transition()
    .duration(function (d,i) {return 200*d.endAngle})	
	.style("opacity", 1)
	.transition()
	.attrTween("d", arcTweenRad(outerRadius,0));
	
	arcDat.enter().append("text")
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
