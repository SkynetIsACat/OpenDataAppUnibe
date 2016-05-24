$.material.init()
//$("div.navbar-fixed-top").autoHidingNavbar();
$(document).ready(function () {
    is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    is_safari = navigator.userAgent.indexOf("Safari") > -1;
    is_opera = navigator.userAgent.indexOf("Presto") > -1;
    is_mac = (navigator.userAgent.indexOf('Mac OS') != -1);
    is_windows = !is_mac;

    if (is_chrome && is_safari){
      is_safari=false;
    }

    if (is_safari || is_windows){
      $('.panel-heading').css('-webkit-text-stroke', '0.7px');
    }


  });

//Scroll plugin
$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 70,
    duration      : 300,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

var touch = false;
var chart;
 //add sticky button
var svgContainer = document.getElementById("svg-container");
var body = document.getElementsByName("body");
function scrollToSVG(){
    zenscroll.center(svgContainer, 500, 300);
    
    //setTimeout(function(){d3.select(".carousel-container").remove();},700);
}

function switchTouch(){
    if (touch) {
        touch = false;
    }
    else {
        touch = true;
    }
    renderSVG(reDrawState);
}

//add modal callFunction

function callModal() {
    $("#myModal").show();
}
//define margin of SVG
var margin = {top: 20, right: 30, bottom: 0, left: 65}

// general Chart info to work with spin.js, defines path to json data file
var chartConfig = {
    target : 'viz',
    data_url : 'js/data.json',
    val: 90
};
var target = document.getElementById(chartConfig.target);

//defines all different statistical categories
var statCategories = {
    Age0 : 'nAge0',
    Age1 : 'nAge1',
    Age2 : 'nAge2',
    Age3 : 'nAge3',
}

function switchToN(){
    statCategories = {
        Age0 : 'nAge0',
        Age1 : 'nAge1',
        Age2 : 'nAge2',
        Age3 : 'nAge3', 
    };
    d3.select("#graph-title").text("Anzahl Fälle")
    $("#n").addClass("active");
    $("#da").removeClass("active");
    $("#sd").removeClass("active");
    $("#daTotal").removeClass("active");
    
    renderSVG(reDrawState);
    zenscroll.toY(0);
}

function switchToTotalDa(){
    statCategories = {
        Age0 : 'totalDaAge0',
        Age1 : 'totalDaAge1',
        Age2 : 'totalDaAge2',
        Age3 : 'totalDaAge3', 
    };
    d3.select("#graph-title").text("Total verursachte Aufenthaltsdauer (Tage)")
    $("#n").removeClass("active");
    $("#da").removeClass("active");
    $("#sd").removeClass("active");
    $("#daTotal").addClass("active");
    
    renderSVG(reDrawState);
    zenscroll.toY(0);
}

function switchToDa(){
    statCategories = {
        Age0 : 'daAge0',
        Age1 : 'daAge1',
        Age2 : 'daAge2',
        Age3 : 'daAge3', 
    };
    d3.select("#graph-title").text("Durchschnittliche Aufenthaltsdauer (Tage)")
    $("#n").removeClass("active");
    $("#da").addClass("active");
    $("#sd").removeClass("active");
    $("#daTotal").removeClass("active");
    
    renderSVG(reDrawState);
    zenscroll.toY(0);
}

function switchToSd(){
    statCategories = {
        Age0 : 'sdAge0',
        Age1 : 'sdAge1',
        Age2 : 'sdAge2',
        Age3 : 'sdAge3', 
    };
    d3.select("#graph-title").text("Standardabweichung (Tage)")
    $("#n").removeClass("active");
    $("#da").removeClass("active");
    $("#sd").addClass("active");
    $("#daTotal").removeClass("active");
    
    renderSVG(reDrawState);
    zenscroll.toY(0);
}

//settings for spinner
var opts = {
  lines: 9,
  length: 9, 
  width: 5,
  radius: 14,
  color: '#EE3124',
  speed: 1.9,
  trail: 40, 
  className: 'spinner',
};

//colors for age categories
var colors = {
    '0-14': "#01579b",
    '15-39': "#0288d1",
    '40-69': "#03a9f4",
    '70+': "#4fc3f7"
};

//defines tooltip and some style properties
//var tooltip = d3.select("#viz1")
//    .append("div")
//    .attr("id", "tooltip")
//    .style("position", "relative")
//    .style("z-index", "10")
//    .style("opacity", 1);


