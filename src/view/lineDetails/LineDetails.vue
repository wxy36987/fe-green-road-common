<template>
  <div class="line-details">
    <!-- <loading v-if="loading"></loading> -->
    <!-- <van-loading size="24px" v-if="loading">加载中...</van-loading> -->
    <div>
      <!-- <div v-if="!loading"> -->
      <div class="header-img">
        <div class="title">
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
        <!-- 轮播图 -->
        <div class="img-banner">
          <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(item, index) in banners" :key="index">
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
          <h2>{{ data.title }}</h2>
          <div class="label">
            <p v-for="(item, index) in tags" :key="index">{{ item }}</p>
          </div>
        </div>
        <div class="travel-summary">
          <h3>行程概括</h3>
          <p>{{ data.brief }}</p>
          <div class="map" v-if="scheduleImage">
            <van-image
              width="100%"
              height="120px"
              :src="scheduleImage"
              @click="LookLine"
            ></van-image>
            <div class="details" @click="LookLine">查看线路地图</div>
          </div>
          <p v-if="data.mileage">线路总长度：{{ data.mileage }}公里</p>
          <p v-if="data.viewingHours">推荐出行时间：{{ data.viewingHours }}</p>
          <p v-if="data.recommendReason">
            推荐理由：{{ data.recommendReason }}
          </p>
        </div>
        <!-- 行程安排 -->
        <div class="scheduling" v-if="tripData.length !== 0">
          <h3>行程安排</h3>
          <div>
            <div class="sign">
              <i></i>
              <p>出发</p>
            </div>
            <div class="box" v-if="travelType">
              <div class="access">
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
                <span @click="ScenicCard(item.targetId)">查看详情</span>
              </div>
              <div class="box">
                <van-image :src="item.image"></van-image>
                <p v-if="item.openTime">开园时间：{{ item.openTime }}</p>
                <p v-if="item.address">地址：{{ item.address }}</p>
                <p v-if="item.scenicLv">景区等级：{{ item.scenicLv }}</p>
                <p v-if="item.price">费用说明：{{ item.price }}</p>
                <p v-if="item.viewHours">建议游玩时间：{{ item.viewHours }}</p>
                <p v-if="item.playType">
                  旅行方式：
                  <span>{{ item.playType }}</span>
                </p>
                <div v-if="item.digest !== null && item.digest !== ''">
                  <expandTextView :content="item.digest"></expandTextView>
                </div>
              </div>
              <div class="sign">
                <i></i>
                <p>{{ item.travelType }}</p>
              </div>
            </div>
            <div class="sign">
              <i></i>
              <p>线路结束</p>
            </div>
          </div>
        </div>
        <!-- 线路出行提醒 -->
        <div class="remind" v-if="travelRemind !== ''">
          <h3>线路出行提醒</h3>
          <!-- <p>{{ travelRemind }}</p> -->
          <div>
            <textarea v-model="travelRemind" readonly></textarea>
          </div>
        </div>
        <div class="recomTitleStyle" v-if="list.length > 0">
          <h>猜你喜欢</h>
          <customListView
            :arraydata="list"
            :isVertical="isVertical"
            @itemClick="LineDetails"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
