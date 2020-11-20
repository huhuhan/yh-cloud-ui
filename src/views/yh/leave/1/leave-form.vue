<template>
    <!-- 请假 弹框 -->
    <el-dialog title="请假申请"
               :visible.sync="visible"
               :before-close="close"
               width="600px">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">

            <el-form-item label="开始时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.beginTime"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="请假理由">
                <el-input type="textarea" v-model="form.reason"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toCreate('form')" icon="el-icon-check">申 请</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { addLeave} from '@/api/yh.act/leave'

  export default {
    name: 'leave-form',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: {
          beginTime: undefined,
          endTime: undefined,
          reason: undefined,
        },
        rules: {},
      }
    },
    methods: {
      refreshTable () {
        this.$emit('refresh')
      },
      close () {
        // el-dialog的关闭前调用，参考https://www.cnblogs.com/yeqrblog/p/9141701.html
        //直接调用更改.sync
        this.$emit('update:visible', false)
      },
      toCreate (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addLeave(this.form).then(res => {
              console.log(res)
            }).catch(err => console.log(err)).finally(() => {
              this.close()
              this.refreshTable()
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