// define tip and displayed text and color

var tipAge0 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>0-14 Jahre:</strong> <span style='color: #97d700'>" + d[statCategories.Age0] + "</span>";
 })

var tipAge1 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>15-39 Jahre:</strong> <span style='color: #97d700'>" + d[statCategories.Age1] + "</span>";
 })

var tipAge2 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>40-69 Jahre:</strong> <span style='color: #97d700'>" + d[statCategories.Age2] + "</span>";
 })

var tipAge3 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>70+ Jahre:</strong> <span style='color: #97d700'>" + d[statCategories.Age3] + "</span>";
 })



// helper function to convert type int to str
function format_number(x) {
	var x = Math.round(x);
  return x.toString();//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// formats tooltip description
function format_description(d) {
  var description = d.description;
	var codeable = d.codeable;
	var sub = d.sub;
      return  '<b> <strong>' + d.name + '</b></br>'+ d.description + '</strong><br> (' + format_number(d.value) + ') <br> Codeable: ' + d.codeable
	  			+ '<br> <br><i>' + d.sub + '</i>';
}

// Tooltip version with explanatins - to be removed
function format_description_standby() {
  var description = "Kurzbeschreibung der Entsprechenden Prozedur";
	var codeable = "Angabe zur Kodierbarkeit der Prozedur";
	var sub = "Zusätzliche Informationen und Unterkategorien mit demselben Code";
      return  '<b> <strong>' + "ZCODE" + '</b></br>'+ description + '</strong><br> (' + "Durchschnittliche Liegedauer in Tagen" + ') <br> Codeable: ' + codeable
	  			+ '<br> <br><i>' + sub + '</i>';
}


// helper function to calculate ancestors of a specific node
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

// defines dimensions of breadcrumbs
var b = {
  w: 100, h: 25, s: 3, t: 10
};

// initializes Breadcrumb
function initializeBreadcrumbTrail(width) {
  // Add the svg area.
  var trail = d3.select("#legend").append("svg:svg")
      .attr("width", width)
      .attr("height", 30)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}
//Store actual chart type and object state, respectively.
var chartType = "pie";
var redrawTimer = {
    nAge0:1,
    nAge1:1,
    nAge2:1,
    nAge3:1
};

function switchChartType()
{
    chart.flush();
    
    if (chartType === "pie"){
        d3.select("#chart-switch").text("pie_chart");
        chartType = "line";
        chart = c3.generate({
            data: {
                columns: [
                    ['Aufenthaltsdauer', redrawTimer[statCategories.Age0],redrawTimer[statCategories.Age1], redrawTimer[statCategories.Age2], redrawTimer[statCategories.Age3]]
                ]
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['0-14', '15-39', '40-69', '70+']
                }
            }
        });
    }
    else{
        chartType = "pie";
        d3.select("#chart-switch").text("timeline");
        chart = c3.generate({
            data: {
                columns: [
                    ['0-14', redrawTimer[statCategories.Age0]],
                    ['15-39', redrawTimer[statCategories.Age1]],
                    ['40-69', redrawTimer[statCategories.Age2]],
                    ['70+', redrawTimer[statCategories.Age3]]
                ],
                type : 'pie',
                colors: colors
            }
        });
    }    
}

function updateChart(d){
    var newData;
    if (redrawTimer !== d){
        if (chartType === "pie"){
            newData = [
                ["0-14", d[statCategories.Age0]],
                ["15-39", d[statCategories.Age1]],
                ["40-69", d[statCategories.Age2]],
                ["70+", d[statCategories.Age3]]
            ];
        }
        if (chartType === "line"){
            newData = [
                ["Aufenthaltsdauer", d[statCategories.Age0], d[statCategories.Age1], d[statCategories.Age2], d[statCategories.Age3]]
            ];

        }
        setTimeout(function(){
            chart.load({
            columns: newData,
            unload: chart.columns,
            });
        },100)
   
    }
    redrawTimer = d;
}

