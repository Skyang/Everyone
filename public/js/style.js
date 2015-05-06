/*Created by Hysky on 15/5/6.*/
$(document).ready(function () {
    $("li").mouseover(function () {
        $(this).addClass("active");
    }).mouseout(function () {
        $(this).removeClass("active");
    });
});