import { DigitalOcean, DropletRequest, Droplet, Action } from 'digitalocean-js';
import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { env } from '../config';
import { ResourceNotFound } from './exceptions/resource-not-found';
import { InvalidFlavor } from './exceptions/invalid-flavor';
import Axios from 'axios';

import { Vanilla } from './utils/vanilla';
import { MinecraftFlavor } from './abstract/minecraft-flavor';

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
    const fullAddress = `${ip}:3000/status`;
    const response = await Axios.get(fullAddress);
    return response.data.status;
  }

  public async sendMinecraftCommand(
    id: number,
    command: string
  ): Promise<void> {
    const ip = await this.getDropletIP(id);
    const fullAddress = `${ip}:3000/command`;
    Axios.post(fullAddress, {
      command
    });
  }

  public async startMinecraftRemotely(id: number): Promise<void> {
    const ip = await this.getDropletIP(id);
    const fullAddress = `${ip}:3000/start`;
    Axios.post(fullAddress);
  }

  public async stopMinecraftRemotely(id: number): Promise<void> {
    const ip = await this.getDropletIP(id);
    const fullAddress = `${ip}:3000/shutdown`;
    Axios.delete(fullAddress);
  }

  public async restartMinecraftRemotely(id: number): Promise<void> {
    const ip = await this.getDropletIP(id);
    const fullAddress = `${ip}:3000/restart`;
    Axios.post(fullAddress);
  }

  private async getDropletIP(id: number): Promise<string> {
    const droplet = await this.client.droplets.getExistingDroplet(id);
    const ipv4 = droplet.networks?.v4.find(n => n.type === 'public');
    return ipv4!.ip_address;
  }

  private async getScript(flavor: string, version: string): Promise<string> {
    // GET SCRIPT PATH
    const scriptPath = resolve(__dirname, `../scripts/setup.sh`);

    // READ SCRIPT FILE
    let script = await asyncReadFile(scriptPath, 'utf8');

    // FETCH URL BASED ON FLAVOR - WILL ADD NEW FLAVORS AS WE SUPPORT THEM
    let minecraftFlavor: MinecraftFlavor;
    switch (flavor) {
      case 'vanilla':
        minecraftFlavor = new Vanilla(version);
        break;
      default:
        throw new InvalidFlavor('invalid or unsupported flavor');
    }
    const url = await minecraftFlavor.getServerUrl();

    // REPLACE VARIABLES
    // TODO: Update password to be not password :P
    script = script.replace('<<<PASSWORD>>>', 'password');
    script = script.replace('<<<URL>>>', url);

    // RETURN SCRIPT
    return script;
  }
}
