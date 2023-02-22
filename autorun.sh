#!/bin/bash

HTML_FOLDER=/var/www/html
WARNING=n
CREATE_DATABASE=n
COPY_TO_HTML_FOLDER=y
BUILD_SERVER=n
START_SERVER=n


if test "$WARNING" == "y" ; then
    echo -e "Warning! All data in ${HTML_FOLDER} will be deleted!"
    read -p "Do you want to continue (y/n)? " ans
    if test "$ans" != "y" ; then
        exit
    fi 
fi

if test "$CREATE_DATABASE" == "y" ; then
    echo -e "Make server database...\n"
    php resource/sql/createDatabase.php
fi

if test "$COPY_TO_HTML_FOLDER" == "y" ; then
    echo -e "\nCopying html resource to ${HTML_FOLDER}..."
    rm -rf ${HTML_FOLDER}/*
    cp -rf html/* ${HTML_FOLDER}/
fi

if test "$BUILD_SERVER" == "y" ; then
    echo -e "Building server...\n"
    cd ./resource/server
    make
fi 

if test "$START_SERVER" == "y" ; then
    echo -e "\nStart server..."
    ./server
    cd ../..
fi 