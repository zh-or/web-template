import t from "./index";

let eventObject = {};
let current_id = 'e-' + t.newGuid();
let message_key = '17683b3b-b7c6-4e26-ae19-9035c19bcb71';

function getEventObj(key) {
    let res = eventObject[key];
    if(!res) {
        res = [];
        eventObject[key] = res;
    }
    return res;
}

function printLog(fun, e, msg) {
    if(eventObj.isDebug) {
        console.log('[EVENT] ', `[${fun}]`, e, msg);
    }
}

let eventObj = {
    isDebug: false,
    debug(open) {
        open = open === undefined ? true : open;
        this.isDebug = open;
    },

    init(e) {
        this.E = e;
    },

    once(event, cb) {
        printLog('once', event);
        let arr = getEventObj(event);
        arr.push({
            type: 'once',
            cb: cb
        });
    },
    on(event, cb) {
        printLog('on', event);
        let arr = getEventObj(event);
        arr.push({
            type: 'every',
            cb: cb
        });
    },
    off(event, cb) {
        printLog('off', event);
        let arr = getEventObj(event);
        for(let i = arr.length - 1; i >= 0; i --) {
            if(arr[i].cb === cb) {
                arr.splice(i, 1);
            }
        }
    },
    emit(event, params, setLocal) {
        printLog('emit', event, params);
        if(setLocal === undefined) {
            setLocal = true;
        }
        let message = {
            t: t.getId(Date.now() + '-'),
            from: current_id,
            e: event,
            data: params
        };

        window.postMessage(message, location.origin);
        setLocal && t.setLocal(message_key, message);
    },
}

window.addEventListener("message", function(e) {
    let arr = getEventObj(e.data.e);
    for(let i = arr.length - 1; i >= 0; i --) {
        arr[i].cb.call(this, e.data.data);
        if(arr[i].type === 'once') {
            arr.splice(i, 1);
        }
    }
}, false);

window.addEventListener("storage", (e) => {
    try {
        let val = JSON.parse(e.newValue);
        if(val.from === current_id) {
            return;
        }
        eventObj.emit(val.e, val.data, false);
    } catch(e2) {
        console.error(e, e2);
    }
});


export default eventObj;
