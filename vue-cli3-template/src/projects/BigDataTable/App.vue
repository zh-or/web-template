<template>
    <div id="app">

        <!--<bd-scroll-view :data="data">
           <template v-slot="scope">{{scope.row.a}} {{scope.row.name}}</template>
       </bd-scroll-view>-->

        <!--<bd-table class="test-table" :data="data" stripe border>
           <bd-column label="a" prop="a">

                <bd-column label="21" prop="b">

                    <bd-column label="aaCa" prop="c">
                        <bd-column label="21" prop="d"></bd-column>
                        <bd-column label="21" prop="name"></bd-column>
                    </bd-column>
                    <bd-column label="ta" prop="a">
                        <bd-column label="21" prop="a">
                            <bd-column label="21" prop="a"></bd-column>
                            <bd-column label="21" prop="b">
                                <bd-column label="21" prop="c"></bd-column>
                            </bd-column>
                        </bd-column>
                    </bd-column>
                </bd-column>

            </bd-column>
            <bd-column label="ex3" prop="name">
                <bd-column label="21" prop="a"></bd-column>
                <bd-column label="22" prop="b"></bd-column>
                <bd-column label="23" prop="c"></bd-column>
            </bd-column>
            <bd-column label="ex3 2" prop="name" >
                <bd-column label="21 2" prop="a"></bd-column>
                <bd-column label="22 2" prop="a"></bd-column>
                <bd-column label="23 2" prop="b" width="50"></bd-column>
            </bd-column>
            <bd-column label="label" prop="b"></bd-column>
            <bd-column label="st" prop="b"><span>test</span></bd-column>
            <bd-column label="操作" v-slot="scope" width="120">
                <span>aaa</span>
                <button>{{scope.row.name}}1</button>
            </bd-column>
        </bd-table>-->
        <bd-table class="test-table" :data="data" stripe highlight-current-row :current.sync="current" resize border>
            <bd-column label="a" sort prop="a" fixed-left width="200"></bd-column>
            <bd-column label="b" sort prop="b"  width="500"></bd-column>
            <bd-column label="c" sort prop="c" width="500"></bd-column>
            <bd-column label="d" sort width="700" fixed-right prop="d"></bd-column>
            <div slot="footer">awdawd</div>
        </bd-table>
        <!--滚动条 css 调整, border css 调整
        左右固定用最外层div加box-shadow
        footer固定到底部
        -->
        <!--<table border="1">
            <tr>
                <th rowspan="2">a</th>
                <th colspan="2">b</th>
                <th rowspan="2">e</th>
                <th rowspan="2">f</th>
                <th rowspan="2">g</th>
            </tr>
            <tr>
                <th>c</th>
                <th>d</th>
            </tr>
        </table>
        -->
    </div>
</template>
<script>

    import BigDataScrollView from '@/components/BigDataScrollView';

    export default {
        components: {
            BdScrollView: BigDataScrollView,
        },
        data() {
            return {
                current: -1,
                data: [],
            }
        },
        mounted() {
            for (let i = 0; i < 2000; i++) {
                this.data.push({
                    a: i,
                    b: '2列' + i,
                    c: '3列xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' + i,
                    d: '4列' + i,
                    name: '名字' + i,
                });
            }
        },
        methods: {}
    }
</script>
<style lang="less">
    #app {
        background-color: #fff;
        padding: 30px;
    }



    /*.test-table {
        width: 100%;
        height: 400px;
        margin: 0 auto;

        .bd-head {
            &:nth-child(odd) {
                background-color: #f2f2f2;
            }
        }

        .bd-item {
            &:nth-child(odd) {
                background-color: #f2f2f2;
            }
        }
    }*/


</style>
