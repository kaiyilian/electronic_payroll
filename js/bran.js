/**
 * Created by Administrator on 2017/11/13.
 * 公共方法
 */

var RESPONSE_OK_CODE = "1000";
var PERMISSION_DENIED_CODE = "2003";
var SESSION_TIMEOUT_CODE = "2004";

var ajaxSetup = function () {
    $.ajaxSetup({
        accept: 'application/json',
        cache: true,
        contentType: 'application/json;charset=UTF-8',
        // crossDomain: false
    });
};

/**
 * POST方法
 * Parmas:
 * url请求路径，
 * params参数，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branPostRequest = function (url, params, successFunc, errorFunc, token) {

    if (token) {
        $.ajaxSetup({
            headers: {
                token: token
            }
        });
    }

    ajaxSetup();

    $.ajax({
        url: url,
        method: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            //xhr.setRequestHeader('X-Test-Header', 'test-value');
        },
        success: function (data, status, jqXHR) {
            loadingHide();//加载中 - 移除logo

            if (typeof data === "string") {
                //alert(data)
                //data = jQuery.parseJSON(data);//
                data = eval("(" + data + ")");
            }

            //alert(JSON.stringify(data))
            if (data["code"] === PERMISSION_DENIED_CODE) {
                branError("接口没有访问权限");
            }
            else if (data["code"] === SESSION_TIMEOUT_CODE) {
                toastr.warning("时间超时");
            }
            else {
                if (successFunc)
                    successFunc(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrow) {
            loadingHide();//加载中 - 移除logo

            if (XMLHttpRequest.readyState == 0 && XMLHttpRequest.status == 0) {
                toastr.error("网络请求异常！");
            }
            else {
                errorFunc(XMLHttpRequest);
            }
        }
    });
};

/**
 * GET方法
 * Parmas:
 * url请求路径，
 * successFunc请求成功回调方法，
 * errorFunc请求失败回调方法
 */
var branGetRequest = function (url, successFunc, errorFunc) {

    ajaxSetup();
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data, status, jqXHR) {
            loadingHide();//加载中 - 移除logo
            //console.log("类型：" + status);
            //console.info(jqXHR);

            if (jqXHR.readyState == 0 && jqXHR.status == 0) {	//
                console.log("请求未发送！");
            }

            if (typeof data == "string") {
                data = eval("(" + data + ")");
            }

            if (data["code"] == PERMISSION_DENIED_CODE) {
                alert("接口没有访问权限");
            }
            else if (data["code"] == SESSION_TIMEOUT_CODE) {
                toastr.warning("时间超时");
            }
            else {
                if (successFunc) {
                    successFunc(data);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrow) {
            loadingHide();//加载中 - 移除logo

            if (XMLHttpRequest.readyState == 0 && XMLHttpRequest.status == 0) {
                toastr.error("网络请求异常！");
            }
            else {
                errorFunc(XMLHttpRequest);
            }
        }
    });

};

//错误提示
var branError = function (obj) {
    //alert(obj)
    if (typeof obj == "undefined") {
        toastr.error("请求异常,请联系管理员");
    }
    else if (typeof obj == "string") {
        toastr.warning(obj);
        //toastr.error("系统错误：" + obj);
    }
    else {
        if (obj.status) {
            if (obj.status == 500) {
                toastr.error("系统错误，请联系管理员！");
            }
            else if (obj.status == 302) {
                toastr.error("网络连接已断开！");
            }
            else {
                toastr.error("请求异常");
            }
        }
        else {
            toastr.error(JSON.stringify(obj))
        }
    }
};

//获取 前缀
var getInterface = function () {

    //接口前缀
    var $interface = "";

    // var host = location.host;
    // if (host.indexOf("localhost") > -1) {       //本地路径 arya-core的端口
    //     $interface = "http://" + "localhost:8082" + "/";
    // }
    // else if (host.indexOf("248") > -1) {
    //     $interface = "http://192.168.13.248:5872/arya/";
    // }
    // else if (host.indexOf("bumuyun") > -1) {
    //     $interface = "http://bumuyun.com.cn:8085/arya/";
    // }
    // else {
    //     $interface = "http://bumuyun.com.cn:8085/arya/";
    // }

    $interface = location.protocol + "//" + location.host + "/" + location.pathname.split("/")[1];

    return $interface;

};

