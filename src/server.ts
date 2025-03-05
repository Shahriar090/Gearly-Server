import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';
const PORT = config.port || 3000;
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('🚀 Database Connected Successfully');

    server = app.listen(PORT, () => {
      console.log(
        `🚀 Gearly Server Is Listening On Port => http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error('❌ Failed To Connected With Database', err);
    process.exit(1);
  }
}

main();

// asynchronous operation error handling
process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection. Shutting Down');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// synchronous operation error handling
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting Down');
  console.log(err);
  process.exit(1);
});
