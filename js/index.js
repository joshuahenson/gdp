/* global d3 */
// temp manual assignment of width
var w = 1000;
var h = 700;

d3.select('.container')
  .style('width', w + 'px');

d3.select('#root')
  .append('h1')
  .html('U.S. Gross Domestic Product');

function addDescription(desc) {
  d3.select('#root').append('div')
    .attr('class', 'description')
    .html(desc);
}
function buildChart(ds) {
  /* ds is a nested array containing text date and numeric value
  ["2015-04-01", 17913.7], ... */
  var margin = {
    top: 5,
    right: 10,
    bottom: 30,
    left: 60
  };

  var xScale = d3.scale.ordinal()
    .domain(d3.range(ds.length))
    .rangeBands([margin.left + 1, w - margin.right - 1]);

  // todo fix hardcode
  var minDate = new Date(ds[0][0]);
  var maxDate = new Date(ds[274][0]);

  var xTimeScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([margin.left + 1, w - margin.right - 1]);

  var yScale = d3.scale.linear()
    .domain([0, d3.max(ds, function(d) {
      return d[1];
    })])
    .range([h - margin.bottom, margin.top]);

  var xAxis = d3.svg.axis()
    .scale(xTimeScale)
    .ticks(d3.time.year, 5);

  var yAxis = d3.svg.axis().scale(yScale).orient('left');

  var svg = d3.select('#root').append('svg').attr({
    width: w,
    height: h,
    class: 'chart'
  });

  // append x axis
  svg.append('g').call(xAxis)
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + (h - margin.bottom) + ')');

  // append x label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform',
      'translate(10,' + ((h - margin.top - margin.bottom) / 2 + margin.top) + ')rotate(-90)')
    .text('GDP in billions of dollars');

  // append y axis
  svg.append('g').call(yAxis)
    .attr('class', 'axis')
    .attr('transform', 'translate(' + margin.left + ', 0)');

  // append y label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform',
      'translate(' + ((w - margin.left - margin.right) / 2 + margin.left) +
      ', ' + h + ')')
    .text('Year');

  // append bars
  svg.selectAll('rect')
    .data(ds)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return xScale(i);
    })
    .attr('y', function(d) {
      return yScale(d[1]);
    })
    .attr('width', xScale.rangeBand())
    .attr('height', function(d) {
      return (yScale(0) - yScale(d[1]));
    });
}
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
function(error, data) {
  if (error) {
    console.log(error);
  }
  // console.log(data);
  buildChart(data.data);
  addDescription(data.description);
});
