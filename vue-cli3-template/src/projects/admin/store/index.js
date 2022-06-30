import Vue from "vue";
import Vuex from "vuex";
import getters from './getters';
import service from './modules/service';
import local from '@/tools/local';
import tool from '@/tools/tools';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
    },
    modules: {
        app: {
            state: {
                opened: false,

                user: {
                    deadline: "",
                    loginIp: "",
                    loginTime: "",
                    orgId: -1,
                    roleId: -1,
                    token: "",
                    userId: -1,
                },
            },
            actions: {
                toggleSideBar(state) {
                    state.state.opened = !state.state.opened;
                    state.dispatch('saveConfig');
                },
                saveConfig(state){
                    local.set('appConfig', state.state);
                },
                loadConfig(state){
                    let config = local.get('appConfig') || {};
                    tool.log('load config:' + JSON.stringify(config));
                    tool.clone(state.state, config);
                },
                setUserInfo(state, data){
                    tool.clone(state.state.user, data);
                    state.dispatch('saveConfig');
                    tool.log('update user:' + JSON.stringify(state.state.user));
                }
            }
        },
        service,
    },
    getters
});

/*init store config*/

store.dispatch('loadConfig');

export default store;
