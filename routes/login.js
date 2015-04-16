/*Created by Hysky on 15/3/31.*/
var crypto = require('crypto');
var express = require('express');
var login = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取登录页面
login.get("/login", function (req, res) {
    if (chkLogin(req)) {
        return res.redirect('redirect');
    }
    res.render("./nologin/login", {
        title: "登录Everyone"
    });
});

//登录页中点击登录
login.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.getById(req.body.id, function (err, user) {
        if (!user) {
            return res.redirect('/login');//用户不存在则跳转到登录页
        }
        //检查密码是否一致
        if (user.password != password) {
            return res.redirect('/login');//密码错误则跳转到登录页
        }
        //用户名密码都匹配后，将用户信息存入 session
        req.session.user = user;
        res.redirect('/');//登陆成功后跳转到主页
    });
});

//登出
login.get('/logout', function (req, res) {
    if (chkLogin(req)) {
        req.session.user = null;
        res.render("logout", {
            title: "登出",
            user: req.session.user
        });
    } else {
        return res.redirect('redirect');
    }

});

module.exports = login;