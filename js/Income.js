var MainSvg =  d3.select("#MainPanel").append("svg")
    .attr("width", '100%')
    .attr('height', '100%')
    .style('position','absolute');

var margin = {top: 100, right: 80, bottom: 80, left: 1250},
    chartWidth = 550;
chartHeight = 450;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, chartHeight-50], 0);

var y0 = d3.scale.linear().domain([0, 25]).range([chartHeight, 0]),
    y1 = d3.scale.linear().domain([25, 0]).range([chartWidth/2, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// create left yAxis
var yAxisLeft = d3.svg.axis().scale(y0).ticks(5).orient("left");
// create right yAxis
var yAxisRight = d3.svg.axis().scale(y1).ticks(5).orient("bottom");


var svg = MainSvg.append("g")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("g")
    .attr("class", "graph")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var initGraph = function(data, title) {
    x.domain(data.map(function (d) {
        return d.year;
    }));
    y0.domain([0, d3.max(data, function (d) {
        return Math.max(d.IncomeFemale, d.IncomeMale);
    })]);
    y1.domain([ d3.max(data, function (d) {
        return Math.max(d.IncomeFemale, d.IncomeMale);
    }), 0]);

    svg.append("text")
        .attr("class", "title")
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("x", chartWidth/2)
        .attr("font-size", "40px")
        .attr("font-style", "sans-serif")
        .text(title);

    svg.append("g")
        .attr("class", "y axis axisLeft")
        .attr("shape-rendering", "crispEdges")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft)
        .append("text")
        .attr("y", -30)
        .attr("x", -10)
        .attr("dy", "2em")
        .style("text-anchor", "end")
        .text("Income $");

    //svg.append("g")
    //    .attr("class", "y axis axisRight")
    //    .attr("transform", "translate(" + (chartWidth) / 2 + "," + chartHeight + ")")
    //    .call(yAxisRight)
    //    .append("text")
    //    .attr("y", 6)
    //    .attr("x", chartWidth / 2)
    //    .attr("dy", "2em")
    //    .attr("dx", "2em")
    //    .style("text-anchor", "end")
    //    .text("Female $");


    bars = svg.selectAll(".bar").data(data).enter();

    bars.append("rect")
        .attr("class", "bar1")
        .attr("y", function (d, i) {
            //return i * (chartHeight ) / 8;
            return y0(d.IncomeMale);
        })
        .attr("height", function(d){
            //chartHeight / 9;
            return chartHeight - y0(d.IncomeMale);
        })
        .attr("x", function (d, i) {
            //return y0(d.IncomeMale);
            return i * (chartWidth ) / 8 + 10;
        })
        .attr("width", function (d, i, j) {
            //return chartWidth / 2 - y0(d.IncomeMale);
            return (chartWidth ) / 18;
        })
        .on('mouseover', function (d) {
            toolTipOver(d.IncomeMale, this);
        })
        .on('mousemove', function (d) {
            toolTipMove(d.IncomeMale, this);
        })
        .on('mouseout', function (d) {
            toolTipOut(d.IncomeMale, this);
        });

    bars.append("rect")
        .attr("class", "bar2")
        .attr("y", function (d, i) {
            //return i * (chartHeight ) / 8;
            return  y0(d.IncomeFemale);
        })
        .attr("height", function(d){
            //chartHeight / 9;
            return chartHeight - y0(d.IncomeFemale);
        })
        .attr("x", function (d, i) {
            //return y0(d.IncomeMale);
            return i * (chartWidth ) / 8 + chartWidth/18 + 10;
        })
        .attr("width", function (d, i, j) {
            //return chartWidth / 2 - y0(d.IncomeMale);
            return (chartWidth ) / 18;
        })
        .on('mouseover', function (d) {
            toolTipOver(d.IncomeFemale, this);
        })
        .on('mousemove', function (d) {
            toolTipMove(d.IncomeFemale, this);
        })
        .on('mouseout', function (d) {
            toolTipOut(d.IncomeFemale, this);
        });

    var races = [ "American\n Indian","Asian","African American","Native Hawaiian","Pasific Islander","Other", "White", "Average"];
    svg.selectAll(".barTitle").data(races).enter()
        .append("text")
        .attr("x", -chartHeight -5)
        .attr("text-anchor", "end")
        .attr("y",  function(d, i){
            return i * chartWidth/8 + chartWidth/13;
        })
        .attr("transform", "rotate(-90)")
        .attr("font-size", "25px")
        .text(function(d){
            return d;
        });
}

var updateGraph = function(data, title)
{
    x.domain(data.map(function (d) {
        return d.year;
    }));
    y0.domain([0, d3.max(data, function (d) {
        return Math.max(d.IncomeFemale, d.IncomeMale);
    })]);
    y1.domain([ d3.max(data, function (d) {
        return Math.max(d.IncomeFemale, d.IncomeMale);
    }), 0]);

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("display", "none")
    //    .attr("transform", "translate(0," + chartHeight + ")")
    //    .call(xAxis);

    var svg2 = d3.select("body").transition();

    svg.select(".title")
        .text(title);

    svg2.select(".y.axis.axisLeft")
        .duration(100)
        .call(yAxisLeft);

    svg2.select(".axisRight")
        .duration(100)
        .call(yAxisRight);

    var bars = svg.selectAll(".bar1").data(data);

    bars.transition().duration(100)
        .attr("y", function (d, i) {
            //return i * (chartHeight ) / 8;
            return y0(d.IncomeMale);
        })
        .attr("height", function(d){
            //chartHeight / 9;
            return chartHeight - y0(d.IncomeMale);
        })
        .attr("x", function (d, i) {
            //return y0(d.IncomeMale);
            return i * (chartWidth ) / 8 + 10;
        })
        .attr("width", function (d, i, j) {
            //return chartWidth / 2 - y0(d.IncomeMale);
            return (chartWidth ) / 18;
        });
    var bars2 = svg.selectAll(".bar2").data(data);
    bars2.transition().duration(100)
        .attr("y", function (d, i) {
            //return i * (chartHeight ) / 8;
            return  y0(d.IncomeFemale);
        })
        .attr("height", function(d){
            //chartHeight / 9;
            return chartHeight - y0(d.IncomeFemale);
        })
        .attr("x", function (d, i) {
            //return y0(d.IncomeMale);
            return i * (chartWidth ) / 8 + chartWidth/18 + 10;
        })
        .attr("width", function (d, i, j) {
            //return chartWidth / 2 - y0(d.IncomeMale);
            return (chartWidth ) / 18;
        });


   /* bars.append("rect")
        .attr("class", "bar2")
        .attr("y", function (d, i) {
            return chartHeight -  (i + 1) * (chartHeight ) / 7;
        })
        .attr("height", chartHeight/8)
        .attr("x", function (d) {
            return chartWidth / 2;
        })
        .attr("width", function (d, i, j) {
            return chartWidth / 2 - y1(d.IncomeFemale);
        });*/
};

var tooltipBarDiv;

var toolTipOver = function(d, bar){
    d3.select(bar).attr("stroke", '#000')
        .attr("stroke-width", 1.2);
    var color = 'rgba(220,220,220,0.9)';

    // Clean up lost tooltips
    d3.select('body').selectAll('div.barToolTip').remove();
    // Append tooltip
    tooltipBarDiv = d3.select('body').append('div').attr('class', 'barToolTip');
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipBarDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px')
        .style('position', 'absolute')
        .style('background-color', color)
        .style('border', '1px solid #000')
        .style('margin', '10px')
        .style('height', '40px')
        .style('width', '100px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function


    var tooltipText = "<b>"+ d + "</b>";
    tooltipBarDiv.html(tooltipText);
}
var toolTipMove = function(stateData, path){

    // Move tooltip
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipBarDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px');
}

var toolTipOut = function(stateData, path){
    d3.select(path).attr("stroke", "#ffffff00")
        .attr("stroke-width", 1)
        .attr("opacity", "1");

    // Remove tooltip
    tooltipBarDiv.remove();
};

var initBarChart = function(stateCode){
    var dataSet;
        dataSet = summariseState(hourlyRates[stateCode]);

    initGraph(dataSet, "United States of America");
}


var updateBarChart = function(stateCode, stateName){
    var dataSet;
        dataSet = summariseState(hourlyRates[stateCode]);

    updateGraph(dataSet, stateName);
}

var summariseData = function(){
    var dataArrays = [];
    for(var state in hourlyRates){
        dataArrays.add(summariseData(hourlyRates[state]));
    }

}

var summariseState = function(jsonData){
    var dataArray = [];

    var data = {};
    data.name = "American Indian";
    if(jsonData[data.name] != null) {
        if(jsonData[data.name].IncomeMale != null) {
            data.IncomeMale = jsonData[data.name].IncomeMale;
        }else {
            data.IncomeMale = 0;
        }
        if(jsonData[data.name].IncomeFemale != null) {
            data.IncomeFemale = jsonData[data.name].IncomeFemale;
        }else {
            data.IncomeFemale = 0;
        }
    } else {
        data.IncomeFemale = 0; data.IncomeMale = 0;
    }
    dataArray[0] = data;

    var data = {};
    data.name =  "Asian";
    if(jsonData[data.name] != null) {
        if(jsonData[data.name].IncomeMale != null) {
            data.IncomeMale = jsonData[data.name].IncomeMale;
        }else {
            data.IncomeMale = 0;
        }
        if(jsonData[data.name].IncomeFemale != null) {
            data.IncomeFemale = jsonData[data.name].IncomeFemale;
        }else {
            data.IncomeFemale = 0;
        }
    } else {
        data.IncomeFemale = 0; data.IncomeMale = 0;
    }
    dataArray[1] = data;

    var data = {};
    data.name = "African American";
    if(jsonData[data.name] != null) {
        if(jsonData[data.name].IncomeMale != null) {
            data.IncomeMale = jsonData[data.name].IncomeMale;
        }else {
            data.IncomeMale = 0;
        }
        if(jsonData[data.name].IncomeFemale != null) {
            data.IncomeFemale = jsonData[data.name].IncomeFemale;
        }else {
            data.IncomeFemale = 0;
        }
    } else {
        data.IncomeFemale = 0; data.IncomeMale = 0;
    }
    dataArray[2] = data;

    var data = {};
    data.name =   "Native Hawaiian";
    if(jsonData[data.name] != null) {
        if(jsonData[data.name].IncomeMale != null) {
            data.IncomeMale = jsonData[data.name].IncomeMale;
        }else {
            data.IncomeMale = 0;
        }
        if(jsonData[data.name].IncomeFemale != null) {
            data.IncomeFemale = jsonData[data.name].IncomeFemale;
        }else {
            data.IncomeFemale = 0;
        }
    } else {
        data.IncomeFemale = 0; data.IncomeMale = 0;
    }
    dataArray[3] = data;

    var data = {};
    data.name =  "Pasific Islander";
    if(jsonData[data.name] != null) {
        if(jsonData[data.name].IncomeMale != null) {
            data.IncomeMale = jsonData[data.name].IncomeMale;
        }else {
            data.IncomeMale = 0;
        }
        if(jsonData[data.name].IncomeFemale != null) {
            data.IncomeFemale = jsonData[data.name].IncomeFemale;
        }else {
            data.IncomeFemale = 0;
        }
    } else {
        data.IncomeFemale = 0; data.IncomeMale = 0;
    }
    dataArray[4] = (data);

    var data = {};
    data.name =   "Other";
        if(jsonData[data.name] != null) {
            if(jsonData[data.name].IncomeMale != null) {
                data.IncomeMale = jsonData[data.name].IncomeMale;
            }else {
                data.IncomeMale = 0;
            }
            if(jsonData[data.name].IncomeFemale != null) {
                data.IncomeFemale = jsonData[data.name].IncomeFemale;
            }else {
                data.IncomeFemale = 0;
            }
        } else {
            data.IncomeFemale = 0; data.IncomeMale = 0;
        }
    dataArray[5] = (data);

    var data = {};
    data.name =  "White";
        if(jsonData[data.name] != null) {
            if(jsonData[data.name].IncomeMale != null) {
                data.IncomeMale = jsonData[data.name].IncomeMale;
            }else {
                data.IncomeMale = 0;
            }
            if(jsonData[data.name].IncomeFemale != null) {
                data.IncomeFemale = jsonData[data.name].IncomeFemale;
            }else {
                data.IncomeFemale = 0;
            }
        } else {
            data.IncomeFemale = 0; data.IncomeMale = 0;
        }
    dataArray[6] = (data);

    var data = {};
    data.name =  "StateAverage";
    data.IncomeMale = jsonData.IncomeMale;
    data.IncomeFemale = jsonData.IncomeFemale;
    dataArray[7] = (data);

   return dataArray;

}





var width = document.getElementById('MainPanel').offsetWidth;
var height = window.innerHeight;
var states;
var hourlyRates;
var largestDifference = 0;

d3.json("../Data/IncomeState.json", function(json){
    hourlyRates = json;

    for(var state in json) {
        var difference = json[state].IncomeMale - json[state].IncomeFemale;
        if(difference > largestDifference){
            largestDifference = difference;
        }
    };
    largestDifference = Math.ceil(largestDifference);
    initBarChart("00");
    initScale();

});

MainSvg.append("text")
    .text("Male to Female Yearly Income Difference")
    .attr("x", 550)
    .attr("text-anchor", "middle")
    .attr("y", 50)
    .attr("font-size", "40px")
    .attr("font-family","Adobe Caslon Pro");

d3.json("../assets/500k.json", function(json) {

    //Bind data and create one path per GeoJSON feature
    states  = MainSvg.append("g")
        .attr("width", "100%")
        .attr("height", "100%");



    // create a first guess for the projection
    var center = d3.geo.centroid(json)
    var scale  = 1000;
    var offset = [600 , 300];
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
        })
        .on('click', function(d){
            updateBarChart(d.properties.STATE, d.properties.NAME);
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

    var femaleRate = hourlyRates[stateData.properties.STATE].IncomeFemale;
    var maleRate = hourlyRates[stateData.properties.STATE].IncomeMale;
    stateData.IncomeFemale = femaleRate;
    stateData.IncomeMale = maleRate;

    if(femaleRate >= maleRate){
        return 'rgba(220,150,100,'+(femaleRate-maleRate)/largestDifference+')';
    }else {
        return 'rgba(90,160,210,'+(maleRate-femaleRate)/largestDifference+')';
    }
}


var tooltipDiv;
var bodyNode = d3.select('body').node();

var  mousoverState = function(stateData, path){
    d3.select(path.parentNode.appendChild(path)).attr("stroke", '#000')
                    .attr("stroke-width", 1.2);

    var femaleRate = hourlyRates[stateData.properties.STATE].IncomeFemale;
    var maleRate = hourlyRates[stateData.properties.STATE].IncomeMale;

    var color = 'rgba(200,150,68,0.8)';
    color = d3.select(path).attr('fill');
    color = color.replace(/[\d\.]+\)$/g, '0.8)');
    //if(femaleRate > maleRate){
    //    color = 'rgba(187,136,68,0.8)';
    //} else if (femaleRate == maleRate){
    //    color = 'rgba(100,100,100,0.8)';
    //}

    // Clean up lost tooltips
    d3.select('body').selectAll('div.tooltipMap').remove();
    // Append tooltip
    tooltipDiv = d3.select('body').append('div').attr('class', 'tooltipMap');
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px')
        .style('position', 'absolute')
        .style('background-color', color)
        .style('border', '1px solid #000')
        .style('margin', '10px')
        .style('height', '80px')
        .style('width', '150px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function


    var tooltipText = "<b>"+stateData.properties.NAME + "</b><br/> Female: " + femaleRate + "<br/> Male: " + maleRate + "";
    tooltipDiv.html(tooltipText);
};


var mousemoveState = function(stateData, path){

    // Move tooltip
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px');
}

var mouseoutState = function(stateData, path){
    d3.select(path).attr("stroke", "#ffffff")
                .attr("stroke-width", 1)
                .attr("opacity", "1");

    // Remove tooltip
    tooltipDiv.remove();
};


var initScale = function(){
    MainSvg.append("linearGradient")
        .attr("id", "temperature-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 150)
        .attr("x2", 0).attr("y2", 450)
        .selectAll("stop")
        .data([
            {offset: "0%", color: "rgb(90,160,210)"},
            {offset: "50%", color: "#fff"},
            {offset: "100%", color: "rgb(220,150,100)"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    MainSvg.append("rect")
        .attr("class", "scale")
        .attr("x", 20)
        .attr("y", 150)
        .attr("width", 50)
        .attr("height", 300);

    MainSvg.append("text")
        .attr("x", 75)
        .attr("y", 160)
        .text("$"+largestDifference + "");

    MainSvg.append("text")
        .attr("x", 75)
        .attr("y", 305)
        .text("$0");

    MainSvg.append("text")
        .attr("x", 75)
        .attr("y", 450)
        .text("-$" +largestDifference+ "");

    MainSvg.append("text")
        .attr("x", 20)
        .attr("y", 130)
        .text("Male - Female");
}






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




