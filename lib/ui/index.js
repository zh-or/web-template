
import LButton from './LButton.vue';
import LTimeoutButton from './LTimeoutButton.vue';
import LLoading from './LLoading.vue';
import LInput from './LInput.vue';
import LImage from './LImage.vue';
import LPreVideo from './LPreVideo.vue';
import LForm from './LForm.vue';
import LFormItem from './LFormItem.vue';
import LTagInput from './LTagInput.vue';
import LCheckBox from './LCheckBox.vue';
import LCheckBoxGroup from './LCheckBoxGroup.vue';
import LRadio from './LRadio.vue';
import LRadioGroup from './LRadioGroup.vue';
import LTab from './LTab.vue';
import LTabItem from './LTabItem.vue';

import LDialog from './LDialog.vue';

//import Loading from './loading/index.js';
import './loading/style.less';
import loadingDirective from './loading/directive.js';

export default {
    install(app, opt) {
        app.component('LButton', LButton);
        app.component('LTimeoutButton', LTimeoutButton);
        app.component('LLoading', LLoading);
        app.component('LInput', LInput);
        app.component('LImage', LImage);
        app.component('LPreVideo', LPreVideo);
        app.component('LForm', LForm);
        app.component('LFormItem', LFormItem);
        app.component('LTagInput', LTagInput);
        app.component('LCheckBox', LCheckBox);
        app.component('LCheckBoxGroup', LCheckBoxGroup);
        app.component('LRadio', LRadio);
        app.component('LRadioGroup', LRadioGroup);
        app.component('LTab', LTab);
        app.component('LTabItem', LTabItem);
        app.component('LDialog', LDialog);

        app.use(loadingDirective);
    }
}



//Vue.prototype.$loading = Loading.service;


//import Message from './message/index.js';


