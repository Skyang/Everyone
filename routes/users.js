/*Created by Hysky on 15/3/31.*/
/*这是用户的个人首页页面，url为/:users*/
var express = require('express');
var users = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');



module.exports=users;