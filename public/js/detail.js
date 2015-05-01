/*Created by Hysky on 15/3/31.*/
$(document).ready(function () {
    console.log("Detail Page Loaded!");
    //点击发送评论按钮
    $("#submitComment").click(function () {
            var comment = $("#commentContent").val();
            var path = location.pathname;
            var pid = path.replace(/\/\w+\//, "");
            $.ajax({
                type: "POST",
                url: "/post/submitComment",
                data: {
                    pid: pid,
                    comment: comment
                },
                success: function (data) {
                    location.replace(location.href);
                    console.log(data);
                },
                fail: function (data) {
                    console.log(data);
                }
            })
        }
    );
});