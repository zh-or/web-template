<template>
    <div class="tag-input-wrap" :class="{'tag-input-focus': data.focus}">
        <div v-for="(item, i) in model"
             class="tag"
             :key="item">
            <span>{{item}}</span>
            <icon-delete @click="deleteItem(item, i)"/>
        </div>
        <input class="tag-input"
                 v-model="data.val"
                 @focus="data.focus = true"
                 @blur="data.focus = false"
                 @keydown="inputKeyDownEvent"
                 :placeholder="props.placeholder"/>
    </div>
</template>

<script setup>

    import {
        reactive, ref,
        inject, computed, watch,
        onMounted, onUnmounted,
        useAttrs,
        nextTick
    } from 'vue';

    let model = defineModel({type: Array});

    defineOptions({ name: 'LTagInput'});

    let emit = defineEmits([]);
    let props = defineProps({
        placeholder: {
            type: String,
            default: '输入技能...',
        }
    });

    let data = reactive({
        val: '',
        focus: false,
    })

    function deleteItem(item, i) {

        model.value.splice(i, 1);
    }

    function inputKeyDownEvent(e) {
        if (e.keyCode === 13) {
            if(model.value.indexOf(data.val) != -1) {
                emit('repet', data.val);
                return;
            }
            model.value.push(data.val);
            data.val = '';
        }
    }
</script>

<style lang="less">
    .tag-input-wrap {
        border: 1px solid #bec0c2;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 10px 0;
        border-radius: 4px;
        font-size: 12px;
        transition: border .2s;
        background-color: #fff;

        &:hover, &.tag-input-focus {
            border-color: @colorBase;
        }

        .tag {
            padding: 4px 5px;
            border-radius: 8px;
            border: 1px solid #dedede;
            flex-shrink: 0;
            margin-right: 13px;
            margin-bottom: 10px;

            span, i{
                vertical-align: middle;
            }

            .icon {
                cursor: pointer;
                border-radius: 50%;
                transition: background-color;

                &:hover {
                    background-color: @colorBase;
                    color: #fff;
                }
            }
        }

        .tag-input {
            border: 0;
            flex-grow: 1;
            margin-bottom: 10px;
            width: unset;
            min-width: 80px;

            .input input {
                border: 0;
                padding: 0;
            }
        }
    }
</style>
