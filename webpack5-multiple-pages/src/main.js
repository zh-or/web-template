import './assets/style/main.less';
import api from './api/api.js';

console.log('main');


api.state()
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.error(e);
    })
