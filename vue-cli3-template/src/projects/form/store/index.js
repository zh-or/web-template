import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import getters from './getters';
import oa from './modules/oa';

const store = new Vuex.Store({
    actions: oa,
    getters
});

export default store;
