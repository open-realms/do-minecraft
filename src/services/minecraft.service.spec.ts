import { MinecraftServerConfig } from './interfaces/minecraft-server-config';
import { MinecraftService } from './minecraft.service';
import { digitalocean } from '../../__mocks__/digitalocean-js';
jest.mock('digitalocean-js');

describe('MinecraftService', () => {
  let service: MinecraftService;

  beforeEach(() => {
    // Setup
    process.env = {
      DIGITAL_OCEAN_API_KEY: 'abc123',
      NODE_ENV: 'test'
    };
    service = new MinecraftService();
  });

  it('should exist upon instantiation', async () => {
    // Test
    const config: MinecraftServerConfig = {
      name: 'minecraft-server',
      version: '1.16.1',
      size: 's-1vcpu-1gb',
      region: 'nyc3',
      flavor: 'vanilla'
    };
    const droplet = await service.createMinecraftDroplet(config);
    expect(digitalocean.droplets.createNewDroplet).toHaveBeenCalled();
  });
});
