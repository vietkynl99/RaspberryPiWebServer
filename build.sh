#!/bin/bash

# echo -e "Make server database...\n"
# php sql/sql.php

echo -e "Building server...\n"
cd ./master
make

echo "Start Server..."
./server