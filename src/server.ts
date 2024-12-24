import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('🚀 Database Connected Successfully');

    app.listen(config.port, () => {
      console.log(`🚀 Gearly Server Is Listening On Port => ${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed To Connected With Database', err);
    process.exit(1);
  }
}

main();
