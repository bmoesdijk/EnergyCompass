//Define a variable for the degree symbol and the cubic symbol used in the chart labels.
var degrees = '\xB0'
var cubic = '\xB3'
var euro = '€'

 /* Based on the energy selection button execute the following */
function ovvSelect(evt, btnName) {
 /* set the class for the current active button to active therefor making it dark (pressed) */
 evt.currentTarget.className += " active";

 var date = new Date();
 var time = new Date().getHours() + ":" + new Date().getMinutes();
 var Day = new Date().getDate();
 var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
 var month = months[new Date().getMonth()]; //convert the month in 2 digit format from 01 to 12 i.s.o. 0 to 11
 var year = new Date().getFullYear();
  /*Determine number of days in the previous month*/
 var lastMonth = new Date(date.setMonth( date.getMonth()-1 ));
 lastMonth = months[lastMonth.getMonth()]; //convert the month in 2 digit format from 01 to 12 i.s.o. 0 to 11
 var lastMonthDays = new Date(year, lastMonth, 0).getDate(); //number of days in the previous month
 /* get date today */
 var today = pastDate(0);
 /* get date yesterday */
 var yesterday = pastDate(-1);
 /* get date last week */
 var lastWeek = pastDate(-7);
 /* get date last month from today */ 
 var lastMonthDate = pastDate(-(lastMonthDays-1));
 var endLastMonth = lastMonthDate.split('-')[0] + "-" +  lastMonthDate.split('-')[1] + "-" + lastMonthDays;
 /* get date last year */
 var lastYear = new Date().getFullYear()-1 + "-" + month + "-" + "01"
 /* Overview-Tab */
 /* Create all mySQL query strings to get the past date from the database */
 switch (btnName) {
    case "Gas": /* Gas is only logged every whole hour. No need to obtain 
                all in between values. Therefor GROUP BY HOUR(datetime) */             
    	/*var d_Query = "d_Query=SELECT datetime, myUsage FROM " + btnName + " WHERE \
            datetime >= now() - INTERVAL 1 DAY GROUP BY HOUR(datetime) ORDER BY datetime;";*/
        var d_Query = "d_Query=SELECT datetime, myUsage FROM " + btnName + " WHERE \
            datetime >= now() - INTERVAL 23 HOUR GROUP BY HOUR(datetime) ORDER BY datetime;";
        var w_Query = "w_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastWeek + "' AND '" + today + "' GROUP by \
              DAY(datetime) ORDER BY datetime;";      
  		var m_Query = "m_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastMonthDate + "' AND '" + today + "' GROUP \
              by DAY(datetime) ORDER BY datetime;"; 
  		var y_Query = "y_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastYear + "' AND '" + endLastMonth + "' GROUP \
              by MONTH(datetime) ORDER BY datetime;";
		break;
  	case "Electricity":
  		var d_Query = "d_Query=SELECT datetime, myUsage, myDelivery FROM " + btnName + " WHERE \
              datetime >= now() - INTERVAL 23 HOUR ORDER BY datetime;";
  		var w_Query = "w_Query=SELECT datetime, SUM(myUsage), SUM(MyDelivery) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastWeek + "' AND '" + today + "' GROUP by \
              DAY(datetime) ORDER BY datetime;";      
  		var m_Query = "m_Query=SELECT datetime, SUM(myUsage), SUM(myDelivery) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastMonthDate + "' AND '" + today + "' GROUP \
              by DAY(datetime) ORDER BY datetime;"; 
  		var y_Query = "y_Query=SELECT datetime, SUM(myUsage), SUM(myDelivery) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastYear + "' AND '" + endLastMonth + "' GROUP \
              by MONTH(datetime) ORDER BY datetime;";
  		break;
  	}    
      if (btnName == "Gas") {
           var dayTitle = "Gas verbruik afgelopen 24 uur";    
           var weekTitle = "Gas verbruik afgelopen 7 dagen";
           var monthTitle = "Gas verbruik afgelopen 30 dagen";
           var yearTitle = "Gas verbruik afgelopen 12 maanden";
           var yearGasGraphColor = document.getElementById("Setting_9").value;
           var yearElecGraphColor = document.getElementById("Setting_7").value;
		   var averageColor = document.getElementById("Setting_10").value;
		   var tempColor = document.getElementById("Setting_5").value;
           var tooltipText = "Verbruik: %vt m" + '\xB3' + " %kt";
           var averageTooltipText = "Gemiddeld verbruik: %vt m" + '\xB3' +" %kt";
           var graphType = document.getElementById("Setting_8").value;   
           var graphColor = document.getElementById("Setting_9").value;
           var label =  { "text": "Gas m" + '\xB3', //Write the m3 with 3 in superscript
            				"font-family":"Georgia", 
                           	"font-size":"12"
                         }
       } else {
           var dayTitle = "Elektriciteit verbruik afgelopen 24 uur";       
           var weekTitle = "Elektriciteit verbruik afgelopen 7 dagen";
           var monthTitle = "Elektriciteit verbruik afgelopen 30 dagen";
           var yearTitle = "Elektriciteit verbruik afgelopen 12 maanden";
           var yearGasGraphColor = document.getElementById("Setting_9").value;
           var yearElecGraphColor = document.getElementById("Setting_7").value;
           var averageColor = document.getElementById("Setting_10").value;
           var tempColor = document.getElementById("Setting_5").value;
           var tooltipText = "Verbruik: %vt KWh %kt"; 
           var deliveryToolTip = "Teruggeleverd %vt KWh %kt";
           var averageTooltipText = "Gemiddeld verbruik: %vt KWh %kt";
           /* We can obtain the Elec graph type from the Config-tab because we have 
           	  pre-loaded the config tab values in */
           var graphType = document.getElementById("Setting_6").value;   
           var graphColor = document.getElementById("Setting_7").value;
           var delivGraphColor = document.getElementById("Setting_15").value;
           var label =  { "text": "Energie KWh",
            				"font-family":"Georgia", 
                           	"font-size":"12"
                         }
       }
       
       
/* Select the right graph case depending on the energy source selection button and
	the configuration items on what should be displayed in the charts. */
if (btnName == "Gas" && document.querySelector('input[name="temp"]:checked').id == "1" ) {
	viewCase = "01";
} else if (btnName == "Gas" && document.querySelector('input[name="temp"]:checked').id == "0") {
	viewCase = "02";
} else if (btnName == "Electricity" && document.getElementById("Setting_15").value == "DoNotShow" ) {
	viewCase = "03";
} else if (btnName == "Electricity" && document.getElementById("Setting_15").value != "DoNotShow" ) {
	viewCase = "04";
} 

/* Create the weekly and monthly charts for the selected energy (Gas vs. Electricity) */
//Last 7 days data
        $.ajax({
               type:'POST',
               url:'php/mySQL_ChartData.php', 
               data: w_Query, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var seriesValues = data.response2.split(",").map(Number).slice(1,-1);
                    var averageValues = data.response3.split(",").map(Number).slice(1,-1);
                    var wdateValues = data.response4.split(",").map(Number).slice(1,-1);
                    var tempValues = data.response5.split(",").map(Number).slice(1,-1);
                    var seriesDelivery = data.response6.split(",").map(Number).slice(1,-1);
                    //Select the viewcase based on the earlier param selection. See above.
                    switch (viewCase) {
                    	case "01":
                    		//if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                      		/* If the selection for temperature in gas use is selected than show the outside
                     			temperature in the gas usage graph. */ 
                      		zingchart.render({
                        		id:"weekChart",
                        		width:"100%",
                        		height:400,
                        		data:{
                            		"type": "mixed",
                            		"title": {
                                    		"text": weekTitle
                             		},
                            		"scale-x":{
                                    		"values": dateValues,
                                    		"transform":{
                                           		"type":"date","all":"%D %d-%M"
                                    		},
                                    		"items-overlap": true,
                                    		"max-items":"8", //Show maximum 7 x-axis labels (days of the week)
                                    		"item":{
                                          		"visible":true
                                    		}
                          			},
                          			"scale-y": {
                          					"label": label
                            		},
                          			"scale-y-2": {
        									"format": "%v",
        									"label": {
            									"text": "Maximum buitentemperatuur"
                            					},    
        					  				"values": [-10,0,10,20,30,40]
        					  		},
    					  			"series": [{   
                                 			"type": graphType,
                                 			"line-color": graphColor,
                                 			"background-color": graphColor,
                                 			"scales":"scale-x,scale-y",
                                 			"values": seriesValues, 
                                 			"tooltip": {
                                     			"text": tooltipText
                            				} 
                        			}, {
                                 			"type": "line",
      						     			"values": averageValues,
      						     			"line-color": averageColor,
      						     			"tooltip": {
                                     			"text": averageTooltipText
                            				} 
    							 	}, {
      								/* create the outside temperature line in the graph */
                        			"type": "line", //Always show the average in line format
                        			"line-color":tempColor,
                        			"scales":"scale-x,scale-y-2",
                        			"values": tempValues,
                        			"tooltip": {
                                    	"text": "Maximum %v" + degrees + "C"
                                		}
                        			}]
                        		}	
                      		});
                      		break;
						case "04":
							//} else if (document.getElementById("Setting_15").value != "DoNotShow" ) {
                      		zingchart.render({
                        		id:"weekChart",
                        		width:"100%",
                        		height:400,
                        		data:{
                            		"type": "mixed",
                            		"title": {
                                		"text": weekTitle
                             		}, 
                            		"scale-x":{
                                		"values": dateValues,
                                		"transform":{
                                    		"type":"date","all":"%D %d-%M"
                            			},
                            		"items-overlap": true,
                            		"max-items":"8", //Show maximum 7 x-axis labels (days of the week)
                            		"item":{
                                		"visible":true
                                	}
                            		},
                            		"scale-y": {
                          				"label": label
                            		},
                            		"series":[{ 
                                		"type": graphType,
                                		"line-color": graphColor,
                                		"background-color": graphColor,
                                		"values": seriesValues,
                                		"tooltip": {
                                     		"text": tooltipText
                            			} 
                            		}, {
                                	"type": "line",
      						  		"values": seriesDelivery,
      						  		"line-color": delivGraphColor,
      						  		"tooltip": {
                                    	"text": deliveryToolTip
                            		}
                            		}, {    
                                	"type": "line", //Always show the average in line format
                                	"line-color": averageColor,
      						  		"values": averageValues,
      						  		"tooltip": {
                                     	"text": averageTooltipText
                            	 	}
      								}]
                        		}
                      		});
                      		break;
               	 		case "02":
               	 		    zingchart.render({
                        		id:"weekChart",
                        		width:"100%",
                        		height:400,
                        		data:{
                            		"type": "mixed",
                            		"title": {
                                		"text": weekTitle
                             		}, 
                            		"scale-x":{
                                		"values": dateValues,
                                		"transform":{
                                    		"type":"date","all":"%D %d-%M"
                            			},
                            		"items-overlap": true,
                            		"max-items":"8", //Show maximum 7 x-axis labels (days of the week)
                            		"item":{
                                		"visible":true
                                	}
                            		},
                            		"scale-y": {
                          				"label": label
                            		},
                            		"series":[{ 
                                		"type": graphType,
                                		"line-color": graphColor,
                                		"background-color": graphColor,
                                		"values": seriesValues,
                                		"tooltip": {
                                     		"text": tooltipText
                            			} 
                            		}, {    
                                	"type": "line", //Always show the average in line format
                                	"line-color": averageColor,
      						  		"values": averageValues,
      						  		"tooltip": {
                                    	"text": averageTooltipText
                            	 	}
      								}]
                        		}	
                      		});
                      		break;
               	 		case "03":
               				//} else {
                      		zingchart.render({
                        		id:"weekChart",
                        		width:"100%",
                        		height:400,
                        		data:{
                            		"type": "mixed",
                            		"title": {
                                		"text": weekTitle
                             		}, 
                            		"scale-x":{
                                		"values": dateValues,
                                		"transform":{
                                    		"type":"date","all":"%D %d-%M"
                            			},
                            		"items-overlap": true,
                            		"max-items":"8", //Show maximum 7 x-axis labels (days of the week)
                            		"item":{
                                		"visible":true
                                	}
                            		},
                            		"scale-y": {
                          				"label": label
                            		},
                            		"series":[{ 
                                		"type": graphType,
                                		"line-color": graphColor,
                                		"background-color": graphColor,
                                		"values": seriesValues,
                                		"tooltip": {
                                     		"text": tooltipText
                            			} 
                            		}, {    
                                	"type": "line", //Always show the average in line format
                                	"line-color": averageColor,
      						  		"values": averageValues,
      						  		"tooltip": {
                                    	"text": averageTooltipText
                            	 	}
      								}]
                        		}	
                      		});
                      		break;
               		};
              }
		});
