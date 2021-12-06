//Define a variable for the degree symbol and the cubic symbol used in the chart labels.
var degrees = '\xB0'
var cubic = '\xB3'
var euro = '€'


/* Cost-Tab */
/* Function to create the Cost graphics. */
 function cstSelect(evt, btnName) {
	/* set the class for the current active button to active therefor making it dark (pressed) */
	evt.currentTarget.className += " active";
	/* Get current time of the day */ 
	var time = new Date().getHours() + ":" + new Date().getMinutes();
	/* Get day in the current month */ 
	var Day = new Date().getDate();
	/* Determine the number of days in the year until today */ 
    var curDayNr = dayNr(new Date());
    /* Determine the number of days in this year */
    var NrOfDaysInYear = dayNr(new Date(new Date().getFullYear(), 11, 31));
	/* Get the date of today */
	var today = pastDate(0);
	/* get date yesterday */
	var yesterday = pastDate(-1);
	/* get date last week */
	var lastWeek = pastDate(-7);
	/* get date last month */ 
	var lastMonth = pastDate(-30);
	/* get date last year */
	//var lastYear = new Date().getFullYear()-1 + "-" + (new Date().getMonth()+1) + "-1"
	var lastYear = pastDate(-335);
	var gasTarif = document.getElementById("Setting_24").value;
	var gasDeliveryCost = document.getElementById("Setting_25").value;
  	var elecTarif = document.getElementById("Setting_20").value;
	var elecDeliveryCost = document.getElementById("Setting_23").value;
  	var elecFacilityCost = document.getElementById("Setting_26").value
  	var taxDeductPerDay = document.getElementById("Setting_27").value;
    var tarifType = document.querySelector('input[name="TarifType"]:checked').id; 
	//tarifType 2 = Double
    //tarifType 3 = Single

  switch (btnName) {
    case "Gas": /* Gas is only logged every whole hour. No need to obtain 
                all in between values. Therefor GROUP BY HOUR(datetime) */             
    	var d_Query = "d_Query=SELECT datetime, myUsage FROM " + btnName + " WHERE \
            datetime >= now() - INTERVAL 1 DAY GROUP BY HOUR(datetime) ORDER BY datetime;";
        var w_Query = "w_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastWeek + "' AND '" + today + "' GROUP by \
              DAY(datetime) ORDER BY datetime;";      
  		var m_Query = "m_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastMonth + "' AND '" + today + "' GROUP \
              by DAY(datetime) ORDER BY datetime;"; 
  		var y_Query = "y_Query=SELECT datetime, SUM(myUsage) FROM " + btnName + " WHERE \
              DATE(datetime) BETWEEN '" + lastYear + "' AND '" + today + "' GROUP \
              by MONTH(datetime) ORDER BY datetime;";
		break;
  	case "Electricity":
  		if (tarifType == "3") {
  			var d_Query = "d_Query=SELECT datetime, myUsage, myDelivery FROM " + btnName + " WHERE \
            	datetime >= now() - INTERVAL 1 DAY ORDER BY datetime;";
  			var w_Query = "w_Query=SELECT datetime, SUM(myUsage), SUM(MyDelivery) FROM " + btnName + " WHERE \
            	DATE(datetime) BETWEEN '" + lastWeek + "' AND '" + today + "' GROUP by \
              	DAY(datetime) ORDER BY datetime;";      
  			var m_Query = "m_Query=SELECT datetime, SUM(myUsage), SUM(myDelivery) FROM " + btnName + " WHERE \
            	DATE(datetime) BETWEEN '" + lastMonth + "' AND '" + today + "' GROUP \
              	by DAY(datetime) ORDER BY datetime;"; 
  			var y_Query = "y_Query=SELECT datetime, SUM(myUsage), SUM(myDelivery) FROM " + btnName + " WHERE \
              	DATE(datetime) BETWEEN '" + lastYear + "' AND '" + today + "' GROUP \
              	by MONTH(datetime) ORDER BY datetime;";
            }
        else {
        		alert("Double tarief nog niet mogelijk. Selecteer enkel tarief in instellingen");
        	}
  			break;
  	 }     
      if (btnName == "Gas") {
           var dayTitle = "Gas kosten afgelopen 24 uur";    
           var weekTitle = "Gas kosten afgelopen 7 dagen";
           var monthTitle = "Gas kosten afgelopen 30 dagen";
           var yearTitle = "Gas kosten afgelopen 12 maanden";
           var yearGasGraphColor = document.getElementById("Setting_9").value;
           var yearElecGraphColor = document.getElementById("Setting_7").value;
           var tooltipText = "Kosten %kt: €%vt";
           var graphType = "bar";   
           var graphColor = document.getElementById("Setting_9").value;
           var label =  { "text": "Kosten: in €" ,
            				"font-family":"Georgia", 
                           	"font-size":"12"
                         }
       } else {
           var dayTitle = "Elektriciteit kosten afgelopen 24 uur";       
           var weekTitle = "Elektriciteit kosten afgelopen 7 dagen";
           var monthTitle = "Elektriciteit kosten afgelopen 30 dagen";
           var yearTitle = "Elektriciteit kosten afgelopen 12 maanden";
           var yearGasGraphColor = document.getElementById("Setting_9").value;
           var yearElecGraphColor = document.getElementById("Setting_7").value;
           var tooltipText = "Kosten %kt: €%vt"; 
           var deliveryToolTip = "Teruggeleverd op %kt: %vt";
           var graphType = "bar";   
           var graphColor = document.getElementById("Setting_7").value;
           var delivGraphColor = document.getElementById("Setting_15").value;
           var label =  { "text": "Kosten in €",
            				"font-family":"Georgia", 
                           	"font-size":"12"
                         }
       }
//Last 30 days chart.
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
                    if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                    /* 	Calculate the costs for gas used
                    	Gas costs are determined by the formula:
                    	consumed gas in m3 * gasTarif + daily gasdeliveryCosts */
                    for (var i = 0; i < seriesValues.length; i++){
    					seriesValues[i] = seriesValues[i] * parseFloat(gasTarif) 
    						+ parseFloat(gasDeliveryCost);
    					//Limit the number of decimals to 2 for currency values
    					seriesValues[i] = parseFloat(seriesValues[i].toFixed(2));
					}
                    /* If the selection for temperature in gas use is selected than show the outside
                     temperature in the gas usage graph. */                     
                    zingchart.render({
                        id:"monthCostChart",
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
                                 "type" : graphType,
                                 "line-color": graphColor,
                                 "background-color": graphColor,
                                 "values": seriesValues 
                            }]
                        }
                      });
                     	} else {
                     	/* 	Calculate the costs for electricity used
                    		Electricity costs are determined by the formula:
                    		consumed electricity in KWh * elecTarif + daily elecdeliveryCosts */
                    	for (var i = 0; i < seriesValues.length; i++){
                    		seriesValues[i] = seriesValues[i] * parseFloat(elecTarif) 
                    			+ parseFloat(elecDeliveryCost) + parseFloat(elecFacilityCost) 
                    			- parseFloat(taxDeductPerDay);
    						//Limit the number of decimals to 2 for currency values
    						seriesValues[i] = parseFloat(seriesValues[i].toFixed(2));
						}
                      	zingchart.render({
                          id:"monthCostChart",
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
                                 "type" : graphType,
                                 "line-color": graphColor,
                                 "background-color": graphColor,
                                 "values": seriesValues 
                            }]
                        }
                      });
               		};
              }
		});
