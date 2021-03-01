# DirWatcher-vbi

It's an Directory watcher App i will keep on looking changes and record it.
I have created a service to read .txt files in user define directory to match particular keyword to match & get matching index and occurrence to store in DB.

API :

1. Setting API -> POST - http://localhost:3000/api/v1/watcher/
   in this API i have getting Directory location, Time interval and Keyword to Match,
   Body : {
   "location": "/home/digival-pbp/PBP/PBP/VBI Assessment/Dir",
   "interval": 5,
   "keyword": "PBP"
   }
2. Watcher Log -> GET - http://localhost:3000/api/v1/watcher/log?limit=300&pageNo=1
   To get Matching response details - it's along with Pagination.
