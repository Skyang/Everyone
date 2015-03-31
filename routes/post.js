/*Created by Hysky on 15/3/31.*/
var crypto = require('crypto');
var express = require('express');
var post = express.Router();
var User = require('../modules/users.js');
var Post = require('../modules/posts.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取到全部的已发送状态
post.get('/post', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/post', {
            title: "发送状态",
            user: req.session.user
        });
    } else {
        res.redirect('redirect');
    }
});

//发送状态请求
post.post('/post', function (req, res) {
    console.log("Begin post");
    var name = req.session.user.name,
        id = req.session.user.id,
        object = req.body.object,
        content = req.body.content;
    var newPost = new Post({
        name: name,
        id: id,
        object: object,
        content: content
    });
    newPost.save(function (err, post) {
        if (err) {
            return res.redirect('/post');//发送失败返回发送页
        }
        res.send("success");  //发表成功后返回主页;
    });
});

//获取用户信息
post.get('/profile', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/profile', {
            title: "个人资料"
        });
    } else {
        res.redirect('redirect');
    }
});

//获取用户已发送的状态
post.get('/data', function (req, res) {
    if (chkLogin(req)) {
        var id = req.session.user.id;
        var postsCollection = new Post({
            id: id
        });
        postsCollection.getById(id, function (err, postcollection) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            /*if (postcollection) {
             postcollection.forEach(function (element, i) {
             delete postcollection[i]._id;
             });*/
            /*for(var i=0;i<length;i++){
             delete postcollection[i]._id;
             }*/
            res.send(postcollection);
            //}
        })
    }
});

module.exports = post;