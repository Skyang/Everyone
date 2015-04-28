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
            title: "好友列表",
            user: req.session.user
        });
    } else {
        res.redirect('redirect');
    }
});

//获取好友数据
friend.post('/friend/getAllFriend', function (req, res) {
    if(chkLogin(req)){
        var userId=req.session.user.id;
        var queryFriend=new Friend({});
        /*queryFriend.saveFollower(userId,"test", function (err, friend) {
            if (err) {
                res.send(err);
            }
            res.send(friend);
        });*/
        queryFriend.getById(userId, function (err, friend) {
            if (err) {
                res.send(err);
            }
            console.log(friend);
            res.send(friend);
        })
    }
});

//添加好友
friend.post(/\/friend\/addFollowing/, function (req, res) {
    if (chkLogin(req)) {
        var current_id = req.session.user.id;
        var following_id = req.query.following_id;
        var queryFriend=new Friend({});
        queryFriend.saveFollower(current_id,following_id, function (err, friend) {
            if(err){
                res.send(err);
            }
            console.log("Save Success!");
            console.log(friend);
            res.send(friend);
        });
    }
});

//删除好友
friend.post(/\/friend\/deleteFollowing/, function (req, res) {
    if (chkLogin(req)) {
        var current_id = req.session.user.id;
        var following_id = req.query.following_id;
        var queryFriend=new Friend({});
        queryFriend.deleteFollower(current_id,following_id, function (err, friend) {
            if(err){
                res.send(err);
            }
            console.log("Delete Success!");
            console.log("Friend is..");
            console.log(friend);
            res.send(friend);
        });
    }
});

module.exports = friend;