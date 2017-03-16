#!/usr/bin/env bash

dir=`basename "$PWD"`;
cd ../
if [ "$dir" != "script" ]
then
	echo "You must run this script from the script folder"
	exit 1
else
    ENV=$(cat /etc/env)
    sed -e "s/\${env}/$ENV/" ./script/apache2/link-service.conf >> /etc/apache2/sites-available/link-service.conf
    a2ensite link-service
    service apache2 reload
    cp ./script/init.d/link-service.conf /etc/init/link-service.conf
    service link-service restart
fi