/* Yearly chart */
      //Example dataStr: "myDate=2017-04-01"
      var contractStartDate = document.getElementById("Setting_16").value
      var dataStr = "myDate=" + contractStartDate //+ contractStartDate.split("-")[3] + "-" + contractStartDate.split("-")[1] + "-" + contractStartDate.split("-")[2];
	  $.ajax({
               type:'POST',
               url:'php/mySQL_getYearData.php', 
               data: dataStr, 
               dataType:'json',
               success:function(data){
                      var ElecValue = data.response1.map(Number);
                      var GasValue = data.response2.map(Number);
                      var myUsage = [GasValue[0], ElecValue[0]];
                      var elecEstimate = Number(document.getElementById("Setting_2").value);
                      var gasEstimate = Number(document.getElementById("Setting_3").value);
                      var myEstimates = [gasEstimate, elecEstimate];
                      /* create an auto-scale array for the year overview chart
                      	 based on the estimates from the configurations tab */
                      var autoScaleArray = [0];
                      if (elecEstimate > gasEstimate) {
                      		    if (elecEstimate > 1000) {
                      		    	/* Add a small amount to increase the scale beyond the actual value */
                      				var scaleValue = Math.round((elecEstimate+500)/1000)*1000;
                      				while (scaleValue>=1000) {
                      					autoScaleArray.push(scaleValue);
                      					autoScaleArray.sort();
                      					scaleValue = scaleValue-1000;
                      					}
                      			} else {
                      				var scaleValue = Math.round((elecEstimate+50)/100)*100;
                      				while (scaleValue>=100) {
                      					autoScaleArray.push(scaleValue);
                      					autoScaleArray.sort();
                      					scaleValue = scaleValue-100;
                      					}
                      			}
                      	} else {
                      			if (gasEstimate > 1000) {
                      				var scaleValue = Math.round((gasEstimate+500)/1000)*1000;
                      				while (scaleValue>=1000) {
                      					autoScaleArray.push(scaleValue);
                      					autoScaleArray.sort();
                      					scaleValue = scaleValue-1000;
                      					}
                      			} else {
                      				var scaleValue = Math.round((gasEstimate+50)/100)*100;
                      				while (scaleValue>=100) {
                      					autoScaleArray.push(scaleValue);
                      					autoScaleArray.sort();
                      					scaleValue = scaleValue-100;
                      					}
                      			}
                      	}                  			  
                      	zingchart.render({
                        	id:"Used-Chart",
                        	width:"100%",
                        	height:400,
                        	data:{
                               "type": "bar",
                               "title": {
                                    "text":"Contractverbruik " + contractStartDate
                                },
                               "scale-x": {
                                   "labels": ["Gas", "Elektriciteit"]
                                },
                                "scale-y": {
                                    "values": autoScaleArray 
                                },
                                "series": [{
                                    "values": myUsage,
                                    "styles": [yearGasGraphColor, yearElecGraphColor],
                                    "tooltip": {
                                     	"text": "Verbruik tot nu: %vt"
                            		}
                                }, {
                                    "values": myEstimates, 
                                    "styles": ["gray", "gray"],
                                    "tooltip": {
                                        "text": "Verwacht verbruik: %vt"
                            		}
                                }]    
                            }
                         })   
                }
        });
