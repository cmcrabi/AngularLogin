const express = require('express');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
const path = require('path');


const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://rabi:4a5XfsdyokS49l3q@cluster0.m9dqg.mongodb.net/posts-db?retryWrites=true&w=majority')
.then(()=> {
    console.log('Connected to database');
})
.catch(()=>{
    console.log('Connection failed');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
})

app.get('/',(req,res) => {
  res.sendFile(path.resolve('./backend/hello.html'));
})


app.get('/api/welcome', (req, res)=> {
  res.status(200).json({
    message: 'Welcome from express',
    status: 'OK'
  });
})

app.use(postsRoutes);
app.use(authRoutes);

module.exports = app;
