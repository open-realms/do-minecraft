URL="<<<URL>>>"

rm -rf /home/mcuser/express-minecraft/minecraft/minecraft_server-run.jar
curl -f $URL -o /home/mcuser/express-minecraft/minecraft/minecraft_server-run.jar
echo "eula=true" > /home/mcuser/express-minecraft/minecraft/eula.txt
echo "enable-query=true" > /home/mcuser/express-minecraft/minecraft/server.properties
