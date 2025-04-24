import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  front_end_local_url: process.env.FRONT_END_LOCAL_URL,
  front_end_deployed_url: process.env.FRONT_END_DEPLOYED_URL,
  back_end_local_url: process.env.BACK_END_LOCAL_URL,
  back_end_deployed_url: process.env.BACK_END_DEPLOYED_URL,
  node_mailer_sender_email: process.env.NODE_MAILER_SENDER_EMAIL,
  node_mailer_app_password: process.env.NODE_MAILER_APP_PASSWORD,
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_password: process.env.SSL_STORE_PASSWORD,
};
