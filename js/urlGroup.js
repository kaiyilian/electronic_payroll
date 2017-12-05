/**
 * Created by Administrator on 2017/11/16.
 *
 */

var $host = "/bran-core/";//本地
// var $host = "http://192.168.12.246:5872/bran-core/";//本地

var urlGroup = {

    // //公用 上传
    // file_upload: $host + "salary/file/upload",

    /**
     * 电子工资单 - 登录
     * */

    //用户登录
    user_login: $host + "salary/login",

    //验证 用户是否存在 POST
    check_user_is_exist: $host + "salary/islogin",
    //获取验证码 POST
    verification_code_url: $host + "salary/sendcode",

    /**
     * 电子工资单 - 新建页面
     * */

    //收取默认工资单 POST
    receive_default_salary: $host + "salary/send/imitation",
    //获取 用户姓名、公司名称，检验用户信息是否完整 POST
    check_user_info_is_complete: $host + "salary/getuser/info",
    //上传工资单 POST
    salary_excel_upload: $host + "salary/file/upload",

    //获取 有效期 GET
    salary_validity: $host + "salary/validity/get",
    //保存 有效期 POST
    salary_validity_save: $host + "salary/validity",

    //获取导入的员工列表
    import_user_list: $host + "salary/getuser",
    //获取员工薪资 详情
    user_salary_info: $host + "salary/getsalary",
    //发送 信息
    user_salary_send: $host + "salary/send",

    /**
     * 电子工资单 - 历史页面
     * */

    //获取 当前用户所有导入薪资条的历史(年月) POST
    salary_history_yearMonth: $host + "salary/history",
    //获取这一批次全部导入的用户 POST
    salary_history_info: $host + "salary/history/getalluser",
    //搜索用户 POST
    salary_user_search: $host + "salary/history/getempuser",
    //删除 用户 POST
    salary_history_user_del: $host + "salary/history/user/delete",
    //导出 签收表 POST
    salary_export: $host + "salary/export",

    /**
     * 电子工资单 - 移动端
     * */

    //获取薪资基本 GET
    salary_load: $host + "salary/load",
    //查询薪资 POST
    salary_query: $host + "salary/check",
    //薪资详情  POST
    salary_detail: $host + "salary/info"

};