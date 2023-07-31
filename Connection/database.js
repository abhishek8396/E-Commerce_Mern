import mongoose from "mongoose"
import colors from "colors"
const connectDB= async()=>{
    try {
        const connect = await mongoose.connect("mongodb+srv://abhishekmedia1289:Naman1289@projectdb.2rgftop.mongodb.net/E-commerce")
        console.log(`Connected to MongoDB Database ${connect.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in mongoDB ${error}`.bgBlue.white)
    }
}
export default connectDB;