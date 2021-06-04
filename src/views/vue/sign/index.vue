<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-2">
          <vue-signature-pad
                  id="signature"
                  width="500px"
                  height="300px"
                  ref="signaturePad"
                  :options="options"></vue-signature-pad>
        </div>
      </div>
      <div class="row">
        <div class="col-3 mt-2">
          <button class="btn btn-outline-secondary" @click="undo">撤销</button>
        </div>
        <div class="col-3 mt-2">
          <button class="btn btn-outline-primary" @click="save">保存</button>
        </div>
        <div class="col-3 mt-2">
          <button class="btn btn-outline-primary" @click="clear">清除</button>
        </div>
        <div class="col-3 mt-2">
          <label>
            <input type="color" v-model="penColor" @change="change">
          </label>
        </div>

        <div class="col-3 mt-2">
          <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="Base64"
                  v-model="imageBase">
          </el-input>
          <el-image
                  style="width: 100px; height: 100px"
                  :src="imageBase"
                  :fit="fit"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "App",
    data: () => ({
      options: {
        penColor: "#000000"
      },
      penColor: "#000000",
      imageBase: undefined
    }),
    methods: {
      undo() {
        this.$refs.signaturePad.undoSignature()
      },
      save() {
        const {isEmpty, data} = this.$refs.signaturePad.saveSignature()

        console.log(this.options.penColor)
        console.log(isEmpty)
        console.log(data)
        this.imageBase = data
      },
      change() {
        this.options = {
          penColor: this.penColor
        }
      },
      clear() {
        this.$refs.signaturePad.clearSignature()
      },
      // base64字符串转换为二进制流
    /*base64toFile (dataUrl, filename = "file") {
        return new Promise((resolve, reject) => {
          let arr = dataUrl.split(",");
          let mime = arr[0].match(/:(.*?);/)[1];
          let suffix = mime.split("/")[1];
          let str64 = atob(arr[1]);
          let n = str64.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = str64.charCodeAt(n);
          }
          let file = new File([u8arr], `${filename}.${suffix}`, {
            type: mime
          });
          resolve(file)
        })
      },*/
    }
  }
</script>

<style>
  #signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
</style>
