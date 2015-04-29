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

//保存关注者，回调用到
Friend.prototype.saveFollower = function (currentId, targetId, callback) {
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
            //将用户新关注 push 到 friends 集合
            collection.find({
                id: currentId
            }).toArray(function (err, friends) {
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                var index = friends[0].follower.indexOf(targetId);
                if (index < 0) {
                    collection.update({
                        id: currentId
                    }, {
                        $push: {
                            follower: targetId
                        }
                    }, function (err, friend) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//错误，返回 err 信息
                        }
                        callback(null, friend);//成功！err 为 null，并返回存储后的用户文档
                    });
                } else {
                    mongodb.close();
                    callback(null, "Error");
                }
            });
        });
    });
};

//删除一个关注
Friend.prototype.deleteFollower = function (currentId, targetId, callback) {
    var needToModify;
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
            collection.find({
                id: currentId
            }).toArray(function (err, friends) {
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                needToModify = friends[0].follower;
                //在数组中删除特定的一项targetId
                var index = needToModify.indexOf(targetId);
                if (index < 0) {
                    return callback(err);
                }
                needToModify.splice(index, 1);
                collection.update({"id": currentId},
                    {
                        $set: {
                            follower: needToModify
                        }
                    }, function (err, friend) {
                        mongodb.close();
                        if (err) {
                            return callback(err);//错误，返回 err 信息
                        }
                        callback(null, friend);
                    });
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