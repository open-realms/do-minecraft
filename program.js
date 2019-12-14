#!/usr/bin/env node
const { MinecraftService } = require('./dist');

const service = new MinecraftService();

const options = {
  name: 'minecraft-server',
  version: '1.15.0',
  size: 's-1vcpu-1gb',
  region: 'nyc3',
  flavor: 'vanilla'
};

service
  .createMinecraftServer(options)
  .then(droplet => {
    console.log(JSON.stringify(droplet));
  })
  .catch(err => {
    console.log(JSON.stringify(err));
  });
