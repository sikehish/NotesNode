import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer, { StorageEngine } from 'multer'; // Import necessary Multer types
dotenv.config();

import adminRouter from './routes/adminRouter';
import userRouter from "./routes/userRouter"

const app = express();

app.use(morgan('dev'));

// Body parser
app.use(express.json({limit:'100mb'}));

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

const uri = process.env.MONGO_URI || '';
const PORT = process.env.PORT || 3000;

// Middleware for unhandled routes
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `The API endpoint ${req.url} does not exist!`,
  });
});


mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
