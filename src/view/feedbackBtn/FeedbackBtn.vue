<template>
  <div class="feedback-btn">
    <div class="submission">
      <van-cell-group>
        <van-field
          v-model="message"
          type="textarea"
          placeholder="说说您的问题"
          rows="3"
          maxlength="500"
          show-word-limit
          autosize
        />
      </van-cell-group>
      <div class="fb-btn">
        <div class="icon-img">
          <div v-for="(item, index) in gallerys" :key="index" class="pic-box">
            <van-image
              :src="item"
              width="80px"
              height="80px"
              fit="cover"
            ></van-image>
            <div class="pic_delete">
              <van-image
                :src="picDelete"
                class="delImg"
                width="15px"
                height="15px"
                @click="Delete(index)"
              ></van-image>
            </div>
          </div>
        </div>
      </div>
      <div style="position:relative">
        <van-uploader
          :after-read="afterRead"
          :disabled="picDisabled"
          v-if="isPhone"
          multiple
          :max-count="6"
        >
          <van-image
            :src="photoImg"
            class="icon-image"
            width="20px"
            height="20px"
          ></van-image>
        </van-uploader>
        <van-image
          :src="photoImg"
          class="icon-image"
          width="20px"
          height="20px"
          @click="ImagesUp()"
          v-if="!isPhone"
        ></van-image>
        <van-image
          :src="expressionImg"
          @click="faceContent"
          width="20px"
          height="20px"
          class="imgFace"
        ></van-image>
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
        <van-button @click="submitFeed">提交</van-button>
      </div>
    </div>
    <div class="jiazai" v-if="LoadShow">
      <div class="">
        <van-loading type="spinner" />
        <p>正在加载图片...</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
