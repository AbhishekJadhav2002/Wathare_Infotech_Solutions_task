
import mongoose from 'mongoose';

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log('Pinged. You successfully connected to MongoDB!')
        mongoose.connection.on('disconnected', err => {
            console.log('Mongoose default connection disconnected: ', err)
            process.exit(1)
        })
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error)
        await mongoose.connection.close()
        process.exit(1)
    }
}

export default connectDatabase;