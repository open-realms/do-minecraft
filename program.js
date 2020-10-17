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
//   .createDroplet(options)
//   .then(droplet => {
//     console.log(JSON.stringify(droplet));
//   })
//   .catch(err => {
//     console.log(JSON.stringify(err));
//   });

// service.stopDroplet(id).catch(err => {
//   console.log(err);
// });

// service.startDroplet(id).catch(err => {
//   console.log(err);
// });

service.killDroplet(id).catch(err => {
  console.log(JSON.stringify(err));
});
