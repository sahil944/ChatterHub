const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://sahilkhunt20:lUABvLViSTbPmqZw@cluster0.fvlllpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const conn = await mongoose.connect(MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