function updateText(d){
        d3.select("#description-title").html(d.name + "<br>" + d.description);
        d3.selectAll(".nAge0").html(d3.format(".2s")(d.nAge0));
        d3.selectAll(".nAge1").html(d3.format(".2s")(d.nAge1));
        d3.selectAll(".nAge2").html(d3.format(".2s")(d.nAge2));
        d3.selectAll(".nAge3").html(d3.format(".2s")(d.nAge3));
        d3.selectAll(".daTotalAge0").html(d3.format(".2s")(d.totalDaAge0));
        d3.selectAll(".daTotalAge1").html(d3.format(".2s")(d.totalDaAge1));
        d3.selectAll(".daTotalAge2").html(d3.format(".2s")(d.totalDaAge2));
        d3.selectAll(".daTotalAge3").html(d3.format(".2s")(d.totalDaAge3));
        d3.selectAll(".daAge0").html(d3.format(".2s")(d.daAge0));
        d3.selectAll(".daAge1").html(d3.format(".2s")(d.daAge1));
        d3.selectAll(".daAge2").html(d3.format(".2s")(d.daAge2));
        d3.selectAll(".daAge3").html(d3.format(".2s")(d.daAge3));
        d3.selectAll(".sdAge0").html(d3.format(".2s")(d.sdAge0));
        d3.selectAll(".sdAge1").html(d3.format(".2s")(d.sdAge1));
        d3.selectAll(".sdAge2").html(d3.format(".2s")(d.sdAge2));
        d3.selectAll(".sdAge3").html(d3.format(".2s")(d.sdAge3));
        if (d.codeable == "True"){
            console.log("hello")
            $("#checkbox").prop("checked",true);
            $("#codeable").removeClass("btn-primary");
            $("#codeable").addClass("btn-success");
            $("#codeable").removeClass("btn-warning");
            
        }
        else {
            $("#checkbox").prop('checked', false);
            $("#codeable").removeClass("btn-primary");
            $("#codeable").removeClass("btn-success");
            $("#codeable").addClass("btn-warning");
        }
        if (d.sub) {
            $("#show-more-target").removeClass("disabled");
            //$("#show-more-target").addClass("btn-info");
            d3.select("#show-more").html("<i>" + d.sub+ "</i>");
        }
        else {
            //$("#show-more-target").removeClass("btn-info");
            $("#show-more-target").addClass("disabled");
            d3.select("#show-more").html("Keine zusätzlichen Informationen vorhanden");
        }
    
        d3.select("#modal-target").html(d.sub);
}

var updateTimeout;
function updatePanel(d) {
        
        updateChart(d);
        updateText(d);
}

// define general hover effect
var panelTimeout;
function mouseOverArc(d) {
        d3.select(this).style("opacity", 0.7).select("text").style("fill", "steelblue");
        
        updateText(d);
        
    clearTimeout(panelTimeout);
    
    panelTimeout = setTimeout( function() {
        updateChart(d);
    },900);
}
function mouseOutArc(){
	d3.select(this).style("opacity",1).select("text").style("fill", "")
	//return tooltip.style("opacity", 0);
}

// stores nodes, accesible by name and code
var searchNode = {};
// list of all chop names and codes to work with typeahead
var chopDescriptions = [];
var node;
var reDrawState = false;

//indexes all chops and makes them accessible via a dictionary
function indexing(chop) {
    if (!chop.children && chop.children != "undefined") {
		chopDescriptions.push(chop.description);
		chopDescriptions.push(chop.name);
        searchNode[chop.description] = chop;
		searchNode[chop.name] = chop;
        return;
    }
    
    for (var i = 0; i < chop.children.length; i++) {
		var child = chop.children[i];
		chopDescriptions.push(child.description);
		chopDescriptions.push(child.name);
  		searchNode[child.description] = child;
		searchNode[child.name] = child;
        indexing(child);
    }
}

function expandStats() {
    $('#myModal2').modal('show');
}

//enables more statistics to either be collapsible or show a modal depending on touch mode
function mobileStats(){
    if (touch){
        $('.stat-table').removeAttr('id');
        $('#myModal2').modal('show');
    }
    else{
        $('.stat-table').attr('id', 'stat-table');
    }
}

function slowHardware(){
    d3.select("div.col-sm-8").remove();
    var keyCodes = {'enter' : 13};
    d3.select("input#searchid.typeahead.tt-input").on('keydown', function(){
        if (d3.event.keyCode === keyCodes.enter){
            down(searchNode[document.getElementById("searchid").value].parent, 0);
            updatePanel( searchNode[document.getElementById("searchid").value] );
        }
    });
}

//define colors of bars based on age category
var color0 = d3.scale.ordinal()
    .range(["#01579b", "#00acc1"]);
