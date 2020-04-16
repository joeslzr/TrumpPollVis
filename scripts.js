function titleCase(string) {
      var sentence = string.toLowerCase().split(" ");
      for(var i = 0; i< sentence.length; i++){
         sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      }
   document.write(sentence.join(" "));
   return sentence;
}

function drawGraph(qCategory, title){

    document.getElementById("graph").innerHTML="";
	
	document.getElementById("question").innerHTML= title;

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

        // Put dots on data points
        svg.selectAll(".rDot")
            .data(dataset)
            .enter().append("circle")
            .attr("class", function(d, i) { return "dot id" + i })
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale((d.rYes+d.dYes+d.iYes)/3) })
            .attr("r", 3)
			.on('mouseover',function(d, i){
				var dotid = "id" + i;
				var dots = document.getElementsByClassName(dotid);
				for (var i = 0; i < dots.length; i++) {
					dots[i].classList.toggle("dot-highlight");
					dots[i].setAttribute("r", 15);
				}
			})
			.on('mouseout', function(d, i){
				var dotid = "id" + i;
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
				isotypeBar(data);
			});
    });

}

function isotypeBar(data) {
	var bind = "isotype";
	document.getElementById(bind).innerHTML="";
	
	// identify party colors
	var repYes = "#FF5555";
	var repNo  = "#AA0000";
	var demYes = "#5555FF";
	var demNo  = "#0000AA";
	var indYes = "#00FF00";
	var indNo  = "#00AA00";
	
	var config = {
		margin: {top: 40, right: 50, bottom: 10, left: 50},
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
	const w = width;
	const h = height - margin.top - margin.bottom;

	// calc max value for whole data set
	const maxValues = [
		d3.max(data, d => d[leftKey]),
		d3.max(data, d => d[rightKey])
	];

	// access labels
	const labels = data.map(d => d[config.labelKey]);

	// set up scales
	const bandScale = d3.scaleBand()
		.domain(labels)
		.range([10, h])
		.paddingInner(0.2);
		
	// scale for bars and right axis
	const barWidth = d3.scaleLinear()
		.domain([0, 100])
		.range([0, w / 2]);
		
	// scale for left axis
	const leftAxisScale = d3.scaleLinear()
		.domain([0, 100])
		.range([w / 2, 0]);

	const svg = d3.select("#"+bind).append('svg')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height)
		.append('g')
		.attr('transform', d => `translate(${margin.left}, ${margin.top})`);

	const axisRight = svg.append('g')
		.attr('class', 'axis-right')
		.attr('transform', d => `translate(${w / 2}, ${-margin.top / 2})`);
	const axisLeft = svg.append('g')
		.attr('class', 'axis-left')
		.attr('transform', d => `translate(${0}, ${-margin.top / 2})`);

	const bars = svg.selectAll('.bar')
		.data(data)
		.enter().append('g')
		.attr('class', 'bar')
		.attr('transform', d => `translate(${w / 2}, ${bandScale(d[config.labelKey])})`);
		
	// create a pivot line (around zero)
	svg.append('line')
		.attr('x1', w / 2)
		.attr('y1', 0)
		.attr('x2', w / 2)
		.attr('y2', h)
		.style('stroke', config.lineStroke)
		.style('stroke-width', config.lineStrokeWidth);
		
	// append a label
	svg.append('text')
		.attr('x', w/2 - 31)
		.attr('y', -25)
		.attr('class', "isoText")
		.text("No | Yes");
		
	// render an axis for each side
		// can use the bar scale for the right
		const xAxisRight = d3.axisBottom().scale(barWidth).ticks(4);
		// need the left to be reversed
		const xAxisLeft = d3.axisBottom().scale(leftAxisScale).ticks(4);
	axisRight.call(xAxisRight);
	axisLeft.call(xAxisLeft);
	
	// hide the right zero (so no overlap)
	svg.select('.axis-right g.tick').style('display', 'none');
		
	
	// Draw STARS!
	var starGenerator = d3.symbol().type(d3.symbolStar).size(75);
	var tinyStarGenny = d3.symbol().type(d3.symbolStar).size(0);
	var starData = starGenerator();
	var tinyStar = tinyStarGenny();
	var starStart = 12;
	var starPadding = 1;
	
	// append left stars
	bars.each(function(d,i){
		var curBar = d3.select(this);
		var initialPos = -(barWidth(d[leftKey]));
		
		for(var i = -starStart; i > initialPos; i = i - starPadding) {
			curBar.append("path")
				.attr('class', function(d,i){
					if (d.question.includes("Rep"))
						return "isoRep isoNo";
					else if (d.question.includes("Dem"))
						return "isoDem isoNo";
					else
						return "isoInd isoNo";
				})
				.attr('transform', function(d) {
					return `translate(${i}, 10)`;
				})
				.attr('d', tinyStar)
				.transition()
				.ease(d3.easeElastic)
				.duration(1500)
				.attr('d', starData);
		}
	});
	
	// append right stars
	bars.each(function(d,i){
		var curBar = d3.select(this);
		var initialPos = barWidth(d[rightKey])
		
		for(var i = starStart; i < initialPos; i = i + starPadding) {
			curBar.append("path")
				.attr('class', function(d,i){
					if (d.question.includes("Rep"))
						return "isoRep";
					else if (d.question.includes("Dem"))
						return "isoDem";
					else
						return "isoInd";
				})
				.attr('transform', function(d) {
					return `translate(${i}, 10)`;
				})
				.attr('d', tinyStar)
				.transition()
				.ease(d3.easeElastic)
				.duration(1500)
				.attr('d', starData);
		}
	});
}
