import mongoose from 'mongoose';

/**
 * Placeholder database connection.
 *
 * This function logs the MongoDB connection URL from the environment.  When
 * you are ready to enable the database, uncomment the connection code
 * below and ensure MongoDB is running at the specified URL.
 */
const connectDB = async () => {
  const dbUrl = process.env.DB_URL;
  try {
    // Currently we only log the URL instead of connecting, since
    // the MVP does not yet require a database.  When you are ready
    // to connect, remove this log and uncomment the code below.
    console.log('MongoDB connection placeholder. URL:', dbUrl);
    // await mongoose.connect(dbUrl, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

export default connectDB;