var color1 = d3.scale.ordinal()
    .range(["#0288d1", "#26c6da"]);
var color2 = d3.scale.ordinal()
    .range(["#03a9f4", "#80deea"]);
var color3 = d3.scale.ordinal()
    .range(["#4fc3f7", "#e0f7fa"]);

function ScreenType(screenType, mainSVGHeight, barHeight, breadCrumbHeight, breadCrumbWidth, touch){
    this.screenType = screenType;
    this.mainSVGHeight = mainSVGHeight;
    this.barHeight = barHeight;
    this.breadCrumbHeight = breadCrumbHeight;
    this.breadCrumbWidth = breadCrumbWidth;
    this.touch = touch;
    
    this.secondTouch = false;
    this.tempData = undefined;
    
};

ScreenType.prototype.UI = function() {
    if (this.secondTouch && tempData === d){
        this.secondTouch = false;
        
    }
};

// define global svg values
var x;
var svg;
var xAxis;
var duration = 750,
    delay = 25;
var touchUI;
var _height = 700;
var barHeight = 30;

// Renders the graph, reDraw is a boolean that controls data loading, if it is set true, no ajax call will be made
function renderSVG(reDraw) {
    
    //calculate actual width of screen and svg container
    var screenWidth = $(window).width();
    var _width = $('#viz').width();
    
    


    if (touch){
        var secondTouch = false;
        var tempData;
        touchUI = function(d, i){
            if (secondTouch && tempData === d){
                secondTouch = false;
                down(d, i);
            }
            else{
                updatePanel(d);
                secondTouch = true;
            }
            tempData = d;
        }
    }
    else{
        touchUI = function(d, i){
            down(d, i);
        }
    }
    //define responsive design sepcific breakpoint adjustments
	if (screenWidth < 775) {
        margin.left = 40;
    }
    else margin.left = 75
    if (_width < 480) {
        barHeight = 20;
        _height = 350;
    }
    //define width and height for svg
    var width = _width - margin.left - margin.right;
    var height = _height - margin.top - margin.bottom;

    
    if (reDraw) {
        d3.select("#viz").selectAll("svg").remove();
        switchChartType();
        switchChartType();
    }
    
    if (chartType === "pie"){
        chart = c3.generate({
            data: {
                columns: [
                    ['0-14', redrawTimer[statCategories.Age0]],
                    ['15-39', redrawTimer[statCategories.Age1]],
                    ['40-69', redrawTimer[statCategories.Age2]],
                    ['70+', redrawTimer[statCategories.Age3]]
                ],
                type : 'pie',
                colors: colors
            }
        });
    }

    initializeBreadcrumbTrail(_width);
    
    //define and draw svg elements
    x = d3.scale.linear().range([0, width]);
    
    
    var partition = d3.layout.partition()
        .value(function(d) { return (d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2] + d[statCategories.Age3]); });
    
	partition.sort( function (a, b){
		return (b[statCategories.Age0] + b[statCategories.Age1] + b[statCategories.Age2] + b[statCategories.Age3]) - (a[statCategories.Age0] + a[statCategories.Age1] + a[statCategories.Age2] + a[statCategories.Age3]);
	})
    
    xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickFormat(d3.format(".2s"));
    
    svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("z-index", "10")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // enable tip functionality only when touch disabled
    if (touch) {
        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "white")
            .on("click", up);
    }
    else {
        svg.call(tipAge0);
        svg.call(tipAge1);
        svg.call(tipAge2);
        svg.call(tipAge3);
        
        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "white")
            .on("click", up)
            .on('mouseover.1', tipAge0.hide)
            .on('mouseover.2', tipAge1.hide)
            .on('mouseover.3', tipAge2.hide)
            .on('mouseover.4', tipAge3.hide)
            .on('mousemove.1', tipAge0.hide)
            .on('mousemove.2', tipAge1.hide)
            .on('mousemove.3', tipAge2.hide)
            .on('mousemove.4', tipAge3.hide);
    }
    
    
    svg.append("g")
        .attr("class", "x axis");

    svg.append("g")
        .attr("class", "y axis")
      .append("line")
        .attr("y1", "100%");
    
    //either loads data or just redraws svg
    if (!reDraw) {
        function init() {
            
            //create new spinner
            var spinner = new Spinner(opts).spin(target);
                
                //load data and perform actions, which need to be in sync with ajax call
                d3.json(chartConfig.data_url, function(error, root) {
                    if (error) throw error

                    spinner.stop();
  
                    
                    
                    //activate modal to alert user - to be removed
                    if (window.matchMedia("(orientation: portrait)").matches) { 
                        $("#myModal").modal('show'); 
                    }
                    window.addEventListener("orientationchange", function() {
                      setTimeout(function(){
                          if (window.matchMedia("(orientation: portrait)").matches) {
                            $("#myModal").modal('show');
                        }
                      }, 500);
                    }, false);
                    
                    
                    
                    node = root;
                    partition.nodes(root);
                    x.domain([0, root.value]).nice();
                    down(root, 0);
                    indexing(node);
                    
                    //initate Bloodhound
                    var chopSearch = chopDescriptions;
                    chopSearch = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.whitespace,
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        local: chopSearch,
                        limit: 10
                    });
                    $('#the-basics .typeahead').typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 0
                    },						 
                    {
                        name: 'chopSearch',
                        source: chopSearch
                    });
                    
                    //Connect search to svg
                    var keyCodes = {'enter' : 13};
                    d3.select("input#searchid.typeahead.tt-input").on('keydown', function(){
                        //check if enter was pressed
                        if (d3.event.keyCode === keyCodes.enter){
                            //go to respective node and change opacity to highlight the respective node
                            down(searchNode[document.getElementById("searchid").value].parent, 0);
                            svg.selectAll("rect")[0].forEach(function (d) {
					           //d3.select(d).style("fill",d.fill);
					           //d3.select(d).style('opacity', 1);
								//console.log(d3.select(d));
                                if (d3.select(d).data()[0].name == document.getElementById("searchid").value ||
                                    d3.select(d).data()[0].description == document.getElementById("searchid").value) {
                                        d3.select(d)
                                            .style("opacity", 1);
                                } 
                                else {
                                    d3.select(d).style("opacity", 0.3);
                                }
                                //call format tooltip based on the selected node
                                
                            });
                            updatePanel( searchNode[document.getElementById("searchid").value] );
                            // extend focus to xAxis text
                            svg.selectAll("text")[0].forEach(function (d) {
					           //d3.select(d).style("fill",d.fill);
					           //d3.select(d).style('opacity', 1);
                                if (d3.select(d).data()[0].name == document.getElementById("searchid").value ||
                                    d3.select(d).data()[0].description == document.getElementById("searchid").value) {
                                        d3.select(d).style("opacity", 1)
                                            .style("fill", "steelblue");
                                } else {
                                    if (d3.select(d).data()[0].name){
                                        d3.select(d).style("opacity", 0.3);
                                    }
                                }
                                
                                
                            });
                            updatePanel( searchNode[document.getElementById("searchid").value] );
							this.value = "";
                        }
                    });
                    
                    reDrawState = true;
                });
            
        }
        init();
    }
    //if data is already loaded
    else {
        d3.select("#title-container").remove();
        $('body').scrollTo(0);
        partition.nodes(node);
		x.domain([0, node.value]).nice();
		down(node, 0);
        var keyCodes = {'enter' : 13};
        d3.select("input#searchid.typeahead.tt-input").on('keydown', function(){
            if (d3.event.keyCode === keyCodes.enter){
                down(searchNode[document.getElementById("searchid").value].parent, 0);
                svg.selectAll("rect")[0].forEach(function (d) {
					           //d3.select(d).style("fill",d.fill);
					           //d3.select(d).style('opacity', 1);
                    if (d3.select(d).data()[0].name == document.getElementById("searchid").value ||
                            d3.select(d).data()[0].description == document.getElementById("searchid").value) {
                                d3.select(d)
                                    .style("opacity", 1);
                        } 
                        else {
                            d3.select(d).style("opacity", 0.3);
                        }
                    });
                    updatePanel( searchNode[document.getElementById("searchid").value] );        
                    svg.selectAll("text")[0].forEach(function (d) {
					           //d3.select(d).style("fill",d.fill);
					           //d3.select(d).style('opacity', 1);
                        if (d3.select(d).data()[0].name == document.getElementById("searchid").value ||
                            d3.select(d).data()[0].description == document.getElementById("searchid").value) {
                                d3.select(d).style("opacity", 1);
                        } else {
                            if (d3.select(d).data()[0].name){
                                d3.select(d).style("opacity", 0.3);
                            }
                        }
                    });
                    updatePanel( searchNode[document.getElementById("searchid").value] );
					this.value = "";
                }
			
        });
    }
}


