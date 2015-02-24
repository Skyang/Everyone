/*
 * GET home page.
 */
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/users.js');
var ejs = require('ejs');
router.get("/", function (req, res) {
    console.log(req.session);
    res.render('index',{
        title:"Everyone",
        user:req.session.user
    });
});
/*router.get('/login', function (req, res,next) {
    if(req.session.user){
        return res.redirect("back");
    }
    next();
});*/
router.get('/redirect',function(req,res){
    res.render('redirect',{
        title:"Everyone"
    });
});
router.get("/login",function(req,res){
    if(req.session.user){
        return res.redirect('redirect');
    }
    res.render("login",{
        title:"登录Everyone"
    });
});
router.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.getById(req.body.id, function (err, user) {
        console.log(user);
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
router.get('/register', function (req, res) {
    res.render('register',{
        title:"注册Everyone"
    });
});
router.post('/register', function (req, res) {
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
            console.log("newUser:"+user);
            console.log("req.session(Before):"+req.sessions);
            req.session.user = user;//用户信息存入 session
            console.log("req.session(After):"+req.sessions);
            //req.session.messages = ['success', '注册成功!'];
            //req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        });
    });
});
router.get('/logout', function (req, res) {
    req.session.user=null;
    res.render("logout",{
        title:"登出",
        user:req.session.user
    });
});
router.post('/post',function(req,res){

});
router.get('/blog', function (req, res) {
    res.render('blog');
});
router.get('/profile', function (req, res) {
    res.render('blog');
});

module.exports = router;
