export default{
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