/* Last 24 hours data */
               $.ajax({
               type:'POST',
               url:'php/mySQL_ChartData.php', 
               data: d_Query, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var seriesValues = data.response2.split(",").map(Number).slice(1,-1);
                    var seriesDelivery = data.response6.split(",").map(Number).slice(1,-1);
                    var averageValues = data.response3.split(",").map(Number).slice(1,-1);
                    var wdateValues = data.response4.split(",").map(Number).slice(1,-1);
                    var tempValues = data.response5.split(",").map(Number).slice(1,-1);
               	 	//switch (viewCase) {
               	 	//case "01":
                    if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                     	/* If the selection for temperature in gas use is selected than show the outside
                     		temperature in the gas usage graph. */
                      	zingchart.render({
                        	id:"dayChart",
                        	width:"100%",
                        	height:400,
                        	data:{
                            	"type": "mixed",
                            	"title": {
                                    "text": dayTitle
                             	},
                            	"scale-x":{
                                    "values": dateValues,
                                    "step":"60minute",
                                    "transform":{
                                         "type":"date","all":"%H:%i"
                                         //"type":"date","all":"%d-%M %H:%i"
                                    },
                                    "items-overlap": true,
                                    "max-items":"24", //Show maximum 24 x-axis labels (days of the week
                                    "item":{
                                          "visible":true
                                    }
                          		},
                          		"scale-y": {
                          			"label": label
                            		},
                            	"scale-y-2": {
        							"label": {
            							"text": "Buitentemperatuur"
                            			}, 
                            			/* Scale values on the 2nd y-scale */   
        					  		"values": [-10,0,10,20,30,40]
        					  	},
    					  		"series": [{
                                 	"type": graphType, 
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
                                 	"scales":"scale-x,scale-y",
                                 	"values": seriesValues, 
                                 	"tooltip": {
                                     	"text": tooltipText
                            			}
                        		}, {
                        			/* create the outside temperature line in the graph */
                        			"tooltip": {
                                     	"text": "Temperatuur %vt" + degrees + "C"
                            		},
                        			"type": "line", //Always show the temperature in line format
                        			"line-color":tempColor,
                        			"scales":"scale-x,scale-y-2",
                        			"values": tempValues
                        		}]
                        	}
                      	});
                      //case "04":
                      } else if (document.getElementById("Setting_15").value != "DoNotShow"  && btnName == "Electricity" ) {
                      zingchart.render({
                        id:"dayChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                "text": dayTitle
                             	}, 
                            "scale-x":{
                                "values": dateValues,
                                //"step":"day",
                                "transform":{
                                    "type":"date","all":"%H:%i"
                            	},
                            "items-overlap": true,
                            "max-items":"25", //Show maximum 25 x-axis labels for each hour 1 x-as label + the last contact within the hour.
                            "item":{
                                "visible":true
                                }
                            },
                            "scale-y": {
                          			"label": label
                            },
                            "series":[{
    							"type": graphType, 
                                 "line-color": graphColor,
                                 "background-color": graphColor,
                                 "values": seriesValues, 
                                 "tooltip": {
                                     "text": tooltipText
                            	 	  }
                            	}, {
                                "type": "line",
      						  	"values": seriesDelivery,
      						  	"line-color": delivGraphColor,
      						  	"tooltip": {
                                     "text": "Teruggeleverd %vt kW %kt"
                            		}
      							}]
      					  }
                    	});
                       	//case "04":
                       	} else {
                      	zingchart.render({
                        	id:"dayChart",
                        	width:"100%",
                        	height:400,
                        	data:{
                            	"type": "mixed",
                            	"title": {
                                    "text": dayTitle
                             	},
                            	"scale-x":{
                                    "values": dateValues, 
                                    "step":"60minute",
                                    "transform":{
                                         "type":"date","all":"%H:%i"
                                    },
                                    "items-overlap": false, 
                                    "max-items":"25", //Show maximum 25 x-axis labels for each hour 1 x-as label + the last contact within the hour.
                                    "item":{
                                          "visible":true
                                    }
                          		},
                          		"scale-y": {
                          			"label": label
                            	},
    					  		"series":[{
                                 	"type": graphType, 
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
                                 	"values": seriesValues, 
                                 	"tooltip": {
                                     	"text": tooltipText
                            	 	  	}
                        		}]
                        	}
                      	});
                      }
              }
        });
        
