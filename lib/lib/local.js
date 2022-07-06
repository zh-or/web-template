export default {
    setLocal(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },
    getLocal(key, def) {
        def = typeof def == 'undefined' ? null : def;
        let obj = localStorage.getItem(key);
        if (obj) {
            try {
                return JSON.parse(obj);
            } catch (e) {
                localStorage.removeItem(key);
            }
        }
        return def;
    },
    removeLocal(key) {
        localStorage.removeItem(key);
    }
}
