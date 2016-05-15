/*global d3*/
function buildChart(ds) {
    /* ds is a nested array containing text date and numeric value
    ["2015-04-01", 17913.7], ... */
    var w = 700;
    var h = 400;

    var yScale = d3.scale.linear()
                  .domain([0, d3.max(ds, function(d) {return d[1];})])
                  .range([0, h])

    var svg = d3.select('#root').append('svg').attr({width: w, height: h});
    svg.selectAll('rect')
        .data(ds)
        .enter()
        .append('rect')
            .attr('x', function(d,i) {
                return (i * w / ds.length);
            })
            .attr('y', function(d) {
                return h - yScale(d[1]);
            })
            .attr('width', w / ds.length)
            .attr('height', function(d){
              return yScale(d[1]);
            })
}
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, data) {
  if(error) {
    console.log(error);
  }
  buildChart(data.data);
});
