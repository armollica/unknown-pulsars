var width = 600,
    height = 650,
    nLines = 70;

var scale = {
  x: d3.scale.linear()
      .domain([0, 1])
      .range([0, width]),
  y: d3.scale.linear()
      .domain([0, nLines])
      .range([height, 0])
};

var makePath = d3.svg.line()
      .x(function(d) { return scale.x(d.x); })
      .y(function(d) { return scale.y(d.y); })
      .interpolate('bundle');

var svg = d3.select('body').append('svg')
      .attr('class', 'pulsar')
      .attr('width', width)
      .attr('height', height);

var data = d3.range(0, nLines)
      .map(function(y) {
        return [
          {x: 0, y: y},
          {x: .25, y: y},
          {x: .75, y: y},
          {x: 1, y: y}
        ];
      })
      .reverse();

svg.selectAll('.line').call(update, data, 0);

var displayText = false,
    infoButton = d3.select('.info'),
    refreshButton = d3.select('.refresh'),
    text = d3.select('.text');

infoButton.on('click', function() {
    if (displayText === false) {
      text.style('display', 'block');
      infoButton.classed('displayed', true);
    }
    else {
      text.style('display', 'none');
      infoButton.classed('displayed', false);
    }
    displayText = !displayText;
  });

refreshButton.on('click', function() {
  data = d3.range(0, nLines)
    .map(function(y) {
      return [
        {x: 0, y: y},
        {x: .25, y: y},
        {x: .75, y: y},
        {x: 1, y: y}
      ];
    })
    .reverse();

  svg.selectAll('.line').call(update, data, 500);

  refreshButton
      .style('color', 'white')
    .transition().duration(500)
      .style('color', '#333');
});

function update(selection, data, duration) {
  var lines = selection.data(data);

  lines.enter().append('path')
    .attr('class', 'line')
    .on('mouseenter', mouseenter);

  lines
    .transition().duration(duration)
      .attr('d', makePath);

  lines.exit().remove();
}

var bisect = d3.bisector(function(d) { return d.x; }).left;

function mouseenter(thisRow) {
  var mouse = d3.mouse(this)
      x = scale.x.invert(mouse[0]),
      y = scale.y.invert(mouse[1]);

  if (x > .3 && x < .7) {
    data.forEach(function(row) {
      if (row === thisRow) {
        var i = bisect(row, x);
        row.splice(i, 0, {
          x: x,
          y: row[0].y + 6*Math.random()
        });
      }
    });
    svg.selectAll('.line').call(update, data, 0);
  }
}
