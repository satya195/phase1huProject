import express from 'express';
import { configDotenv } from 'dotenv';
import { connectDB } from '../config/db.js';
import userRouter from '../routes/user.route.js';

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('connection is Live !!');
});
app.use('/api',userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

