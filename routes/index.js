/*
 * Set Route.
 */
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/users.js');
var Post = require('../modules/posts.js');
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
/*router.get('/login', function (req, res,next) {
 if(req.session.user){
 return res.redirect("back");
 }
 next();
 });*/

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

//获取登录页面
router.get("/login", function (req, res) {
    if (chkLogin(req)) {
        return res.redirect('redirect');
    }
    res.render("./nologin/login", {
        title: "登录Everyone"
    });
});

//登录页中点击登录
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

//获取到注册页面
router.get('/register', function (req, res) {
    if (chkLogin(req)) {
        res.redirect('redirect');
    } else {
        res.render('./nologin/register', {
            title: "注册Everyone"
        });
    }

});

//注册页中点击注册
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

//登出
router.get('/logout', function (req, res) {
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

//获取到全部的已发送状态
router.get('/post', function (req, res) {
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
router.post('/post', function (req, res) {
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
router.get('/profile', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/profile', {
            title: "个人资料"
        });
    } else {
        res.redirect('redirect');
    }
});

//获取用户已发送的状态
router.get('/data', function (req, res) {
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

//获取好友界面
router.get('/friend', function (req, res) {
    if (chkLogin(req)) {
        res.render('./logined/friend', {
            title: "朋友列表"
        });
    } else {
        res.redirect('redirect');
    }
});
//测试
router.post('/test', function (req, res) {
    console.log(req.body);
    res.send("test_OK");
});

module.exports = router;