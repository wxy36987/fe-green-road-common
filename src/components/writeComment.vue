<template>
  <div>
    <div class="write-comments" v-show="isWriteShow" id="modalId">
      <div class="bg" @click="ClosePost()"></div>
      <div id="write">
        <div class="text-icon">
          <p>发帖子</p>
          <van-icon name="arrow-down" @click="ClosePost()" />
        </div>
        <van-cell-group>
          <van-field
            v-model="message"
            type="textarea"
            placeholder="我来发表评论"
            ref="myInput"
            id="myInput"
            maxlength="500"
            @input="MyInput"
            @focus="InputFocus"
            show-word-limit
          />
        </van-cell-group>
        <div class="icon-img" v-if="gallerys.length !== 0">
          <div class="pic-box">
            <van-swipe :loop="false" :width="54" :show-indicators="false">
              <van-swipe-item v-for="(item, index) in gallerys" :key="index">
                <van-image
                  :src="item"
                  width="50px"
                  height="50px"
                  fit="cover"
                  @click="BigPicture(index)"
                ></van-image>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
        <div class="btn">
          <div class="img-expression">
            <van-uploader
              :after-read="afterRead"
              :disabled="picDisabled"
              v-if="isPhone && isUploadIconShow"
              multiple
              :max-count="6"
            >
              <van-image
                :src="picIcon"
                class="icon-image"
                width="20px"
                height="20px"
              ></van-image>
            </van-uploader>
            <van-image
              :src="picIcon"
              class="icon-image"
              width="20px"
              height="20px"
              @click="ImagesUp()"
              v-if="!isPhone && isUploadIconShow"
            ></van-image>
            <van-image
              v-if="isEcpressionIconShow"
              :src="ecpressionIcon"
              width="20px"
              height="20px"
              @click="faceContent"
            ></van-image>
          </div>
          <div>
            <div class="hui_btn">
              <van-button color="#F1F1F1" v-if="publishShow">发表</van-button>
            </div>
            <van-button
              color="#188357"
              v-if="!publishShow"
              @click="Fb()"
              :disabled="disabledFbBtn"
              >发表</van-button
            >
          </div>
        </div>
        <!-- 表情区域 -->
        <div class="browBox" v-if="faceShow">
          <ul>
            <li
              v-for="(item, index) in faceList"
              :key="index"
              @click="getBrow(index)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <!-- 上传图片加载 -->
      <div class="jiazai" v-if="LoadShow">
        <div class="">
          <van-loading type="spinner" />
          <p>正在加载图片...</p>
        </div>
      </div>
      <!-- 发布评论图片放大删除 -->
      <div class="big-picture" v-if="bigShow">
        <div class="carousel">
          <div class="back">
            <van-icon name="arrow-left" @click="bigShow = false"></van-icon>
            <p>{{ numIndex + 1 }}/{{ gallerys.length }}</p>
            <span></span>
          </div>
          <div class="swiper">
            <van-swipe
              :loop="false"
              :show-indicators="false"
              :initial-swipe="numIndex"
              @change="Slide"
            >
              <van-swipe-item
                v-for="(item, index) in gallerys"
                :key="index"
                @click="bigShow = false"
              >
                <div class="images-box">
                  <van-image :src="item" width="100%"></van-image>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="delete-box" @click="Delete(numIndex)">
            <div>
              <van-image :src="delIocn" width="18px" height="18px"></van-image>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const appData = require("@/assets/emojis.json");
