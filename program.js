#!/usr/bin/env node
const { MinecraftService } = require('./dist');

const service = new MinecraftService();

// hardcode the correct id here when testing the various methods below
const id = 212567519;

// phony id to use to test error handling of the various methods below
const idOfDropletThatDoesNotExist = 2;

const options = {
  name: 'minecraft-server',
  version: '1.16.1',
  size: 's-1vcpu-1gb',
  region: 'nyc3',
  flavor: 'vanilla'
};

// service
//   .createMinecraftServer(options)
//   .then(droplet => {
//     console.log(JSON.stringify(droplet));
//   })
//   .catch(err => {
//     console.log(JSON.stringify(err));
//   });

// service.stopMinecraftServer(id).catch(err => {
//   console.log(err);
// });

// service.startMinecraftServer(id).catch(err => {
//   console.log(err);
// });

service.killMinecraftServer(id).catch(err => {
  console.log(JSON.stringify(err));
});
