/*
 * Set Route.
 */
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');
//检查是否已登录
var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取主页
router.get("/", function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/index.ejs', {
            title: "Everyone",
            user: req.session.user
        });
    } else {
        res.render('./nologin/index.ejs', {
            title: "Everyone"
        });
    }
});

//重定向
router.get('/redirect', function (req, res) {
    if (chkLogin(req)) {
        res.render('redirect', {
            title: "重定向中...",
            loginStatus: "已登录",
            redirectLink: "/",
            address: "主页"
        });
    } else {
        res.render('redirect', {
            title: "重定向中...",
            loginStatus: "未登录",
            redirectLink: "/login",
            address: "登录页"
        })
    }
});

//测试
router.post('/test', function (req, res) {
    console.log(req.body);
    res.send("test_OK");
});

module.exports = router;