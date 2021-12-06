/* Huidige Last Tab */
/* Show current electrical current usage for load balancing when car charging takes to much power in addition to the regular usage */
zingchart.DEV.RESIZESPEED = 10;
zingchart.DEV.DEBOUNCESPEED = 10;
zingchart.DEV.GC = 0;

async function fetchDataAsync1(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if (xmlHttp.responseText.includes("plot0")) {
            callback(xmlHttp.responseText);
        } else {
            //callback("[{plot0:0,'scale-x':'00:00:00',}]");
            callback("[{plot0:0, plot1:0, plot2:0, 'scale-x':'00:00:00',}]");
        }
    }
    xmlHttp.open("GET", 'http://syno2.moesdijk.local:8080', true); // true for asynchronous 
    xmlHttp.send(null);
}

async function fetchDataAsync2(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if (xmlHttp.responseText.includes("plot1")) {
            callback(xmlHttp.responseText);
        } else {
            //callback("[{plot0:0,'scale-x':'00:00:00',}]");
            callback("[{plot0:0, plot1:0, plot2:0, 'scale-x':'00:00:00',}]");
        }
    }
    await new Promise(r => setTimeout(r, 200)); //Wait for 200ms
    xmlHttp.open("GET", 'http://syno2.moesdijk.local:8080', true); // true for asynchronous 
    xmlHttp.send(null);
}

async function fetchDataAsync3(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if (xmlHttp.responseText.includes("plot2")) {
            callback(xmlHttp.responseText);
        } else {
            //callback("[{plot0:0,'scale-x':'00:00:00',}]");
            callback("[{plot0:0,plot1:0, plot2:0, 'scale-x':'00:00:00',}]");
        }
    }
    await new Promise(r => setTimeout(r, 400)); //Wait for 400ms
    xmlHttp.open("GET", 'http://syno2.moesdijk.local:8080', true); // true for asynchronous 
    xmlHttp.send(null);
}

async function fetchDataAsync4(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        if (xmlHttp.responseText.includes("plot")) {
            callback(xmlHttp.responseText);
        } else {
            //callback("[{plot0:0,'scale-x':'00:00:00',}]");
            callback("[{plot0:0, plot1:0, plot2:0, 'scale-x':'00:00:00',}]");
        }
    }
    await new Promise(r => setTimeout(r, 600)); //Wait for 600ms
    xmlHttp.open("GET", 'http://syno2.moesdijk.local:8080', true); // true for asynchronous 
    xmlHttp.send(null);
}


/*Current Gauge Line 1*/
zingchart.render({ 
                        id : "currentGaugeL1", 
								height: "300", 
								width: "100%",
								data: {
 									"type": "gauge",
 									"theme": "light",
  									"background-color": "", //"white gray",
 									"scale-r":{
 	  									     "values":"0:32:1",
 	  									     "tick": {
  									              "alpha": 0
  									          },
 	  									     "item":{
 	  									         "color":"black", // Set the color and font of the labels
 	  									         "font-family":"Georgia", 
 	  									         "font-size":"14",
 	    								         "placement":"inner",
 	    								         "offset-r": -10, // Move the labels to the inside
 	    								         "offset-y":-17,
 	  								         },
 	  								         //"aperture":270, //set radiant over which the degrees get devided.
 	  								         "center":{
 	  								            "x":"50%",
 							                     "y":"43.0%",
 	  								             "borderColor": "#148AA8",
 	 		   							         "background-color": "black",
 	    								         "size":8
 	  								     },
 	  								     "background-color":"",
 	  								     "offset-y": -17,
 	  								      "ring":{
 	  								           "x":"50.2%",
 							                    "y":"43.0%",
 	    								       "type":"circle",
 	    								       "size":10,
 	    								       "borderWidth": 1,
 	    								       "backgroundColor" : "",
 	   	 								       "rules":[{
 	   	 								    "rule":"%v<0 && %v>30",
 	   	 								    "background-color:":"white"
 	   	 								    },{
          									"rule":"%v<18",
          									"background-color": "rgb(183,204,176)",
          									},{
          									"rule": "%v>=18 && %v<=24",
          									"background-color":"orange",
          									},{
          									"rule":"%v>24",
          									"background-color":"#F2001A",
 	   	 								       }]
 	  									 },  
 									},
                                    "labels" : [{
 									       "text":"Amperemeter",
                                            "color":"black",
                                            "font-family":"Georgia", 
                                            "font-size":"16",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"78%"
                                    },{
 									       "text":"Fase 1",
                                            "color":"#2196F3",
                                            "font-family":"Georgia", 
                                            "font-size":"14",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"85%"
                                    }],
  									"shapes":[{
  									    "type":"pie", // Create the indicator ring
 									    "alpha": 0.2,
 									    "size":145,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "grey",
 									    "z-index":4,
 									    "slice":10
 									}, {
 									    "type":"pie", // Add a ring to the outside
 									    "size":140,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "rgb(102,103,100)", //"#148AA8",
 									    "z-index":4,
 									    "slice":150
 									}],
								 "refresh": {
                                        "type": 'feed',
                                        "transport": 'js', //Set to 'http' for Direct and 'js' for function
                                        "url": 'fetchDataAsync2()', //Asynchronious HTTP request function
                                        "interval":10000,
                                    },
								"series": [{
								        //plot0
									    "values": [0.0],
										"background-color":"#148AA8",
										"shadow": false,
										"visible": true,
										"animation":{
                    							"effect":"2",
        										"method":"1",
        										"sequence":"4",
        										"speed":"ANIMATION_SLOW"
                								},
										"size":131, // Set the length of the needle
										"csize":8, // Set the width of the needle
									    "offset-y":-17,
									    "tooltip": {
                                     			"text": "%vt" + " A"
                            					}
									}, {
									    //plot1
									    "visible": false
									}, {
									    //plot2
									    "visible": false
									}]
							}
					});;


