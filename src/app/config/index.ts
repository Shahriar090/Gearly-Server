import { env } from './validateEnv';

export default {
	port: env.PORT,
	db_url: env.DB_URL,
	node_env: env.NODE_ENV,
	bcrypt_salt_round: env.BCRYPT_SALT_ROUND,
	access_token_secret: env.ACCESS_TOKEN_SECRET,
	access_token_expiry: env.ACCESS_TOKEN_EXPIRY,
	refresh_token_secret: env.REFRESH_TOKEN_SECRET,
	refresh_token_expiry: env.REFRESH_TOKEN_EXPIRY,
	cloudinary_cloud_name: env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: env.CLOUDINARY_API_SECRET,
	front_end_local_url: env.FRONT_END_LOCAL_URL,
	front_end_deployed_url: env.FRONT_END_DEPLOYED_URL,
	back_end_local_url: env.BACK_END_LOCAL_URL,
	back_end_deployed_url: env.BACK_END_DEPLOYED_URL,
	node_mailer_sender_email: env.NODE_MAILER_SENDER_EMAIL,
	node_mailer_app_password: env.NODE_MAILER_APP_PASSWORD,
	ssl_store_id: env.SSL_STORE_ID,
	ssl_store_password: env.SSL_STORE_PASSWORD,
};
