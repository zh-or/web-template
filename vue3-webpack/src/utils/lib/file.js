import base from './base.js';

export default {
    saveFile(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url);
        }
        let aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || '';
        let event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    },
    selectFile(cb) {
        let input = document.querySelector('#_______t_select_input_1______');
        if(!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = '_______t_select_input_1______';
            input.style = 'width: 1px; height: 1px; opacity: 0.01; position: absolute; z-index: -1;top: -100px;left: -100px;';
            document.body.appendChild(input);
        }

        input.onchange = function() {
            cb(input.files);
            document.body.removeChild(input);
        };
        input.click();

    },
    selectDir(cb) {
        let input = document.querySelector('#_______t_select_input_2______');
        if(!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = '_______t_select_input_2______';
            input.setAttribute('webkitdirectory', '');
            input.setAttribute('directory', '');
            input.style = 'width: 1px; height: 1px; opacity: 0.01; position: absolute; z-index: -1;top: -100px;left: -100px;';

            document.body.appendChild(input);
        }

        input.onchange = function() {
            cb(input.files);
            document.body.removeChild(input);
        };
        input.click();
    },
}
