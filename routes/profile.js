/*Created by Hysky on 15/3/31.*/
var express = require('express');
var profile = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取用户信息
profile.get('/profile', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/profile', {
            title: "个人资料"
        });
    } else {
        res.redirect('redirect');
    }
});

module.exports=profile;