<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-radio">
            <span class="label">{{config.label}}</span>
            <div>
                <label v-for="(item, index) in config.select"
                       :key="'k-' + index">
                    <mu-radio
                        v-model="val"
                        :label="'' + item"
                        :value="'' + item"
                    ></mu-radio>
                </label>
                <!--<label v-for="item in config.select">
                    <input type="radio"
                           v-model="val"
                           :name="in_name"
                           :value="item"
                           :placeholder="config.placeholder">
                    <span>{{item}}</span>
                </label>-->
            </div>
        </label>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '单选框';
    export default {
        name: "DyRadio",
        mixins: [Base],
        data() {
            return {
                in_name: this.createName()
            }
        },
        methods: {}
    }
</script>

<style>

</style>
