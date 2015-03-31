/*Created by Hysky on 15/3/31.*/
var express = require('express');
var crypto = require('crypto');
var friend = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取好友界面
friend.get('/friend', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/friend', {
            title: "朋友列表"
        });
    } else {
        res.redirect('redirect');
    }
});

module.exports = friend;