<template>
  <div class="my-question">
    <div class="title">
      <van-image
        :src="backIcon"
        width="10px"
        height="19px"
        @click="Back()"
      ></van-image>
      <div class="publish-btn">
        <van-button color="#F1F1F1" class="btn-on" v-if="fbBtnShow"
          >发布</van-button
        >
        <van-button
          v-if="!fbBtnShow"
          color="#188357"
          class="btn-yes"
          @click="Release()"
          >发布</van-button
        >
      </div>
    </div>
    <div class="wray">
      <div class="classify">
        <p>{{ this.$route.query.questionTitle }}</p>
      </div>
      <div class="content">
        <van-field
          v-model="answerVal"
          rows="1"
          autosize
          id="input_answer"
          type="textarea"
          placeholder="写回答"
          @blur="InputBlur()"
          @focus="InputFocus()"
          @input="InputMonitor()"
        />
        <!-- <van-image
          v-for="(item, index) in gallerys"
          :key="index"
          :src="item"
          width="100%"
        ></van-image> -->
        <div class="images-box">
          <div class="images" v-for="(item, index) in gallerys" :key="index">
            <div>
              <van-image
                :src="item"
                class="card-img"
                width="80px"
                height="80px"
                fit="cover"
              ></van-image>
              <van-image
                :src="deteleIcon"
                width="15.2px"
                height="15.2px"
                class="detele"
                @click="Delete(index)"
              ></van-image>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <van-image width="100%" height="5px" :src="lineGrayIcon"></van-image>
      <div class="up-arrow">
        <van-image
          :src="upArrowIcon"
          width="20px"
          height="20px"
          v-show="arrowShow"
          @click="UpBtn"
        ></van-image>
        <van-image
          :src="xiaArrowIcon"
          width="20px"
          height="20px"
          v-show="!arrowShow"
          @click="UpBlurBtn"
        ></van-image>

        <van-uploader :after-read="afterRead" v-if="isPhone">
          <van-image :src="picIcon" width="20px" height="20px"></van-image>
        </van-uploader>
        <van-image
          :src="picIcon"
          class="icon-image"
          width="20px"
          height="20px"
          @click="ImagesUp()"
          v-if="!isPhone"
        ></van-image>
      </div>
    </div>
    <div class="jiazai" v-if="LoadImgShow">
      <div class="">
        <van-loading type="spinner" />
        <p>正在加载图片...</p>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      backIcon: require("../../assets/iconImage/ic_back@2x.png"), // titleBar 返回icon
      fbBtnShow: true, // 发布按钮
      answerVal: "",
      lineGrayIcon: require("../../assets/iconImage/ans_line@2x.png"), // 下部输入框线
      upArrowIcon: require("../../assets/iconImage/ic_zhedie@2x.png"),
      xiaArrowIcon: require("../../assets/iconImage/ic_zhediexia@2x.png"),
      picIcon: require("../../assets/iconImage/ic_pic@2x.png"),
      arrowShow: true,
      fileList: [],
      gallerys: [],
      isPhone: false,
      clickNum: false,
      deteleIcon: require("../../assets/iconImage/icon_delate@3x.png"),
      LoadImgShow: false,
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
    } else {
      this.isPhone = true;
    }
    if (isIOS) {
      this.isPhone = true;
    } else {
      this.isPhone = false;
    }
    window.wii.app.invoke("showNativeBar", false);
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
    window.wii.app.invoke("showNativeBar", false);
  },
  methods: {
    Back() {
      // window.wii.app.invoke('closeWindow');
      this.$router.go(-1);
    },
    ImagesUp() {
      window.wii.app.invoke("getGallery", {
        number: 2,
        callback: "ImagesInfo",
      });
    },
    // 写回复
    InputBlur() {
      this.arrowShow = true;
    },
    InputFocus() {
      this.arrowShow = false;
    },
    InputMonitor() {
      if (this.answerVal === "") {
        this.fbBtnShow = true;
      } else {
        this.fbBtnShow = false;
      }
    },
    UpBtn() {
      document.getElementById("input_answer").focus();
    },
    UpBlurBtn() {
      document.getElementById("input_answer").blur();
    },
    // 图片上传
    afterRead(file) {
      this.LoadImgShow = true;
      // 此时可以自行将文件上传至服务器
      var params = []; //创建form对象new FormData()
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      var fromData = new FormData();
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
            this.LoadImgShow = false;
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
                this.LoadImgShow = false;
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
              this.LoadImgShow = false;
            })
            .catch((err) => {
              // eslint-disable-next-line
              console.log(err);
            });
        }
      }
    },
    // 发布
    Release() {
      if (this.gallerys.length >= 3) {
        this.$toast("最多能上传2张图片！");
        return false;
      }
      if (this.clickNum === false) {
        this.clickNum = true;
        var arrJoinString = this.gallerys.join();
        var params = {
          question_id: this.$route.query.id,
          answer_uid: this.uid,
          content: this.answerVal,
          image: arrJoinString,
        };
        this.$http
          .post(`/appserver/v1/quesAnswer/saveAnswer`, qs.stringify(params), {
            headers: {
              "Set-Cookie": `w_uid=${this.uid};w_open_id=${
                this.open_id
              };w_skey=${this.skey}`,
            },
          })
          .then((data) => {
            this.clickNum = false;
            if (data.data.ret == 0) {
              this.$toast("发布成功");
              setTimeout(() => {
                // window.wii.app.invoke('closeWindow');
                this.$router.go(-1);
              }, 1500);
            } else {
              this.$toast(data.data.msg);
            }
          });
      }
    },
    // 删除图片
    Delete(index) {
      if (index != -1) {
        this.gallerys.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.my-question {
  width: 100%;
  .title {
    width: 100%;
    padding: 9px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .publish-btn {
      .btn-on span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .btn-yes span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
      }
      /deep/ .van-button {
        width: 60px;
        height: 30px;
        line-height: 30px;
        border: 0px;
      }
    }
  }
  .wray {
    .classify {
      p {
        width: 100%;
        box-sizing: border-box;
        padding: 22px 15px 20px 15px;
        border-bottom: 5px solid #f8f8f8;
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
      }
    }
    .content {
      padding: 0 20px;
      margin-top: 22px;
      /deep/ .van-field__body textarea {
        -webkit-user-select: auto;
      }
      /deep/ .van-cell {
        padding: 0px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(55, 56, 77, 1);
      }
      /deep/ .van-cell:not(:last-child)::after {
        border: 0;
      }
      /deep/ .van-image {
        margin: 16px 0;
      }
      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 ~ 18 */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        opacity: 1;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        opacity: 1;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10 ~ 11 */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      ::-ms-input-placeholder {
        /* Microsoft Edge */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }

      ::placeholder {
        /* 大部分现代浏览器 */
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .images-box {
        display: flex;
        margin-top: 50px;
        justify-content: flex-start;
        flex-wrap: wrap;
        .images {
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
          margin-right: 10px;
          /deep/ .van-image__img {
            border-radius: 4px;
          }
          & > div {
            width: 80px;
            height: 80px;
            position: relative;
            .detele {
              position: absolute;
              top: -7.6px;
              right: -7.6px;
            }
          }
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0px;
    left: 0px;
    background: #fff;
    .up-arrow {
      padding: 15px 18px;
      display: flex;
      justify-content: space-between;
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
}
</style>
