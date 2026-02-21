const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment (.env).');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('message:', error.message);
    console.error('stack:', error.stack);
    console.error('Mongoose readyState:', mongoose.connection.readyState);
    process.exit(1);
  }
};

module.exports = connectDB;
