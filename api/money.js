var express = require('express');
var moneyApi = express.Router();
var bodyParser = require('body-parser');
moneyApi.use(bodyParser.urlencoded({ extended: false }));
moneyApi.use(bodyParser.json());

var Money = require('../models/Money');

moneyApi.post('/', (req, res, next) => {
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

        return res.status(200).json("Done");
    })
})

module.exports = moneyApi;