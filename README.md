# 前端项目
对应后端项目[yh-cloud](https://github.com/huhuhan/yh-cloud)

### 项目基于 D2Admin 开发  
<a href="https://github.com/d2-projects/d2-admin" target="_blank"><img src="https://raw.githubusercontent.com/FairyEver/d2-admin/master/doc/image/d2-admin@2x.png" width="200"></a>

### 注释d2admin项目demos
> 注释都以段落方式为主 /* */
- 路由：src/router/routes.js
- 菜单：src/menu/index.js

- 插件组件：src/main.js


### BPM
bpm流程模块
- Api目录`src/api/bpm`
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
    - form/async-demo.vue：业务表单demo，实际业务扩展新建目录区分
  - `src/views/bpm/my`：个人流程
