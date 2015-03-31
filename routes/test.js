/*Created by Hysky on 15/3/31.*/
var express = require('express');
var test = express.Router();
var User = require('../modules/users.js');
var Post = require('../modules/posts.js');
var ejs = require('ejs');

test.post('/test2', function (req, res) {
    console.log(req.body);
    res.send("test_OK");
});

module.exports = test;