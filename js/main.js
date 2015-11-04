


var MainSvg =  d3.select("#MainPanel").append("svg")
    .attr("width", '100%')
    .attr('height', '100%')
    .style('position','absolute');

var width = window.innerWidth;
var height = window.innerHeight;

d3.json("../assets/usStates - Copy.json", function(json) {

    //Bind data and create one path per GeoJSON feature
    var  states  = MainSvg.append("g")
        .attr("width", "100%")
        .attr("height", "100%");

    // create a first guess for the projection
    var center = d3.geo.centroid(json)
    var scale  = 1200;
    var offset = [600, 300];
    var projection = d3.geo.mercator().scale(scale).center(center)
        .translate(offset);

    var path = d3.geo.path().projection(projection);

    var bounds  = path.bounds(json);
    var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
    var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
    var scale   = (hscale < vscale) ? hscale : vscale;
    var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
        height - (bounds[0][1] + bounds[1][1])/2];


    states.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill","#666666")
        .on('mouseover', function(d) {
            mousoverState(d,this);
        })
        .on('mouseout', function(d){
            mouseoutState(d, this);
        });
});


var  mousoverState = function(stateData, path){
    d3.select(path).attr("fill", "#ff4444");
    console.log(stateData.properties.NAME);
};

var mouseoutState = function(stateData, path){
    d3.select(path).attr("fill", "#666666");
};