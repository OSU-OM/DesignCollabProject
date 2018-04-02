var svg = d3.select("svg");

var width = svg.attr("width");
var height = svg.attr("height");

var paleGreen = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#dbf4ad")

var skyBlue = svg.append("rect")
    .attr("x", 100)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#6df2ff")

var plum = svg.append("rect")
    .attr("x", 200)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#8f3985")

var teal = svg.append("rect")
    .attr("x", 300)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#40798c")

var brown = svg.append("rect")
    .attr("x", 400)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "#4c3a2b")

svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 100 + ")")
    .append("text")
    .text("#DBF4AD")
    .attr("class", "palette")

svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .append("text")
    .text("#6DF2FF")
    .attr("class", "palette")

svg.append("g")
    .attr("transform", "translate(" + 200 + "," + 100 + ")")
    .append("text")
    .text("#8F3985")
    .attr("class", "palette")

svg.append("g")
    .attr("transform", "translate(" + 300 + "," + 100 + ")")
    .append("text")
    .text("#40798C")
    .attr("class", "palette")

svg.append("g")
    .attr("transform", "translate(" + 400 + "," + 100 + ")")
    .append("text")
    .text("#4C3A2B")
    .attr("class", "palette")