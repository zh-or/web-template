
import base from './base.js';
import obj from './obj.js';
/*
 * 缓动函数
 * @param t 动画已消耗时间
 * @param b 原始值
 * @param c 目标值
 * @param d 持续时间
 * */
const funs = {
    linear: function ( t, b, c, d ) {
        return c * t / d + b;
    },
    easeIn: function ( t, b, c, d ) {
        return c * ( t /= d ) * t + b;
    },
    strongEaseIn: function (t, b, c, d) {
        return c * ( t /= d ) * t * t * t * t + b;
    },
    strongEaseOut: function (t, b, c, d) {
        return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b;
    },
    sineaseIn: function ( t, b, c, d ) {
        return c * ( t /= d) * t * t + b;
    },
    sineaseOut: function (t,b,c,d) {
        return c * ( ( t = t / d - 1) * t * t + 1 ) + b;
    }
}

export default {
    tweenType: 'linear,easeIn,strongEaseIn,strongEaseOut,sineaseIn,sineaseOut'.split(','),
    seriesTween(opt) {
        opt = opt || {};
        opt.type = opt.type || 'linear';
        opt.ts = opt.ts || [];
        opt.time = opt.time || 1000;
        if(opt.ts.length <= 0) {
            throw new Error('动画队列[ts]不能为空.');
        }
        let cancel = {
            obj: null,
            isCanceled: false,
            cancel: function() {
                if(this.obj) {
                    obj.cancel();
                }
                this.isCanceled = true;
            }
        };
        let runAnim = (bound) => {
            if(bound >= opt.ts.length) {
                return;
            }
            let item = opt.ts[bound];
            cancel.obj = this.tween(opt.type, item.form, item.to, opt.time, (v, end) => {
                opt.cb && opt.cb(v, end);
                if(end) {
                    runAnim(bound ++);
                }
            });
        }
        runAnim(0);
        return cancel;
    },
    tween(type, from, to, time, callback) {

        let start = - 1, runTime = 0, cancel = {
            id: null,
            isCanceled: false,
            cancel: function() {
                this.id && cancelAnimationFrame(this.id);
                this.isCanceled = true;
            }
        };
        let run = (t) => {
            if(cancel.isCanceled) {
                return;
            }
            if(start === -1) {
                start = t;
            }
            runTime = t - start;
            let fun = funs[type];
            if(fun) {
                let v = null;
                if(typeof from === 'object') {
                    v = {};
                    for(let k in from) {
                        if(to && to.hasOwnProperty(k)) {
                            v[k] = fun(runTime, from[k], to[k], time);
                            if(v[k] >= to[k]) {
                                v[k] = to[k];
                            }
                        }
                    }
                } else {
                    v = fun(runTime, from, to, time);
                    if(v > to) {
                        v = to;
                    }
                }
                callback(v, runTime >= time);
            } else {
                console.error('tween type is not support:', type);
            }
            if(runTime < time) {
                cancel.id = requestAnimationFrame(run);
            }
        }

        cancel.id = requestAnimationFrame(run);
    }
}
