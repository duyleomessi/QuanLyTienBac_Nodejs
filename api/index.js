var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("Api trang quản lý tiền tiêu trong tháng của tác giả");
});

module.exports = router;
