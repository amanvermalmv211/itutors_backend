import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userauth from './routes/userauth.js';
import adminwork from './routes/superadmin.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to iTutors backend services...")
});

app.use('/userauth', userauth);
app.use('/admin', adminwork);

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("Connected successfully");
        app.listen(process.env.PORT, () => {
            console.log(`App is listenging to port: http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error)
    });