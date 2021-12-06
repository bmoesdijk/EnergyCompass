//Define a variable for the degree symbol and the cubic symbol used in the chart labels.
var degrees = '\xB0'
var cubic = '\xB3'
var euro = '€'

/* History-Tab */
/* Based on the energy selection button on the history tab execute the following */
function hstSourceClick(evt, btnName) {
	evt.currentTarget.className += " active";
	var minDate = document.getElementById("Setting_14").value
	var minDateFields = minDate.split("-")
	var date = new Date();
	var today = date.getDate();
	var dtdate = $("#datepicker").datepicker( "getDate");
	if (dtdate == null) {
		$("#datepicker").datepicker({
        	minDate: new Date(minDateFields[2], minDateFields[1]-1, minDateFields[0]),
        	maxDate: "+0d",
        	changeYear: true,
        	yearRange: "2017:c",
			//When you click on the date in the calendar, the graphs will be created for
			//that date and energy source as per the btnName value
    		onSelect: function mySelection(dtdate) {
    			/* When a new date is selected on the calendar, set the new date to update
    			the graphs. */ 		 	
    			var dtdate = $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd" ).val();
    			var dspDate = $("#datepicker").datepicker("option", "dateFormat", "dd-M-yy").val()//, {
    			//Determine which selection button is the active button.
    			var btnName = (document.querySelector(".hstbtn.active").id).slice(3, 14);
    			//Go and create the history graphs for this date and source.
    			hstGraphs(evt, btnName,dtdate,dspDate);
    		}
    	}).datepicker("setDate", date); //Set the date to todays date
    }
    var dtdate = $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd" ).val();
    var dspDate = $("#datepicker").datepicker("option", "dateFormat", "dd-M-yy" ).val();
    hstGraphs(evt, btnName, dtdate, dspDate);
}

