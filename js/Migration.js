var MainSvg =  d3.select("#MainPanel").append("svg")
    .attr("width", '100%')
    .attr('height', '100%')
    .style('position','absolute');

var margin = {top: 100, right: 80, bottom: 80, left: 1400},
    chartWidth = 450;
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
    var color = 'rgba(150,150,150,0.8)';

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
var continentLines = {};
var yearWAOB;
var firstYear = 3000;
var lastYear = 0;
var yearSelector;
var largestMigration = 0;

var currentYear;
var yearDisplay;

d3.json("../Data/yearOfEntryWAOB.json", function(json){
    yearWAOB = json;

    for(var year in json) {
        if(year < firstYear){
            firstYear = year;
        }
        if(year > lastYear){
            lastYear = year;
        }
        for(var c in yearWAOB[year]){
            var num = yearWAOB[year][c];
            if(num > largestMigration){
                largestMigration = num;
            }
        }
    };


    //initBarChart("00");
    //initScale();
    currentYear = firstYear;


    yearSelector = d3.select("#yearSelector");

    var year = parseInt(firstYear);
    while( year <= parseInt(lastYear)){
        yearSelector.append("option").attr("value", year).text(year);
        year = year + 5;
    }
});

//MainSvg.append("text")
//    .text("Male to Female Yearly Income Difference")
//    .attr("x", 550)
//    .attr("text-anchor", "middle")
//    .attr("y", 50)
//    .attr("font-size", "40px")
//    .attr("font-family","Adobe Caslon Pro");

var WAOBLines = {
    "3" : [{"x": 300, "y": 400}, {"x": 170, "y": 600},  {"x": 440, "y": 600}],
    "4" : [{"x": 320, "y": 400}, {"x": 600, "y": 410},   {"x": 900, "y": 400}],
    "5" : [{"x": 300, "y": 400}, {"x": 470, "y": 300},   {"x": 660, "y": 350}],
    "6" : [{"x": 310, "y": 400}, {"x": 500, "y": 470},     {"x": 680, "y": 500}],
    "7" : [{"x": 260, "y": 380}, {"x": 250, "y": 320},   {"x": 250, "y": 250}],
    "8" : [{"x": 290, "y": 400}, {"x": 600, "y": 630},   {"x": 1050, "y": 630}]

};