//Last 12 months chart
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
                    if (document.querySelector('input[name="temp"]:checked').id == "1" && btnName == "Gas")  {
                    /* Calculate the costs for gas used. 
                    For each month the cost is calculated by the formula:
                    (consumed gas in m3 * gasTarif) + (daily gasdeliveryCosts * number of days in the month)	
                    */
                    for (var i = 0; i < seriesValues.length; i++) {
                    	var daysInMonth = NrOfDaysInMonth(dateValues[i]);
    					seriesValues[i] = seriesValues[i] * parseFloat(gasTarif) 
    						+ parseFloat(gasDeliveryCost) * daysInMonth;
    					//Limit the number of decimals to 2.
    					seriesValues[i] = parseFloat(seriesValues[i].toFixed(2));
					  }                    
                      zingchart.render({
                        id:"yearCostChart",
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
                                    "items-overlap": false,
                                    "max-items":"12", //Show maximum 12 x-axis labels (months of the year)
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
                            }]
                        }
                      });
                     	} else {
                     	/* Calculate the costs for gas used. 
                    	For each month the cost is calculated by the formula:
                    	(consumed gas in m3 * gasTarif) + 
                    	(daily gasdeliveryCosts * number of days in the month) -
                    	(taxDeduct *  number of days in the month)	
                    	*/
                    	for (var i = 0; i < seriesValues.length; i++){
                    		var daysInMonth = NrOfDaysInMonth(dateValues[i]);
    						seriesValues[i] = seriesValues[i] * parseFloat(elecTarif) 
    							+ parseFloat(elecDeliveryCost) * daysInMonth 
    							+ parseFloat(elecFacilityCost) * daysInMonth
    							- parseFloat(taxDeductPerDay) * daysInMonth;
    						//Limit the number of decimals to 2.
    						seriesValues[i] = parseFloat(seriesValues[i].toFixed(2));
						 }
                      	zingchart.render({
                          id:"yearCostChart",
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
                                    "items-overlap": false,
                                    "max-items":"12", //Show maximum 12 x-axis labels (months of the year)
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
                            }]
                        }
                      });
               		};
              }
		});
		

