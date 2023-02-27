#!/bin/bash

HTML_FOLDER=/var/www/html
SERVER_FOLDER=./resource/server

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
    # function
    cp -rf function/ ${HTML_FOLDER}/home/
    cp -rf function/ ${HTML_FOLDER}/login/
    # sql
    cp -rf sql/ ${HTML_FOLDER}/home/
    cp -rf sql/ ${HTML_FOLDER}/login/

    echo "Done"
    exit
fi

if test "$#" == "1" ; then
    case $1 in
        -createdb)
            echo -e "Create server database...\n"
            php html/home/sql/CreateDatabase.php
            exit
            ;;
        -startserver)
            if [ ! -f ${SERVER_FOLDER}/server ] ; then
                echo -e "Building server...\n"
                cd ${SERVER_FOLDER}
                make
                cd - > /dev/null
                echo
                echo
            fi
            sleep 1
            if [ -f ${SERVER_FOLDER}/server ] ; then
                echo -e "Start server..."
                ${SERVER_FOLDER}/server
            fi
            exit
            ;;
        -rebuildserver)
            echo -e "Building server...\n"
            cd ./resource/server
            make clean
            make
            sleep 1
            cd - > /dev/null
            if [ -f ${SERVER_EXECUTABLE} ] ; then
                echo -e "\nStart server..."
                ${SERVER_EXECUTABLE}
            fi
            exit
            ;;
        *)
            ;;
    esac
fi

echo -e "usage:"
echo -e "\tautorun.sh                 : copy html folder to apache2 html folder"
echo -e "\tautorun.sh -createdb       : create database"
echo -e "\tautorun.sh -startserver    : start server"
echo -e "\tautorun.sh -rebuildserver  : rebuild and start server"