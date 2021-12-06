//Get Screen Config

function ScreenConfig(event, action, location) {
switch (action) {
	case "save":
		/* Update Configuration SET <elements> where id=1; */
		if (location == "Front") {
			var ScreenAIN = document.getElementById("Setting_51").value;
        	var FritzDect400AIN = document.getElementById("Setting_52").value;
        	var setSunIntensity = Number(document.getElementById("Setting_53").value);
        	var setGusts = Number(document.getElementById("Setting_54").value);
        	var switchDif = Number(document.getElementById("Setting_55").value);
        	var sunRiseSetReduction = 1 - Number(document.getElementById("Setting_56").value);
        	var GPSlocation = document.getElementById("Setting_57").value;
        	var ScreenResetTime = document.getElementById("Setting_58").value;
        	var ScreenShadowStart = document.getElementById("Setting_59").value;
        	var ScreenShadowEnd = document.getElementById("Setting_60").value;
        	var sunRiseEndTime = document.getElementById("Setting_61").value;
        	var sunSetStartTime = document.getElementById("Setting_62").value;
		} else {
			var ScreenAIN = document.getElementById("Setting_64").value;
        	var FritzDect400AIN = document.getElementById("Setting_65").value;
        	var setSunIntensity = Number(document.getElementById("Setting_66").value);
        	var setGusts = Number(document.getElementById("Setting_67").value);
        	var switchDif = Number(document.getElementById("Setting_68").value);
        	var sunRiseSetReduction = 1 - Number(document.getElementById("Setting_69").value);
        	var GPSlocation = document.getElementById("Setting_70").value;
        	var ScreenResetTime = document.getElementById("Setting_71").value;
        	var ScreenShadowStart = document.getElementById("Setting_72").value;
        	var ScreenShadowEnd = document.getElementById("Setting_73").value;
        	var sunRiseEndTime = document.getElementById("Setting_74").value;
        	var sunSetStartTime = document.getElementById("Setting_75").value;
        }
			var configQuery = "UPDATE ScreenConfig SET \
				ScreenAIN=\'" + ScreenAIN + "\', \
				FritzDect400AIN=\'" + FritzDect400AIN + "\', \
				setSunIntensity=\'" + setSunIntensity + "\', \
				setGusts=\'" + setGusts + "'\, \
				sunRiseSetReduction=\'" + sunRiseSetReduction + "\', \
				location=\'" + GPSlocation + "\', \
				switchDif=\'" + switchDif + "\', \
				ScreenResetTime=\'" + ScreenResetTime + "\', \
				ScreenShadowStart=\'" + ScreenShadowStart + "\', \
				ScreenShadowEnd=\'" + ScreenShadowEnd + "\', \
				sunRiseEndTime=\'" + sunRiseEndTime + "\', \
				sunSetStartTime=\'" + sunSetStartTime + "\' \
				WHERE ScreenName='" + location + "\'";
		$.ajax({
               type:'POST',
               url:'php/ScreenConfig.php', 
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
		var configQuery = "SELECT * FROM ScreenConfig WHERE ScreenName='Front';";
		$.ajax({
               type:'POST',
               url:'php/ScreenConfig.php', 
               data: {"query" : configQuery}, 
               dataType:'json',
               success: function(data) {
               /* Put the location address of the smartmeter at the top
                  of the web page */
                  	if (data.ScreenStatus == "1") {
               			document.getElementById("setting_50").style.color = "green";
               		} else {
               			document.getElementById("setting_50").style.color = "gray";
               		}
               		document.getElementById("Setting_51").value = data.ScreenAIN;
               		document.getElementById("Setting_52").value = data.FritzDect400AIN;
                    document.getElementById("Setting_53").value = data.setSunIntensity;
                    document.getElementById("Setting_54").value = data.setGusts;
                    document.getElementById("Setting_55").value = data.switchDif;
                    document.getElementById("Setting_56").value = data.sunRiseSetReduction;
                    document.getElementById("Setting_57").value = data.GPSlocation;
                    document.getElementById("Setting_58").value = data.ScreenResetTime
                    document.getElementById("Setting_59").value = data.ScreenShadowStart;
                    document.getElementById("Setting_60").value = data.ScreenShadowEnd;
                    document.getElementById("Setting_61").value = data.sunRiseEndTime;
                    document.getElementById("Setting_62").value = data.sunSetStartTime;
				},
				error: function(jqXHR, textStatus, errorThrown) {
                 	alert("Fout tijdens ophalen van front-screen config data " + textStatus + " " + errorThrown);
				}
		});
		var configQuery = "SELECT * FROM ScreenConfig WHERE ScreenName='Back';";
		$.ajax({
               type:'POST',
               url:'php/ScreenConfig.php', 
               data: {"query" : configQuery}, 
               dataType:'json',
               success: function(data) {
               /* Put the location address of the smartmeter at the top
                  of the web page */
                  	if (data.ScreenStatus == "1") {
               			document.getElementById("setting_63").style.color = "green";
               		} else {
               			document.getElementById("setting_63").style.color = "gray";
               		}
               		document.getElementById("Setting_64").value = data.ScreenAIN;
               		document.getElementById("Setting_65").value = data.FritzDect400AIN;
                    document.getElementById("Setting_66").value = data.setSunIntensity;
                    document.getElementById("Setting_67").value = data.setGusts;
                    document.getElementById("Setting_68").value = data.switchDif;
                    document.getElementById("Setting_69").value = data.sunRiseSetReduction;
                    document.getElementById("Setting_70").value = data.GPSlocation;
                    document.getElementById("Setting_71").value = data.ScreenResetTime
                    document.getElementById("Setting_72").value = data.ScreenShadowStart;
                    document.getElementById("Setting_73").value = data.ScreenShadowEnd;
                    document.getElementById("Setting_74").value = data.sunRiseEndTime;
                    document.getElementById("Setting_75").value = data.sunSetStartTime;
				},
				error: function(jqXHR, textStatus, errorThrown) {
                 	alert("Fout tijdens ophalen van back-screen config data " + textStatus + " " + errorThrown);
				}
		});
		
		var configQuery = "SELECT WeatherStationId FROM Configuration;";
		$.ajax({
               type:'POST',
               url:'php/currentWeatherInfo.php', 
               data: {"query" : configQuery}, 
               dataType:'json',
               success: function(data) {
               		document.getElementById("Setting_80").value = data.temperature
               		document.getElementById("Setting_81").value = data.windGusts
               		document.getElementById("Setting_82").value = data.sunIntensity
				},
				error: function(jqXHR, textStatus, errorThrown) {
                 	alert("Fout tijdens ophalen van weerdata " + textStatus + " " + errorThrown);
               }
         })
		break;
	}
}

function getLogText(location) {
        var http = new XMLHttpRequest();
        var url = 'php/loadScreenControlLogtext.php';
        var elementId = location.split("=")[1];
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                document.getElementById(elementId).innerHTML = http.responseText;
            }
        }
        http.send(location);

}

