/*Created by Hysky on 15/3/19.*/
$(document).ready(function () {
    console.log("Post Page Load Success!");

    $("#submit").click(function (e) {
        var data={
            object: $("#object").val(),
            content: $("#content").val()
        };
        $.ajax({
            url: "/post",
            type: "POST",
            data: data,
            success: function(){
                console.log("Post Success!");
                $("#object").val(null);
                $("#content").val(null);
                window.location="/";
            },
            fail: function(){
                console.log("Post Failed!");
            }
        });
    });
    $("#cancel").click(function(){
        $("#object").val(null);
        $("#content").val(null);
        window.location="/";
    });
});