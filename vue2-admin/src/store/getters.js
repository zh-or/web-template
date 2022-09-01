import t from 'lib';

const getters = {
    token: state => {
        return state.app.token;
    },
    isCollapse: state => state.app.menuCollapse,
    menuList: state => state.app.menuList,
    tags: state => state.app.tags,
}

export default getters;
