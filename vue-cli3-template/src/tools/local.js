export default {
    set(key, val){
        localStorage.setItem(key, JSON.stringify(val))
    },
    get(key){
        let obj = localStorage.getItem(key);
        if(obj){
            try{
                return JSON.parse(obj);
            } catch(e) {
                localStorage.removeItem(key);
            }
        }
        return null;
    },
    remove(key){
        localStorage.removeItem(key);
    }
}