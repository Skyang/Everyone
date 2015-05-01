/**
 * Created by Hysky on 2015/2/27.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Post(post) {
    this.name = post.name;
    this.id = post.id;
    this.object = post.object;
    this.content = post.content;
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
        object: this.object,
        content: this.content,
        comments: [],
        pv: 0
    };
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

//通过用户id读取发送的状态信息
Post.prototype.getById = function (id, callback) {
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
            //查找登录名值为 id 文档
            collection.find({
                id: id
            }).sort({
                "time": -1
            }).toArray(function (err, postcollection) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, postcollection);
            });
        });
    });
};

//通过post的_id读取发送的状态信息
Post.prototype.getByPid = function (userId, _id, callback) {
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
            //查找 _id 为 id 文档
            collection.find({
                "_id": new ObjectID(_id),
                "id": userId
            }).toArray(function (err, postcollection) {
                console.log("post: " + postcollection);
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, postcollection);
            });
        });
    });
};
//_pid为当前页面的post id，commentUserID为当前登录用户ID，comment为评论内容
Post.prototype.saveComment = function (_pid, commentUserID, comment, callback) {
    var finalComment;
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    finalComment = {
        commentUserID:commentUserID,
        comment: comment,
        time: time
    };
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
            //查找 _id 为 id 文档
            collection.update({
                "_id": new ObjectID(_pid)
            }, {
                $push: {
                    comments: finalComment
                }
            }, function (err, post) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, post);//成功！err 为 null，并返回存储后的用户文档
            })
        });
    });
};
//统计PV数
Post.prototype.savePV = function (_id, callback) {

};