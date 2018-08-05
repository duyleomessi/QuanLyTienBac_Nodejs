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
        .json("There is error in checking if email existed or not");
    }
    if (result) {
      return res.status(409).json("The email is already exist");
    } else {
      newUser.save((err, user) => {
        if (err) {
          return res.status(500).json("There is error in creating new user");
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
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      return res.status(500).json("There is error on finding email");
    }

    if (!user) {
      return res.status(404).json("The email is not found");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json("Password is incorrect");
    } else {
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
          message: "Error in getting activities of user"
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
      return res.status(500).json("There were error while saving activity");
    } 
    var activityId = activity._id;
    User.findById(req.userId)
      .exec((err, user) => {
        if (err) {
          return res.status(500).json("Error while finding user");
        }
        user.activities.push(activityId);
        user.save((err) => {
          if (err) {
            return res.status(500).json("Error while saving activity");
          }
          return res.status(201).json("Success to save activity");
        })

      })

  })
})

module.exports = userApi;