var appData = require("@/assets/emojis.json");
export default {
  data() {
    return {
      LoadShow: false,
      message: "",
      photoImg: require("../../assets/iconImage/ic_pic@2x.png"),
      expressionImg: require("../../assets/iconImage/ic_em@2x.png"),
      fileList: [],
      gallerys: [], // 图片上传服务器
      faceShow: false,
      faceList: [],
      picDelete: require("../../assets/iconImage/icon_delate@2x.png"),
      picDisabled: false,
      isPhone: false,
      imageUrl: "",
      isSubmit: false,
    };
  },
  created() {
    window.wii.app.invoke("setTitle", "意见反馈");
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.isPhone = false;
    } else {
      this.isPhone = true;
    }
    if (isIOS) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
  },
  mounted() {
    // eslint-disable-next-line
    window.ImagesInfo = (params) => {
      var img = [];
      for (var i = 0; i < JSON.parse(params).length; i++) {
        img.push(
          "data:image/" +
            JSON.parse(params)[i].type +
            ";base64," +
            JSON.parse(params)[i].dataUrl
        );
      }
      for (var j = 0; j < img.length; j++) {
        var arr = img[j].split(",");
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
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "意见反馈");
      this.showLoading(false);
    };
  },
  methods: {
    ImagesUp() {
      window.wii.app.invoke("getGallery", {
        number: 6,
        callback: "ImagesInfo",
      });
    },
    // 图片上传
    afterRead(file) {
      this.LoadShow = true;
      // 此时可以自行将文件上传至服务器
      var params = []; //创建form对象new FormData()
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      var fromData = "";
      if (isAndroid) {
        fromData = new FormData();
        fromData.append("file", file);
        this.$http
          .post("/appserver/v1/upload/image", fromData)
          .then((res) => {
            if (res.data.ret == 0) {
              this.gallerys.push(res.data.data.fileUrl);
            } else {
              this.$toast(res.data.msg);
            }
            this.LoadShow = false;
          })
          .catch((err) => {
            // eslint-disable-next-line
            console.log(err);
          });
      }
      if (isIOS) {
        if (Array.isArray(file) === true) {
          for (var i = 0; i < file.length; i++) {
            params.push(file[i].file);
            fromData = new FormData();
            fromData.append("file", params[i]);
            this.$http
              .post("/appserver/v1/upload/image", fromData)
              .then((res) => {
                if (res.data.ret == 0) {
                  this.gallerys.push(res.data.data.fileUrl);
                } else {
                  this.$toast(res.data.msg);
                }
                this.LoadShow = false;
              })
              .catch((err) => {
                // eslint-disable-next-line
                console.log(err);
              });
          }
        } else {
          fromData = new FormData();
          fromData.append("file", file.file);
          this.$http
            .post("/appserver/v1/upload/image", fromData)
            .then((res) => {
              if (res.data.ret == 0) {
                this.gallerys.push(res.data.data.fileUrl);
              } else {
                this.$toast(res.data.msg);
              }
              this.LoadShow = false;
            })
            .catch((err) => {
              // eslint-disable-next-line
              console.log(err);
            });
        }
      }
    },
    // 删除图片
    Delete(index) {
      if (index != -1) {
        this.fileList.splice(index, 1);
        if (this.fileList.length < 6) {
          this.picDisabled = false;
        }
        this.gallerys.splice(index, 1);
      }
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow;
      if (this.faceShow == true) {
        for (var i in appData) {
          this.faceList.push(appData[i].char);
        }
      } else {
        this.faceList = [];
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (var i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.message += this.getBrowString;
        }
      }
      this.faceShow = false;
      if (this.message === "") {
        this.btnShow = true;
      } else {
        this.btnShow = false;
      }
    },
    // 上传
    submitFeed() {
      if (this.isSubmit == true) {
        this.$toast("请勿重复提交");
      } else {
        if (this.message === "") {
          this.$toast({
            message: "请填写反馈信息",
            duration: "2000",
          });
        } else if (this.gallerys === "") {
          this.$toast({
            message: "请上传反馈图片",
            duration: "2000",
          });
        } else {
          this.isSubmit = true;
          var data = {
            opinionQuestion: this.message,
            userId: this.uid,
            gallerys: this.gallerys,
          };

          this.$http
            .post("/appserver/v1/opinion/save", data)
            .then((data) => {
              if (data.data.ret === 0) {
                setTimeout(() => {
                  this.$toast({
                    message: "已提交",
                    duration: "2000",
                  });
                  this.gobackFunction();
                }, 1500);
              } else {
                this.$toast(data.data.msg);
                this.isSubmit = false;
              }
            })
            .catch((error) => {
              this.$toast("网络异常,检查网络再试试~~");
            });
        }
      }
    },
    gobackFunction() {
      setTimeout(() => {
        window.wii.app.invoke("closeWindow");
      }, 2000);
    },
  },
};
</script>
<style lang="scss" scoped>
.feedback-btn {
  background: #f6f6f6;
  height: 100%;
  .submission {
    position: relative;
    background: #fff;
    padding: 15px;
    padding-bottom: 20px;
    /deep/ .van-field__body textarea {
      -webkit-user-select: auto;
    }
    /deep/ .van-hairline--top-bottom::after {
      border: 0px;
    }
    /deep/ .van-cell {
      padding: 0px;
    }
    /deep/ .van-field__control {
      max-height: 150px !important;
    }
    .fb-btn {
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      margin-top: 15px;
      .icon-img {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .pic-box {
          position: relative;
          width: 80px;
          height: 80px;
          margin-right: 15px;
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
      .faceImg {
        position: absolute;
      }
    }
    /deep/ .van-button {
      position: absolute;
      right: 10px;
      bottom: 10%;
      width: 50px;
      height: 30px;
      // border: 0px;
      border-radius: 3px;
      line-height: 30px;
      // font-size: 15px;
      background: #188357;
      color: #fff;
      padding: 0;
    }
    /deep/.van-uploader__input-wrapper {
      width: 20px;
      height: 20px;
      display: inline-block;
    }
    .browBox {
      position: absolute;
      right: 0px;
      // top: 240px;
      width: 100%;
      height: 200px;
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
.imgFace {
  width: 20px;
  height: 20px;
  margin-left: 10px;
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
</style>
