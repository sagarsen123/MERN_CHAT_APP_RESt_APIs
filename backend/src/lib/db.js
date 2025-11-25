import mongoose from "mongoose"

const connectToDb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_CONNECTION_URI)
        console.log(`MongoDb connected to host ${conn.connection.host}`)
    }catch(error) {
        console.log(`MongoDb error ${error}`)
    }
}

export default connectToDb;