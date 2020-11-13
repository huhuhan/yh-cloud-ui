## 简介

- 前端项目，Vue框架

- 使用总结，例子演示

- 对应后端项目[yh-cloud](https://github.com/huhuhan/yh-cloud)

  

### 项目框架

-  基于D2admin修改

  <a href="https://github.com/d2-projects/d2-admin" target="_blank"><img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/doc/image/d2-admin@2x.png" width="200"></a>

- 注释D2admin默认demos
  -  路由：src/router/routes.js
  - 菜单：src/menu/index.js
  - 插件组件：src/main.js

> 注释都以段落方式为主 /* */



### 代理转发

- 配置文件`vue.config.js`已经封装过，参考JSON文件`proxy-gateway.json`



### 菜单|路由

- 菜单参考写法：`src/menu/modules/bpm/my-flow.js`
- 路由参考写法：`src/router/modules/bpm/my-flow.js`




### 通用组件
`src/components`目录
- `src/components/my-async-page`：异步引入页面组件
- `src/components/my-empty-router`：空页面，路由过渡使用
- `src/components/my-table-page`：通用表格列表页面
- `src/components/my-element`：通用element封装组件
  - dialog-upload：上传弹窗组件
  



## 系统模块

### BPM系统

#### 开发说明

- api目录：`src/api/bpm`

- axios请求配置`src/plugin/axios/index.js`补充一种请求响应码

  ```js
  switch (code) {
    case '200':
      return dataAxios
  } 
  ```

- 菜单文件`src/menu/modules/bpm/index.js`，在`src/menu/index.js`中引入

- 路由文件`src/router/modules/bpm/index.js`，在`src/router/routes.js`中引入，`rootRoute`参数对应组件`src/views`目录下一级目录名

- 组件模块`src/views/bpm`，整个组件模块目录放在views下
  - `src/views/bpm/components`：公共组件
    - components/bpm：流程公共组件
    - components/bpm/detail_temp：流程详情页组件模板，复制到相关页面，修改引用配置，根据业务补充修改
    - form/async-page.vue：业务表单引用通用组件
    - form/async-demo.vue：业务表单，实际业务扩展新建目录区分，比如demo目录
  - `src/views/bpm/my`：个人流程
  - `src/views/bpm/all`: 全局流程




#### 查询条件
- 分页：使用`offset、limit`参数分页，默认不传不分页
- 排序：使用`sort、order`参数排序，默认不排序
- 过滤：使用`参数`+`$`+`类型`+`过滤条件`格式拼接过滤参数，eg：`name_^VEQ`
    - 分割符：`^`或`$`
    - 类型包含：字符串`V`、数字`N`、时间`D`
    - 过滤条件常用：等于`EQ`、小于`LT`、大于`GT`、小于等于`LE`、大于等于`GE`、相似`LI`、左相似`LFK`
>- 详情参考后端项目：ControllerTools类的getQueryFilter方法
>- 过滤条件枚举QueryOP，前端参考接口：/sys/tools/getResultEnum?path=com.dstz.base.api.query.QueryOP
>- 状态类型，参考`src/api/bpm/constant.js`
