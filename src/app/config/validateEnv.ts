import dotenv from 'dotenv';
import path from 'path';
import { envValidationSchema } from './envValidationSchema';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Load env file dynamically
dotenv.config({
  path: path.join(process.cwd(), `.env.${NODE_ENV}.local`),
});

// Validate env variables using schema
const parsedEnv = envValidationSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
