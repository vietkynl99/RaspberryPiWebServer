#!/bin/bash

HTML_FOLDER=/var/www/html

echo -e "Warning! All data in ${HTML_FOLDER} will be deleted!"
read -p "Do you want to continue (y/n)? " ans

if test "$ans" != "y" ; then
    exit
fi 

# echo -e "Make server database...\n"
# php resource/sql/createDatabase.php

echo -e "\nCopying html resource to ${HTML_FOLDER}..."
rm -rf ${HTML_FOLDER}/*
cp -rf html/* ${HTML_FOLDER}/

echo -e "Building server...\n"
cd ./resource/server
make

echo -e "\nStart server..."
./server
cd ../..