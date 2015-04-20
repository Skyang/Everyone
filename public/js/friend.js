/*Created by Hysky on 15/3/27.*/
var friendListApp=angular.module('friendListApp',['ngRoute']);
function routeConfig($routeProvider){
    $routeProvider.
        when('/friend',{
            controller:'allFriendCtrl'
        }).
        when().
        when().
        othwise({
            redirectTo:'/'
        });
}
friendListApp.config(routeConfig);
$.ajax({
    type:"POST",
    url:'/friend/getAllFriend',
    success: function (data) {
        console.log(data);
    },
    fail: function (data) {
        console.log(data);
    }
});
