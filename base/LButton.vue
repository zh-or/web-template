<template>
    <button @click="callClick"
            class="btn "
            :disabled="props.disabled"
            :class="{
                'active': props.loading,
                'btn-primary': props.type === 'primary',
                'btn-danger': props.type === 'danger',
                'btn-warning': props.type === 'warning',
                'btn-text': props.type === 'text',
                'size-small': props.size === 'small',
                'size-mini': props.size === 'mini',
            }">
            <template v-if="props.loading">
                <LLoading v-if="props.loading"/>
                <slot name="loading-str">{{props.loadingStr}}</slot>
            </template>
            <template v-else>
                <slot></slot>
            </template>
    </button>
</template>

<script setup>
    import LLoading from './LLoading.vue';

    import {
        reactive,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'LButton' });

    let emit = defineEmits(['click']);
    let props = defineProps({
        loading: Boolean,
        loadingStr: String,
        disabled: Boolean,
        type: String,
        size: {
            type: String,
            default: 'medium',//small, mini
        }
    })

    function callClick(e) {
        if(props.loading) {
            return;
        }
        emit('click', e);
    }
</script>

<style lang="less">

    .btn {
        background-color: #fff;
        color: @colorTxt0;
        min-width: 80px;
        border-radius: 4px;
        padding: 8px;
        border: 1px solid @colorTxt4;
        transition: all .2s;
        cursor: pointer;
        font-weight: bold;
        font-size: 1em;
        user-select: none;

        &:active {
            border-color: @colorBase;
        }

        & > * {
            vertical-align: middle;
        }

        &[disabled] {
            opacity: .2;
        }

        &.size-small {
            font-size: .9em;
            padding: 5px;
            min-width: 60px;
        }

        &.size-mini {
            font-size: .8em;
            padding: 2px;
            min-width: 40px;
        }
    }

    .btn-text {
        border: 0;
        padding: 0;
        background-color: transparent;
        min-width: 50px;
        color: @colorBase;
    }

    .btn-primary {
        background-color: @colorBase;
        border-color: @colorBase!important;;
        color: #fff;
    }

    .btn-danger {
        background-color: @colorDanger;
        border-color: @colorDanger!important;
        color: #fff;
    }

    .btn-warning {
        background-color: @colorWarning;
        border-color: @colorWarning!important;;
        color: #fff;
    }
</style>
