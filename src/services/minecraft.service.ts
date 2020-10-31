import { DigitalOcean, DropletRequest, Droplet, Action } from 'digitalocean-js';
import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { env } from '../config';
import { ResourceNotFound } from './exceptions/resource-not-found';
import Axios from 'axios';

const asyncReadFile = promisify(readFile);

export class MinecraftService {
  private client: DigitalOcean;

  constructor() {
    this.client = new DigitalOcean(env.apiKey);
  }

  public async createMinecraftDroplet(
    config: MinecraftServerConfig
  ): Promise<Droplet> {
    const userData = await this.getScript(config.flavor, config.version);
    const request: DropletRequest = {
      name: config.name,
      region: config.region,
      size: config.size,
      image: 'ubuntu-18-04-x64',
      user_data: userData,
      backups: false,
      ipv6: false,
      tags: ['minecraft']
    };

    const droplet = await this.client.droplets.createNewDroplet(request);

    return droplet;
  }

  public async stopMinecraftDroplet(id: number): Promise<Action> {
    let action: Action;
    try {
      action = await this.client.dropletActions.powerOffDroplet(id);
    } catch (err) {
      if (err.response.status === 404) {
        throw new ResourceNotFound(err.message);
      }
      throw new Error(err.message);
    }
    return action;
  }

  public async startMinecraftDroplet(id: number): Promise<Action> {
    let action: Action;
    try {
      action = await this.client.dropletActions.powerOnDroplet(id);
    } catch (err) {
      if (err.response.status === 404) {
        throw new ResourceNotFound(err.message);
      }
      throw new Error(err.message);
    }
    return action;
  }

  public async killMinecraftDroplet(id: number): Promise<void> {
    try {
      await this.client.droplets.deleteDroplet(id);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getMinecraftServerStatus(id: number): Promise<string> {
    const ip = await this.getDropletIP(id);
    const full_address = `${ip}:3000/status`;
    const response = await Axios.get(full_address);
    return response.data.status;
  }

  public async sendMinecraftCommand(id: number, command: string): Promise<void> {
    const ip = await this.getDropletIP(id);
    const full_address = `${ip}:3000/command`;
    Axios.post(full_address, {
      command: command
    });
  }

  public async startMinecraftRemotely(id: number): Promise<void> {
    const full_address = this.getDropletIP(id) + ':3000/start';
    Axios.post(full_address);
  }

  public async stopMinecraftRemotely(id: number): Promise<void> {
    const full_address = this.getDropletIP(id) + ':3000/shutdown';
    Axios.delete(full_address);
  }

  public async restartMinecraftRemotely(id: number): Promise<void> {
    const full_address = this.getDropletIP(id) + ':3000/restart';
    Axios.post(full_address);
  }

  private async getDropletIP(id: number): Promise<string> {
    const droplet = await this.client.droplets.getExistingDroplet(id);
    const ipv4 = droplet.networks?.v4.find(n => n.type === 'public');
    return ipv4!.ip_address;
  }

  private async getScript(flavor: string, version: string): Promise<string> {
    // GET HEAD, FLAVOR, AND TAIL PATHS
    const headPath = resolve(__dirname, `../scripts/head.sh`);
    const tailPath = resolve(__dirname, `../scripts/tail.sh`);
    const flavorPath = resolve(__dirname, `../scripts/${flavor}.sh`);
    // READ SCRIPT FILES
    let headScript = await asyncReadFile(headPath, 'utf8');
    const tailScript = await asyncReadFile(tailPath, 'utf8');
    let flavorScript = await asyncReadFile(flavorPath, 'utf8');
    // REPLACE VARIABLES
    // TODO: Update password to be not password :P
    headScript = headScript.replace('<<<PASSWORD>>>', 'password');
    flavorScript = flavorScript.replace('<<<VERSION>>>', version);
    // RETURN FULL SCRIPT
    return headScript + flavorScript + tailScript;
  }
}
