import mongoose from "mongoose";

export const connectDB  = async() => {
 try{
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`Connected Successfully ${conn.connection.host}`)
 }catch(error){
     console.log("Error connecting to Db" , error);
     process.exit(1);  // one means failure 
 }
 
}