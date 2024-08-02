<template>
    <transition name="el-loading-fade" @after-leave="handleAfterLeave">
        <div
                v-show="visible"
                class="el-loading-mask"
                :style="{ backgroundColor: props.background || '' }"
                :class="[props.customClass, { 'is-fullscreen': props.fullscreen }]">
            <div class="el-loading-spinner">
                <svg v-if="!props.spinner" class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none"/>
                </svg>
                <i v-else :class="props.spinner"></i>
                <p v-if="props.text" class="el-loading-text">{{ props.text }}</p>
            </div>
        </div>
    </transition>
</template>

<script setup>

    import {reactive, ref} from 'vue';


    defineOptions({ name: 'directiveLoading' });
    defineExpose({
        setText, setVisible
    })

    let emit = defineEmits(['after-leave']);

    let props = defineProps({
        text: String,
        spinner: String,
        background: String,
        fullscreen: {type: Boolean, default: true,},
        customClass: {type: String, default: '',}
    });

    let visible = ref(false);

    function handleAfterLeave() {
        emit('after-leave');
    }

    function setVisible(v) {
        visible.value = v;
    }

    function setText(text) {
        //props.text = text;
    }
</script>
