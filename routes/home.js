/*Created by Hysky on 15/3/31.
 *这是用户的个人首页页面，url为/u/:id
 */
var express = require('express');
var users = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');

users.get('/u/:id', function (req, res, next) {
    var userId=req.params.id;
    User.getBasicInfoById(userId,function (err, user) {
        if(err){
            res.send(err);
        }
        console.log(user);
        res.render('./home.ejs');
    });
});

module.exports=users;