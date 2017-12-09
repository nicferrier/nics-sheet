#!/bin/bash

# Run babelified ES6 tests on stuff

cd $(cd $(dirname $0) ; pwd)

# Fix the stupid debian/ubuntu nodejs package problem
which node > /dev/null
if [ $? -ne 0 ]
then
    mkdir nodebin
    ln -s $(which nodejs) nodebin/node
    export PATH=$PATH:$(pwd)/nodebin
fi

# Check for the babel presets
if [ ! -f .babelrc ]
then
    cat > .babelrc <<EOF
{
  "presets": ["es2015"]
}
EOF
fi


# Now find the source files to compile
FILES=$(ls www/*.js)

# Build all the js
node_modules/.bin/babel --out-dir dist --ignore node-modules $FILES
[ $? -ne 0 ] && exit 1

if [ "$*" == ""  ]
then
    ls dist/www/test-*.js | while read testFile
    do 
        ifs=$IFS
        IFS=''
        node $testFile 2>&1 | while read line ; do echo ${testFile}: $line ; done
        IFS=$ifs
        echo
    done
else
    numargs=$#
    for ((i=1 ; i <= numargs ; i++))
    do
        testFile=$1
        ifs=$IFS
        IFS=''
        node dist/www/$testFile 2>&1 | while read line ; do echo ${testFile}: $line ; done
        IFS=$ifs
        echo
        shift
    done
fi

# test.sh ends here
