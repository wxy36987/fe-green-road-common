<template>
  <div class="online-help">
    <div class="wrap">
      <div class="input-item">
        <p>
          <span>求助人</span>
          <i>(必填)</i>
        </p>
        <van-field
          v-model="username"
          placeholder="您的真实姓名"
          @input="InputBlur()"
        />
      </div>
      <div class="input-item">
        <p>
          <span>联系电话</span>
          <!-- <i>*</i> -->
        </p>
        <van-field
          v-model="userphoto"
          type="number"
          placeholder="您的手机号码"
          @input="InputBlur()"
        />
      </div>
      <div class="input-item">
        <p>
          <span>求助事项</span>
          <i>(必填)</i>
        </p>
        <van-field
          v-model="news"
          placeholder="请输入求助事项信息"
          type="textarea"
          maxlength="200"
          rows="1"
          autosize
          show-word-limit
          @input="InputBlur()"
          @keyup="InputKey()"
        />
        <!-- <span class="span-1">{{this.news.length < 200 ? this.news.length:200}}/200</span> -->
      </div>
      <div class="upload">
        <p>上传图片 <span>（最多可上传6张图片）</span></p>
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
          <van-uploader
            name="file"
            multiple
            :max-count="6"
            :after-read="onloadFile"
            v-if="isPhone"
          ></van-uploader>
          <div class="upload" @click="ImagesUp()" v-if="!isPhone">
            <van-icon name="plus"></van-icon>
          </div>
        </div>
      </div>
    </div>
    <div style="height:70px;width:100%;"></div>
    <div class="feedback-btn">
      <van-button color="#F7F7F7" disabled v-if="submissionBtn"
        >提交</van-button
      >
      <van-button
        color="#188357"
        v-if="!submissionBtn"
        class="btn-two"
        @click="submitHelp()"
        :disabled="disabledFbBtn"
        >提交</van-button
      >
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
/* eslint-disable */
export default {
  data() {
    return {
      username: "", //真实姓名
      userphoto: "", //手机号
      fileList: [], //上传图片
      gallerys: [],
      submissionBtn: true,
      value1: "", //存放求助信息
      imgSrc: "",
      index: 0,
      deteleIcon: require("../../assets/iconImage/icon_delate@3x.png"),
      isPhone: false,
      lat: "",
      lng: "",
      cityLocation: "",
      gallerysLength: "",
      LoadImgShow: false,
      disabledFbBtn: false,
    };
  },
  created() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    if (this.isIOSDev()) {
      this.isPhone = true;
    } else if (this.isAndroidDev()) {
      this.isPhone = false;
    }
    this.commonGetUserInfo((userInfo) => {
      this.userphoto = userInfo.phone;
      this.username = userInfo.username;
    });
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
      this.initData();
    });
    // 设置title
    window.wii.app.invoke("setTitle", "在线求助");
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
        this.onloadFile(this.file);
      }
    };
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "在线求助");
      this.commonGetUserInfo((userInfo) => {
        this.userphoto = userInfo.phone;
        this.username = userInfo.username;
      });
    };
  },
  methods: {
    ImagesUp() {
      window.wii.app.invoke("getGallery", {
        number: 6,
        callback: "ImagesInfo",
      });
    },
    onloadFile(file) {
      if (this.gallerys.length > 6) {
        this.$toast("图片最多可6张");
        return false;
      }
      this.LoadImgShow = true;
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
              this.gallerysLength = this.gallerys.length;
              if (this.gallerysLength > 6) {
                this.gallerys.splice(6, this.gallerysLength - 6);
                this.$toast("图片最多可6张");
              }
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
                  this.gallerysLength = this.gallerys.length;
                  if (this.gallerysLength > 6) {
                    this.gallerys.splice(6, this.gallerysLength - 6);
                    this.$toast("图片最多可6张");
                  }
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
                this.gallerysLength = this.gallerys.length;
                if (this.gallerysLength > 6) {
                  this.gallerys.splice(6, this.gallerysLength - 6);
                  this.$toast("图片最多可6张");
                }
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
    // 删除图片
    Delete(index) {
      if (index != -1) {
        if (this.gallerys.length < 6) {
          this.picDisabled = false;
        }
        this.gallerys.splice(index, 1);
      }
    },
    InputBlur() {
      if (this.username !== "" && this.userphoto !== "" && this.news !== "") {
        this.submissionBtn = false;
      } else {
        this.submissionBtn = true;
      }
    },
    InputKey() {
      if (this.news.length > 200) {
        var lenText = this.news.substring(0, 200);
        this.news = lenText;
      }
    },
    initData() {
      this.$http
        .get(`/appserver/v1/api/home/detail`, {
          headers: {
            latitude: this.lat, //纬度
            longitude: this.lng, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            var _data = data.data.data;
            this.cityLocation = _data.scenicName;
          }
          this.showLoading(false);
        });
    },
    submitHelp() {
      this.disabledFbBtn = true;
      //提交帮助
      var data = {
        userId: this.uid, //用户ID
        helpMan: this.username, //真实姓名
        contactTel: this.userphoto, //手机号
        helpItem: this.news, //求助信息
        address: this.cityLocation,
        longitude: this.lng,
        latitude: this.lat,
        gallerys: this.gallerys, //上传图片
      };
      this.$http
        .post("/appserver/v1/help/save", data, {
          headers: {
            latitude: this.lat, //纬度
            longitude: this.lng, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            this.$toast("提交成功");
            window.wii.app.invoke("closeWindow");
          } else {
            this.disabledFbBtn = false;
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.disabledFbBtn = false;
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
  },
  computed: {
    news: {
      get() {
        /* eslint-disable */
        var value = this.value1.replace(
          /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
          ""
        ); /* eslint-enable */
        return value.trim();
      },
      set(val) {
        this.value1 = val;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.online-help {
  .title {
    /deep/ .van-nav-bar .van-icon {
      color: #4a4a4a;
      font-size: 22px;
    }
    /deep/ .van-nav-bar__title {
      color: #4a4a4a;
      font-size: 16px;
    }
    /deep/ [class*="van-hairline"]::after {
      border: 0px;
    }
  }
  .wrap {
    padding: 0 20px;
    .input-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      min-height: 60px;
      /deep/ .van-field__body textarea {
        -webkit-user-select: auto;
      }
      /deep/ .van-cell {
        padding-left: 0px;
        padding-right: 0px;
        width: 240px;
        //   margin-bottom: 10px;
      }
      & > p {
        width: 115px;
        color: #4a4a4a;
        font-size: 15px;
        display: flex;
        align-items: center;
        & > i {
          //   font-size: 11px;
          //   margin-left: 4px;
          //   color: red;
          font-size: 11px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
        }
      }
      &:nth-of-type(3) {
        margin: 22px 0;
        align-items: flex-start;
        /deep/ .van-field__word-limit {
          margin-top: 4px;
        }
        /deep/ .van-field__control {
          // height: 32px !important;
          height: 140px !important;
          padding: 0px;
        }
        /deep/ .van-cell {
          padding: 0px;
          // width: 170px;
          //height: 160px;
          min-height: 120;
        }
      }
      .span-1 {
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
    }
    .upload {
      & > p {
        color: #4a4a4a;
        font-size: 15px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        span {
          font-size: 11px;
          margin-left: 4px;
          color: #969799;
        }
      }
      .upload {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        border: #d2d2d2 dashed 0.5px;
        position: relative;
        /deep/ .van-icon {
          color: #d2d2d2;
          font-weight: 500;
          font-size: 20px;
        }
        & > input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
    }
    .images-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      box-sizing: border-box;
    }
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
  .feedback-btn {
    width: 100%;
    height: 70px;
    padding: 15px 25px;
    box-sizing: border-box;
    flex: 0 0 auto;
    box-shadow: 1px 0px 10px #ddd;
    z-index: 1200;
    position: fixed;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    /deep/ .van-button {
      width: 100%;
      height: 100%;
    }
    /deep/ .van-button span {
      color: #9b9b9b;
      font-size: 17px;
    }
    .btn-two span {
      color: #fff;
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
