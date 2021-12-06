#!/usr/bin/env python
# -- coding: utf-8 --
from __future__ import (absolute_import, division,
                        print_function, unicode_literals)

try:
        from PyDect200 import PyDect200
except:
        print(u'PyDect200 is not installed!')
        print(u'run: pip install PyDect200')
        exit()
import getpass
import sys

#define case and switch functions
def case(*args):
    return any((arg == switch.value for arg in args))
class switch(object):
    value = None
    def __new__(class_, operation):
        class_.value = operation
        return True
        
try:
    PyDect200.__version__
except:
    PyDect200 = PyDect200.PyDect200

def main(un, pw, Dect200AIN, operation):
    f = PyDect200(pw, username=un)
    if not f.login_ok():
        return("Login failed, Wrong Password?")
        exit(1)

    while switch(operation):
        if case("toggle"):
            f.switch_toggle(Dect200AIN)
            break
        if case("on"):
            f.switch_on(Dect200AIN)
            return "ON"
            break
        if case("off"):
            f.switch_off(Dect200AIN)
            return "OFF"
            break
        if case("status"):
            status = f.get_state(Dect200AIN)
            #print("%s" % ('ON' if status == '1' else 'OFF')) #return for php calls
            return "%s" % ('ON' if status == '1' else 'OFF') #return for python calls
            break
        if case ("temperature"):
    	    temperature = f.get_temperature_single(Dect200AIN)
    	    print(temperature) #return for php calls
    	    return temperature #return for python calls
    	    break
        return "Incorrect operation provided"
        break

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])