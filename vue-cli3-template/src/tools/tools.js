window._DEBUG_ = process.env.NODE_ENV != 'production';

let ONE_DAY = 1000 * 60 * 60 * 24;

function log() {
    if (TOOLS.DEBUG) {
        let arg = [], style = 'color:#ff0000';
        for (let i = 0; i < arguments.length; i++) {
            arg.push('%c' + arguments[i]);
            arg.push(style);
        }
        try {
            console.log.apply(console, arg);
        } catch (e) {
            console.log(arg);
        }
    }
}

let TOOLS = {
    DEBUG: window._DEBUG_,
    _toast_timer_: null,
    ajaxReqFilter: [],
    ajaxResFilter: [],
    debugTouchCount: 0,
    debugTouchOpenTotal: 20,
    debugTouchActiveTime: 0,
    initDebugSwitch(sel) {
        let dom = document.querySelector(sel);
        if (dom) {
            let self = this;
            dom.addEventListener('click', function (e) {
                if (self.debugTouchActiveTime > 0 && Date.now() - self.debugTouchActiveTime > 500) {
                    //每次点击间隔不能超过500ms
                    self.debugTouchCount = 0;
                }
                self.debugTouchActiveTime = Date.now();
                self.debugTouchCount++;
                if (self.debugTouchCount > 15) {
                    self.showToast('再点击 ' + (self.debugTouchOpenTotal - self.debugTouchCount) + ' 次开启调试模式');
                }
                if (self.debugTouchCount >= self.debugTouchOpenTotal) {
                    self.DEBUG = true;
                    self.showToast('调试模式已开启')
                }

            }, false);
        }
    },
    VUEDEBUG() {
        log('debug');
    },
    attr(arr, obj) {
        if (Array.isArray(arr)) {
            arr.forEach((item) => {
                for (let f in obj) {
                    item[f] = obj[f];
                }
            });
        }
    },
    clear(data) {
        data = data || {};
        let keys = Object.keys(data);
        keys.forEach(k => {
            let type = typeof data[k];
            switch (type) {
                case 'string':
                    data[k] = '';
                    break;
                case 'number':
                    data[k] = 0;
                    break;
                case 'boolean':
                    data[k] = false;
                    break;
                case 'object':
                    if (Array.isArray(data[k])) {
                        data[k] = [];
                    } else {
                        this.clear(data[k]);
                    }
                    break;
            }
        })

    },
    clone(dest, src, lvl) {
        if (lvl && lvl <= 0) return false;
        for (let f in dest) {
            let type = (typeof dest[f]).toLocaleLowerCase();
            if (type == 'object') {
                if (Array.isArray(dest[f])) {//array = object,
                    dest[f] = src[f];
                } else if (dest[f] == null) {//null = object
                    dest[f] = src[f];
                } else if (!this.clone(dest[f], src[f], lvl ? lvl - 1 : undefined)) {//true object
                    dest[f] = src[f];
                }
            } else {
                switch (type) {
                    case 'string':
                    case 'number':
                    case 'boolean': {
                        try {
                            dest[f] = src[f];
                        } catch (e) {
                            if (this.DEBUG) {
                                log('clone error:' + e.message);
                            }
                        }
                    }
                }
            }
            log(f + '\t -> \t' + typeof dest[f] + '  ' + dest[f]);
        }
        return true;
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
                let date = now.getDate();
                start.setTime(start.getTime() - ONE_DAY * date);
                break;
            case 'near30'://最近30天
                start.setTime(now.getTime() - ONE_DAY * 30);
                break;
        }
        start.setHours(0);
        start.setMinutes(0);
        start.setMilliseconds(0);
        return [start, now];
    },
    parseDate(str) {
        if (typeof str == 'object') {
            return str;
        }
        str = str.replace(' ', 'T');
        return new Date(Date.parse(str));
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
    },
    formatFileSize(len) {
        len = Number(len);
        if (len < 1024) {
            return len + 'Byte';
        } else if (len < 1024 * 1024) {
            return (len / 1024).toFixed(2) + 'KB';
        } else {
            return (len / 1024 / 1024).toFixed(2) + 'MB';
        }
    },
    getQueryString(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    },
    IsRollToBottom(offset, dom) {
        offset = offset || 0;
        dom = dom || document.body;
        let scrollTop = dom.scrollTop;
        let clientHeight = dom.clientHeight;
        let scrollHeight = dom.scrollHeight;
        /*console.log(scrollTop, clientHeight, scrollHeight);*/
        if (scrollTop + clientHeight + offset >= scrollHeight) {
            return true;
        }
        return false;
    },
    showToast(msg, timeout) {
        clearTimeout(this._toast_timer_);
        let toast = document.querySelector('#tmp_toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tmp_toast';
            document.body.appendChild(toast);
        }
        if (!msg) msg = '';
        toast.innerHTML = msg;
        toast.style.display = 'block';
        toast.style.opacity = 0.8;
        toast.style.left = ((document.body.clientWidth >> 1) - (toast.clientWidth >> 1)) + 'px';

        this._toast_timer_ = setTimeout(function () {
            toast.style.opacity = 0;
            setTimeout(function () {
                toast.style.display = 'none';
            }, 400);
        }, timeout || 2000);
    },
    showWait(msg) {
        let wait = document.querySelector('#tmp_wait');
        let bg = document.querySelector('#tmp_wait_bg');
        if (!wait) {
            wait = document.createElement('div');
            bg = document.createElement('div');
            wait.id = 'tmp_wait';
            bg.id = 'tmp_wait_bg';
            wait.innerHTML = '<div><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></div><div id="tmp_wait_content"></div>';
            document.body.appendChild(wait);
            document.body.appendChild(bg);
        }
        if (!msg) msg = '';
        document.querySelector('#tmp_wait_content').innerHTML = msg;
        bg.style.display = 'block';
        bg.style.opacity = 0.5;
        //wait.innerHTML += msg;
        wait.style.display = 'block';
        wait.style.opacity = 1;
        wait.style.left = ((document.body.clientWidth >> 1) - (wait.clientWidth >> 1)) + 'px';
    },
    hideWait() {
        let wait = document.querySelector('#tmp_wait');
        let bg = document.querySelector('#tmp_wait_bg');
        if (wait && bg) {
            bg.style.opacity = 0;
            wait.style.opacity = 0;
            setTimeout(function () {
                wait.style.display = 'none';
                bg.style.display = 'none';
            }, 200);
        }
    },
    cookie(key, value, options) {
        options = options || {};
        if (value !== undefined) {
            options.time = options.time || 24 * 60 * 60 * 1000;
            options.domain = options.domain || '/';
            let exp = new Date();
            exp.setTime(exp.getTime() + options.time);
            let str = key + "=" + encodeURIComponent(value) + ";expires=" + (Number(options.time) < 1 ? options.time : exp.toUTCString());
            str += ';path=' + options.domain;
            document.cookie = str;
        } else {
            let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return decodeURIComponent(arr[2]);
            else return '';
        }
    },
    copy(sel) {
        let dom = document.querySelector(sel);
        let input = document.createElement('input');
        input.value = dom.innerText;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        //input.style.display = 'none';
        document.body.removeChild(input);
    },
    selectFile(fun) {
        let input = document.createElement('input');
        input.type = 'file';
        //input.accept = 'image/*';
        input.onchange = function () {
            //console.log('change', input, this, this.files);
            if (this.files && this.files.length > 0) {
                fun(this.files);
            }
            document.body.removeChild(input);
        }
        input.style.width = '1px';
        input.style.height = '1px';
        input.style.opacity = 0.1;
        document.body.appendChild(input);
        input.click();
    },
    reSizeImg(file, size) {
        /*从文件读取图片并压缩*/
        let start = Date.now();
        console.log('压缩前大小:', file.size);
        return new Promise((res, rej) => {
            try {
                let reader = new FileReader();
                reader.onload = function () {
                    let img = new Image();
                    img.src = this.result;
                    img.onload = function () {
                        let self = this;
                        let w = self.width,
                            h = self.height,
                            scale = w / h,
                            quality = 0.7;
                        w = size.width;
                        h = size.height || (w * scale);

                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        let anw = document.createAttribute("width");
                        anw.nodeValue = w;
                        let anh = document.createAttribute("height");
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        ctx.drawImage(self, 0, 0, w, h);
                        canvas.toBlob((f) => {
                            console.log('压缩后大小:', f.size, '压缩用时:', Date.now() - start);
                            res(f);
                        })
                    }
                }
                reader.readAsDataURL(file);
            } catch (e) {
                rej(e);
            }
        });

    },
    getObjectURL(file) {
        if (!file) {
            return '';
        }
        let url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    isIE() {
        return !isNaN(Number(document.documentMode));
    },
    isEdge() {
        return  navigator.userAgent.indexOf('Edge') > -1;
    },
    isFirefox() {
        return !!window.navigator.userAgent.match(/firefox/i);
    },
    androidInputBugFix() {
        if (/Android/gi.test(navigator.userAgent)) {
            window.addEventListener('resize', function () {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoView();
                    }, 0);
                }
            })
        }
    },
    ttl(str, autoPlay) {
        let audio = document.querySelector('#_ttl_audio_');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = '_ttl_audio_';
            if (autoPlay) {
                audio.setAttribute('autoplay', 'autoplay');
            } else {
                audio.removeAttribute('autoplay', 'autoplay');
            }
            document.body.appendChild(audio);
        }
        //audio.innerHTML = '<source src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=4&text=' + str + '" type="audio/mpeg">';
        audio.src = 'http://tts.baidu.com/text2audio?lan=zh&per=3&ie=UTF-8&spd=4&text=' + str;
        if (autoPlay) {
            //audio.play();
        }
        return audio;
    },
    randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    },
    IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    },
    getId(str) {
        this._id_++;
        return (str || 'id_') + this._id_;
    },
    log() {
        /*_DEBUG_ 开启时才会输出日志*/
        log.apply(this, arguments);
    },
    saveAs(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url);
        }
        let aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || '';
        let event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    },
    sortArray(type, arr, column) {
        let asc = type == 'asc';
        arr.sort((_a, _b) => {
            let a = column ? _a[column] : _a, b = column ? _b[column] : _b;
            let res = false;
            if (typeof a == 'number' && typeof b == 'number') {
                res = asc ? a - b : b - a;
            } else {
                res = asc ? a.localeCompare(b) : b.localeCompare(a);
            }
            return res;
        });
    },
    arrToString(arr, c) {
        let str = [];
        arr.forEach(item => {
            str.push(item[c]);
        });
        return str.join(',');
    },
    saveAs(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url);
        }
        let aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || '';
        let event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    },
    ObjHas(obj, key) {
        try{
            let keys = key.split('.');
            let _obj = obj;
            for(let i = 0; i < keys.length; i++){
                if(!_obj.hasOwnProperty(keys[i])){
                    return false;
                }
                _obj = _obj[keys[i]];
            }
            return true;
        } catch(e){

        }

        return false;
    },
    ObjGet(obj, key){
        try{
            let keys = key.split('.');
            let _obj = obj;
            for(let i = 0; i < keys.length; i++){
                if(!_obj.hasOwnProperty(keys[i])){
                    return ;
                }
                _obj = _obj[keys[i]];
            }
            return _obj;
        } catch(e){

        }
    }
};
log('tools code by or: \n\t\thttps://github.com/zh-or\n\t\thttps://gitee.com/O_R_admin');
TOOLS.androidInputBugFix();

export default TOOLS;
