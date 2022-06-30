export default {
    paths: [],
    animation: 'none',
    /**
     * 保留当前页面，跳转到应用内的某个页面
     * @param opt
     */
    push(opt) {
        // console.log('push', opt);
        let obj = {
            animationType: this.animation
        };
        if (typeof opt == 'string') {
            obj.url = opt;
        } else {
            obj = opt;
        }
        this.paths.push(obj.url);
		// console.log(obj);
        uni.navigateTo(obj);
    },
    /**
     * 关闭当前页面，跳转到应用内的某个页面。
     * @param url
     */
    replace(url) {
        let len = this.paths.length;
        if (len > 0) {
            this.paths[len - 1] = url;
        } else {
            this.paths.push(url);
        }
        uni.redirectTo({url: url});
    },
    /**
     * 后退
     * @param delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
     */
    back(delta) {
        delta = delta || 1;
        let max = this.paths.length - 1 - delta;
        max = max < 0 ? 0 : max;
        this.paths = this.paths.filter((item, index) => {
            return index <= max;
        });
        uni.navigateBack({
            delta: delta,
            animationType: this.animation
        });
    },
    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
     * @param path 需要跳转的 tabBar 页面的路径（需在 pages.json 的 tabBar 字段定义的页面），路径后不能带参数
     */
    switchTab(path) {
        this.paths = [];
        uni.switchTab({
            url: path,
        });
    },
    /**
     * 关闭所有页面，打开到应用内的某个页面。
     */
    reLaunch(path) {
        this.paths = [];
        uni.reLaunch({
            url: path
        });
    }
}
