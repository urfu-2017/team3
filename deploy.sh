#!/bin/bash

currentdir=$(pwd | sed 's/ /\\ /g');
nowpath=${currentdir}"/node_modules/now/download/dist";
export PATH=$PATH:"$nowpath"

firstArg=$1
nowToken=$2
buildAlias='team-3-'${firstArg}'.now.sh'
buildPostfixPattern=${firstArg}'.now.sh\>'

echo 'TOKEN: '${nowToken}
currentTestBuild=$(now alias ls --token $nowToken | grep $buildPostfixPattern | awk '{print $1}')
if [ ! -z $currentTestBuild ]
then
    echo 'start remove old build ' $currentTestBuild
    echo $(now rm $currentTestBuild --token $nowToken -y)
fi

echo 'start build'
echo $(now --public -e NODE_ENV=production --token $nowToken --npm --dotenv=.env.production)
echo 'start creating alias'
newBuild=$(now ls --token $nowToken | head -5 | tail -1 | awk '{print $1}')
echo $(now alias $newBuild $buildAlias)
