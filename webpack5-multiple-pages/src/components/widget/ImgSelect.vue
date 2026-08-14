<template>
    <div class="img-select-wrap p-b-10 flex f-wrap">

        <div class="atth-item is-single"
             :style="atthItemStyle"
             v-if="single"
             @click="seleftSingleFileFun(true)">

            <LImage v-if="model"
                    :src="model"/>
            <span v-if="!model" class="icon icon-add"></span>
            <div v-else class="icon-wrap f-v f-v-center f-h-center">
                <div class="" title="更换"
                     @click.stop="seleftSingleFileFun(false)">
                    <span class="icon icon-flush"></span>
                </div>
                <div class="" title="删除" @click.stop="removeVal">
                    <span class="icon icon-close"></span>
                </div>
            </div>
        </div>
        <template v-else>
            <div class="atth-item"
                 v-for="(item, i) in model"
                 :key="item.src">
                <LImage v-if="item.fileType === 'img'"
                        :src="item.src"/>
                <LPreVideo v-if="item.fileType === 'video'"
                           :src="item.src"/>
                <span class="icon icon-delete" @click="delFileFun(item, i)" ></span>
            </div>

            <div class="add-btn" v-if="model.length < max" @click="selectFileFun">
                <span class="icon icon-add"></span>
            </div>
        </template>
    </div>
</template>

<script setup>

    import msg from '@base/components/msg.js';
    import t from '@zh-or/lib';
    import u from '@base/lib/tools.js';

    import {
        reactive, toRaw,
        inject, provide, computed,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'ImgSelect' });

    /*
    * [
    *   {id: '', src: '', file: File, fileType: 'img|video'}
    * ]
    * */
    let emit = defineEmits(['change']);
    let model = defineModel({type: [Array, Object]});
    let props = defineProps({
        maxSize: {/*文件大小限制*/
            type: [String, Number],
            default: 1024 * 1024 * 2,//默认2m
        },
        max: {/*最大接收文件数量*/
            type: Number,
            default: 1,
        },
        viewSize: {
            type: [String, Number],
            default: 100,
        }
    });
    /*如果要多选必须max大于1并且v-model绑定的值为数组*/
    let single = computed(() => {
        let raw = toRaw(model.value);
        return !Array.isArray(raw) || props.max <= 1;
    });

    let atthItemStyle = computed(() => {
        return {
            height: `${props.viewSize}px`,
            width: `${props.viewSize}px`,
        }
    })

    function seleftSingleFileFun(check) {
        if(check && model.value) {
            /*单选是不响应外层事件*/
            return;
        }
        u.selectOneImgFile(f => {

            if(f.length > 0){
                model.value = f[0];
                emit('change', f[0]);
            }
        })
    }

    function removeVal() {
        model.value = null;
    }

    function delFileFun(item, i) {
        if(item.file) {
            t.freeObj(item.src);
        }
        model.value.splice(i, 1);
    }

    function selectFileFun() {
        u.selectImgFile(fs => {
            [].forEach.call(fs, f => {
                let name = f.name;
                if(f.size > props.maxSize) {
                    msg.error(name + ' 过大, 请选择小于 ' + (props.max / 1024 / 1024).toFixed() + 'MB 的文件')
                    return ;
                }

                if(model.value.length < props.max) {
                    model.value.push({
                        src: t.getObjectURL(f),
                        file: f,
                        fileType: 'img',
                    })
                }
            });
        })
    }
</script>

<style lang="less">
    @atthSize : 100px;

.img-select-wrap {

    .is-single {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-add {
            /*position: absolute;
            margin-top: 50%;
            margin-left: 50%;
            left: @atthSize / 2;
            top: @atthSize / 2;*/
            z-index: 1;
        }

        .icon-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background-color: rgba(0, 0, 0, .1);
            transition: background-color .2s;

            display: flex;
            align-items: center;
            flex-direction: row;
            font-size: 30px;
            opacity: .2;

            &:hover {
                opacity: 1;
                background-color: rgba(0, 0, 0, .7);
            }

            & > div {
                flex: 1;
                text-align: center;
                color: @colorTxt2;

                &:hover {

                    .icon {
                        color: @colorBase;
                    }
                }
            }

        }

    }

    .atth-item {
        height: @atthSize;
        width: @atthSize;
        overflow: hidden;
        padding: 5px;
        margin-right: 10px;
        position: relative;
        margin: 5px;

        .del {
            border: 1px solid @colorTxt3;
            font-size: 15px;
            position: absolute;
            right: 0;
            top: 0;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: @colorTxt3;
            background-color: rgba(255, 255, 255, .68);

            .icon {
                margin: 0;
            }

            &:hover, &:focus {
                border-color: @colorBase;
                color: @colorBase;
            }
        }
    }

    .add-btn, .is-single{
        height: @atthSize;
        width: @atthSize;
        font-size: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @colorTxt2;
        border: 1px solid @colorTxt3;
        cursor: pointer;
        transition: border,color .2s;
        border-radius: 8px;
        margin: 5px;

        &:hover, &:focus {
            border-color: @colorBase;
            color: @colorBase;
        }

        .icon {
            margin: 0;
        }
    }
}
</style>
