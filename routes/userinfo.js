/*Created by Hysky on 15/4/29.*/
var express = require('express');
var userinfo = express.Router();
var User = require('../modules/users.js');
//获取关注者的全部信息
userinfo.get('/getFollowingUserInfo', function (req, res) {
    var userIds = req.query.uids;
    if (!userIds) {
        return res.send("Error");
    }
    userIds = userIds.split(",");
    var userInfo = [];
    var i = 0;
    var queryInfo = function (i, userIds) {
        if (i >= userIds.length) {
            return res.send(userInfo);
        }
        User.getBasicInfoById(userIds[i], function (err, user) {
            if (!user) {
                return "Query Error";
            }
            userInfo.push(user);
            console.log(userInfo);
            i++;
            queryInfo(i, userIds);
        })
    };
    queryInfo(i, userIds);
});

userinfo.get('/getFollowerUserInfo', function (req, res) {
    var userIds = req.query.uids;
    if (!userIds) {
        return res.send("Error");
    }
    userIds = userIds.split(",");
    var userInfo = [];
    var i = 0;
    var queryInfo = function (i, userIds) {
        if (i >= userIds.length) {
            return res.send(userInfo);
        }
        User.getBasicInfoById(userIds[i], function (err, user) {
            if (!user) {
                return "Query Error";
            }
            userInfo.push(user);
            console.log(userInfo);
            i++;
            queryInfo(i, userIds);
        })
    };
    queryInfo(i, userIds);
});

//搜索用户页面
userinfo.get('/search', function (req, res) {
    if (!req.session.user) {
        return res.redirect("/redirect");
    }
    var searchInfo = req.query.user;
    var followingList = req.session.user.following;
    console.log(followingList);
    var searchResultByID = {};
    var isFollowing = false;
    var searchResultByName = {};

    function searchUsers(searchInfo) {
        User.getBasicInfoById(searchInfo, function (err, user) {
            console.log("ID Search Return:");
            console.log(user);
            if (user) {
                if (followingList.indexOf(user.id) >= 0) {
                    isFollowing = true;
                } else {
                    isFollowing = false;
                }
                searchResultByID.isFollowing = isFollowing;
                searchResultByID.user = user;
            }
            console.log("searchResultByID");
            console.log(searchResultByID);
            User.getBasicInfoByName(searchInfo, function (err, users) {
                console.log("Name Search Return:");
                console.log(users);
                if (users) {
                    for (var i = 0; i < users.length; i++) {
                        if (followingList.indexOf(users[i].id) >= 0) {
                            isFollowing = true;
                        } else {
                            isFollowing = false;
                        }
                        searchResultByName[i] = {
                            isFollowing: isFollowing,
                            user: users[i]
                        }
                    }
                }
                console.log("searchResultByName");
                console.log(searchResultByName);
                res.render('./search.ejs', {
                    title: "Search Result",
                    searchResultByID: searchResultByID,
                    searchResultByName: searchResultByName,
                    user: req.session.user
                });
            });
        });
    }

    searchUsers(searchInfo);
});

module.exports = userinfo;