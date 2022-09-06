<template>
    <div class="page page-goods-add" v-loading="loading">
        <el-form :model="data.form"
                 :rules="data.rules"
                 class="page-form"
                 ref="formRef"
                 :inline="true"
                 :disabled="isInfo"
                 label-width="120px">
            <div class="title">基本信息</div>
            <el-form-item label="商品名称:" prop="goodsName">
                <el-input v-model="data.form.goodsName" placeholder="请输入商品名称"/>
            </el-form-item>
            <el-form-item label="商品类型:" prop="goodsType">
                <el-select v-model="data.form.goodsType" placeholder="请选择商品类型">
                    <el-option label="商品" :value="0"/>
                    <el-option label="服务" :value="1"/>
                </el-select>
            </el-form-item>
            <el-form-item label="商品分类:" prop="categoryId">
                <GoodsCategorySelect width="130px" :showAll="false" v-model="data.form.categoryId" placeholder="商品分类" />
            </el-form-item>
            <el-form-item label="商品品牌:" prop="brandId">
                <GoodsBrandSelect ref="brandSelectRef"
                                  :par="{status: 1}"
                                  class="hasbtn" :showAll="false" v-model="data.form.brandId"/>
                &nbsp;&nbsp;
                <el-button type="primary" @click="showBrandDialog = true">新增</el-button>
            </el-form-item>
            <el-form-item label="商品分组:" prop="groupIds">
                <GoodsGroupSelect ref="groupSelectRef"
                                  class="hasbtn"
                                  :par="{status: 1}"
                                  :multiple="true"
                                  :showAll="false"
                                  v-model="data.form.groupIds" />
                &nbsp;&nbsp;
                <el-button type="primary" @click="showGroupDialog = true">新增</el-button>
            </el-form-item>
            <el-form-item label="商品型号:" prop="goodsModel">
                <el-input v-model="data.form.goodsModel"
                          placeholder="请输入商品型号"/>
            </el-form-item>
            <el-form-item label="商品图片:" class="block" style="width: 90%;" prop="files">
                <FileSelect v-model:fileList="data.form.files"
                            :limit="6"
                            :disabled="isInfo"
                            @delete="deleteGoodsImgFun"
                            tip="建议尺寸：640X640 像素， 最多上传6张"
                            :isPic="true"/>
            </el-form-item>
            <div class="title">
                <span>价格及库存设置</span>
                <el-checkbox v-if="!isEdit" v-model="enableMultiple">开启多规格设置</el-checkbox>
            </div>
            <template v-if="enableMultiple">
                <!--多规格-->
                <el-form-item label="规格组合设置:" class="block">
                    <!--v-if="!isEdit"-->
                    <el-button  type="primary" @click="editSpecs()">新建规格</el-button>
                </el-form-item>

                <div class="multiple-specs-wrap" style="margin-left: 120px;">
                    <div class="none" v-if="data.form.specs.length <= 0">请添加规格项目 ~</div>
                    <div class="specs-item"
                         v-for="(item, i) in data.form.specs"
                         :key="i + ''">
                        <el-button type="text" class="delete-specs-item"
                                   :icon="Delete"
                                   @click="data.form.specs.splice(i, 1)"
                                   circle/>
                        <el-form-item label="规格名:" class="block">
                            <el-select v-loading="loadingSpecs"
                                       v-model="item.specs"
                                       @change="item.select = item.specs ? item.specs.values : []"
                                       value-key="specicationId"
                                       placeholder="请选择规格名称"
                                       filterable>
                                <el-option v-for="s in data.allSpecsList"
                                           :key="s.specicationId"
                                           :label="s.specicationName"
                                           :value="s"/>
                            </el-select>
                        </el-form-item>

                        <el-form-item v-if="item.specs" label="规格值:" class="block">
                            <el-checkbox-group v-model="item.select" >
                                <el-checkbox-button v-for="(v, i) in item.specs.values"
                                                    :key="v.specicationValueId"
                                                    :label="v">
                                    {{ v.specicationValueName }}
                                </el-checkbox-button>
                            </el-checkbox-group>
                            <!--<el-button v-for="(v, i) in item.specs.values"
                                       :key="v.specicationValueId"
                            >{{v.specicationValueName}}</el-button>
