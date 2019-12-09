// Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg2 = d3
  .select("#scatter2")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup2 = svg2.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(myData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenXAxis])*0.85,
        d3.max(myData, d => d[chosenXAxis])*1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }
  
  // function used for updating y-scale var upon click on axis label
  function yScale(myData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(myData, d => d[chosenYAxis]*0.85),
        d3.max(myData, d => d[chosenYAxis])*1.2
      ])
      .range([height, 0]);
      return yLinearScale;
  } 
  
  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }
    
  // function used for updating circles group with a transition to new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with a transition to new circles
function renderCircleText(circleText, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circleText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis])+6)
        .text(d => d.abbr);
    
    return circleText;
}

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {
    var xlabel ="";
    var ylabel ="";
  
    if (chosenXAxis === "poverty") {
      xlabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age (Median)";
    }    
    else {
      xlabel = "Household Income (Median)";
    }
  
    if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokes (%)";
    }    
    else {
      ylabel = "Obese (%)";
    } 
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}%<br>${chosenYAxis}: ${d[chosenXAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup
      .on("mouseover", function(data) {
      toolTip.show(data);
      })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  } //end of updateToolTip function

  // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(myData, err) {
    if (err) throw err;
  
    // parse data
    myData.forEach(function(data) {
        data.poverty=+data.poverty;
        data.age=+data.age;
        data.income=+data.income;
        data.healthcare=+data.healthcare;
        data.obesity=+data.obesity;
        data.smokes=+data.smokes;
    });

      // xLinearScale function above csv import
  var xLinearScale = xScale(myData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(myData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis to the chrt
  var xAxis = chartGroup2.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis=chartGroup2.append("g")
    .call(leftAxis);

      // append initial circles
  var circlesGroup2 = chartGroup2.selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("class", "stateCircle");

  var circleText2 = chartGroup2.selectAll("text")
    .data(myData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+6)
    .text(d => d.abbr);

  // Create group for  3 x- axis labels
  var labelsXGroup = chartGroup2.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 15})`);

  var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("value", "poverty") 
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") 
    .classed("inactive", true)
    .text("Age (Median)"); 

  var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") 
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for  3 y- axis labels
  var labelsYGroup = chartGroup2.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em");

  var healthCareLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") 
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokeLabel = labelsYGroup.append("text")
  .attr("y", 0 - margin.left+40)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") 
    .classed("inactive", true)
    .text("Smokes (%)");

  var obeseLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left+20)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") 
    .classed("inactive", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup2 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup2);

  // x axis labels event listener
  labelsXGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            // replaces chosenXAxis with value
            chosenXAxis = value;

            // updates scales for new data
            xLinearScale = xScale(myData, chosenXAxis); 

            // updates axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup2 = renderCircles(circlesGroup2, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            circleText2 = renderCircleText(circleText2, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup2 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup2);

            // changes x classes to change bold text for x axis
            if (chosenXAxis === "poverty") {
                povertyLabel
                .classed("active", true)
                .classed("inactive", false);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else if (chosenXAxis === "age"){
                ageLabel
                .classed("active", true)
                .classed("inactive", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            } else {
                incomeLabel
                .classed("active", true)
                .classed("inactive", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                ageLabel
                .classed("active", false)
                .classed("inactive", true);
            }
        }
    }) // end of x axis onclick labels event listener

  // y axis labels event listener
  labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // level 2 app.js, code for level 2 assignment
        // replaces chosenXAxis with value
        chosenYAxis = value;

        // updates scales for new data
        yLinearScale = yScale(myData, chosenYAxis);

        // updates axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup2 = renderCircles(circlesGroup2, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circleText2 = renderCircleText(circleText2, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup2 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup2);

        // changes y classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthCareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes"){
          smokeLabel
            .classed("active", true)
            .classed("inactive", false);
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
        }          
    } 
}) // end of y axis on click labels event listener


}).catch(function(error) {
    console.log(error);
});