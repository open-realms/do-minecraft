#!/usr/bin/env node
const { MinecraftService } = require('./dist');

const service = new MinecraftService();

// hardcode the correct id here when testing the various methods below
// const id = 214710939;

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
//   .createMinecraftDroplet(options)
//   .then(droplet => {
//     console.log(JSON.stringify(droplet));
//   })
//   .catch(err => {
//     console.log(JSON.stringify(err));
//   });

// service
//   .startMinecraftRemotely(id)
//   .catch(err => {
//     console.log(JSON.stringify(err));
//   });

// service.stopMinecraftDroplet(id).catch(err => {
//   console.log(err);
// });

// service.startMinecraftDroplet(id).catch(err => {
//   console.log(err);
// });

service.killMinecraftDroplet(id).catch(err => {
  console.log(JSON.stringify(err));
});
