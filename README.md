# EnergyCompass
P1 Smartmeter control and website
EnergyCompass is a smartmeter web interface written in http and css and uses zingchart (https://www.zingchart.com) to display graphs and guages.
EnergyCompass consists of a number of scripts written in python for the P1 telegram collection and in php and java for displaying the data in the
Zingchart graphs and guages. 
The database uses mySQL and can easily be created with the mysql script Create_SmartMeterDB.sql in the tools folder.
EnergyCompass uses a FTDI to USB converter cable which can be purchased here:https://www.bol.com/nl/nl/p/slimme-meter-kabel-p1-usb/9200000111535827/?Referrer=ADVNLGOO002013-G-123000370280-S-1075421040600-9200000111535827&gclid=CjwKCAiAhreNBhAYEiwAFGGKPOQPYM6VhUtuaJRz72_H9qBMjn8penZuhhvJ5eUk6tUJfjZ4zL-IqhoCTa0QAvD_BwE

Car-Charger-Power-Management:
The web interface also has a powermanagement function for a car charger (Laadpaal in dutch) I use a car charger that comes with a powermanagement
function which can be enabled with the use of a potentialfree relay switch. I used a relay which I switch using a FritzBox FRITZ!DECT 210.
I connected the potentialfree relay to the Dect210 to enbale the on/off switch function on the powermanagement 12V contacts in the car charger.
By selecting the maxiumum amperage in the web interface, the car charger is switched off when the amperage reaches the set value.

Inatallation:
To install EnergyCompass on your Synology Nas or any Linux server:

Make sure that the following packages are pre-installed on your Synology NAS:
- webstation
- python3
- pip3
- mysql (MariaDB10)
<br>
<br>
copy all files and folder to /volume1/web/Energycompass directory
<br>
run the .sql script (Create_SmartMeterDB.sql) from the tools directory to create the database.
For example:<br>
baseDir="/volume0/web/energycompass/tools"<br>
MYSQL=`which mysql`<br>
$MYSQL -h localhost -u root -p SmartMeter < "$baseDir/Create_SmartMeterDB.sql"
<br>
<br>
open the website in your web-browser by typing http://<ip-adress>:<portnumber of webserver>
