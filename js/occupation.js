var margin = { top: 30, right: 0, bottom: 100, left: 460 },
    width = 1000 ,
    height = 350,
    gridSize = Math.floor(width / 24);

var occupations = [];
var races = [];
var dataKeys = [];
var occupationJson;
var largestDifference = 0;
var svg;

d3.json("../Data/IncomeOccupation.json", function(json){
    occupationJson = json;

    for(var occupation in json) {
        var difference = json[occupation].IncomeMale - json[occupation].IncomeFemale;
        if(difference > largestDifference){
            largestDifference = difference;
        }
    };
    largestDifference = Math.ceil(largestDifference);
    processOccupations();
    processOccupations2();
});

var processOccupations = function() {
    var occCount = 0;
    for (var occupation in occupationJson) {
        if (occupation == "00") {

        } else {
            occupations[occCount++] = occupation;
        }
    }
    occupations.sort();
    occupations[occCount] = "ALL";

    var raceCount = 0;
    for (var race in occupationJson["00"]) {
        if (race != "IncomeMale" && race != "IncomeFemale" && race != "TotalMale" && race != "TotalFemale") {
            races[raceCount++] = race;

        }
    }
    races.sort();
    races[raceCount] = "All";

    var dk = 0;
    for(var o in occupations){
        for(var r in races){
            dataKeys[dk++] = {"race" : races[r], "occupation" : occupations[o]};
        }
    }

    gridSize = width/(occupations.length+1);

     svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var raceLabels = svg.selectAll(".raceLabel")
        .data(races)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d) {
            return getRacePosition(d) * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "raceLabel mono axis");

    var occupationLabels = svg.selectAll(".occupation")
        .data(occupations)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d) {
            return getOccupationPosition(d) * gridSize;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", "occupation mono axis");

    var title = svg.append("text")
        .style("text-anchor", "end")
        .style("font-size", "20pt")
        .attr("x", -200)
        .attr("y", height/2)
        .text("Male vs Female");



    initScale();
    heatmapChart();

}

var heatmapChart = function() {

    var cards = svg.selectAll(".incomeDiff")
        .data(dataKeys);


    cards.enter().append("rect")
        .attr("x", function(d) { return getOccupationPosition(d.occupation) * gridSize;})
        .attr("y", function(d) { return getRacePosition(d.race) * gridSize;})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .on("mouseover",function(d){
            mousoverState(d, this);
        })
        .on("mousemove",function(d){
            mousemoveState(d, this);
        })
        .on("mouseout",function(d){
            mouseoutState(d, this);
        })
        .style("fill", function(d){
            return getDataColour(d.occupation, d.race);
        });

    //cards.transition().duration(1000)
    //    .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });

    cards.exit().remove();

};

var tooltipDiv;
var bodyNode = d3.select('body').node();

