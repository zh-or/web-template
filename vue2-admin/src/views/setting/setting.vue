<template>
    <div class="page page-setting" v-loading="loading">
        <el-tabs type="card">
            <el-tab-pane label="基础信息">
                <el-form :model="baseData.form"
                         :rules="baseData.rules"
                         class="page-form"
                         ref="baseDataFormRef"
                         :inline="true"
                         label-width="120px">
                    <el-form-item label="店铺名称:">
                        <el-input v-model="baseData.form.merchantName" placeholder="请输入店铺名称"/>
                    </el-form-item>
                    <el-form-item label="所属行业:">
                        <TradeSelect v-model="baseData.form.tradeId"/>
                    </el-form-item>
                    <el-form-item label="营业时间:">
                        <el-input v-model="baseData.form.openTime" placeholder="请输入营业时间"/>
                    </el-form-item>
                    <el-form-item label="服务电话:">
                        <el-input v-model="baseData.form.servicePhone" placeholder="请输入服务电话"/>
                    </el-form-item>
                    <el-form-item label="店铺地址:">
                        <el-input v-model="baseData.form.address"
                                  placeholder="请输入店铺地址"
                                  style="width: 200px;display: inline-block;"/>
                        <a class="ml10 link-type"
                           @click="showSelectAddress = true">地图标注</a>
                    </el-form-item>
                    <el-form-item label="服务介绍:" class="block">
                        <el-input type="textarea" rows="4"
                                  placeholder="请输入服务介绍"
                                  v-model="baseData.form.serviceNote"/>
                    </el-form-item>
                    <el-form-item label="营业证照:">
                        <FileSelect :fileList.sync="baseData.files.BusinessLicenseFiles"
                                    :limit="1"
                                    @delete="f => deleteInfoFile(f, 0)"
                                    :isPic="true"/>
                        <!--<FileUpload :isPic="true" :limit="1"/>-->
                    </el-form-item>
                    <el-form-item label="店铺LOGO:">
                        <FileSelect :fileList.sync="baseData.files.LogoFiles"
                                    :limit="1"
                                    @delete="f => deleteInfoFile(f, 1)"
                                    :isPic="true"/>
                        <!--<FileUpload :isPic="true" :limit="1"/>-->
                    </el-form-item>
                    <el-form-item label="店铺介绍:">
                        <FileSelect :fileList.sync="baseData.files.ShopSignFiles"
                                    :limit="1"
                                    @delete="f => deleteInfoFile(f, 2)"
                                    :isPic="true"/>
                        <!--<FileUpload :isPic="true" :limit="1"/>-->
                    </el-form-item>
                    <el-form-item label="环境展示:" class="block">
                        <FileSelect :fileList.sync="baseData.files.EnvironmentShowFiles"
                                    :limit="5"
                                    @delete="f => deleteInfoFile(f, 3)"
                                    :isPic="true"/>
                        <!--<FileUpload :isPic="true" :limit="5"/>-->
                    </el-form-item>
                </el-form>
                <div class="form-btn-wrap">
                    <el-button type="primary" @click="saveInfo">保存</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane label="配送设置">
                <div class="setting-line-wrap">
                    <div class="item">
                        <el-checkbox v-model="dbData.open_min_delivery_fee">起送费设置:</el-checkbox>
                        <!--<span >起送费设置:</span>-->
                        <el-input class="ml10" type="number" v-model="dbData.min_delivery_fee">
                            <template #append>元</template>
                        </el-input>
                    </div>
                    <div class="item">
                        <el-checkbox v-model="dbData.open_pickup_store">开启到店领取</el-checkbox>
                    </div>
                    <div class="item">
                        <el-checkbox v-model="dbData.open_seller_distribution">开启商家配送, 配送距离最大不超过方圆</el-checkbox>
                        <el-input class="ml10" type="number" v-model="dbData.distribution_max_range">
                            <template #append>公里</template>
                        </el-input>
                        , 配送时间范围
                        <el-input class="ml10" v-model="dbData.distribution_date">
                        </el-input>
                    </div>
                    <div class="item">
                        <el-checkbox v-model="dbData.auto_receiving_order">开启自动接单</el-checkbox>
                    </div>
                </div>

            </el-tab-pane>
        </el-tabs>
        <SelectAddressFromMap :show.sync="showSelectAddress"
                              :lat.sync="baseData.form.latitude"
                              :lng.sync="baseData.form.longitude"
                              /><!--v-model:address="baseData.form.address"-->
    </div>
