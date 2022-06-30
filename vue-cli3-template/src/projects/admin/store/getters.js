import t from '@/tools/local';

const getters = {
    Authorization: state => {
        console.log('state:', state);

        return state.app.user.token;
    },
    sidebar: state => state.app.opened,
}

export default getters;
