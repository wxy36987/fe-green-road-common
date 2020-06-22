<template>
  <div class="father-div">
    <div class="open-app-topdialog" v-if="String(isShow) == 'true'">
      <div>
        <van-image :src="logo" fit="contain" />
        <h v-html="title"></h>
      </div>
      <span @click="openApp()"> 打开APP </span>
    </div>
    <div
      class="mongolia"
      v-if="isMongolia"
      @click="isMongolia = false"
      @touchmove.prevent
    >
      <van-image :src="open_toast" fit="contain"> </van-image>
    </div>
  </div>
</template>

<script>
export default {
  name: "openDialog",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    shareId: {
      type: String,
      default: "",
    },
    shareType: {
      type: String,
      default: "",
    },
    propF: {},
  },
  data() {
    return {
      // title: "", //"打开天府绿道APP<br/>周边好店尽收眼底",
      isMongolia: false,
      logo: require("../assets/iconImage/logo.png"),
      open_toast: require("../assets/iconImage/ic_android_link_tip.png"),
      open_toast_ios: require("../assets/iconImage/ic_ios_link_tip.png"),
      isVisable: true,
    };
  },
  created() {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      this.open_toast = this.open_toast_ios;
    }
  },
  mounted() {},
  methods: {
    openApp() {
      var timer;
      var that = this;
      var hiddenProperty =
        "hidden" in document
          ? "hidden"
          : "webkitHidden" in document
          ? "webkitHidden"
          : "mozHidden" in document
          ? "mozHidden"
          : null;
      document.addEventListener("visibilitychange", () => {
        if (document[hiddenProperty]) {
          //当离开H5 跳转到app原生的页面时,这里会被触发
          if (timer) {
            clearTimeout(timer);
          }
        } else {
          //当从原生页面用户一系列操作后,返回H5的时候,这里会被触发
        }
      });

      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      //微信
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // var ifr = document.createElement("iframe");
        // if (isAndroid) {
        //   window.location.href = `schema://tfgr.greenway.com/detail?id=${
        //     this.shareIdschema
        //   }&type=${this.shareType}`;
        //   timer = setTimeout(() => {
        //     that.downloadApp(true, true);
        //   }, 500);
        // }
        // if (isiOS) {
        //   ifr.src = `tfgreenway://tfgr.greenway.com/detail?id=${
        //     this.shareId
        //   }&type=${this.shareType}`; /***打开app的协议，有ios同事提供***/
        //   ifr.style.display = "none";
        //   document.body.appendChild(ifr);
        //   timer = setTimeout(() => {
        //     that.downloadApp(true, false);
        //   }, 2000);
        // }  // 微信将唤起本地APP的接口封了
        that.downloadApp(true, false);
      } else {
        //非微信浏览器
        if (isiOS) {
          window.location = `tfgreenway://tfgr.greenway.com/detail?id=${
            this.shareId
          }&type=${this.shareType}`;
          timer = window.setTimeout(function() {
            that.downloadApp(false, false);
          }, 2000);
        } else if (isAndroid) {
          try {
            window.location = `schema://tfgr.greenway.com/detail?id=${
              this.shareId
            }&type=${this.shareType}`;
            timer = setTimeout(function() {
              if (that.isVisable) {
                that.downloadApp(false, true);
              }
            }, 2000);
          } catch (e) {
            if (that.isVisable) {
              that.downloadApp(false, true);
            }
          }
        }
      }
      this.$emit("openApp", "");
    },
    downloadApp(isWeiXin, isAndroid) {
      if (isWeiXin) {
        this.isMongolia = true;
      } else {
        var url = ""; //1安卓 2ios
        if (isAndroid) {
          url = "/appserver/v1/update/version?type=1";
        } else {
          url = "/appserver/v1/update/version?type=3";
        }
        this.$http.get(url).then((data) => {
          if (data.data.data) {
            window.location = data.data.data.url; //下载地址
          } else {
            this.$toast(data.data.msg);
          }
        });
      }
      //eslint-disable-next-line
      console.log("downloadApp()");
    },
    //显示图蒙层
    showToast() {
      var ua = window.navigator.userAgent.toLowerCase(),
        isWx = ua.match(/MicroMessenger/i) == "micromessenger",
        isQQ = ua.match(/QQ/i) == "qq",
        isWeiBo = ua.match(/WeiBo/i) == "weibo";
      if (isWx || isQQ || isWeiBo) {
        this.isMongolia = true;
      }
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.father-div {
  // position: absolute;
  // position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  //z-index: 2500;
  background: white;
  .open-app-topdialog {
    margin: 0px 0px;
    padding: 14px 0px 10px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: #f8f8f8;
    background: white;
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #444444;
      /deep/ .van-image {
        margin-left: 10px;
        padding: 10px 10px;
        margin-right: 10px;
        border-radius: 2px;
        width: 3rem;
        height: 3rem;
      }
      &:nth-of-type(2) {
        color: rgba(55, 56, 77, 1);
        font-size: 20px;
        max-width: 50px;
      }
    }
    & > span {
      font-size: 11px;
      color: white;
      padding: 10px 10px;
      margin-right: 20px;
      background: rgba(36, 137, 96, 1);
      border-radius: 2px;
    }
  }
}
.mongolia {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3000;

  /deep/ .van-image {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: -25px;
    margin-right: 10px;
    width: 20rem;
    height: 20rem;
  }
}
</style>
