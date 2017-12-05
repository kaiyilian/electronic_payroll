/**
 * Created by Administrator on 2017/7/27.
 */

var $salary_time_container = $(".salary_time_container");//发薪 时间列表 container
var $salary_info_container = $(".salary_info_container");//薪资用户列表、薪资详情 container
var $salary_info_none = $(".salary_info_none");//无发薪记录 container

var salary_history = {

    user_id: "",//登录 用户 id
    userChooseArr: [],//已选择用户 数组
    salary_month_id: "",//薪资 月份 id
    salary_user_id: "",//薪资详情 用户id
    userArrByMonth: [],//当前月份 导入的用户信息 数组

    init: function () {

        salary_history.user_id = localStorage.getItem("user_id");

        //如果 用户有缓存，并且用户存在
        if (salary_history.user_id) {

            salary_history.checkUserIsExist(
                function () {

                    $salary_info_none.find(".btn_send").bind("click", function () {
                        location.href = "create.html";
                    });

                    salary_history.salaryYearList();   //获取 年份列表

                },
                function (msg) {
                    toastr.warning(msg);
                    location.href = "login.html";
                }
            );

        }
        else {
            location.href = "login.html";
        }

    },
    //检查 用户是否存在
    checkUserIsExist: function (successFun, errorFun) {


        var obj = {
            salaryCorpUserId: salary_history.user_id
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
                            errorFun("用户不存在！");
                        }
                    }


                }
                else {

                    if (errorFun) {
                        errorFun(data.msg);
                    }

                }

            },
            function (error) {

                if (errorFun) {
                    errorFun(error);
                }

            }
        );

    },
    //显示 暂无内容 页面
    salaryInfoNonePageShow: function () {
        $salary_info_none.show().siblings().hide(); //页面 默认显示无内容
    },

    //获取 年份列表
    salaryYearList: function () {

        var $year_list = $salary_time_container.find(".year_list");
        $year_list.empty();

        var obj = {
            salaryCorpUserId: salary_history.user_id
        };

        loadingInit();

        branPostRequest(
            urlGroup.salary_history_yearMonth,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {

                        if (data.result.salaryHistory && data.result.salaryHistory.length > 0) {
                            $salary_info_none.hide().siblings().show();//显示 内容页面

                            $.each(data.result.salaryHistory, function (index, $item) {

                                var year = $item.year ? $item.year : "";//
                                var infos = $item.infos ? $item.infos : [];//

                                var $year_item = $("<div>");
                                $year_item.appendTo($year_list);
                                $year_item.addClass("year_item");

                                //年份
                                var $year = $("<div>");
                                $year.appendTo($year_item);
                                $year.addClass("year");
                                $year.text(year);

                                //月份列表
                                var $month_list = $("<div>");
                                $month_list.appendTo($year_item);
                                $month_list.addClass("month_list");

                                //月份列表
                                $.each(infos, function (i, $item) {

                                    var id = $item.id ? $item.id : "";//
                                    var month = $item.month ? $item.month : "";//
                                    var salaryName = $item.salaryName ? $item.salaryName : "工资单";//工资单名称
                                    // var times = $item.times ? $item.times : "";//
                                    // var is_more = $item.is_more ? $item.is_more : false;//

                                    // var name = month + "月薪资";
                                    // if (is_more) {
                                    //     name = name + "(" + times + ")";
                                    // }

                                    var $month_item = $("<div>");
                                    $month_item.appendTo($month_list);
                                    $month_item.addClass("month_item");
                                    $month_item.attr("data-id", id);
                                    //绑定月份 点击事件
                                    $month_item.unbind("click").bind("click", function () {

                                        salary_history.salary_month_id = id;//选择 月份id

                                        $year_list.find(".month_item").removeClass("active");
                                        $(this).addClass("active");

                                        salary_history.salaryInfoByMonth(); //获取 导入信息

                                    });

                                    //月份名称
                                    var $month_name = $("<div>");
                                    $month_name.addClass("month_name");
                                    $month_name.appendTo($month_item);
                                    $month_name.text(month + "月");

                                    //薪资名称
                                    var $salary_name = $("<div>");
                                    $salary_name.addClass("salary_name");
                                    $salary_name.appendTo($month_item);
                                    $salary_name.text(salaryName);

                                    if (sessionStorage.getItem("recent_salary_month_id") &&
                                        sessionStorage.getItem("recent_salary_month_id") === id) {
                                        $month_item.addClass("active");
                                    }

                                });

                            });

                            //绑定月份 点击事件
                            var $month_list = $salary_time_container.find(".year_list").find(".month_list");
                            var $month_item = $month_list.find(".month_item");

                            if ($month_item.length > 0) {

                                if ($month_list.find(".month_item.active").length > 0) {
                                    $month_list.find(".month_item.active").click();
                                    sessionStorage.removeItem("recent_salary_month_id");
                                }
                                else {
                                    $month_item.first().click();
                                }

                            }

                        }
                        else {
                            salary_history.salaryInfoNonePageShow();//
                        }

                    }
                    else {
                        toastr.warning(data.msg);
                        salary_history.salaryInfoNonePageShow();//
                    }

                }
                else {
                    toastr.warning(data.msg);
                    salary_history.salaryInfoNonePageShow();//
                }

            },
            function (error) {
                branError(error);
                salary_history.salaryInfoNonePageShow();//
            }
        );

    },

    //获取 导入信息
    salaryInfoByMonth: function () {

        var obj = {
            salaryInfoId: salary_history.salary_month_id
        };
        loadingInit();

        branPostRequest(
            urlGroup.salary_history_info,
            obj,
            function (data) {
                //alert(JSON.stringify(data))

                if (data.code === RESPONSE_OK_CODE) {

                    if (data.result) {
                        // salaryMonthDesc

                        var $item = data.result;
                        var salaryMonthDesc = $item.salaryMonthDesc ? $item.salaryMonthDesc : "";//月份名称
                        var sendDate = $item.sendDate ? $item.sendDate : "";// 发送的时间
                        sendDate = timeInit2(sendDate);
                        salary_history.userArrByMonth = $item.users ? $item.users : [];//
                        var corpName = $item.corpName ? $item.corpName : "";//公司名称

                        var $left_side = $salary_info_container.find(".left_side");
                        var $right_side = $salary_info_container.find(".right_side");

                        //薪资 月份名称
                        $left_side.find(".head .name").html(salaryMonthDesc);
                        //薪资 发送时间
                        $left_side.find(".head .salary_send_time").html(sendDate);
                        $right_side.find(".salary_prompt .send_time").html(sendDate);
                        //代发公司名称
                        if (corpName) {
                            $right_side.find(".head .salary_corp_name_container").show()
                                .find(".salary_corp_name").html(corpName).attr("title", corpName);
                        }
                        else {
                            $right_side.find(".head .salary_corp_name_container").hide();
                        }

                        //初始化 搜索条件 用户列表chosen
                        salary_history.initSearch();

                        //获取 员工列表
                        salary_history.userList(salary_history.userArrByMonth);

                        salary_history.IsChooseAll();//是否 已经全部选择
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
    //初始化 搜索条件 用户列表chosen
    initSearch: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list_search = $left_side.find(".search_container").find(".user_list_search");
        $user_list_search.empty();

        //移除 搜索插件
        if ($user_list_search.siblings(".chosen-container").length > 0) {
            $user_list_search.chosen("destroy");
        }

        $.each(salary_history.userArrByMonth, function (i, $item) {

            var id = $item.id ? $item.id : "";//
            var name = $item.name ? $item.name : "";//
            var phone = $item.phone ? $item.phone : "";//

            var $option = $("<option>");
            $option.attr("value", id);
            $option.text(name + " - " + phone);
            $option.appendTo($user_list_search);

        });

        //初始化 搜索插件
        $user_list_search.chosen({
            allow_single_deselect: true,//选择之后 是否可以取消
            max_selected_options: 1,//最多只能选择1个
            width: "100%",//select框 宽度
            no_results_text: "找不到 " //输入的 内容查询不到时的提示信息
        });

        //搜索 用户事件
        $user_list_search.chosen().unbind("change").on("change", function (evt, params) {

            var id = params.selected;
            if (!id) {

                //获取 员工列表
                salary_history.userList(salary_history.userArrByMonth);

                return;
            }

            var obj = {
                empUserId: id
            };

            loadingInit();

            branPostRequest(
                urlGroup.salary_user_search,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            var users = [];
                            users.push(data.result);

                            //获取 员工列表
                            salary_history.userList(users);

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

        });

    },
    //获取 员工列表
    userList: function (users) {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list = $left_side.find(".user_list");
        $user_list.empty();

        // var list = "";
        $.each(users, function (i, $item) {

            var id = $item.id ? $item.id : "";//
            var name = $item.name ? $item.name : "";//
            var phone = $item.phone ? $item.phone : "";//
            var isSign = $item.isSign ? $item.isSign : 0;//0 未签收 1 已签收

            //item
            var $user_item = $("<div>");
            $user_item.addClass("item");
            $user_item.attr("data-id", id);
            $user_item.appendTo($user_list);
            $user_item.unbind("click").bind("click", function () {

                var $this = $(this);

                salary_history.salary_user_id = $this.attr("data-id");
                $this.addClass("active").siblings(".item").removeClass("active");

                var $right_side = $salary_info_container.find(".right_side");
                var $salary_detail_container = $right_side.find(".salary_detail_container");
                var $salary_detail = $salary_detail_container.find(".salary_detail");

                //如果工资条详情 已显示
                if ($salary_detail.hasClass("show")) {
                    $salary_detail.removeClass("show");
                    $salary_detail.slideUp("slow");
                }

                //赋值 用户姓名
                $right_side.find(".head .name").html($this.find(".name").html());

            });

            //choose_item
            var $choose_item = $("<div>");
            $choose_item.addClass("choose_item");
            $choose_item.appendTo($user_item);
            $choose_item.unbind("click").bind("click", function (e) {

                e.stopPropagation();
                // salary_history.chooseItem(this);    //单选

                var $item = $(this).closest(".item");

                if ($item.hasClass("is_choose")) {
                    $item.removeClass("is_choose");
                    $item.find("img").attr("src", "../../images/el_payroll/icon_Unchecked.png")
                }
                else {
                    $item.addClass("is_choose");
                    $item.find("img").attr("src", "../../images/el_payroll/icon_checked.png")
                }

                salary_history.IsChooseAll();//是否 已经全部选择

            });

            var $img = $("<img>");
            $img.attr("src", "../../images/el_payroll/icon_Unchecked.png");
            $img.appendTo($choose_item);

            //no
            var $no = $("<div>");
            $no.addClass("no");
            $no.text((i + 1) + ".");
            $no.appendTo($user_item);

            //name
            var $name = $("<div>");
            $name.addClass("name");
            $name.text(name);
            $name.appendTo($user_item);

            //isSign
            var $isSign = $("<div>");
            $isSign.addClass("isSign");
            $isSign.appendTo($user_item);

            //已签收
            if (isSign) {
                $isSign.addClass("c_orange");
                $isSign.text("已签收");
            }
            else {
                $isSign.text("未签收");
            }

        });

        //如果 有用户，默认 选择第一个 用户
        if ($user_list.find(".item").length > 0) {
            $user_list.find(".item").first().click();
        }

    },

    //全选
    chooseAll: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_item = $left_side.find(".user_list").find(".item");
        var $choose_container = $left_side.find(".operate_container .choose_item");

        if ($choose_container.hasClass("is_choose")) {   //已经选中
            $choose_container.removeClass("is_choose");
            $choose_container.find("img").attr("src", "../../images/el_payroll/icon_Unchecked.png");

            $user_item.removeClass("is_choose");
            $user_item.find("img").attr("src", "../../images/el_payroll/icon_Unchecked.png");

        }
        else {
            $choose_container.addClass("is_choose");
            $choose_container.find("img").attr("src", "../../images/el_payroll/icon_checked.png");

            $user_item.addClass("is_choose");
            $user_item.find("img").attr("src", "../../images/el_payroll/icon_checked.png");
        }

    },
    //是否 已经全部选择
    IsChooseAll: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $item = $left_side.find(".user_list").find(".item");
        var $choose_container = $left_side.find(".operate_container .choose_item");

        var chooseNo = 0;//选中的个数
        for (var i = 0; i < $item.length; i++) {
            if ($item.eq(i).hasClass("is_choose")) { //如果 是选中的
                chooseNo += 1;
            }
        }

        //没有全部选中
        if (chooseNo === 0 || chooseNo < $item.length) {
            $choose_container.removeClass("is_choose");
            $choose_container.find("img").attr("src", "../../images/el_payroll/icon_Unchecked.png");
        }
        else {
            $choose_container.addClass("is_choose");
            $choose_container.find("img").attr("src", "../../images/el_payroll/icon_checked.png");
        }

    },

    //删除
    userDel: function () {

        //判断是否选择了 用户
        if (!salary_history.checkUserChoose()) {
            return;
        }

        delMsgShow(
            "删除后该工资条将彻底从服务器上删除，且不可撤销！",
            "",
            function () {

                var obj = {
                    salaryInfoId: salary_history.salary_month_id,
                    empId: salary_history.userChooseArr
                };

                loadingInit();

                branPostRequest(
                    urlGroup.salary_history_user_del,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            toastr.success("删除成功！");

                            var $left_side = $salary_info_container.find(".left_side");
                            var $user_item = $left_side.find(".user_list").find(".item.is_choose");

                            $user_item.remove();

                            salary_history.IsChooseAll();//是否 已经全部选择

                            //如果 是局部删除
                            if ($left_side.find(".user_list").find(".item").length > 0) {
                                salary_history.salaryInfoByMonth();//
                            }
                            else {
                                salary_history.salaryYearList();
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

            }
        )

    },
    //导出签收表
    userSignExport: function () {

        //判断是否选择了 用户
        if (!salary_history.checkUserChoose()) {
            return;
        }

        operateMsgShow(
            "是否确定要导出签收表？",
            "",
            function () {

                var obj = {
                    salaryInfoId: salary_history.salary_month_id,
                    empId: salary_history.userChooseArr
                };

                loadingInit();

                branPostRequest(
                    urlGroup.salary_export,
                    obj,
                    function (data) {
                        //alert(JSON.stringify(data))

                        if (data.code === RESPONSE_OK_CODE) {

                            if (data.result) {

                                var url = data.result.url ? data.result.url : "";
                                if (!url) {
                                    toastr.warning("无法下载，下载链接为空！");
                                    return;
                                }

                                toastr.success("导出成功！");

                                var aLink = document.createElement('a');
                                aLink.download = "";
                                aLink.href = url;
                                aLink.click();

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

            }
        )

    },
    //检查是否 选择用户
    checkUserChoose: function () {
        var txt = "";
        var flag = true;

        salary_history.userChooseArr = [];
        var $left_side = $salary_info_container.find(".left_side");
        var $user_item = $left_side.find(".user_list").find(".item.is_choose");

        if ($user_item.length <= 0) {
            txt = "请选择用户！";
        }
        else {

            for (var i = 0; i < $user_item.length; i++) {

                var id = $user_item.eq(i).attr("data-id");
                salary_history.userChooseArr.push(id);

            }

        }

        if (txt) {
            toastr.warning(txt);
            flag = false;
        }

        return flag;

    },

    //获取 员工详情
    userDetail: function () {

        var $left_side = $salary_info_container.find(".left_side");
        var $user_list = $left_side.find(".user_list");
        var $item = $user_list.find(".item.active");

        var $right_side = $salary_info_container.find(".right_side");
        var $salary_detail_container = $right_side.find(".salary_detail_container");
        var $salary_detail = $salary_detail_container.find(".salary_detail");
        // $salary_detail.empty();

        if ($item.length <= 0) {
            toastr.warning("请先选择用户！");
            return;
        }

        //如果工资条详情 已显示
        if ($salary_detail.hasClass("show")) {
            $salary_detail.removeClass("show");
            $salary_detail.slideUp("slow");
        }
        else {

            var obj = {
                salaryInfoId: salary_history.salary_month_id,
                salaryUserId: salary_history.salary_user_id
            };

            loadingInit();

            branPostRequest(
                urlGroup.user_salary_info,
                obj,
                function (data) {
                    //alert(JSON.stringify(data))

                    if (data.code === RESPONSE_OK_CODE) {

                        if (data.result) {

                            //清空
                            $salary_detail.empty();

                            var salary = data.result.salary ? data.result.salary : "";//
                            if (salary) {

                                var key = salary.title ? salary.title : "";//
                                var value = salary.value ? salary.value : "";//

                                var $row = $("<div>");
                                $row.appendTo($salary_detail);
                                $row.addClass("row");

                                //key
                                var $key = $("<div>");
                                $key.appendTo($row);
                                $key.addClass("key");
                                $key.addClass("col-xs-3");
                                $key.text(key);

                                //value
                                var $value = $("<div>");
                                $value.appendTo($row);
                                $value.addClass("value");
                                $value.addClass("pull-right");
                                $value.addClass("col-xs-9");
                                $value.text(value);

                            }

                            var other = data.result.other ? data.result.other : [];//
                            $.each(other, function (i, $item) {

                                var key = $item.title ? $item.title : "";//
                                var value = $item.value ? $item.value : "";//

                                var $row = $("<div>");
                                $row.appendTo($salary_detail);
                                $row.addClass("row");

                                //key
                                var $key = $("<div>");
                                $key.appendTo($row);
                                $key.addClass("key");
                                $key.addClass("col-xs-3");
                                $key.text(key);

                                //value
                                var $value = $("<div>");
                                $value.appendTo($row);
                                $value.addClass("value");
                                $value.addClass("pull-right");
                                $value.addClass("col-xs-9");
                                $value.text(value);

                            });

                            $salary_detail.addClass("show");
                            $salary_detail.slideDown("slow");

                        }
                        else {
                            toastr.warning(data.msg);
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

        }

    }


};

$(function () {

    salary_history.init();

});



