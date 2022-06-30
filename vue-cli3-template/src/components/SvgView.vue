<template>
    <div class="map" ref="_map_">
        <div class="view" :style="mapWrapStyle" :id="id"></div>
    </div>
</template>

<script>
    import {SVG} from '@svgdotjs/svg.js';

    export default {
        name: "SvgMap",
        data() {
            return {
                id: this.$t.getId('svg-wrap-'),
                svg: null,
                dSvg: null,
                mapViewStart: {x: 0, y: 0},
                mapViewMove: {x: 0, y: 0},
                zoom: 1,
                isMove: false,
                canMove: false,
                updateCallBack: null,
                click: {
                    attr: [],
                    delay: 300,
                    downTime: 0,
                },
                enterLeave: []
            }
        },
        computed: {
            mapWrapStyle() {
                let str = `translate(${this.mapViewMove.x}px,${this.mapViewMove.y}px) scale(${this.zoom}, ${this.zoom})`;
                return {
                    transform: str,
                    '-webkit-transform': str,
                    '-moz-transform': str,
                    '-o-transform': str,
                    '-ms-transform': str,
                }
            }
        },
        methods: {
            addClick(sel, fun) {
                for (let i = 0; i < this.click.attr.length; i++) {
                    let obj = this.click.attr[i];
                    if (obj.sel == sel) {
                        obj.callback = obj.callback || [];
                        obj.callback.push(fun);
                        return;
                    }
                }
                this.click.attr.push({
                    sel: sel,
                    callback: [fun]
                });
            },
            removeClick(sel) {
                for (let i = 0; i < this.click.attr.length; i++) {
                    let obj = this.click.attr[i];
                    if (obj.sel == sel) {
                        this.click.attr.splice(i, 1);
                        return;
                    }
                }
            },
            /*异形svg还没找到api来判断范围*/
            addMouseEnterLeave(sel, enter, leave) {
                this.enterLeave.push({
                    sel: sel,
                    enter: enter,
                    leave: leave,
                    is: false,
                })
            },
            removeMouseEnterLeave(sel) {
                for (let i = 0; i < this.enterLeave.length; i++) {
                    let obj = this.enterLeave[i];
                    if (obj.sel == sel) {
                        obj.is = false;
                        obj.leave();
                        this.enterLeave.splice(i, 1);
                        return;
                    }
                }
            },
            loadMap(map, update) {
                console.log('load map->');
                let self = this;
                let wrap = this.$refs._map_;
                let start = function (e) {
                    if (e.targetTouches) {
                        self.mapViewStart = {
                            x: e.targetTouches[0].pageX - self.mapViewMove.x,
                            y: e.targetTouches[0].pageY - self.mapViewMove.y
                        };
                    } else {
                        self.mapViewStart = {
                            x: e.clientX - self.mapViewMove.x,
                            y: e.clientY - self.mapViewMove.y
                        };
                    }
                    self.click.downTime = Date.now();
                    self.canMove = true;
                }
                let end = function (e) {
                    //console.log(e);
                    self.isMove = false;
                    self.canMove = false;
                    if (Date.now() - self.click.downTime <= self.click.delay) {
                        /*单击事件, 单独处理*/
                        let x = e.clientX,
                            y = e.clientY;
                        for (let i = 0; i < self.click.attr.length; i++) {
                            let obj = self.click.attr[i];
                            let doms = document.querySelectorAll(obj.sel);
                            for(let i = 0; i < doms.length; i++){
                                let dom = doms[i];
                                let rect = dom.getBoundingClientRect();
                                /*let p2 = SVG().path().point(x, y);
                                let p = self.dSvg.createSVGPoint();
                                p.x = p2.x;
                                p.y = p2.y;
                                //还没有api可以直接判断
                                console.log('inside', dom.isPointInFill(p));*/
                                if ((x >= rect.left && x <= rect.right) && (y >= rect.top && y <= rect.bottom)) {
                                    obj.callback.forEach(f => {
                                        f.call(dom);
                                    })
                                }
                            }

                        }
                    }
                };
                this.$t.IsPC() ?
                    wrap.addEventListener('mousedown', start) :
                    wrap.addEventListener('touchstart', start);
                this.$t.IsPC() ?
                    wrap.addEventListener('mouseup', end) :
                    wrap.addEventListener('touchend', end);

                this.$t.IsPC() ?
                    wrap.addEventListener('mousemove', this.moveFun) :
                    wrap.addEventListener('touchmove', this.moveFun);

                wrap.addEventListener('mousewheel', this.zoomFun);
                /*清空*/
                //document.querySelector('#svg_map_view').innerHTML = '';

                this.svg = SVG('#' + this.id);
                this.svg.svg(map);
                window._svg_ = window._svg_ || [];
                window._svg_.push(this.svg);

                self.dSvg = document.querySelector('#' + this.id + ' svg');
                /*缩放到合适的大小*/
                let h = wrap.offsetHeight,
                    w = wrap.offsetWidth,
                    dh = self.dSvg.clientHeight,
                    dw = self.dSvg.clientWidth;
                let sh = h - dh,
                    sw = w - dw;
                let z = 1;
                if (sw > sh) {
                    z = sh / dh;
                } else {
                    z = sw / dw;
                }
                this.zoom = 1 + z;
                console.log(`h:${h}, w:${w}\ndh:${dh}, dw:${dw}\nsh:${sh}, sw:${sw}\nz:${z}`);
                /*居中显示*/

                /*初始化后可能有缩放, 缩放后不居中问题*/
                /*顶对齐左对齐*/
                //this.move(-(dw *  (1 - this.zoom) / 2), -(dh *  (1 - this.zoom) / 2));
                this.move(0, -(dh * (1 - this.zoom) / 2));

                this.updateCallBack = update;
                this.updatePosition();
            },
            zoomTo(z) {
                if (z == undefined) {
                    return this.zoom;
                }
                this.zoom = this.zoom + z;
            },
            move(x, y) {
                this.mapViewMove.x += x;
                this.mapViewMove.y += y;
                this.updatePosition();
            },
            getWrap() {
                return this.$refs._map_;
            },
            moveFun(e) {
                if (this.canMove) {
                    this.isMove = true;
                    let x = 0,
                        y = 0;
                    if (e.targetTouches) {
                        x = e.targetTouches[0].pageX - this.mapViewStart.x;
                        y = e.targetTouches[0].pageY - this.mapViewStart.y;
                    } else {
                        x = e.clientX - this.mapViewStart.x;
                        y = e.clientY - this.mapViewStart.y;
                    }
                    this.mapViewMove.x = x;
                    this.mapViewMove.y = y;
                    this.updatePosition();
                }
                let x = e.clientX,
                    y = e.clientY;
                //console.log('````````````````````````````````````````````');
                for (let i = 0; i < this.enterLeave.length; i++) {
                    let obj = this.enterLeave[i];
                    let doms = document.querySelectorAll(obj.sel);

                    [].forEach.call(doms, (dom) => {
                        let rect = dom.getBoundingClientRect();
                        //console.error(`len:${doms.length} x=>${(x >= rect.left && x <= rect.right)} y=>${(y >= rect.top && y <= rect.bottom)} x:${x}, ${rect.left}-${rect.right} y:${y}, ${rect.top}-${rect.bottom}`);

                        /*由于每个dom都在检查可能会有冲突*/
                        if ((x >= rect.left && x <= rect.right) && (y >= rect.top && y <= rect.bottom)) {
                            if (!obj.is) {
                                obj.is = true;
                                obj.enter.call(dom);
                            }
                        } else {
                            if (obj.is) {
                                obj.is = false;
                                obj.leave.call(dom);
                            }
                        }
                    });
                }
                //console.log('````````````````````````````````````````````');
            },
            zoomFun(e) {
                if (e.deltaY > 0) { /*向下滚动, 缩小*/
                    if (this.zoom - 0.1 <= 0) {
                        return;
                    }
                    this.zoom -= 0.1;
                } else { /*向上滚动, 放大*/
                    this.zoom += 0.1;
                }
                this.updatePosition();
            },
            getBox(name) {
                let dom = this.svg.findOne('[name="' + name + '"]');
                return dom.bbox();
            },
            appendImg(name, img, w, h, offset) {
                let isFun = typeof w == 'function';
                if (!isFun) {
                    w = w || 50;
                    h = h || 50;
                }
                offset = offset || {x:0, y:0};
                let self = this;
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();
                let imgDom = SVG().image(img, function (e) {
                    if (isFun) {
                        w.call({ctx: this, dom: dom, box: box}, e, h, offset);
                    } else {
                        w = w > this.width ? this.width() : w;
                        h = h > this.height ? this.height() : h;
                        let x = box.x + (box.width >> 1) - (w >> 1);
                        let y = box.y + (box.height >> 1) - (h >> 1);
                        this.size(h, w);
                        this.move(x + offset.x, y + offset.y);
                    }
                });
                imgDom.addTo(dom.parent());
                return imgDom;
            },
            appendlocked(name, img, w, h, offset) {
                w = w || 600;
                h = h || 600;
                offset = offset || {x:0, y:0};
                let self = this;
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();
                let imgDom = SVG().image(img, function (e) {

                    w = w > this.width ? this.width : w;
                    h = h > this.height ? this.height : h;
                    let x = box.x + (box.width >> 1) - (w >> 1);
                    let y = box.y + (box.height >> 1) - (h >> 1);
                    let fb = true;
                    this.size(h, w);
                    this.move(x + offset.x, y + offset.y);
                    imgDom.timer = setInterval(function () {
                        if (fb) {
                            imgDom.animate(500)
                                .move(x + (w >> 1) * 0.3 + offset.x, y + (h >> 1) * 0.3 + offset.y)
                                .size(w - w * 0.3, h - h * 0.3);
                        } else {
                            imgDom.animate(0)
                                .move(x - (w >> 1) * 0.3 + offset.x, y - (h >> 1) * 0.3 + offset.y)
                                .size(w + w * 0.3, h + h * 0.3);
                        }
                        fb = !fb;
                    }, 500);
                });
                imgDom.addTo(dom.parent());
                imgDom.backward();
                return imgDom;
            },
            appendSvg(name, svg, w, h, offset) {
                w = w || 50;
                h = h || 50;
                offset = offset || {x:0, y:0};
                let self = this;
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();
                let _svg = SVG(svg, function (e) {
                    w = w > this.width ? this.width : w;
                    h = h > this.height ? this.height : h;
                    let x = box.x + (box.width >> 1) - (w >> 1);
                    let y = box.y + (box.height >> 1) - (h >> 1);
                    this.size(h, w);
                    this.move(x + offset.x, y + offset.y);
                });
                _svg.addTo(this.svg);
            },
            appendSvg2(name, svg, w, h, offset) {
                w = w || 50;
                h = h || 50;
                offset = offset || {x:0, y:0};
                let self = this;
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();
                let _svg = SVG().svg(svg, function (e) {
                    w = w > this.width ? this.width : w;
                    h = h > this.height ? this.height : h;
                    let x = box.x + (box.width >> 1) - (w >> 1);
                    let y = box.y + (box.height >> 1) - (h >> 1);
                    this.size(h, w);
                    this.move(x + offset.x, y + offset.y);
                });
                _svg.addTo(this.svg);
            },
            appendText(name, text, offset) {
                offset = offset || {x: 0, y:0};
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();

                let textDom = SVG().text(text);
                let textBox = textDom.bbox();
                let x = box.x + (box.width >> 1) - (textBox.width >> 1);
                let y = box.y + (box.height >> 1) + 20;
                textDom.move(x + offset.x, y + offset.y).fill('#fff').attr({
                    'font-size': '16px'
                }).size(30, 50);
                textDom.addTo(dom.parent());
            },
            appendRText(name, text) {
                let dom = this.svg.findOne('[name="' + name + '"]');
                let box = dom.bbox();

                let circle = SVG().circle(30);
                circle.fill('#E90014');
                circle.stroke('#fff');
                let circleBox = circle.bbox();
                circle.move(
                    box.x + (box.width >> 1) - (circleBox.width >> 1) + 50,
                    box.y + (box.height >> 1)
                )

                let textDom = SVG().text(text);
                let textBox = textDom.bbox();
                let x = box.x + (box.width >> 1) - (textBox.width >> 1) + 50;
                let y = box.y + (box.height >> 1) + 5;
                textDom.move(x, y).fill('#fff').attr({
                    'font-size': '16px'
                }).size(30, 50);
                circle.addTo(dom.parent());
                textDom.addTo(dom.parent());
            },
            updatePosition() {
                this.updateCallBack && this.updateCallBack();
            },
            getSvg() {
                return this.svg;
            },
            getDSvg(){
                return this.dSvg;
            },
            clear() {
                this.click.attr = [];
                this.enterLeave = [];
                this.mapViewMove.x = 0;
                this.mapViewMove.y = 0;
                this.zoom = 1;
                try{
                    if(this.svg) {
                        this.svg.clear();
                    }
                } catch(e){};
            }
        }
    }
</script>

<style scoped lang="less">

    .map {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;

        .view {

        }
    }
</style>
