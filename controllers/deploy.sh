#!/bin/bash
git clone git@github.com:yhddx/blog_server.git
cd blog_server
pm2 start app.js -i 4