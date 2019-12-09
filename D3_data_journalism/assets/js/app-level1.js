// level 1 app.js, code for level 1 assignment
// Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(myData, err) {
  if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    myData.forEach(function(data) {
        data.poverty=+data.poverty;
        data.healthcare=+data.healthcare;
    });

    // Step 2: Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d=>d.poverty)-1, d3.max(myData, d => d.poverty)+2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d=>d.healthcare)-1, d3.max(myData, d => d.healthcare)+2])
      .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("class", "stateCircle")
    .attr("r", "15");

    var circleText = chartGroup.selectAll("text")
    .data(myData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+6)
    .text(d => d.abbr);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("class", "aText")
      .classed("active", true)
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
