const width = 800;
const height = 800;

const svg = d3
	.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')

const format = d3.format(",d");

const color = d3.scaleOrdinal(d3.schemeCategory20c);

const pack = d3.pack()
    .size([width, height])
    .padding(1.5);

d3.tsv("https://danoszz.github.io/fe3-assessment-1/assets/data/languages.tsv", d => {
  d.speakers = +d.speakers;
  if (d.speakers) return d;
}, (e, c) => {
  if (e) throw e;

  const root = d3.hierarchy({children: c})
      .sum(d => { return d.speakers; })
      .each(d => {
        if (language = d.data.language) {
          language, i = language.lastIndexOf(".");
          d.language = language;
          d.package = language.slice(0, i);
          d.class = language.slice(i + 1);
        }
      });

  let node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", d =>{ return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("language", d => { return d.language; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.package); });

  node.append("text")
    .text(d =>{  return d.language})
    .attr("text-anchor", "middle");

  node.append("title")
      .text(d => { return d.language + "\n" + format(d.speakers); });
});