-->
                            <el-button type="warning"
                                       @click="editSpecs(item.specs)"
                                       class="ml10"
                            >新增规格值</el-button>
                        </el-form-item>

                    </div>
                    <div class="p10 specs-item" >
                        <el-button type="warning" @click="addSpecs">添加规格项目</el-button>
                    </div>
                    <div class="multiple-price-wrap">

                        <el-form-item label="规格商品组合:" class="block">
                            <span class="mr10">批量设置</span>
                            <el-button @click="showBatchSetFun('批量设置售价', 'salePrice')" type="text">售价</el-button>
                            <el-button @click="showBatchSetFun('批量设置会员价', 'memberPrice')" type="text">会员价</el-button>
                            <el-button @click="showBatchSetFun('批量设置成本价', 'costPrice')" type="text">成本价</el-button>
                            <el-button @click="showBatchSetFun('批量设置库存', 'stockNumber')" type="text">库存</el-button>
                        </el-form-item>

                        <el-form-item  label="" class="block" prop="specs">
                            <div class="table-wrap">
                                <table class="table">
                                    <tr>
                                        <th style="width: 300px;">规格</th>
                                        <th>商品售价</th>
                                        <th>plus会员价</th>
                                        <th>成本价</th>
                                        <th>库存值</th>
                                        <th style="width: 80px;">是否销售</th>
                                    </tr>
                                    <tr v-if="specsExpand.length <= 0">
                                        <td colspan="6">
                                            <div class="none">请添加规格项目 ~</div>
                                        </td>
                                    </tr>
                                    <tbody>
                                    <tr v-for="(item, i) in specsExpand"
                                        :key="i + ''">
                                        <td>{{item.skus.map(_ => _.specicationValueName).join(' - ')}}</td>
                                        <td><input
                                                :disabled="isInfo" type="number" v-model="item.salePrice"/></td>
                                        <td><input
                                                :disabled="isInfo" type="number" v-model="item.memberPrice"/></td>
                                        <td><input
                                                :disabled="isInfo" type="number" v-model="item.costPrice"/></td>
                                        <td><input
                                                :disabled="isInfo" type="number" v-model="item.stockNumber"/></td>
                                        <td>
                                            <el-checkbox v-model="item.show"></el-checkbox>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </el-form-item>

                    </div>
                </div>


            </template>
            <template v-else>

                <el-form-item label="商品售价:" prop="salePrice">
                    <el-input v-model="data.form.salePrice"
                              placeholder="请输入商品售价">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="plus会员价:" prop="memberPrice">
                    <el-input v-model="data.form.memberPrice"
                              placeholder="请输入plus会员价">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价:" prop="costPrice">
                    <el-input v-model="data.form.costPrice"
                              placeholder="请输入成本价">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存数量:" prop="stockNumber">
                    <el-input v-model="data.form.stockNumber"
                              type="number"
                              placeholder="请输入库存数量">
                        <template #append>个</template>
                    </el-input>
                </el-form-item>
            </template>
            <div class="title">商品详情</div>
            <el-form-item label="网店促销语:" class="block" prop="goodsPromotion">
                <el-input v-model="data.form.goodsPromotion"
                          placeholder="广告语一般显示在标题后面，合理的广告语有利于吸引顾客注意，促进购买"/>
            </el-form-item>

            <el-form-item label="商品详情:" class="block" prop="goodsDetails">
                <editor
                        :disabled="isInfo" v-model="data.form.goodsDetails" maxLength="65535"/>
            </el-form-item>

        </el-form>
        <div class="form-btn-wrap" v-if="!isInfo">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
        <div class="form-btn-wrap" v-else>
            <el-button @click="router.back()">返回</el-button>
        </div>


        <el-dialog v-model="showBatchSet" :title="batchSetTitle" width="500px">
            <div class="p10">
                <el-row :gutter="20">
                    <el-col :span="4"
                            style="display: flex; align-items: center; text-align: right;">{{(batchSetTitle || '').replace('批量设置', '')}}:
                    </el-col>
                    <el-col :span="16">
                        <el-input type="number" v-model="batchSetVal" placeholder="请输入"/>
                    </el-col>
                </el-row>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="confirmBatchSetFun">确 定</el-button>
                    <el-button @click="showBatchSet = false">取 消</el-button>
                </div>
            </template>
        </el-dialog>
        <BrandEditDialog :visible.sync="showBrandDialog"
                         :obj="null"
                         @update="brandSelectRef.loadData()"/>
        <GroupEditDialog :visible.sync="showGroupDialog"
                         :obj="null"
                         @update="groupSelectRef.loadData()"/>
        <SpecsEditDialog :visible.sync="showSpecsDialog"
                         :obj="data.specsEditObj"
                         @update="loadSpecsList()"/>
    </div>
