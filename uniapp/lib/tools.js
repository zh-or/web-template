function _calc(a, m, b) {
    let _a = Number(Number(a).toFixed(2)) * 100,
        _b = Number(Number(b).toFixed(2)) * 100;

    let r;
    switch(m) {
        case '+': r = _a + _b; break;
        case '-': r = _a - _b; break;
        case '*': r = _a * _b; break;
        case '/': r = _a / _b; break;
        default:
            r = 0;
    }
    return r / 100;
}

function _calcEx() {
    let params = [...arguments];
    let res, m;
    params.forEach(v => {
        if(!res) res = v;
        else if(!m) m = v;
        else {
            res = calc(res, m, v);
            m = null;
        }
    });
    return res;
}

export default {
	showToast(opt){
	    if(typeof opt != 'object'){
	        opt = {
	            title: opt,
	            icon: 'none'
	        }
	    }
	    uni.showToast(opt);
	},
	showWait (opt) {
	    if(typeof opt != 'object'){
	        opt = {
	            title: opt,
	            mask: true
	        }
	    }
	    uni.showLoading(opt);
	},
	hideWait () {
	    uni.hideLoading();
	},
	formatDate(date, formatStr) {
	        try {
	            if (!date) {
	                return '';
	            }
	            if (typeof date == 'string') {
	                date = new Date(Date.parse(date));
	            }
	            if (typeof date == 'number') {
	                let t = new Date();
	                t.setTime(date);
	                date = t;
	            }
	            formatStr = formatStr || 'yyyy-MM-dd hh:mm:ss';
	            let obj = {
	                'M+': date.getMonth() + 1,
	                'd+': date.getDate(),
	                'h+': date.getHours(),
	                'm+': date.getMinutes(),
	                's+': date.getSeconds(),
	                'q+': Math.floor((date.getMonth() + 3) / 3),
	                'S': date.getMilliseconds()
	            };
	            if (/(y+)/.test(formatStr)) {
	                formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	            }
	            for (let k in obj) {
	                if (new RegExp('(' + k + ')').test(formatStr)) {
	                    formatStr = formatStr.replace(
	                        RegExp.$1,
	                        (RegExp.$1.length == 1) ? (obj[k]) : (('00' + obj[k]).substr(('' + obj[k]).length))
	                    );
	                }
	            }
	            return formatStr;
	        } catch (e) {
	
	        }
	        return '';
	    }
}
