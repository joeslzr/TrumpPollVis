
function drawGraph(qCategory){

    document.getElementById("graph").innerHTML="";

    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 950;
    var height = 450;


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
        .y(function(d) { return yScale((d.rYes+d.dYes+d.iYes)/3); }) // set the y values for line
        .curve(d3.curveLinear) // curve determines how points are interpolated

    // var lineDem = d3.line()
    //     .x(function(d) { return xScale(d.date); })
    //     .y(function(d) { return yScale(d.dYes); })
    //     .curve(d3.curveLinear)

    // var lineInd = d3.line()
    //     .x(function(d) { return xScale(d.date); })
    //     .y(function(d) { return yScale(d.iYes); })
    //     .curve(d3.curveLinear)

    // Load in data first
    d3.csv("impeachment-polls.csv", function(d){
        var parseDate = d3.timeParse("%Y-%m-%d");
        return {
            rYes: +d["Rep Yes"],
            dYes: +d["Dem Yes"],
            iYes: +d["Ind Yes"],
            rNo: +d["Rep No"],
            dNo: +d["Dem No"],
            iNo: +d["Ind No"],
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
            .attr("class", "line") // give it a class
            .attr("d", lineRep);    //call line draw


        // svg.append("path")
        //     .datum(dataset)
        //     .attr("class", "lineDem")
        //     .attr("d", lineDem);

        // svg.append("path")
        //     .datum(dataset)
        //     .attr("class", "lineInd")
        //     .attr("d", lineInd);

        // Put dots on data points
        svg.selectAll(".rDot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", function(d) { return "dot id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes)) })
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale((d.rYes+d.dYes+d.iYes)/3) })
            .attr("r", 3)
			.on('mouseover',function(d){
				var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
				var dots = document.getElementsByClassName(dotid);
				for (var i = 0; i < dots.length; i++) {
					dots[i].classList.toggle("dot-highlight");
					dots[i].setAttribute("r", 15);
				}
			})
			.on('mouseout', function(d){
				var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
				var dots = document.getElementsByClassName(dotid);
				for (var i = 0; i < dots.length; i++) {
					dots[i].classList.toggle("dot-highlight");
					dots[i].setAttribute("r", 3);
				}
			})
			.on('click', function(d){
				var data = [
					{question: "Rep", no: d.rNo, yes: d.rYes},
					{question: "Ind", no: d.iNo, yes: d.iYes},
					{question: "Dem", no: d.dNo, yes: d.dYes},
				];
				splitBar(data);
			});

        // svg.selectAll(".iDot")
        //     .data(dataset)
        //     .enter().append("circle")
        //     .attr("class", function(d) { return "dot id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes)) })
        //     .attr("cx", function(d) { return xScale(d.date) })
        //     .attr("cy", function(d) { return yScale(d.iYes) })
        //     .attr("r", 3)
		// 	.on('mouseover',function(d){
		// 		var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
		// 		var dots = document.getElementsByClassName(dotid);
		// 		for (var i = 0; i < dots.length; i++) {
		// 			dots[i].classList.toggle("dot-highlight");
		// 			dots[i].setAttribute("r", 15);
		// 		}
		// 	})
		// 	.on('mouseout', function(d){
		// 		var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
		// 		var dots = document.getElementsByClassName(dotid);
		// 		for (var i = 0; i < dots.length; i++) {
		// 			dots[i].classList.toggle("dot-highlight");
		// 			dots[i].setAttribute("r", 3);
		// 		}
		// 	})
		// 	.on('click', function(d){
		// 		var data = [
		// 			{question: "Rep", no: d.rNo, yes: d.rYes},
		// 			{question: "Ind", no: d.iNo, yes: d.iYes},
		// 			{question: "Dem", no: d.dNo, yes: d.dYes},
		// 		];
		// 		splitBar(data);
		// 	});

        // svg.selectAll(".dDot")
        //     .data(dataset)
        //     .enter().append("circle")
        //     .attr("class", function(d) { return "dot id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes)) })
        //     .attr("cx", function(d) { return xScale(d.date) })
        //     .attr("cy", function(d) { return yScale(d.dYes) })
        //     .attr("r", 3)
		// 	.on('mouseover',function(d){
		// 		var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
		// 		var dots = document.getElementsByClassName(dotid);
		// 		for (var i = 0; i < dots.length; i++) {
		// 			dots[i].classList.toggle("dot-highlight");
		// 			dots[i].setAttribute("r", 15);
		// 		}
		// 	})
		// 	.on('mouseout', function(d){
		// 		var dotid = "id" + Math.floor(xScale(d.date)) + "x" + Math.floor(yScale(d.iYes));
		// 		var dots = document.getElementsByClassName(dotid);
		// 		for (var i = 0; i < dots.length; i++) {
		// 			dots[i].classList.toggle("dot-highlight");
		// 			dots[i].setAttribute("r", 3);
		// 		}
		// 	})
		// 	.on('click', function(d){
		// 		var data = [
		// 			{question: "Rep", no: d.rNo, yes: d.rYes},
		// 			{question: "Ind", no: d.iNo, yes: d.iYes},
		// 			{question: "Dem", no: d.dNo, yes: d.dYes},
		// 		];
		// 		splitBar(data);
		// 	});
    });

}

function splitBar(data) {
	var bind = "#isotype";
	document.getElementById("isotype").innerHTML="";
	
	// identify party colors
	var repYes = "#FF5555";
	var repNo  = "#AA0000";
	var demYes = "#5555FF";
	var demNo  = "#0000AA";
	var indYes = "#00FF00";
	var indNo  = "#00AA00";

	// normalize data
	for (var i = 0; i < data.length; i++) {
		var obj = data[i];
		var tot = obj.no + obj.yes;
		if (tot === 0) tot = 1;
		obj.no  = (obj.no  / tot) * 100;
		obj.yes = (obj.yes / tot) * 100;
	}
	
	var config = {
		margin: {top: 40, right: 10, bottom: 10, left: 10},
		width: 950,
		lineStroke: '#35342f',
		lineStrokeWidth: 4,
		// be able to change the keys in data
		leftKey: 'no',
		rightKey: 'yes',
		labelKey: 'question',
	};
	
	const {margin, width, leftKey, rightKey} = config;
	const height = (data.length * 30) + margin.top + margin.bottom;
	const w = width - margin.left - margin.right;
	const h = height - margin.top - margin.bottom;

	// calc max value for whole data set
	const maxValues = [
		d3.max(data, d => d[leftKey]),
		d3.max(data, d => d[rightKey])
	];
	// const minValues = [
	//   d3.min(data, d => d[leftKey]),
	//   d3.min(data, d => d[rightKey])
	// ]

	// access labels
	const labels = data.map(d => d[config.labelKey]);

	// set up scales
	const bandScale = d3.scaleBand()
		.domain(labels)
		.range([10, h])
		.paddingInner(0.2);
		
	// scale for bars and right axis
	const barWidth = d3.scaleLinear()
		.domain([0, d3.max(maxValues)])
		.range([0, w / 2]);
		
	// scale for left axis
	const leftAxisScale = d3.scaleLinear()
		.domain([0, d3.max(maxValues)])
		.range([w / 2, 0]);

	const svg = d3.select(bind).append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', d => `translate(${margin.left}, ${margin.top})`);

	const axisRight = svg.append('g')
		.attr('class', 'axis-right')
		.attr('transform', d => `translate(${w / 2}, ${-margin.top / 2})`);
	const axisLeft = svg.append('g')
		.attr('class', 'axis-left')
		.attr('transform', d => `translate(${0}, ${-margin.top / 2})`);

	const g = svg.selectAll('.bar')
		.data(data)
		.enter().append('g')
		.attr('class', 'bar')
		.attr('transform', d => `translate(${w / 2}, ${bandScale(d[config.labelKey])})`);
		
	// append left bars
	g.append('rect')
		.attr('class', d => {
			if (d.question.includes("Rep"))
				return "isoRep isoNo";
			else if (d.question.includes("Dem"))
				return "isoDem isoNo";
			else
				return "isoInd isoNo";
		})
		.attr('x', 0)
		.attr('width', 0)
		.attr('height', bandScale.bandwidth())
		.attr('x', d => -(barWidth(d[leftKey])))
		.attr('width', d => barWidth(d[leftKey]));
		
	// append right bars
	g.append('rect')
		.attr('class', d => {
			if (d.question.includes("Rep"))
				return "isoRep";
			else if (d.question.includes("Dem"))
				return "isoDem";
			else
				return "isoInd";
		})
		.attr('width', 0)
		.attr('height', bandScale.bandwidth())
		.attr('width', d => barWidth(d[rightKey]));
		
	// create a pivot line (around zero)
	svg.append('line')
		.attr('x1', w / 2)
		.attr('y1', 0)
		.attr('x2', w / 2)
		.attr('y2', h)
		.style('stroke', config.lineStroke)
		.style('stroke-width', config.lineStrokeWidth);
		
	// append a label
	g.append('text')
		.attr('x', -25)
		.attr('y', 15)
		.attr('class', "isoText")
		.text(d => {
			if (d.question.includes("Ind"))
				return "No Yes";
			else
				return "";
		});
		
	// render an axis for each side
	// can use the bar scale for the right
	const xAxisRight = d3.axisBottom().scale(barWidth).ticks(4);
	
	// need the left to be reversed
	const xAxisLeft = d3.axisBottom().scale(leftAxisScale).ticks(4);
	axisRight.call(xAxisRight);
	axisLeft.call(xAxisLeft);
	
	// hide the right zero (so no overlap)
	svg.select('.axis-right g.tick').style('display', 'none');
}
