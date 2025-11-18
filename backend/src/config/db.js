const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      console.error('Please create a .env file in the backend directory with MONGODB_URI');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`); // Hide password
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 10000, // 10 seconds connection timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com');
    console.error('2. Click "Network Access" in the left sidebar');
    console.error('3. Click "Add IP Address" button');
    console.error('4. Click "Allow Access from Anywhere" (0.0.0.0/0) - for development only');
    console.error('   OR add your current IP address');
    console.error('5. Wait 1-2 minutes for changes to propagate');
    console.error('6. Restart the server');
    console.error('\n💡 Alternative: Use local MongoDB');
    console.error('   Change MONGODB_URI in .env to: mongodb://localhost:27017/studentmanagement');
    process.exit(1);
  }
};

module.exports = connectDB;

