/*global d3*/
function buildChart(dataset) {
    /* dataset is a nested array containing text date and numeric value
    ["2015-04-01", 17913.7], ... */
    var w = 700;
    var h = 400;
    var padding = 1;
    //divisor scales data to fit in height. Likely better way when I learn more
    var divisor = d3.max(dataset, function(array) {
        return array[1];
    }) / h;
    var svg = d3.select('#root').append('svg').attr({width: w, height: h});
    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
            .attr('x', function(d,i) {
                return (i * w / dataset.length);
            })
            .attr('y', function(d,i) {
                return h - (d[1] / divisor);
            })
            .attr('width', w / dataset.length - padding)
            .attr('height', function(d) {
                return d[1] / divisor;
            });
}
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, data) {
  if(error) {
    console.log(error);
  }
  buildChart(data.data);
});
