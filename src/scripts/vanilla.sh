#!/bin/bash

set -e

VANILLA_VERSION="<<<VERSION>>>"

MANIFEST="https://launchermeta.mojang.com/mc/game/version_manifest.json"
URL=$(python3 -c "
from json import load
from urllib.request import urlopen
from sys import stdout
manifest=load(urlopen('$MANIFEST'))
version='$VANILLA_VERSION'
if '$VANILLA_VERSION'=='latest': version=manifest['latest']['release']
url=[index['url'] for index in manifest['versions'] if index['id']==version][0]
stdout.write(str(load(urlopen(url))['downloads']['server']['url']))
")

rm -rf minecraft_server-run.jar
wget -O minecraft_server-run.jar "$URL"
echo "eula=true" > eula.txt
echo "enable-query=true" > server.properties
