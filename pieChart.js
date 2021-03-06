var radius = 180;
var x = radius;
var y = radius + 80;

var width = 1200,
    height = 1000;

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

var pieData = d3.pie()
    .value(function (d) { return d.OperatingExpenditures; })
    .sort(function (a, b) {
        return a.District.localeCompare(b.District);
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

//Used to update the data-key value associated with this script.
//The key value is used to communicate the selected district to other visualizations.
var key;

var formatDollarAmount = d3.format(",.2f");

var arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(innerRadius);

var format = d3.format(",d");
var previousDollarValue = 0;

function arcTweenRad(outerRadius, delay,bool) {
	if(bool==true){
        return function() {
            d3.select(this).transition().delay(delay).attrTween("d", function(d) {
                var i = d3.interpolate(d.outerRadius, outerRadius);
                return function(t) { d.outerRadius = i(t); return arc(d); };
            });
        };
	}
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

//Seperation lines
var rect = svg.append("rect")
    .attr("x", (-radius * 2))
    .attr("y", ((-radius) - 50))
    .attr("width", ((radius * 2) + 400))
    .attr("height", 3)
    .attr("fill", "#105370");

var rect = svg.append("rect")
    .attr("x", 450)
    .attr("y", ((-radius) - 50))
    .attr("width", 300)
    .attr("height", 3)
    .attr("fill", "#105370");

var rect = svg.append("rect")
    .attr("x", 800)
    .attr("y", ((-radius) - 50))
    .attr("width", 300)
    .attr("height", 3)
    .attr("fill", "#105370");


var rect = svg.append("rect")
    .attr("x", 450)
    .attr("y", 50)
    .attr("width", 650)
    .attr("height", 3)
    .attr("fill", "#105370");

//Images (grad cap and grade sheet)
svg.append("svg:image")
    .attr('x', 550)
    .attr('y', -180)
    .attr('width', 180)
    .attr('height', 180)
    .attr("xlink:href", "grad-cap.png")

svg.append("svg:image")
    .attr('x', 850)
    .attr('y', -170)
    .attr('width', 100)
    .attr('height', 120)
    .attr("xlink:href", "grade-sheet.png")

//Load data and render pie chart
d3.csv("Data/CentralOhio/FundingVsEnrollment.csv", function (csvData) {
	arcDat = svg.selectAll("path")
        .data(pieData(csvData));
	
	var canHover = true;
	var selection = 0;
	
    Paths = arcDat.enter().append("path")
        .each(function (d) { d.outerRadius = innerRadius; })
        .attr("d", arc)
        .attr("fill", function (d) {
            return colors(d.data.OperatingExpenditures);	
        })
        .style("opacity", 0)
        .on("mouseenter", function (d) {
			if(canHover){
		        d3.select(this).transition()
	                .attrTween("d", arcTweenRad(outerRadius+10,10,true));		
            }
		})
        .on("mouseover", function (d) {
			
							
			selection=d;		
            key = d.data.District;
            d3.select("#primaryChart")
                .attr("data-key", key);     //Update key with the currently selected district	
			
			if(canHover){
            d3.select("#l").remove();  //Delete previous label if one exists
            d3.select("#oe").remove();  //Delete previous Operating Expenditures label if it exists
            d3.select("#f").remove();  //Delete previous funding label if it exists

            svg.append("text")  //Render selected district text
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 175) + ")")
                .attr("dy", "0.35em")
                .attr("id", "l")
                .attr("class", "labels")
                .attr('text-anchor', 'left')
                .text(d.data.District)

            svg.append("text")  //Render "operating expenditures"
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 50) + ")")
                .attr("dy", "0.35em")
                .attr("id", "oe")
                .attr("class", "oe")
                .attr('text-anchor', 'left')
                .text("OPERATING EXPENDITURES")

            txt = svg.append("text")    //Render selected district's operating expenditures
                .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 110) + ")")
                .attr("dy", "0.35em")
                .attr("id", "f")
                .attr("class", "funds")
                .attr('text-anchor', 'left')
                .text(previousDollarValue)
				
			txt.transition().duration(750).tween("text", function() {
				previousDollarValue= d.data.OperatingExpenditures;
                var that = txt,
                    i = d3.interpolateNumber(that.text().replace(/,|\$/g, ""), previousDollarValue);
                    return function(t) { that.text("$"+format(i(t))); };
                });
			}
        })
        .on("click", function (d) {
			selection=d;
			canHover=!canHover;
			
			console.log("Hoverable: "+canHover);
			if(!canHover) {
                key = d.data.District;
                d3.select("#primaryChart")
                    .attr("data-key", key);       //Update key with the currently selected district
				
				
			    Paths.transition()
                    .duration(function (d2,i) {return 100*d.endAngle})	
	                .style("opacity", function (d2,i) {
		                if(canHover || d2==d){return 1}else{return 0.5}
			        });

                d3.select(this).transition()
	                .attrTween("d", arcTweenRad(outerRadius+10,10,true));			
			
			    d3.select("#l").remove();  //Delete previous label if one exists
			    d3.select("#f").remove();  //Delete previous funding label if it exists
			
				svg.append("text")
                    .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 175) + ")")
                    .attr("dy", "0.35em")
                    .attr("id", "l")
                    .attr("class", "labels")
                    .attr('text-anchor', 'left')
                    .text(d.data.District)
			    
				txt = svg.append("text")
                    .attr("transform", "translate(" + (-radius - 50) + "," + (radius + 110) + ")")
                    .attr("dy", "0.35em")
                    .attr("id", "f")
                    .attr("class", "funds")
                    .attr('text-anchor', 'left')
                    .text(previousDollarValue)
				
			    txt.transition().duration(1500).tween("text", function() {
				    previousDollarValue= d.data.OperatingExpenditures;
                    var that = txt,
                        i = d3.interpolateNumber(that.text().replace(/,|\$/g, ""), previousDollarValue);
                        return function(t) { that.text("$"+format(i(t))); };
                    });	
		    } else {
			    Paths.transition()
                    .duration(function (d2,i) {return 10*d.endAngle})	
	                .style("opacity", function (d2,i) {
		                if(canHover || d2==d){return 1}else{return 0.5}
                    })
                    .transition()
	                .attrTween("d", arcTweenRad(outerRadius,0,true));	
			
		    }	
        })
        .on("mouseout", function (d) {
			if(canHover) {
			    d3.select(this).transition()
	            .attrTween("d", arcTweenRad(outerRadius,150,true));		
            }
		});

	Paths.transition()
        .duration(function (d,i) {return 200*d.endAngle})	
	    .style("opacity", 1)
	    .transition()
	    .attrTween("d", arcTweenRad(outerRadius,0,true));
});