import base from './base.js';

export default {
    trim(str) {
        return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');
    },
    HTMLdecode(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },
    HTMLencode(str) {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    },
    formatFileSize(len) {
        len = Number(len);
        if (len < 1024) {
            return len + 'Byte';
        } else if (len < 1024 * 1024) {
            return (len / 1024).toFixed(2) + 'KB';
        } else {
            return (len / 1024 / 1024).toFixed(2) + 'MB';
        }
    },
    copyString(str) {
        let input = document.createElement('input');
        input.value = str;
        input.style.opacity = .1;
        input.style.height = 1;
        input.style.width = 1;
        input.style.zIndex = -1;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        //input.style.display = 'none';
        setTimeout(_ => {
            document.body.removeChild(input);
        }, 1);
    },
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        )
    },
    utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    },
    b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }
}
