var express = require('express');
var moneyApi = express.Router();
var bodyParser = require('body-parser');
moneyApi.use(bodyParser.urlencoded({ extended: false }));
moneyApi.use(bodyParser.json());

var Money = require('../models/Money');
var verifyToken = require('../middleware/verifyToken');

// add activity
moneyApi.post('/', verifyToken, (req, res, next) => {
    var newActivity = new Money({
        type: req.body.type,
        amount: req.body.amount,
        day: req.body.day,
        month: req.body.month,
        year: req.body.year
    })

    newActivity.save((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json("There were error while saving activity");
        } 

        return res.status(201).json("Done");
    })
})

// get all activity
moneyApi.get('/', verifyToken, (req, res, next) => {
    Money.find({})
        .sort({year: -1, month: -1, day: -1, updated: -1})
        .exec((err, activities) => {
            if (err) {
                console.log(err);
                return res.status(500).json("There were error while finding all activity");
            }

            return res.status(200).json(activities); 
        })
})


module.exports = moneyApi;