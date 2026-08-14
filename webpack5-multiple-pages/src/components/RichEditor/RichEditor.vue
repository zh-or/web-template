<template>
    <div class="rich-editor"
         @click="clickEditor"
         ref="editorWrap"
         :class="{'fullscreen': data.isFullScreen}">
        <div ref="editorDom" :style="styles"></div>

        <div class="num-wrap" v-if="numVal">{{numVal}}</div>
    </div>
</template>

<script setup>
    import t from '@zh-or/lib';
    import Quill from "quill";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";

    import {
        reactive, ref,
        inject, computed, watch,
        onMounted, onUnmounted, useAttrs, nextTick
    } from 'vue';

    defineOptions({ name: 'RichEditor'});
    let emit = defineEmits([
        'upload', 'focus', 'blur', 'hover', 'change',
        'clear'
    ]);

    //https://blog.csdn.net/weixin_44786330/article/details/128901168
    const FontStyle = Quill.import('attributors/style/size');
    const SizeStyle = Quill.import('attributors/style/size');
    const Align = Quill.import('attributors/style/align');
    const Direction = Quill.import('attributors/style/direction');
    const Color = Quill.import('attributors/style/color');
    const Background = Quill.import('attributors/style/background');

    SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px'];

    Quill.register(FontStyle, true);
    Quill.register(SizeStyle, true);
    Quill.register(Align, true);
    Quill.register(Direction, true);
    Quill.register(Color, true);
    Quill.register(Background, true);

    let props = defineProps({
        value: {
            type: String,
            default: "",
        },
        height: {
            type: Number,
            default: 300,
        },
        maxHeight: {
            type: Number,
            default: 0,
        },
        minHeight: {
            type: Number,
            default: 0,
        },
        fileSize: {
            type: Number,
            default: 5,
        },
        placeholder: {
            type: String,
            default: "请输入内容",
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        imgLimit: {
            /*当所选择图片大于此值时就需要上传否则以base64的方式存储*/
            type: Number,
            default: 1024
        },
        showLength: Boolean,
        maxLength: {
            type: [Number, String],
            default: ''//-1为不限制
        },
        media: {
            type: Boolean,
            default: true
        },
        uploadData: {
            type: Object,
            default: () => {}
        },
        uploadFilter: Function, //用冒号的方式绑定
    });

    let cacheValue = '';
    let model = defineModel({
        set(v) {
            if(v === cacheValue) {
                return v;
            }
            quillObj && quillObj.pasteHTML(v);
            return v;
        }
    })

    let inputEventCall = inject('inputEventCall', null);

    let data = reactive({
        isFullScreen: false,
    });

    let quillObj = null;

    let styles = computed(() => {
        let arr = [];
        if(props.height > 0) {
            arr.push(`height: ${props.height}px`);
        }
        if(props.maxHeight > 0) {
            arr.push(`max-height: ${props.maxHeight}px`);
        }
        if(props.minHeight > 0) {
            arr.push(`min-height: ${props.minHeight}px`);
        }

        return arr.join(';');
    });

    let numVal = computed(() => {

        if(!quillObj || !quillObj.getLength) {
            return '';
        }
        let str = '';
        let max = Number(props.maxLength || '-1');
        let len = quillObj.getLength();
        if(max > -1) {
            str = len + '/' + max;
        } else if(props.showLength) {
            str = len + '';
        }

        return str;
    });

    let editorWrap = ref(null);
    let editorDom = ref(null);

    onMounted(() => {

        nextTick(_ => {
            quillObj = new Quill(editorDom.value, getOptions());

            quillObj.root.addEventListener('paste', evt => {
                if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
                    evt.preventDefault();
                    handleImgFiles(evt.clipboardData.files);
                }
            }, false);

            quillObj.root.addEventListener('focus', e => {
                callParent('focus', quillObj.getText());
            });
            quillObj.root.addEventListener('blur', e => {
                callParent('blur', quillObj.getText());
            });

            let toolbar = quillObj.getModule("toolbar");
            toolbar.addHandler('fullscreen', (val) => {
                console.error('fullscreen', val)
            });

            //处理图片上传
            toolbar.addHandler("image", (value) => {
                if (value) {
                    t.selectFile(fs => {
                        handleImgFiles(fs);
                    }, {accept: 'image/*'});
                } else {
                    quillObj.format("image", false);
                }
            });
            quillObj.on("text-change", (delta, oldDelta, source) => {
                let max = Number(props.maxLength || '-1');
                let len = quillObj.getLength();
                if(max > -1 && len > max) {
                    quillObj.deleteText(max - 1, len - max, 'api');
                }

                const html = quillObj.root.innerHTML;
                const text = quillObj.getText();
                cacheValue = html;
                model.value = html;
                emit('change', html);
                callParent('change', html);
            });

            quillObj.on('selection-change', (range, oldRange, source) => {

                if (range) {
                    if (range.length == 0) {
                        //console.log('User cursor is on', range.index);
                    } else {
                        //选中一段
                        //var text = this.quill.getText(range.index, range.length);
                        //console.log('User has highlighted', text);
                    }
                } else {
                    //console.log('Cursor not in the editor');
                }

            });

            quillObj.pasteHTML(model.value);

            let full = document.querySelector('.ql-fullscreen');

            let fullSvg = () => {
                let svg = '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M149.333333 394.666667c17.066667 0 32-14.933333 32-32v-136.533334l187.733334 187.733334c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-187.733333-187.733334H362.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-4.266667 0-8.533333 0-10.666666 2.133334-8.533333 4.266667-14.933333 10.666667-19.2 17.066666-2.133333 4.266667-2.133333 8.533333-2.133334 12.8v213.333334c0 17.066667 14.933333 32 32 32zM874.666667 629.333333c-17.066667 0-32 14.933333-32 32v136.533334L642.133333 597.333333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l200.533334 200.533334H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333334c4.266667 0 8.533333 0 10.666666-2.133334 8.533333-4.266667 14.933333-8.533333 17.066667-17.066666 2.133333-4.266667 2.133333-8.533333 2.133333-10.666667V661.333333c2.133333-17.066667-12.8-32-29.866666-32zM381.866667 595.2l-200.533334 200.533333V661.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333334c0 4.266667 0 8.533333 2.133334 10.666666 4.266667 8.533333 8.533333 14.933333 17.066666 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333l200.533333-200.533333c12.8-12.8 12.8-32 0-44.8s-29.866667-10.666667-42.666666 0zM904.533333 138.666667c0-2.133333 0-2.133333 0 0-4.266667-8.533333-10.666667-14.933333-17.066666-17.066667-4.266667-2.133333-8.533333-2.133333-10.666667-2.133333H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533334l-187.733334 187.733333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l187.733333-187.733333V362.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c-2.133333-4.266667-2.133333-8.533333-4.266667-10.666666z" ></path></svg>';

                if(data.isFullScreen) {
                    svg = '<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M313.6 358.4H177.066667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333333c4.266667 0 8.533333 0 10.666667-2.133333 8.533333-4.266667 14.933333-8.533333 17.066666-17.066667 2.133333-4.266667 2.133333-8.533333 2.133334-10.666667v-213.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v136.533333L172.8 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 187.733333zM695.466667 650.666667H832c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H618.666667c-4.266667 0-8.533333 0-10.666667 2.133333-8.533333 4.266667-14.933333 8.533333-17.066667 17.066667-2.133333 4.266667-2.133333 8.533333-2.133333 10.666666v213.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-136.533334l200.533333 200.533334c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-204.8-198.4zM435.2 605.866667c-4.266667-8.533333-8.533333-14.933333-17.066667-17.066667-4.266667-2.133333-8.533333-2.133333-10.666666-2.133333H192c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533333L128 851.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l200.533334-200.533333V832c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V618.666667c-2.133333-4.266667-2.133333-8.533333-4.266667-12.8zM603.733333 403.2c4.266667 8.533333 8.533333 14.933333 17.066667 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333L896 170.666667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-187.733333 187.733333V177.066667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c2.133333 4.266667 2.133333 8.533333 4.266666 12.8z" ></path></svg>';
                }
                full.innerHTML = svg;
            }

            full.addEventListener('click', () => {
                data.isFullScreen = !data.isFullScreen;
                fullSvg();
            });
            fullSvg();

            quillObj.keyboard.addBinding('ESCAPE', (range, context) => {
                data.isFullScreen = false;
                fullSvg();
            });

            if(!props.readOnly) {
                quillObj.enable();
            }

        })
    })


    function handleImgFiles(fs) {
        Array.prototype.forEach.call((fs || []), f => {
            if(!f.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
                return;
            }
            if(f.size <= props.imgLimit) {
                let reader = new FileReader();
                reader.addEventListener('load', () => {
                    insertImg(reader.result);
                });
                reader.readAsDataURL(f);

            } else {
                //console.log('图片需要上传:', f.size, f);
                let cb = (src) => {
                    if(props.uploadFilter) {
                        src = props.uploadFilter(src);
                    }
                    if(src) {
                        insertImg(src);
                    }
                }
                emit('upload', {file: f, cb: cb, uploadData: props.uploadData});
            }
        });
    }

    function callParent(e, val) {
        if(inputEventCall) {
            val = (val || '').trim();

            inputEventCall(e, val);
        }
    }

    function parseHTML(html) {
        quillObj.pasteHTML(html);
    }

    function insertImg(url) {
        if(!url) {
            console.error('未插入图片');
            return;
        }
        let length = quillObj.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quillObj.insertEmbed(length, 'image', url);
        // 调整光标到最后
        quillObj.setSelection(length + 1);
    }

    function getOptions() {
        return {
            theme: "snow",
            bounds: document.body,
            debug: false,
            modules: {
                // 工具栏配置
                toolbar: [
                    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                    ["blockquote", "code-block"],              // 引用  代码块
                    [{list: "ordered"}, {list: "bullet"}],     // 有序、无序列表
                    [{indent: "-1"}, {indent: "+1"}],          // 缩进
                    [{size: SizeStyle.whitelist}],             // 字体大小
                    [{header: [1, 2, 3, 4, 5, 6, false]}],    // 标题
                    [{color: []}, {background: []}],           // 字体颜色、字体背景颜色
                    [{align: []}],                             // 对齐方式
                    props.media ? ["image"/*, "video"*/] : [],  // 链接、图片、视频
                    ["clean"],                                 // 清除文本格式
                    ['fullscreen']
                ]
            },
            placeholder: props.placeholder,
            readOnly: true,/*创建完毕后再启用, 防止自动获取焦点, 非常sb*/
            maxLength: props.maxLength,
            focus: false,
        }
    }

