import base from './base.js';
import './support/ui.css';

export default {
    _toast_timer_: null,
    showToast(msg, timeout) {
        clearTimeout(this._toast_timer_);
        let toast = document.querySelector('#tmp_toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tmp_toast';
            toast.className = 'box-shadow';
            document.body.appendChild(toast);
        }
        if (!msg) msg = '';
        toast.innerHTML = msg;
        toast.style.display = 'block';
        toast.style.opacity = 0.8;
        toast.style.left = ((document.body.clientWidth >> 1) - (toast.clientWidth >> 1)) + 'px';

        this._toast_timer_ = setTimeout(function () {
            toast.style.opacity = 0;
            setTimeout(function () {
                toast.style.display = 'none';
            }, 400);
        }, timeout || 2000);
    },
    showWait(msg) {
        let wait = document.querySelector('#tmp_wait');
        let bg = document.querySelector('#tmp_wait_bg');
        if (!wait) {
            wait = document.createElement('div');
            bg = document.createElement('div');
            wait.id = 'tmp_wait';
            bg.id = 'tmp_wait_bg';
            wait.className = 'box-shadow';
            wait.innerHTML = '<div><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></div><div id="tmp_wait_content"></div>';
            document.body.appendChild(wait);
            document.body.appendChild(bg);
        }
        if (!msg) msg = '';
        document.querySelector('#tmp_wait_content').innerHTML = msg;
        bg.style.display = 'block';
        wait.style.display = 'block';
        setTimeout(_ => {
            bg.style.opacity = 0.5;
            //wait.innerHTML += msg;
            wait.style.opacity = 1;
            wait.style.left = ((document.body.clientWidth >> 1) - (wait.clientWidth >> 1)) + 'px';
        }, 1);
    },
    hideWait() {
        let wait = document.querySelector('#tmp_wait');
        let bg = document.querySelector('#tmp_wait_bg');
        if (wait && bg) {
            bg.style.opacity = 0;
            wait.style.opacity = 0;
            setTimeout(function () {
                wait.style.display = 'none';
                bg.style.display = 'none';
            }, 200);
        }
    },
}
