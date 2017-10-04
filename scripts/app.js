// Set width and height consts
const width = 800;
const height = 800;

// Create SVG with D3 and give attributes like width and height to it for styling
const svg = d3
	.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')

// Create readable numbers since we are human, https://github.com/d3/d3-format
const format = d3.format(",d");

// Set color scale for created elements
const color = d3.scaleOrdinal(d3.schemeCategory20c);

// Create circle packing layout, https://github.com/d3/d3-hierarchy/blob/master/README.md#pack
const pack = d3.pack()
    .size([width, height]) // set size
    .padding(1.5); // set padding betwen elements

// Load the TSV file
d3.tsv("https://danoszz.github.io/fe3-assessment-1/assets/data/languages.tsv", d => {
  d.speakers = +d.speakers; // declare that d.speakers is now d.speaker in a numeric represenation
  if (d.speakers) return d; // return the d 👀
}, (e, c) => { // errors, childs but written shorthanded
  if (e) throw e;

 // create root element which is hierarchical, https://github.com/d3/d3-hierarchy/blob/master/README.md

  const root = d3.hierarchy({children: c})
      .sum(d => { return d.speakers; }) // total amount = d.speakers
      .each(d => { // loop through each object
        if (language = d.data.language) {
          language, i = language.lastIndexOf("."); // find last occurrence of . for file clean up original code, need to clean up properly, not needed for this dataset
          d.language = language;
          d.package = language.slice(0, i);
          d.class = language.slice(i + 1);
        }
      });

  let node = svg.selectAll(".node") // create nodes
    .data(pack(root).leaves()) // give them data
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", d =>{ return "translate(" + d.x + "," + d.y + ")"; }); // place them on the SVG

  node.append("circle") // style circles
      .attr("language", d => { return d.language; }) // give specific attribute to it
      .attr("r", function(d) { return d.r; }) // give radius
      .style("fill", function(d) { return color(d.package); }); // give color

  node.append("text")
    .text(d =>{  return d.language}) // put text in circle
    .attr("text-anchor", "middle"); // align it properly

  node.append("title")
      .text(d => { return d.language + "\n" + format(d.speakers); }); // give title to node
});
