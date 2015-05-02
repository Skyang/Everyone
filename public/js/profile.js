/*Created by Hysky on 15/5/2.*/
$(document).ready(function () {
    console.log("Profile Page Loaded!");
    //点击保存按钮
    $("#saveProfile").click(function (event) {
        var updateProfileData={
            name:$("#updateName").val(),
            email:$("#updateEmail").val(),
            password:$("#updatePwd").val(),
            passwordRepeat:$("#updatePwdRepeat").val()
        };
        console.log(updateProfileData);
        $.ajax({
            type:"POST",
            url:"/profile/updateProfile",
            data:updateProfileData,
            success: function (data) {
                //两次密码不同
                if(data=="PwdNotSame"){
                    location.replace(location.href);
                }
                console.log(data);
                if(data=="Success"){
                    alert("您已修改账户信息，请重新登录！");
                    location.href="/logout";
                }
            },
            fail: function (data) {
                console.log(data);
            }
        })
    });
    //点击编辑按钮
    $("#editProfile").click(function (event) {
        $("#userProfile").hide();
        $("#editingProfile").show();
    });
    //点击取消编辑按钮
    $("#cancelEditProfile").click(function (event) {
        $("#editingProfile").hide();
        $("#userProfile").show();
    });
});