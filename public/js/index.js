/*Created by Hysky on 15/3/18.*/
var str = '<section id="posts" ng-app="postsApp" ng-controller="postsController">' +
    '<ul>' +
    '<li ng-repeat="post in posts"> ' +
    '<p><h2><a href="/{{ post.id }}/{{ post._id }}">{{ post.object }}</a></h2></p>' +
    '<p class="info">' +
    '作者：<a href="/u/{{ post.id }}">{{ post.name }}</a>' +
    '日期：{{ post.time.minute }}</p>' +
    '<p>{{ post.content }}</p>' +
    '</li>' +
    '</ul>' +
    '</section>';
$("#postsList").append(str);
$.ajax({
    url: "/data",
    type: "GET",
    async: false,
    success: function (data) {
        (function (data) {
            var postsApp = angular.module('postsApp', []);
            postsApp.controller('postsController', function ($scope) {
                console.log(data);
                $scope.posts = data;
            });
        })(data);
    },
    fail: function (data) {
        console.log("Get Failed!");
    }
});