import pymysql
import sys
#id = 33044
count = 1
DBconnect = pymysql.connect(host="localhost",port=3307,user="root",passwd="",db="SmartMeter" ) 
cursor = DBconnect.cursor() 
DBconnect.autocommit(True) #Autocommit all changes before closing the database.

if ( len(sys.argv) < 3 ):
	print("Usage: crawlDb <start-entry-id> <end-entry-id>")
	exit(0)
id_bgn = int(sys.argv[1])
id_end = int(sys.argv[2])
	
def getDataFromDb(query):    
	cursor.execute(query)
	return cursor.fetchone()[0]

id = id_bgn
while ( id < id_end ):
	Val1 = float(getDataFromDb("SELECT countVal FROM Gas where id=%s" % id))
	if ( id +1  < id_end ):
		id = id + 1
		Val2 = float(getDataFromDb("SELECT countVal FROM Gas where id=%s" % id))
		usage = Val2 - Val1
		print(usage)
		if (usage > 0):
			response = cursor.execute("UPDATE Gas SET myUsage=%s where id=%s" % (float("{0:.3f}".format(usage)), id))
			print("UPDATE Gas SET myUsage=%s where id=%s" % (float("{0:.3f}".format(usage)), id))
			print("ID: %s updated" % id)
	else:
			DBconnect.close()
			print( "%s entries updated" % count)
			exit(0)
	count = count + 1


