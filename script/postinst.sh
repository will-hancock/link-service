#!/usr/bin/env bash

dir=`basename "$PWD"`;
cd ../
if [ "$dir" != "script" ]
then
	echo "You must run this script from the script folder"
	exit 1
else
    ENV=$(cat /etc/env)
    sudo sed -e "s/\${env}/$ENV/" template.txt >> /etc/apache2/sites-available/link-service.conf
    sudo a2ensite link-service
    sudo service apache2 reload
    sudo cp ./script/init.d/link-service.conf /etc/init/link-service.conf
    sudo service link-service restart
fi