
var svgGrade = d3.select("svg")
    .append("g")
    .attr("id", "Grade")
    .attr("transform", "translate(" + 100 + "," + 0 + ")");

var color = '#F95738';

var primaryChart = d3.select("#primaryChart");
var district = primaryChart.attr("data-key");       //Initially undefined

var scalingFactor = 30;

var padding = 0;
var barHeight = 10;

/*
Check to see if a user has selected a district every time something in the svg element is clicked.
A new district is selected whenever a new slice of the pie chart is clicked.

Individual academics datasets unique to each district should be placed in
Data/CentralOhio/Academics/[DistrictName]Academics.csv
*/

d3.selectAll("svg")
    .on("click", function () {

        var currentDistrict = primaryChart.attr("data-key");    //Get currently selected district

        if (currentDistrict !== district) {     //Check if the user has clicked on a new district

            district = currentDistrict;     //Set district to the newly-selected district

            key = district.replace(/\s+/g, '');     //Remove all spaces in the string so we can put it in a filename

            d3.csv("Data/CentralOhio/FundingVsAchievement.csv", function (data) {

                d3.select("#grade").remove();  //Delete previous grade if one's there

                
                data.forEach(function (d) {
                    if (d.District == district) {

                        //console.log(d.Grade);

                        svgGrade.append("text")
                            .attr("id", "grade")
                            .attr("transform", "translate(" + (50) + "," + (175) + ")")
                            .attr("dy", "0.35em")
                            .attr("id", "l")
                            .attr("class", "funds")
                            .attr('text-anchor', 'left')
                            .text(d.Grade);
                    }
                });
            });
        }
    });
