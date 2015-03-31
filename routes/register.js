/*Created by Hysky on 15/3/31.*/
var crypto = require('crypto');
var express = require('express');
var register = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};
//获取到注册页面
register.get('/register', function (req, res) {
    if (chkLogin(req)) {
        res.redirect('redirect');
    } else {
        res.render('./nologin/register', {
            title: "注册Everyone"
        });
    }
});

//注册页中点击注册
register.post('/register', function (req, res) {
    var name = req.body.name,
        id = req.body.id,
        password = req.body.password,
        passwordRepeat = req.body['passwordRepeat'],
        email = req.body.email;
    //检验用户两次输入的密码是否一致
    if (passwordRepeat != password) {
        //req.session.messages = ['error', '两次输入的密码不一致!'];
        //req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/register');//返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        id: id,
        password: password,
        email: email
    });
    //检查用户名是否已经存在
    User.getById(newUser.id, function (err, user) {
        if (err) {
            //req.session.messages = ['error', err];
            //req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            //req.session.messages = ['error', '用户已存在!'];
            //req.flash('error', '用户已存在!');
            return res.redirect('/register');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                //req.session.messages = ['error', err];
                //req.flash('error', err);
                return res.redirect('/register');//注册失败返回主册页
            }
            /*console.log("newUser:"+user);
             console.log("req.session(Before):"+req.sessions);*/
            req.session.user = user;//用户信息存入 session
            //console.log("req.session(After):"+req.sessions);
            //req.session.messages = ['success', '注册成功!'];
            //req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        });
    });
});

module.exports = register;