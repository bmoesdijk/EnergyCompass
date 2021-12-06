//Define a variable for the degree symbol and the cubic symbol used in the chart labels.
var degrees = '\xB0'
var cubic = '\xB3'
var euro = '€'

/* Weather-Tab */
/* Based on the weather selection button execute the following */
function wtrSelect(evt, btnName) {
 /* set the class for the current active button to active therefor making it dark (pressed) */
 evt.currentTarget.className += " active";
 var time = new Date().getHours() + ":" + new Date().getMinutes();
 /* get date today */
 var today = pastDate(0);
 /* get date yesterday */
 var yesterday = pastDate(-1);
 /* get date last week */
 var lastWeek = pastDate(-7);
 /* get date last month */ 
 var lastMonth = pastDate(-30);
 /* get date last year */
 var lastYear = pastDate(-365);

 /* Fill the Weather tab */
 switch (btnName) {
	case "period":
		/* set the class for the current active button to active therefor making it dark (pressed) */
		evt.currentTarget.className += " active";
		/* Remove the weather station gauges and show the period charts */
		$('#weatherGauge1').hide();
		$('#weatherGauge2').hide();
		$('#weatherChart1').show();
		$('#weatherChart2').show();
		$('#weatherChart3').show();
		$('#weatherChart4').show();
 /* Retrieve the weather station name from the database and display this at the top of the page
   in the text box for the weatherStation in the weather tab */		
		var Query = "query= SELECT datetime, station FROM Weather ORDER BY datetime DESC limit 1;";
		 $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query, 
               dataType:'json',
               success:function(data){
               		var stationName = data.response2.split(",").slice(1,-1);
                	$("#weatherStation").text(stationName);     
				}
		})
		
		var Query1 = "query= SELECT datetime, temperature, airPressure FROM Weather WHERE \
			datetime >= now() - INTERVAL 23 HOUR GROUP BY HOUR(datetime) ORDER BY datetime;";
		var Query2 = "query=SELECT datetime, MAX(temperature), ROUND(AVG(airPressure),0) FROM Weather WHERE \
              DATE(datetime) BETWEEN '" + lastMonth + "' AND '" + today + "' GROUP \
              by DAY(datetime) ORDER BY datetime;"; 
		var Query3 = "query= SELECT datetime, SUM(precipitation), ROUND(AVG(humidity),0) FROM Weather WHERE \
			datetime >= now() - INTERVAL 23 HOUR GROUP BY HOUR(datetime) ORDER BY datetime;";
		var Query4 = "query=SELECT datetime, SUM(precipitation), ROUND(AVG(humidity),0) FROM Weather WHERE \
              DATE(datetime) BETWEEN '" + lastMonth + "' AND '" + today + "' GROUP \
              by DAY(datetime) ORDER BY datetime;";
		var Query6 = "query= SELECT datetime, windSpeed FROM Weather WHERE \
			datetime >= now() - INTERVAL 23 HOUR GROUP BY HOUR(datetime) ORDER BY datetime;";
/* Last 24 hours temperature & humidity chart */
        $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query1, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var tempValues = data.response2.split(",").map(Number).slice(1,-1);                     
                	var pressValues = data.response3.split(",").map(Number).slice(1,-1);             
                      zingchart.render({
                        id:"weatherChart1",
                        width:"98%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "legend":{
                            	"layout":"1x2",
                            	"border-width":0,
                            	"align": "left",
                            	"vertical-align":"bottom"
                            	},
                            "title": {
                                    "text": "Temperatuur & Luchtdruk afgelopen 24 uur"
                             }, 
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%H:%i"
                                    },
                                    "items-overlap": true,
                                    "max-items":"24", //Show maximum 24 x-axis labels (hours per day)
                                    "item":{
                                          "visible":true
                                    }
                          },
                          "scale-y": {
                          			"label": {
            							"text": "Temperatuur in " + degrees + "C"
                            		}
                            	},    
                		  "scale-y-2": {
        							"label": {
            							"text": "Luchtdruk in mbar"
                            		},    
        					  		"values": "960:1060:10",
        					  		"format": "%v"
        					  	},
    					  		"series": [{
    					  			"tooltip": {
                                     	"text": "Temperatuur: %vt" +  degrees + "C"
                            		},
                                 	"type": "line",
                                 	"line-color": "yellow",
                                 	"scales": "scale-x,scale-y",
                                 	"values": tempValues, 
                                 	"legend-text": "Temperatuur" 
      							},
                        		{
                        			/* create the air-pressure line in the graph */
                        			"tooltip": {
                                     	"text": "Luchtdruk: %vt mbar"
                            		},
                        			"type": "line",
                        			"line-color": "red",
                        			"scales": "scale-x,scale-y-2",
                        			"values": pressValues,
                        			"legend-text": "Luchtdruk"
                        		}]
                        }
                    });
                }
            });
