<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <div class="control-wrap input-checkbox">
            <span class="label">{{config.label}}</span>
            <div>
                <mu-checkbox
                    v-for="(item, index) in config.select"
                    :key="'k-' + index"
                    v-model="val"
                    :name="in_name"
                    :value="item"
                    :label="item"
                ></mu-checkbox>
                <!--<label v-for="(item, index) in config.select"
                :key="'k-' + index">
                    <input type="checkbox"
                           v-model="val"
                           :value="item"
                           :placeholder="config.placeholder">
                    <span>{{item}}</span>
                </label>-->
            </div>
        </div>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '多选框';
    export default {
        name: "DyCheckbox",
        mixins: [Base],
        data() {
            return {
                in_name: this.createName(),
            }
        },
        methods: {}
    }
</script>

<style>

</style>
