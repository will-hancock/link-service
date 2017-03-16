#!/usr/bin/env bash

if [ -e "/etc/env" ];
then
    env=`head -1 /etc/env`
fi

for arg in "$@"; do
  shift
  case "$arg" in
    "--env") set -- "$@" "-e" ;;
    "--name") set -- "$@" "-n" ;;
    "--version") set -- "$@" "-v" ;;
    "--task") set -- "$@" "-t" ;;
    *)        set -- "$@" "$arg" ;;
  esac
done

while getopts ":e:n:v:t:" opt; do
  case $opt in
    e)
      env=$OPTARG;
      ;;
    n)
      package_name=$OPTARG;
      ;;
    v)
      version=$OPTARG;
      ;;
    t)
      task=$OPTARG;
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

echo "Package name: ${package_name} version: ${version} env: ${env} task: ${task}"

if [ -z "$env" ]
then
	echo "--env is required parameter"
	exit 1
fi

dir=`basename "$PWD"`;
cd ../
if [ "$dir" != "script" ]
then
	echo "You must run this script from the script folder"
	exit 1
else
    sudo cp ./script/init.d/link-service /etc/init/link-service
    sudo service link-service stop
    sudo service link-service start
fi