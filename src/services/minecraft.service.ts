import { DigitalOcean, DropletRequest, Droplet, Action } from 'digitalocean-js';
import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { env } from '../config';
import { ResourceNotFound } from './exceptions/resource-not-found';

const asyncReadFile = promisify(readFile);

export class MinecraftService {
  private client: DigitalOcean;

  constructor() {
    this.client = new DigitalOcean(env.apiKey);
  }

  public async createMinecraftServer(
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

  public async stopMinecraftServer(id: number): Promise<Action> {
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

  public async startMinecraftServer(id: number): Promise<Action> {
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

  public async killMinecraftServer(id: number): Promise<void> {
    try {
      await this.client.droplets.deleteDroplet(id);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async startMinecraftRemotely(id: number): Promise<void> {}

  public async stopMinecraftRemotely(id: number): Promise<void> {}

  private async getScript(flavor: string, version: string): Promise<string> {
    const path = resolve(__dirname, `../scripts/${flavor}.sh`);
    let script = await asyncReadFile(path, 'utf8');
    script = script.replace('<<<VERSION>>>', version);
    return script;
  }
}
