import { ElMessage, ElMessageBox, ElNotification} from 'element-plus'

export default {
    showInput(msg, title, opt) {
        opt = opt || {};
        return new Promise((resolve, reject) => {
            ElMessageBox.prompt(msg, title, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: opt.inputPattern,
                //inputValidator: (v) => !!v,//判断方法
                inputErrorMessage: opt.inputErrorMessage || '不能为空',
            })
            .then(({ value }) => resolve(value))
            .catch((e) => resolve(null))
        });
    },
    showInfo(msg, title, html = false, customStyle) {
        return new Promise((resolve, reject) => {
            ElMessageBox.alert(msg, title || '', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: '确定',
                customStyle: customStyle,
                dangerouslyUseHTMLString: html,
                callback: (action) => {
                    resolve();
                }
            })
        })
    },
    confirm(msg, title) {
        return ElMessageBox.confirm(msg, title, {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        });
    },
    info(msg) {
        ElMessage({
            message: msg,
            type: 'info',
        })
    },
    warning(msg) {
        ElMessage({
            message: msg,
            type: 'warning',
        })
    },
    danger(msg) {
        ElMessage({
            message: msg,
            type: 'danger',
        })
    },
    success(msg) {
        ElMessage({
            message: msg,
            type: 'success',
        })
    },
    error(msg) {
        ElMessage({
            message: msg,
            type: 'error',
        })
    },
    // 通知提示
    notify(content) {
        if(typeof content === 'string') {
            content = {
                message: content,
            }
        }

        return ElNotification({
            ...content,
        })
    },
    // 错误通知
    notifyError(content) {
        if(typeof content === 'string') {
            content = {
                message: content,
            }
        }
        return ElNotification({
            ...content,
            type: 'error',
        })
    },
    // 成功通知
    notifySuccess(content) {
        if(typeof content === 'string') {
            content = {
                message: content,
            }
        }
        return ElNotification({
            ...content,
            type: 'success',
        })
    },
    // 警告通知
    notifyWarning(content) {
        if(typeof content === 'string') {
            content = {
                message: content,
            }
        }
        return ElNotification({
            ...content,
            type: 'warning',
        })
    },
}
