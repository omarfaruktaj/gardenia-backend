import { cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  MONGO_URI: str(),
});

export default env;
