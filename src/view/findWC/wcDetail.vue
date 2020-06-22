<!--厕所详情-->
<template>
  <div class="page-content">
    <div class="header">
      <van-nav-bar title="找厕所" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="wcde-content">
      <van-swipe :loop="false" :initial-swipe="2">
        <van-swipe-item v-for="(v, i) in wc.iconPath" :key="i">
          <div v-if="v"><img :src="v" /></div>
          <div class="imges-box" v-if="!v">
            <van-image :src="iconPath" width="60%" />
          </div>
        </van-swipe-item>
      </van-swipe>

      <div class="wcde-title">{{ wc.toiletName }}</div>
      <div class="wcde-point">
        卫生{{ parseNum(point.healthMark) }}分&#8195; |&#8195; 环境{{
          parseNum(point.environmentMark)
        }}分&#8195; | &#8195; 气味{{ parseNum(point.smellMark) }}分
      </div>
      <div class="wc-type-box">
        <span class="item" v-if="index === 0">离我最近</span>
        <span class="item" v-if="wc.smart">智慧厕所</span>
        <span class="item" v-if="wc.hasDisabled">残疾人厕所</span>
        <span class="item" v-if="wc.hasThird">第三人厕所</span>
      </div>

      <div class="wcde-line"></div>
      <div class="wcde-msg" v-if="wc.smart || wc.hasDisabled || wc.hasThird">
        <div class="msg-item">
          男厕：总坑位{{ wc.maleCount || 0 }}个，空位{{
            wc.maleSurplusCount || 0
          }}个
        </div>
        <div class="msg-item">
          女厕：总坑位{{ wc.femaleCount || 0 }}个，空位{{
            wc.femaleSurplusCount || 0
          }}个
        </div>
        <div class="msg-item" v-if="wc.hasDisabled">
          残疾人厕： 总坑位{{ wc.disabledCount || 0 }}个，空位{{
            wc.disabledSurplusCount || 0
          }}个
        </div>
        <div class="msg-item" v-if="wc.hasThird">
          第三人厕： 总坑位{{ wc.thirdCount || 0 }}个，空位{{
            wc.thirdSurplusCount || 0
          }}个
        </div>
      </div>
      <div class="wcde-map">
        <div id="map" style="width:100%;height:100%;border-radius:2px;"></div>
      </div>
    </div>
    <div class="wcde-bottom">
      <div class="wcde-nav" @click="toUrl">
        <img :src="findwc_pinlun" alt="" srcset="" />
        评价
      </div>
      <div class="wcde-nav" @click="toWxT">
        <img :src="findwc_tousu" alt="" srcset="" />
        投诉
      </div>
      <div class="wcde-btn" @click="StartNavigation()">开始导航</div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import { mapState, mapActions } from 'vuex'
