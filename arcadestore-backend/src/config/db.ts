import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('se conecto a mongo');
    } catch (err) {
        console.error('erro en mongo:', err);
        process.exit(1);
    }
};

export default connectDB;