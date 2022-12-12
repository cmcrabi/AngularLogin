const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user');

app.post('/api/signup', (req,res) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created',
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          error: error
        });
      })
    })
  });

  app.post('/api/login',(req, res) => {
    let foundUser;

    User.findOne({ email: req.body.email }).then(user => {

      if(!user)
      {
        return res.status(401).json({message: 'User not found', email: req.body.email});
      }
      foundUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result)
      {
        return res.status(401).json({message: 'Authentication failed'});
      }
      //Successful authentication
      const token = jwt.sign({email: foundUser.email, userId: foundUser._id },'my secret-key',{expiresIn: '1H'});
      res.status(200).json({token: token});
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({message: 'Authentication failed'});
    })
  });

  module.exports = app;