/*Current Gauge Line 2*/
					zingchart.render({ 
                        id : "currentGaugeL2", 
								height: "300", 
								width: "100%",
								data: {
 									"type": "gauge",
 									"theme": "light",
  									"background-color": "", //"white gray",
 									"scale-r":{
 	  									     "values":"0:32:1",
 	  									     "tick": {
  									              "alpha": 0
  									          },
 	  									     "item":{
 	  									         "color":"black", // Set the color and font of the labels
 	  									         "font-family":"Georgia", 
 	  									         "font-size":"14",
 	    								         "placement":"inner",
 	    								         "offset-r": -10, // Move the labels to the inside
 	    								         "offset-y":-17,
 	  								         },
 	  								         //"aperture":270, //set radiant over which the degrees get devided.
 	  								         "center":{
 	  								            "x":"50%",
 							                     "y":"43.0%",
 	  								             "borderColor": "#148AA8",
 	 		   							         "background-color": "black",
 	    								         "size":8
 	  								     },
 	  								     "background-color":"",
 	  								     "offset-y": -17,
 	  								      "ring":{
 	  								           "x":"50.2%",
 							                    "y":"43.0%",
 	    								       "type":"circle",
 	    								       "size":10,
 	    								       "borderWidth": 1,
 	    								       "backgroundColor" : "",
 	   	 								       "rules":[{
 	   	 								    "rule":"%v<0 && %v>30",
 	   	 								    "background-color:":"white"
 	   	 								    },{
          									"rule":"%v<18",
          									"background-color": "rgb(183,204,176)",
          									},{
          									"rule": "%v>=18 && %v<=24",
          									"background-color":"orange",
          									},{
          									"rule":"%v>24",
          									"background-color":"#F2001A",
 	   	 								       }]
 	  									 },  
 									},
 									 "labels" : [{
 									       "text":"Amperemeter",
                                            "color":"black",
                                            "font-family":"Georgia", 
                                            "font-size":"16",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"78%"
                                    },{
 									       "text":"Fase 2",
                                            "color":"red",
                                            "font-family":"Georgia", 
                                            "font-size":"14",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"85%"
                                    }],
  									"shapes":[{
  									    "type":"pie", // Create the indicator ring
 									    "alpha": 0.2,
 									    "size":145,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "grey",
 									    "z-index":4,
 									    "slice":10
 									}, {
 									    "type":"pie", // Add a ring to the outside
 									    "size":140,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "rgb(102,103,100)", //"#148AA8",
 									    "z-index":4,
 									    "slice":150
 									}],
								 "refresh": {
                                        "type": 'feed',
                                        "transport": 'js', //Set to 'http' for Direct and 'js' for function
                                        "url": 'fetchDataAsync3()', //Asynchronious HTTP request function
                                        "interval":10000,
                                    },
								"series": [{
								        //plot:0
										"visible": false,
									}, {
									    //plot1
									    "values": [0.0],
										"background-color":"#148AA8",
										"shadow": false,
										"visible": true,
										"animation":{
                    							"effect":"2",
        										"method":"1",
        										"sequence":"4",
        										"speed":"ANIMATION_SLOW"
                								},
										"size":131, // Set the length of the needle
										"csize":8, // Set the width of the needle
									    "offset-y":-17,
									    "tooltip": {
                                     			"text": "%vt" + " A"
                            					}
									}, {
									    //plot2
										"visible": false,
									}]
							}
					});

