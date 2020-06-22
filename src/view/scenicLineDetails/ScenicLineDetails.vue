<template>
  <div class="line-details">
    <!-- <loading v-if="loading"></loading> -->
    <!-- <van-loading size="24px" v-if="loading">加载中...</van-loading> -->
    <!-- <div v-if="!loading"> -->
    <div>
      <div class="header-img">
        <div class="title" ref="headbarlinedetail">
          <van-nav-bar fixed class="navbar" v-if="isTop">
            <van-icon
              :name="backWhite"
              slot="left"
              @click="Back()"
              size="20px"
            />
            <van-icon
              :name="moreWhite"
              slot="right"
              @click="Share()"
              size="20px"
            />
          </van-nav-bar>
          <van-nav-bar
            fixed
            class="navbar whiteNavbar"
            :title="data.title"
            v-else
          >
            <van-icon
              :name="backBlack"
              slot="left"
              @click="Back()"
              size="20px"
            />
            <van-icon
              :name="moreBlack"
              slot="right"
              @click="Share()"
              size="20px"
            />
          </van-nav-bar>
        </div>
        <div class="img-banner">
          <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(item, index) in images" :key="index">
              <div>
                <van-image :src="item.imageUrl" fit="cover"></van-image>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="collect-shadow"></div>
        <div class="collect">
          <van-image
            :src="collectIconN"
            width="30px"
            height="30px"
            v-if="!collectionShow"
            @click="AddCollection()"
          ></van-image>
          <van-image
            :src="collectIconT"
            width="30px"
            height="30px"
            v-if="collectionShow"
            @click="CancelCollection()"
          ></van-image>
        </div>
      </div>
      <div class="wrap">
        <div class="content-box">
          <h2>{{ title }}</h2>
          <div class="label">
            <p v-for="(item, index) in tags" :key="index">{{ item }}</p>
          </div>
        </div>
        <div class="travel-summary">
          <h3>行程概括</h3>
          <p>{{ brief }}</p>
          <div class="map" v-if="scheduleImage">
            <van-image
              width="100%"
              height="120px"
              :src="scheduleImage"
              @click="LookLine"
            ></van-image>
            <div class="details" @click="LookLine">查看线路地图</div>
          </div>
          <p v-if="mileage">线路总长度：{{ mileage }}公里</p>
          <p v-if="viewingHours">推荐出行时间：{{ viewingHours }}</p>
          <p v-if="recommendReason">推荐理由：{{ recommendReason }}</p>
        </div>
        <!-- 行程安排 -->
        <div class="scheduling" v-if="tripData.length !== 0">
          <h3>行程安排</h3>
          <div>
            <div class="sign">
              <i></i>
              <p>出发</p>
            </div>
            <div class="box">
              <div class="access">
                <van-image :src="accessImg"></van-image>
                <span>入口：{{ entranceWay }}</span>
              </div>
              <div class="access" v-if="travelType">
                <van-image :src="tripImg"></van-image>
                <span>出行方式：{{ travelType }}</span>
              </div>
            </div>
            <div class="site" v-for="(item, index) in tripData" :key="index">
              <div class="sign">
                <i></i>
                <p>
                  第{{ SectionToChinese(index + 1) }}站：{{ item.targetName }}
                </p>
                <span @click="ScenicDetails(item.targetId)">查看详情</span>
              </div>
              <div class="box">
                <van-image :src="item.image"></van-image>
                <p v-if="item.address">地址：{{ item.address }}</p>
                <p v-if="item.playType">旅行方式：{{ item.playType }}</p>
                <p v-if="item.viewHours">建议游玩时间：{{ item.viewHours }}</p>
                <div v-if="item.digest !== null && item.digest !== ''">
                  <expandTextView :content="item.digest"></expandTextView>
                </div>
              </div>
              <div class="sign">
                <i></i>
                <p>{{ item.travelType }}</p>
              </div>
            </div>
            <div class="box">
              <div class="access">
                <van-image :src="accessImg"></van-image>
                <span>出口：{{ exitWay }}</span>
              </div>
            </div>
            <div class="sign">
              <i></i>
              <p>结束</p>
            </div>
          </div>
        </div>
        <!-- 线路出行提醒 -->
        <div class="remind" v-if="travelRemind !== ''">
          <h3>线路出行提醒</h3>
          <div>
            <textarea v-model="travelRemind" readonly></textarea>
          </div>
        </div>
        <div class="recomTitleStyle" v-if="list.length > 0">
          <h>猜你喜欢</h>
          <customListView :arraydata="list" @itemClick="LineDetails" />
        </div>
      </div>
    </div>
    <empty
      ref="emptyView"
      :toastTitle="toastTitle"
      :emptyShow="emptyShow"
      :style="{ top: emptyTop }"
    ></empty>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import empty from "@/components/empty.vue";
