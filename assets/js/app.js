// @TODO: YOUR CODE HERE!

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = Math.min(window.innerWidth, 800);
  var svgHeight = Math.min(window.innerHeight, 500);
  console.log("window.innerWidth",window.innerWidth)
  console.log("window.innerHeight",window.innerHeight)

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
  var chosenYAxis = "obesity";

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

  // function used for updating xAxis var upon click on axis label
  function renderXAxes(xLinearScale, xAxis) {
    var bottomAxis = d3.axisBottom(xLinearScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
  function renderYAxes(yLinearScale, yAxis) {
    var leftAxis = d3.axisLeft(yLinearScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }

  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(dataCircles, chosenXAxis, chosenYAxis) {
    var renderXLinearScale = xScale(dataCircles.data(), chosenXAxis)
    var renderYLinearScale = yScale(dataCircles.data(), chosenYAxis)
    dataCircles.transition()
      .duration(1000)
      .attr(
        "transform", d=> `translate(${renderXLinearScale(d[chosenXAxis])}, 
        ${renderYLinearScale(d[chosenYAxis])})`
      );
      

    return dataCircles;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, dataCircles) {
    //designing tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`
        State: ${d.state} <br>
        ${chosenXAxis}: ${d[chosenXAxis]} <br>
        ${chosenYAxis}: ${d[chosenYAxis]}`)
      });
    dataCircles.call(toolTip);

    //adding events
    dataCircles.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return dataCircles;
  }

  // Retrieve data from the CSV file 
  d3.csv("assets/data/data.csv").then(function(dataPaper, err) {
      if (err) throw err;
    
      // parse data
      dataPaper.forEach(function(dataRow) {
          dataRow.healthcare = +dataRow.healthcare;
          dataRow.poverty = +dataRow.poverty;
          dataRow.age = +dataRow.age;
          dataRow.obesity = +dataRow.obesity;
          dataRow.smokes = +dataRow.smokes;
          dataRow.healthcareLow = +dataRow.healthcareLow;
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
      var yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          //.attr("transform", "rotate(-90) "+`translate(${0-height/2}, ${0-margin.left})`)
          .call(leftAxis);

      var circlesGroup = chartGroup.append("g")

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
      //dataCircles.exit().remove()

      // create group for 3 x-axis labels
      var xLabelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width/2}, ${height +20})`);

      var povertyLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty") // value to grab for event listener
          .classed("active", true)
          .text("In Poverty (%)");

      var ageLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "age") // value to grab for event listener
          .classed("inactive", true)
          .text("Age (Median)");  
      
      var householdIncomeLabel = xLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "income") // value to grab for event listener
          .classed("inactive", true)
          .text("Household Income (Median)");

      // create group for 3 y-axis labels
      var yLabelsGroup = chartGroup.append("g")
          .attr("transform", "rotate(-90) "+`translate(${0-height/2}, ${0-margin.left})`)
          //.attr("transform", `translate(${0}, ${height/2})`)
          
      var obeseLabel = yLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "obesity") // value to grab for event listener
          .classed("active", true)
          .text("Obese (%)");

      var lackesHealthcareLabel = yLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "smokes") // value to grab for event listener
          .classed("inactive", true)
          .text("Smokes (%)");    

      var povertyLabel = yLabelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "healthcareLow") // value to grab for event listener
          .classed("inactive", true)
          .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, dataCircles);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {

        //make all options inactive
        xLabelsGroup.selectAll("text").classed("active",false).classed("inactive",true)
        
        // get value of selection
        var value = d3.select(this).attr("value");

        //activate selected axis
        switch (value){
          case "poverty":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
          case "age":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
          case "income":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
        }

        //render data on chart
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(dataPaper, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updates circles with new x,y values
          dataCircles = renderCircles(dataCircles, chosenXAxis, chosenYAxis);

          // updates tooltips with new info
          dataCircles = updateToolTip(chosenXAxis, chosenYAxis, dataCircles);

        }
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {

        //make all options inactive
        yLabelsGroup.selectAll("text").classed("active",false).classed("inactive",true)
        
        // get value of selection
        var value = d3.select(this).attr("value");

        //activate selected axis
        switch (value){
          case "obesity":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
          case "smokes":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
          case "healthcareLow":
            d3.select(this)
              .classed("active", true)
              .classed("inactive", false)
          break;
        }
        
        if (value !== chosenYAxis) {

          // replaces chosenYAxis with value
          chosenYAxis = value;

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(dataPaper, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new x,y values
          dataCircles = renderCircles(dataCircles, chosenXAxis, chosenYAxis);

          // updates tooltips with new info
          dataCircles = updateToolTip(chosenXAxis, chosenYAxis, dataCircles);

        }
      });




  console.log("dataPaper",dataPaper)

  }).catch(function(error) {
      console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);