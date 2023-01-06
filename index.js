import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import form from './routes/form.js';

const app = express()
app.use(cors());
app.use(express.json());


// Initialize routes middleware
app.use('/api/form', form);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(process.env.PORT || process.env.API_PORT, () => {
  console.log(`Example app listening on port ${process.env.API_PORT}`)
})





