<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-text">
            <span class="label">{{config.label}}</span>
            <input type="text" v-model="val" :placeholder="config.placeholder">
        </label>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '单行输入框';
    export default {
        name: "DyInputText",
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
