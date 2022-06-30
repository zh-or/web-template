import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import getters from './getters.js';
import service from './service.js';

const store = new Vuex.Store({
    actions: service,
    getters
});

export default store;
