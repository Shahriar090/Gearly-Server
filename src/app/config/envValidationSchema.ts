import { z } from 'zod';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Helper to convert env vars from string to number
const numEnv = () => z.preprocess((val) => Number(val), z.number().int());

export const envValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: numEnv(),
  DB_URL: z.string().url(),
  BCRYPT_SALT_ROUND: numEnv(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  FRONT_END_LOCAL_URL: z.string().url(),
  FRONT_END_DEPLOYED_URL:
    NODE_ENV === 'development' ? z.string().optional() : z.string().url(),
  BACK_END_LOCAL_URL: z.string().url(),
  BACK_END_DEPLOYED_URL:
    NODE_ENV === 'development' ? z.string().optional() : z.string().url(),

  NODE_MAILER_SENDER_EMAIL: z.string().email(),
  NODE_MAILER_APP_PASSWORD: z.string(),

  SSL_STORE_ID: z.string(),
  SSL_STORE_PASSWORD: z.string(),
});