/*Current Gauge Line 3*/
zingchart.render({ 
                        id : "currentGaugeL3", 
								height: "300", 
								width: "100%",
								data: {
 									"type": "gauge",
 									"theme": "light",
  									"background-color": "", //"white gray",
 									"scale-r":{
 	  									     "values":"0:32:1",
 	  									     "tick": {
  									              "alpha": 0
  									          },
 	  									     "item":{
 	  									         "color":"black", // Set the color and font of the labels
 	  									         "font-family":"Georgia", 
 	  									         "font-size":"14",
 	    								         "placement":"inner",
 	    								         "offset-r": -10, // Move the labels to the inside
 	    								         "offset-y":-17,
 	  								         },
 	  								         "aperture":270, //set radiant over which the degrees get devided.
 	  								         "center":{
 	  								            "x":"50%",
 							                     "y":"43.0%",
 	  								             "borderColor": "#148AA8",
 	 		   							         "background-color": "black",
 	    								         "size":8
 	  								     },
 	  								     "background-color":"",
 	  								     "offset-y": -17,
 	  								      "ring":{
 	  								           "x":"50.2%",
 							                    "y":"43.0%",
 	    								       "type":"circle",
 	    								       "size":10,
 	    								       "borderWidth": 1,
 	    								       "backgroundColor" : "",
 	   	 								       "rules":[{
 	   	 								    "rule":"%v<0 && %v>30",
 	   	 								    "background-color:":"white"
 	   	 								    },{
          									"rule":"%v<18",
          									"background-color": "rgb(183,204,176)",
          									},{
          									"rule": "%v>=18 && %v<=24",
          									"background-color":"orange",
          									},{
          									"rule":"%v>24",
          									"background-color":"#F2001A",
 	   	 								       }]
 	  									 },  
 									},
 									 "labels" : [{
 									       "text":"Amperemeter",
                                            "color":"black",
                                            "font-family":"Georgia", 
                                            "font-size":"16",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"78%"
                                    },{
 									       "text":"Fase 3",
                                            "color":"green",
                                            "font-family":"Georgia", 
                                            "font-size":"14",
                                            "width":"5%",
                                            "x":"47%",
                                            "y":"85%"
                                    }],
  									"shapes":[{
  									    "type":"pie", // Create the indicator ring
 									    "alpha": 0.2,
 									    "size":145,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "grey",
 									    "z-index":4,
 									    "slice":10
 									}, {
 									    "type":"pie", // Add a ring to the outside
 									    "size":140,
 									    "x":"50%",
 									    "y":"50.0%",
 									    "background-color": "rgb(102,103,100)", //"#148AA8",
 									    "z-index":4,
 									    "slice":150
 									}],
								 "refresh": {
                                        "type": 'feed',
                                        "transport": 'js', //Set to 'http' for Direct and 'js' for function
                                        "url": 'fetchDataAsync4()', //Asynchronious HTTP request function
                                        "interval":10000,
                                    },
								"series": [{
									    //plot0
										"visible": false,
									}, {
									    //plot1
										"visible": false
									}, {
									    //plot2
									    "values": [0.0],
										"background-color":"#148AA8",
										"shadow": false,
										"visible": true,
										"animation":{
                    							"effect":"2",
        										"method":"1",
        										"sequence":"4",
        										"speed":"ANIMATION_SLOW"
                								},
										"size":131, // Set the length of the needle
										"csize":8, // Set the width of the needle
									    "offset-y":-17,
									    "tooltip": {
                                     			"text": "%vt" + " A"
                            					}
									}]
							}
					});
					
 //Chart
        // window.onload event for Javascript to run after HTML
        // because this Javascript is injected into the document head
zingchart.render({
                id: 'currentChart',
                height: "100%", 
				width: "100%",
                data: {
                        type: 'line',
                        globals: {
                            fontFamily: 'Roboto',
                        },
                        backgroundColor: '#fff',
                        title: {
                            text: 'Huidige Last',
                            color: 'black',
                            height: '30x',
                        },
                        plotarea: {
                            marginTop: '60px'
                        },
                        crosshairX: {
                            lineStyle: 'dashed',
                            lineColor: '#424242',
                            marker: {
                                visible: true,
                                size: 8
                            },
                            plotLabel: {
                                backgroundColor: '#fff',
                                borderColor: '#e3e3e3',
                                borderRadius: 5,
                                padding: 15,
                                fontSize: 15,
                                shadow: true,
                                shadowAlpha: 0.2,
                                shadowBlur: 5,
                                shadowDistance: 4,
                            },
                            scaleLabel: {
                                backgroundColor: '#424242',
                                padding: 5
                            }
                        },
                        scaleX: {
                                values: [], 
                        },
                        scaleY: {
                            guide: {
                                visible: false
                            },
                            values: '0:32:2'
                        },
                        tooltip: {
                            visible: false
                        },
                        //real-time feed
                        refresh: {
                                type: 'feed',
                                transport: 'js', //Set to 'http' for Direct and 'js' for function
                                url: 'fetchDataAsync1()', //Asynchronious HTTP request function
                                interval: 10000,
                        },
                        plot: {
                            lineWidth: 2,
                            hoverState: {
                            visible: false
                        },
                            marker: {
                                visible: true
                            },
                            aspect: 'spline'
                        },
                        series: [{
                            values: [],
                            lineColor: '#2196F3',
                            text: 'Fase 1'
                        }, {
                            values: [],
                            lineColor: 'red',
                            text: 'Fase 2'
                        }, {
                            values: [],
                            lineColor: 'green',
                            text: 'Fase 3'
                        }]
                }
    })        