function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var g = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.name + d.depth; });

      // Add breadcrumb and label for entering nodes.
      var entering = g.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return "#01579b"; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .text(function(d) { return d.name; });
      
      entering.style("cursor", "pointer")
            .on("click", function(d){down(d.parent,0);});
      // Set position for entering and updating nodes.
      g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Remove exiting nodes.
      g.exit().remove();


      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
          .style("visibility", "");
    }
    function down(d, i) {
 
        if (!d.children || this.__transition__) return;
        var end = duration + d.children.length * delay;
        var exit = svg.selectAll(".enter")
            .attr("class", "exit");

        exit.selectAll("rect").filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);
        
        var enter = bar(d)
            .attr("transform", stack(i))
            .style("opacity", 1);

        enter.select("text").style("fill-opacity", 1e-6);
        enter.select("#blue").style("fill", color0(true));
        enter.select("#orange").style("fill", color1(true));
        enter.select("#red").style("fill", color2(true));
        enter.select("#green").style("fill", color3(true));
        
        x.domain([0, d3.max(d.children, function(d) { return d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2] + d[statCategories.Age3]; })]).nice();
        
        svg.selectAll(".x.axis").transition()
            .duration(duration)
            .call(xAxis);

        var enterTransition = enter.transition()
            .duration(duration)
            .delay(function(d, i) { return i * delay; })
            .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

            enterTransition.selectAll("text")
                .style("fill-opacity", 1);
            
            enterTransition.select("#blue")
                .style("fill", function(d) { return color0(!!d.children); });
            enterTransition.select("#orange")
                .style("fill", function(d) { return color1(!!d.children); });
            enterTransition.select("#red")
                .style("fill", function(d) { return color2(!!d.children); });
            enterTransition.select("#green")
                .style("fill", function(d) { return color3(!!d.children); });

        var exitTransition = exit.transition()
            .duration(duration)
            .style("opacity", 1e-6)
            .remove();

        exitTransition.selectAll("#blue")
            .attr("width", function(d) { return x(d[statCategories.Age0]); });
        exitTransition.selectAll("#orange")
            .attr("x", function(d) { return x(d[statCategories.Age0]); })
            .attr("width", function(d) { return x(d[statCategories.Age1]); });
        exitTransition.selectAll("#red")
            .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1]); })
            .attr("width", function(d) { return x(d[statCategories.Age2]); });
        exitTransition.selectAll("#green")
            .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2]); })
            .attr("width", function(d) { return x(d[statCategories.Age3]); });

        svg.select(".background")
            .datum(d)
            .transition()
            .duration(end);

        d.index = i;
        path = getAncestors(d);
        updateBreadcrumbs(path, "");
    }
