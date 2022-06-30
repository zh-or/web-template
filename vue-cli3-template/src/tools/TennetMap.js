/*
<script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=BXABZ-GGFL5-EBLII-Q3CDN-IF77Q-USFWW"></script>
*/
let Map = qq.maps.Map;
let Marker = qq.maps.Marker;
let LatLng = qq.maps.LatLng;
let Event = qq.maps.event;

let MarkerImage = qq.maps.MarkerImage;
let MarkerShape = qq.maps.MarkerShape;
let MarkerAnimation = qq.maps.MarkerAnimation;
let Point = qq.maps.Point;
let Size = qq.maps.Size;
let ALIGN = qq.maps.ALIGN;

let MVCArray = qq.maps.MVCArray;
let MarkerCluster = qq.maps.MarkerCluster;
let Cluster = qq.maps.Cluster;
let MarkerDecoration = qq.maps.MarkerDecoration;


export default {
    map: null,
    markers: [],
    newIcon(url, opt){
        //https://lbs.qq.com/javascript_v2/images/people35.png
        opt = opt || {};
        opt.x = opt.x || 15;
        opt.y = opt.y || 15;
        opt.w = opt.w || 30;
        opt.h = opt.h || 30;
        return new MarkerImage(
            url,
            null,
            null,
            new Point(opt.x, opt.y),
            new Size(opt.w, opt.h)
        );
    },
    newMarkerDecoration(html, x, y){
        return new MarkerDecoration(html, new Point(x, y));
    },
    init(sel, zoom) {
        this.map = new Map(document.querySelector(sel), {
            zoom: zoom || 5
        });
        return this;
    },
    clear() {
        this.markers.forEach(function (m) {
            m.marker.setMap(null);
        });
        this.markers = [];
    },
    find(id){
        for(let i = 0; i < this.markers.length; i++){
            if(this.markers[i].id == id){
                return this.markers[i];
            }
        }
        return null;
    },
    add(opt) {
        //console.log(opt);
        opt = opt || {};
        opt.id = opt.id || '';
        opt.icon = opt.icon || null;
        opt.decoration = opt.decoration || null;
        //new MarkerDecoration('<font style="color: #fff;">p</font>', new Point(1, -10))

        let old = this.find(opt.id);
        if(old){
            return null;
        }
        let marker = {
            id: opt.id,
            lat: opt.lat,
            lng: opt.lng,
            marker: null,
            click: function (fun) {
                let self = this;
                Event.addListener(self.marker, 'click', function () {
                    fun(self);
                });
                return this;
            }
        }
        marker.marker = new Marker({
            map: this.map,
            animation: MarkerAnimation.DROP,
            clickable: opt.click || true,
            title: opt.title || '',
            position: new LatLng(Number(opt.lat), Number(opt.lng)),
            autoRotation: opt.autoRotation || false,//自动旋转
            rotation: opt.rotation || 0,
            icon: opt.icon,
        });
        if ( opt.decoration) {
            marker.marker.setDecoration(opt.decoration);
        }
        this.markers.push(marker);
        return marker;
    },
    remove(id){
        for(let i = 0; i < this.markers.length; i++){
            if(this.markers[i].id == id){
                this.markers[i].marker.setMap(null);
                this.markers.splice(i, 1);

                break;
            }
        }
    },
    move(id, lat, lng, r, speed){
        let m = this.find(id);
        if(!m){
            console.error('未找到ID为:' + id + ' 的marker');
            return;
        }
        m.marker.setRotation(r || 0);
        m.marker.moveTo(new LatLng(Number(lat), Number(lng)), speed || 1000);
    }
}
