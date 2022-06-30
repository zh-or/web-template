import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


const store = new Vuex.Store({
	state: {
	    token: '',
	},
    getters: {
	    token(app) {
	        return app.token;
        },
    },
    actions: {
	    setToken(app, data) {
	        app.state.token = data;
			uni.setStorageSync('token', data);
        },
        clearInfo(app){
	        app.state.token = '';
            uni.setStorageSync('token', '');
        }
    },
})


export default store
