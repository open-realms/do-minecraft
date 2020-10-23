#!/bin/bash

set -e

# Create user
useradd -s /bin/bash -d /home/mcuser/ -p $(openssl passwd -1 <<<PASSWORD>>>) -m -G sudo mcuser
cd /home/mcuser

# Install packages
apt update -y
apt install git nodejs openjdk-11-jre-headless -y
apt install npm -y
npm install -g pm2

# Clone express server
git clone https://github.com/open-realms/express-minecraft.git

# Install dependencies for express server
cd /home/mcuser/express-minecraft
npm install