//Create the history graphs as per the selection data for date and energy source.
function hstGraphs(evt,btnName,dtdate,dspDate) {
    		var delivGraphColor = document.getElementById("Setting_15").value	
    		var dspYear = dspDate.split("-")[2];
    		var dspMonth = dspDate.split("-")[1] + " " + dspDate.split("-")[2];
	  		var dataStr = "myDate=" + dtdate + "&btnName=" + btnName;
	  		//Place the selected date behind the overview table titles
	  		$("#date1").text(dspDate);
	  		$("#date2").text(dspDate);
       		if (btnName == "Gas" ) {
       			//Show the right table columns and rows
       			document.getElementById("tbl1Rw0Cln3").style.display="none";
       			document.getElementById("tbl1Rw1Cln4").style.display="none";
       			document.getElementById("tbl1Rw1Cln5").style.display="none";
       			document.getElementById("tbl1Rw2Cln4").style.display="none";
       			document.getElementById("tbl1Rw2Cln5").style.display="none";
       			document.getElementById("tbl1Rw3Cln1").style.display="none";
       			document.getElementById("tbl1Rw3Cln2").style.display="none";
       			document.getElementById("tbl1Rw3Cln3").style.display="none";
       			document.getElementById("tbl1Rw3Cln4").style.display="none";
       			document.getElementById("tbl1Rw3Cln5").style.display="none";
       			document.getElementById("tbl2Rw0Cln3").style.display="none";
       			document.getElementById("tbl2Rw1Cln4").style.display="none";
       			document.getElementById("tbl2Rw1Cln5").style.display="none";
       			document.getElementById("tbl2Rw2Cln4").style.display="none";
       			document.getElementById("tbl2Rw2Cln5").style.display="none";
           		var tooltipText = "Gas: %vt (m3) " + dtdate + " %kt"; 
           		var tooltipTextDay = "Gas: %vt (m3) %kt"; 
           		var graphType = document.getElementById("Setting_8").value;
           		var graphColor = document.getElementById("Setting_9").value;
           		var tempColor = document.getElementById("Setting_5").value;
           		/* Due to the non-standard label settings in the Hst-Charts, we need to also 
           		define the label color otherwise it will be standard black which cannot be
           		seen when the dark theme is selected in the configuration tab */
           		if (zingchart.THEME == "dark") {
           			labelColor = "Gainsboro"
           		} else {
           			labelColor = "White";
           		};
           		var label1 =  [{"text": "Kubikmeter", //Define the X and y labels
                           			"font-family":"Georgia", 
                           			"font-size":"16",
                           			"font-color":labelColor, 
                           			"x": "0%", 
                           			"y": "5%"
                           			},
                          		{"text": dspDate,
                           			"font-family":"Georgia", 
                           			"font-size":"16",
                           			"font-color":labelColor, 
                            		"x": "48%", 
                            		"y": "90%"
                            		}];
                var label2 =  [{"text": "Kubikmeter", //Define the X and y labels
                           			"font-family":"Georgia", 
                           			"font-size":"16",
                           			"font-color":labelColor, 
                           			"x": "0%", 
                           			"y": "5%"},
                          		{"text": "Gas",
                           			"font-family":"Georgia", 
                           			"font-size":"16",
                           			"font-color":labelColor, 
                            		"x": "48%", 
                            		"y": "90%"
                            		}];
                var label3 = [{"text": "Gem. Temperatuur %vt" +  degrees + "C",
                           			"font-family":"Georgia", 
                           			"font-size":"16",
                           			"font-color":labelColor, 
                            		"x": "48%", 
                            		"y": "40%"
                            		}];
       		} else { //btnName = Electricity
       		if (zingchart.THEME == "dark") {
           			labelColor = "Gainsboro"
           		} else {
           			labelColor = "White";
           		};
       			if (delivGraphColor == "DoNotShow") { //Check if the delivery data must be shown
       				//Show the right table columns and rows
       				document.getElementById("tbl1Rw0Cln3").style.display="none";
       				document.getElementById("tbl1Rw1Cln4").style.display="none";
       				document.getElementById("tbl1Rw1Cln5").style.display="none";
       				document.getElementById("tbl1Rw2Cln4").style.display="none";
       				document.getElementById("tbl1Rw2Cln5").style.display="none";
       				document.getElementById("tbl1Rw3Cln1").style.display="";
       				document.getElementById("tbl1Rw3Cln2").style.display="";
       				document.getElementById("tbl1Rw3Cln3").style.display="";
       				document.getElementById("tbl1Rw3Cln4").style.display="none";
       				document.getElementById("tbl1Rw3Cln5").style.display="none";
       				document.getElementById("tbl2Rw0Cln3").style.display="none";
       				document.getElementById("tbl2Rw1Cln4").style.display="none";
       				document.getElementById("tbl2Rw1Cln5").style.display="none";
       				document.getElementById("tbl2Rw2Cln4").style.display="none";
       				document.getElementById("tbl2Rw2Cln5").style.display="none";
       			} else {
       				//Show the right table columns and rows
       				document.getElementById("tbl1Rw0Cln3").style.display="";
       				document.getElementById("tbl1Rw1Cln4").style.display="";
       				document.getElementById("tbl1Rw1Cln5").style.display="";
       				document.getElementById("tbl1Rw2Cln4").style.display="";
       				document.getElementById("tbl1Rw2Cln5").style.display="";
       				document.getElementById("tbl1Rw3Cln1").style.display="";
       				document.getElementById("tbl1Rw3Cln2").style.display="";
       				document.getElementById("tbl1Rw3Cln3").style.display="";
       				document.getElementById("tbl1Rw3Cln4").style.display="";
       				document.getElementById("tbl1Rw3Cln5").style.display="";
       				document.getElementById("tbl2Rw0Cln3").style.display="";
       				document.getElementById("tbl2Rw1Cln4").style.display="";
       				document.getElementById("tbl2Rw1Cln5").style.display="";
       				document.getElementById("tbl2Rw2Cln4").style.display="";
       				document.getElementById("tbl2Rw2Cln5").style.display="";
       			}
           		var tooltipText = "Elektriciteit: %vt (KWh) " + dtdate + " %kt";
           		var tooltipTextDay = "Elektriciteit: %vt (KWh) %kt"; 
           		var graphType = document.getElementById("Setting_6").value;
           		var graphColor = document.getElementById("Setting_7").value;
           		var label1 = [{"text": "KWh",  //Define the X and y labels
                           		"font-family":"Georgia", 
                           		"font-size":"16",
                           		"font-color":labelColor, 
                           		"x": "0%", 
                           		"y": "5%"
                           		},
                          	{"text": dspDate,
                           		"font-family":"Georgia", 
                           		"font-size":"16",
                           		"font-color":labelColor, 
                           		"x": "48%", 
                            	"y": "90%"
                          		}];
                var label2 = [{"text": "KWh",  //Define the X and y labels
                           		"font-family":"Georgia", 
                           		"font-size":"16", 
                           		"font-color":labelColor,
                           		"x": "0%", 
                           		"y": "5%"
                           		},
                          	 {"text": "Elektriciteit",
                           		"font-family":"Georgia", 
                           		"font-size":"16",
                           		"font-color":labelColor, 
                            	"x": "48%", 
                            	"y": "90%"
                            	}];
       		}
       		
       		/* Select the right graph case depending on the energy source selection button and
	        the configuration items on what should be displayed in the charts. */
            if (btnName == "Electricity" && document.getElementById("Setting_15").value != "DoNotShow" ) {
	            viewCase = "01";
            } else if (btnName == "Electricity" && document.getElementById("Setting_15").value == "DoNotShow" ) {
	            viewCase = "02";
            } else if (btnName == "Gas" && document.querySelector('input[name="temp"]:checked').id == "1" ) {
	            viewCase = "03";
            } else if (btnName == "Gas" && document.querySelector('input[name="temp"]:checked').id == "0") {
	            viewCase = "04";
            } 
       		//Get the data from the database
       		$.ajax({
               type:'POST',
               url:'php/mySQL_HistoryData.php', 
               data: dataStr, 
               dataType:'json',
               success:function(data){
    					/* Get the data values from the json response and convert them to 
    					   a numeric value for use in the Zingchart API */
                       	var timeValues = data.response1.split(",").map(Number).slice(1,-1);
                       	var usageValues = data.response2.split(",").map(Number).slice(1,-1); 
                       	var totalUsage =  data.response3;
                       	var peakUsage =   data.response4;
						var counter1 = data.response5.split(",").map(Number).slice(1,-1); 
                        var counter2 = data.response6.split(",").map(Number).slice(1,-1);
                        var deliveryValues = data.response7.split(",").map(Number).slice(1,-1); 
                       	var totalDelivery =  data.response8;
                       	var peakDelivery =   data.response9;
						var deliver1 = data.response10.split(",").map(Number).slice(1,-1); 
                        var deliver2 = data.response11.split(",").map(Number).slice(1,-1);
                        var yearUsage = data.response12.split(",").map(Number).slice(1,-1);  
                        var monthUsage = data.response13.split(",").map(Number).slice(1,-1);
                        var yearDelivery = data.response14.split(",").map(Number).slice(1,-1);  
                        var monthDelivery = data.response15.split(",").map(Number).slice(1,-1);
                        var avgTemperature = data.response16.split(",").map(Number).slice(1,-1);
                        var dateValues = data.response17.split(",").map(Number).slice(1,-1);
                        var lastMonthUsage = data.response18.split(",").map(Number).slice(1,-1);
                        var lastMonthDelivery = data.response19.split(",").map(Number).slice(1,-1);
                        var lastMonthMaxTemp = data.response20.split(",").map(Number).slice(1,-1);
                       //Full the data in the overview tables
                       $("#source").text(btnName);
                       if (btnName == "Gas" ) {
                       		//Meter values from begin and end of day
                       		$("#counter1").text("Gas");
                       		$("#counter1Begin").text(counter1[0] + "m" + '\xB3');
                       		$("#counter1End").text(counter1[1] + "m" + '\xB3');
                       		$("#counter2").text("");
                       		$("#counter2Begin").text("");
                       		$("#counter2End").text("");
                       		//Day consumption values
                       		$("#source").text("Gas");
                       		$("#totalUsage").text(totalUsage + "m" + '\xB3');
                       		$("#peakUsage").text(peakUsage + "m" + '\xB3');
                       } else {
                       		//Meter values from begin and end of day
                       		$("#counter1").text("ElektriciteitT1");
                       		$("#counter1Begin").text(counter1[0] + " KWh");
                       		$("#counter1End").text(counter1[1] + " KWh");
                       		$("#counter2").text("ElektriciteitT2");
                       		$("#counter2Begin").text(counter2[0] + " KWh");
                       		$("#counter2End").text(counter2[1] + " KWh");
                       		$("#deliver1").text("ElektriciteitT1");
                       		$("#deliver1Begin").text(deliver1[0] + " KWh");
                       		$("#deliver1End").text(deliver1[1] + " KWh");
                       		$("#deliver2").text("ElektriciteitT2");
                       		$("#deliver2Begin").text(deliver2[0] + " KWh");
                       		$("#deliver2End").text(deliver2[1] + " KWh");
                       		//Day consumption values
                       		$("#source").text("Elektriciteit");
                       		$("#totalUsage").text(totalUsage + " KWh");
                       		$("#peakUsage").text(peakUsage + " KWh");
                       		$("#totalDelivery").text(totalDelivery + " KWh");
                       		$("#peakDelivery").text(peakDelivery + " KWh");
                       	}                          
                       //Create the charts for option with delivery graphs 
                       switch (viewCase) {
                    	    case "01":
                            //if ( btnName == "Electricity" && delivGraphColor != "DoNotShow" ) {
                      		zingchart.render({
                        	id:"historyChart",
                        	width:"100%",
                        	height:400,
                        	  data:{
                            	"type": "mixed",
                            	"title": {
                                    		"text":"Specifiekverbruik " + dspDate,
                                    		"font-color": labelColor
                                },
                            	"scale-x":{
                                	"values": timeValues,
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
                          			"label": label2
                            	},
                            	"series":[{
                            		"type" : graphType, //Depending on gas or elec. this will be a bar or line chart
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
    								"values": usageValues, 
                                 	"tooltip": {
                                    	 "text": tooltipText
                            	 	  	}
                            		}, {
                                	"type": "line",
      						  		"values": deliveryValues,
      						  		"line-color": delivGraphColor,
      						  		"tooltip": {
                                    	 "text": "Teruggeleverd %vt kW %kt",
                                    	 "font-color":labelColor
                            			}
      								}]
      					  		  }
      					  		});	
                      		zingchart.render({
                        	id:"historyDayMonthChart",
                        	width:"100%",
                        	height:400,
                        	  data:{
                            	"type": "mixed",
                            	"title": {
                                    		"text":"Dagverbruik " + dspMonth,
                                    		"font-color":labelColor
                                },
                            	"scale-x":{
                                	"values": dateValues,
                                	"transform":{
                                    	"type":"date","all":"%d-%M"
                            		},
                            		"items-overlap": true,
                            		"max-items":"31", //Show maximum 31 x-axis labels for each hour 1 x-as label + the last contact within the hour.
                            		"item":{
                                		"visible":true
                                	}
                            	},
                            	"scale-y": {
                          			"label": dspMonth
                            	},
                            	"series":[{
                            		"type" : "bar", //Depending on gas or elec. this will be a bar or line chart
                                 	"line-color": graphColor,
                                 	"background-color": graphColor,
    								"values": lastMonthUsage, 
                                 	"tooltip": {
                                    	 "text": tooltipTextDay
                            	 	  	}
                            		}, {
                                	"type": "bar",
      						  		"values": lastMonthDelivery,
      						  		"line-color": delivGraphColor,
      						  		"tooltip": {
                                    	 "text": "Teruggeleverd %vt kW %kt",
                                    	 "font-color":labelColor
                            			}
      								}]
      					  		  }
      					  		});	
      					  		zingchart.render({
                        		id:"historyYearChart",
                        		width:"100%",
                        		height:400,
                        	  	data:{
                            		"type": "mixed",
                            		"title": {
                                    	"text":"Jaarverbruik " + dspYear,
                                    	"font-color":labelColor
                                	},
                            		"scale-x": {
                               			visible: false
                               		},
                            		"scale-y": {
                          				"label": label2
                            		},
                            		"series":[{
    									"type": "bar", 
                                 		"values": yearUsage, 
                                 		"tooltip": {
                                    		 "text": tooltipText
                            	 	  	}
                            			}, {
                                		"type": "bar",
      						  			"values": yearDelivery,
      						  			"line-color": delivGraphColor,
      						  			"tooltip": {
                                    	 	"text": "Teruggeleverd %vt kW %kt",
                                    	 	"font-color": labelColor
                            			}
      									}]
      					  		}
      					  		});
      					  		zingchart.render({
                        		id:"historyMonthChart",
                        		width:"100%",
                        		height:400,
                        	  	data:{
                            		"type": "mixed",
                            		"title": {
                                    	"text":"Maandverbruik " + dspMonth,
                                    	"font-color":labelColor
                                	},
                            		"scale-x": {
                               			visible: false
                               		},
                            		"scale-y": {
                          				"label": label2
                            		},
                            		"series":[{
    									"type": "bar", 
                                 		"values": monthUsage, 
                                 		"tooltip": {
                                    		 "text": tooltipText
                            	 	  	}
                            			}, {
                                		"type": "bar",
      						  			"values": monthDelivery,
      						  			"line-color": delivGraphColor,
      						  			"tooltip": {
                                    	 	"text": "Teruggeleverd %vt kW %kt",
                                    	 	"font-color":labelColor
                            			}
      									}]
      					  		}
      					  		});
                    	    break;
						case "03":
                    	    //} else { // Create the charts without option for delivery graphs
                    			//if ( btnName == "Gas" ) {  //Gas          
                      				zingchart.render({
                        			id:"historyChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                            			"title": {
                                    		"text":"Specifiekverbruik " + dspDate,
                                    		"font-color":labelColor
                                        },
                            			"type": graphType,
                            			"plot": {
                                     		"tooltip": {
                                          		"text": tooltipText
                                     			}
                            			},    
                            			"scale-x":{
                                    		"values": timeValues, 
                                    		"step":"5minute",
                                    		"transform":{
                                         		"type":"date","all":"%H:%i"
                                         		//"type":"date","all":"%d-%M %H:%i"
                                    		},
                                    		"items-overlap": true,
                                    		"max-items":"25", //Show maximum 30 x-axis labels (days of the week
                                    		"item":{
                                          		"visible":true
                                    		}
                          				},
                            			"series":[{
                                 			"values": usageValues, 
                                 			"line-color": graphColor,
                                 			"background-color" : graphColor
                            				}]
                        				}
                        			});
                        			zingchart.render({
                        			id:"historyDayMonthChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                        				"type": "mixed",//Show the average temperature in the Gas monthChart
                        					"labels": label2,
                            				"title": {
                                    			"text":"Dagverbruik " + dspMonth,
                                    			"font-color":labelColor
                                			},
                            				"scale-x": {
                               					"values": dateValues,
                                    		    "transform":{
                                           		     "type":"date","all":"%d-%M"
                               				     },
                               				     "items-overlap": false,
                                    		     "max-items":"31", //Show maximum 31 x-axis labels (days of the month)
                                    		     "item":{
                                          		      "visible":true
                                    		    }
                          			        },
                               				"scale-y": {
                          						"label": label2
                            				},
                		    			"scale-y-2": {
                		    			    //"format": "%v",
        									"label": {
            									"text": "Maximum buitentemperatuur"
                            				},    
        					  				"values": [-10,0,10,20,30,40]
        					  			},
                            			"series":[{
                            			    "tooltip": {
                                     	       "text": tooltipTextDay
                            		        },
    										"type": "bar", 
                                 			"values": lastMonthUsage, 
                                 			"line-color": graphColor,
                                 			"scales":"scale-x,scale-y",
                                 			"background-color": graphColor
                            			}, {
                        			    /* create the outside temperature line in the graph */
                        			    "tooltip": {
                                     	   "text": "Max. dag temperatuur: %vt" + degrees + " C"
                            		    },
                        			    "type": "line", //Always show the temperature in line format
                        			    "line-color":tempColor,
                        			    "scales":"scale-x,scale-y-2",
                        			    "values": lastMonthMaxTemp
                        	            }]
     								}
     								}); 
                        			zingchart.render({
                        			id:"historyYearChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                               			"type": "bar",
                               			"labels": label2,
                               			"title": {
                                    		"text":"Jaarverbruik " + dspYear,
                                    		"font-color":labelColor
                                		},
                               			"scale-x": {
                               				visible: false
                               			},
                                		"series": [{
                                    		"values": yearUsage,
                                			"line-color": graphColor,
                                			"background-color": graphColor
                                		}]    
                            		}
                        			});
                        			zingchart.render({
                        			id:"historyMonthChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                        				"type": "mixed",//Show the average temperature in the Gas monthChart
                        					"labels": label2,
                            				"title": {
                                    			"text":"Maandverbruik " + dspMonth,
                                    			"font-color":labelColor
                                			},
                            				"scale-x": {
                               					visible: false
                               				},
                               				"scale-y": {
                          						"label": label2
                            				},
                		    			"scale-y-2": {
        									"label": {
            									"text": "Gemiddelde buitentemperatuur"
                            				},    
        					  				"values": "-10:40:10"
        					  			},
                            			"series":[{
    										"type": "bar", 
                                 			"values": monthUsage, 
                                 			"line-color": graphColor,
                                 			"scales":"scale-x,scale-y",
                                 			"background-color": graphColor
                            			}, {
                                		"type": "vbullet",
      						  			"values": avgTemperature,
      						  			"line-color": tempColor,
      						  			"plot":{
 	  										"value-box":{
 	    										"text":"$%vK"
 	  										}
 										},
      						  			"scales":"scale-x,scale-y-2",
      						  			"tooltip": {
                                    	 	"text": "Gem. Temperatuur %vt" +  degrees + "C",
                                    	 	"font-color": "lightgray"
                            			}
      									}],
     								}
     								});
     								 break;
						case "04":
                    	    //} else { // Create the charts without option for delivery graphs
                    			//if ( btnName == "Gas" ) {  //Gas          
                      				zingchart.render({
                        			id:"historyChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                            			"title": {
                                    		"text":"Specifiekverbruik " + dspDate,
                                    		"font-color":labelColor
                                        },
                            			"type": graphType,
                            			"plot": {
                                     		"tooltip": {
                                          		"text": tooltipText
                                     			}
                            			},    
                            			"scale-x":{
                                    		"values": timeValues, 
                                    		"step":"5minute",
                                    		"transform":{
                                         		"type":"date","all":"%H:%i"
                                         		//"type":"date","all":"%d-%M %H:%i"
                                    		},
                                    		"items-overlap": true,
                                    		"max-items":"25", //Show maximum 30 x-axis labels (days of the week
                                    		"item":{
                                          		"visible":true
                                    		}
                          				},
                            			"series":[{
                                 			"values": usageValues, 
                                 			"line-color": graphColor,
                                 			"background-color" : graphColor
                            				}]
                        				}
                        			});
                        			zingchart.render({
                        			id:"historyDayMonthChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                            			"type": "bar",
                            			"title": {
                                    		"text":"Dagverbruik " + dspMonth,
                                    		"font-color":labelColor
                                		},
                            			"plot": {
                                     		"tooltip": {
                                          		"text": tooltipTextDay
                                     		}
                            			},    
                            		"scale-x":{
                                    	"values": dateValues, 
                                    	"step":"day",
                                    	"transform":{
                                         	"type":"date","all":"%d-%M"
                                         	//"type":"date","all":"%d-%M %H:%i"
                                    	},
                                    "items-overlap": true,
                                    "max-items":"31", //Show maximum 31 x-axis labels (days of the week
                                    "item":{
                                          "visible":true
                                    }
                          			},
                            		"series":[{
                                 		"values": lastMonthUsage, 
                                 		"line-color": graphColor,
                                 		"background-color" : graphColor
                            			}]
                        			}
                        			});
                        			zingchart.render({
                        			id:"historyYearChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                               			"type": "bar",
                               			"labels": label2,
                               			"title": {
                                    		"text":"Jaarverbruik " + dspYear,
                                    		"font-color":labelColor
                                		},
                               			"scale-x": {
                               				visible: false
                               			},
                                		"series": [{
                                    		"values": yearUsage,
                                			"line-color": graphColor,
                                			"background-color": graphColor
                                		}]    
                            		}
                        			});
                        			zingchart.render({
                        			id:"historyMonthChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                        				"type": "mixed",//Show the average temperature in the Gas monthChart
                        					"labels": label2,
                            				"title": {
                                    			"text":"Maandverbruik " + dspMonth,
                                    			"font-color":labelColor
                                			},
                            				"scale-x": {
                               					visible: false
                               				},
                               				"scale-y": {
                          						"label": label2
                            				},
                		    			"scale-y-2": {
        									"label": {
            									"text": "Gemiddelde buitentemperatuur"
                            				},    
        					  				"values": "-10:40:10"
        					  			},
                            			"series":[{
    										"type": "bar", 
                                 			"values": monthUsage, 
                                 			"line-color": graphColor,
                                 			"scales":"scale-x,scale-y",
                                 			"background-color": graphColor
                            			}, {
                                		"type": "vbullet",
      						  			"values": avgTemperature,
      						  			"line-color": tempColor,
      						  			"plot":{
 	  										"value-box":{
 	    										"text":"$%vK"
 	  										}
 										},
      						  			"scales":"scale-x,scale-y-2",
      						  			"tooltip": {
                                    	 	"text": "Gem. Temperatuur %vt" +  degrees + "C",
                                    	 	"font-color": "lightgray"
                            			}
      									}],
     								}
     								});
     								break;
						    case "02":
     							//} else { //Electricity without solar delivery
     								zingchart.render({
                        			id:"historyChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                            			"title": {
                                    		"text":"Specifiekverbruik " + dspDate,
                                    		"font-color":labelColor
                                        },
                            			"type": graphType,
                            			"plot": {
                                     		"tooltip": {
                                          		"text": tooltipText
                                     		}
                            			},    
                            		"scale-x":{
                                    	"values": timeValues, 
                                    	"step":"5minute",
                                    	"transform":{
                                         	"type":"date","all":"%H:%i"
                                         	//"type":"date","all":"%d-%M %H:%i"
                                    	},
                                    "items-overlap": true,
                                    "max-items":"25", //Show maximum 30 x-axis labels (days of the week
                                    "item":{
                                          "visible":true
                                    }
                          			},
                            		"series":[{
                                 		"values": usageValues, 
                                 		"line-color": graphColor,
                                 		"background-color" : graphColor
                            			}]
                        			}
                        			});
                        			zingchart.render({
                        			id:"historyDayMonthChart",
                        			width:"100%",
                        			height:400,
                        	  		data:{
                            			"type": "bar",
                            			"title": {
                                    		"text":"Dagverbruik " + dspMonth,
                                    		"font-color":labelColor
                                		},
                            			"plot": {
                                     		"tooltip": {
                                          		"text": tooltipTextDay
                                     		}
                            			},    
                            		"scale-x":{
                                    	"values": dateValues, 
                                    	"step":"day",
                                    	"transform":{
                                         	"type":"date","all":"%d-%M"
                                         	//"type":"date","all":"%d-%M %H:%i"
                                    	},
                                    "items-overlap": true,
                                    "max-items":"31", //Show maximum 31 x-axis labels (days of the week
                                    "item":{
                                          "visible":true
                                    }
                          			},
                            		"series":[{
                                 		"values": lastMonthUsage, 
                                 		"line-color": graphColor,
                                 		"background-color" : graphColor
                            			}]
                        			}
                        			});
                        			zingchart.render({
                        			id:"historyYearChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                               			"type": "bar",
                               			"labels": label2,
                               			"title": {
                                    		"text":"Jaarverbruik " + dspYear,
                                    		"font-color":labelColor
                                		},
                               			"scale-x": {
                               				visible: false
                               			},
                                		"series": [{
                                    		"values": yearUsage,
                                			"line-color": graphColor,
                                			"background-color": graphColor
                                		}]    
                            		}
                        			});
                        			zingchart.render({
                        			id:"historyMonthChart",
                        			width:"100%",
                        			height:400,
                        			data:{
                        				"type": "bar",
                        				"labels": label2,
                            			"title": {
                                    		"text":"Maandverbruik " + dspMonth,
                                    		"font-color":labelColor
                                		},
                            			"scale-x": {
                               				visible: false
                               			},
                               			"scale-y": {
                          					"label": label2
                            				},
                            			"series":[{
    										"type": "bar", 
                                 			"values": monthUsage, 
                                 			"line-color": graphColor,
                                 			"scales":"scale-x,scale-y",
                                 			"background-color": graphColor
                            			}],
     								}
                        			});
            				//}
            			}
            	}
         });
 }
 
 /* Get the number of days in a month as function from the epoch value */
function NrOfDaysInMonth(epoch) {
        var date = new Date(epoch);
        var month = date.getMonth();
        var year = date.getYear()
        daysInMonth = 32 - new Date(year, month, 32).getDate();
        return daysInMonth;
}

/* Function that returns the number of the day within the year. */
function dayNr(date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) 
    	- Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