/* last 24 hours Precipitation and humidity*/
          $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query3, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var precipValues = data.response2.split(",").map(Number).slice(1,-1);
                    var humidValues = data.response3.split(",").map(Number).slice(1,-1);                     
                	//$('#Series').html('<br>Series values: ' +precipValues);               
                      zingchart.render({
                        id:"weatherChart2",
                        width:"98%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "legend":{
                            	"layout":"1x2",
                            	"border-width":0,
                            	"align": "left",
                            	"vertical-align":"bottom"
                            	},
                            "title": {
                                    "text": "Neerslag en luchtvochtigheid afgelopen 24 uur"
                             }, 
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%H:%i"
                                    },
                                    "items-overlap": true,
                                    "max-items":"24", //Show maximum 24 x-axis labels (hours per day)
                                    "item":{
                                          "visible":true
                                    }
                          	},
                          	"scale-y": {
                          			"label": {
            							"text": "Neerslag in mm"
                            		}
                            	},
                            "scale-y-2": {
        							"label": {
            							"text": "Luchtvochtigheid in %"
                            		},    
        					  		"values": "0:100:20",
        					  		"format": "%v"
        					  	},
        					"series": [{
    					  			"tooltip": {
                                     	"text": "Neerslag: %vt mm"
                            		},
                                 	"type": "bar", 
                                 	"scales": "scale-x,scale-y",
                                 	"values": precipValues, 
                                 	"legend-text": "Neerslag" 
      							},
      							{
                        			/* create the humidity line in the graph */
                        			"tooltip": {
                                     	"text": "Luchtvochtigheid: %vt%"
                            		},
                        			"type": "line",
                        			"line-color": "orange",
                        			"scales": "scale-x,scale-y-2",
                        			"values": humidValues,
                        			"legend-text": "Luchtvochtigheid"
                        		}]    
                        }
                    });
                }
            });
/* Last 30 days temperature and humidity chart */
        $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query2, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var tempValues = data.response2.split(",").map(Number).slice(1,-1);                     
                	var pressValues = data.response3.split(",").map(Number).slice(1,-1);               
                      zingchart.render({
                        id:"weatherChart3",
                        width:"98%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "legend":{
                            	"layout":"1x2",
								"border-width":0,
                            	"align": "left",
                            	"vertical-align":"bottom"
                            	},
                            "title": {
                                    "text": "Temperatuur & Luchtdruk afgelopen 30 dagen"
                             }, 
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%d-%M"
                                    },
                                    "items-overlap": true,
                                    "max-items":"24", //Show maximum 24 x-axis labels (hours per day)
                                    "item":{
                                          "visible":true
                                    }
                          },
                          "scale-y": {
                          			"label": {
            							"text": "Temperatuur in " + degrees + "C"
                            		}
                            	},    
                		  "scale-y-2": {
        							"label": {
            							"text": "Luchtdruk in mbar"
                            		},    
        					  		"values": "960:1060:10",
        					  		"format": "%v"
        					  	},
    					  		"series": [{
    					  			"tooltip": {
                                     	"text": "Max. temperatuur: %vt" +  degrees + "C"
                            		},
                                 	"type": "line", 
                                 	"line-color": "yellow",
                                 	"scales": "scale-x,scale-y",
                                 	"values": tempValues,
                                 	"legend-text": "Temperatuur"  
      							},
                        		{
                        			/* create the air-pressure line in the graph */
                        			"tooltip": {
                                     	"text": "Gem. Luchtdruk: %vt mbar"
                            		},
                        			"type": "line",
                        			"line-color": "red",
                        			"scales": "scale-x,scale-y-2",
                        			"values": pressValues,
                        			"legend-text": "Luchtdruk"
                        		}]
                        }
                    });
                }
            });
