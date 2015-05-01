/*Created by Hysky on 15/3/31.*/
$(document).ready(function () {
    console.log("Detail Page Loaded!");
    //点击发送评论按钮
    $("#submitComment").click(function () {
            var comment = $("#commentContent").val();
            //从pathname中取出pid
            var pid = location.pathname.replace(/\/\w+\//, "");
            $.ajax({
                type: "POST",
                url: "/post/submitComment",
                data: {
                    pid: pid,
                    comment: comment
                },
                success: function (data) {
                    //可以使用本地缓存进行刷新操作，比reload快
                    location.replace(location.href);
                },
                fail: function (data) {
                    console.log(data);
                }
            })
        }
    );
    $("#resetComment").click(function () {
        $("#commentContent").val("");
    });
});