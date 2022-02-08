## 简介

> - 前端项目，Vue框架
> - 集成多个系统例子，功能演示

### 项目框架

-  基于[D2admin](https://github.com/d2-projects/d2-admin)修改

- 注释D2admin源代码的默认demos
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
  



## 系统-工作流

> 后端服务：[yh-activiti](https://github.com/huhuhan/yh-cloud/tree/master/yh-activiti)，测试用户userId固定为88888888

- **正常登录**：用前端mockJS的固定账户，`src/mock/api/sys.login.js`

  ```json
  { "username": "adminDemo", "password": "111111", "userId": "88888888"}
  ```

- api目录：`src/api/yh.act`

- 路由目录：`src/router/modules/yh.act`

- 菜单目录：`src/menu/modules/yh.act`

- 视图目录：`src/views/yh`

  - 流程相关：`activiti`
  - 例子项目：`请假Demo`
  
- 静态目录：`public/act`，（流程设计器）



## 系统-BPM

> 后端服务：agilebpm
> 另个前端：[流程编辑器](https://github.com/huhuhan/bpm-ui)

#### 开发说明

- **真正登录**：首页菜单-点击`初始化BPM`按钮，登录后端服务的账户

- axios请求配置`src/plugin/axios/index.js`补充一种请求响应码

  ```js
  switch (code) {
    case '200':
      return dataAxios
  } 
  ```

- api目录：`src/api/bpm`
- 路由目录：`src/router/modules/bpm`
- 菜单目录：`src/menu/modules/bpm`
- 视图目录：`src/views/bpm`
  - `src/views/bpm/components`：公共组件
    - components/bpm：流程公共组件
    - components/bpm/detail_temp：流程详情页组件模板，复制到相关页面，修改引用配置，根据业务补充修改
    - form/async-page.vue：业务表单引用通用组件
    - form/async-demo.vue：业务表单，实际业务扩展新建目录区分，比如demo目录
  - `src/views/bpm/my`：个人流程
  - `src/views/bpm/all`: 全局流程
- 流程编辑器：`docker/jar`下的压缩包，解压后，修改VUE_APP_BPM_UI_PUBLIC的路径地址即可。（源码[bpm-ui](https://github.com/huhuhan/bpm-ui)）
  
   
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


### 功能介绍

- 操作包括：发起、同意、驳回、催办、人工终止、撤销、转办、指派
- 流程图要求：开始节点、任务节点、结束节点；节点配置表单、候选人员；其他可选

### 流程配置

> 必须熟悉流程相关代码

1. 配置好流程图，假设节点配置的全局【URL表单】是`/demo/demo`

2. 授权给个人（用户、角色）

3. 在个人的流程页面，选择流程发起，打开【详情】窗口页面

3. 【详情】中引入以下代码，即上面的`async-page.vue`组件

   ```javascript
   <!--加载业务表单-->
   <asyncPage v-if="instanceData" :name="instanceData.form.formValue"></asyncPage>
   ```

   其中主要传参包括如下：

   - name：即当前节点的表单，通过接口获取，主要有以下2个接口

     - 实例详情接口：`/bpm/instance/getInstanceData`
     - 任务详情接口：`/bpm/task/getTaskData`

   - bizObj：业务对象

   - flowObj：流程对象

     ```javascript
             //传入异步表单组件的对象，可以构建以下数据，表单中一般需要用到。
             bizObj: {
               id: '', //业务对象主键
               disabled: false, //默认可编辑
             },
             flowObj: {
               from: '任务', //实例、流程
               id: undefined,
               taskId: undefined,
               nodeId: undefined,
               nodeName: undefined,
               definitionId: undefined,
               instanceId: undefined,
               nodes: [],
             },
     ```

4. 通过【详情】页面中的发起（同意、驳回）按钮触发【业务表单】的业务保存接口。（或分两步操作，先点业务保存按钮，再点流程按钮）

   根据需要扩展实现【表单路由】中的前置、后置方法。例如【详情】页的同意按钮触发代码参考如下

   ```javascript
   	taskAgree() {
         	//需要验证的表单，实现前置方法，返回true/false
           let agreeValidate = this.$refs.asyncPage.toAgreeValidate()
           agreeValidate.then(r => {
             if (r) {
               this.dialogTaskAgreeVisible = true
             } else {
               //message提示由前置方法给出，这里仅日志提示
               this.$log.warning("表单已实现前置方法【agreeBeforeValidate】，验证不通过")
             }
           })
         },
   ```

#### 分支流程

> 适用于有分支网关、条件并行网关的流程，流程脚本由后端接口获取

- 添加以上网关后，需要添加【分支流转目标节点条件设置】
- 打开设置后，选择【常用脚本】，其中分类【流程脚本】的【第x相对分支】，再添加一个`return`语句，结果如下
```groovy
  return relativeBranchScript.isFirstBranch(variableScope)
```
> 每个分支条件，添加一个【第x相对分支】脚本，不能重复

- 业务表单组件，参考`src/views/bpm/components/form/demo/fzcs.vue`组件开发即可，关键方法**vsGetRelativeBranchSequence**


#### 驳回流程

- 默认驳回上个节点
- 存在网关分支的流程，流程编辑器中，选择节点，右下角，设置指定驳回节点，驳回到发起网关的前一节点


## Vue 插件示例

### 手写签名

- 文档连接：[signature_pad](https://github.com/szimek/signature_pad)、[vue-signature-pad](https://github.com/neighborhood999/vue-signature-pad/)

- Demo: [Vue Demo](https://codesandbox.io/s/n5qjp3oqv4?file=/src/App.vue)


### 传参加密

- 引入依赖组件

  ```bash
  npm install jsencrypt
  ```

- 前端加密，参考`src/views/system/login/page.vue`

- 后端加密，参考`src/mock/api/sys.login.js`