</template>

<script setup name="setting">
    import {getRule} from "@/utils/utils";
    import SelectAddressFromMap from '@/components/SelectAddressFromMap';
    import TradeSelect from '@/components/TradeSelect';

    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
    } from '@/autoImportUtils/index.js';


    const showSelectAddress = ref(false);
    const loading = ref(false);
    const baseDataFormRef = ref(null)

    const baseData = reactive({
        form: {
            address: '',
            files: [],//"[{\"fileType\":1,\"fileId\":7},{\"fileType\":2,\"fileId\":8},{\"fileType\":2,\"fileId\":9}]",
            latitude: '',
            longitude: '',
            merchantId: 0,
            merchantName: "",
            merchantType: 1,
            merchantTypeName: "",
            openTime: '',
            serviceNote: '',
            servicePhone: '',
            tradeId: 4,
            tradeName: "",
        },
        files: {
            BusinessLicenseFiles: [],
            EnvironmentShowFiles: [],
            ShopSignFiles: [],
            LogoFiles: [],
            del0: [],//	删除营业执照文件: 0
            del1: [],//	删除LOGO图标: 1
            del2: [],//删除店铺店招文件: 2
            del3: [],//删除环境展示文件: 3
        },
        rules: {
            name: getRule('请输入'),
        }
    });

    const dbData = reactive({
        open_min_delivery_fee: false,//是否开启最低配送费用
        min_delivery_fee: 0,//最低配送费用
        open_pickup_store: false,//开启到店领取
        open_seller_distribution: false,//开启上架配送
        distribution_max_range: 0, //配送最大距离
        distribution_date: 0,//配送时间
        auto_receiving_order: false,//自动接单
    })

    watch(_ => dbData, v => {
        throttle();
    }, {deep: true});


    function loadInfo() {
        loading.value = true;
        baseData.files.EnvironmentShowFiles = [];
        Promise.all([
            $api.getMerchantInfo(),
            $api.getMerchantParams(),
        ])
            .then(([info, params]) => {
                Object.keys(info.data).forEach(k => {
                    if(baseData.form.hasOwnProperty(k)) {
                        switch(k) {
                            case 'files':
                                let fs = [];
                                try {
                                    fs = JSON.parse(info.data.files) || [];
                                } catch(e) {
                                    console.error(e);
                                }

                                fs.forEach(f => {
                                    let fObj = {
                                        url : getImgUrl('merchant', f.fileId),
                                        id: f.fileId
                                    };
                                    if(f.fileType == 0) {
                                        baseData.files.BusinessLicenseFiles = fObj;
                                    } else if(f.fileType == 1) {
                                        baseData.files.LogoFiles = fObj;
                                    } else if(f.fileType == 2) {
                                        baseData.files.ShopSignFiles = fObj;
                                    } else if(f.fileType == 3) {
                                        baseData.files.EnvironmentShowFiles.push(fObj);
                                    }
                                })
                                break;
                            default:
                                baseData.form[k] = info.data[k] || '';
                                break;
                        }
                    }
                });

                params.rows.forEach(item => {
                    let type = typeof dbData[item.paramCode];
                    switch(type) {
                        case 'boolean':
                            dbData[item.paramCode] = item.paramValue === 'true';
                            break;
                        case 'number':
                            dbData[item.paramCode] = Number(item.paramValue);
                            break;
                    }
                })


                console.log(info, params);
                setTimeout(_ => {
                    loading.value = false;
                }, 10);
            })
            .catch(e => {
                //$modal.warning('网络错误~');
                console.error(e);
                loading.value = false;
            })
    }

    loadInfo();

    function deleteInfoFile(f, type) {
        if(f.id) {
            baseData.files[`del${type}`].push(f);
        }
    }

    function saveInfo() {
        baseDataFormRef.value.validate(v => {
            if(v) {
                loading.value = true;
                let formData = new FormData();

                formData.append('address', baseData.form.address);
                formData.append('latitude', baseData.form.latitude);
                formData.append('longitude', baseData.form.longitude);
                formData.append('merchantId', baseData.form.merchantId);
                formData.append('merchantName', baseData.form.merchantName);
                formData.append('merchantType', baseData.form.merchantType);
                formData.append('merchantTypeName', baseData.form.merchantTypeName);
                formData.append('openTime', baseData.form.openTime);
                formData.append('serviceNote', baseData.form.serviceNote);
                formData.append('servicePhone', baseData.form.servicePhone);
                formData.append('tradeId', baseData.form.tradeId);

                if(
                    baseData.files.BusinessLicenseFiles && baseData.files.BusinessLicenseFiles.isNew
                ) {

                    formData.append('addBusinessLicenseFiles',
                        baseData.files.BusinessLicenseFiles.file,
                        baseData.files.BusinessLicenseFiles.file.name);
                }

                baseData.files.EnvironmentShowFiles.forEach(f => {
                    if(f.isNew) {
                        formData.append(
                            'addEnvironmentShowFiles',
                            f.file,
                            f.file.name);
                    }
                })
                if(
                    baseData.files.ShopSignFiles && baseData.files.ShopSignFiles.isNew
                ) {

                    formData.append('addShopSignFiles',
                        baseData.files.ShopSignFiles.file,
                        baseData.files.ShopSignFiles.file.name);
                }
                if(
                    baseData.files.LogoFiles && baseData.files.LogoFiles.isNew
                ) {

                    formData.append('addLogoFiles',
                        baseData.files.LogoFiles.file,
                        baseData.files.LogoFiles.file.name);
                }


                formData.append('deleteBusinessLicenseFiles', baseData.files.del0.map(_ => _.id).join(','));
                formData.append('deleteLogoFiles', baseData.files.del1.map(_ => _.id).join(','));
                formData.append('deleteShopSignFiles', baseData.files.del2.map(_ => _.id).join(','));
                formData.append('deleteEnvironmentShowFiles', baseData.files.del3.map(_ => _.id).join(','));

                $api.setMerchantInfo(formData)
                    .then(res => {
                        $modal.success('保存成功');
                        loadInfo();
                    })
                    .catch(e => {
                        console.log(e);
                        loading.value = false;
                    })
            } else {
                $modal.warning('请检查必填项 !')
            }
        })
    }

    let timer;

    function throttle() {
        if(loading.value) {
            return;
        }
        let delay = _ => {
            timer = setTimeout(_ => {
                timer = null;
                updateParamsFun();
            }, 500);
        }

        if(timer) {
            clearTimeout(timer)
        }
        delay();
    }

    function updateParamsFun() {
        let params = [
            {isUsed: 1, paramCode: 'open_min_delivery_fee',
                paramName: 'open_min_delivery_fee',
                paramValue: dbData.open_min_delivery_fee, remark: '是否开启最低配送费用'},
            {isUsed: 1, paramCode: 'min_delivery_fee',
                paramName: 'min_delivery_fee',
                paramValue: dbData.min_delivery_fee, remark: '最低配送费用'},
            {isUsed: 1, paramCode: 'open_pickup_store',
                paramName: 'open_pickup_store',
                paramValue: dbData.open_pickup_store, remark: '开启到店领取'},
            {isUsed: 1, paramCode: 'open_seller_distribution',
                paramName: 'open_seller_distribution',
                paramValue: dbData.open_seller_distribution, remark: '开启上架配送'},
            {isUsed: 1, paramCode: 'distribution_max_range',
                paramName: 'distribution_max_range',
                paramValue: dbData.distribution_max_range, remark: '配送最大距离'},
            {isUsed: 1, paramCode: 'distribution_date',
                paramName: 'distribution_date',
                paramValue: dbData.distribution_date, remark: '配送时间'},
            {isUsed: 1, paramCode: 'auto_receiving_order',
                paramName: 'auto_receiving_order',
                paramValue: dbData.auto_receiving_order, remark: '自动接单'},
        ];

        $api.setMerchantParams({
            merchantParams: params
        })
            .then(res => {
                $modal.success('更新成功');
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
            })
    }
</script>

<style lang="scss">
    .page-setting {

        .setting-line-wrap {
            .el-input {
                width: 150px;
            }

            .item {
                display: flex;
                align-items: center;
                color: #606266;
                font-size: 14px;
                font-weight: 500;

                & + .item {
                    margin-top: 13px;
                }
            }
        }
    }
</style>
