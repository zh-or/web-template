<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-number">
            <span class="label">{{config.label}}</span>
            <input type="number" v-model="val" :placeholder="config.placeholder">
        </label>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '数字输入框';
    export default {
        name: "DyInputNumber",
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
