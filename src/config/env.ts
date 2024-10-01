import { cleanEnv, num, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  MONGO_URI: str({
    default: 'mongodb://127.0.0.1:27017/gardenia',
  }),
  ACCESS_TOKEN_SECRET: str(),
  ACCESS_TOKEN_EXPIRE: str({ default: '1h' }),
  REFRESH_TOKEN_SECRET: str(),
  REFRESH_TOKEN_EXPIRE: str({ default: '7d' }),
  JWT_COOKIE_EXPIRES_IN: num({ default: 7 }),
  EMAIL_HOST: str(),
  EMAIL_PORT: num(),
  EMAIL_USERNAME: str(),
  EMAIL_PASSWORD: str(),
  EMAIL_FROM: str(),
  RESET_TOKEN_CLIENT_URL: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  STRIPE_SECRET_KEY: str(),
  FRONTEND_URL: str({
    default: 'http://localhost:3000',
  }),
});

export default env;
