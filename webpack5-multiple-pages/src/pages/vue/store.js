import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: ''
    },
    getters: {
        getToken(state) {
            return state.token;
        },
    },
    actions: {
        toggleSideBar(app) {
            app.state.opened = !app.state.opened;
            app.dispatch('saveConfig');
        },
        saveConfig(app) {
            local.set('appConfig', app.state);
        },
    }
});

/*init store config*/

store.dispatch('loadConfig');

export default store;
