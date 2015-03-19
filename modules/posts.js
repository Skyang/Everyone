/**
 * Created by Hysky on 2015/2/27.
 */
var mongodb = require('./db');

function Post(post) {
    this.name = post.name;
    this.id = post.id;
    this.time = post.time;
    this.post = post.post;
}

module.exports = Post;

//存储用户发送的状态
Post.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的用户状态文档
    var post = {
        name: this.name,
        id: this.id,
        time: time,
        post: this.post
    };
    console.log("Post.save:" + post);
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 posts 集合
            collection.insert(post, {
                safe: true
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, post[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取发送的状态信息
Post.getById = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找登录名值为 id 一个文档
            collection.findOne({
                id: id
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, post);//成功！返回查询的用户信息
            });
        });
    });
};