import t from '@/tools/local';

const getters = {
    //如果有其他方式加密, 这里可以统一处理
    test: state => {

        return state.user.token;
    },
}

export default getters;
