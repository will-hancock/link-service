#!/usr/bin/env bash
#@version 1.0.0-RC2

if [ -e "/etc/env" ];
then
    env=`head -1 /etc/env`
fi

for arg in "$@"; do
  shift
  case "$arg" in
    "--env") set -- "$@" "-e" ;;
    *)           set -- "$@" "$arg"
  esac
done

while getopts ":e:" opt; do
  case $opt in
    e)
      env=$OPTARG;
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
    yarn test
fi
