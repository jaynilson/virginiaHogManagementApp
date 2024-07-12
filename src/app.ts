import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import { error } from 'console';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/json')
    .then(() => console.log("connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});