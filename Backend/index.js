import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000 ;

app.use(express.json()); //used to parse the incoming data to req.body
app.use(cookieParser()); // allow us to parse incoming cookies


app.use('/api/auth',authRoutes);

//only run the application after connecting to the database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on : http://localhost:${PORT}`);
    })
})










