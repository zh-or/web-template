<template>
    <TransitionGroup :name="props.name"
                      :tag="props.wrapTag"
                      class="drag-view">
        <component :is="props.itemTag"  v-for="(item, i) in props.data"
              :class="[props.itemClass, {target: data.drag.enterIndex === i}]"
              :key="props.itemKey ? item[props.itemKey] : i"
              @dragenter="dragenter($event, i)"
              @dragover="dragover($event, i)"
              @dragstart="dragstart(i)"
              @dragend="dragend(i)"
              draggable="true">
            <slot :row="item" :i="i"></slot>
        </component>
    </TransitionGroup>
</template>

<script setup>
    import {h, reactive, } from 'vue';
    defineOptions({ name: 'DragView' });

    let emit = defineEmits(['drag'])
    let props = defineProps({
        name: {
            type: String,
            default: 'drag'
        },
        wrapTag: {
            type: String,
            default: 'div'
        },
        itemTag: {
            type: String,
            default: 'div'
        },
        itemKey: String,
        itemClass: String,
        data: {
            type: Array,
            default: () => [],
        },
        enableSort: {
            type: Boolean,
            default: true,
        }
    });
    let data = reactive({
        drag: {
            dragIndex: '',
            enterIndex: '',
            isDrag: false,
        },
    });

    function dragstart(index) {
        if(!props.enableSort) {
            return;
        }
        data.drag.dragIndex = index;
        data.drag.isDrag = true;
    }
    function dragend(index) {
        if(!props.enableSort) {
            return;
        }
        data.drag.isDrag = false;
        index = data.drag.enterIndex;
        data.drag.enterIndex = '';
        if (data.drag.dragIndex !== index) {

            emit('drag', {
                from: data.drag.dragIndex,
                to: index,
                cb: () => {//交换后
                    data.drag.dragIndex = index;
                }
            });

            /*  const moving = this.stepList[this.drag.dragIndex];
              this.stepList.splice(this.drag.dragIndex, 1);
              this.stepList.splice(index, 0, moving);*/
        }

    }
    function dragenter(e, index) {
        if(!props.enableSort) {
            return;
        }
        //console.log('dragenter', arguments);
        e.preventDefault();
        data.drag.enterIndex = index;

    }
    function dragover(e, index) {
        if(!props.enableSort) {
            return;
        }
        //console.log('dragover', arguments);
        e.preventDefault();
    }
</script>

<style lang="less">
.drag-view {

    .drag-move {
        transition: transform .5s;
    }

}
</style>