//Last 30 days data.
        $.ajax({
               type:'POST',
               url:'php/mySQL_ChartData.php', 
               data: m_Query, 
               dataType:'json',
               success:function(data){
                    var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                    var seriesValues = data.response2.split(",").map(Number).slice(1,-1); 
                    var seriesDelivery = data.response6.split(",").map(Number).slice(1,-1);                    
                	var averageValues = data.response3.split(",").map(Number).slice(1,-1); 
                	var wdateValues = data.response4.split(",").map(Number).slice(1,-1);
                    var tempValues = data.response5.split(",").map(Number).slice(1,-1);
                    if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                      /* If the selection for temperature in gas use is selected than show the outside
                     	temperature in the gas usage graph. */                     
                      zingchart.render({
                        id:"monthChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                    "text": monthTitle
                             },  
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%d-%M"
                                    },
                                    "short": true,
                                    "items-overlap": false,
                                    "max-items":"31", //Show maximum 31 x-axis labels (days of the months)
                                    "item":{
                                          "visible":true
                                    }
                            },
                            "scale-y": {
                          			"label": label
                            },
                		    "scale-y-2": {
        							//"format": "%v",
        							"label": {
            							"text": "Maximum buitentemperatuur"
                            		},    
        					  		"values": [-10,0,10,20,30,40]
        					  	},
    					  	"series": [{
    					  			"tooltip": {
                                     	"text": tooltipText
                            		},
                                 	"type": graphType, //Depending on gas or elec. this will be a bar or line chart
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
                                 	"scales":"scale-x,scale-y",
                                 	"values": seriesValues  
                        			}, {
                        			 "tooltip": {
                                     	"text": averageTooltipText
                            		 },
                                	 "type": "line", //Always show the average in line format
                                	 "line-color": averageColor,
      						   		 "values": averageValues
      								},
                        			{
                        			/* create the outside temperature line in the graph */
                        			"tooltip": {
                                     	"text": "Max. dag temperatuur: %vt" + degrees + " C"
                            		},
                        			"type": "line", //Always show the temperature in line format
                        			"line-color":tempColor,
                        			"scales":"scale-x,scale-y-2",
                        			"values": tempValues
                        	}]
                        }
                      });
                      } else if (document.getElementById("Setting_15").value != "DoNotShow"  && btnName == "Electricity" ) {
                      zingchart.render({
                        id:"monthChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                "text": monthTitle
                             	}, 
                            "scale-x":{
                                "values": dateValues,
                                //"step":"day",
                                "transform":{
                                    "type":"date","all":"%D %d-%M"
                            	},
                            "items-overlap": true,
                            "max-items":"8", //Show maximum 7 x-axis labels (days of the week)
                            "item":{
                                "visible":true
                                }
                            },
                            "scale-y": {
                          		"label": label
                            },
                            "series":[{ 
                                "type": graphType,
                                "line-color": graphColor,
                                "background-color": graphColor,
                                "values": seriesValues,
                                "tooltip": {
                                     "text": tooltipText
                            		} 
                            }, {
                                "type": "line",
      						  	"values": seriesDelivery,
      						  	"line-color": delivGraphColor,
      						  	"tooltip": {
                                     "text": deliveryToolTip
                            		}
                            }, {    
                                "type": "line", //Always show the average in line format
                                "line-color": averageColor,
      						  	"values": averageValues,
      						  	"tooltip": {
                                     "text": averageTooltipText
                            	 	}
      						}]
      					  }
                    	});
                     	} else {
                      zingchart.render({
                        id:"monthChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                    "text": monthTitle
                             },
                            "scale-x":{
                                    "values": dateValues,
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%d-%M"
                                    },
                                    "items-overlap": false,
                                    "max-items":"31", //Show maximum 31 x-axis labels (days of the months)
                                    "item":{
                                          "visible":true
                                    }
                            },
                            "scale-y": {
                          			"label": label
                            },
                            "series":[{
                            	"tooltip": {
                                     "text": tooltipText
                            	 },
                                 "type" : graphType, //Depending on gas or elec. this will be a bar or line chart
                                 "line-color": graphColor,
                                 "background-color": graphColor,
                                 "values": seriesValues 
                            }, {
                            	 "tooltip": {
                                     "text": averageTooltipText
                            	 },
                                 "type": "line", //Always show the average in line format
                                 "line-color": averageColor,
      		 					 "values": averageValues
      						}]
                        }
                      });
               		};
              }
		});

