<template>
    <div class="l-input"
         :class="{
                'l-input-suffix' : clear && model.length > 0 && !props.disabled,
                'l-input-append': $slots.suffix || $slots.prefix,
                'size-small': props.size === 'small',
                'size-mini': props.size === 'mini',
                'l-input-textarea': props.type === 'textarea',
         }">
        <div v-if="$slots.prefix" class="l-prefix">
            <slot name="prefix"></slot>
        </div>
        <div class="input">
            <input v-if="props.type !== 'textarea'"
                   v-model="model"
                   :disabled="props.disabled"
                   :type="props.type"
                   :maxLength="props.maxLength"
                   :autocomplete="autocomplete"
                   @keydown="keydown"
                   @focus="focusEvent"
                   @hover="hoverEvent"
                   @blur="blurEvent"
                   @change="changeVal"
                   @input="inputVal"
                   :placeholder="props.placeholder"/>
            <textarea v-else
                      v-model="model"
                      :autocomplete="autocomplete"
                      @keydown="keydown"
                      @focus="focusEvent"
                      @hover="hoverEvent"
                      @blur="blurEvent"
                      @change="changeVal"
                      @input="inputVal"
                      :rows="props.rows"
                      :maxLength="props.maxLength"
                      :disabled="props.disabled"
                      :placeholder="props.placeholder"/>
            <svg @click="clearVal"
                 v-if="clear && model.length > 0 && !props.disabled"
                 class="clear-icon"
                 viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                <path d="M512 896c212.1 0 384-171.9 384-384S724.1 128 512 128 128 299.9 128 512s171.9 384 384 384z m-0.8-427.3l150.3-150.3 45.2 45.2L556.5 514l147.3 147.3-45.2 45.2-147.4-147.3-146 146L320 660l146-146-149.6-149.6 45.2-45.2 149.6 149.5z"></path>
            </svg>
            <div class="num-wrap" v-if="numVal">{{numVal}}</div>
        </div>
        <div v-if="$slots.suffix" class="l-append">
            <slot name="suffix"></slot>
        </div>
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
    let model = defineModel({default: ''});

    defineOptions({ name: 'LInput'});
    let emit = defineEmits([
        'keydown', 'focus', 'blur', 'hover', 'change', 'input',
        'clear'
    ]);

    let inputEventCall = inject('inputEventCall', null);

    let props = defineProps({
        rows: {
            type: [String , Number],
            default: 4
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: '请输入',
        },
        disabled: Boolean,
        clear: {
            type: Boolean,
            default: true,
        },
        value: String,
        search: Function,
        searchKey: String,
        showLength: Boolean,
        maxLength: {
            type: [String, Number],
            default: ''//-1为不限制
        },
        size: {
            type: String,
            default: 'medium',//small, mini
        },
        autocomplete: String,
    });
    let attrs = useAttrs();

    let data = reactive({
        searchFun: null,
    });

    let numVal = computed(() => {
        let str = '';
        let max = Number(props.maxLength || '-1');
        if(max > -1) {
            str = (model.value || '').length + '/' + max;
        } else if(props.showLength) {
            str = (model.value || '').length + '';
        }
        return str;
    });


    function changeVal(e) {
        let dom = e.srcElement || e.target;
        emit('change', dom.value);
        emit('input', dom.value);
        callParent('change', dom.value);
    }
    function inputVal(e) {
        let dom = e.srcElement || e.target;
        emit('input', dom.value);
        callParent('input', dom.value);
        model.value = dom.value;

        props.search && props.search(dom.value, (arr) => {
            console.log('待开发 search:', arr);
        });
    }
    function clearVal(e) {
        if(props.disabled) {
            return;
        }
        let dom = e.srcElement || e.target;
        model.value = '';
        emit('input', '');
        callParent('clear', '');
        emit('clear', '');
    }
    function hoverEvent(e) {
        let dom = e.srcElement || e.target;
        emit('hover', '');
        callParent('hover', dom.value);
    }
    function blurEvent(e) {
        let dom = e.srcElement || e.target;
        emit('blur', '');
        callParent('blur', dom.value);
    }
    function focusEvent(e) {
        let dom = e.srcElement || e.target;
        emit('focus', '');
        callParent('focus', dom.value);
    }
    function callParent(e, val) {
        if(inputEventCall) {
            inputEventCall(e, val);
        }
    }
    function keydown(e) {
        emit('keydown', e);
    }
</script>

<style lang="less">
.l-input {
    width: 100%;
    display: flex;
    overflow: hidden;
    font-size: 1em;
    height: 35px;
    line-height: 35px;

    &.size-small {
        font-size: .9em;
        height: 30px;
        line-height: 30px;

        input, textarea {
            padding: 5px;
        }
    }

    &.size-mini {
        font-size: .8em;
        height: 25px;
        line-height: 25px;

        input, textarea {
            padding: 2px;
        }
    }

    &.l-input-textarea {
        height: unset;

        .num-wrap {
            bottom: 5px;
            top: unset;
        }
    }


    .input {
        flex-grow: 1;
        display: flex;
        position: relative;
    }

    input, textarea {
        width: 0 ;
        padding: 8px 8px;
        outline: none;
        flex-grow: 1;
        border: 1px solid @colorTxt4;
        transition: border .2s;
        border-radius: 4px;
        font-size: 1em;

        &:hover:not([disabled]), &:focus:not([disabled]) {
            border-color: @colorPrimary!important;
        }
    }

    textarea {
        resize: vertical;
    }

    .num-wrap {
        height: 1.5em;
        margin-top: -0.75em;
        position: absolute;
        right: 5px;
        top: 50%;
        font-size: 12px;
        background-color: #fff;
        line-height: 1.5;
    }

    .clear-icon {
        height: 1.5em;
        width: 1.5em;
        position: absolute;
        top: 50%;
        margin-top: -.75em;
        right: 8px;
        fill: @colorTxt3;
        cursor: pointer;
    }

    &.l-input-suffix {
        input, textarea{
            padding-right: 35px;
        }

        .num-wrap {
            right: 28px;
        }
    }

    &.l-input-append {
        input, textarea {
        }

        .l-append {
            padding-left: 8px;
            flex-shrink: 0;
        }

        .l-prefix {
            flex-shrink: 0;
            padding-right: 8px;
        }
    }
}


</style>
