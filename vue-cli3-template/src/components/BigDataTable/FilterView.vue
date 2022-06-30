<template>
    <el-popover
            placement="bottom"
            :append-to-body="true"
            v-model="showPop"
            trigger="click">
        <template slot="reference">
            <!--只有使用此种方式才能插入body节点-->
            <slot></slot>
        </template>
        <div class="bd-table-column-filter-view" ref="selfView">
            <div class="search-wrap">
                <el-input v-model="search"
                          clearable
                          @input="searchData"
                          prefix-icon="el-icon-search"
                ></el-input>
                <el-button @click="clearSelect">{{$t('el.table.resetFilter')}}</el-button>
            </div>
            <big-data-scroll-view
                    class="scroll-view"
                    v-if="showPop"
                    :data="showList">
                <template v-slot="scope">
                    <div class="item">
                        <el-checkbox v-model="scope.row.checked"
                                     @change="changeSelect"
                        >
                            <template v-if="valueFormat && valueFormat.default">
                                <filter-view-value-t :node="valueFormat" :data="scope.row.obj"></filter-view-value-t>
                            </template>
                            <template v-else>
                                {{$tool.ObjGet(scope.row.obj, column)}}
                            </template>
                        </el-checkbox>
                    </div>
                </template>
                <template slot="empty">
                    <div class="empty">{{this.emptyText}}</div>
                </template>
            </big-data-scroll-view>
        </div>
    </el-popover>
</template>

<script>
    import BigDataScrollView from "../BigDataScrollView";
    import tools from '@/tools/tools.js';
    import Vue from 'vue';

    //定义一个组件翻译用
    Vue.component('FilterViewValueT', {
        props: {
            node: Object,
            data: Object,
        },
        render(h) {
            return h('div', null, this.node.default({row: this.data}))
        }
    });

    export default {
        name: "FilterView",
        inject: ['emptyText', 'dataWrap'],
        components: {BigDataScrollView},
        props: {
            baseData: {
                type: Array, default() {
                    return [];
                }
            },
            select: {
                type: Array, default() {
                    return [];
                }
            },
            valueFormat: Object,
            column: String,
        },
        data() {
            return {
                copyData: [],
                showList: [],
                showPop: false,// 需要重新计算高度
                search: '',
            }
        },
        watch: {
            baseData() {
                this.filterBaseData();
            },
        },
        mounted() {
            this.filterBaseData();
        },
        methods: {
            filterBaseData() { //去重
                let tmp = [];
                for (let i = 0; i < this.baseData.length; i++) {

                    if (!tmp.some(_ => tools.ObjGet(_.obj, this.column) == tools.ObjGet(this.baseData[i], this.column))) {
                        tmp.push({
                            obj: this.baseData[i],
                            checked: false,
                        });
                    }
                }
                this.copyData = tmp;
                this.showList = [].concat(tmp);
            },
            searchData() {
                let tmp = [];
                this.copyData.forEach(item => {
                    if (this.search == '' || tools.ObjGet(item.obj, this.column).indexOf(this.search) != -1) {
                        tmp.push(item);
                    }
                });
                this.showList = tmp;
            },
            changeSelect() {
                let tmp = this.showList.filter(_ => _.checked).map(_ => _.obj);
                let isFilter = true;
                if (tmp.length <= 0) {
                    tmp = this.baseData;
                    isFilter = false;
                }
                this.$emit('update:select', tmp, this.column, isFilter);
            },
            clearSelect() {
                this.search = '';
                this.showList = this.copyData.map(_ => {
                    _.checked = false;
                    return _;
                });
                this.changeSelect();
            }
        }
    }
</script>

<style scoped>

</style>
