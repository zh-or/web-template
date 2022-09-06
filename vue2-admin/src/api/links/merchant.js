/*
*
*
export function setBrandStatus(id, status) {
    return request({
        url: '/merchant/goods-brand/status',
        method: 'put',
        data: {
            "brandId": id,
            "status": status
        }
    })
}



export function setUnitStatus(id, status) {
    return request({
        url: '/merchant/goods-unit/status',
        method: 'put',
        data: {
            "unitId": id,
            "status": status
        }
    })
}
export function setGroupStatus(id, status) {
    return request({
        url: '/merchant/goods-group/status',
        method: 'put',
        data: {
            "groupId": id,
            "status": status
        }
    })
}


export function setSpecsStatus(id, status) {
    return request({
        url: '/merchant/goods-specication/status',
        method: 'put',
        data: {
            "specicationId": id,
            "status": status
        }
    })
}
* */


export default {
    setMerchantInfo: 'put|/buss/merchant-info/base',
    getMerchantInfo: 'get|/buss/merchant-info/base',
    setMerchantParams: 'put|/buss/merchant-params',
    getMerchantParams: 'get|/buss/merchant-params',
    getBrandList: 'get|/merchant/goods-brand/list',
    setBrandStatus: 'put|/merchant/goods-brand/status',
    addBrand: 'post|/merchant/goods-brand',
    editBrand: 'put|/merchant/goods-brand',
    getUnitList: 'get|/merchant/goods-unit/list',
    addUnit: 'post|/merchant/goods-unit',
    editUnit: 'put|/merchant/goods-unit',
    setUnitStatus: 'put|/merchant/goods-unit/status',
    addGoodsToGroup: 'post|/merchant/goods-group/goods',
    getGoodsListByGroup: 'get|/merchant/goods-group/goods/list',
    getGroupList: 'get|/merchant/goods-group/list',
    addGroup: 'post|/merchant/goods-group',
    editGroup: 'put|/merchant/goods-group',
    setGroupStatus: 'put|/merchant/goods-group/status',
    getSpecsList: 'get|/merchant/goods-specication/list',
    addSpecs: 'post|/merchant/goods-specication',
    editSpecs: 'put|/merchant/goods-specication',
    setSpecsStatus: 'put|/merchant/goods-specication/status',
    getTradeList: 'get|/buss/sys-trade/list',

}


