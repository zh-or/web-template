<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-file">
            <span class="label">{{config.label}}</span>
            <div class="file-wrap">
                <div class="file-item" v-for="item in files">
                    <svg-icon name="del" class="del-button"></svg-icon>
                    <div class="peek">
                        <svg-icon name="folder" class="file-icon"></svg-icon>
                    </div>
                    <div class="name">xxx</div>
                </div>
                <div class="file-item add-btn">
                    <svg-icon name="add2" class="add-icon"></svg-icon>
                </div>
            </div>
        </label>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '文件上传';
    export default {
        name: "DyInputFile",
        mixins: [Base],
        data() {
            return {
                files: [],
            }
        },
        methods: {}
    }
</script>

<style >

</style>
