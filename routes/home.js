/*Created by Hysky on 15/3/31.
 *这是用户的个人首页页面，url为/u/:id
 */
var express = require('express');
var users = express.Router();
var User = require('../modules/users.js');
var Post = require('../modules/posts.js');
var ejs = require('ejs');

users.get('/u/', function (req, res, next) {
    res.send("1");
});

users.get('/u/:id', function (req, res, next) {
    var userId = req.params.id;
    res.render('./home.ejs', {
        title: userId + "'s Home",
        user: req.session.user
    });
});
users.get('/userData/:id', function (req, res) {
    var userId = req.params.id;
    var queryPost = new Post({});
    User.getBasicInfoById(userId, function (err, user) {
        if (err) {
            res.send(err);
        }
        queryPost.getById(user.id, function (err, postCollection) {
            res.json({
                user: user,
                posts: postCollection
            })
        });
    });
});

module.exports = users;