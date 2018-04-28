var svgBar = d3.select("svg")
    .append("g")
    .attr("id", "barChart")
    .attr("transform", "translate(" + 50 + "," + 0 + ")");

var color = '#F95738';

var primaryChart = d3.select("#primaryChart");
var district = primaryChart.attr("data-key");       //Initially undefined

var scalingFactor = 30;

var padding = 0;
var barHeight = 10;

var previousGradRate =0;
var format2 = d3.format("d");

/*
Check to see if a user has selected a district every time something in the svg element is clicked.
A new district is selected whenever a new slice of the pie chart is clicked.
All visualizations aree updated upon a new district selection.
*/
d3.selectAll("svg")
    .on("click", function () {

        var currentDistrict = primaryChart.attr("data-key");    //Get currently selected district

        if (currentDistrict !== district) {     //Check if the user has clicked on a new district

            district = currentDistrict;     //Set district to the newly-selected district

            key = district.replace(/\s+/g, '');     //Remove all spaces in the string so we can put it in a filename

            d3.select("#academics").remove();  //Delete previous bar chart if one's there
            d3.select("#ah").remove();  //Delete previous academics header if one's there
            d3.select("#tooltip").remove();  //Delete previous tooltips if they're there

            d3.select("#gh").remove();  //Delete previous grade header if one's there
            d3.select("#gf").remove();  //Delete previous grade footer if one's there
            d3.select("#grade").remove();  //Delete previous grade if one's there

            d3.select("#grh").remove();  //Delete previous grade header if one's there
            d3.select("#grf").remove();  //Delete previous grade footer if one's there
            d3.select("#gradRate").remove();  //Delete previous grade if one's there

            //Bar chart visualization
            d3.csv("Data/CentralOhio/Academics/" + key + "Academics.csv", function (data) {

                //Derived from: https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998

                svgBar.append("text")
                    .attr("id", "ah")
                    .attr("transform", "translate(" + (680) + "," + (350) + ")")
                    .attr("class", "header")
                    .attr('text-anchor', 'left')
                    .text(district);

                data.forEach(function (d) {
                    d.Percent = +d.Percent;
                });

                var height = 250;
                var width = 400;
                var x = d3.scaleLinear().range([0, width]);
                var y = d3.scaleBand().range([height, 0]);

                var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "toolTip")
                    .attr("id", "tooltip");
                
                var g = svgBar.append("g")
                    .attr("id", "academics")
                    .attr("transform", "translate(" + 810 + "," + 375 + ")");

                x.domain([0, d3.max(data, function (d) { return d.Percent; })]);
                y.domain(data.map(function (d) { return d.Category; })).padding(0.3);

                g.append("g")
                    .attr("class", "barY")
                    .call(d3.axisLeft(y));
               
                g.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 3)
                    .attr("height", y.bandwidth())
                    .attr("y", function (d) { return y(d.Category); })
                    .attr("fill", "#105370")
                    .on("mousemove", function (d) {
                        tooltip
                            .style("left", d3.event.pageX - 50 + "px")
                            .style("top", d3.event.pageY - 70 + "px")
                            .style("display", "inline-block")
                            .html(d.Percent + "% of student body" + "<br>" + "considered " + d.Category);
                    })
                    .on("mouseout", function (d) { tooltip.style("display", "none"); })
					.transition().duration(1000).attr("width", function (d) { return x(d.Percent); });
            });

            //Grade Visualization
            d3.csv("Data/CentralOhio/FundingVsAchievement.csv", function (data) {
                data.forEach(function (d) {
                    if (d.District == district) {

                        svgBar.append("text")
                            .attr("id", "grade")
                            .attr("transform", "translate(" + (1035) + "," + (150) + ")")
                            .attr("dy", "0.35em")
                            .attr("class", "grade")
                            .attr('text-anchor', 'left')
                            .text(d.Grade);

                        svgBar.append("text")
                            .attr("id", "gh")
                            .attr("transform", "translate(" + (1040) + "," + (65) + ")")
                            .attr("class", "header")
                            .attr('text-anchor', 'left')
                            .text(district);

                        svgBar.append("text")
                            .attr("id", "gf")
                            .attr("transform", "translate(" + (1040) + "," + (260) + ")")
                            .attr("class", "footer")
                            .attr('text-anchor', 'left')
                            .text("Assigned Performance Index Grade");

                    }
                });  
            });

            //Grad rate visualization
            d3.csv("Data/CentralOhio/FundingVsGradRate.csv", function (data) {

                data.forEach(function (d) {
                    if (d.District == district) {

                        txt2 =svgBar.append("text")
                            .attr("id", "gradRate")
                            .attr("transform", "translate(" + (680) + "," + (150) + ")")
                            .attr("dy", "0.35em")
                            .attr("class", "gradRate")
                            .attr('text-anchor', 'left')
                            .text(previousGradRate);

                        svgBar.append("text")
                            .attr("id", "grh")
                            .attr("transform", "translate(" + (680) + "," + (65) + ")")
                            .attr("class", "header")
                            .attr('text-anchor', 'left')
                            .text(district);

                        svgBar.append("text")
                            .attr("id", "grf")
                            .attr("transform", "translate(" + (680) + "," + (260) + ")")
                            .attr("class", "footer")
                            .attr('text-anchor', 'left')
                            .text("Graduation Rate");
							
						txt2.transition().duration(750).tween("text", function() {
				            previousGradRate= d.GradRate;
                            var that = txt2,
                            i = d3.interpolateNumber(that.text().replace(/,||%/g, ""), previousGradRate);
                            return function(t) { that.text(format2(i(t))+"%"); };
                        });
                    }
                });
            });
        }
    });