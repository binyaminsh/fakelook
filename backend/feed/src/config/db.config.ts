import mongoose from "mongoose";

const dbConnection = async () => {
  const DB_URL = process.env.DATA_BASE_URL ?? '';
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    throw new Error('Connection to data base failed.')
  }
};
export default dbConnection;
