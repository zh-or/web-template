<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-area">
            <span class="label">{{config.label}}</span>
            <textarea rows="3" v-model="val" :placeholder="config.placeholder"/>
        </label>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '多行输入框';
    export default {
        name: "DyInputArea",
        mixins: [Base],
        data() {
            return {
            }
        },
        methods: {}
    }
</script>

<style >

</style>