var  mousoverState = function(occData, path) {
    d3.select(path).attr("stroke", '#000')
        .attr("stroke-width", 1.2);

    var occupationData = occupationJson[occData.occupation];
    if (occData.occupation == "ALL" ) {
        occupationData = occupationJson["00"];
    }
    var femaleRate;
    var maleRate;
    var females;
    var males;

    if (occData.race == "All") {
        femaleRate = occupationData.IncomeFemale;
        maleRate= occupationData.IncomeMale;
        females = occupationData.TotalFemale;
        males = occupationData.TotalMale;
    } else {
        femaleRate = occupationData[occData.race].IncomeFemale;
        maleRate = occupationData[occData.race].IncomeMale;
        females = occupationData[occData.race].TotalFemale;
        males = occupationData[occData.race].TotalMale;
    }

    var color = 'rgba(200,150,68,0.8)';
    color = d3.select(path).style('fill');
    color = color.replace(/[\d\.]+\)$/g, '0.8)');

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
        .style('height', '150px')
        .style('width', '150px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function


    var tooltipText = "<b>Income</b> <br/>Female: " + fNum(femaleRate) + "<br/>Male: " + fNum(maleRate) + "<br/><b>Number</b><br/>Females: " + fNum(females) + "<br/>Males: " + fNum(males);
    tooltipDiv.html(tooltipText);
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



var getOccupationPosition = function(occupationString){
    if(occupationString =="ALL"){
        return occupations.indexOf(occupationString) + 0.5;
    }
    return occupations.indexOf(occupationString);
}
var getRacePosition = function(raceString){
    if(raceString =="All" ){
        return races.indexOf(raceString) + 0.5;
    }
    return races.indexOf(raceString);
}

var getDataColour = function(occupation, race){

    var occupationData = occupationJson[occupation];
    if(occupation == "ALL"){
        occupationData = occupationJson["00"];
    }
    var raceData = occupationData[race];
    if(race == "All"){
        raceData = occupationData;
    }

    var femaleIncome = raceData.IncomeFemale;
    var maleIncome = raceData.IncomeMale;

    if(femaleIncome == null || maleIncome == null){
        return "rgba(150,150,150,0.9)";
    }

    if(femaleIncome >= maleIncome){
        return 'rgba(220,150,100,'+Math.min(0.99,(femaleIncome-maleIncome)/largestDifference)+')';
    }else {
        return 'rgba(90,160,210,'+Math.min(0.99,(maleIncome-femaleIncome)/largestDifference)+')';
    }
}


var initScale = function(){
    svg.append("linearGradient")
        .attr("id", "temperature-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 600).attr("y2", 0)
        .selectAll("stop")
        .data([
            {offset: "0%", color: "rgb(90,160,210)"},
            {offset: "50%", color: "#fff"},
            {offset: "100%", color: "rgb(220,150,100)"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg.append("rect")
        .attr("class", "scale")
        .attr("x", 0)
        .attr("y", height+5)
        .attr("width", 600)
        .attr("height", 30);

    svg.append("text")
        .attr("x", 0)
        .attr("y", height )
        .attr("text-anchor", "end")
        .text("$"+fNum(largestDifference) + "");

    svg.append("text")
        .attr("x", 300)
        .attr("text-anchor", "middle")
        .attr("y", height)
        .text("$0");

    svg.append("text")
        .attr("x", 600)
        .attr("y", height )
        .attr("text-anchor", "start")
        .text("-$" +fNum(largestDifference)+ "");

    svg.append("text")
        .attr("x", 300)
        .attr("y", height + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "12pt")
        .text("Male To Female Income");
}





var margin2 = { top: 30, right: 0, bottom: 100, left: 460 },
    width2 = 1000 ,
    height2 = 350,
    gridSize2 = Math.floor(width / 24);

var largestDifference2 = 0;
var averageIncome = [];
var svg2;
var dataKeys2 = [];


var avg = function(one, two){
    if(isNaN(one)){
        return two;
    }
    if(isNaN(two)){
        return one;
    }
    return Math.round(((one + two)/2)*100)/100;
}

var processOccupations2 = function() {
    var json = occupationJson

    averageIncome["00"] = avg(json["00"].IncomeFemale, json["00"].IncomeMale);

    for(var occupation in json) {
        for (var r in json[occupation]) {
            var difference = avg(json[occupation].IncomeMale, json[occupation].IncomeFemale) - averageIncome;
            if (difference > largestDifference2) {
                largestDifference2 = difference;
            }
        }
        averageIncome[occupation] = avg(json[occupation].IncomeFemale, json[occupation].IncomeMale);
    };
    largestDifference2 = Math.ceil(largestDifference2);

    var dk = 0;
    for(var o in occupations){
        if(occupations[o] != "ALL") {
            for (var r in races) {
                dataKeys2[dk++] = {"race": races[r], "occupation": occupations[o]};
            }
        }
    }



    gridSize2 = width2/(occupations.length+1);

    svg2 = d3.select("#chart").append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    var races2 = [];
    for(var o in races){
        if(races[o] == "All"){
            races2[o] = "Average";
            continue;
        }
        races2[o] = races[o];
    }

    var raceLabels = svg2.selectAll(".raceLabel")
        .data(races2)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 0)
        .attr("y", function (d) {
            return getRacePosition2(d) * gridSize2;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize2 / 1.5 + ")")
        .attr("class", "raceLabel mono axis");

    var occupations2 = [];
    for(var o in occupations){
        if(occupations[o] == "ALL"){ continue;}
        occupations2[o] = occupations[o];
    }

    var occupationLabels = svg2.selectAll(".occupation")
        .data(occupations2)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d) {
            return getOccupationPosition2(d) * gridSize2;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize2 / 2 + ", -6)")
        .attr("class", "occupation mono axis");

    var title = svg2.append("text")
        .style("text-anchor", "end")
        .style("font-size", "20pt")
        .attr("x", -200)
        .attr("y", height/2)
        .text("Race vs Average");

    initScale2();
    heatmapChart2();

}

var heatmapChart2 = function() {

    var cards = svg2.selectAll(".incomeDiff")
        .data(dataKeys2);


    cards.enter().append("rect")
        .attr("x", function(d) { return getOccupationPosition2(d.occupation) * gridSize2;})
        .attr("y", function(d) { return getRacePosition2(d.race) * gridSize2;})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize2)
        .attr("height", gridSize2)
        .on("mouseover",function(d){
            mousoverState2(d, this);
        })
        .on("mousemove",function(d){
            mousemoveState2(d, this);
        })
        .on("mouseout",function(d){
            mouseoutState2(d, this);
        })
        .style("fill", function(d){
            return getDataColour(d.occupation, d.race);
        })
        .style("fill", function(d){
            return getDataColour2(d.occupation, d.race);
        });

    cards.select("title").text(function(d) { return d.value; });

    cards.exit().remove();


};

var getOccupationPosition2 = function(occupationString){
    if(occupationString =="ALL"){
        return occupations.indexOf(occupationString) + 0.5;
    }
    return occupations.indexOf(occupationString);
}
var getRacePosition2 = function(raceString){
    if(raceString == "Average" || raceString=="All"){
        return races.indexOf("All") + 0.5;
    }
    return races.indexOf(raceString);
}

var getDataColour2 = function(occupation, race){
    var occupationData = occupationJson[occupation];
    if(occupation == "ALL"){
        occupationData = occupationJson["00"];
    }
    var raceData = occupationData[race];
    if(race == "All"){
        raceData = occupationData;
    }

    var femaleIncome = raceData.IncomeFemale;
    var maleIncome = raceData.IncomeMale;

    if(femaleIncome == null || maleIncome == null){
        return "rgba(150,150,150,.99)";
    }

    var av = avg(femaleIncome, maleIncome);
    if(av < averageIncome[occupation]){
        return 'rgba(220,150,100,'+Math.min(0.99,(averageIncome[occupation]-av)/averageIncome[occupation])+')';
    }else {
        return 'rgba(90,160,210,'+Math.min(0.99,(av-averageIncome[occupation])/averageIncome[occupation])+')';
    }
}


var initScale2 = function(){
    svg2.append("linearGradient")
        .attr("id", "temperature-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 600).attr("y2", 0)
        .selectAll("stop")
        .data([
            {offset: "0%", color: "rgb(90,160,210)"},
            {offset: "50%", color: "#fff"},
            {offset: "100%", color: "rgb(220,150,100)"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg2.append("rect")
        .attr("class", "scale")
        .attr("x", 0)
        .attr("y", height2+5)
        .attr("width", 600)
        .attr("height", 30);

    svg2.append("text")
        .attr("x", 0)
        .attr("y", height2 )
        .attr("text-anchor", "end")
        .text("$"+fNum(largestDifference2) + "");

    svg2.append("text")
        .attr("x", 300)
        .attr("text-anchor", "middle")
        .attr("y", height2)
        .text("$0");

    svg2.append("text")
        .attr("x", 600)
        .attr("y", height2 )
        .attr("text-anchor", "start")
        .text("-$" +fNum(largestDifference2)+ "");

    svg2.append("text")
        .attr("x", 300)
        .attr("y", height2 + 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "12pt")
        .text("Occupational Difference To Average For Occupation");
}


var  mousoverState2 = function(occData, path) {
    d3.select(path).attr("stroke", '#000')
        .attr("stroke-width", 1.2);

    var occupationData = occupationJson[occData.occupation];
    if (occData.occupation == "ALL"  || occData.occupation == "Average") {
        occupationData = occupationJson["00"];
    }
    var femaleRate;
    var maleRate;
    var females;
    var males;


    if (occData.race == "All"  || occData.race == "Average") {
        femaleRate = occupationData.IncomeFemale;
        maleRate= occupationData.IncomeMale;
        females = occupationData.TotalFemale;
        males = occupationData.TotalMale;
    } else {
        femaleRate = occupationData[occData.race].IncomeFemale;
        maleRate = occupationData[occData.race].IncomeMale;
        females = occupationData[occData.race].TotalFemale;
        males = occupationData[occData.race].TotalMale;
    }

    var color = 'rgba(200,150,68,0.8)';
    color = d3.select(path).style('fill');
    color = color.replace(/[\d\.]+\)$/g, '0.8)');

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
        .style('height', '65px')
        .style('width', '150px')
        .style('-webkit-border-radius', '10px')
        .style('-moz-border-radius', '10px')
        .style('border-radius','10px')
        .style('padding-left', '10px')
        .style('padding-top', '10px')
        .style('z-index', 1001);
    // Add text using the accessor function

    var number  = females + males;
    var tooltipText = "<b>Income:</b> " + fNum(avg(femaleRate,maleRate)) + "<br/><b>Number:</b> " + fNum(number);
    tooltipDiv.html(tooltipText);
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

var mousemoveState2 = function(stateData, path){

    // Move tooltip
    var absoluteMousePos = d3.mouse(bodyNode);
    tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
        .style('top', (absoluteMousePos[1] - 15)+'px');
    //var tooltipText = "<b>"+stateData.properties.NAME + "</b><br/><b>" + femaleRate +"</b><br/><b>" + maleRate + "</b>";
    //tooltipDiv.html(tooltipText);
}

var mouseoutState2 = function(stateData, path){
    d3.select(path).attr("stroke", "#ffffff")
        .attr("stroke-width", 1)
        .attr("opacity", "1");

    // Remove tooltip
    tooltipDiv.remove();
};