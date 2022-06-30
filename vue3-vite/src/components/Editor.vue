<template>
    <div class="editor">
        <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
        />
        <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="props.modelValue"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onChange="changeValue"
                @onCreated="handleCreated"
        />
    </div>
</template>
<script setup name="editor">
    import '@wangeditor/editor/dist/css/style.css' // 引入 css

    import {onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
    import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

    const emit = defineEmits();
    const props = defineProps({
        modelValue: String,
        maxLength: String | Number,
        disabled: Boolean
    });
    watch(_ => props.disabled, v => v ? editorRef.disable() : editorRef.enable());
    value.value = props.modelValue;

    watch(_ => props.modelValue, v => {
        value.value = v;
    })

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const value = ref('');
    const mode = ref('default');
    const toolbarConfig = {};
    const editorConfig = {
        placeholder: '请输入内容...',
        maxLength: Number(props.maxLength),
        readOnly: props.disabled,
        MENU_CONF: {
            /*
            * 自定义上传图片
            * https://github.com/wangeditor-team/server
            * */
            uploadImage: {}
        }
    };

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
    }

    function changeValue() {
        emit('update:modelValue', value.value);
    }

</script>
<style lang="scss">
    .editor {
        border: 1px solid #cccccc;
    }

    .w-e-full-screen-container {
        z-index: 9991;
    }
</style>
