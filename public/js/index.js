/*Created by Hysky on 15/3/18.*/
var postsApp = angular.module('postsApp', []);
postsApp.controller('postsController', function ($scope, $http) {
    $http.get('/data').success(function (data) {
        $scope.posts = data;
    }).error(function (data) {
        console.log(data);
    })
});