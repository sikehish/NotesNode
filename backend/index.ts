import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(morgan('dev'));

//Body parser
app.use(express.json())

// // Routes
// app.use('/api/users', userRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/entities', entityRouter) //Getting all entities(categories,subjects,topics,quizzes)

const uri = process.env.MONGO_URI || ""
const PORT = process.env.PORT || 3000;

// Middleware for unhandled routes
app.all('*', (req, res) => {
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
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });
