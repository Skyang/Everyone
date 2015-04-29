/*Created by Hysky on 15/3/27.*/
var friendListApp = angular.module('friendListApp', []);

friendListApp.controller('mainCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.post('/friend/getAllFriend').
            success(function (data) {
                console.log("Get All Friend Success");
            }).
            error(function (data) {
                console.log(data);
            })
    }]);

var operateFriend = {
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
