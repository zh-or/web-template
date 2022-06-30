<template>

    <div class="app-container" >
        <div class="page-title">
            <span>首页</span>
        </div>
        <div class="content">
            <cascader
                    :options="test.options"
                    v-model="test.val"
            ></cascader>
            <count-to :start-val="0"
                      :end-val="2000"
                      :decimals="2"
                      prefix="￥"
                      :duration="2600"
                      class="count-view"
            />
        </div>
    </div>
</template>
<script>

    import CountTo from 'vue-count-to';
    import {mapActions} from 'vuex';
    import echarts from 'echarts';
    import Cascader from '../components/Cascader';

    export default {
        name: "home",
        components: {Cascader, CountTo},
        data() {
            return {
                lineChart: null,
                search: {
                    type: 'flow',
                    type2: 'flow'
                },
                data: {
                    peopleCount: '0',
                    watchTime: '0.00',
                    swap: '0'
                },
                test: {
                    val: [],
                    options: [
                        {
                            label: 'awd',
                            children: [
                                {label: 'test'},
                                {label: 'test2'},
                            ]
                        },
                        {
                            label: 'awd2',
                            children: [
                                {label: 'awd2-1'},
                                {label: 'awd2-1'},
                            ]
                        }
                    ]
                }
            }
        },
        mounted() {
            this.test.val.push([this.test.options[0], this.test.options[0].children[0]])

        },
        methods: {
            ...mapActions([]),
            _ReSize() {
                console.log('resize call');
            }
        }
    }
</script>
<style>

</style>
