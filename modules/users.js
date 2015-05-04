/**
 * Created by Hysky on 2015/1/6.
 */
var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.id = user.id;
    this.password = user.password;
    this.email = user.email;
    this.following = [];
    this.follower = [];
}

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        id: this.id,
        password: this.password,
        email: this.email,
        avatar:"/images/Avatar/defaultAvatar.png",
        follower: [],
        following: []
    };
    (function (user) {
        console.log("userSave running...");
        //打开数据库
        mongodb.open(function (err, db) {
            if (err) {
                return callback(err);//错误，返回 err 信息
            }
            //读取 users 集合
            db.collection('users', function (err, collection) {
                if (err) {
                    mongodb.close();
                    return callback(err);//错误，返回 err 信息
                }
                //将用户数据插入 users 集合
                collection.insert(user, {
                    safe: true
                }, function (err, user) {
                    mongodb.close();
                    if (err) {
                        return callback(err);//错误，返回 err 信息
                    }
                    console.log("userSave Success!");
                    callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
                });
            });
        });
    })(user);
};

//读取用户信息
User.getBasicInfoByName = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.find({
                name: name
            }).toArray(function (err, users) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                for(var i=0;i<users.length;i++){
                    delete users[i].password;
                    delete users[i].email;
                }
                callback(null, users);
            });
        });
    });
};
User.getById = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找登录名值为 id 一个文档
            collection.findOne({
                id: id
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

//获取基本信息
User.getBasicInfoById = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找登录名值为 id 一个文档
            collection.findOne({
                id: id
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                if(user){
                    delete user.password;
                    delete user.email;
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

//保存关注者
User.prototype.saveFollowing = function (currentId, targetId, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 friends 集合
        db.collection('users', function (err, collection) {
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
                var index = friends[0].following.indexOf(targetId);
                if (index < 0) {
                    collection.find({
                        id: targetId
                    }).toArray(function (err, targetData) {
                        //被关注人id存在时才能操作成功
                        if (targetData[0]) {
                            collection.update({
                                id: currentId
                            }, {
                                $push: {
                                    following: targetId
                                }
                            }, function () {
                                collection.update({
                                    id: targetId
                                }, {
                                    $push: {
                                        follower: currentId
                                    }
                                }, function (err, friend) {
                                    mongodb.close();
                                    if (err) {
                                        return callback(err);//错误，返回 err 信息
                                    }
                                    callback(null, friend);//成功！err 为 null，并返回存储后的用户文档
                                })
                            });
                        } else {
                            mongodb.close();
                            callback(null, "Error");
                        }
                    })
                } else {
                    mongodb.close();
                    callback(null, "Error");
                }
            });
        });
    });
};

//删除一个关注
User.prototype.deleteFollowing = function (currentId, targetId, callback) {
    var needToModify, targetToModify;
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 friends 集合
        db.collection('users', function (err, collection) {
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
                needToModify = friends[0].following;
                //在数组中删除特定的一项targetId
                var index = needToModify.indexOf(targetId);
                if (index < 0) {
                    return callback(err);
                }
                needToModify.splice(index, 1);
                collection.update({"id": currentId},
                    {
                        $set: {
                            following: needToModify
                        }
                    }, function () {
                        collection.find({
                            id: targetId
                        }).toArray(function (err, targetData) {
                            if (err) {
                                return callback(err);//失败！返回 err 信息
                            }
                            targetToModify = targetData[0].follower;
                            //在follower数组中删除特定的一项currentId
                            var index = targetToModify.indexOf(currentId);
                            if (index < 0) {
                                return callback(err);
                            }
                            targetToModify.splice(index, 1);
                            collection.update({"id": targetId},
                                {
                                    $set: {
                                        follower: targetToModify
                                    }
                                }, function (err, friend) {
                                    mongodb.close();
                                    if (err) {
                                        return callback(err);//错误，返回 err 信息
                                    }
                                    callback(null, friend);
                                }
                            );
                        });
                    }
                );
            });
        });
    });
};

//修改姓名(name)，邮箱(email),密码(password)，在updateItem中传入相应的键
//在updateContent中传入修改后的值
User.prototype.updateProfile = function (updateProfileData, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //查找登录名值为 id 一个文档
            collection.update({
                id: updateProfileData.id
            }, {
                $set: {
                    name: updateProfileData.name,
                    email: updateProfileData.email,
                    password: updateProfileData.password
                }
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};