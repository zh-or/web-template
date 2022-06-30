/*code by or v0.1*/
export default {
    /*防止重复执行, 等待先执行的方法执行完毕直接拿结果*/
    single: {},
    peek(key){
        return this.single.hasOwnProperty(key);
    },
    lock(key){
        if(this.peek(key)){
            return false;
        }
        let obj = {
            waitList: [],
            self: this,
            key: key,
            wait(){
                throw new Error('你不能自己锁住, 然后再自己wait!!!');
            },
            notify(){
                this.self.notify(this.key);
            }
        }
        this.single[key] = obj;
        return obj;
    },
    wait(key, timeout){
        timeout = timeout || 0;
        return new Promise( (resolve, reject) => {
            if(this.peek(key)){
               let s = this.single[key];
               if(timeout > 0){
                   let t = setTimeout(() => {
                       if(s.waitList.concat(resolve)){
                           for(let i = s.waitList.length - 1; i >= 0; i --){
                               if(s.waitList === resolve){
                                   s.waitList.splice(i, 1);
                               }
                           }
                           if(s.waitList.length <= 0){
                                delete this.single[key];
                           }
                       }
                       clearTimeout(t);
                   }, timeout);
               }
               s.waitList.push(resolve);
            } else {
                resolve();
            }
        });
    },
    notify(key){
        if(this.peek(key)){
            let s = this.single[key];
            s.waitList.forEach(wait => {
                wait();
            })
            delete this.single[key];
        }
    }
}