//Get last 12 month data.
        $.ajax({
               type:'POST',
               url:'php/mySQL_ChartData.php', 
               data: y_Query, 
               dataType:'json',
               success:function(data){
                       var dateValues = data.response1.split(",").map(Number).slice(1,-1);
                       var seriesValues = data.response2.split(",").map(Number).slice(1,-1);
                       var seriesDelivery = data.response6.split(",").map(Number).slice(1,-1);                     
                       var averageValues = data.response3.split(",").map(Number).slice(1,-1);
                       var wdateValues = data.response4.split(",").map(Number).slice(1,-1);
                	   var tempValues = data.response5.split(",").map(Number).slice(1,-1);                                                                   
                    //Veranderen bij Gerko                                                                  
                    if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                      /* If the selection for temperature in gas use is selected than show the outside
                     	temperature in the gas usage graph. */                     
                      zingchart.render({
                        id:"yearChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                    "text": yearTitle
                             },  
                            "scale-x":{
                                    "values": dateValues, 
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%d-%M"
                                    },
                                    "short": true,
                                    "items-overlap": false,
                                    "max-items":"31", //Show maximum 31 x-axis labels (days of the months)
                                    "item":{
                                          "visible":true
                                    }
                            },
                            "scale-y": {
                          			"label": label
                            },
                		    "scale-y-2": {
        							//"format": "%v",
        							"label": {
            							"text": "Gemiddelde buitentemperatuur"
                            		},    
        					  		"values": [-10,0,10,20,30,40]
        					  	},
    					  	"series": [{
    					  			"tooltip": {
                                     	"text": tooltipText
                            		},
                                 	"type": graphType, //Depending on gas or elec. this will be a bar or line chart
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
                                 	"scales":"scale-x,scale-y",
                                 	"values": seriesValues  
                        			}, {
                        			 "tooltip": {
                                     	"text": averageTooltipText
                            		 },
                                	 "type": "line", //Always show the average in line format
                                	 "line-color": averageColor,
      						   		 "values": averageValues
      								},
                        			{
                        			/* create the outside temperature line in the graph */
                        			"tooltip": {
                                     	"text": "Gem. dag temperatuur: %vt" + degrees + " C"
                            		},
                        			"type": "line", //Always show the temperature in line format
                        			"line-color":tempColor,
                        			"scales":"scale-x,scale-y-2",
                        			"values": tempValues
                        	}]
                        }
                      });
                      } else if (document.getElementById("Setting_15").value != "DoNotShow" && btnName == "Electricity") {
                      zingchart.render({
                        id:"yearChart",
                        width:"100%",
                        height:400,
                        data:{
                            "type": "mixed",
                            "title": {
                                "text": yearTitle
                             	}, 
                            "scale-x":{
                                "values": dateValues,
                                //"step":"day",
                                "transform":{
                                    "type":"date","all":"%D %d-%M"
                            	},
                            "items-overlap": true,
                            "max-items":"31", //Show maximum 7 x-axis labels (days of the week)
                            "item":{
                                "visible":true
                                }
                            },
                            "scale-y": {
                          		"label": label
                            },
                            "series":[{ 
                                "type": graphType,
                                "line-color": graphColor,
                                "background-color": graphColor,
                                "values": seriesValues,
                                "tooltip": {
                                     "text": tooltipText
                            		} 
                            }, {
                                "type": "line",
      						  	"values": seriesDelivery,
      						  	"line-color": delivGraphColor,
      						  	"tooltip": {
                                     "text": deliveryToolTip
                            		}
                            }, {    
                                "type": "line", //Always show the average in line format
                                "line-color": averageColor,
      						  	"values": averageValues,
      						  	"tooltip": {
                                     "text": averageTooltipText
                            	 	}
      						}]
      					  }
                    	});
                      	} else {
                      	 zingchart.render({
                        	id:"yearChart",
                        	width:"100%",
                        	height:400,
                        	data:{
                            	"type": "mixed",
                            	"title": {
                                    "text": yearTitle
                             		},   
                            	"scale-x":{
                                    "values": dateValues,
                                    "step":"day",
                                    "transform":{
                                           "type":"date","all":"%M"
                                    	},
                                    "items-overlap": true,
                                    "max-items":"31", //Show maximum 12 x-axis labels (months)
                                    "item":{
                                          "visible":true
                                    	}
                          			},
                           		"scale-y": {
                          			"label": label
                          			},
                            	"series":[{
                                 	"type": "bar", //Always show the year graph in bar format
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
                                 	"values": seriesValues,
                                 	"tooltip": {
                                    	 "text": tooltipText
                            	 		}
                            		}, {
                                 	"type": "line", //Always show the average in line format
                                 	"line-color": averageColor,
      						   		"values": averageValues,
      						   		"tooltip": {
                                     	"text": averageTooltipText
                            	 		},
      							}]
                        	}
                      });
                    }
           }
    });
};
