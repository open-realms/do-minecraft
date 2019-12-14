import { DigitalOcean, DropletRequest, Droplet } from 'digitalocean-js';
import { readFile, read } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { env } from '../config';

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

  private async getScript(key: string): Promise<string> {
    const path = resolve(__dirname, `../scripts/${key}.sh`);
    const script = await asyncReadFile(path, 'utf8');
    return script;
  }
}