</template>

<script setup name="goods-add">
    import {getRule, descartes} from "@/utils/utils";

    import GoodsGroupSelect from '@/components/GoodsGroupSelect';
    import GoodsCategorySelect from '@/components/GoodsCategorySelect';
    import GoodsBrandSelect from '@/components/GoodsBrandSelect';

    import GroupEditDialog from './components/GroupEditDialog';
    import BrandEditDialog from './components/BrandEditDialog';
    import SpecsEditDialog from './components/SpecsEditDialog';


    import {
        $api,
        $modal,
        $notify,
        $store,
        $router,
        getImgUrl,
        downloadXhr,
        getEnumArr,
    } from '@/autoImportUtils/index.js';

    const $route = $router.app.$route;


    const enableMultiple = ref(true);
    const isEdit = route.query.type === 'edit';
    const isInfo = route.query.type === 'info';

    const data = reactive({
        form: {
            goodsBaseId: '',
            goodsName: '',
            goodsType: '',
            categoryId: '',
            brandId: '',
            groupIds: null,
            goodsModel: '',
            hasSpecs: '',//是否有多规格1 是 0 否
            salePrice: '',
            memberPrice: '',
            costPrice: '',
            stockNumber: '',
            goodsDetails: '',
            goodsPromotion: '',
            specs: [],
            files: [],
        },
        rules: {
            goodsName: getRule('请输入商品名称'),
            goodsType: getRule('请选择商品类型'),
            categoryId: getRule('请选择商品分类'),
            brandId: getRule('请选择商品品牌'),
            groupIds: getRule('请选择商品分组'),
            goodsModel: getRule('请选择商品型号'),
            salePrice: getRule('请输入商品售价'),
            memberPrice: getRule('请输入plus会员价'),
            costPrice: getRule('请输入成本价'),
            stockNumber: getRule('请输入库存数量'),
            goodsPromotion: getRule('请输入网店促销语'),
            goodsDetails: getRule('请输入商品详情'),
            files: getRule('请至少选择一张商品图片'),
            specs: getRule((rule, val, cb) => {

                if(enableMultiple.value) {
                    for(let i = 0; i < specsExpand.value.length; i++) {
                        let item = specsExpand.value[i];

                        if(item.salePrice === '') {
                            cb('必须填写售价');
                            return;
                        }
                        if(item.stockNumber === '') {
                            cb('必须填写库存');
                            return;
                        }
                    }
                }
                cb();
            })
        },
        allSpecsList: [],
        specsEditObj: null,
        specsExpandEditCache: {},
        deleteGoodsImg: [],
    });

    const formRef = ref(null);
    const brandSelectRef = ref(null);
    const groupSelectRef = ref(null);

    const loadingSpecs = ref(false);
    const loading = ref(false);

    const showBrandDialog = ref(false);
    const showGroupDialog = ref(false);
    const showSpecsDialog = ref(false);

    const specsExpand = ref([]);
    const showBatchSet = ref(false);
    const batchSetTitle = ref('');
    const batchSetVal = ref(0);
    const batchSetKey = ref('');

    watch(
        () => data.form.specs,
        (n, o) => {
            makeSpecsExpandData();
        },
        {deep: true}
    );

    function editSpecs(obj) {
        data.specsEditObj = obj;
        showSpecsDialog.value = true;
    }

    function loadSpecsList() {
        loadingSpecs.value = true;
        if(isEdit) {
            loading.value = true;
        }
        $api.getSpecsList({status: 1})
            .then(res => {
                data.allSpecsList = res.rows.map(_ => {
                    _.valsCount = _.values.length;
                    _.values = _.values.map(v => {
                        v.iorder = v.specicationValueOrder;
                        return v;
                    })
                    return _;
                });
                loadingSpecs.value = false;

                (isEdit || isInfo) && loadInfoData();
            })
            .catch(e => {
                console.error(e);
                loadingSpecs.value = false;
            })
    }

    loadSpecsList();

    function makeSpecsExpandData() {

        let tmp = data.form.specs.map(_ => {
            return toRaw(_.select || []);
        })

        tmp = toRaw(tmp.filter(_ => _.length > 0));
        console.log('specs arr:', tmp);

        //生成组合
        let newArr = descartes(tmp);
        newArr = newArr.map(item => {
            let tmp = item;
            tmp.sort((a, b) => {
                return a.specicationValueId - b.specicationValueId;
            })
            console.log('tmp', toRaw(tmp));
            //let cache = tmp

            let cacheKey = tmp.map(_ => _.specicationValueId).join(',');
            let cacheObj = data.specsExpandEditCache[cacheKey];
            //debugger
            return {
                skus: tmp,
                salePrice: cacheObj ? cacheObj.salePrice : 0,
                memberPrice: cacheObj ? cacheObj.memberPrice : 0,
                costPrice: cacheObj ? cacheObj.costPrice : 0,
                stockNumber: cacheObj ? cacheObj.stockNumber : 0,
                show: true/*cacheObj ? cacheObj.status === 1 : false*/,
            }
        })
        console.log('descartes specs arr:', newArr);
        specsExpand.value = newArr;
    }

    function addSpecs() {
        data.form.specs.push({
            specs: null,
            select: [],
        })
    }

    function showBatchSetFun(name, key) {
        batchSetVal.value = null;
        batchSetTitle.value = name;
        batchSetKey.value = key;
        showBatchSet.value = true;
    }

    function confirmBatchSetFun() {
        if(batchSetVal.value === null || batchSetVal.value === '') {
            $modal.warning('值不能为空');
            return;
        }
        specsExpand.value.forEach(item => {
            item[batchSetKey.value] = batchSetVal.value;
        })
        showBatchSet.value = false;
    }


    function cancel() {
        $modal.confirm('确定要取消吗?').then(_ => {
            router.back();
        })
    }

    function deleteGoodsImgFun(file) {
        if(file.id) {
            data.deleteGoodsImg.push(file);
        }
    }

    function save() {
        formRef.value.validate(async v => {
            if(v) {

                try {
                    if(enableMultiple.value) {
                        let has = false;

                        specsExpand.value.forEach((specs, i) => {
                            if(Number((specs.salePrice)) <= 0 || Number(specs.stockNumber) <= 0) {
                                has = true;
                            }
                        });
                        has && await $modal.confirm('当前有存在库存或售价为 0 的规格, 确认保存吗?');
                    }
                    loading.value = true;
                    let formData = makeFormdata([
                        'goodsBaseId',
                        //'categoryId'
                    ]);
                    if(isEdit) {
                        formData.append('goodsBaseId', route.query.id);
                        await editGoods(formData);
                    } else {
                        //
                        await addGoods(formData);
                    }
                    $modal.success('操作成功');
                    loading.value = false;
                    router.back();
                } catch(e) {
                    console.error(e);
                    loading.value = false;
                }
            } else {
                $modal.warning('请检查必填项!');
            }
        })
    }


    function makeFormdata(ex) {
        ex = ex || [];
        console.log('save:', toRaw(data.form));


        let formData = new FormData();
        Object.keys(data.form).forEach(k => {
            if(ex.indexOf(k) != -1) {
                return;
            }
            switch(k) {
                case 'categoryId':
                    formData.append('categoryId', data.form.categoryId.productCategoryId)
                    break;
                case 'hasSpecs':
                    formData.append('hasSpecs', enableMultiple.value ? 1 : 0);
                    break;
                case 'files':
                    if(isEdit) {
                        //编辑时要单独增加新增删除字段
                        data.form[k].forEach(f => {
                            if(f.isNew) {
                                formData.append('addFiles', f.file, f.file.name);
                            }
                        });

                        /*data.deleteGoodsImg.forEach(f => {
                            formData.append('deleteFileIds', f.fileId);
                        });*/
                        let ids = data.deleteGoodsImg.map(f => f.id);
                        formData.append('deleteFileIds', ids.join(','))

                    } else {
                        data.form[k].forEach(f => {
                            formData.append(k, f.file, f.file.name);
                        })
                    }
                    break;
                case 'specs':
                    if(!enableMultiple.value) {
                        break;
                    }
                    data.form[k].forEach((item, i) => {
                        if(!item.specs) {
                            return;
                        }
                        if(isEdit && item.specs.specsId) {
                            //编辑时增加id
                            formData.append(`goodsSpecs[${i}].specsId`, item.specs.specsId);
                        }
                        formData.append(`goodsSpecs[${i}].iorder`, i);
                        formData.append(`goodsSpecs[${i}].mainSpecsId`, item.specs.specicationId);
                        formData.append(`goodsSpecs[${i}].specsValue`, item.select.map(_ => _.specicationValueId).join(','));
                    })

                    specsExpand.value.forEach((specs, i) => {
                        formData.append(`goodsSku[${i}].iorder`, i);
                        formData.append(`goodsSku[${i}].salePrice`, (specs.salePrice));
                        formData.append(`goodsSku[${i}].memberPrice`, (specs.memberPrice));
                        formData.append(`goodsSku[${i}].costPrice`, (specs.costPrice));
                        formData.append(`goodsSku[${i}].stockNumber`, (specs.stockNumber));

                        if(isEdit && specs.goodsSkuId) {
                            formData.append(`goodsSku[${i}].goodsSkuId`, (specs.goodsSkuId));
                        }

                        formData.append(`goodsSku[${i}].status`, specs.show ? 1 : 0);
                        let skus = specs.skus;
                        formData.append(`goodsSku[${i}].specsValue`, skus.map(_ => (_).specicationValueId).join(','));
                        formData.append(`goodsSku[${i}].specsValueName`, skus.map(_ => (_).specicationValueName).join(','));
                    });
                    break;
                case 'salePrice':
                case 'memberPrice':
                case 'costPrice':
                case 'stockNumber':
                    //多规格时不传这四个字段
                    if(!enableMultiple.value) {
                        formData.append(k, data.form[k]);
                    }
                    break;
                default:
                    formData.append(k, data.form[k]);
                    break;
            }
        })
        return formData;
    }

    function loadInfoData() {
        $api.getGoodsInfo(route.query.id)
            .then(res => {

                let obj = res.data || {};
                //返回数据有可能为0
                obj.brandId = obj.brandId === 0 ? null : obj.brandId;

                Object.keys(data.form).forEach(k => {
                    if(obj.hasOwnProperty(k)) {
                        data.form[k] = obj[k];
                    }
                });
                data.form.categoryId = obj.productCategory;
                data.form.files = (obj.goodsFiles || []).map(_ => {
                    return {
                        url: getImgUrl('goods', _.fileId),
                        id: _.fileId,
                        name: _.fileName,
                    }
                });
                data.form.specs = (obj.goodsSpecses || []).map(_ => {

                    let ids = _.specsValue.split(',');
                    let spObj = data.allSpecsList.find(s => s.specicationId === _.mainSpecsId)
                    let select = [];
                    if(spObj) {
                        select = spObj.values.filter(v => ids.indexOf(v.specicationValueId + '') != -1);
                    } else {
                        console.error('未找到规格', _, toRaw(data.allSpecsList));
                    }
                    return {
                        select: select,
                        specs: spObj,
                    }
                });
                (obj.goodsSkus || []).forEach(skuVal => {
                    data.specsExpandEditCache[skuVal.specsValue] = skuVal;
                });

                console.log(
                    'edit:',
                    toRaw(data.form),
                    obj,
                    toRaw(data.specsExpandEditCache)
                );
                enableMultiple.value = res.data.hasSpecs === 1;
                loading.value = false;
            })
            .catch(e => {
                //proxy.$modal.warning('网络错误~');
                console.error(e);
                loading.value = false;
            })
    }

</script>

<style lang="scss">
    @import '@/assets/css/mixin.scss';

    .page-goods-add {
        $border-color: #ccc;

        .multiple-specs-wrap {
            border: 1px solid $border-color;
            border-radius: 4px;
            padding-top: 10px;
            max-width: 1000px;

            .specs-item {
                position: relative;
                padding-top: 13px;
                border-bottom: 1px solid $border-color;

                .delete-specs-item {
                    position: absolute;
                    top: 4px;
                    right: 10px;
                    border: 1px solid $border-color;
                    padding: 7px;
                    height: 25px;
                    width: 25px;
                    z-index: 3;

                    &:hover {
                        background-color: #f56c6c;
                        border-color: #f56c6c;
                        color: #fff;
                    }
                }

            }

            .multiple-price-wrap {
                padding-bottom: 10px;

                .table-wrap {
                    flex-grow: 1;

                    @include table(#f2f2f2);
                    th {
                        font-weight: 500;
                    }
                    td {
                        padding: 0 10px !important;
                        text-align: center;
                    }

                    input {
                        width: 100%;
                        display: inline-block;
                        border: 0;
                        text-align: center;
                        background-color: transparent;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }

            .block.is-error {

                @include table(#f56c6c);
            }
        }
    }
</style>
