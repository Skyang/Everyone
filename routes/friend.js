/*Created by Hysky on 15/3/31.*/
var express = require('express');
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
            title: "好友列表",
            user: req.session.user,
            followingLink:"javascript:void(0)",
            followerLink:"/friend/follower",
            followingDisplay:"",
            followerDisplay:"none",
            followingActive:"active",
            followerActive:""
        });
    } else {
        res.redirect('redirect');
    }
});
friend.get('/friend/follower', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/friend', {
            title: "好友列表",
            user: req.session.user,
            followingLink:"/friend",
            followerLink:"javascript:void(0)",
            followingDisplay:"none",
            followerDisplay:"",
            followingActive:"",
            followerActive:"active"
        });
    } else {
        res.redirect('redirect');
    }
});

//获取好友数据
friend.get('/friend/getAllFriend', function (req, res) {
    if(chkLogin(req)){
        var userId=req.session.user.id;
        /*queryFriend.saveFollowing(userId,"test", function (err, friend) {
            if (err) {
                res.send(err);
            }
            res.send(friend);
        });*/
        User.getBasicInfoById(userId, function (err, friend) {
            if (err) {
                res.send(err);
            }
            console.log(friend);
            res.send(friend);
        })
    }
    return false;
});

//添加好友
friend.post(/\/friend\/addFollowing/, function (req, res) {
    if (chkLogin(req)) {
        var current_id = req.session.user.id;
        var following_id = req.query.following_id;
        var queryFriend=new User({});
        queryFriend.saveFollowing(current_id,following_id, function (err, friend) {
            if(err){
                res.send(err);
            }
            if(friend=="Error"){
                return res.send("Error");
            }
            console.log("Save Success!");
            console.log(friend);
            //在session中保存用户已关注的用户信息，以便搜索页面进行操作
            req.session.user.following.push(following_id);
            res.json({friend:friend});
        });
    }
});

//删除关注
friend.post(/\/friend\/deleteFollowing/, function (req, res) {
    if (chkLogin(req)) {
        var current_id = req.session.user.id;
        var following_id = req.query.following_id;
        var queryFriend=new User({});
        queryFriend.deleteFollowing(current_id,following_id, function (err, friend) {
            if(err){
                res.send(err);
            }
            console.log("Delete Success!");
            console.log(friend);
            req.session.user.following.splice(req.session.user.following.indexOf(following_id),1);
            res.json({friend:friend});
        });
    }
});

module.exports = friend;