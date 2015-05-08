/*Created by Hysky on 15/5/8.*/
var postsApp = angular.module('postsApp', []);
postsApp.controller('postsController', function ($scope, $http) {
    var uid = location.pathname.replace(/\/\w+\//, "");
    $http.get('/userData/' + uid).success(function (data) {
        $scope.posts = data.posts;
        $scope.user = data.user;
    }).error(function (data) {
        console.log(data);
    });
});