/* last 30 days Precipitation & Humidity*/
          $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query4, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var precipValues = data.response2.split(",").map(Number).slice(1,-1);
                    var humidValues = data.response3.split(",").map(Number).slice(1,-1);                     
                	//$('#Series').html('<br>Series values: ' +precipValues);               
                      zingchart.render({
                        id:"weatherChart4",
                        width:"98%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "legend":{
                            	"layout":"1x2",
								"border-width":0,
                            	"align": "left",
                            	"vertical-align":"bottom"
                            	},
                            "title": {
                                    "text": "Neerslag en luchtvochtigheid afgelopen 30 dagen"
                             }, 
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%d-%M"
                                    },
                                    "items-overlap": false,
                                    "max-items":"30", //Show maximum 30 x-axis labels 
                                    "item":{
                                          "visible":true
                                    }
                          	},
                          	"scale-y": {
                          			"label": {
            							"text": "Neerslag in mm"
                            		}
                            	},    
                		  "scale-y-2": {
        							"label": {
            							"text": "Luchtvochtigheid in %"
                            		},    
        					  		"values": "0:100:20",
        					  		"format": "%v"
        					  	},
    					  		"series": [{
    					  			"tooltip": {
                                     	"text": "Totale neerslag %vt mm"
                            		},
                                 	"type": "bar", 
                                 	"scales": "scale-x,scale-y",
                                 	"values": precipValues,
                                 	"legend-text": "Neerslag"  
      							},
                        		{
                        			/* create the average humidity line in the graph */
                        			"tooltip": {
                                     	"text": "Gem. Luchtvochtigheid: %vt%"
                            		},
                        			"type": "line",
                        			"line-color": "orange",
                        			"scales": "scale-x,scale-y-2",
                        			"values": humidValues,
                        			"legend-text": "Luchtvochtigheid"
                        		}]
                        }
                    });
                }
            });
	break;
	case "station":
/* set the class for the current active button to active therefor making it dark (pressed) */
		evt.currentTarget.className += " active";
		
		/* remove the period charts and show the weather station Gauges */
		$('#weatherChart1').hide();
		$('#weatherChart2').hide();
		$('#weatherChart3').hide();
		$('#weatherChart4').hide();
		$('#weatherGauge1').show();
		$('#weatherGauge2').show();
		
/* Retrieve the weather station name from the database and display this at the top of the page
   in the text box for the weatherStation in the Weather tab*/
		var Query = "query= SELECT datetime, station FROM Weather ORDER BY datetime DESC limit 1;";
		 $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query, 
               dataType:'json',
               success:function(data){
               		var stationName = data.response2.split(",").slice(1,-1);
                	$("#weatherStation").text(stationName);     
				}
		})
		
