// Based on https://bl.ocks.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2

const margin = {
	top: 30,
	right: 50,
	bottom: 40,
	left: 50,
};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const formatter = d3.format('.0%');

const svg = d3
	.select('body')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);

const xscale = d3
	.scaleLinear()
	.domain([0, 1])
	.range([0, width]);

const yscale = d3
	.scaleLinear()
	.domain([0, 1])
	.range([height, 0]);

const radius = d3.scaleSqrt().range([2, 8]);

const xAxis = d3
	.axisBottom()
	.tickSize(-height)
	.tickFormat(formatter)
	.scale(xscale);

const yAxis = d3
	.axisLeft()
	.tickSize(-width)
	.scale(yscale);

//const color = d3.scaleOrdinal().range(['#002CFC', '#3F61D3', '#7E95A9', '#BCCA80', '#FBFE56']);

const color = d3.scaleOrdinal(d3.schemeCategory20);
// Helper function to check if string is number
// Source:
function hasNumber(myString) {
	return /\d/.test(myString);
}

function clean(row) {
	// Credits for the original function go to @woooorm
	// Source: https://github.com/cmda-fe3/course-17-18/blob/38a05f951e04d6fae3eeec72a7b0cbaf14c2110f/script/crawl-assessment-1-data.js#L131-L152
	var result = {};
	var begin = 2005;
	var index = 0;
	var key = String(begin);

	do {
		result[key] = row[key] === ':' ? null : parseFloat(row[key], 10);
		key = String(begin + ++index);
	} while (key in row);

	return result;
}

// Import JSON file
d3.json('../assets/data/toilets.json', (error, data) => {
	if (error) throw error;

	// Todo: Make dates dynamic depening on the dataset
	let beginYear = 2005;
	let endYear = 2016;
	//let yearPeriod = endYear - beginYear;

	// data pre-processing
	data.forEach(d => {

		// d.x = +d["2007"]; // get year

		// Loop through years and output years as string
		for (let i = beginYear; i < endYear; i++) {
			if (i >= beginYear && i <= endYear) {

				let yearInString = String(i);
				let yearInNumber = Number(i);

				d.y = +i; // get year
				d.x = +d[yearInString]; // get percentage for x-axis from each year

				console.log("this is d.y -->" + d.y);
				console.log("this is d.x -->" + d.x);

			} else { // done with loop, return both d.y and d.x
				 return d.y;
				 return d.x;
			}
		}
		d.c = d["code"]; // get country code
	});


	// Set domain for Yaxis

	//yscale.domain([new Date(beginYear, 0, 0), new Date(endYear, 0, 0)])

	yscale.domain(d3.extent(data, d => d.y)).nice();
  radius.domain(d3.extent(data, d => d.r)).nice();

	data.sort((a, b) => b.r - a.r);

	svg
		.append('g')
		.attr('transform', `translate(0,${height})`)
		.attr('class', 'x axis')
		.call(xAxis);

	svg
		.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'y axis')
		.call(yAxis);

	const group = svg
		.selectAll('g.bubble')
		.data(data)
		.enter()
		.append('g')
		.attr('class', 'bubble')
		.attr('transform', d => `translate(${xscale(d.x)},${yscale(d.y)})`);

	group
		.append('circle')
		//  .attr("r", d => radius(d.r))
		.attr('r', 10)
		.style('fill', 'brown');

	// .style("fill", d => color(d.team86));

	group
		.append('text')
		.attr('x', 20)
		.attr('alignment-baseline', 'middle')
		.text(d => `${d.code}`);

	svg
		.append('text')
		.attr('x', 6)
		.attr('y', -2)
		.attr('class', 'label')
		.text('Year');

	svg
		.append('text')
		.attr('x', width - 2)
		.attr('y', height - 6)
		.attr('text-anchor', 'end')
		.attr('class', 'label')
		.text('Percentage of population without a toilet if known');

	const legend = svg
		.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', (d, i) => `translate(2,${i * 14})`);

	legend
		.append('rect')
		.attr('x', width)
		.attr('width', 12)
		.attr('height', 12)
		.style('fill', color);

	legend
		.append('text')
		.attr('x', width + 16)
		.attr('y', 6)
		.attr('dy', '.35em')
		.style('text-anchor', 'start')
		.text(d => d);

	legend
		.on('mouseover', function(type) {
			d3.selectAll('.legend').style('opacity', 0.1);
			d3.select(this).style('opacity', 1);
			d3
				.selectAll('.bubble')
				.style('opacity', 0.1)
				.filter(d => d.team86 == type)
				.style('opacity', 1);
		})
		.on('mouseout', type => {
			d3.selectAll('.legend').style('opacity', 1);
			d3.selectAll('.bubble').style('opacity', 1);
		});
});
