#!/usr/bin/env bash

dir=`basename "$PWD"`;
cd ../
if [ "$dir" != "script" ]
then
	echo "You must run this script from the script folder"
	exit 1
else
    sudo cp ./script/init.d/link-service.conf /etc/init/link-service.conf
    sudo service link-service stop
    sudo service link-service start
fi