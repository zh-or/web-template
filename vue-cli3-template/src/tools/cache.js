import t from '@/tools/tools';
import notify from '@/tools/notify';

let CACHE_TIMEOUT     = 30 * 1000;//缓存过期时间

let CACHE_SCHOOL_LIST = 'CACHE_SCHOOL_LIST';

t.ajaxReqFilter.push( (par) => {
    for(let i in par.data){
        if(par.data[i] === null || par.data[i] === ''){
            if(t.DEBUG){
                console.log('delete:' + i);
            }
            delete par.data[i];
        }
    }
});

function getAllData(cache_key, fun, par, callback){
    callback = callback || function(res){
        if(res.data.code == 200){
            return res.data.data;
        } else {
            console.error('获取全部数据出错:', res);
            return false;
        }
    };
    par = par || {};
    let data = [], page = 1;
    async function _do(){
        if(cache_key){
            let tmp = cache.cache.get(cache_key);
            if(tmp){
                return tmp;
            }
        }
        while(true){
            try{
                par.page = page;
                par.size = 20;
                let res = callback(await fun(par));
                if(res){
                    data = data.concat(res);
                    page ++;
                    if(res.length < par.size){
                        break;
                    }
                } else {
                    break;
                }
            } catch(e) {
                console.error('获取全部数据出错:', e);
                break;
            }
        }
        if(cache_key){
            cache.cache.set(cache_key, data);
        }
        return data;
    }
    return new Promise( (resolve, reject) => {
        try{
            let tNotify = notify.lock(cache_key);
            if(!tNotify){
                notify.wait(cache_key)
                    .then( () => {
                        let res = _do();
                        resolve(res);
                    });
            } else {
                let res = _do();
                resolve(res);
                tNotify.notify();
            }
        } catch(e ){
            reject(e);
        }
    })
}

let cache = {
    cache: {
        set(key, val, timeout){
            let obj = {
                date: Date.now(),
                data: val,
                timeout: timeout || CACHE_TIMEOUT
            }
            sessionStorage.setItem(key, JSON.stringify(obj));
        },
        get(key){
            let res = sessionStorage.getItem(key);
            if(res){
                let obj = JSON.parse(res);
                if(Date.now() - obj.date <= obj.timeout){
                    console.log('from cache:' + key);
                    return obj.data;
                }
                /*已超时*/
                sessionStorage.removeItem(key);
            }
            return null;
        },
        clear(){
            sessionStorage.clear();
        }
    },

    getAllSchoolList(){

        return getAllData(
            CACHE_SCHOOL_LIST,
            this.getSchoolList,
            {pid: 2}
        );
    },
    getSchoolList(data){
        data = data || {};
        return t.post('xx', data);
    }

}


export default cache;
