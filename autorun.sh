#!/bin/bash

HTML_FOLDER=/var/www/html
SERVER_FOLDER=./server
SERVER_EXECUTABLE=${SERVER_FOLDER}/output/server.out

server_build() {
    echo -e "Building server...\n"
    cd ${SERVER_FOLDER}
    make
    cd - > /dev/null
}
server_start() {
    if [ -f ${SERVER_EXECUTABLE} ] ; then
        echo -e "Start server..."
        ${SERVER_EXECUTABLE}
    else
        echo -e "Error! Executable file is not found!"
    fi
}
print_usage() {
    echo -e "usage:"
    echo -e "\t./autorun.sh                     : copy html folder to apache2 html folder"
    echo -e "\t./autorun.sh -c (--createdb)     : create database"
    echo -e "\t./autorun.sh -s (--start)        : start server"
    echo -e "\t./autorun.sh -b (--build)        : build server"
    echo -e "\t./autorun.sh -r (--rebuild)      : rebuild and start server"
}

if test "$#" == "0" ; then
    echo -e "Copying html resource to ${HTML_FOLDER}..."
    echo -e "Warning! All data in ${HTML_FOLDER} will be deleted!"
    read -p "Do you want to continue (y/n)? " ans
    if test "$ans" != "y" ; then
        exit
    fi 

    rm -rf ${HTML_FOLDER}/*
    # html folder
    cp -rf html/* ${HTML_FOLDER}/
    # common
    cp -rf common/* ${HTML_FOLDER}/home/
    cp -rf common/* ${HTML_FOLDER}/login/
    # rename php file to index.php
    mv ${HTML_FOLDER}/home/*.php ${HTML_FOLDER}/home/index.php
    mv ${HTML_FOLDER}/login/*.php ${HTML_FOLDER}/login/index.php

    echo "Done"
    exit
fi

if test "$#" == "1" ; then
    case $1 in
        -c|--createdb)
            echo -e "Create server database...\n"
            php server/database/CreateDatabase.php
            ;;
        -s|--start)
            server_start
            ;;
        -b|--build)
            server_build
            ;;
        -r|--rebuild)
            server_build
            sleep 1
            echo -e "\n================================\n"
            server_start
            ;;
        *)
            print_usage
            ;;
    esac
else
    print_usage
fi

