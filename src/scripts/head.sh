#!/bin/bash

set -e

# Create user
useradd -s /bin/bash -d /home/mcuser/ -p $(openssl passwd -1 <<<PASSWORD>>>) -m -G sudo mcuser

# Install packages
apt update -y
apt install git nodejs openjdk-11-jre-headless -y
apt install npm -y

sudo -u mcuser -i << EOF

# Change npm global path
mkdir ~/.npm-global
NPM_CONFIG_PREFIX=~/.npm-global
npm config set prefix '~/.npm-global'

# Update path
export PATH=~/.npm-global/bin:$PATH
# Add path to profile
echo 'PATH=~/.npm-global/bin:$PATH' >>~/.profile

npm install -g pm2

# Clone express server
git clone https://github.com/open-realms/express-minecraft.git /home/mcuser/express-minecraft

# Install dependencies for express server
cd /home/mcuser/express-minecraft
mkdir /home/mcuser/express-minecraft/minecraft
npm install
