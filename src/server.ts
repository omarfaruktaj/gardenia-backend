import http from 'http';
import app from './app/app';
import connectDB from './config/db';
import env from './config/env';

const server = http.createServer(app);

async function main() {
  try {
    await connectDB();
    server.listen(env.PORT, () => {
      console.log(`Server is listening on port ${env.PORT}`);
      console.info(`Go to home: http://localhost:${env.PORT}/`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

  server.close(() => {
    console.log('Server is closed due to unhandled rejection');
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception thrown:', error);

  server.close(() => {
    console.log('Server is closed due to uncaught exception');
    process.exit(1);
  });
});
