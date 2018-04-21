//Gauge chart derived from here: https://stackoverflow.com/questions/44164912/d3-gauge-chart-with-labels-and-percentages

var radius = 30

var svgGauge = d3.select("svg")
    .append("g")
    .attr("id", "gaugeChart")
    .attr("transform", "translate(" + 50 + "," + 0 + ")");

var color = '#F95738';

var primaryChart = d3.select("#primaryChart");
var district = primaryChart.attr("data-key");       //Initially undefined
console.log("Original key: " + district);


/*
Check to see if a user has selected a district every time something in the svg element is clicked.
Probably not the best way to do things but it works.
A new district is selected whenever a new slice of the pie chart is clicked.
*/
d3.selectAll("svg")
    .on("click", function () {

        var currentDistrict = primaryChart.attr("data-key");    //Get currently selected district

        console.log("Clicked, key: " + currentDistrict);

        if (currentDistrict !== district) {     //Check if the user has clicked on a new district
            console.log("District changed!");

            district = currentDistrict;     //Set district to the newly-selected district

            key = district.replace(/\s+/g, '');     //Remove all spaces in the string so we can put it in a filename

            d3.csv("temp data/" + key + ".csv", function (csvData) {    //Still WIP, can be tested with Columbus City and Cleveland Municipal districts

                var data = [-1, -1, -1, -1, -1];
                var i = 0;

                csvData.forEach(function (d) {      //Store percentages from our temporary datasets into the data array
                    d.Percent = +d.Percent;
                    data[i] = d.Percent;
                    i++;
                });
                
                console.log("new data loaded: " + data);

                d3.selectAll("#gChart").remove();   //Remove previous chart if one exists

                refreshVisualization(data);     //Re-render chart with new data
            });
        }
        else
            console.log("District not changed!");
    });


function refreshVisualization(data) {

    var arcs = data.map((v, i) => {
        return d3.arc()
            .innerRadius(i * 20 + radius)
            .outerRadius((i + 1) * 20 - 5 + radius)
    });

    var pieData = data.map((v, i) => {
        return [{ value: v * 0.75, arc: arcs[i] }, { value: (100 - v) * 0.75, arc: arcs[i] }, { value: 100 * 0.25, arc: arcs[i] }]
    })

    var pie = d3.pie()
        .sort(null)
        .value(d => d.value)

    var g = svgGauge.selectAll('g')
        .data(pieData)
        .enter()
        .append('g')
        .attr("id", "gChart")
        .attr('transform', 'translate(250,250) rotate(180)').attr('fill-opacity', (d, i) => 2 / (i + 1))

    g.selectAll('path')
        .data(d => { return pie(d) }).enter()
        .append('path')
        .attr("id", "gPath")
        .attr('d', d => { return d.data.arc(d) })
        .attr('fill', (d, i) => i == 0 ? color : 'none')

    svgGauge.selectAll('g').each(function (d) {
        var el = d3.select(this);

        el.selectAll('path').each((r, i) => {

            if (i == 1) {
                var centroid = r.data.arc.centroid({ startAngle: r.startAngle + 0.05, endAngle: r.startAngle + 0.001 + 0.05 })
                g.append('text')
                    .attr("class", "gauge")
                    .text(100 - Math.floor(r.value) + '%')
                    .attr("id", "gText")
                    .attr('transform', `translate(${centroid[0]},${centroid[1]}) rotate(${180 / Math.PI * (r.startAngle) + 7})`).attr('alignment-baseline', 'middle')
            }
        })
    })
}
