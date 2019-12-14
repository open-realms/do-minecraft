# DigitalOcean Minecraft

A library used to create and manage minecraft servers on DigitalOcean droplets.

## Roadmap

**Project Setup**

- [x] Get TypeScript set up
- [x] Add jest for testing
- [x] Add `digitalocean-js` to the project
- [x] Get environment variable support working for digitalocean tokens (`.env`)
- [x] Single build command to transpile and package library

**Functionality**

- [x] Create Droplet with Minecraft
  - [x] IF NEW: Minecraft build script included
  - [ ] IF EXISTING: Use existing snapshot to spin up server
  - [ ] Include optionally provided ssh key for easy server access
- [ ] Check droplet status
- [ ] Start Minecraft remotely
- [ ] Stop Minecraft remotely
- [ ] Restart Minecraft remotely
- [ ] Shut down droplet (after stopping minecraft)
- [ ] Take snapshot of droplet
- [ ] Destroy droplet

There is likely more functionality I forgot, so we'll add that later.
