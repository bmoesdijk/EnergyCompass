//Get Configuration
//Fill the meter brands list (Setting_17) at page load from the meter brands table
var select17 = document.getElementById("Setting_17");
var configQuery = "SELECT Brand FROM MeterBrand";
	$.ajax({
        type:'POST',
        url:'php/getMeterBrands.php', 
        data: {"query" : configQuery}, 
        dataType:'json',
        success: function(data) {
          	myArray = data.response1;
           	for (var i = 0; i < myArray.length; ++i) {
    		// Append the received array elements to the combobox list
    		select17[select17.length] = new Option(myArray[i], myArray[i]);
			}
		},	
		error: function(jqXHR, textStatus, errorThrown) {
            alert("JSON error 1 " + textStatus + " " + errorThrown);
        }
	});


//Once we selected a meter brand, load the types (Setting_18) that are associated with this brand
function addOptionsSetting18(Brand) {
//First clear any previous data from the combobox and fill it again based on the selected brand
$('#Setting_18').empty();
var select = document.getElementById("Setting_18");
var configQuery = "SELECT Model FROM MeterBrand where brand like '" + Brand + "'";
	//Get the model types from the database with the brand as search item.
	if (document.getElementById("Setting_18").value == "" ) {
		$.ajax({
        	type:'POST',
        	url:'php/getMeterBrands.php', 
        	data: {"query" : configQuery}, 
        	dataType:'json',
        	success: function(data) {
           		myArray = data.response1;
           		//Add the "select" option as the first option.
           		select[select.length] = new Option("selecteer", 0);
           		for (var i = 0; i < myArray.length; ++i) {
    			// Append the received array elements to the combobox list
    			select[select.length] = new Option(myArray[i], myArray[i]);
				}
			},	
			error: function(jqXHR, textStatus, errorThrown) {
                alert("JSON error 2 " +textStatus + " " + errorThrown);
            }
		});
	}
}

