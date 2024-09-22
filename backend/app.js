import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from "./routes/admin.js";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.options('*', cors(corsOptions));
dotenv.config();
app.use('/admin',admin)
connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {
  res.send('MERN Backend is running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
