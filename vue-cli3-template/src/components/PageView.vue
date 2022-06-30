<template>
    <div class="page">
        <el-pagination
            layout="prev, pager, next"
            :current-page.sync="pageCopy"
            background
            @current-change="$emit('load')"
            :page-size="size"
            :total="total">
        </el-pagination>
        <span class="total">共 {{countPage()}} 页</span>
        <el-pagination
            layout="jumper"
            :current-page.sync="pageCopy"
            background
            @current-change="$emit('load')"
            :page-size="size"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "PageView",
        props: ['page', 'size', 'total', 'load'],
        data(){
            return {
                pageCopy: 0
            }
        },
        watch: {
            pageCopy(v){
                if(this.page == v){
                    return ;
                }
                this.$emit('update:page', v);
            },
            page(v){
                if(this.pageCopy == v){
                    return ;
                }
                this.pageCopy = v;
            }
        },
        methods:{
            countPage(){
                let mod = this.total % this.size;
                if(mod > 0){
                    return parseInt(this.total / this.size) + 1;
                }
                return this.total / this.size;
            }
        }
    }
</script>
