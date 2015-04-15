/*Created by Hysky on 15/3/31.*/
var express = require('express');
var friend = express.Router();
var User = require('../modules/users.js');
var Friend = require('../modules/friends.js');
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
            title: "好友列表"
        });
    } else {
        res.redirect('redirect');
    }
});

//添加好友
friend.post('/friend/addFollowing/:following_id', function (req, res) {
    if (chkLogin(req)) {
        var current_id = req.session.user.id;
        var following_id = req.params.following_id;
    }
});

module.exports = friend;