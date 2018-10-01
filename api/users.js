var express = require("express");
var userApi = express.Router();
var bodyParser = require("body-parser");
userApi.use(bodyParser.urlencoded({
  extended: false
}));
userApi.use(bodyParser.json());

var User = require("../models/User");
var Money = require("../models/Money");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var verifyToken = require('../middleware/verifyToken');

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

userApi.post("/register", (req, res, next) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  User.findOne({
    email: newUser.email
  }, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({message: "There is error in checking if email existed or not"});
    }
    if (result) {
      return res.status(409).json({message: "The email is already exist"});
    } else {
      newUser.save((err, user) => {
        if (err) {
          return res.status(500).json({message: err});
        } else {
          var token = jwt.sign({
            id: user._id
          }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).json({
            message: "User is created",
            token: token
          });
        }
      });
    }
  });
});

userApi.post("/login", (req, res, next) => {
  console.log(req.body.email);
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({message: err});
    }

    if (!user) {
      console.log('Email not found');
      return res.status(404).json({message: "The email is not found"});
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      console.log('Password is incorrect');
      return res.status(401).json({message: "Password is incorrect"});
    } else {
      console.log("login s")
      var token = jwt.sign({
        id: user._id
      }, process.env.SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res
        .status(200)
        .json({
          message: "User loggin successfully",
          token: token
        });
    }
  });
});

userApi.get('/activities', verifyToken, (req, res, next) => {
  User.findById(req.userId)
    .populate('activities')
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }

      return res.status(200).json(user.activities)
    })
})

userApi.get('/activities/month/:id', verifyToken, (req, res, next) => {
  const month = req.params.id;
  console.log(req.userId);
  User.findById(req.userId)
    .populate({
      path: 'activities',
      match: { month: {$eq: month}}
    })
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }

      return res.status(200).json(user.activities)
    })
})

userApi.post('/activity', verifyToken, (req, res, next) => {
  var newActivity = new Money({
    type: req.body.type,
    amount: req.body.amount,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year
  })

  newActivity.save((err, activity) => {
    if (err) {
      console.log(err);
      return res.status(500).json({message: err});
    } 
    var activityId = activity._id;
    User.findById(req.userId)
      .exec((err, user) => {
        if (err) {
          return res.status(500).json({message: err});
        }
        user.activities.push(activityId);
        user.save((err) => {
          if (err) {
            return res.status(500).json({message: err});
          }
          return res.status(201).json({message: "Success to save activity"});
        })
      })
  })
})

module.exports = userApi;