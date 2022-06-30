<template>
    <div class="form-item" :class="{'edit': edit}">
        <div class="bg-view"></div>
        <label class="control-wrap input-date-diff">
            <span class="label">{{config.label}}</span>
            <div class="time-view">
                <span @click="selectDateStart = true"
                      :class="{'placeholder': !displayDateStart}"
                >&nbsp;{{displayDateStart ? displayDateStart : config.placeholder}}&nbsp;</span>
                -
                <span @click="selectDateEnd = true"
                      :class="{'placeholder': !displayDateEnd}"
                >&nbsp;{{displayDateEnd ? displayDateEnd : config.placeholder}}&nbsp;</span>
                <div class="right-btns">
                    <svg-icon name="right" v-if="!val"></svg-icon>
                    <svg-icon name="clear" @click="clearDate" v-else></svg-icon>
                </div>
            </div>
        </label>
        <mu-dialog :open.sync="selectDate" class="select-date-dialog">
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

    export const name = '时间段选择器';
    export default {
        name: "DyDateDiffPicker",
        mixins: [Base],
        components: {},
        data() {
            return {
                selectDateStart: false,
                selectDateEnd: false,
                selectDate: false,
                in_name: this.createName(),
                dateStart: null,
                dateEnd: null,
                date: new Date(),
                displayDateStart: '',
                displayDateEnd: ''
            }
        },
        watch: {
            selectDateStart(v) {
                this.selectDate = v;
            },
            selectDateEnd(v) {
                this.selectDate = v;
            },
            selectDate(v) {
                if (!v) {
                    this.selectDateStart = false;
                    this.selectDateEnd = false;
                }
            }
        },
        methods: {
            clearDate() {
                this.val = null;
                this.date = new Date();
                this.displayDateStart = '';
                this.displayDateEnd = '';
            },
            confirmDate() {
                if(this.selectDateStart){
                    this.dateStart = this.date;
                    this.displayDateStart = this.$t.formatDate(this.date, 'yyyy-MM-dd');
                }
                if(this.selectDateEnd){
                    this.dateEnd = this.date;
                    this.displayDateEnd = this.$t.formatDate(this.date, 'yyyy-MM-dd');
                }
                this.val = [this.dateStart, this.dateEnd];
                this.selectDateStart = false;
                this.selectDateEnd = false;
            }
        }
    }
</script>

<style>

</style>