// import Loading from "@/components/loading";
import customListView from "@/components/customListView.vue";
import expandTextView from "@/components/expandTextView.vue";
export default {
  data() {
    return {
      loading: true,
      data: "",
      images: [],
      title: "", //"景区线路",
      tags: [], //标签
      brief: "", // 概括
      mileage: "", // 线路长度
      viewingHours: "", // 推荐游玩时间
      recommendReason: "", // 推荐理由
      // 收藏心
      collect: null,
      collectionShow: false,
      scheduleImage: "", // 地图图片
      travelType: "", // 出行方式
      tripData: [],
      // 出入口图片
      entranceWay: "", // 入口
      exitWay: "", // 出口
      accessImg: require("../../assets/iconImage/ic_20_park@3x.png"),
      // 出行方式
      tripImg: require("../../assets/iconImage/ic_20_map@3x.png"),
      shareShow: false,
      travelRemind: "", // 出行提醒
      lineId: "",
      tagsStr: "",
      shareimg: "",
      clickNum: false,
      collectIconN: require("../../assets/iconImage/ic_collection_nor@3x.png"),
      collectIconT: require("../../assets/iconImage/ic_collection@3x.png"),
      isTouchCollect: false,
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      list: [],
      course_id: this.$route.query.id,
      isTop: true,
      backWhite: require("../../assets/iconImage/arrow_left_white.png"),
      backBlack: require("../../assets/iconImage/ic_back@2x.png"),
      moreWhite: require("../../assets/iconImage/icon_more_white.png"),
      moreBlack: require("../../assets/iconImage/icon_more_black.png"),
      emptyTop: "46px",
    };
  },
  components: {
    empty,
    customListView,
    // Loading,
    expandTextView,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '线路详情');
    this.upUserBehavior();
  },
  mounted() {
    this.getData();
    // this.Share();
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
    window.addEventListener("scroll", this.scrollToTop);
  },
  methods: {
    scrollToTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop != 0) {
        this.isTop = false;
      } else {
        this.isTop = true;
      }
    },
    Back() {
      window.wii.app.invoke("closeWindow");
    },
    // 分享
    Share() {
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.data.title,
          summary: this.data.brief,
          pic: this.shareimg,
          link: this.data.shareInfo.url,
          isMiniProgram: true,
          miniProgramId: "gh_e72fb9e614d4",
          miniProgramPath: `/subPackages/pages/line/detail?id=${this.course_id}`,
        },
        collect: {
          isShow: false,
          isCollect: true,
          type: "",
          articleId: "",
        },
      });
    },
    // 原生跳转查看线路详情
    LookLine() {
      // var p = {
      //   f: "route", // 本地函数名
      //   p: { // 函数参数 key:value
      //     url: "greenway://scenic_guide?id=" + this.course_id + "&name=" + this.title
      //   },
      //   c: "" // 回调函数， 没有传""
      // }
      // // eslint-disable-next-line
      // wii.app.invoke('message', p);
      if (this.clickNum === false) {
        this.clickNum = true;
        setTimeout(() => {
          this.clickNum = false;
        }, 500);
        window.wii.app.invoke(
          "naviRoute",
          `greenway://guide_lines?scenic_id=${this.data.affiliation}&line_id=${this.course_id}`
        );
      }
    },
    getData() {
      if (this.isIOSDev()) {
        this.loading = true;
        this.showLoading(this.loading);
      }
      this.$http
        .get(`/appserver/v1/route/detial?id=${this.course_id}`)
        .then((data) => {
          this.loading = false;
          var _data = data.data.data;
          if (_data.online_status !== 1) {
            this.toastTitle = "糟糕,数据找不到了";
            this.emptyTop = this.$refs.headbarlinedetail.offsetHeight + "px";
            this.emptyShow = true;
            return;
          }
          this.data = data.data.data;
          this.images = _data.galleryVos;
          this.shareimg = this.images[0].imageUrl;
          this.lineId = _data.id;
          this.title = _data.title;
          this.entranceWay = _data.entranceWay;
          this.exitWay = _data.exitWay;
          var str = _data.tags;
          this.tagsStr = _data.tags;
          this.tags = str.split(",");
          this.brief = _data.brief; // 行程概括
          this.mileage = _data.mileage;
          this.viewingHours = _data.viewingHours;
          this.recommendReason = _data.recommendReason;
          this.scheduleImage = _data.scheduleImage; // 地图图片
          this.travelType = _data.travelType; // 出行方式
          this.tripData = _data.routeScheduleVos;
          for (var i = 0; i < this.tripData.length; i++) {
            if (
              this.tripData[i].targetName == null ||
              this.tripData[i].targetName == ""
            ) {
              this.tripData = [];
            }
          }
          this.travelRemind = _data.travelRemind; // 出行提醒
          this.collect = _data.collect;
          if (this.collect === 0) {
            this.collectionShow = false;
          } else {
            this.collectionShow = true;
          }
          if (this.data.businessInfoList) {
            for (var item of this.data.businessInfoList) {
              item.tags = item.tags.split(",");
              item.cover_img = item.imageUrl;
              item.name = item.title;
            }
            this.list = this.data.businessInfoList;
          }
          if (this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
        })
        .catch((error) => {
          this.loading = false;
          if (this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
          this.toastTitle = "网络异常,检查网络再试试~~";
          this.emptyTop = this.$refs.headbarlinedetail.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 景点名片
    ScenicDetails(id) {
      if (this.clickNum === false) {
        this.clickNum = true;
        setTimeout(() => {
          this.clickNum = false;
        }, 500);
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.domain}scenicDetails?id=${id}`,
          isFullScreen: "",
          setTitle: "景点名片",
          needLoading: 1,
        });
      }
    },
    SectionToChinese(section) {
      var chnNumChar = [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ];
      var chnNumChar1 = ["", "十", "二十", "三十", "四十", "五十"];
      var a = parseInt(section % 10); // 个位数
      var b = parseInt((section % 100) / 10); // 十位数
      if (b === 0) {
        return chnNumChar[section];
      } else if (a === 0) {
        return chnNumChar1[b];
      } else if (a !== 0 && b !== 0) {
        return chnNumChar1[b] + chnNumChar[a];
      }
    },

    // 添加收藏
    AddCollection() {
      if (this.uid == null) {
        window.wii.app.invoke("login", {
          callback: "",
        });
        return;
      }
      if (this.isTouchCollect == true) {
        return;
      }
      var data = {
        imageUrl: this.images[0].imageUrl,
        intro: this.brief,
        title: this.title,
        label: this.tagsStr,
      };
      var dataParams = {
        srcType: "scenic_route",
        srcId: this.lineId,
        data: JSON.stringify(data),
      };
      this.isTouchCollect = true;
      this.$http
        .post(`/appserver/v1/collect/save`, qs.stringify(dataParams))
        .then((data) => {
          this.isTouchCollect = false;
          if (data.data.ret === 0) {
            this.collectionShow = true;
            this.$toast("收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = false;
              this.$toast("请登录");
              setTimeout(() => {
                window.wii.app.invoke("login", {
                  callback: "",
                });
              }, 2000);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 取消收藏
    CancelCollection() {
      if (this.isTouchCollect == true) {
        return;
      }
      var params = {
        srcType: "scenic_route",
        srcId: this.lineId,
      };
      this.$http
        .post(`/appserver/v1/collect/cancel`, qs.stringify(params))
        .then((data) => {
          this.isTouchCollect = false;
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = true;
              this.$toast("请登录");
              setTimeout(() => {
                window.wii.app.invoke("login", {
                  callback: "",
                });
              }, 2000);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 线路详情
    LineDetails(item) {
      if (this.course_id === item.id) {
        return;
      }
      this.$router.push({
        path: "/scenicLineDetails",
        query: {
          id: item.id,
        },
      });
    },
    upUserBehavior() {
      this.commonLatLong((LatLng) => {
        var action = {};
        action.item_type = "4";
        action.item_id = this.course_id;
        action.action_type = "102";
        action.longitude = LatLng.longitude;
        action.latitude = LatLng.latitude;
        action.uid = this.uid ? this.uid : "";
        this.commonUserBehavior(action);
      });
    },
  },
  watch: {
    //eslint-disable-next-line
    $route: function(to, from) {
      this.course_id = to.query.id;
      this.loading = true;
      this.upUserBehavior();
      this.getData();
    },
  },
};
</script>
<style>
.van-image__error,
.van-image__loading {
  background: white;
  /* //background: #e1f1ea; */
  color: rgba(0, 0, 0, 0);
}
</style>
<style lang="scss" scoped>
.line-details {
  /deep/ .van-loading {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .header-img {
    width: 100%;
    height: 210px;
    position: relative;
    .title {
      position: relative;
      z-index: 500;
      // top: 10px;
      /deep/ .van-nav-bar .van-icon {
        color: #fff;
        font-weight: 500;
        font-size: 24px;
      }
      /deep/ .van-nav-bar {
        background: linear-gradient(
          rgba(0, 0, 0, 0.25),
          rgba(0, 0, 0, 0.18),
          rgba(0, 0, 0, 0)
        );
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
      .whiteNavbar {
        background: white;
        z-index: 500;
      }
    }
    .img-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /deep/ .van-image__error,
      .van-image__loading {
        // background: #e1f1ea;
        background: white;
        color: rgba(0, 0, 0, 0);
      }
      /deep/ .van-swipe {
        width: 100%;
        height: 100%;
      }
      /deep/ .van-image {
        height: 210px;
      }
    }
    .collect-shadow {
      position: absolute;
      right: 30px;
      bottom: -30px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
    }
    .collect {
      position: absolute;
      right: 30px;
      bottom: -30px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-image {
        top: 0px;
      }
    }
  }
  .wrap {
    margin-top: 38px;
    .content-box {
      & > h2 {
        padding: 0 20px;
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        line-height: 26px;
      }
      .label {
        display: flex;
        padding: 19px 0px;
        margin: 0 20px;
        border-bottom: 0.5px solid #eee;
        p {
          background: rgba(246, 246, 246, 1);
          border-radius: 2px;
          font-size: 11px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(85, 89, 89, 1);
          padding: 4px 7px;
          margin-right: 6px;
        }
      }
    }
    .travel-summary {
      padding: 26px 20px 27px 20px;
      border-bottom: 5px solid #f8f8f8;
      & > h3 {
        font-weight: 600;
        font-size: 20px;
        color: #222;
        margin-bottom: 20px;
      }
      & > p {
        font-size: 15px;
        font-family: PingFangSC-Light, PingFangSC;
        font-weight: 300;
        color: rgba(85, 89, 89, 1);
        line-height: 28px;
      }
      .map {
        width: 100%;
        height: 120px;
        margin: 25px 0px;
        position: relative;
        /deep/ .van-image__error,
        /deep/ img {
          object-fit: cover;
          border-radius: 2px;
        }
        .van-image__loading {
          background: white;
          color: rgba(0, 0, 0, 0);
        }
        #container {
          width: 100%;
          height: 100%;
        }
        .details {
          position: absolute;
          right: 8px;
          bottom: 8px;
          background: rgba(24, 131, 87, 1);
          box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.06);
          padding: 8px 9px;
          border-radius: 20px;
          // z-index: 1300;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    // 行程安排
    .scheduling {
      padding: 25px 20px;
      border-bottom: 5px solid #f8f8f8;
      & > h3 {
        font-weight: 600;
        font-size: 20px;
        color: #222;
      }
      & > div {
        margin-top: 30px;
        padding-left: 14px;
        .sign {
          display: flex;
          align-items: center;
          & > i {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #188357;
            border-radius: 50%;
            margin-right: 15px;
          }
          & > p {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFangSC;
            font-weight: 600;
            color: rgba(55, 56, 77, 1);
            width: 230px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          & > span {
            color: #188357;
            display: inline-block;
            font-size: 14px;
            text-align: right;
            margin-left: 12px;
          }
          & > div {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 3px;
            background: #f8f8f8;
            margin-top: 6px;
            padding-left: 15px;
            & > span {
              color: #222;
              font-size: 14px;
              font-weight: 600;
              margin-left: 4px;
            }
            /deep/ .van-image {
              width: 26px;
              height: 26px;
            }
            /deep/ .van-image__error,
            .van-image__loading {
              // background: #e1f1ea;
              background: white;
              color: rgba(0, 0, 0, 0);
            }
          }
        }
        .box {
          margin-left: 3px;
          padding: 20px 0px;
          padding-left: 19px;
          border-left: 1px dotted #979797;
          /deep/ .van-image__error,
          .van-image__loading {
            // background: #e1f1ea;
            background: white;
            color: rgba(0, 0, 0, 0);
          }
          /deep/ .van-image {
            width: 100%;
            height: 167px;
            margin-bottom: 14px;
          }
          /deep/ .van-image__img {
            border-radius: 3px;
          }
          .access {
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 3px;
            background: #f8f8f8;
            margin-top: 6px;
            padding-left: 15px;
            &:nth-of-type(1) {
              margin-top: 0px;
            }
            & > span {
              color: #222;
              font-size: 14px;
              font-weight: 600;
              margin-left: 4px;
            }
            /deep/ .van-image {
              width: 26px;
              height: 26px;
              margin-top: 12px;
            }
          }
          & > p {
            line-height: 28px;
            font-size: 14px;
            font-family: PingFangSC-Light, PingFangSC;
            font-weight: 300;
            color: rgba(55, 56, 77, 1);
          }
        }
      }
    }
    // 线路出行提醒
    .remind {
      padding: 20px 20px 0px 20px;
      padding-bottom: 40px;
      border-bottom: 5px solid #f8f8f8;
      & > h3 {
        font-weight: 600;
        font-size: 20px;
        color: #222;
        margin-bottom: 25px;
      }
      & > p {
        font-size: 15px;
        font-family: PingFangSC-Light, PingFangSC;
        font-weight: 300;
        color: rgba(55, 56, 77, 1);
        line-height: 28px;
      }
      & > div {
        // height: 85px;
        overflow: hidden;
        & > textarea {
          width: 100%;
          line-height: 28px;
          background: #fff;
          border: 0px;
          // height: 90px;
          font-size: 14px;
          // font-family: PingFangSC-Light, PingFang SC;
          // font-weight: 300;
          color: #333;
        }
      }
    }
  }
  .share-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1500;
    .bg-color {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 1600;
      background: rgba(0, 0, 0, 0.3);
      .share {
        width: 100%;
        height: 22%;
        padding: 20px;
        box-sizing: border-box;
        background: #fff;
        position: absolute;
        bottom: 0px;
        left: 0px;
        padding-bottom: 20px;
        z-index: 1700;
        & > div {
          display: flex;
          &:nth-of-type(1) {
            justify-content: space-between;
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFangSC;
            font-weight: 500;
            color: rgba(74, 74, 74, 1);
            & > p:nth-of-type(2) {
              color: rgba(24, 131, 87, 1);
            }
          }
          &:nth-of-type(2) {
            justify-content: space-around;
            margin-top: 30px;
          }
        }
      }
    }
  }
  .recomTitleStyle {
    padding-bottom: 10px;
    margin-left: 20px;
    & > h {
      font-size: 20px;
      font-weight: bold;
      line-height: 3em;
    }
    & > p {
      margin-bottom: 10px;
      font-family: PingFangTC-Medium, PingFangTC;
      font-size: 20px;
      font-weight: 500;
      color: rgba(55, 56, 77, 1);
      margin-top: 10px;
    }
    .customListView {
      overflow: scroll;
      white-space: nowrap;
    }
  }
}
@media screen and (max-width: 360px) {
  .line-details .wrap .scheduling > div .sign > p {
    width: 68%;
  }
}
@media screen and (max-width: 330px) {
  .line-details .wrap .scheduling > div .sign > p {
    width: 65%;
  }
}
@media screen and (max-width: 360px) {
  .line-details .wrap .scheduling > div .sign > span {
    width: 20%;
  }
}
@media screen and (max-width: 330px) {
  .line-details .wrap .scheduling > div .sign > span {
    width: 18%;
  }
}
</style>
