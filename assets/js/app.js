// @TODO: YOUR CODE HERE!
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(dataRow) {
        dataRow.healthcare = +dataRow.healthcare;
    });
    console.log(data)
}).catch(function(error) {
    console.log(error);
  });