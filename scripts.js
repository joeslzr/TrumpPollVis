

//TODO: Draw graph on pageload (not sure why this doesnt work)
document.getElementById("graph").onload = function() {drawGraph('impeach')};

function drawGraph(qCategory){

    document.getElementById("graph").innerHTML=""; //clear space TODO: update instead

    var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = window.innerWidth - margin.left - margin.right
        , height = window.innerHeight - margin.top - margin.bottom;


    var minDate = new Date(2016,12,24),
        maxDate = new Date(2020,2,2);

    // Set X
    var xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);


    // Set Y
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);


    // Draw Lines
    var lineRep = d3.line()
        .x(function(d) { return xScale(d.date); }) // set the x values for line
        .y(function(d) { return yScale(d.rYes); }) // set the y values for line
        .curve(d3.curveLinear) // curve determines how points are interpolated

    var lineDem = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.dYes); })
        .curve(d3.curveLinear)

    var lineInd = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.iYes); })
        .curve(d3.curveLinear)

    // Load in data first
    d3.csv("impeachment-polls.csv", function(d){
        var parseDate = d3.timeParse("%Y-%m-%d");
        return {
            rYes: +d["Rep Yes"],
            dYes: +d["Dem Yes"],
            iYes: +d["Ind Yes"],
            date: parseDate(d.End),
            category: d.Category
        };

    }).then(function(dataset){ // Do stuff in .then so we dont get promise error
        // Filter for impeach questions -> remove polls with 0 values
        var i = dataset.length;
        while(i--){
            if(dataset[i].category != qCategory
                || dataset[i].rYes == 0
                || dataset[i].dYes == 0
                || dataset[i].iYes == 0
            ){
                dataset.splice(i,1);
            }
        }

        console.log(dataset);

        var svg = d3.select("#graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // call x axis in group tag
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        // call the y axis in group tag
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));

        // append path and bind to dataset -> draw line
        svg.append("path")
            .datum(dataset) // bind data
            .attr("class", "lineRep") // give it a class
            .attr("d", lineRep);    //call line draw


        svg.append("path")
            .datum(dataset)
            .attr("class", "lineDem")
            .attr("d", lineDem);

        svg.append("path")
            .datum(dataset)
            .attr("class", "lineInd")
            .attr("d", lineInd);

        // Put dots on data points
        svg.selectAll(".rDot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale(d.rYes) })
            .attr("r", 3)

        svg.selectAll(".dDot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale(d.dYes) })
            .attr("r", 3)

        svg.selectAll(".iDot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale(d.iYes) })
            .attr("r", 3)
    });

}

