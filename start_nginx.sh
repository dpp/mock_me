#!/bin/bash

echo "About to start dockerized Nginx. Point your browser to"
echo "http://localhost or to your boot2docker instance"

docker run -ti --rm -p 80:80 -v $(pwd):/usr/share/nginx/html:ro nginx
