import {getHost} from '../api/link.js';
import t from '@/tools/tools.js';

const getters = {
    token: state => {
        return t.getQueryString('token');
    },
    isVerify: state => {
        return Number(t.getQueryString('verify') || '0') == 1;
    },
    host: state => {
        return getHost();
    }
};

export default getters;
