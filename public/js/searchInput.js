/*Created by Hysky on 15/5/5.*/
$(document).ready(function () {
    var searchFunction = function (event) {
        if (event.which == 13 || event.target.id == "searchBtn") {
            var key = $("#searchInput").val();
            if (key) {
                location.href = "../search?user=" + key;
            }
        }
    };
    //将搜索页面的搜索框placeholder设为用户的搜索词
    var showPlaceholder = function (href) {
        var pattern = /\?user=/g;
        var searchHref = href.match(pattern);
        if (searchHref) {
            var tmp = href.replace(searchHref, "");
            $("#searchInput").attr("placeholder", tmp);
        }
    };
    $("#searchInput").keyup(function (event) {
        searchFunction(event);
    });
    $("#searchBtn").click(function (event) {
        searchFunction(event);
    });
    showPlaceholder(location.search);
});