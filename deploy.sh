#!/bin/bash
set -ev

firstArg=$1
buildAlias='team-3-'${firstArg}'.now.sh'
buildPostfixPattern=${firstArg}'.now.sh\>'
echo $NOW_TOKEN
currentTestBuild=$(now alias ls --token $NOW_TOKEN | grep $buildPostfixPattern | awk '{print $1}')
if [ ! -z $currentTestBuild ]
then
    echo 'start remove old build ' $currentTestBuild
    echo $(now rm $currentTestBuild --token $NOW_TOKEN -y)
fi

echo 'start build'
echo $(now --public -e NODE_ENV=production --token $NOW_TOKEN --npm --dotenv=.env.production)
echo 'start creating alias'
newBuild=$(now ls --token $NOW_TOKEN | head -5 | tail -1 | awk '{print $1}')
echo $(now alias $newBuild $buildAlias)
