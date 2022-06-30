# 可显示大数据的表格组件

### table
  * 属性
    1. border 边框
    2. props 列显示, 排序配置
    3. finalData table最终过滤显示数据, 需增加.sync实时回传
    4. data table显示的数据
    5. stripe 斑马条纹
    6. highlightCurrentRow 是否能选择行
    7. current 当前选中行, 支持.sync回传
    8. emptyText 数据为空时显示的文字
  * 方法
    1. getColumns() 返回所有列```{label, prop}```


### column
  * 属性
    1. label 列标题
    2. prop 列显示的字段, 支持多级 ```info.name```
    3. width 列宽度
    4. sort 当前列支持排序
    5. filter 当前列支持筛选
    7. fixedLeft 当前列固定到左边
    8. fixedRight 当前列固定到右边
  * slot
    1. ```title``` 列标题显示的内容
    2. ```default``` 列内容显示的内容, 如需要获取当前显示的行的```data```需要使用 ```v-slot="scope"```
    ```
    <div v-slot="scope">{{scope.row.filedName}}</div>
    ```
