import base from './base.js';

export default {
    saveFile(obj, saveName) {
        let needFree = false;
        if (typeof obj == 'object' && obj instanceof Blob) {
            obj = this.getObjectURL(obj);
            needFree = true;
        }
        let aLink = document.createElement('a');
        aLink.href = obj;
        aLink.download = saveName || '';
        let event;
        if (window.MouseEvent) {
            event = new MouseEvent('click');
        } else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
        if(needFree) {
            this.freeObj(obj);
        }
    },
    selectFile(cb, opt) {
        opt = opt || {};
        opt.multiple = !!opt.multiple;
        opt.capture = !!opt.capture;
        opt.accept = opt.accept || '*/*';
        let id = '_______t_select_input_1_a____';
        let input = document.querySelector('#' + id);
        if(!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = id;
            input.style = 'width: 1px; height: 1px; opacity: 0.01; position: absolute; z-index: -1;top: -100px;left: -100px;';
            document.body.appendChild(input);
        }
        //input.setAttribute('capture', capture);
        opt.multiple && input.setAttribute('multiple', 'multiple');
        opt.capture && input.setAttribute('capture', capture);
        input.setAttribute('accept', opt.accept);

        input.onchange = () => {
            //console.log('选择文件:', input.files);
            cb && cb(input.files);
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
    reSizeImg(file, size/*{ height, width } */) {
        /*从文件读取图片并压缩*/
        let start = Date.now();
        //console.log('压缩前大小:', file.size);
        return new Promise((res, rej) => {
            try {
                let reader = new FileReader();
                reader.onload = function () {
                    let img = new Image();
                    img.src = this.result;
                    img.onload = function () {
                        let self = this;
                        let w = self.width,
                            h = self.height,
                            scale = w / h,
                            quality = 0.7;
                        w = size.width;
                        h = size.height || (w * scale);

                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        let anw = document.createAttribute("width");
                        anw.nodeValue = w;
                        let anh = document.createAttribute("height");
                        anh.nodeValue = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        ctx.drawImage(self, 0, 0, w, h);

                        canvas.toBlob((f) => {
                            //console.log('压缩后大小:', f.size, '压缩用时:', Date.now() - start);
                            res(new File([f], file.name, { type: file.type }));
                        }, file.type, 0.9);
                    }
                }
                reader.readAsDataURL(file);
            } catch (e) {
                rej(e);
            }
        });
    },
    getObjectBase64(file) {
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.addEventListener('load', () => {
                    resolve(reader.result);
                });
                reader.readAsDataURL(file);
            } catch(e) {
                reject(e);
            }
        });
    },
    getObjectURL(file) {
        if (!file) {
            return '';
        }

        let url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    freeObj(obj) {
        try {
            if (window.createObjectURL != undefined) {
                window.revokeObjectURL(obj);
            } else if (window.URL != undefined) {
                window.URL.revokeObjectURL(obj);
            } else if (window.webkitURL != undefined) {
                window.webkitURL.revokeObjectURL(obj);
            }
        } catch(e) {
            console.error('释放资源出错:', e);
        }
    },
}