function up(d) {
        if (!d.parent || this.__transition__) return;
        var end = 0;
        
        var exit = svg.selectAll(".enter")
            .attr("class", "exit");

        var enter = bar(d.parent)
            .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; })
            .style("opacity", 1e-6);
        
        enter.select("#blue")
            .style("fill", function(d) { return color0(!!d.children); })
            .filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);
        enter.select("#orange")
            .style("fill", function(d) { return color1(!!d.children); })
            .filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);
        enter.select("#red")
            .style("fill", function(d) { return color2(!!d.children); })
            .filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);
        enter.select("#green")
            .style("fill", function(d) { return color3(!!d.children); })
            .filter(function(p) { return p === d; })
            .style("fill-opacity", 1e-6);

        x.domain([0, d3.max(d.parent.children, function(d) { 
            return d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2] + d[statCategories.Age3]; })]).nice();

        svg.selectAll(".x.axis").transition()
            .duration(duration)
            .call(xAxis);
        
        var enterTransition = enter.transition()
            .duration(end)
            .style("opacity", 1);
        
            enterTransition.select("#blue")
                .attr("width", function(d) { return x(d[statCategories.Age0]); })
                .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });
            enterTransition.select("#orange")
                .attr("x", function(d) { return x(d[statCategories.Age0]); })
                .attr("width", function(d) { return x(d[statCategories.Age1]); })
                .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });
            enterTransition.select("#red")
                .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1]); })
                .attr("width", function(d) { return x(d[statCategories.Age2]); })
                .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });
            enterTransition.select("#green")
                .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2]); })
                .attr("width", function(d) { return x(d[statCategories.Age3]); })
                .each("end", function(p) { if (p === d) d3.select(this).style("fill-opacity", null); });

        var exitTransition = exit.selectAll("g").transition()
            .duration(duration)
            .delay(function(d, i) { return i * delay; })
            .attr("transform", stack(d.index));

        exitTransition.select("text")
            .style("fill-opacity", 1e-6);
        
        exitTransition.select("#blue")
            .attr("width", function(d) { return x(d[statCategories.Age0]); })
            .style("fill", color0(true));
        exitTransition.select("#orange")
            .attr("x", function(d) { return x(d[statCategories.Age0]); })
            .attr("width", function(d) { return x(d[statCategories.Age1]); })
            .style("fill", color1(true));
        exitTransition.select("#red")
            .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1]); })
            .attr("width", function(d) { return x(d[statCategories.Age2]); })
            .style("fill", color2(true));
        exitTransition.select("#green")
            .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2]); })
            .attr("width", function(d) { return x(d[statCategories.Age3]); })
            .style("fill", color3(true));

        exit.transition()
            .duration(end)
            .remove();

        svg.select(".background")
            .datum(d.parent)
            .transition()
            .duration(end);
        
        path = getAncestors(d.parent);
        updateBreadcrumbs(path, "");
    }
    
