import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// ✅ Load environment variables from .env file located in root directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

// ✅ Helper function to validate and convert string env variables to integer numbers
// This ensures that even though values are loaded as strings, we treat them as numbers safely
const numEnv = () => z.preprocess((val) => Number(val), z.number().int());

// ✅ Define a schema to validate all required environment variables using Zod
// This ensures all env values exist and are in the correct format (URL, number, email, etc.)
const envValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']), // Must be one of these values
  PORT: numEnv(), // Must be a valid integer (e.g., 3000)
  DB_URL: z.string().url(), // Must be a valid URL
  BCRYPT_SALT_ROUND: numEnv(), // Number of salt rounds for hashing passwords
  ACCESS_TOKEN_SECRET: z.string(), // Secret used to sign JWT access tokens
  ACCESS_TOKEN_EXPIRY: z.string(), // Access token expiration time (e.g., "1d", "15m")
  REFRESH_TOKEN_SECRET: z.string(), // Secret used to sign JWT refresh tokens
  REFRESH_TOKEN_EXPIRY: z.string(), // Refresh token expiration time

  // ✅ Cloudinary credentials for image hosting and management
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // ✅ Frontend and Backend URLs (for CORS, redirects, etc.)
  FRONT_END_LOCAL_URL: z.string().url(),
  FRONT_END_DEPLOYED_URL: z.string().url(),
  BACK_END_LOCAL_URL: z.string().url(),
  BACK_END_DEPLOYED_URL: z.string().url(),

  // ✅ Email config (e.g., for nodemailer)
  NODE_MAILER_SENDER_EMAIL: z.string().email(),
  NODE_MAILER_APP_PASSWORD: z.string(),

  // ✅ SSLCommerz credentials (for payment gateway integration)
  SSL_STORE_ID: z.string(),
  SSL_STORE_PASSWORD: z.string(),
});

// ✅ Parse and validate the environment variables using the schema
const parsedEnv = envValidationSchema.safeParse(process.env);

// ❌ If any variable is missing or invalid, stop the app and show detailed error
if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

// ✅ Export validated and type-safe env variables
// You can now safely use `env.PORT`, `env.DB_URL`, etc. throughout your app
export const env = parsedEnv.data;
