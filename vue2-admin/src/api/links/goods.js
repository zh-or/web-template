export default {
    queryGoods: 'get|/merchant/goods-base/list',
    getGoodsInfo: 'get|/merchant/goods-base/{id}',
    addGoods: 'post|/merchant/goods-base',
    editGoods: 'put|/merchant/goods-base',
    setGoodsStatus: 'put|/merchant/goods-base/status',
    //共两级, 查询第一级 businessCategoryId 固定为12
    // 查询第二级时传 parentId
    getGoodsCategory: 'get|/buss/product-category/list',
}
