const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]{8,18}$/;
const emailReg = /\w@\w*\.\w/;
const urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
const azNumReg = /^[0-9a-zA-Z]{1,}$/;//a-zA-z0-9
const mobile = /^1[3456789]\d{9}$/;//手机
const postCode = /^[1-9][0-9]{5}$/;//邮编
const nonInteger = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//非负整数 含0
const idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//简单身份证号码验证

function validateUrl(rule, value, callback) {
    if (value && !urlReg.test(value)) {
        callback(new Error('链接格式不正确'));
    } else {
        callback();
    }
}

/*字段验证规则*/
let rulesObj = {

    email: [
        {required: true, message: '请输入邮箱', trigger: 'blur'},
        {pattern: emailReg, message: '邮箱格式不正确'}
    ],

    /*必填*/
    reqInput: [
        {required: true, message: '必填项不能为空', trigger: 'blur'}
    ],

    reqSelect: [
        {required: true, message: '请选择', trigger: 'change'}
    ],

    /*必须上传文件*/
    reqFile: [
        {required: true, message: '请上传文件', trigger: 'blur'}
    ],

    /*必填, 格式验证*/
    reqUrl: [
        {required: true, message: '请输入链接地址', trigger: 'blur'},
        {pattern: urlReg, message: "链接格式不正确"}
    ],

    /*必填, 格式验证*/
    reqIdCard: [
        {required: true, message: '请输入身份证号', trigger: 'blur'},
        {pattern: idCard, message: "身份证格式不正确"}
    ],

    /*必填, 字母或数字*/
    reqAzNum: [
        {required: true, message: '请输入链接地址', trigger: 'blur'},
        {pattern: azNumReg, message: "只能输入字母或数字"}
    ],

    reqMobile: [
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {pattern: mobile, message: "手机号格式不正确"}
    ],

    /*只验证格式, 如果没有输入则不提示*/
    url: [
        {validator: validateUrl, trigger: 'blur'}
    ],

};

/**
 * 少部分验证时使用
 * @param name
 * @returns {*|*[]}
 */
export const getRule = function (name, msg) {
    let rule = rulesObj[name] || [{required: true, message: msg || '必填项不能为空', trigger: 'blur'}];
    let res = [];
    for (let i = 0; i < rule.length; i++) {
        let obj = {...rule[i]};
        if (obj.required && msg) {
            obj.message = msg;
        }
        res.push(obj);
    }
    return res;
}


//验证规则
export const rules = rulesObj;
