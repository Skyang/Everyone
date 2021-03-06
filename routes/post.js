/*Created by Hysky on 15/3/31.*/
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
    if (!chkLogin(req)) {
        return false;
    }
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

//获取用户已发送的状态
post.get('/data', function (req, res) {
    if (chkLogin(req)) {
        var id = req.session.user.id;
        var postsCollection = new Post({
            id: id
        });
        postsCollection.getById(id, function (err, postcollection) {
            if (err) {
                res.send(err);
            }
            res.send(postcollection);
        })
    }
});

//用户时间线:
post.get('/timeline', function (req, res) {
    if (chkLogin(req)) {
        var uid = req.session.user.id;
        var followingList = req.session.user.following;
        var num = 10;
        var page = req.query.page - 1;
        var postsCollection = new Post({});
        postsCollection.getByTimeline(uid, followingList, num, page, function (err, postcollection) {
            if (err) {
                res.send(err);
            }
            res.send(postcollection);
        })
    }
});

//获取单个post详情
post.get('/:user/:_id', function (req, res, next) {
    //console.log(req.params);//通过req.params.user,req.params.id访问
    var userId = req.params.user, _id = req.params._id;
    //判断是否格式正确，若不正确，执行下一个路由
    if (!(_id.length == 24 && (/[a-z0-9A-Z]/g).test(_id))) {
        return next();
    }
    var queryPost = new Post({});
    queryPost.getByPid(userId, _id, function (err, postcollection) {
        if (err) {
            res.send(err);
        }
        if (postcollection.length && postcollection.length != 0) {
            res.render('./detail.ejs', {
                post: postcollection[0],
                title: "Detail",
                user: req.session.user
            });
        } else {
            res.render('error', {
                message: 404,
                error: err
            });
        }
    });
});

//发表评论
post.post('/post/submitComment', function (req, res) {
    if (!chkLogin(req)) {
        return false;
    }
    var commentUserID = req.session.user.id;
    var commentUserAvatar = req.session.user.avatar;
    var comment = req.body.comment;
    var _pid = req.body.pid;
    var queryPost = new Post({});
    queryPost.saveComment(_pid, commentUserID, commentUserAvatar, comment, function () {
        res.send("Comment Success");
    })
});

module.exports = post;