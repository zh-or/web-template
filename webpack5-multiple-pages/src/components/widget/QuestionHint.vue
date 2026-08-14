<template>
    <el-tooltip
            v-if="props.placement"
            class="box-item"
            :effect="props.effect"
            :content="props.hint"
            :placement="props.placement"
    >

        <div class="question-hint-wrap">
            <span class="icon icon-question"></span>
            <!--<span class="hint">{{props.hint}}</span>-->
        </div>
    </el-tooltip>

    <div v-else class="question-hint-wrap">
        <span class="icon icon-question"></span>
        <span class="hint">{{props.hint}}</span>
    </div>
</template>

<script setup>
    import {
        reactive, ref, useTemplateRef,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({name: 'QuestionHint'});

    let emit = defineEmits([]);

    let props = defineProps({
        /*
        * 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
        * */
        placement: String,
        hint: String,
        effect: {
            type: String,
            default: 'light',
        },
    });


</script>

<style lang="less">
.question-hint-wrap {
    display: inline-block;
}
</style>
