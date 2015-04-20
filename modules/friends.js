/*Created by Hysky on 15/3/27.*/
var mongodb = require('./db');

function Friend(friend) {
    this.id = friend.id;
    this.following = friend.following;
    this.follower = friend.follower;
}

module.exports = Friend;

Friend.prototype.init = function (callback) {
    var friend = {
        id: this.id,
        following: [],
        follower: []
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 friends 集合
        db.collection('friends', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 friends 集合
            collection.insert(friend, {
                safe: true
            }, function (err, friend) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, friend[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

var save

Friend.prototype.saveFollower = function (currentId, targetId, callback) {
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
            //将用户数据插入 friends 集合
            collection.update({
                id: currentId
            }, {
                $push: {
                    follower:targetId
                }
            }, function (err, friend) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, friend);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

Friend.prototype.getById = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 friends 集合
        db.collection('friends', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户id为 id 的一个文档
            collection.find({
                id: id
            }).toArray(function (err, friends) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, friends[0]);//成功！返回查询的用户信息
            });
        });
    });
};