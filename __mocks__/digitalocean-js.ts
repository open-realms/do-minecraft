import { DigitalOcean } from 'digitalocean-js';

// export const digitalocean: DigitalOcean = jest.createMockFromModule(
//   'digitalocean-js'
// );

// Import this named export into your test file:
export const createNewDroplet = jest.fn();
export const digitalocean: any = jest.fn().mockImplementation(() => {
  return {
    droplets: {
      createNewDroplet
    }
  };
});
