<template>
  <div class="tree-wrapper">
    <el-input v-model="queryKey" class="searchInput" placeholder="关键字" clearable>
      <i class="el-icon-search el-input__icon" slot="prefix" style="cursor: pointer;" @click="handleSearch"></i>
    </el-input>
    <el-tree v-loading="loading" lazy :data="treeData" style="overflow-y:auto;flex:1" :props="treeProps"
             :load="handleLazyLoadNode" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
  import {GetRegionTree, GetRegionData} from "@/api/bpm/org.region"

  export default {
    props: {
      onlyRoot: {type: Boolean, default: true}
    },
    data() {
      return {
        treeProps: {
          label: "adName",
          isLeaf: "isLeaf",
          children: "children"
        },
        treeData: [],
        queryKey: undefined,
        loading: false,
      }
    },
    mounted() {
      this.initRegionData()
    },
    methods: {
      initRegionData() {
        this.loading = true
        GetRegionTree({onlyRoot: this.onlyRoot}).then(res => {
          this.treeData = res.data
          this.$emit('treeDataInit', this.treeData)
        }).finally(() => {
          this.loading = false
        })
      },
      async toGetNodeData(parentId) {
        let children = await GetRegionTree({id: parentId})
        let childrenData = children.data[0].children
        this.checkNodeLeaf(childrenData)
        return childrenData
      },
      checkNodeLeaf(data) {
        data.forEach(e => {
          if (e.children.length === 0) {
            e.isLeaf = true
          }
        })
      },
      handleLazyLoadNode(node, resolve) {
        if (node.level === 0) {
          resolve(node.data)
        } else if (node.data.children && node.data.children.length > 0) {
          this.checkNodeLeaf(node.data.children)
          resolve(node.data.children)
        } else {
          this.toGetNodeData(node.data.id).then(childrenData => {
            resolve(childrenData)
          })
        }
      },
      handleNodeClick(data, node) {
        let nodeData = {...data}
        if (node.level === 1) {
          // handleLazyLoadNode也是异步方法，因为懒加载数据，一级的子集数据还没有，所以再请求次
          this.toGetNodeData(data.id).then(childrenData => {
            nodeData.children = childrenData
            this.$emit("treeNodeClick", nodeData)
          })
        } else {
          this.$emit("treeNodeClick", nodeData)
        }
      },
      handleSearch() {
        if (this.queryKey) {
          GetRegionData({fwCode: '', keyWord: this.queryKey}).then(res => {
            this.treeData = res.data
            this.$emit('treeDataInit', this.treeData)
          })
        } else {
          this.initRegionData()
        }
      },
      refresh(){
        this.initRegionData()
      }
    }
  }

</script>

<style scoped>
  .tree-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .searchInput {
    padding: 5px;
    box-sizing: border-box;
  }

</style>