// Total yearly chart 
      //Example dataStr: "myDate=2017-04-01"
      var contractStartDate = document.getElementById("Setting_16").value
      var dataStr = "myDate=" + contractStartDate //+ contractStartDate.split("-")[3] + "-" + contractStartDate.split("-")[1] + "-" + contractStartDate.split("-")[2];
	  $.ajax({
               type:'POST',
               url:'php/mySQL_getYearData.php', 
               data: dataStr, 
               dataType:'json',
               success:function(data){
                      //Get the data from the database and the configuration settings
                      var ElecValue = data.response1.map(Number);
                      var GasValue = data.response2.map(Number);
                      var elecEstimate = Number(document.getElementById("Setting_2").value);
                      var gasEstimate = Number(document.getElementById("Setting_3").value);
                      //Determine the cost until today for gas and electricity usage.
    				  GasValue[0] = GasValue[0] * parseFloat(gasTarif) 
    					+ parseFloat(gasDeliveryCost) * curDayNr;
    				  //Limit the number of decimals to 2 for currency values.
    				  GasValue[0] = parseFloat(GasValue[0].toFixed(2));
    				  ElecValue[0] = ElecValue[0] * parseFloat(elecTarif) 
    					+ parseFloat(elecDeliveryCost) * curDayNr 
    					+ parseFloat(elecFacilityCost) * curDayNr
    					- parseFloat(taxDeductPerDay) * curDayNr;
    				  //Limit the number of decimals to 2 for currency values.
    				  ElecValue[0] = parseFloat(ElecValue[0].toFixed(2));
    				  var myUsage = [GasValue[0], ElecValue[0]];  
    				  //Determine the estimated cost for the whole year.
                      gasEstimate = gasEstimate * parseFloat(gasTarif) 
    					+ parseFloat(gasDeliveryCost) * NrOfDaysInYear;
    				  //Limit the number of decimals to 2.
    				  gasEstimate = parseFloat(gasEstimate.toFixed(2));
    				  elecEstimate = elecEstimate * parseFloat(elecTarif) 
    					+ parseFloat(elecDeliveryCost) * NrOfDaysInYear 
    					+ parseFloat(elecFacilityCost) * NrOfDaysInYear
    					- parseFloat(taxDeductPerDay) * NrOfDaysInYear;
    				  //Limit the number of decimals to 2 for currency values.
    				  elecEstimate = parseFloat(elecEstimate.toFixed(2));
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
                        	id:"totalYearCostChart",
                        	width:"100%",
                        	height:400,
                        	data:{
                               "type": "bar",
                               "title": {
                                    "text":"Kosten Contractverbruik sinds: " + contractStartDate
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
                                     	"text": "Kosten verbruik tot nu: %vt"
                            		}
                                }, {
                                    "values": myEstimates, 
                                     "styles": ["gray", "gray"],
                                     "tooltip": {
                                     	"text": "Verwachte kosten: %vt"
                            		}
                                }]    
                            }
                         })   
                }
        });
}