import qs from "qs";
var wcIcon = require("../../assets/iconImage/wc@2x.png");
import { Dialog } from "vant";
export default {
  data() {
    return {
      tags: [{ tag: "智慧厕所" }, { tag: "残疾人厕所" }, { tag: "第三人厕所" }],
      findwc_pinlun: require("../../assets/iconImage/findwc_pinlun.png"),
      findwc_tousu: require("../../assets/iconImage/findwc_tousu.png"),
      wc: {},
      point: {},
      lat: "",
      lng: "",
      iconPath: require("../../assets/iconImage/noImage@3x.png"),
      isShowDialog: false,
      index: 0,
    };
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
    });
    window.wii.app.invoke("showNativeBar", false);
    // eslint-disable-next-line
    console.log("created()");
  },
  methods: {
    onClickLeft() {
      // this.$router.push({
      // 	path: '/findWC',
      // 	query: {
      // 		num: this.$route.query.current
      // 	}
      // });
      // window.wii.app.invoke("openWindow", {
      //   openUrl: `${this.domain}findWC?num=${this.$route.query.current}`,
      //   isFullScreen: 0,
      //   setTitle: "找厕所",
      //   needLoading: 0
      // });
      setTimeout(() => {
        window.wii.app.invoke("closeWindow");
      }, 100);
    },
    toUrl() {
      if (this.uid) {
        if (this.wc.userIsComment == 1) {
          this.showDialog("您好，对同一厕所一天内只能评价一次");
        } else {
          this.$router.push({
            path: "/wcEvaluation",
            query: {
              wc_id: this.$route.query.id,
              from: "web",
            },
          });
          // window.wii.app.invoke('openWindow', {
          // 	openUrl: `${this.domain}wcEvaluation?wc_id=${this.$route.query.id}`,
          // 	isFullScreen: 0,
          // 	setTitle: '找厕所',
          // 	needLoading: 0
          // });
        }
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    toWxT() {
      if (this.uid) {
        if (this.wc.userIsComplaint == 1) {
          this.showDialog("您好，对同一厕所一天内只能投诉一次");
        } else {
          this.$router.push({
            path: "/complainSubmit",
            query: {
              toiletName: this.wc.toiletName,
              toiletNum: this.wc.toiletNum,
              typeWc: 1,
            },
          });
          // 	window.wii.app.invoke('openWindow', {
          // 		openUrl: `${this.domain}complainSubmit?toiletName=${this.wc.toiletName}&toiletNum=${this.wc.toiletNum}&typeWc=1`,
          // 		isFullScreen: 0,
          // 		setTitle: '投诉',
          // 		needLoading: 0
          // 	});
        }
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 开始导航
    StartNavigation() {
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        window.wii.app.invoke("navigator", {
          from: `${this.lat},${this.lng}`,
          to: `${this.wc.latitude},${this.wc.longitude}`,
          mode: "walking",
        });
      }

      if (isIOS) {
        window.wii.app.invoke("navigator", {
          from: `${this.lat},${this.lng}`,
          to: `${this.wc.latitude},${this.wc.longitude}`,
          mode: "walking",
          from_name: "",
          from_address: "",
          to_name: this.wc.toiletName,
          to_address: this.wc.address,
        });
      }
    },
    initData() {
      // eslint-disable-next-line
      console.log("initData");
      this.$http({
        url: `/appserver/v1/toilet/detail?${qs.stringify({
          toiletId: this.$route.query.id,
          userId: this.uid,
        })}`,
      }).then((res) => {
        // console.log(res)
        if (res.status === 200) {
          this.wc = res.data ? res.data.data : {};
          this.initData1();
        }
      });
      this.$http({
        url: `/appserver/v1/toilet/queryToiletAvgComment?${qs.stringify({
          toiletId: this.$route.query.id,
        })}`,
      })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.point = res.data ? res.data.data : {};
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    initData1() {
      this.$http({
        url: `/appserver/v1/toilet/detail?${qs.stringify({
          toiletId: this.$route.query.id,
          userId: this.uid,
          wisdomNum: this.wc.toiletNum,
        })}`,
      }).then((res) => {
        // console.log(res)
        if (res.status === 200) {
          this.wc = res.data ? res.data.data : {};
          this.initMap();
        }
      });
      this.$http({
        url: `/appserver/v1/toilet/queryToiletAvgComment?${qs.stringify({
          toiletId: this.$route.query.id,
        })}`,
      }).then((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.point = res.data ? res.data.data : {};
        }
      });
    },
    initMap() {
      /* eslint-disable */
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(
        this.lat || 30.7288,
        this.lng || 103.97373
      );
      //厕所位置
      var wcLatlng = new qq.maps.LatLng(
        Number(this.wc.latitude),
        Number(this.wc.longitude)
      );
      // 定义工厂模式函数
      var myOptions = {
        zoom: 15, // 设置地图缩放级别
        center: wcLatlng, // 设置中心点样式
        zoomControl: false,
        disableDefaultUI: true,
        mapTypeId: qq.maps.MapTypeId.ROADMAP, // 设置地图样式详情参见MapType
      };
      // 获取dom元素添加地图信息
      this.map = new qq.maps.Map(document.getElementById("map"), myOptions);
      var marker = new qq.maps.Marker({
        position: wcLatlng,
        map: this.map,
      });
      marker.setVisible(true);
      var size = new qq.maps.Size(28, 30);
      var origin = new qq.maps.Point(0, 0);
      var anchor = new qq.maps.Point(14, 30);
      var scaleSize = new qq.maps.Size(28, 30);
      this.icon = new qq.maps.MarkerImage(
        wcIcon,
        size,
        origin,
        anchor,
        scaleSize
      );
      marker.setIcon(this.icon);
    },
    showDialog(text) {
      this.isShowDialog = true;
      window.history.pushState(null, null, "#");
      Dialog.confirm({
        title: "",
        message: text,
        confirmButtonColor: "#178357",
        showCancelButton: false,
        closeOnPopstate: true, // 是否在页面回退时自动关闭
      }).closed(() => {
        this.isShowDialog = false;
      });
    },
    popstate() {
      if (this.isShowDialog) {
        Dialog.close();
      } else {
        this.$router.go(-1);
      }
    },
    parseNum(m) {
      if (isNaN(m)) {
        return "";
      }
      return new Number(m).toFixed(1);
    },
  },
  mounted() {
    //设置标题
    window.wii.app.invoke("setTitle", "找厕所");
    this.index = this.$route.query.index;
    this.initData();
    window.addEventListener("popstate", this.popstate, false);
  },
  destroyed() {
    window.removeEventListener("popstate", this.popstate, false);
  },
};
</script>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.page-content {
  .header {
    width: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background: #fff;
    z-index: 1200;
    /deep/ .van-icon {
      color: #000;
      font-size: 20px;
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
  }
  .wcde-content {
    margin-top: 46px;
    width: 100%;
    height: calc(100% - 80px);
    padding: 10px 20px;
    box-sizing: border-box;
    overflow-y: auto;
    img {
      width: 100%;
      height: 210px;
      border-radius: 2px;
    }
    .wcde-title {
      padding: 16px 0px;
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      line-height: 17px;
    }
    .wcde-point {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(85, 89, 89, 1);
      line-height: 15px;
    }
    .wc-type-box {
      display: flex;
      padding: 12px 0px 19px 0px;
      border-bottom: 1px solid #e8e8e8;

      .item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 35px;
        font-size: 11px;
        background-color: #f6f6f7;
        color: #555959;
        border-radius: 2px;
        overflow: hidden;

        &.current {
          color: white;
          background-color: #178357;
        }
      }
      .item:not(:first-child) {
        margin-left: 10px;
      }
    }
    .wcde-line {
      width: 100%;
      height: 1px;
      background: #e8e8e8;
    }
    .wcde-msg {
      box-sizing: border-box;
      padding: 10px 0;
      .msg-item {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
        line-height: 14px;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
    .wcde-map {
      width: 100%;
      height: 180px;
      border-radius: 2px;
    }
  }
  .imges-box {
    width: 100%;
    height: 210px;
    background: #f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wcde-bottom {
    position: fixed;
    bottom: 0px;
    left: 0;
    background: #fff;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0px -2px 3px 0px rgba(0, 0, 0, 0.1);
    .wcde-nav {
      img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(85, 89, 89, 1);
      line-height: 16px;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .wcde-btn {
      flex: 1;
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      text-align: center;
      background: rgba(23, 131, 87, 1);
      border-radius: 2px;
    }
  }
}
</style>