/* Create the tabs and set the selected tab to the active css style. */
function openTab(evt, tabName) {
    var i, tabcontent, tableft;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tableft = document.getElementsByClassName("tableft");
    for (i = 0; i < tableft.length; i++) {
        tableft[i].className = tableft[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/* convert the collection interval time selected by the user to absolute time minutes that data
	need to be stored in the database. The p1_Interface.py script uses this collection time to 
	determine when data needs to be written to the database based on the actual timestamp.*/
function P1CollectionInterval(action, selection) {
	if (action == "Write") {
		switch(selection) {
			 case "5": 
				return "00,05,10,15,20,25,30,35,40,45,50,55";
				break;
			case "10":
				return "00,10,20,30,40,50";
				break;
			case "15":
				return "00,15,30,45";
				break;
			case "30":
				return "00,30";
				break;
			case "60":
				return "00";
				break;
			}
	} else {
			switch(selection) {
			 case "00,05,10,15,20,25,30,35,40,45,50,55": 
				return 5;
				break;
			case "00,10,20,30,40,50":
				return 10;
				break;
			case "00,15,30,45":
				return 15;
				break;
			case "00,30":
				return 30;
				break;
			case "00":
				return 60;
				break;
			}
	}
}
//Maanlander 43

function ConfigData(event, action) {
switch (action) {
	case "save":
		if ( document.getElementById("Setting_18").value == "selecteer") {
			alert("Selecteer een meter type");
			document.getElementById("Setting_18").focus();
			break;
		}
		/* Update Configuration SET <elements> where id=1; */
		var Address = document.getElementById("Setting_1").value;
		var ElecEstUse = Number(document.getElementById("Setting_2").value);
		var GasEstUse = Number(document.getElementById("Setting_3").value);
		var DftOverview = document.getElementById("Setting_4").value;
		var TempAllow = document.querySelector('input[name="temp"]:checked').id
		var TempGraphColor = document.getElementById("Setting_5").value;
		var ElecGraphType = document.getElementById("Setting_6").value;
		var ElecGraphColor = document.getElementById("Setting_7").value;
		var GasGraphType = document.getElementById("Setting_8").value;
		var GasGraphColor = document.getElementById("Setting_9").value;
		var AverageGraphColor = document.getElementById("Setting_10").value;
		var WeatherStationId = document.getElementById("Setting_11").value; 
		var colInterval = P1CollectionInterval("Write", document.getElementById("Setting_12").value);
		var ChartTheme = document.getElementById("Setting_13").value;
		var DelivElecGraphColor = document.getElementById("Setting_15").value;
		var contractStartDate = document.getElementById("Setting_16").value;
		var MeterBrand = document.getElementById("Setting_17").value;
		var MeterType = document.getElementById("Setting_18").value;
		var Solar = document.getElementById("Setting_19").value;
		var TarifType = document.querySelector('input[name="TarifType"]:checked').id
		var SingleTarif = document.getElementById("Setting_20").value;
		var NormalTarif = document.getElementById("Setting_21").value;
		var LowTarif = document.getElementById("Setting_22").value;
		var ElecDeliveryCost = document.getElementById("Setting_23").value;
		var ElecFacilityCost = document.getElementById("Setting_27").value;
		var GasTarif = document.getElementById("Setting_24").value;
		var GasDeliveryCost = document.getElementById("Setting_25").value;
		var TaxDeduct = document.getElementById("Setting_26").value;
		var LoadMngt = document.getElementById("Setting_28").value;
		var configQuery = "UPDATE Configuration SET \
				Address=\'" + Address + "\', \
				contractStartDate=\'" + contractStartDate + "\', \
				ElecEst=\'" + ElecEstUse + "\', \
				GasEst=\'" + GasEstUse + "'\, \
				TempAllow=\'" + TempAllow + "\', \
				TempGraphColor=\'" + TempGraphColor + "\', \
				DftOverview=\'" + DftOverview + "\', \
				ElecGraphType=\'" + ElecGraphType + "\', \
				ElecGraphColor=\'" + ElecGraphColor + "\', \
				DelivElecGraphColor=\'" + DelivElecGraphColor + "\', \
				GasGraphType=\'" + GasGraphType + "\', \
				GasGraphColor=\'" + GasGraphColor + "\',\
				AverageGraphColor=\'" + AverageGraphColor + "\', \
				WeatherStationId=\'" + WeatherStationId + "\', \
				GetData=\'" + colInterval + "\', \
				ChartTheme=\'" + ChartTheme + "\', \
				meterBrand=\'" + MeterBrand + "\', \
				meterType=\'" + MeterType + "\', \
				Solar=\'" + Solar + "\', \
				TarifType=\'" + TarifType + "\', \
				SingleTarif=\'" + SingleTarif + "\', \
				NormalTarif=\'" + NormalTarif + "\', \
				LowTarif=\'" + LowTarif + "\', \
				ElecDeliveryCost=\'" + ElecDeliveryCost + "\', \
				ElecFacilityCost=\'" + ElecFacilityCost + "\', \
				GasTarif=\'" + GasTarif + "\', \
				GasDeliveryCost=\'" + GasDeliveryCost + "\', \
				TaxDeduct=\'" + TaxDeduct + "\',\
				LoadMngt=\'" + LoadMngt + "\'\
			WHERE id=1;";
		$.ajax({
               type:'POST',
               url:'php/mySQL_Config.php', 
               data: {"query" : configQuery}, 
               dataType:'json',
			   success: function(response1) {
				if (response1 = 1) {
						alert("Configuratie opgeslagen");
				} else {
						alert("Fout tijdens opslaan");
						}
			    },
			   error: function(jqXHR, textStatus, errorThrown) {
                 alert("Fout tijdens opslaan: JSON error 4 " + textStatus + " " + errorThrown);
            	} 
			});
		/* When the user changed the address in the configuration settings,
		   than change the address at the top of the web page to the new address */
		$("#Address").text(document.getElementById("Setting_1").value);
		break;
	case "get":
		/* Get configuration data from the Configuration table */
		var configQuery = "SELECT * FROM Configuration;";
		$.ajax({
               type:'POST',
               url:'php/mySQL_Config.php', 
               data: {"query" : configQuery}, 
               dataType:'json',
               success: function(data) {
               /* Put the location address of the smartmeter at the top
                  of the web page */
               		$("#Address").text(data.Address);
                    document.getElementById("Setting_1").value = data.Address;
                    document.getElementById("Setting_2").value = data.ElecEst;
                    document.getElementById("Setting_3").value = data.GasEst;
                    document.getElementById("Setting_4").value = data.DftOverview;
                    document.getElementById("Setting_5").value = data.TempGraphColor
                    document.getElementById(data.TempAllow).checked=true;
                    document.getElementById("Setting_6").value = data.ElecGraphType;
                    document.getElementById("Setting_7").value = data.ElecGraphColor;
                    document.getElementById("Setting_15").value = data.DelivElecGraphColor;
                    document.getElementById("Setting_8").value = data.GasGraphType;
                    document.getElementById("Setting_9").value = data.GasGraphColor;
                    document.getElementById("Setting_10").value = data.AverageGraphColor;
                    document.getElementById("Setting_11").value = data.WeatherStationId;
                    document.getElementById("Setting_12").value = P1CollectionInterval("Read", data.GetData);
                    document.getElementById("Setting_13").value = data.ChartTheme;
                   //Place the date in the right order and remove the timestamp
                    document.getElementById("Setting_14").value = data.appStartDate.split(' ')[0].split('-')[2] + 
                    												"-" + data.appStartDate.split(' ')[0].split('-')[1] + 
                   													"-" + data.appStartDate.split(' ')[0].split('-')[0];
                    document.getElementById("Setting_16").value = data.contractStartDate;
                    document.getElementById("Setting_17").value = data.MeterBrand;
                    //Fill the meter model list before we select the setting according to the config. database
					var select18 = document.getElementById("Setting_18");
					document.getElementById("Setting_19").value = data.Solar;
					document.getElementById("Setting_28").value = data.LoadMngt;
					var configQuery = "SELECT Model FROM MeterBrand where Brand='" + data.MeterBrand + "'";
					document.getElementById(data.TarifType).checked=true;
					document.getElementById("Setting_20").value = data.SingleTarif;
					document.getElementById("Setting_21").value = data.NormalTarif;
					document.getElementById("Setting_22").value = data.LowTarif;
					document.getElementById("Setting_23").value = data.ElecDeliveryCost;
					document.getElementById("Setting_27").value = data.ElecFacilityCost;
					document.getElementById("Setting_24").value = data.GasTarif;
					document.getElementById("Setting_25").value = data.GasDeliveryCost;
					document.getElementById("Setting_26").value = data.TaxDeduct;
					$.ajax({
        				type:'POST',
        				url:'php/getMeterBrands.php', 
        				data: {"query" : configQuery}, 
        				dataType:'json',
        				success: function(data) {
          					myArray = data.response1;
           					for (var i = 0; i < myArray.length; ++i) {
    						// Append the received array elements to the combobox list
    						select18[select18.length] = new Option(myArray[i], myArray[i]);
							}
						},	
						error: function(jqXHR, textStatus, errorThrown) {
            				alert(textStatus + " " + errorThrown);
        					}
						});
                    document.getElementById("Setting_18").value = data.MeterType;
				},
			   error: function(jqXHR, textStatus, errorThrown) {
                 alert("JSON error 5 " + textStatus + " " + errorThrown);
            	}	
		});
		break;
	}
}

/* Function to provide a date from the past use: new Date().pastDate(-n) 
   where n represents the number of days in the past (-)*/ 
 //Date.prototype.pastDate = function (n) {
 function pastDate(n) {
 	var time = new Date().getTime();
 	var date = new Date();
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    date.setTime(changedDate.getTime());
    switch (changedDate.getMonth()) {
    case "Jan":
    case 0:
     	var month = "01";
     	break;
    case "Feb":
    case 1:
        var month = "02";
        break;
    case "Mar":
    case 2:
        var month = "03";
        break;
    case "Apr":
    case 3:
        var month = "04";
        break;
    case "May":
    case 4:
        var month = "05";
        break;
    case "Jun":
    case 5:
        var month = "06";
        break;
    case "Jul":
    case 6:
        var month = "07";
        break;
    case "Aug":
    case 7:
        var month = "08";
        break;
    case "Sep":
    case 8:
        var month = "09";
        break;
    case "Oct":
    case 9:
        var month = "10";
        break;
    case "Nov":
    case 10:
        var month = "11";
        break;
    case "Dec":
    case 11:
        var month = "12";
        break;
    }
    var day = changedDate.getDate();
	if (day < 10) {
    	switch (changedDate.getDate()) {
    		case 1:
     			var day = "01";
     			break;
    		case 2:
        		var day = "02";
        		break;
    		case 3:
        		var day = "03";
        		break;
    		case 4:
        		var day = "04";
        		break;
    		case 5:
        		var day = "05";
        		break;
    		case 6:
        		var day = "06";
        		break;
    		case 7:
        		var day = "07";
        		break;
    		case 8:
        		var day = "08";
        		break;
    		case 9:
        		var day = "09";
        		break;
    	} 
    } 
 /* Put it in the right format for ZingChart and our database datetime column
    to use as a date string */
  var pastDate = changedDate.getFullYear() + "-" + month + "-" + day;
  return pastDate;
}

