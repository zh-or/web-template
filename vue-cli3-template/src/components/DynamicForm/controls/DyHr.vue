<template>
    <div class="form-item line" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <div>
            <span>{{config.label}}</span>
        </div>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '分隔条';
    export default {
        name: "DyHr",
        mixins: [Base],
        data() {
            return {}
        },
        methods: {}
    }
</script>

<style>

</style>
