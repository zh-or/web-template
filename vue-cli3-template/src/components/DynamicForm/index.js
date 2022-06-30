import Vue from "vue";
/*muse ui*/
/*import 'muse-ui/lib/styles/base.less';
import {Button, Checkbox, Dialog, Icon, Picker, Radio} from 'muse-ui';
import 'muse-ui/lib/styles/theme.less';*/

import {Button, Checkbox, Dialog, Icon, Picker, Radio} from '@/components/muse-ui/muse-ui.esm.js'
import '@/components/muse-ui/muse-ui.css'

import "./dynamicForm.less";

Vue.use(Dialog);
Vue.use(Picker);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Icon);

/*import DyInputText from './controls/DyInputText';
import DyInputArea from './controls/DyInputArea';
import DyInputNumber from './controls/DyInputNumber';
import DyRadio from './controls/DyRadio';
import DyCheckbox from './controls/DyCheckbox';
import DyDatePicker from './controls/DyDatePicker';
import DyDateDiffPicker from './controls/DyDateDiffPicker';
import DyInputFile from './controls/DyInputFile';
import DyHr from './controls/DyHr';
Vue.component('DyInputText', DyInputText);
Vue.component('DyInputArea', DyInputArea);
Vue.component('DyInputNumber', DyInputNumber);
Vue.component('DyRadio', DyRadio);
Vue.component('DyCheckbox', DyCheckbox);
Vue.component('DyDatePicker', DyDatePicker);
Vue.component('DyDateDiffPicker', DyDateDiffPicker);
Vue.component('DyInputFile', DyInputFile);
Vue.component('DyHr', DyHr);*/

import DesignView from './DesignView';
import DynamicView from './DynamicView';

Vue.component('DesignView', DesignView);
Vue.component('DynamicView', DynamicView);

let allControls = [];

const req = require.context('./controls', false, /Dy[\s\S]*\.vue$/);
req.keys().forEach(c => {
    let control = req(c);
    let obj = {
        view: control.default.name,
        name: control.name,
    };
    allControls.push(obj);
    Vue.component(obj.view, control.default);
});

Vue.config.optionMergeStrategies.dynamicForm = function (to, from) {
    console.error(arguments);
}

function _getAttribute(name) {
    let obj = {
        name: name,
        design: [
            {label: '标题', type: 'text', key: 'label', title: '请输入', val: '标签文字'},
            {label: '验证', type: 'checkbox', key: 'required', title: '勾选则表示该项必填', val: false},
        ],
        config: {
            required: false,
            label: '标签文字',
            placeholder: '请输入',
            defaultVal: '',
        }
    };
    switch(name){
        case 'DyCheckbox':
        case 'DyRadio':
        case 'DyHr':
        case 'DyInputFile':
            break;
        default:
            obj.design.push({label: '提示文字', type: 'text', key: 'placeholder', title: '请输入', val: '请输入'});
            break;
    };
    switch (name) {
        case 'DyCheckbox':
        case 'DyRadio':
            obj.config.defaultVal = [];
            obj.config.label = '选择';
            obj.config.select = ['选项1', '选项2'];
            obj.design.push({label: '选项', type: 'multiple', key: 'select', title: '请输入', val: ['选项1', '选项2']});
            break;
        case 'DyDatePicker':
            obj.config.label = '选择时间';
            obj.config.placeholder = '点击选择';
            break;
        case 'DyDateDiffPicker':
            obj.config.label = '选择时间段';
            obj.config.placeholder = '点击选择';
            obj.config.defaultVal = [];
            break;
        case 'DyInputFile':
            obj.config.label = '选择文件';
            break;
        case 'DyHr':
            obj.config.label = '分隔符';
            break;
        default:
            break;
    }

    obj.design.forEach(d => {
        obj.config[d.key] = d.val;
    });

    return obj;
}


export const getAttribute = _getAttribute;


export const getControls = function () {
    return allControls;
};

export const getConfig = function (name) {
    let attr = _getAttribute(name);
    return attr.config;
};
export const getDesign = function (name) {
    let attr = _getAttribute(name);
    return attr.design;
};



