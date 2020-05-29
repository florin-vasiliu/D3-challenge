// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;
  
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(dataPaper, chosenXAxis) {

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(dataPaper, d => d[chosenXAxis]) * 0.8,
        d3.max(dataPaper, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on axis label
function yScale(dataPaper, chosenYAxis) {

    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(dataPaper, d => d[chosenYAxis]) * 0.8,
        d3.max(dataPaper, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// Retrieve data from the CSV file 
d3.csv("assets/data/data.csv").then(function(dataPaper, err) {
    if (err) throw err;
  
    // parse data
    dataPaper.forEach(function(dataRow) {
        dataRow.healthcare = +dataRow.healthcare;
        dataRow.poverty = +dataRow.poverty
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(dataPaper, chosenXAxis);
    var yLinearScale = yScale(dataPaper, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.append("g")
    //    .classed("dataPoints", true)

    // create groups for each data point to be plotted
    var dataCircles = circlesGroup.selectAll("g")
        .data(dataPaper)
        .enter()
        .append("g")
        //move position of groups to the position on chart
        .attr("transform", d=> `translate(${xLinearScale(d[chosenXAxis])}, ${yLinearScale(d[chosenYAxis])})`);
    // append a circle to each datapoint group
    dataCircles.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", "10px")
        .classed("stateCircle", true)
    // append text to each datapoint group
    dataCircles.append("text")
        .text(d => d.abbr)
        .attr("x", 0)
        .attr("y", 2.5)
        .classed("stateText", true)
        .style("font-size", "10px")

    // create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height +20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "hair_length") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "hair_length") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");  
    
    var householdIncomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "hair_length") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

console.log("dataPaper",dataPaper)

}).catch(function(error) {
    console.log(error);
  });