</script>

<style lang="less">

    .sizeStyle(@size) {
        .ql-picker-label[data-value="@{size}"]:before {
            content: "@{size}";
        }

        .ql-picker-item[data-value="@{size}"] {
            font-size: @size;

            &:before {
                content: "@{size}";
            }
        }
    }

    .rich-editor {
        white-space: pre-wrap !important;
        line-height: normal !important;
        display: flex;
        flex-direction: column;
        position: relative;

        &.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1002;
            background: #fff;
        }

        .ql-container {
            overflow-y: auto;
            flex-grow: 1;
        }


        .quill-img {
            display: none;
        }

        .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
            border-right: 0px;
            content: "保存";
            padding-right: 0px;
        }

        .ql-formats {
            .ql-size {

                .sizeStyle(12px);
                .sizeStyle(14px);
                .sizeStyle(16px);
                .sizeStyle(18px);
                .sizeStyle(20px);

            }
        }

        .num-wrap {
            height: 1.5em;
            margin-top: -0.75em;
            position: absolute;
            right: 10px;
            bottom: 5px;
            font-size: 12px;
            background-color: #fff;
        }
    }

    .ql-snow.ql-toolbar button:hover,
    .ql-snow .ql-toolbar button:hover,
    .ql-snow.ql-toolbar button:focus,
    .ql-snow .ql-toolbar button:focus,
    .ql-snow.ql-toolbar button.ql-active,
    .ql-snow .ql-toolbar button.ql-active,
    .ql-snow.ql-toolbar .ql-picker-label:hover,
    .ql-snow .ql-toolbar .ql-picker-label:hover,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    .ql-snow.ql-toolbar .ql-picker-item:hover,
    .ql-snow .ql-toolbar .ql-picker-item:hover,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
        color: @colorBase;
    }
    .ql-snow.ql-toolbar button:hover .ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
        fill: @colorBase;
    }
    .ql-snow.ql-toolbar button:hover .ql-stroke,
    .ql-snow .ql-toolbar button:hover .ql-stroke,
    .ql-snow.ql-toolbar button:focus .ql-stroke,
    .ql-snow .ql-toolbar button:focus .ql-stroke,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
        stroke: @colorBase;
    }
</style>
