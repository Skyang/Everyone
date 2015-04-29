/*Created by Hysky on 15/4/29.*/
var express = require('express');
var userinfo = express.Router();
var User = require('../modules/users.js');

userinfo.get('/getFollowingUserInfo', function (req, res) {
    var userIds = req.query.uids;
    if(!userIds){
        return res.send("Error");
    }
    userIds=userIds.split(",");
    var userInfo = {};
    var i = 0;
    var queryInfo = function (i, userIds) {
        if (i >= userIds.length) {
            return res.send(userInfo);
        }
        User.getBasicInfoById(userIds[i], function (err, user) {
            if (!user) {
                return "Query Error";
            }
            userInfo[i] = user;
            console.log(userInfo);
            i++;
            queryInfo(i, userIds);
        })
    };
    queryInfo(i, userIds);
});

userinfo.get('/getFollowerUserInfo', function (req, res) {
    var userIds = req.query.uids;
    if(!userIds){
        return res.send("Error");
    }
    userIds=userIds.split(",");
    var userInfo = {};
    var i = 0;
    var queryInfo = function (i, userIds) {
        if (i >= userIds.length) {
            return res.send(userInfo);
        }
        User.getBasicInfoById(userIds[i], function (err, user) {
            if (!user) {
                return "Query Error";
            }
            userInfo[i] = user;
            console.log(userInfo);
            i++;
            queryInfo(i, userIds);
        })
    };
    queryInfo(i, userIds);
});

module.exports = userinfo;