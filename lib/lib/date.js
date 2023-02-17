import base from './base.js';
const ONE_DAY = 1000 * 60 * 60 * 24;

export default {
    toTimeStr(time) {
        time = time / 1000;
        let h = parseInt(time / 60 / 60 % 24 , 10);
        let m  = parseInt(time / 60 % 60, 10);
        time = parseInt(time % 60, 10);
        let str = h + ' 时 ' +
            m + ' 分 ' +
            time + ' 秒';
        return str;
    },
    parseDate(date) {
        if (!date) {
            return null;
        }
        if (typeof date == 'object') {//date 对象
            return date;
        }
        if (typeof date == 'string') {
            //yyyy-MM-dd hh:mm:ss -> yyyy-MM-ddThh:mm:ss
            date = date.replace(' ', 'T');
            return new Date(Date.parse(date));
        }
        if (typeof date == 'number') {//时间戳
            let t = new Date();
            t.setTime(date);
            return t;
        }
        return null;
    },
    formatDate(date, formatStr) {
        try {
            date = this.parseDate(date);
            if(!date) {
                return 'N/A';
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
    },
    getDiffDay(type) {
        let now = new Date();
        let weekDay = now.getDay();
        let start = new Date();

        switch (type) {
            case 'today'://今天
                break;
            case 'yesterday'://昨天
                start.setMilliseconds(now.getTime() - ONE_DAY * 1);
                now.setMilliseconds(start.getTime());

                now.setHours(23);
                now.setMinutes(59);
                now.setMilliseconds(59);
                break;
            case 'week'://本周
                start.setTime(now.getTime() - ONE_DAY * weekDay);
                break;
            case 'lastWeek'://上周
                now.setTime(start.getTime() - ONE_DAY * weekDay);
                start.setTime(now.getTime() - ONE_DAY * 7);
                break;
            case 'month'://本月
                let date = now.getDate() - 1;
                start.setTime(start.getTime() - ONE_DAY * date);
                break;
            case 'near30'://最近30天
                start.setTime(now.getTime() - ONE_DAY * 30);
                break;
            default:
                start.setTime(now.getTime() - ONE_DAY * Number(type));
                break;
        }
        start.setHours(0);
        start.setMinutes(0);
        start.setMilliseconds(0);
        return [start, now];
    },

}
