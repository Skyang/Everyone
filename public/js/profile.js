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
    //点击上传文件按钮
    var previewReader=new FileReader();
    $("#uploadAvatar").on("change", function (event) {
        console.log("this.files");
        console.log(this.files);
        console.log("Select Upload Success");
        var files=event.target.files;
        console.log(files);
        if(/image/.test(files[0].type)){
            previewReader.readAsDataURL(files[0]);
            previewReader.onprogress=function (event) {
                if(event.lengthComputable){
                    $("#avatarProgress").text((event.loaded/event.total)*100+"%");
                }
            };
            previewReader.onerror=function () {
                $("#avatarProgress").text("载入失败，请重试！");
                console.log(previewReader.error.code);
            };
            previewReader.onload=function () {
                $("#avatarPreview").show();
                $("#avatarPreview").attr("src",previewReader.result);
                console.log(previewReader.result);
                $("#saveAvatar").show();
            };
        }
    });
    $("#saveAvatar").click(function (event) {
        if(!$("#avatarPreview").attr("src")){
            return false;
        }
        var formData=new FormData($("#updateAvatar")[0]);
        console.log("Save Button Clicked!");
        $.ajax({
            url: '/profile/updateAvatar',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                console.log('imgUploader upload success, data:', data);
                location.reload();
            },
            error: function(){
                //$("#spanMessage").html("与服务器通信发生错误");
            }
        });
    });
});