export default {
  name: "van-del-dialog",
  props: {
    isWriteShow: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    publishShow: {
      type: Boolean,
      default: true,
    },
    isEcpressionIconShow: {
      type: Boolean,
      default: false,
    },
    isUploadIconShow: {
      type: Boolean,
      default: true,
    },
    propF: {},
  },
  data() {
    return {
      // 表情
      ecpressionIcon: require("../assets/iconImage/ic_em@2x.png"),
      faceShow: false,
      faceList: [],
      // 图片上传
      picIcon: require("../assets/iconImage/ic_pic@2x.png"),
      picDelete: require("../assets/iconImage/icon_delate@2x.png"),
      picDisabled: false,
      isPhone: false,
      LoadShow: false,
      imageUrl: "",
      gallerys: [], // 图片上传服务器
      gallerysLength: 0,
      // 图片放大
      bigShow: false, // 图片变大
      numIndex: 0, // 显示第几个
      numIndexLook: 0, // 显示第几个
      disabledFbBtn: false,
      delIocn: require("../assets/iconImage/ic_delete@3x.png"),
    };
  },
  created() {
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.isPhone = false;
    }
    if (isIOS) {
      this.isPhone = true;
    }
  },
  mounted() {
    /* eslint-disable */
    window.ImagesInfo = (params) => {
      var img = [];
      for (let i = 0; i < JSON.parse(params).length; i++) {
        img.push(
          "data:image/" +
            JSON.parse(params)[i].type +
            ";base64," +
            JSON.parse(params)[i].dataUrl
        );
      }
      for (let i = 0; i < img.length; i++) {
        var arr = img[i].split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        this.file = new File([u8arr], "aaa." + JSON.parse(params)[0].type, {
          type: mime,
        });
        this.afterRead(this.file);
      }
    };
  },

  methods: {
    Fb() {
      this.disabledFbBtn = true;
      var gallerysStr = this.gallerys.length > 0 ? this.gallerys.join() : "";
      this.$emit("Fb", this.message, gallerysStr);
      var that = this;
      setTimeout(() => {
        that.disabledFbBtn = false;
      }, 2000);
    },
    ClosePost() {
      this.isWriteShow = false;
      this.message = "";
      this.gallerys = [];
      //  this.$emit("closePost", "");
    },
    MyInput() {
      window.addEventListener("resize", function() {
        if (
          document.activeElement.tagName == "INPUT" ||
          document.activeElement.tagName == "TEXTAREA"
        ) {
          window.setTimeout(function() {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      });
      if (this.message === "") {
        this.publishShow = true;
      } else {
        this.publishShow = false;
      }
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow;
      if (this.faceShow == true) {
        for (let i in appData) {
          this.faceList.push(appData[i].char);
        }
      } else {
        this.faceList = [];
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.message += this.getBrowString;
        }
      }
      this.faceShow = false;
      if (this.message === "") {
        this.publishShow = true;
      } else {
        this.publishShow = false;
      }
    },
    // input聚焦
    InputFocus() {
      this.faceShow = false;
    },
    // 上传的点击放大
    BigPicture(index) {
      this.bigShow = true;
      this.numIndex = index;
    },
    // 图片上传
    afterRead(file) {
      this.LoadShow = true;
      // 此时可以自行将文件上传至服务器
      let params = []; //创建form对象new FormData()
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

      if (isAndroid) {
        let fromData = new FormData();
        fromData.append("file", file);
        this.$http
          .post("/appserver/v1/upload/image", fromData)
          .then((res) => {
            if (res.data.ret == 0) {
              this.gallerys.push(res.data.data.fileUrl);
              this.gallerysLength = this.gallerys.length;
              if (this.gallerysLength > 9) {
                this.gallerys.splice(8, this.gallerysLength - 9);
                this.$toast("上传图片最多可9张");
              }
              this.ImagesLength();
            } else {
              this.$toast(res.data.msg);
            }
            this.LoadShow = false;
          })
          .catch((error) => {
            this.$toast("网络异常,检查网络再试试~~");
          });
      }
      if (isIOS) {
        if (Array.isArray(file) === true) {
          for (let i = 0; i < file.length; i++) {
            let fromData = new FormData();
            params.push(file[i].file);
            fromData.append("file", params[i]);
            this.$http
              .post("/appserver/v1/upload/image", fromData)
              .then((res) => {
                if (res.data.ret == 0) {
                  this.gallerys.push(res.data.data.fileUrl);
                  this.gallerysLength = this.gallerys.length;
                  if (this.gallerysLength > 9) {
                    this.gallerys.splice(8, this.gallerysLength - 9);
                    this.$toast("上传图片最多可9张");
                  }
                  this.ImagesLength();
                } else {
                  this.$toast(res.data.msg);
                }
                this.LoadShow = false;
              })
              .catch((error) => {
                this.$toast("网络异常,检查网络再试试~~");
              });
          }
        } else {
          let fromData = new FormData();
          fromData.append("file", file.file);
          this.$http
            .post("/appserver/v1/upload/image", fromData)
            .then((res) => {
              if (res.data.ret == 0) {
                this.gallerys.push(res.data.data.fileUrl);
                this.gallerysLength = this.gallerys.length;
                if (this.gallerysLength > 9) {
                  this.gallerys.splice(8, this.gallerysLength - 9);
                  this.$toast("上传图片最多可9张");
                }
                this.ImagesLength();
              } else {
                this.$toast(res.data.msg);
              }
              this.LoadShow = false;
            })
            .catch((error) => {
              this.$toast("网络异常,检查网络再试试~~");
            });
        }
      }
    },
    // 图片上传
    ImagesUp() {
      console.log("图片上传");
      window.wii.app.invoke("getGallery", {
        number: 6,
        callback: "ImagesInfo",
      });
      this.$refs.myInput.focus();
      this.$nextTick(() => {
        document.getElementById("myInput").focus();
      });
    },
    showWriteDialog() {
      this.isWriteShow = true;
      this.$refs.myInput.focus();
      this.$nextTick(() => {
        document.getElementById("myInput").focus();
      });
    },
    ImagesLength() {
      if (this.gallerysLength >= 9) {
        this.tenShow = false;
      } else {
        this.tenShow = true;
      }
    },
    // 删除图片
    Delete(index) {
      if (index != -1) {
        this.gallerys.splice(index, 1);
      }
      if (this.gallerys.length === 0) {
        this.bigShow = false;
      }
    },
    Slide(index) {
      this.numIndex = index;
      this.numIndexLook = index;
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.big-picture {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1200;
  background: #000;
  .carousel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .swiper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      /deep/ .van-swipe {
        width: 100%;
      }
      /deep/ .van-swipe__track {
        height: 600px;
      }
      /deep/ .van-image {
        max-height: 600px;
      }
      /deep/ .van-swipe-item {
        display: flex;
        align-items: center;
      }
      .images-box {
        width: 100%;
      }
    }
    .back {
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1300;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      /deep/ .van-icon {
        font-size: 20px;
        font-weight: 600;
      }
      p {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFangSC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 16px;
      }
      span {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
    }
    .delete-box {
      position: absolute;
      bottom: 100px;
      & > div {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
.jiazai {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .van-loading {
    color: #fff;
  }
  & > div {
    width: 150px;
    height: 150px;
    background-color: rgba(50, 50, 51, 0.88);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    & > p {
      width: 100%;
      margin-top: 20px;
      color: #fff;
      text-align: center;
    }
  }
}
.write-comments {
  position: fixed;
  bottom: 0px;
  left: 0px;
  z-index: 1000;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  .bg {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
  #write {
    -webkit-overflow-scrolling: touch;
    z-index: 1200;
    position: fixed;
    bottom: 0px;
    left: 0px;
    padding: 20px;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    /deep/ .van-field__body textarea {
      -webkit-user-select: auto;
    }
    .text-icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > p {
        height: 16px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(55, 56, 77, 1);
        line-height: 16px;
      }
      /deep/ .van-icon {
        color: #999;
        font-size: 16px;
        font-weight: 500;
      }
    }
    /deep/ .van-cell-group {
      background: rgba(249, 249, 249, 1);
      border-radius: 3px;
    }
    /deep/ .van-field--min-height .van-field__control {
      min-height: 60px;
    }
    /deep/ .van-cell {
      background: rgba(249, 249, 249, 1);
      border-radius: 3px;
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .icon-img {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-bottom: 20px;
      .pic-box {
        width: 100%;
        height: 50px;
        /deep/ .van-image {
          border-radius: 3px;
          margin-right: 4px;
        }
        /deep/ .van-image__img {
          border-radius: 3px;
        }
      }
      .icon-image {
        width: 20px;
        height: 20px;
      }
      .pic_delete {
        position: absolute;
        top: -6.5px;
        right: -6.5px;
        .delImg {
          width: 15px;
          height: 15px;
        }
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/ .van-button {
        border: 0px;
        height: 30px;
        width: 60px;
        line-height: 30px;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      .img-expression {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /deep/ .van-image {
          margin-right: 20px;
        }
      }
      .hui_btn {
        /deep/ .van-button span {
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
    .browBox {
      width: 100%;
      height: 122px;
      margin-top: 10px;
      background: #e6e6e6;
      overflow: scroll;
      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        li {
          width: 14%;
          font-size: 26px;
          list-style: none;
          text-align: center;
        }
      }
    }
  }
}
</style>
