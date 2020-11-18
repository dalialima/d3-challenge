// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
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

d3.csv("assets/data/data.csv").then(function(mainData) {
    mainData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // create linear scale for x and y

    var xLinearScale = d3.scaleLinear()
        .domain([0,d3.max(mainData, n=> n.poverty)])
        .range([0,width])
    
    var yLinearScale = d3.scaleLinear()
        .domain([0,d3.max(mainData, n=> n.healthcare)])
        .range([height,0])
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale);


        // Append the group elements
    chartGroup.append("g")
        .call(leftAxis)

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(mainData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .classed("stateCircle",true)
        //.attr("opacity", ".5");


        chartGroup.selectAll()
            .data(mainData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .text(n => n.abbr)
            .classed("stateText", true)
            .attr("font-size","8px")


        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return(`${d.state}<br>Poverty: ${d.poverty} % <br> healthcare: ${d.healthcare}`)
            });

        chartGroup.call(toolTip);


        circlesGroup.on("mouseover", function(data){
            toolTip.show(data,this);
        })

            .on("mouseout", function(data, index){
                toolTip.hide(data);
            })
        
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Healthcare")
            .attr("font-weight", "bold");

        chartGroup.append("text")
            .attr("transform", `translate(${width/2}, ${height+40})`)
            .attr("class", "axisText")
            .text("Poverty %")
            .attr("font-weight", "bold");













}).catch(function(error){
    console.log(error)
});