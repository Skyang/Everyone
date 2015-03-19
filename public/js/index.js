/*Created by Hysky on 15/3/18.*/
$(document).ready(function(){
    $.ajax({
        url:"test",
        type:"POST",
        success:function(data){
            console.log("res:"+data);
        },
        fail: function (data) {
            console.log("Failed:"+data);
        }
    });
});