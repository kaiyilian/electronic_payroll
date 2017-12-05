/**
 * Created by Administrator on 2017/7/19.
 */

var $btn_code;//获取验证码 按钮

var login = {

    user_id: "",//用户id

    //初始化 ，监测是否登录过
    init: function () {

        //初始化 获取验证码 按钮点击事件
        $btn_code.bind("click", function () {
            login.getVerificationCode();
        });

        login.user_id = localStorage.getItem("user_id");

        //如果 用户有缓存，并且用户存在，则 进入新建页面
        if (login.user_id) {

            login.checkUserIsExist(
                function () {
                    location.href = "create.html";
                    //     return
                },
                function () {
                    // toastr.warning(msg);
                }
            );

        }


    },
    //检查 用户是否存在
    checkUserIsExist: function (successFun, errorFun) {


        var obj = {
            salaryCorpUserId: login.user_id
        };

        branPostRequest(
            urlGroup.check_user_is_exist,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    var is_exist = data.result.useExistence ? data.result.useExistence : false;

                    if (is_exist) {
                        if (successFun) {
                            successFun()
                        }
                    }
                    else {
                        if (errorFun) {
                            errorFun();
                        }
                    }


                }
                else {

                    if (errorFun) {
                        errorFun(data.msg)
                    }

                }

            },
            function (error) {

                if (errorFun) {
                    errorFun(error)
                }

            }
        );

    },

    //获取 验证码
    getVerificationCode: function () {

        if (!login.checkParam()) {
            return
        }

        $btn_code.unbind("click");

        var timer, timeCount = 60, txt;
        timer = setInterval(function () {

            if (timeCount > 0) {
                txt = timeCount + "s后重新获取";
                $btn_code.html(txt);
                timeCount--;
            }
            else {
                clearInterval(timer);
                $btn_code.html("发送验证码");
                $btn_code.bind("click", function () {
                    login.getVerificationCode();
                });

            }

        }, 1000);

        loadingInit();

        var obj = {
            phone_num: $(".user_phone input").val()
        };

        branPostRequest(
            urlGroup.verification_code_url,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        toastr.success("发送成功！");
                    }
                    else {
                        toastr.warning("发送失败！");
                    }

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },
    //检查参数
    checkParam: function () {
        var flag = false;
        var txt;

        var phone = $(".user_phone input");
        var reg = /^(1)[0-9]{10}$/;

        if (phone.val() === "") {
            toastr.warning("手机号不能为空！");
        }
        else if (!reg.test(phone.val())) {
            toastr.warning("手机号格式错误！");
        }
        else {
            flag = true;
        }

        if (txt) {
            toastr.warning(txt);
        }

        return flag;

    },

    //登录，进入 试用页面
    signIn: function () {

        //如果是正式环境，增加埋点需求
        if (checkEnvironment()) {
            _czc.push(["_trackEvent", "dianzigongzidan", "马上试用按钮"]);
        }

        var $left_side = $(".left_side");
        var phone = $left_side.find(".user_phone input").val();
        var verification_code = $left_side.find(".verification_code input").val();
        if (!phone) {
            toastr.warning("手机号码不能为空！");
            return
        }
        if (!verification_code) {
            toastr.warning("验证码不能为空！");
            return
        }

        loadingInit();

        var obj = {
            phone_num: phone,
            verifiCode: verification_code
        };

        branPostRequest(
            urlGroup.user_login,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    localStorage.setItem("user_id", data.result.id);
                    location.href = "create.html";

                }
                else {
                    toastr.warning(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

$(function () {
    $btn_code = $(".btn_code");//

    login.init();

});
