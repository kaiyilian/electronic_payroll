/**
 * Created by Administrator on 2017/11/16.
 * 薪资详情
 */

var $interface;
var $payroll_info_container;

var payroll_info = {

    init: function () {
        $payroll_info_container = $(".payroll_info_container");

        payroll_info.salaryInfo();//获取薪资列表

    },

    //获取薪资列表
    salaryInfo: function () {
        loadingShow();

        var obj = {
            id: sessionStorage.getItem("id")
        };

        branPostRequest(
            urlGroup.salary_detail,
            obj,
            function (data) {
                //alert(JSON.stringify(data))
                console.log(data);

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        var $info = data.result;
                        var corp_name = $info.corpName ? $info.corpName : "";//企业名称
                        var salary_name = $info.salaryName ? $info.salaryName : "";//工资单名称
                        var salary_month = $info.month ? $info.month : "";//发薪月份

                        $payroll_info_container.find(".corp_name").text(corp_name);
                        $payroll_info_container.find(".salary_month").text(salary_month);
                        $payroll_info_container.find(".salary_name").text(salary_name);

                        var $salary_detail = $payroll_info_container.find(".salary_detail");
                        $salary_detail.empty();

                        var $infoResult = $info.infoResult ? $info.infoResult : null;//
                        if ($infoResult) {

                            //实发薪资
                            var salary = $infoResult.salary ? $infoResult.salary : null;
                            if (salary) {
                                var salary_real = salary.value ? salary.value : "";
                                if (salary_real) {
                                    // salary_real = isNaN(parseFloat(salary_real)) ? "空" : parseFloat(salary_real);
                                    // if (salary_real) {
                                    //     salary_real = fnum(salary_real);
                                    //     $payroll_info_container.find(".salary_real").text(salary_real);
                                    // }

                                    //如果是数字
                                    if (!isNaN(parseFloat(salary_real))) {
                                        salary_real = fnum(salary_real);
                                    }
                                    $payroll_info_container.find(".salary_real").text(salary_real);

                                }

                            }

                            //工资单详情
                            var other = $infoResult.other ? $infoResult.other : [];
                            if (other && other.length > 0) {

                                $.each(other, function (i, item) {

                                    var key = item.title ? item.title : "";//
                                    var val = item.value ? item.value : "";//

                                    //行
                                    var $item = $("<div>");
                                    $item.addClass("weui-flex");
                                    $item.addClass("item");
                                    $item.appendTo($salary_detail);

                                    var $left = $("<div>");
                                    $left.addClass("weui-flex__item");
                                    $left.appendTo($item);
                                    var $key = $("<div>");
                                    $key.addClass("placeholder");
                                    $key.addClass("key");
                                    $key.text(key);
                                    $key.appendTo($left);

                                    var $right = $("<div>");
                                    $right.addClass("weui-flex__item");
                                    $right.appendTo($item);
                                    var $val = $("<div>");
                                    $val.addClass("placeholder");
                                    $val.addClass("val");
                                    $val.text(val);
                                    $val.appendTo($right);

                                });

                            }

                        }

                    }

                }
                else {
                    // toastr.warning(data.msg);
                    alert(data.msg);
                }

            },
            function (error) {
                branError(error);
            }
        );

    }

};

$(function () {
    $interface = getInterface();//获取 前缀
    getUrlSession();//获取地址栏 参数

    payroll_info.init();
});
