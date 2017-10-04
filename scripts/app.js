
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

d3.tsv("/assets/data/languages.tsv", function(d) {
  d.speakers = +d.speakers;
  if (d.speakers) return d;
}, function(error, classes) {
  if (error) throw error;

  var root = d3.hierarchy({children: classes})
      .sum(function(d) { return d.speakers; })
      .each(function(d) {
        if (language = d.data.language) {
          var language, i = language.lastIndexOf(".");
          d.language = language;
          d.package = language.slice(0, i);
          d.class = language.slice(i + 1);
        }
      });

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("language", function(d) { return d.language; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.package); });

  node.append("text")
    .text(function (d) {  return d.language})
    .attr("text-anchor", "middle");

  node.append("title")
      .text(function(d) { return d.language + "\n" + format(d.speakers); });
});
