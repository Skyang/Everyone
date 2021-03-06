/*Created by Hysky on 15/3/27.*/
var friendListApp = angular.module('friendListApp', []);
var followingLists, followerLists, currentUserInfo;
//关于页面的操作写在这里
var friendPage = {
    //页面初始化
    init: function () {
        friendListApp.controller('followerListCtrl', function ($scope, $http) {
            $http.get('/friend/getAllFriend').success(function (data) {
                currentUserInfo = data;
                operateFriend.getFollowerInfo(data.follower, function (lists) {
                    followerLists = lists;
                });
                if (followerLists == "Error") {
                    console.log("followerList Error");
                    return $("#followerList").innerHTML = "还没有人关注你...";
                }
                console.log("followerLists Before....");
                console.log(followerLists);
                $scope.isFollowed = function (arr, str) {
                    return (arr.indexOf(str) >= 0);
                };
                $scope.addFollowing = function (target) {
                    operateFriend.addFollowing(target.id);
                    currentUserInfo.following.push(target.id);
                };
                $scope.deleteFollowing = function (target) {
                    operateFriend.deleteFollowing(target.id);
                    currentUserInfo.following
                        .splice(currentUserInfo.following.indexOf(target.id), 1);
                };
                console.log("followerLists After...");
                console.log(followerLists);
                $scope.followerLists = followerLists;
                $scope.currentUserFollowing = currentUserInfo.following;
            }).error(function (data) {
                console.log(data);
            })
        });
    },
    refresh: function () {
        this.init();
    }
};
//关于操作好友的方法写在这里
var operateFriend = {
    //获取关注者信息
    getFollowingInfo: function (ids, callback) {
        $.ajax({
            type: "GET",
            url: '/getFollowingUserInfo?uids=' + ids,
            //要同步请求，否则angular加载会出错
            async: false,
            success: function (data) {
                callback(data);
            },
            fail: function (data) {
                console.log(data);
            }
        });
    },
    //获取关注自己的用户信息
    getFollowerInfo: function (ids, callback) {
        $.ajax({
            type: "GET",
            url: '/getFollowerUserInfo?uids=' + ids,
            async: false,
            success: function (data) {
                console.log(data);
                callback(data);
            },
            fail: function (data) {
                console.log(data);
            }
        });
    },
    //新增好友
    addFollowing: function (targetId) {
        $.ajax({
            type: "POST",
            url: '/friend/addFollowing?following_id=' + targetId,
            success: function (data) {
                console.log(data);
            },
            fail: function (data) {
                console.log(data);
            }
        });
    },
    //删除好友
    deleteFollowing: function (targetId) {
        $.ajax({
            type: "POST",
            url: '/friend/deleteFollowing?following_id=' + targetId,
            success: function (data) {
                console.log(data);
            },
            fail: function (data) {
                console.log(data);
            }
        });
    }
};

friendPage.init();
/*var str = '<ul id="followingList" ng-app="friendListApp" ng-controller="followingListCtrl">' +
 '<li ng-repeat="followingList in followingLists">' +
 '<div class="friendDetail">' +
 '<div class="avatar"></div>' +
 '<p><a href="">{{ followingList.id }}</a></p>' +
 '<p>TA的关注：<span>' +
 '<a href="/u/{{ followingList.id }}">{{ followingList.following.length }}</a>' +
 '</span></p>' +
 '<p>关注TA的： <span>' +
 '<a href="/u/{{ followingList.id }}">{{ followingList.follower.length }}</a></span>' +
 '</p></div></li></ul>';
 $("#friendList").append(str);
 var friendListApp = angular.module('friendListApp', ['friendListApp.controllers']);
 var followingLists;
 $.ajax({
 url: "/friend/getAllFriend",
 type: "GET",
 async: false,
 success: function (data) {
 operateFriend.getFollowingInfo(data.following, function (lists) {
 console.log("lists");
 console.log(lists);
 followingLists = lists;
 });
 },
 fail: function (data) {
 console.log(data);
 }
 });
 friendListApp.controller('followingListCtrl', function ($scope) {
 $scope.followingLists = followingLists;
 });*/
/*$.ajax({
 url: "/friend/getAllFriend",
 type: "POST",
 success: function (data) {
 operateFriend.getFollowingInfo(data.following, function (lists) {
 friendListApp.controller('followingListCtrl', function ($scope) {
 console.log(lists);
 $scope.followingLists = lists;
 });
 });
 },
 fail: function (data) {
 console.log(data);
 }
 });*/

//不知道哪里出的问题，路由模板不显示，作废不用angular路由
/*friendListApp.config(['$routeProvider', function($routeProvider) {
 $routeProvider.
 when('/friend', {
 templateUrl: 'allFriend.html',
 controller: 'allFriendCtrl'
 }).
 when('/friend/following', {
 templateUrl: './friendTpl/followingList.html',
 controller: 'followingListCtrl'
 }).
 when('/friend/follower', {
 templateUrl: './friendTpl/followerList.html',
 controller: 'followerListCtrl'
 }).
 otherwise({
 redirectTo: '/' // 其他情况，跳到链接"/"
 });
 }]);*/
/*var getAllFriend=$.ajax({
 type:"POST",
 url:'/friend/getAllFriend',
 success: function (data) {
 console.log(data);
 },
 fail: function (data) {
 console.log(data);
 }
 });*/
