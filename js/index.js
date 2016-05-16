/* global d3 */

var w = 1000;
var h = 600;

d3.select('.container')
  .style('width', w + 'px');

d3.select('#root')
  .append('h1')
  .html('U.S. Gross Domestic Product');

function buildChart(ds) {
  /* ds is a nested array containing text date and numeric value
  ["2015-04-01", 17913.7], ... */

  function formatTooltip(num, date) {
    var formatNum = d3.format('$,.1f');
    var year = date.slice(0, 4);
    var qtr = Math.ceil(date.slice(5, 7) / 12 * 4);
    return (formatNum(num) + ' billion<br/>' + year + ' Q' + qtr);
  }

  var margin = {
    top: 5,
    right: 10,
    bottom: 30,
    left: 60
  };

  var tooltip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  var xScale = d3.scale.ordinal()
    .domain(d3.range(ds.length))
    .rangeBands([margin.left + 1, w - margin.right]);

  var minDate = new Date(ds[0][0]);
  var maxDate = new Date(ds[ds.length - 1][0]);

  var xTimeScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([margin.left, w - margin.right]);

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
    .text('(Billions of Dollars)');

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
    .attr('width', Math.ceil(xScale.rangeBand())) // ceil to smooth lines from float pt between bars
    .attr('height', function(d) {
      return (yScale(0) - yScale(d[1]));
    })
    .on('mouseover', function(d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 1);
      tooltip.html(formatTooltip(d[1], d[0]))
        .style('left', (d3.event.pageX + 5) + 'px')
        .style('top', (d3.event.pageY - 40) + 'px');
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(250)
        .style('opacity', 0);
    });
}
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
function(error, data) {
  // if (error) {
  //   console.log(error);
  // }
  buildChart(data.data);
});
