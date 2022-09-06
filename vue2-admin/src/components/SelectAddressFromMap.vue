<template>
    <el-dialog :visible.sync="show"
               title="选择地址"
               @close="$emit('update:show', false)">
        <div class="select-address-map-wrap" v-loading="loading">
            <div class="search">
                <el-autocomplete
                        v-model="searchVal"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        clearable
                        class="inline-input w-50"
                        placeholder="输入搜索地址"
                        @select="handleSelect"
                >
                    <template #append>
                        <svg-icon name="search"/>
                    </template>
                </el-autocomplete>
                <span v-show="selectAddress">
                    地址: {{selectAddress}} {{selectlnglat}}
                </span>
            </div>

            <div :id="mapId" class="map-view"></div>

            <div class="btn-wrap">
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup name="SelectAddressFromMap">
    import {get} from '@/utils/xhr';

    const {proxy} = getCurrentInstance();
    const emit = defineEmits();
    const props = defineProps({
        show: Boolean,
        address: String,
        lnglat: Array,
        lng: Number | String,
        lat: Number | String,
    })

    const searchVal = ref('');
    const selectAddress = ref('');
    const selectlnglat = ref([]);
    const mapId = ref('');
    const loading = ref(true);

    let currentCityName = '重庆市';
    let map = null;
    watch(() => props.show, (n, old) => {
        if (!n) return;
        if(!mapId.value) {
            mapId.value = Date.now() + '_map';
        }
        nextTick(_ => {
            if (!map) {
                map = new BMap.Map(mapId.value);
                let point = new BMap.Point(116.404, 39.915);
                map.centerAndZoom(point, 12);
                map.addControl(new BMap.NavigationControl());
                map.addControl(new BMap.ScaleControl());
                map.enableScrollWheelZoom();
                map.enableKeyboard();

                //点击地图选择位置
                let geoc = new BMap.Geocoder();
                map.addEventListener("click", function (e) {
                    let pt = e.point;
                    geoc.getLocation(pt, function (rs) {
                        let addComp = rs.addressComponents;
                        console.log('click', rs);
                        let addr = rs.address;
                        if(rs.surroundingPois.length > 0) {
                            addr = rs.surroundingPois[0].title;
                            if(!addr.startsWith(rs.surroundingPois[0].city)) {
                                addr = rs.surroundingPois[0].city + addr;
                            }
                        }
                        selectPos(addr, pt.lat, pt.lng);
                    });
                });

                if(props.address && props.lat && props.lng)  {
                    selectPos(props.address, props.lat, props.lng, true);
                    loading.value = false;
                } else {
                    //ip定位
                    let myCity = new BMap.LocalCity();
                    myCity.get(function (result) {
                        let cityName = result.name;
                        currentCityName = result.name;
                        console.log(result);
                        map.setCenter(cityName);
                        loading.value = false;
                    });
                }


            }
            //console.log('init', proxy.$refs.map);
        })
    })

    function handleSelect(item) {
        item = toRaw(item.raw);
        console.log('search', item);
        let addr = item.province + item.name;
        if(!addr.startsWith(item.city)) {
            addr = item.province + item.city + item.name;
        }
        selectPos(addr, item.location.lat, item.location.lng, true);
    }

    function selectPos(name, lat, lng, center) {
        map.clearOverlays();
        let point = new BMap.Point(lng, lat);
        let mk = new BMap.Marker(point);
        let label = new BMap.Label(name);
        label.setOffset(new BMap.Size(0, -20));
        mk.setLabel(label);
        map.addOverlay(mk);
        if(center) {
            map.setCenter(point);
        }
        selectAddress.value = name;
        selectlnglat.value = [lat, lng];
        emit('update:lat', Number(lat));
        emit('update:lng', Number(lng));
        emit('update:address', selectAddress);
        emit('update:selectlnglat', selectlnglat);
    }

    function confirm() {
        emit('update:address', selectAddress);
        emit('update:selectlnglat', selectlnglat);
        emit('update:show', false)
    }

    function querySearch(queryString, cb) {
        get('/baidu-api/place/v2/suggestion', {
            ak: 'SrPEVGSQCe6W6VDoVaLH0sDMxION8kbV',
            query: queryString,
            region: currentCityName,
            city_limit: true,
            output: 'json'
        })
            .then(res => {
                //console.log(res);
                let data = JSON.parse(res);
                if (data.status == 0) {
                    cb(data.result.map(_ => {
                        let item = {
                            raw: _,
                            value: _.name,
                        }
                        return item;
                    }))
                    return;
                }
                cb([])
            })
            .catch(e => {
                cb([]);
            })
    }

</script>

<style lang="scss">
    .select-address-map-wrap {

        .search {
            padding: 10px;
            font-size: 14px;
        }

        .map-view {
            height: 300px;
        }

        .btn-wrap {
            padding-top: 15px;
            text-align: center;
        }
    }
</style>
