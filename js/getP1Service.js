//Get the current p1 service interface status
function P1Service(event, action) {
	document.getElementById("spinner").style.display = "block";
	document.getElementById("p1Status").innerHTML = "Checking";
	document.getElementById("p1Status").style.backgroundColor = "orange";
	$.ajax({
        	type:'POST',
        	url:'php/getP1Service.php',
        	data: {"param" : action},  
        	success: function(P1Status) { //Response resieved.
        		if (/ERROR/i.test(P1Status)) { //Check if an error exception is returned. If so display the error returned.
        			alert (P1Status);
        		}
        		//Test the Return value P1Status for the string: TimeWait, Running or Stopped
        		switch(true) {
        			case (/TimeWait/i.test(P1Status)):
        				document.getElementById("p1Status").innerHTML = "Time-Wait";
        				document.getElementById("spinner").style.display = "none";
        				break;
        			case (/Running/i.test(P1Status)): 
	 					document.getElementById("p1Status").innerHTML = "Running";
	 					document.getElementById("p1Status").style.backgroundColor = "green";
	 					document.getElementById("spinner").style.display = "none";
	 					break;
					case (/Stopped/i.test(P1Status)):
						document.getElementById("p1Status").innerHTML = "Stopped";
						document.getElementById("p1Status").style.backgroundColor= "red";
						document.getElementById("spinner").style.display = "none";
						break;
					default:
						document.getElementById("p1Status").innerHTML = "Stopped";
						document.getElementById("p1Status").style.backgroundColor= "red";
						document.getElementById("spinner").style.display = "none";
						break;
				}
			},	
			error: function(jqXHR, textStatus, errorThrown) { //Ajax error. i.e. no response from the php script
                alert("JSON error 2 " +textStatus + " " + errorThrown);
            }
		})
}		
