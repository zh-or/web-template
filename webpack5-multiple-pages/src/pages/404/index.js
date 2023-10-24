import './index.less';

import t from '../../../../lib/index.js';

async function test() {
    //防抖节流测试
    /*let obj;
    for(let i = 0; i < 100; i ++) {
        obj = t.throttle(obj, function() {
            console.log('i:' + i, new Date().toLocaleString())
        }, 1000, true)

        await t.sleep(100);
    }
*/

    let obj2;
    let last = Date.now();
    for(let i = 0; i < 100; i ++) {
        obj2 = t.debounce(obj2, function() {
            console.log('i:' + i, Date.now() - last);
            last = Date.now();
        }, 500)

        await t.sleep(10);
    }

}

test();
