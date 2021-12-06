# EnergyCompass
P1 Smartmeter control and website
EnergyCompass is a smartmeter web interface written in http and css and uses zingchart (https://www.zingchart.com) to display graphs and guages.
EnergyCompass consists of a number of scripts written in python for the P1 telegram collection and in php and java for displaying the data in the
Zingchart graphs and guages. 
The database uses mySQL and can easily be created with the mysql script Create_SmartMeterDB.sql in the tools folder.
The web interface also has a powermanagement function for a car charger (Laadpaal in dutch) I use a car charger that comes with a powermanagement
function which can be enabled with the use of a potentialfree relay switch. I used a relay which I switch using a FritzBox FRITZ!DECT 210.
I connected the potentialfree relay to the Dect210 to enbale the on/off switch function on the powermanagement 12V contacts in the car charger.
By selecting the maxiumum amperage in the web interface, the car charger is switched off when the amperage reaches the set value.
