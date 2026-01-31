const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')
const router = require('./routes/route');
const webRouter = require('./routes/webRoute');
const linkRouter = require('./routes/linkRoute');

const connectDB = require('./database/DB');
const imgRouter = require('./routes/imgRoute');

dotenv.config();

const port = process.env.PORT;

connectDB();

app.listen(port, ()=>{
    console.log(`Server is Running on Port ${port}`);   
});

app.use(express.json());
// app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use('/', router);
app.use('/', webRouter);
app.use('/', linkRouter);
app.use('/', imgRouter);