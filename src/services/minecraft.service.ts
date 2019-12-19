import { DigitalOcean, DropletRequest, Droplet, Action } from 'digitalocean-js';
import { readFile, read, access } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { env } from '../config';
import { ResourceNotFound } from './interfaces/resource-not-found';
import { ActionService } from 'digitalocean-js/build/main/lib/services/actions-service';

const asyncReadFile = promisify(readFile);

export class MinecraftService {
  private client: DigitalOcean;

  constructor() {
    this.client = new DigitalOcean(env.apiKey);
  }

  public async createMinecraftServer(
    config: MinecraftServerConfig
  ): Promise<Droplet> {
    const userData = await this.getScript(config.flavor);
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
    const droplet = this.client.droplets.deleteDroplet(id).catch(err => {});
  }

  private async getScript(key: string): Promise<string> {
    const path = resolve(__dirname, `../scripts/${key}.sh`);
    const script = await asyncReadFile(path, 'utf8');
    return script;
  }
}
