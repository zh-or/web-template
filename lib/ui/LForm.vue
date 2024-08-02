<template>
    <div class="l-form"
         :class="{'l-form-inline': props.inline}">
        <slot/>
    </div>
</template>

<script setup>

    import {
        reactive, toRaw,
        inject, provide, computed,
        onMounted, onUnmounted
    } from 'vue';

    defineOptions({ name: 'LForm' });

    let emit = defineEmits();
    let props = defineProps({
        model: {
            type: Object,
            default: () => {}
        },
        rules: {
            type: Object,
            default: () => {}
        },
        labelWidth: {
            type: String,
            default: '80px'
        },
        inline: Boolean
    });

    let data = reactive({
        childs: {}
    });

    provide('regisiterItem', regisiterItem);
    provide('callCalidate', callCalidate);
    provide('labelWidth', props.labelWidth);
    provide('inline', props.inline);

    provide('LForm', computed(() => {
        return {
            inline: props.inline,
            labelWidth: props.labelWidth,
            //... disabled
        }
    }));

    defineExpose({
        validate,
        validateField,
        clear
    });

    function regisiterItem(prop, obj) {
        //console.log('reg:', prop, obj);
        data.childs[prop] = obj;
        let rule = toRaw((props.rules || {})[prop]);
        return rule && (rule || []).some(_ => _.required);
    };

    function callCalidate(event, prop, val) {
        let rules = props.rules || {};
        if(!prop || !rules.hasOwnProperty(prop)) {
            return Promise.resolve();
        }
        let rule = rules[prop] || [];
        return execValidate(val, rule.filter(_ => _.trigger === event || event === 'hm'))
    };

    function execValidate(val, rule) {
        return new Promise((resolve, reject) => {
            //console.log('exec', rule, val);

            for(let i = 0; i < rule.length; i++) {
                let item = toRaw(rule[i]);
                if(item.validator && typeof item.validator === 'function') {
                    item.validator.call(null, item, val, (e) => {
                        resolve(e);
                    });
                    return;
                } else if(item.required) {
                    if(val === '' || val === null || val === undefined || val.length <= 0 || val === false) {
                        resolve(item.message);
                        return;
                    }
                }
                if(item.min) {
                    if(!val || val.length < item.min) {
                        resolve(item.message);
                        return;
                    }
                }
                if(item.max) {
                    if(val.length > item.max) {
                        resolve(item.message);
                        return;
                    }
                }
            }
            resolve();
        })
    }

    function validateField(cb, prop) {
        callCalidate('hm', prop, toRaw(props.model[prop]))
            .then(res => {
                if(res) {
                    let childObj = data.childs[prop];
                    childObj && childObj.showError(res);
                    cb(false);
                } else {
                    cb(true);
                }
            })
            .catch(e => {
                console.error('LForm:', e);
                cb(true);
            })

    }

    function validate(cb) {
        let keys = Object.keys(toRaw(props.model));
        let hasError = false;
        let ps = [];
        for(let i = 0; i < keys.length; i ++) {
            ps.push(validateField(v => {
                if(!v) {
                    hasError = true;
                }
            }, keys[i]));
        }
        Promise.all(ps)
            .then(_ => {
                cb(!hasError)
            });
    }

    function clear() {
        let keys = Object.keys(toRaw(props.model));
        keys.forEach(k => {
            let childObj = data.childs[k];
            childObj && childObj.hideError();
        })
    }

</script>

<style lang="less">
.l-form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;

    &.l-form-inline {
        flex-direction: row;

        .l-form-item {
            .l-form-item-input {
                width: 200px;
            }
        }
    }
}
</style>
