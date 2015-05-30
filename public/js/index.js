/*Created by Hysky on 15/3/18.*/
var postsApp = angular.module('postsApp', []);
postsApp.controller('postsController', function ($scope, $http) {
    var page = 1;
    $http.get('/timeline?page=' + page).success(function (data) {
        $scope.posts = data;
        if (data.length > 0) {
            document.getElementById("loadMore").style.display = "inherit";
        }
    }).error(function (data) {
        console.log(data);
    });
    //点击载入更多按钮
    $scope.loadMore = function () {
        //先设置页码
        page++;
        $http.get('/timeline?page=' + page).success(function (data) {
            if (data.length == 0) {
                document.getElementById("loadMore").innerText = "再怎么找也没有了~";
                page--;
            }
            //返回有意义的data，将posts与data两数组拼接
            $scope.posts = $scope.posts.concat(data);
        }).error(function (data) {
            console.log(data);
        });
    }
});