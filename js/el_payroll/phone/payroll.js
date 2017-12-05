/**
 * Created by Administrator on 2017/6/13.
 * 薪资查询
 */

var $interface;
var $payroll_container;

var payroll = {

    //获取参数，显示在页面上
    init: function () {

        payroll.initParam();//初始化 参数
        payroll.initSalaryInfo(); //初始化 薪资信息

    },
    //初始化 参数
    initParam: function () {
        $payroll_container = $(".payroll_container");
    },
    //初始化 薪资信息
    initSalaryInfo: function () {

        loadingShow();//加载中 显示

        if (!sessionStorage.getItem("id")) {
            payroll.dialogShow("链接中没有id！");
            loadingHide();
            return
        }

        var obj = {
            id: sessionStorage.getItem("id")
        };
        var url = urlGroup.salary_load + "?" + jsonParseParam(obj);

        branGetRequest(
            url,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        var $info = data.result;

                        var id = $info.id ? $info.id : "";//id 已签收后会有id，进入详情
                        var time = $info.time ? $info.time : 0;
                        time = timeInit5(time);
                        var corpName = $info.corpName ? $info.corpName : "";//公司名称
                        var eSalaryName = $info.eSalaryName ? $info.eSalaryName : "";//薪资单名称

                        var lock = $info.lock ? $info.lock : 0;//是否锁定 1 已锁定 0 未锁定
                        var isVaild = $info.isVaild ? $info.isVaild : 0;//剩余输入次数
                        var isSign = $info.isSign ? $info.isSign : 0;//是否签收

                        $payroll_container.find(".corp_name").text(corpName);
                        $payroll_container.find(".salary_send_time").text(time + "发送");
                        $payroll_container.find(".salary_name").text(eSalaryName);

                        //如果已经锁定
                        if (lock) {
                            var $js_dialog = $(".js_dialog");//提示 弹框
                            $js_dialog.show().find(".salary_lock").show().siblings(".weui-dialog").hide();
                        }

                        //剩余输入次数
                        if (isVaild === 3) {
                            $payroll_container.find(".check_user_name").removeClass("error")
                                .text("输错3次工资单将被锁定");
                        }
                        else {
                            $payroll_container.find(".check_user_name").addClass("error")
                                .text("姓名错误，还剩" + isVaild + "次机会");
                        }

                        //如果已经签收
                        if (isSign) {
                            // location.href = "payroll_info.html?id=" + id;

                            var url = "payroll_info.html?id=" + id;
                            location.replace(url);

                        }

                    }

                }
                else {
                    //工资条不存在，直接进入404页面
                    // location.href = "404.html";

                    var url = "404.html";
                    location.replace(url);
                }

            },
            function (error) {
                branError(error);
            }
        );

    },

    //签收并查看工资
    salaryQuery: function () {

        //检查 参数
        if (!payroll.checkParam()) {
            return;
        }

        loadingShow();//加载中 显示

        var obj = {
            id: sessionStorage.getItem("id"),
            name: $.trim($payroll_container.find(".user_name input").val())
        };

        branPostRequest(
            urlGroup.salary_query,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $info = data.result;

                        var id = $info.id ? $info.id : "";//id 已签收后会有id，进入详情
                        var lock = $info.lock ? $info.lock : 0;//是否锁定 1 已锁定 0 未锁定
                        var isVaild = $info.isVaild ? $info.isVaild : 0;//剩余输入次数
                        var isSign = $info.isSign ? $info.isSign : 0;//是否签收

                        //如果已经锁定
                        if (lock) {
                            var $js_dialog = $(".js_dialog");//提示 弹框
                            $js_dialog.show().find(".salary_lock").show().siblings(".weui-dialog").hide();
                        }

                        //剩余输入次数
                        if (isVaild === 3) {
                            $payroll_container.find(".check_user_name").removeClass("error")
                                .text("输错3次工资单将被锁定");
                        }
                        else {
                            $payroll_container.find(".check_user_name").addClass("error")
                                .text("姓名错误，还剩" + isVaild + "次机会");
                        }

                        //如果已经签收
                        if (isSign) {
                            // location.href = "payroll_info.html?id=" + id;

                            var url = "payroll_info.html?id=" + id;
                            location.replace(url);

                        }

                    }

                }
                else {
                    payroll.dialogShow(data.msg);
                }

            },
            function (error) {
                payroll.dialogShow(error);
            }
        );

    },
    //检查 参数
    checkParam: function () {
        var flag = true;
        var msg = "";

        var is_check = $payroll_container.find(".choose_agreement").find("input").is(":checked");//是否选择 协议
        var name = $.trim($payroll_container.find(".user_name input").val());

        if (!is_check) {
            msg = "请选择协议！";
        }
        else if (!name) {
            msg = "请输入姓名！";
        }

        //提示 错误
        if (msg) {
            payroll.dialogShow(msg);
            flag = false;
        }

        return flag;

    },

    //显示 提示
    dialogShow: function (msg) {

        var $js_dialog = $(".js_dialog");//提示 弹框
        $js_dialog.show();
        $js_dialog.find(".weui-dialog").show().find(".weui-dialog__bd").html(msg);
        $js_dialog.find(".salary_lock").hide();

    },
    //隐藏 提示
    dialogHide: function () {
        $('.js_dialog').hide();
    }

};

$(function () {
    $interface = getInterface();//获取 前缀
    getUrlSession();//获取地址栏 参数

    payroll.init();
});

