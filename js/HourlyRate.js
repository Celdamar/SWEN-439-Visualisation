

var MainSvg =  d3.select("#MainPanel").append("svg")
    .attr("width", '100%')
    .attr('height', '100%')
    .style('position','absolute');

var width = document.getElementById('MainPanel').offsetWidth;
var height = window.innerHeight;
var states;
var hourlyRates;
var largestDifference = 0;

d3.json("../Data/HourlyRatePerState.json", function(json){
    hourlyRates = json;

    for(var state in json) {
        var difference = json[state].HourlyRateMale - json[state].HourlyRateFemale;
        if(difference > largestDifference){
            largestDifference = difference;
        }
    };
    largestDifference = Math.ceil(largestDifference);
    console.log(largestDifference);
});

d3.json("../assets/500k.json", function(json) {

    //Bind data and create one path per GeoJSON feature
    states  = MainSvg.append("g")
        .attr("width", "100%")
        .attr("height", "100%");

    // create a first guess for the projection
    var center = d3.geo.centroid(json)
    var scale  = 1000;
    var offset = [500 , 250];
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
        .attr("stroke","#ffffff")
        .on('mouseover', function(d) {
            mousoverState(d,this);
        })
        .on('mousemove', function(d){
            mousemoveState(d,this);
        })
        .on('mouseout', function(d){
            mouseoutState(d, this);
        });

    processStates();
});


var processStates = function(){
    states.selectAll("path")
        .attr("fill", function(d){
            return getStateColour(d);
        });
}

var getStateColour = function(stateData){
   // console.log(stateData.properties.STATE);

    var femaleRate = hourlyRates[stateData.properties.STATE].HourlyRateFemale;
    var maleRate = hourlyRates[stateData.properties.STATE].HourlyRateMale;
    stateData.HourlyRateFemale = femaleRate;
    stateData.HourlyRateMale = maleRate;
    //console.log(femaleRate + "  " + maleRate + "  " + stateData.properties.STATE);

    if(femaleRate >= maleRate){
        return 'rgba(220,100,100,'+(femaleRate-maleRate)/largestDifference+')';
    }else {
        return 'rgba(90,160,210,'+(maleRate-femaleRate)/largestDifference+')';
    }
}


var tooltipDiv;
var bodyNode = d3.select('body').node();

var  mousoverState = function(stateData, path){
    d3.select(path.parentNode.appendChild(path)).attr("stroke", '#000')
                    .attr("stroke-width", 1.2);
    console.log(stateData.properties.NAME + "  " + stateData.properties.STATE + " " + stateData.HourlyRateFemale + " " + stateData.HourlyRateMale);

    var femaleRate = hourlyRates[stateData.properties.STATE].HourlyRateFemale;
    var maleRate = hourlyRates[stateData.properties.STATE].HourlyRateMale;

    var color = 'rgba(200,150,68,0.8)';
    color = d3.select(path).attr('fill');
    color = color.replace(/[\d\.]+\)$/g, '0.8)');
    //if(femaleRate > maleRate){
    //    color = 'rgba(187,136,68,0.8)';
    //} else if (femaleRate == maleRate){
    //    color = 'rgba(100,100,100,0.8)';
    //}

    // Clean up lost tooltips
    d3.select('body').selectAll('div.tooltip').remove();
    // Append tooltip
    tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px')
        .style('position', 'absolute')
        .style('background-color', color)
        .style('border', '1px solid #000')
        .style('margin', '10px')
        .style('height', '70px')
        .style('width', '150px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function


    var tooltipText = "<b>"+stateData.properties.NAME + "</b><br/> Female: " + femaleRate + "/hour<br/> Male: " + maleRate + "/hour";
    tooltipDiv.html(tooltipText);
    // Crop text arbitrarily
    //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
    //    .html(tooltipText);
};

var mousemoveState = function(stateData, path){

    // Move tooltip
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px');
    //var tooltipText = "<b>"+stateData.properties.NAME + "</b><br/><b>" + femaleRate +"</b><br/><b>" + maleRate + "</b>";
    //tooltipDiv.html(tooltipText);
}

var mouseoutState = function(stateData, path){
    d3.select(path).attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("opacity", "1");

    // Remove tooltip
    tooltipDiv.remove();
};



d3.helper = {};

d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                    .style('top', (absoluteMousePos[1] - 15)+'px')
                    .style('position', 'absolute')
                    .style('z-index', 1001);
                // Add text using the accessor function
                var tooltipText = accessor(d, i) || '';
                // Crop text arbitrarily
                //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
                //    .html(tooltipText);
            })
            .on('mousemove', function(d, i) {
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                    .style('top', (absoluteMousePos[1] - 15)+'px');
                var tooltipText = accessor(d, i) || '';
                tooltipDiv.html(tooltipText);
            })
            .on("mouseout", function(d, i){
                // Remove tooltip
                tooltipDiv.remove();
            });

    };
};




