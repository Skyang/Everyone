/*Created by Hysky on 15/3/18.*/
$(document).ready(function () {
    $.ajax({
        url: "/data",
        type: "GET",
        success: function (data) {
            console.log(data);
        },
        fail: function (data) {
            console.log("Get Failed!");
        }
    });
});