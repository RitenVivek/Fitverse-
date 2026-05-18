const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  Could not connect to MongoDB at ${process.env.MONGODB_URI}`);
    console.log('🔄 Starting in-memory MongoDB server...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('💡 Note: Data will NOT persist after server restart.');
      console.log('💡 For persistent data, install MongoDB locally or use MongoDB Atlas.');
    } catch (memError) {
      console.error(`❌ MongoDB Connection Failed: ${error.message}`);
      console.error('💡 Install MongoDB locally or set MONGODB_URI to a MongoDB Atlas URI in .env');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
