To view where the alias /P1_service is pointing too:
type -a P1_service
or alias
To remove the alias
unalias <aliasname>
alias defined in:   ~/.bashrc
update  vi ~/.bashrc   

How to start the P1 interface deamon
type: P1_service status
this should show someting like:
admin    27842     1  0 Apr05 ?        00:00:00 /usr/bin/python /volume1/web/energycompass/P1_Interface/p1_service.py
admin    27846 27842  0 Apr05 ?        00:12:59 /usr/bin/python /volume1/web/energycompass/P1_Interface/p1_service.py
admin    27847 27842 20 Apr05 ?        9-19:48:08 /usr/bin/python /volume1/web/energycompass/P1_Interface/p1_service.py
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN     
tcp        0      0 192.168.178.2:8080      192.168.178.6:51512     TIME_WAIT  
tcp        0      0 192.168.178.2:8080      192.168.178.6:51554     TIME_WAIT  
tcp        0      0 192.168.178.2:8080      192.168.178.6:51542     TIME_WAIT 

If not type: P1_service start

For debugging start the service in an SSH console:
python p1_service.py 


Python
See where python alias is pointing to:
which python or which python3
Check the python settings:
#python -m site or python3 -m site
Find the location of my Python site packages:
https://stackoverflow.com/questions/122327/how-do-i-find-the-location-of-my-python-site-packages-directory

python -c 'import site; print(site.getsitepackages())'
or
python3 -c 'import site; print(site.getsitepackages())'

update the python alias
python --version
sudo update-alternatives  --set python /usr/bin/python3.6

pip in python 3.4 or >
python3 -m pip
for help python3 -m pip --help

Find database location on disk:
sudo mysql
SHOW VARIABLES WHERE Variable_Name LIKE "%dir";
Location is shown in: wsrep_data_home_dir       | /var/packages/MariaDB10/target/mysql/ 
