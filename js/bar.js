// Set default width and height, calculate ratio
var default_width = 800;
var default_height = 300;
var default_ratio = default_width / default_height;

// set the dimensions and margins of the graph
var margin = {top: 30, right: 125, bottom: 30, left: 125};

    // Determine current size, which determines vars
    function set_vars() {
      //alert('setting vars')
      current_width = window.innerWidth*0.75;
      current_height = window.innerHeight;

      current_ratio = current_width*1.333 / current_height;

      // Check if height is limiting factor
      if ( current_ratio > default_ratio ){
        h = current_height;
        w = h * default_ratio;
      // Else width is limiting
      } else {
        w = current_width;
        h = w / default_ratio;
      }

// Set new width and height based on graph dimensions
width = w - margin.left - margin.right;
height = h - margin.top - margin.bottom;

};

set_vars();

function drawGraphic(group,question) {

//reading the data (.csv)
d3.csv(csv, function(data) {
console.log(data)

var graphData = data.filter(function(d){ return d.group === group & d.question === question })
console.log(graphData)


  //appending svg object to body
  var svg = d3.select("#container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
   .attr("transform","translate(" + margin.left + "," + margin.top + ")");

   //setting background color (ggplot2 styling)
   svg
   .append("rect")
   .attr("x",0)
   .attr("y",0)
   .attr("height", height + 10)
   .attr("width", width + 10)
   .style("fill", "#F1FAFF");

  //extracting subgroups
  var subgroups = data.columns.slice(2)

  //extracting groups
  var groups = d3.map(graphData, function(d){return(d.response)}).keys()

  //defining color palette (WHO)
  var colors = ['#90DEFF', '#5CC6F2', '#008DC9', '#2B5487','#7B7F97','#ACAFC5','#D3D5E2','#EBEDF4']

  //defining color scale
  var color = d3.scaleOrdinal()
    .domain(groups)
    .range(colors)

  //defining discrete band scale for x axis
  var x = d3.scaleBand().range([0, width]).padding([0.25])

  //defining linear scale for y axis
  var y = d3.scaleLinear().range([height, 0]);

  //providing domain values to x, y axis'
  x.domain(groups)
  y.domain([0, 1]);

  //defining a scale for subgroup positioning
  xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.025])

  //adding x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.3).ticks())
    .select('.domain').remove();

  //adding y axis
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks())
    .select('.domain').remove();

  //plotting background customization (ggplot2 styling)
  svg.selectAll('.tick line').attr('stroke','white')

  //defining tooltip
  var Tooltip = d3.select("#container")
  .append('div')
  .style("opacity", 0.9)
  .attr("class", "tooltip")
  .style("background-color", '#EBEBEB')
  .style("padding", "2px")
  .style("position", "absolute")
  .style("font-size", "1vw")

  //defining mouseover, mousemove and mouseout functions
    var mouseover = function(d) {
      Tooltip.
      style("opacity",1)
      d3.select(this)
        .style("fill", "#414453")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.key + "</br>" + d.value)
        .style("left", (d3.mouse(this)[0]) + 50)
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseout = function(d) {
      Tooltip.
      style("opacity",0)
      d3.select(this)
      .style("left", (d3.event.pageX-document.getElementById('container').offsetLeft+2) + "px")
      .style("top", (d3.event.pageY-document.getElementById('container').offsetTop-document.getElementById('container').offsetTop) + "px");
    }

  //defining mouseover, mousemove and mouseout functions
    var mouseover = function(d) {
      Tooltip.
      style("opacity",1)
      d3.select(this)
        .style("fill", "#414453")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.key + "</br>" + d.value)
        .style("left", (d3.event.pageX-document.getElementById('container').offsetLeft+2) + "px")
        .style("top", (d3.event.pageY-document.getElementById('container').offsetTop-document.getElementById('container').offsetTop) + "px");
    }
    var mouseout = function(d) {
      Tooltip.
      style("opacity",1)
      d3.select(this)
        .style("fill", function(d) { return color(d.key); })
        .style("opacity", 1)
    }

  //adding the bars
  svg.append("g")
    .selectAll("g")
    .data(graphData)
    .enter()
    .append("g")
      .attr("transform", function(graphData) { return "translate(" + x(graphData.response) + ",0)"; })
    .selectAll("rect")
    .data(function(graphData) { return subgroups.map(function(key) { return {key: key, value: graphData[key]}; }); })
    .enter().append("rect")
    .on('mouseover',mouseover) //listener for mouseover event
    .on("mousemove",mousemove) //listener for mousemove event
    .on('mouseout',mouseout) //listener for mouseout event
      .attr("height", function(graphData) { return height - y(graphData.value); })
      .attr("x", function(graphData) { return xSubgroup(graphData.key); })
      .attr("y", function(graphData) { return y(graphData.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("fill", function(graphData) { return color(graphData.key); });

  //adding title label
  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 5 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "1.5vw")
        .style("text-decoration", "underline")
        .text(question);

  //text label for the x axis
  svg.append("text")
  .attr("transform","translate(" + (width/2) + " ," + (height + 27.5) + ")")
  .attr("text-anchor", "middle")
  .style("font-size", "1.25vw")
  .style("text-decoration", "underline")
  .text("Response");

  // text label for the y axis
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x",0 - (height / 2))
    .attr("dy", "0.7em")
    .attr("text-anchor", "middle")
    .style("font-size", "1.25vw")
    .style("text-decoration", "underline")
    .text("Value (%)");
});

};

//setting a timer to keep the chart from constantly resizing
var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    var s = d3.selectAll('svg');
    s = s.remove();
    set_vars();
    drawGraphic();
  }, 100);
}