/* SELECT * FROM (SELECT datetime, temperature, airPressure FROM Weather ORDER By datetime 
   DESC limit 1) x INNER JOIN (SELECT datetime, MAX(airPressure) FROM Weather 
   where DATE(datetime) LIKE '2017-06-05%') y; */
		var Query = "query=SELECT * FROM (SELECT datetime, temperature, airPressure FROM \
		Weather ORDER By datetime DESC limit 1) x INNER JOIN (SELECT datetime, \
		MAX(airPressure) FROM Weather where DATE(datetime) LIKE '" + yesterday + "%' ) y;" 
		var graphType="gauge";
	        $.ajax({
               type:'POST',
               url:'php/getWeatherInfo.php', 
               data: Query, 
               dataType:'json',
               success:function(data){
                    var tempValue = data.response2.split(",").map(Number).slice(1,-1); 
                    var pressureValue = data.response3.split(",").map(Number).slice(1,-1);
                    var yesterdayPressure = data.response4.split(",").map(Number).slice(1,-1);
                    //$('#Series').html('<br>Series values: '+ yesterdayPressure );                      
					zingchart.render({ 
								id : "weatherGauge1", 
								height: "450", 
								width: "100%",
								data: {
 									"type": "gauge", 
 									"theme": "light",
 									"background-color":"",//"white gray",
 									"scale-r":{
 	  									"values":"-20:40:5",
 	  									"line-color":"none",
 	  									"guide":{
 	    								"background-color":"", // Set the interior color of the gauge 
 	    								"alpha":1
 	  									},
 	  								"tick":{
 	    								"line-width":3,
 	    								"line-color":"black", //Set the gauge temperature indicators every 5 degrees
 	    								"size":14
 	  								},
 	  								"minor-ticks":4,
 	  								"minor-tick":{
 	    								"line-color":"black", //Set the gauge temperature indicators every 1 degree
 	    								"visible":true,
 	    								"size":7,
 	    								"placement":"inner"
 	 								},
 	  								"item":{
 	    								"color":"black", // Set the color and font of the labels
										"font-family":"Georgia", 
										"font-size":"18",
 	    								"placement":"inner",
 	    								"offset-r":-40 // Move the labels to the inside
 	  								},
 	  								"aperture":270, //set radiant over which the degrees get devided.
 	  								"center":{
 	 		   							"background-color":"",
 	    								"size":7
 	  								},
 	  								"background-color":"",
 	  								"ring":{
 	    								"type":"circle",
 	    								"size":45,
 	    								"borderWidth": 1,
 	   	 								"rules":[{
          									"rule":"%v<-5",
          									"background-color":"#148AA8",
          									},{
          									"rule":"%v<10 && %v>=-5",
          									"background-color":"#B6DCFE",
          									},{
          									"rule": "%v>=10 && %v<=20",
          									"background-color":"orange",
          									},{
          									"rule":"%v>20",
          									"background-color":"#F2001A",
          									}]
 	  									}
 									},
 									"labels":[{
 	    								"text":tempValue +  degrees + "C",
 	    								"color":"limeGreen",
 	    								"font-family":"Georgia", 
        								"font-size":"16",
 	    								"width":"6%",
 	    								"x":"47%",
 	    								"y":"76%"
 	 	 							},{
 	    								"text":"Thermometer",
 	   									"color":"black",
 	    								"font-family":"Georgia", 
        								"font-size":"18",
 	    								"width":"5%",
 	    								"x":"47%",
 	    								"y":"65%"
 	    							}],
									"series":[{
										"values" : tempValue,
										"background-color":"limeGreen",
										"shadow":true,
										"tooltip": {
                                     			"text": "Vandaag: %vt" + degrees + "C"
                            					},
										"animation":{
                    							"effect":"2",
        										"method":"3",
        										"sequence":"ANIMATION_NO_SEQUENCE",
        										"speed":"ANIMATION_SLOW"
                								},
										"size":210, // Set the length of the needle
										"csize":7, // Set the width of the needle
										 "alpha":1
									}]
								}
					});
					zingchart.render({ 
								id : "weatherGauge2", 
								height: "410", 
								width: "100%",
								data: {
 									"type": "gauge",
 									"theme": "light",
 									//Show a background image. but its not showing in the background
 									//The gauge indicator does not go over the image but behind. 
 									//"images":[{ 
        								//"src":"./images/Partly-Cloudy.png",
        								//"x":"32%",
        								//"y":"21%",
        								//"background-image":"/zingchart/images/Partly-Cloudy.png",
        								//"border-radius":"10px"
    									//}],
 									"background-color":"",//"white gray",
 									"scale-r":{
 	  									"values":"960:1060:5",
 	  									"line-color":"none",
 	  									"guide":{
 	    									"background-color":"", // Set the interior color of the gauge 
 	    									"alpha":0
 	  									},
 	  								"tick":{
 	    								"line-width":2,
 	    								"line-color":"black", //Set the gauge pressure indicators every 10 mbar
 	    								"size":18
 	  								},
 	  								"minor-ticks":4,
 	  								"minor-tick":{
 	    								"line-color":"black", //Set the gauge pressure indicators every 5 mbar
 	    								"visible":true,
 	    								"size":7,
 	    								"placement":"inner"
 	 								},
 	  								"minor-ticks":4,
 	  								"minor-tick":{
 	    								"line-color":"black", //Set the gauge pressure indicators every 1 mbar
 	    								"visible":true,
 	    								"size":5,
 	    								"placement":"inner"
 	 								},
 	  								"item":{
 	    								"color":"black", // Set the color and font of the labels
										"font-family":"Georgia", 
										"font-size":"14",
 	    								"placement":"inner",
 	    								"offset-r":-15 // Move the labels to the inside
 	  								},
 	  								"aperture":270, //set radiant over which the degrees get devided.
 	  								"center":{
 	  								    "borderColor":"#F87922",
 	 		   							"background-color":"#F87922",
 	    								"size":7
 	  								},
 	  								"background-color":"",
 	  								"ring":{
 	    								"type":"circle",
 	    								"size":13,
 	    								"borderWidth": 1,
 	   	 								"rules":[{
          									"rule":"%v>900",
          									"background-color":"white",
          									}]
 	  									}
 									},
 									"labels":[{
 	    								"text":"Vandaag: " + pressureValue + " mbar",
 	   									"color":"limeGreen",
 	    								"font-family":"Georgia", 
        								"font-size":"14",
 	    								"width":"5%",
 	    								"x":"47%",
 	    								"y":"76%"
 	    							}, {
 	    								"text":"Barometer",
 	   									"color":"black",
 	    								"font-family":"Georgia", 
        								"font-size":"18",
 	    								"width":"5%",
 	    								"x":"47%",
 	    								"y":"65%"
 	    							}, {
 	    								"text":"hPa/mBar",
 	   									"color":"black",
 	    								"font-family":"Georgia", 
        								"font-size":"14",
 	    								"width":"5%",
 	    								"x":"47%",
 	    								"y":"70%"
 	    							}, {
 	    								"text":"Gisteren: " + yesterdayPressure + " mbar",
 	   									"color":"orange",
 	    								"font-family":"Georgia", 
        								"font-size":"14",
 	    								"width":"5%",
 	    								"x":"47%",
 	    								"y":"80%" 
 	    							}],
 									"shapes":[{
 									    "type":"pie", // Add a ring to the outside
 									    "size":190,
 									    "x":"50%",
 									    "y":"54.0%",
 									    "background-color":"gray",
 									    "z-index":0,
 									    "slice":200
 									}],
									"series":[{
										"values":pressureValue, //Curent barometric value
										"background-color":"limeGreen",
										//"indicator": [R-Base, R-Tip, A-Base, A-Tip, Offset]
										"indicator":[1.5,1.5,0,0,0],
										"shadow":false,
										"animation":{
                    							"effect":"2",
        										"method":"3",
        										"sequence":"ANIMATION_NO_SEQUENCE",
        										"speed":"ANIMATION_SLOW"
                								},
                						"tooltip": {
                                     			"text": "Vandaag: %vt mbar"
                            					},
										"size":185, // Set the length of the needle
										//"csize":10, // Set the width of the needle
										// "alpha":3
										}, {
										"values":yesterdayPressure, //Yesterday's barometric value
										"background-color":"#F87922",
										//"indicator": [R-Base, R-Tip, A-Base, A-Tip, Offset]
										"indicator":[1.5,1.5,0,0,0],
										"shadow":false,
										"animation":{
                    							"effect":"2",
        										"method":"3",
        										"sequence":"ANIMATION_NO_SEQUENCE",
        										"speed":"ANIMATION_SLOW"
                								},
                						"tooltip": {
                                     			"text": "Gisteren: %vt mbar"
                            					},
										"size":150, // Set the length of the needle
									}]
								}
					});
				}
			  });
	break;
 	}
}
