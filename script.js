const svg = d3.select("#visualization");
const container = d3.select("#visualization-container");

let width = parseInt(container.style("width"));
let height = parseInt(container.style("height"));

svg.attr("viewBox", `0 0 ${width} ${height}`);

const mainGroup = svg.append("g").attr("id", "main-group");

const BASE_RADIUS = 5;
const MAX_RADIUS_HOVER = 8;
const INTERACTION_RADIUS = 50;
const PLANT_TRANSITION_DURATION = 750;
const HOVER_TRANSITION_DURATION = 200;
const PULSE_TRANSITION_DURATION = 1500;

let noctilucasData = [];
let nextId = 0;

const defs = svg.append("defs");
const filter = defs.append("filter")
    .attr("id", "glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

filter.append("feGaussianBlur")
    .attr("stdDeviation", 3.5)
    .attr("result", "coloredBlur");

const feMerge = filter.append("feMerge");
feMerge.append("feMergeNode").attr("in", "coloredBlur");
feMerge.append("feMergeNode").attr("in", "SourceGraphic");

let quadtree = d3.quadtree()
    .x(d => d.x)
    .y(d => d.y)
    .extent([[-1, -1], [width + 1, height + 1]]);

function getRandomPastelColor() {
    const h = Math.random() * 360;
    const s = 70 + Math.random() * 30;
    const l = 65 + Math.random() * 10;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function updateVisualization() {
    const noctilucas = mainGroup.selectAll(".noctiluca")
        .data(noctilucasData, d => d.id);
    const enterSelection = noctilucas.enter().append("circle")
        .attr("class", "noctiluca")
        .attr("id", d => `noctiluca-${d.id}`)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 0)
        .attr("fill", d => d.color)
        .style("filter", "url(#glow)")
        .style("opacity", 0);
    enterSelection.transition()
        .duration(PLANT_TRANSITION_DURATION)
        .ease(d3.easeElasticOut.period(0.6))
        .attr("r", BASE_RADIUS)
        .style("opacity", 0.8);
    enterSelection.each(function(d) {
        pulsate(d3.select(this));
    });
    noctilucas.exit().transition()
       .duration(500)
       .attr("r", 0)
       .style("opacity", 0)
       .remove();
    quadtree.addAll(noctilucasData);
}

function pulsate(selection) {
    selection.transition()
        .duration(PULSE_TRANSITION_DURATION + Math.random() * 500)
        .ease(d3.easeSinInOut)
        .attr("r", BASE_RADIUS * (0.8 + Math.random() * 0.4))
        .transition()
        .duration(PULSE_TRANSITION_DURATION + Math.random() * 500)
        .ease(d3.easeSinInOut)
        .attr("r", BASE_RADIUS)
        .on("end", function() {
            if (d3.select(this).node()) {
                pulsate(d3.select(this));
            }
        });
}

svg.on("click", function(event) {
    if (event.target !== this && event.target !== mainGroup.node()) return;
    const [mx, my] = d3.pointer(event, mainGroup.node());
    const newNoctiluca = {
        id: nextId++,
        x: mx,
        y: my,
        color: getRandomPastelColor()
    };
    noctilucasData.push(newNoctiluca);
    updateVisualization();
});

svg.on("mousemove", function(event) {
    const [mx, my] = d3.pointer(event, mainGroup.node());
    const closest = quadtree.find(mx, my, INTERACTION_RADIUS * 2);
    mainGroup.selectAll(".noctiluca")
        .transition("hover")
        .duration(HOVER_TRANSITION_DURATION)
        .ease(d3.easeCircleOut)
        .attr("r", function(d) {
            if (d === closest) {
                const dist = Math.hypot(d.x - mx, d.y - my);
                const radiusFactor = Math.max(1, 1 + (MAX_RADIUS_HOVER - BASE_RADIUS) * (1 - dist / INTERACTION_RADIUS));
                return BASE_RADIUS * radiusFactor;
            } else {
                return d3.select(this).attr('r') > BASE_RADIUS ? d3.select(this).attr('r') : BASE_RADIUS;
            }
        })
        .style("opacity", function(d) {
             return (d === closest) ? 1.0 : 0.8;
        });
});

svg.on("mouseleave", function() {
    mainGroup.selectAll(".noctiluca")
        .transition("hover")
        .duration(HOVER_TRANSITION_DURATION * 2)
        .ease(d3.easeCircleOut)
        .attr("r", BASE_RADIUS)
        .style("opacity", 0.8);
});

const zoom = d3.zoom()
    .scaleExtent([0.3, 5])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed(event) {
    const { transform } = event;
    mainGroup.attr("transform", transform);
    const scale = transform.k;
    const newStdDeviation = Math.max(1.5, 3.5 / Math.sqrt(scale));
    svg.select("#glow feGaussianBlur").attr("stdDeviation", newStdDeviation);
}

window.addEventListener('resize', () => {
    width = parseInt(container.style("width"));
    height = parseInt(container.style("height"));
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    zoom.translateExtent([[0, 0], [width, height]]);
    quadtree.extent([[-1, -1], [width + 1, height + 1]]);
});

updateVisualization();
