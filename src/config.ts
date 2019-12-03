import dotenv from 'dotenv';
dotenv.config();

export const env = {
  apiKey: process.env.DIGITAL_OCEAN_API_KEY,
  nodeEnv: process.env.NODE_ENV
};
