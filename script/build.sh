#!/usr/bin/env bash
#@version 1.0.0-RC2

set -e

dir=`basename "$PWD"`;
cd ../
if [ "$dir" != "script" ]
then
	echo "You must run this script from the script folder"
	exit 1
else
	yarn install
fi
