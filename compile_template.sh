#!/bin/sh

# Compila i template Handlebars in app/templates.js (richiede `npm i -g handlebars`)
handlebars -m templates/> app/templates.js

#/usr/local/bin/handlebars -m templates/> js/templates_c.js

#
#rm compiled/*

#FILES="templates/*"
#for file in $FILES
#do
#  	echo "*** reading $file template..."
#	result=$(echo $file | cut -c11- | rev | cut -c6- | rev)
#	handlebars -m "$file" -f "compiled/$result.tmp"
#	echo "*** compile $result.tmp"
#	echo "ok "
#	echo " "
#done

#COMPILED="compiled/*"
#for file in $COMPILED; do (cat "${file}"; echo) >> compiled/templates.js; done

#rm compiled/*.tmp