function bar(d) {
        x.domain([0, d3.max(d.children, function(d) { 
            return d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2] + d[statCategories.Age3];
                                                    })]).nice();
        
      var bar = svg.insert("g", ".y.axis")
          .attr("class", "enter")
          .attr("transform", "translate(0,5)")
        .selectAll("g")
          .data(d.children)
        .enter().append("g")
          .style("cursor", function(d) { return !d.children ? null : "pointer"; })
          .on("click", touchUI);
    
    if (!touch){
        bar.on("mouseover", mouseOverArc)
          .on("mouseout", mouseOutArc);
    }
 

      bar.append("text")
          .attr("x", -6)
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .style("font-weight","bold")
          .text(function(d) { return d.name; });

      bar.append("rect")
            .attr("id", "blue")
            .attr("x", 0)
          .attr("width", function(d) { return x(d[statCategories.Age0]); })
          .attr("height", barHeight)
            .style("fill", "blue");
			
        
        bar.append("rect")
            .attr("id", "orange")
            .attr("x", function(d) { return x(d[statCategories.Age0]); })
            .attr("width", function(d) { return x(d[statCategories.Age1]); })
            .attr("height", barHeight)
            .style("fill", "orange");

        
       bar.append("rect")
            .attr("id", "red")
            .attr("x", function(d) { return x(d[statCategories.Age1] + d[statCategories.Age0]); })
            .attr("width", function(d) { return x(d[statCategories.Age2]); })
            .attr("height", barHeight)
            .style("fill", "red");

    
        bar.append("rect")
            .attr("id", "green")
            .attr("x", function(d) { return x(d[statCategories.Age0] + d[statCategories.Age1] + d[statCategories.Age2]); })
            .attr("width", function(d) { return x(d[statCategories.Age3]); })
            .attr("height", barHeight)
            .style("fill", "green");

    
     if (!touch){
        bar.select("#blue")
          .on('mouseover', tipAge0.show)
          .on('mouseout', tipAge0.hide);
        bar.select("#orange")
            .on('mouseover', tipAge1.show)
            .on('mouseout', tipAge1.hide);
         bar.select("#red")
            .on('mouseover', tipAge2.show)
            .on('mouseout', tipAge2.hide);
         bar.select("#green")
            .on('mouseover', tipAge3.show)
      		.on('mouseout', tipAge3.hide);
      }
    
      return bar;
    }

function stack(i) {
      var x0 = 0;
      return function(d) {
        var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
        x0 += x(d.value);
        return tx;
      };
    }


$(document).ready(function(){
        renderSVG(reDrawState);
        $('[data-toggle="tooltip"]').tooltip();
});
//enable SVG resizing
var resizeTimeout;
var cachedWidth = $(window).width();
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout( function() {
        var newWidth = $(window).width();
        if(newWidth !== cachedWidth)
            renderSVG(reDrawState);
            cachedWidth = newWidth;
    }, 500);
});

