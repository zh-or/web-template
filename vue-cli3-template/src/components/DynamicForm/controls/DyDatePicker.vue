<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-date">
            <span class="label">{{config.label}}</span>
            <div class="time-view">
                <span  @click="selectDate = true"
                       :class="{'placeholder': !displayDate}"
                >&nbsp;{{displayDate ? displayDate : config.placeholder}}&nbsp;</span>
                <div class="right-btns">
                    <svg-icon name="right" v-if="!val"></svg-icon>
                    <svg-icon name="clear" @click="clearDate" v-else></svg-icon>
                </div>
            </div>
        </label>
        <mu-dialog  :open.sync="selectDate" class="select-date-dialog">
            <mu-date-picker :date.sync="date"></mu-date-picker>
            <div class="btns">
                <mu-button color="primary" @click="confirmDate">确定</mu-button> &nbsp;
                <mu-button @click="selectDate = false">取消</mu-button>
            </div>
        </mu-dialog>
    </div>
</template>

<script>
    import Base from './base';

    export const name = '日期选择器';
    export default {
        name: "DyDatePicker",
        mixins: [Base],
        components: {
        },
        data() {
            return {
                selectDate: false,
                in_name: this.createName(),
                date: new Date(),
                displayDate: ''
            }
        },
        methods: {
            clearDate(){
                this.val = null;
                this.date = new Date();
                this.displayDate = '';
            },
            confirmDate(){
                console.log(this.date);
                this.val = this.date;
                this.displayDate = this.$t.formatDate(this.date, 'yyyy-MM-dd');
                this.selectDate = false;
            }
        }
    }
</script>

<style >

</style>
