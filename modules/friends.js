/*Created by Hysky on 15/3/27.*/
var mongodb = require('./db');

function Friend(following, follower) {
    this.following = following;
    this.follower = follower;
}

module.exports = Friend;

Friend.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var follower = {
        following: this.following,
        follower: this.follower
    };
    console.log("Follower.save:" + follower);
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('friends', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(follower, {
                safe: true
            }, function (err, follower) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, follower[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

Friend.getByFollowing = function (following, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('friends', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找登录名值为 id 一个文档
            collection.find({
                following: following
            }).toArray(function (err, friends) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, friends);//成功！返回查询的用户信息
            });
        });
    });
};

Friend.getByFollower = function (follower, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('friends', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找登录名值为 id 一个文档
            collection.find({
                follower: follower
            }).toArray(function (err, friends) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, friends);//成功！返回查询的用户信息
            });
        });
    });
};