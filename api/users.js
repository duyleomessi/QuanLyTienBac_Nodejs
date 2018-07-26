var express = require("express");
var userApi = express.Router();
var bodyParser = require("body-parser");
userApi.use(bodyParser.urlencoded({ extended: false }));
userApi.use(bodyParser.json());

var User = require("../models/User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

  User.findOne({ email: newUser.email }, (err, result) => {
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
          var token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).json({ message: "User is created", token: token });
        }
      });
    }
  });
});

userApi.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(500).json("There is error on finding email");
    }

    if (!user) {
      return res.status(404).json("The email is not found");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json("Password is incorrect");
    } else {
      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      res
        .status(200)
        .json({ message: "User loggin successfully", token: token });
    }
  });
});

module.exports = userApi;
