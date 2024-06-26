import tools from './tools';

export default {
    paths: [],
    animation: 'none',
    resultSuccess: null,
    resultError: null,
    currentPage() {
        //return this.paths[this.paths.length - 1];

        let pages = getCurrentPages();
        if(pages.length > 0) {
            return '/' + pages[pages.length - 1].route;
        }
        return '';
    },
    pushForResult(opt, params) {
        return new Promise((resolve, reject) => {
            this.resultSuccess = resolve;
            this.resultError = reject;
            this.push(opt, params);
        });
    },
    setResult(data, back = true) {
        try {
            this.resultSuccess && this.resultSuccess(data);
        } catch(e) {
            this.resultError && this.resultError(e);
        }
        if(back) {
            this.back(1);
        }
    },
    /**
     * 保留当前页面，跳转到应用内的某个页面
     * @param opt
     */
    push(opt, params) {
        let obj = {
            animationType: this.animation
        };
        if (typeof opt == 'string') {
            obj.url = opt;
        } else {
            obj = opt;
        }
        obj.fail = function(e) {
            console.error('router.push', e);
        }
        let currentUrl = this.currentPage();
        console.log('current:', currentUrl === obj.url, currentUrl, obj.url);

        if(currentUrl === obj.url) {
            obj.fail('重复跳转:' + obj.url);
            return;
        }

        if(params && typeof params === 'object') {
            let parStr = tools.objToQueryString(params);
            if(obj.url.indexOf('?') != -1) {
                obj.url += ('&' + parStr);
            } else {
                obj.url += ('?' + parStr);
            }
        }

        this.paths.push(obj.url);

        /*
                console.log(
                    this.currentPage(),
                    obj.url,
                    this.currentPage() === obj.url,
                    this.paths
                );*/

        uni.navigateTo(obj);
    },
    /**
     * 关闭当前页面，跳转到应用内的某个页面。
     * @param url
     */
    replace(url, animationType) {
        let len = this.paths.length;
        if (len > 0) {
            this.paths[len - 1] = url;
        } else {
            this.paths.push(url);
        }

        if(animationType && typeof animationType === 'object') {
            let parStr = tools.objToQueryString(animationType);
            if(url.indexOf('?') != -1) {
                url += ('&' + parStr);
            } else {
                url += ('?' + parStr);
            }
            animationType = '';
        }

        uni.redirectTo({
            url: url,
            animationType: animationType || 'none',
            fail : function(e) {
                console.error('router.replace', e);
            }
        });
    },
    /**
     * 后退
     * @param delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
     */
    back(delta) {
        delta = delta || 1;
        let max = this.paths.length - 1 - delta;
        max = max < 0 ? 0 : max;
        this.paths = this.paths.splice(0, max);
        uni.navigateBack({
            delta: delta,
            animationType: this.animation
        });
    },
    delayBack(time) {
        setTimeout(_ => {
            this.back()
        }, time || 1000);
    },
    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
     * @param path 需要跳转的 tabBar 页面的路径（需在 pages.json 的 tabBar 字段定义的页面），路径后不能带参数
     */
    switchTab(path) {
        this.paths = [path];
        uni.switchTab({
            url: path,
            fail : function(e) {
                console.error('router.switchTab', e);
            }
        });
    },
    /**
     * 关闭所有页面，打开到应用内的某个页面。
     */
    reLaunch(path) {
        this.paths = [path];
        uni.reLaunch({
            url: path,
            fail : function(e) {
                console.error('router.reLaunch', e);
            }
        });
    }
}