// import Loading from "@/components/loading";
import customListView from "@/components/customListView.vue";
import expandTextView from "@/components/expandTextView.vue";
export default {
  data() {
    return {
      loading: true,
      data: {}, //路线详情数据
      banners: [], //轮播图
      tags: [], //景点标签
      tagsStr: "",
      // 收藏心
      collect: null,
      collectionShow: false,
      scheduleImage: "", // 地图图片
      travelType: "", // 出行方式
      // 出行方式
      tripImg: require("../../assets/iconImage/ic_20_map@2x.png"),
      tripData: [],
      course_id: this.$route.query.course_id,
      travelRemind: "", // 出行提醒
      lineId: "",
      shareimg: "",
      clickNum: false,
      collectIconN: require("../../assets/iconImage/ic_collection_nor@3x.png"),
      collectIconT: require("../../assets/iconImage/ic_collection@3x.png"),
      backWhite: require("../../assets/iconImage/arrow_left_white.png"),
      backBlack: require("../../assets/iconImage/ic_back@2x.png"),
      moreWhite: require("../../assets/iconImage/icon_more_white.png"),
      moreBlack: require("../../assets/iconImage/icon_more_black.png"),
      isTouchCollect: false,
      list: [],
      isVertical: false,
      isTop: true,
    };
  },
  components: {
    customListView,
    // Loading,
    expandTextView,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    this.upUserBehavior();
  },
  mounted() {
    this.getDetailsData();
    window.addEventListener("scroll", this.scrollToTop);
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
  },
  methods: {
    Back() {
      window.wii.app.invoke("closeWindow");
    },
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
    // 分享
    Share() {
      var link = this.data.shareInfo.url;
      // eslint-disable-next-line
      console.log(link);
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.data.shareInfo.title,
          summary: this.data.shareInfo.content,
          pic: this.data.shareInfo.pic,
          link: link,
          isMiniProgram: this.data.shareInfo.isMiniProgram,
          miniProgramId: this.data.shareInfo.miniProgramId,
          miniProgramPath: this.data.shareInfo.miniProgramPath,
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
      if (this.clickNum === false) {
        this.clickNum = true;
        setTimeout(() => {
          this.clickNum = false;
        }, 500);
        var u = navigator.userAgent,
          // eslint-disable-next-line
          app = navigator.appVersion;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          window.wii.app.invoke(
            "naviRoute",
            `greenway://guide_lines?scenic_id=&line_id=${this.course_id}`
          );
        }

        if (isIOS) {
          window.wii.app.invoke(
            "naviRoute",
            `greenway://guide_lines?scenic_id=""&line_id=${this.course_id}`
          );
        }
      }
    },
    //获取路线详情数据
    getDetailsData() {
      this.loading = true;
      if (this.isIOSDev()) {
        this.showLoading(this.loading);
      }
      this.$http
        .get(`/appserver/v1/route/detial?id=${this.course_id}`)
        .then((data) => {
          this.loading = false;
          if (data.data.ret === 0) {
            this.data = data.data.data;
            this.lineId = this.data.id;
            this.banners = this.data.galleryVos;
            this.shareimg = this.banners[0].imageUrl;
            // eslint-disable-next-line
            var str = this.data.tags;
            this.tagsStr = this.data.tags;
            this.tags = str.split(",");
            this.scheduleImage = this.data.scheduleImage; // 地图图片
            this.travelType = this.data.travelType; // 出行方式
            this.tripData = this.data.routeScheduleVos;
            for (var i = 0; i < this.tripData.length; i++) {
              if (
                this.tripData[i].targetName == null ||
                this.tripData[i].targetName == ""
              ) {
                this.tripData = [];
              }
            }
            this.travelRemind = this.data.travelRemind
              ? this.data.travelRemind
              : ""; // 出行提醒

            this.collect = this.data.collect;
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
          } else {
            this.$toast(data.data.msg);
          }
          if (this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
        })
        .catch((error) => {
          if (this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 景区名片
    ScenicCard(id) {
      if (this.clickNum === false) {
        this.clickNum = true;
        setTimeout(() => {
          this.clickNum = false;
        }, 500);
        window.wii.app.invoke("naviRoute", `greenway://scenic_card?id=${id}`);
      }
    },
    // 数字转大写
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
        imageUrl: this.banners[0].imageUrl,
        intro: this.data.brief,
        title: this.data.title,
        label: this.tagsStr,
      };
      var dataParams = {
        srcType: "green_route",
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
      if (this.isTouchCollect) {
        return;
      }
      var params = {
        srcType: "green_route",
        srcId: this.lineId,
      };
      this.isTouchCollect = true;
      this.$http
        .post(`/appserver/v1/collect/cancel`, qs.stringify(params))
        .then((data) => {
          this.isTouchCollect = false;
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消成功");
          } else if (data.data.msg === "未登录") {
            this.collectionShow = true;
            this.$toast("请登录");
            setTimeout(() => {
              window.wii.app.invoke("login", {
                callback: "",
              });
            }, 2000);
          } else {
            this.$toast(data.data.msg);
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
        path: "/lineDetails",
        query: {
          course_id: item.id,
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
      this.course_id = to.query.course_id;
      this.upUserBehavior();
      this.getDetailsData();
    },
  },
};
</script>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
textarea:disabled {
  font-weight: 300;
  color: #333 !important;
}
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
        background: rgba(0, 0, 0, 0);
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
        border-bottom: 2px solid #eeeeee;
        p {
          background: rgba(246, 246, 246, 1);
          border-radius: 2px;
          padding: 4px 7px;
          font-size: 11px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(85, 89, 89, 1);
          line-height: 11px;
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
          // background: #e1f1ea;
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
            font-size: 15px;
            font-family: PingFangSC-Semibold, PingFangSC;
            font-weight: 600;
            color: rgba(55, 56, 77, 1);
            line-height: 15px;
            font-weight: 600;
            width: 71%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          & > span {
            color: #188357;
            font-size: 14px;
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
          }
        }
        .box {
          margin-left: 3px;
          padding: 20px 0px;
          padding-left: 19px;
          border-left: 1px dotted #979797;
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
              font-size: 15px;
              font-family: PingFangSC-Regular, PingFangSC;
              color: rgba(55, 56, 77, 1);
              line-height: 15px;
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
            font-size: 15px;
            font-family: PingFangSC-Light, PingFangSC;
            font-weight: 300;
            color: rgba(34, 34, 34, 1);
            & > span {
              font-size: 15px;
              font-family: PingFangSC-Light, PingFangSC;
              font-weight: 300;
              color: rgba(34, 34, 34, 1);
              line-height: 15px;
            }
          }
        }
      }
      .site {
        margin-bottom: 25px;
        overflow-wrap: break-word;
        & > div {
          & > p {
            overflow-wrap: break-word;
          }
          & > span {
            min-width: 60px;
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
    // 线路出行提醒
    .remind {
      padding: 20px 20px 0px 20px;
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
        overflow: hidden;
        & > textarea {
          width: 100%;
          line-height: 28px;
          background: #fff;
          border: 0px;
          font-size: 14px;
          color: #333;
        }
      }
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
