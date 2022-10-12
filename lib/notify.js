
export default {
    single: {},
    peek(key) {
        return this.single.hasOwnProperty(key);
    },
    lock(key) {
        if(this.peek(key)) {
            return this.single[key];
        }
        let obj = {
            waitList: [],
            self: this,
            key: key,
            wait(timeout) {
                return this.self.wait(key, timeout);
            },
            notify(params){
                this.self.notify(this.key, params);
            }
        }
        this.single[key] = obj;
        return obj;
    },
    wait(key, timeout) {
        timeout = timeout || 0;
        return new Promise( (resolve, reject) => {
            let item = {resolve, reject};
            if(this.peek(key)) {
                let s = this.single[key];
                if(timeout > 0) {
                    let t = setTimeout(() => {
                        let i = s.waitList.indexOf(item);
                        if(i != -1) {
                            s.waitList.splice(i, 1);
                            item.reject(new Error('time out:' + timeout));
                            if(s.waitList.length <= 0){
                                delete this.single[key];
                            }
                            clearTimeout(t);
                        }
                    }, timeout);
                }
                s.waitList.push(item);
            } else {
                reject(new Error('pls call lock fun first.'));
            }
        });
    },
    notify(key, params){
        this.callPromis(true, key, params);
    },
    notifyError(key, params) {
        this.callPromis(false, key, params);
    },
    callPromis(success, key, params) {
        if(this.peek(key)){
            let s = this.single[key];
            s.waitList.forEach(({resolve, reject}) => {
                success ? resolve(params) : reject(params);
            })
            delete this.single[key];
        }
    }
}
