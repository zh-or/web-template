<template>
    <div class="calendar">
        <div class="week-wrap">
            <div class="week" v-for="w in data.weeks">
                <slot name="week" :week="w">
                    <span>{{w}}</span>
                </slot>
            </div>
        </div>
        <div class="day-wrap">
            <div v-for="d in data.days"
                 :class="{
                    'before': d.type === 0,
                    'after': d.type === 2
                 }"
                 class="day">

                <slot name="day"
                      :before="d.type === 0"
                      :after="d.type === 2"
                      :date="d.date">
                    <span>{{d.day}}</span>
                </slot>
            </div>
        </div>
    </div>
</template>
<script setup>

    import {
        reactive, ref,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'Calendar' });

    let emit = defineEmits(['change']);
    let current = defineModel({
        default: () => new Date(),
        set(v) {
            initDay(v)
            return v;
        }
    });

    let props = defineProps({
        weekStart: {
            default: 1,
            type: Number,
        }
    });

    let data = reactive({
        weeks: [],
        days: [],
    })

    function prevMonth() {
        current.value.setMonth(current.value.getMonth() - 1);
        initDay();
    }

    function nextMonth() {
        current.value.setMonth(current.value.getMonth() + 1);
        initDay();
    }

    function prevYear() {
        current.value.setFullYear(current.value.getFullYear() - 1);
        initDay();
    }

    function nextYear() {
        current.value.setFullYear(current.value.getFullYear() + 1);
        initDay();
    }

    function initDay() {

        emit('change', current.value);
        let date = current.value;
        let days = [];
        let week = date.getDay();
        let day  = getFirstDayOfWeek(date);
        let total= getMonthDays(date);
        let weeks = '日,一,二,三,四,五,六'.split(',');
        if(props.weekStart !== 0) {
            data.weeks = weeks.slice(props.weekStart, weeks.length).concat(weeks.slice(0, props.weekStart));
        } else {
            data.weeks = weeks;
        }
        days = days.concat(getPrevMonthDay(date, day));
        let m = date.getMonth();
        let tmp = new Date(
            date.getFullYear(),
            m,
            1);
        for(let i = 0; i < 31; i ++) {
            let d = tmp.getDate();
            days.push({
                type: 1,
                day: d,
                date: new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()),
            });
            tmp.setDate(d + 1);
            if(m !== tmp.getMonth()) {
                break;
            }
        }
        days = days.concat(getNextMonthDay(date));
        data.days = days;
    }

    function getPrevMonthDay(date, day) {
        let tmp = new Date(
            date.getFullYear(),
            date.getMonth(),
            1);

        if(day < props.weekStart) {
            day += (7 - props.weekStart);
        } else {
            day -= props.weekStart;
        }

        let sub = day;
        let res = [];
        for(let i = 0; i < sub; i ++) {
            tmp.setDate(tmp.getDate() - 1);
            res.unshift({
                type: 0,
                day: tmp.getDate(),
                date: new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()),
            });
        }
        return res;
    }

    function getNextMonthDay(date) {
        let tmp = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            1);
        tmp.setDate(tmp.getDate() - 1);
        let d = tmp.getDay();
        let i = 0;
        if(6 - props.weekStart + (d + 1) == 6) {
            //full
        }  else {
            i = 6 + props.weekStart - Math.max(d, props.weekStart);
        }

        //console.log(6 - props.weekStart + (d + 1) >= 6, d, i, tmp.toLocaleDateString());
        let res = [];
        for(let j = 0; j < i; j ++) {
            tmp.setDate(tmp.getDate() + 1);
            res.push({
                type: 2,
                day: tmp.getDate(),
                date: new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()),
            });
        }
        return res;
    }

    function getMonthDays(date) {
        let tmp = new Date(
            date.getFullYear(),
            date.getMonth(),
            1);
        tmp.setMonth(tmp.getMonth() + 1);
        tmp.setDate(tmp.getDate() - 1);
        return tmp.getDate();
    }

    function getFirstDayOfWeek(date) {
        let tmp = new Date(
            date.getFullYear(),
            date.getMonth(),
            1);
        return tmp.getDay();
    }

    defineExpose({
        prevMonth,
        nextMonth,
        prevYear,
        nextYear,
    });

    onMounted(() => {
        initDay()
    });
</script>

<style lang="less">
.calendar {
    font-size: 13px;

    .week-wrap {
        display: flex;
        background-color: #fff;

        .week {
            flex: 1;
            font-weight: bold;
            padding: 5px;
            text-align: center;
        }
    }

    .day-wrap {
        display: flex;
        flex-wrap: wrap;

        .day {
            padding: 10px;
            font-weight: bold;
            width: calc(100% / 7);
            text-align: center;


            &.before, &.after {
                color: @colorTxt3;
            }
        }
    }
}
</style>