d3.json("../assets/world.geo.json", function(json) {

    //Bind data and create one path per GeoJSON feature
    states  = MainSvg.append("g")
        .attr("width", "100%")
        .attr("height", "100%");



    // create a first guess for the projection
    var center = d3.geo.centroid(json)
    var scale  = 180;
    var offset = [700 , 340];
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
        .attr("fill","#aaaaaa")
        .attr("stroke","#555555")
        .on('mouseover', function(d) {
            mousoverState(continentToNumeber(d.properties.continent));
        })
        .on('mousemove', function(){
            mousemoveState();
        })
        .on('mouseout', function(){
            mouseoutState();
        });


    yearDisplay = states.append("text")
        .text(currentYear)
        .attr("x", 50)
        .attr("y", 100)
        .attr("fill", "rgb(100,100,100)")
        .attr("font-size", "90px");

    var lines = MainSvg.append("g");

    for(var continent in WAOBLines){
        var backgroundGradient = "linkBackground-gradient-"+continent;

        var lineDetails = WAOBLines[continent];
        MainSvg.append("radialGradient")
            .attr("id", backgroundGradient)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("cx", lineDetails[1]["x"])
            .attr("cy", lineDetails[1]["y"])
            .attr("r", distance(lineDetails[0]["x"],lineDetails[0]["y"],lineDetails[1]["x"],lineDetails[1]["y"]))
            .selectAll("stop")
            .data([
                {offset: "60%", color: "rgba(34,34,34,1)"},
                {offset: "80%", color: "rgba(34,34,34,0)"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        var background = lines.append("path")
            .attr("d", line(lineDetails))
            .attr("class", "linkBackground")
            .attr("stroke", "url(#"+backgroundGradient+")")
            .attr("stroke-width", 7)
            .attr("fill", "none")
            .attr("continent", continent)
            .on('mouseover', function() {
                mousoverState(d3.select(this).attr("continent"));
            })
            .on('mousemove', function(){
                mousemoveState();
            })
            .on('mouseout', function(){
                mouseoutState();
            });


        var foregroundGradient = "linkForeground-gradient-"+continent;
        MainSvg.append("radialGradient")
            .attr("id", foregroundGradient)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("cx", lineDetails[1]["x"])
            .attr("cy", lineDetails[1]["y"])
            .attr("r", distance(lineDetails[0]["x"],lineDetails[0]["y"],lineDetails[1]["x"],lineDetails[1]["y"]))
            //.attr("x1", lineDetails[0]["x"]).attr("y1", lineDetails[0].y)
            //.attr("x2", lineDetails[2]["x"]).attr("y2", lineDetails[2].y)
            .selectAll("stop")
            .data([
                {offset: "90%", color: getContinentColour(numberToContinent(continent))},
                {offset: "100%", color: getContinentColour(numberToContinent(continent)).replace(/[\d\.]+\)$/g, '0)')}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });


        var foreground = lines.append("path")
            .attr("class", "link")
            .attr("stroke", "url(#"+foregroundGradient+")")
            .attr("stroke-width", 5)
            .attr("fill", "none")
            .attr("d", line(lineDetails))
            .attr("continent", continent)
            .on('mouseover', function() {
                mousoverState(d3.select(this).attr("continent"));
            })
            .on('mousemove', function(){
                mousemoveState();
            })
            .on('mouseout', function(){
                mouseoutState();
            });

        continentLines[continent] = {"background" : background, "foreground": foreground};
    }

    processStates(states);

    initLines();


});

var distance = function(x1,y1,x2,y2){
    var xDst = (x1-x2) * (x1-x2);
    var yDst = (y1-y2) *(y1-y2);
    return Math.sqrt(xDst + yDst);
}

var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis");


var processStates = function(){
    states.selectAll("path")
        .attr("fill", function(d){
            if(d.properties.name == "United States"){ return "rgb(150,150,150)"}
            return getContinentColour(d.properties.continent);
        });
}

var getContinentColour = function(continent){
    switch(continent){
        case "South America" : return "rgba(220,140,150,1)";
        case "Oceania" : return "rgba(160,160,230,1)";
        case "Asia" : return "rgba(240,240,130,1)";
        case "Europe" : return "rgba(220,150,220,1)";
        case "Africa" : return "rgba(150,220,150,1)";
        case "North America" : return "rgba(250,200,80,1)";
        default :  return "rgb(200,200,200)"
    }

}


var numberToContinent = function(number){
    switch(number){
        case "3": return "South America";
        case "4": return "Asia";
        case "5": return "Europe";
        case "6": return "Africa";
        case "7": return "North America";
        case "8": return "Oceania";
        default :  return "Other"
    }
}

var continentToNumeber = function(continent){
    switch(continent){
        case "South America" : return "3";
        case "Asia": return "4";
        case "Europe": return "5";
        case "Africa": return "6";
        case "North America": return "7";
        case "Oceania": return "8";
        default :  return "Other"
    }
}

var initLines = function(){
    //var data = yearWAOB[firstYear];
    var data = yearWAOB[firstYear];

    updateLines(data, largestMigration, 0);
}

var dura = 500;
var updateLines = function(yearData, total, delay){
    for(var contLine in continentLines){
        if(yearData[contLine] != null){
            var width = yearData[contLine]/total * 110;
            continentLines[contLine].background
                .transition()
                .delay(delay)
                .duration(dura)
                .attr("stroke-width", width + 2);
            continentLines[contLine].foreground
                .transition()
                .delay(delay)
                .duration(dura)
                .attr("stroke-width", width );
        } else {
            continentLines[contLine].background
                .transition()
                .delay(delay)
                .duration(dura)
                .attr("stroke-width", 0);
            continentLines[contLine].foreground
                .transition()
                .delay(delay)
                .duration(dura)
                .attr("stroke-width", 0 );
        }
    }
}

var playClicked = function(){

    var year = parseInt(currentYear);
    var delay = 0;
    while(year <= parseInt(lastYear)){

        yearSelector.transition().delay(delay).each("start", animateYearValue(year));
        updateLines(yearWAOB[year], largestMigration, delay);
        delay += dura;
        year += 5;
    }
}

var animateYearValue = function(year){
    return function() {
        document.getElementById('yearSelector').value = ""+year;
        yearDisplay.text(year);
        currentYear = ""+year;
        updateToolTip();
    };

}

var yearSelected = function(year){
    currentYear = year;
    yearDisplay.text(year);
    updateLines(yearWAOB[year], largestMigration, 0);
}


var tooltipDiv;
var bodyNode = d3.select('body').node();

var updateToolTip = function(){
    if(tooltipDiv == null){return;}
    var continent = tooltipDiv.attr("continent");
    var number = yearWAOB[currentYear][continent];
    if(isNaN(number)){ number = 0}
    var tooltipText = "<b>" + numberToContinent(continent) + ": " + number + "</b>";
    tooltipDiv.html(tooltipText);
}


var  mousoverState = function(continent){

    // Clean up lost tooltips
    d3.select('body').selectAll('div.tooltipMap').remove();
    // Append tooltip
    tooltipDiv = d3.select('body').append('div').attr('class', 'tooltipMap');
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .attr("continent", continent)
        .style('top', (absoluteMousePos[1] - 15)+'px')
        .style('position', 'absolute')
        .style('background-color', getContinentColour(numberToContinent(continent)))
        .style('border', '1px solid #000')
        .style('margin', '10px')
        .style('height', '45px')
        .style('width', '190px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function

    var number = yearWAOB[currentYear][continent];
    if(isNaN(number)){ number = 0}
    var tooltipText = "<b>" + numberToContinent(continent) + ": " + fNum(number) + "</b>";
    tooltipDiv.html(tooltipText);
    // Crop text arbitrarily
    //tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
    //    .html(tooltipText);
};


var fNum = function(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var mousemoveState = function(stateData, path){

    // Move tooltip
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px');
    //var tooltipText = "<b>"+stateData.properties.NAME + "</b><br/><b>" + femaleRate +"</b><br/><b>" + maleRate + "</b>";
    //tooltipDiv.html(tooltipText);
}

var mouseoutState = function(stateData, path){
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