//加载框 设置
var loadingInit = function () {

    var $body = $("body");

    if ($body.find("#loadingToast").length > 0) {
        return;
    }

    var $loadingToast = $("<div>");
    $loadingToast.attr("id", "loadingToast");
    $loadingToast.css({
        opacity: 1,
        display: "none"
    });
    $loadingToast.appendTo($body);

    var $weui_mask_transparent = $("<div>");
    $weui_mask_transparent.addClass("weui-mask_transparent");
    $weui_mask_transparent.appendTo($loadingToast);

    var $weui_toast = $("<div>");
    $weui_toast.addClass("weui-toast");
    $weui_toast.appendTo($loadingToast);

    var $weui_icon_toast = $("<i>");
    $weui_icon_toast.addClass("weui-icon_toast");
    $weui_icon_toast.addClass("weui-loading");
    $weui_icon_toast.appendTo($weui_toast);

    var $weui_toast__content = $("<p>");
    $weui_toast__content.addClass("weui-toast__content");
    $weui_toast__content.appendTo($weui_toast);
    $weui_toast__content.text("数据加载中");

};
//加载中 显示
var loadingShow = function () {
    $("#loadingToast").show();
};
//加载中 隐藏
var loadingHide = function () {
    $("#loadingToast").hide();
};


//json格式转换为字符串
var jsonParseParam = function (param, key) {
    var paramStr = "";

    if (param instanceof String || param instanceof Number || param instanceof Boolean) {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    }
    else {
        $.each(param, function (i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + jsonParseParam(this, k);
        });
    }

    return paramStr.substr(1);


};

//获取地址栏 参数
var getUrlSession = function () {
    var url = location.search;//如果 后缀为#，则不适用，要用 location.href
    if (url.indexOf("?") > -1) {
        var params = url.substr(url.indexOf("?") + 1, url.length).split("&");

        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");

            sessionStorage.setItem(param[0], param[1]);
            // if (!sessionStorage.getItem(param[0]) || sessionStorage.getItem(param[0]) === "null") {
            //
            //
            //
            // }
        }
    }
};


//将 时间戳转换格式 为 YYYY-MM-DD
var timeInit = function (time) {
    if (time == 0 || time == "" || time == null) {
        return "";
    }
    //debugger
    var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

    time = time.split("/");
    var timeList = "";
    for (var i = 0; i < time.length; i++) {
        if (parseInt(time[i]) < 10) {
            time[i] = "0" + time[i];
        }
        timeList += timeList == "" ? time[i] : ("-" + time[i]);
    }

    //alert(timeList)
    return timeList;

};

//将 时间戳转换格式 为 YYYY-MM
var timeInit1 = function (time) {
    if (time == 0 || time == "" || time == null) {
        return " - - ";
    }
    //debugger
    var time = new Date(time).toLocaleDateString();//转换为 YYYY/MM/DD

    time = time.split("/");
    var timeList = "";
    for (var i = 0; i < time.length - 1; i++) {
        if (parseInt(time[i]) < 10) {
            time[i] = "0" + time[i];
        }
        timeList += timeList == "" ? time[i] : ("-" + time[i]);
    }

    if (timeList.indexOf("9999") > -1) {
        timeList = "至今";
    }
    //alert(timeList)
    return timeList;

};

//将 时间戳转换格式 为 YYYY-MM-DD MM:dd:ss
var timeInit2 = function (time) {
    var timeList = "";

    if (time == 0 || time == "" || time == null) {
    }
    else {
        //var time = new Date(time).toLocaleString();//转换为 YYYY/MM/DD
        var time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        var hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        var min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        var sec = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();

        timeList = year +
            "/" + month +
            "/" + day +
            " " + hour +
            ":" + min +
            ":" + sec;

    }

    //alert(timeList)
    return timeList;

};

//将时间戳 转为 当天0时0分0秒 的时间戳
var timeInit3 = function (time) {

    if (time) {
        time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        time = year + "/" + month + "/" + day + " 00:00:00";
        time = new Date(time).getTime();
    }
    else {
        time = "";
    }

    // console.log("时间：" + time);
    return time;

};

//将时间戳 转为 当天23时59分59秒 的时间戳
var timeInit4 = function (time) {

    if (time) {
        time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        time = year + "/" + month + "/" + day + " 23:59:59";
        time = new Date(time).getTime();
    }
    else {
        time = "";
    }

    // console.log("时间：" + time);
    return time;

};

//将 时间戳转换格式 为 YYYY.MM.DD
var timeInit5 = function (time) {

    if (time) {
        time = new Date(time);//.toLocaleString();//转换为 YYYY/MM/DD

        var year = time.getFullYear();
        var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) :
            (time.getMonth() + 1);
        var day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

        time = year + "." + month + "." + day;
    }
    else {
        time = "";
    }

    return time;

};

/*
 * 参数说明：
 * s：要格式化的数字
 * n：保留几位小数
 * */
var fnum = function (s, n) {

    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
};

$(function () {
    loadingInit();//加载框 设置
});