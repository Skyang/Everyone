/*Created by Hysky on 15/3/31.*/
var crypto = require('crypto');
var express = require('express');
var profile = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

var chkLogin = function (req) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

//获取用户信息
profile.get('/profile', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/profile', {
            title: "个人资料",
            user: req.session.user
        });
    } else {
        res.redirect('redirect');
    }
});

//更改用户信息
profile.post('/profile/updateProfile', function (req, res) {
    if (chkLogin(req)) {
        console.log("Begin update profile...");
        /*数据格式为：
         {
         id:"id",
         name: 'fuokusu',
         email: '123@qq.com',
         password: 'test',
         passwordRepeat: 'te'
         }
         */
        var updateProfileData = req.body;
        updateProfileData.id = req.session.user.id;
        console.log(updateProfileData);
        if (updateProfileData.password != updateProfileData.passwordRepeat) {
            res.send("PwdNotSame");
        }
        var newUser = new User({});
        var md5 = crypto.createHash('md5');
        updateProfileData.password = md5.update(updateProfileData.password).digest('hex');
        newUser.updateProfile(updateProfileData, function (user) {
            console.log(user);
            req.session.user = null;
            res.send("Success");
        });
    } else {
        res.send("Error");
    }
});

module.exports = profile;