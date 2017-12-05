/**
 * Created by Administrator on 2017/7/19.
 */

var $payroll_info;//header 中 ，操作内容container
var $salary_validity_modal;//薪资单 有效期

var electronic_payroll = {

    init: function () {

        //新建
        $payroll_info.find(".payroll_create").unbind("click").bind("click", function () {

            //如果是正式环境，增加埋点需求
            if (checkEnvironment()) {
                _czc.push(["_trackEvent", "dianzigongzidan", "新建按钮"]);
            }

            location.href = "create.html";

        });

        //历史
        $payroll_info.find(".payroll_history").unbind("click").bind("click", function () {

            //如果是正式环境，增加埋点需求
            if (checkEnvironment()) {
                _czc.push(["_trackEvent", "dianzigongzidan", "历史按钮"]);
            }
            location.href = "history.html";

        });

        //设置
        $payroll_info.find(".payroll_set").unbind("click").bind("click", function (e) {

            e.stopPropagation();

            //如果是正式环境，增加埋点需求
            if (checkEnvironment()) {
                _czc.push(["_trackEvent", "dianzigongzidan", "设置按钮"]);
            }

            if ($(this).find(".set_operate").length > 0) {
                return;
            }

            //设置内容显示
            var $set_operate = $("<div>");
            $set_operate.addClass("set_operate");
            $set_operate.appendTo($(this));

            //有效期设置
            var $btn_validity = $("<div>");
            $btn_validity.addClass("btn_validity");
            $btn_validity.text("有效期设置");
            $btn_validity.appendTo($set_operate);
            $btn_validity.unbind("click").bind("click", function (e) {

                e.stopPropagation();

                $salary_validity_modal.modal("show");

                loadingInit();

                var obj = {
                    salaryCorpUserId: localStorage.getItem("user_id")
                };
                // var url = urlGroup.salary_validity + "?" + jsonParseParam(obj);

                branPostRequest(
                    urlGroup.salary_validity,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            var validity = "0";//

                            if (data.result) {
                                validity = data.result.validity ? data.result.validity : "0";
                            }

                            var $salary_validity_modal = $(".salary_validity_modal");
                            $salary_validity_modal.find(".salary_validity select").val(validity);

                        }
                        else {
                            toastr.warning(data.msg);
                        }

                    },
                    function (error) {
                        branError(error);
                    }
                );

            });

            //退出
            var $btn_signOut = $("<div>");
            $btn_signOut.addClass("btn_signOut");
            $btn_signOut.text("退出");
            $btn_signOut.appendTo($set_operate);
            $btn_signOut.unbind("click").bind("click", function (e) {

                e.stopPropagation();

                localStorage.removeItem("user_id");//移除缓存

                location.href = "login.html";

            });

        });

    },

    //隐藏  设置
    hideSet: function () {
        $payroll_info.find(".set_operate").remove();
    },

    //有效期保存
    salaryValiditySave: function () {

        var $salary_validity_modal = $(".salary_validity_modal");
        var validity = $salary_validity_modal.find(".salary_validity select").val();

        var obj = {
            salaryCorpUserId: localStorage.getItem("user_id"),
            validityStatus: validity
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary_validity_save,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    toastr.success("保存成功！");
                    $salary_validity_modal.modal("hide");

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
    $payroll_info = $("header .payroll_info");
    $salary_validity_modal = $(".salary_validity_modal");

    electronic_payroll.init();
});

//检查是否是 正式环境
var checkEnvironment = function () {

    var host = location.host;

    //如果是正式环境
    if (host.indexOf("bumuyun") > -1) {
        return true
    }
    else {
        return false;
    }

};


/**
 * 准备统计代码
 */

var cnzzId = "1259955107";
var cnzz_protocol = (('https:' === document.location.protocol) ? ' https://' : 'http://');
var cnzzStr = "%3Cspan %3E %3C/span%3E" +
    "%3Cscript src='" + cnzz_protocol +
    "s95.cnzz.com/z_stat.php%3Fid%3D" + cnzzId +
    "%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E";
// document.write(unescape(cnzzStr));


document.write(unescape(cnzzStr));