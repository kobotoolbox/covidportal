//default chart dimensions + margins
var default_width = 800;
var default_height = 300;
var default_ratio = default_width / default_height;
var margin = {top: 30, right: 125, bottom: 30, left: 125};

//set_vars() updates default chart dimensions + margins according to window size
function set_vars() {
    current_width = window.innerWidth*0.75;
    current_height = window.innerHeight;
    current_ratio = current_width*1.333 / current_height;
        
    //height is limiting dimension
    if (current_ratio > default_ratio ){ 
        h = current_height;
        w = h * default_ratio;
      } 
    //width is limiting dimension
        else {
        w = current_width;
        h = w / default_ratio;
      }
    //redefining margins
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;
};

set_vars();

//drawGraphic() takes in a specfic subset of data (ie "Group1", "Question1") and aggregation level (ie 'Aggregated') and produces a bar chart 
function drawGraphic(group,question,agg) {
    
    //reading data (.csv)
    d3.csv(csv, function(data)
        {
        //selecting specific subset of data to chart (group and question)
        var graphData = data.filter(function(d){ return d.group === group & d.question === question })
        
        //appending svg object to body of the page
        var svg = d3.select("#container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        
        //setting chart background color/styling 
        svg
            .append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("height", height + 10)
            .attr("width", width + 10)
            .style("fill", "#F1FAFF");
        
        //extracting subgroups for charting
        //non-aggregated charts (single bar)
        if (agg == "Total")
        {
            var subgroups = [data.columns.slice(2)[1]]
        }
        
        //aggregated charts (multi bar)
        if (agg == "Aggregated")
        {
            var subset = data.columns.slice(2)
            subset.shift()
            subset.shift()
            var subgroups = subset
        }
        
        //specific aggregation levels (single bar)
        if (agg == "1")
        {
            var subgroups = [data.columns.slice(2)[2]]
        }
        if (agg == "2")
        {
            var subgroups = [data.columns.slice(2)[3]]
        }
        if (agg == "3")
        {
            var subgroups = [data.columns.slice(2)[4]]
        }
        if (agg == "4")
        {
            var subgroups = [data.columns.slice(2)[5]]
        }
        if (agg == "5")
        {
            var subgroups = [data.columns.slice(2)[6]]
        }
        
        //extracting groups for color scale
        var groups = d3.map(graphData, function(d){return(d.response)}).keys()
        
        //defining color palette (WHO)
        var colors = ['#90DEFF', '#5CC6F2', '#008DC9', '#2B5487','#7B7F97','#ACAFC5','#D3D5E2','#EBEDF4']
        
        //defining single color for non-aggregated charts (single bar)
        if (agg == "Total"||"1"||"2"||"3"||"4"||"5")
        {
            var colors = ['#5CC6F2']
        }
        
        //defining color scale
        var color = d3.scaleOrdinal()
        .domain(groups)
        .range(colors)
        
        //defining discrete band scale for x axis
        var x = d3.scaleBand().range([0, width]).padding([0.25])
        //defining linear scale for y axis 
        var y = d3.scaleLinear().range([height, 0]);
        
        //providing domain values to x, y axis'
        x.domain(groups) //automated
        y.domain([0, 1]); 
        
        //defining a directe band scale for subgroup positioning
        xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.025])
        
        //appending x axis to svg
        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(-height*1.3).ticks())
            .select('.domain').remove();
        
        //appending y axis to svg
        svg
            .append("g")
            .call(d3.axisLeft(y).tickSize(-width*1.3).ticks())
            .select('.domain').remove();
        
        //appending background styling to svg
        svg.selectAll('.tick line').attr('stroke','white')
        
        //defining/styling on-hover tooltip
        var Tooltip = d3.select("#container")
        .append('div')
        .style("opacity", 0.9)
        .attr("class", "tooltip")
        .style("background-color", '#EBEBEB')
        .style("padding", "2px")
        .style("position", "absolute")
        .style("font-size", "1vw")
        
        //defining mouseover, mousemove and mouseout functions
        var mouseover = function(d) 
        {
            Tooltip
                .style("opacity",1)
            d3.select(this)
                .style("fill", "#414453")
                .style("opacity", 1)
        }
        var mousemove = function(d) 
        {
            Tooltip
                .html(d.key + "</br>" + d.value)
                .style("left", (d3.mouse(this)[0]) + 50)
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseout = function(d) 
        {
            Tooltip
                .style("opacity",0)
            d3.select(this)
                .style("left", (d3.event.pageX-document.getElementById('container').offsetLeft+2) + "px")
                .style("top", (d3.event.pageY-document.getElementById('container').offsetTop-document.getElementById('container').offsetTop) + "px");
        }
        //defining mouseover, mousemove and mouseout functions
        var mouseover = function(d) 
        {
            Tooltip
                .style("opacity",1)
            d3.select(this)
                .style("fill", "#414453")
                .style("opacity", 1)
        }
        var mousemove = function(d) 
        {
            Tooltip
                .html(d.key + "</br>" + d.value)
                .style("left", (d3.event.pageX-document.getElementById('container').offsetLeft+2) + "px")
                .style("top", (d3.event.pageY-document.getElementById('container').offsetTop-document.getElementById('container').offsetTop) + "px");
        }
        var mouseout = function(d) 
        {
            Tooltip
                .style("opacity",1)
            d3.select(this)
                .style("fill", function(d) { return color(d.key); })
                .style("opacity", 1)
        }
        
        //appending bars to svg
        svg
            .append("g")
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
        
        //appending/styling title label
        svg
            .append("text")
            .attr("x", (width / 2))
            .attr("y", 5 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "1vw")
            .style("text-decoration", "underline")
            .text(question + " (" + group + ")");
        
        //appending/styling label for the x axis
        svg
            .append("text")
            .attr("transform","translate(" + (width/2) + " ," + (height + 27.5) + ")")
            .attr("text-anchor", "middle")
            .style("font-size", "0.5vw")
            .style("text-decoration", "underline")
            .text("Response");
        
        //appending/styling label for the y axis
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - 50)
            .attr("x",0 - (height / 2))
            .attr("dy", "0.7em")
            .attr("text-anchor", "middle")
            .style("font-size", "0.5vw")
            .style("text-decoration", "underline")
            .text("Value (%)");
    });
};

//defining a timer for chart resizing
var resizeTimer;

//function to resize charts when window resizes
window.onresize = function(event) 
{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() 
        {
        var s = d3.selectAll('svg');
        s = s.remove();
        set_vars();
        drawGraphic();
        }, 30);
}
