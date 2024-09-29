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
});

export default env;
