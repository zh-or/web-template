import t from 'lib';

const getters = {
    token: state => {
        return state.app.token;
    },
    isCollapse: state => state.app.menuCollapse,
    menuList: state => state.app.menuList,
}

export default getters;
