# -*- coding: utf-8 -*-
"""
Created on Thu Sep 17 16:07:16 2015

@author: ddshin
"""

import numpy as np
import datetime
import urllib

threshold_range = np.arange(0.01, 0.08, 0.02)
threshold_range = [str(num) for num in threshold_range]
thres_colors = ["118:173:106:100", "40:96:25:100", "232:209:9:100", "255:164:29:100"]

url_head = "http://datacloud.wxc.com/?passkey=2a1f6d0b35ebb3bb0f100e3a05acd7ed&vs=1.0&datatype=forecast&format=kml&var=accumraintotal&type=shape&lonleft=-82&lonright=-73&latupper=41&latlower=37"

time = datetime.datetime(2015,9,21,7)
end = datetime.datetime(2015,9,22,03)
delta = datetime.timedelta(hours = 1)

poly_color_head = "&polycolor="
line_color_head = "&linecolor="
threshold_head = "&comparison=greaterthan&threshold="


for i,thres in enumerate(threshold_range):
    time = datetime.datetime(2015,9,21,7)
    timecount = 0
    while time < end:
        url = url_head + threshold_head + thres + poly_color_head + thres_colors[i] + line_color_head + thres_colors[i] + "&time=" + time.isoformat()
        print timecount, i
        filestring = "KML files/rain_"  + "time_" + str(timecount) + "_thresh_" + str(i) + ".kml"
        #urllib.urlretrieve (url, filestring)
        time = time + delta
        print url
        timecount = timecount + 1



            