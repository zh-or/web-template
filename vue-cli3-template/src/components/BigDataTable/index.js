import BigDataTable from './BigDataTable';
import BigDataColumn from './BigDataColumn';
import Vue from 'vue';

export default {
    install(){
        Vue.component('bd-table', BigDataTable);
        Vue.component('bd-column', BigDataColumn);
    }
}
