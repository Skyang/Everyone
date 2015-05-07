/*Created by Hysky on 15/5/3.*/
$(document).ready(function () {
    var operateFriend = {
        //新增好友
        addFollowing: function (targetId) {
            $.ajax({
                type: "POST",
                url: '/friend/addFollowing?following_id=' + targetId,
                success: function (data) {
                    location.reload();
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
                    location.reload();
                },
                fail: function (data) {
                    console.log(data);
                }
            });
        }
    };
    $("button").click(function (e) {
        var className=$(this).attr("class");
        if(className=="addFollowing"){
            operateFriend.addFollowing($(this).attr("uid"));
        }else if(className=="deleteFollowing"){
            operateFriend.deleteFollowing($(this).attr("uid"));
        }
    })
});