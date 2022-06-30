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
        input.style.opacity = 0;
        input.style.height = 0;
        input.style.width = 0;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        //input.style.display = 'none';
        document.body.removeChild(input);
    },
}
