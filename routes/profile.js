/*Created by Hysky on 15/3/31.*/
var crypto = require('crypto');
var express = require('express');
var profile = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');
var fs = require('fs');
var multipart = require('connect-multiparty');
var path = require('path');

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

profile.post('/profile/updateAvatar', multipart(), function (req, res) {
    var filename = req.session.user._id+".png";
    console.log("filename --->");
    console.log(filename);
    //copy file to a public directory
    //注意这里的路径问题否则会报错：Error: ENOENT, open 'path'
    var targetPath = './public/images/Avatar/' + filename;
    var avatarPath="./images/Avatar/"+filename;
    console.log("targetPath --->");
    console.log(targetPath);
    //copy file
    fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
    //return file url
    var tmpUser=new User({});
    tmpUser.updateAvatar(req.session.user.id,avatarPath, function () {
        req.session.user.avatar=avatarPath;
        res.send("Success");
    });
});

//这是测试上传文件，以备未来使用维护
/*profile.post('/upload', multipart(), function(req, res){
    console.log(req.session.user._id);
    console.log(req.body);
    console.log(req.files);
    //get filename
    //var filename = req.session.user._id+".png";
    var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
    console.log("filename --->");
    console.log(filename);
    //copy file to a public directory
    //注意这里的路径问题否则会报错：Error: ENOENT, open 'path'
    var targetPath = './public/images/Avatar/' + filename;
    console.log("targetPath --->");
    console.log(targetPath);
    //copy file
    fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
    //return file url
    res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
});*/
module.exports = profile;