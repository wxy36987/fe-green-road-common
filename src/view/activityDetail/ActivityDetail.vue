<template>
  <div class="activity-details">
    <loading v-if="loading && isWechatApplet"></loading>
    <div v-show="!loading">
      <div class="header-img">
        <div class="img-banner">
          <van-swipe
            :autoplay="3000"
            @change="onChange"
            indicator-color="white"
            v-if="images.length > 0"
          >
            <van-swipe-item
              v-for="(image, index) in images"
              :key="index"
              style="height=210px"
            >
              <img v-lazy="image.imageUrl" />
            </van-swipe-item>
          </van-swipe>
          <div class="collect-shadow"></div>
          <div class="collect" v-if="!WxShow">
            <van-image
              :src="collectIconN"
              width="30px"
              height="30px"
              v-show="!collectionShow"
              @click="AddCollection()"
            ></van-image>
            <van-image
              :src="collectIconT"
              width="30px"
              height="30px"
              v-show="collectionShow"
              @click="CancelCollection()"
            ></van-image>
          </div>
          <div class="collect" v-if="WxShow">
            <van-image
              :src="collectIconN"
              width="30px"
              height="30px"
              v-if="!collectionShow"
              @click="AddCollectionWx()"
            ></van-image>
            <van-image
              :src="collectIconT"
              width="30px"
              height="30px"
              v-if="collectionShow"
              @click="CancelCollectionWx()"
            ></van-image>
          </div>
        </div>
      </div>
      <div class="title" v-if="!WxShow" ref="headbaractivity">
        <van-nav-bar fixed class="navbar" v-if="isTop">
          <van-icon :name="backWhite" slot="left" @click="Back()" size="20px" />
          <van-icon
            :name="moreWhite"
            slot="right"
            @click="Share()"
            size="20px"
          />
        </van-nav-bar>
        <van-nav-bar fixed class="navbar whiteNavbar" :title="name" v-else>
          <van-icon :name="backBlack" slot="left" @click="Back()" size="20px" />
          <van-icon
            :name="moreBlack"
            slot="right"
            @click="Share()"
            size="20px"
          />
        </van-nav-bar>
      </div>
      <div class="site">
        <h3>{{ name }}</h3>
        <p>
          <span v-for="(item, index) in tagArr" :key="index">{{ item }}</span>
        </p>
      </div>
      <div
        class="liveView"
        v-if="isHaveLive & !isInWx"
        v-bind:style="{
          backgroundImage: 'url(' + liveImageUrl + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }"
      >
        <img :src="shadowImage" alt="" class="shadow" />

        <div class="liveTime">
          {{ liveStartTime | dateFrm("MM月DD日 HH:mm") }}
        </div>
        <div class="liveTitle" @click="gotoLiveVC">
          <p>{{ liveTitle }}</p>
          <p class="watchPersonNumber">{{ liveSubscribeNum }}</p>
          <img :src="liveWhiteArrow" class="liveArrow" />
        </div>
        <div class="liveMessage">{{ liveBrief }}</div>
      </div>

      <div class="time">
        <p>活动主办：{{ sponsor }}</p>
        <p class="addressView" @click="gotoActivityAddress">
          活动地点：<span>{{ address }}</span>
          <img :src="arrowImage" class="arrowImageView" />
        </p>
        <p>
          <span v-if="isResident == 0"
            >活动时间：{{ activityStartTime | dateFrm("MM月DD日HH:mm") }} -
            {{ activityEndTime | dateFrm("MM月DD日HH:mm") }}</span
          >
          <span v-if="isResident == 1">活动时间：常驻活动</span>
        </p>
        <p v-if="isEnroll == '1'">
          <span v-if="isResident == 0">
            报名时间：{{ enrollStartTime | dateFrm("MM月DD日HH:mm") }} -
            {{ enrollEndTime | dateFrm("MM月DD日HH:mm") }}
          </span>
          <span v-if="isResident == 1">报名时间：常驻活动</span>
        </p>
        <!-- 常驻活动 -->
        <p v-if="scenicName !== null && scenicName !== ''">
          开展景区：{{ scenicName }}
        </p>
        <p v-if="isEnroll == '1'">上限人数：{{ enrollLimit }}</p>
      </div>
      <div class="site">
        <h4>活动简介</h4>
        <p v-html="brief"></p>
      </div>
      <div class="site" :style="paddin_bottom">
        <h4>活动内容</h4>
        <div v-html="content" class="step" id="activityContent"></div>
      </div>
      <div class="footer">
        <!-----演艺活动------>
        <div v-if="type == '1'">
          <div class="btn h-color" v-if="activity_status == '已结束'">
            <van-button color="rgba(241,241,241,1)">活动已结束</van-button>
          </div>
          <div class="btn" v-if="activity_status !== '已结束'">
            <van-button color="rgba(24,131,87,1)" @click="buyTicket()">
              购买门票
            </van-button>
          </div>
        </div>
        <!-----演艺活动------>
        <!-----文创活动------>
        <div
          class="btn-box"
          v-if="type == 2 && isEnroll == 1 && activity_status == '报名中'"
        >
          <div class="btn l-color">
            <van-button
              :style="{
                'background-color': bottomButtonBGColor,
                color: bottomButtonColor,
              }"
              @click="Enroll()"
            >
              {{ bottomButtonTitle }}
            </van-button>
          </div>
        </div>
        <!-----文创活动------>
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
import Vue from "vue";
import Vant, { Lazyload } from "vant";
import empty from "@/components/empty.vue";
Vue.use(Lazyload);
Vue.use(Vant);
import Loading from "@/components/loading";
export default {
  data() {
    return {
      WxShow: true,
      collectionShow: false,
      img: require("../../assets/iconImage/person_bg.png"),
      id: this.$route.query.id,
      name: "", //活动名称
      images: [],
      current: 0,
      tagArr: [],
      sponsor: "", //主办方
      address: "", //活动地点
      activityStartTime: "", //活动开始时间
      activityEndTime: "", //活动结束时间
      scenicName: "", //开展景区
      brief: "", //活动简介
      content: "",
      isEnroll: "", //是否需要报名
      type: "", //活动类型
      activity_status: "", //活动状态
      userIsEnroll: "", //用户是否已报名
      tag: "", //标签
      enrollStartTime: "",
      enrollEndTime: "",
      uid: this.uid || null,
      enrollLimit: "",
      replyCount: "",
      buyTicketAddress: "",
      lastNum: 0,
      loginShow: true, // true
      shareImgUrl: "",
      WxUid: "",
      collectIconN: require("../../assets/iconImage/ic_collection_nor@3x.png"),
      collectIconT: require("../../assets/iconImage/ic_collection@3x.png"),
      session_id: this.$route.query.session_id,
      arrowImage: require("../../assets/iconImage/arrow_lightgray.png"),
      liveWhiteArrow: require("../../assets/iconImage/arrow_white.png"),
      shadowImage: require("../../assets/iconImage/black_shadow.png"),
      //跳转地址相关
      latitude: "",
      longitude: "",
      addressLatitude: "",
      addressLongitude: "",
      /*直播相关*/
      liveID: "", //直播id
      liveImageUrl: "", //直播背景图片
      liveTitle: "", //直播状态
      liveStartTime: "", //直播开始时间
      liveSubscribeNum: "", //直播预约人数
      liveBrief: "", //直播描述
      isHaveLive: false, //是否有直播
      pushName: "", //直播状态码
      wxDebugData: {},
      isInWx: false, //是否在微信里面，在微信和公众号则不显示关联直播
      bottomButtonTitle: "",
      bottomButtonColor: "",
      bottomButtonBGColor: "",
      butottonDisabled: false,
      changeColor: "white",
      isResident: 0, //是否为常驻活动
      loading: true,
      isTouchCollect: false,
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      isShareWeb: this.$route.query.isShareWeb,
      paddin_bottom: "padding-bottom:20px",
      navTitle: false,
      isWechatApplet: false,
      isTop: true,
      backWhite: require("../../assets/iconImage/arrow_left_white.png"),
      backBlack: require("../../assets/iconImage/ic_back@2x.png"),
      moreWhite: require("../../assets/iconImage/icon_more_white.png"),
      moreBlack: require("../../assets/iconImage/icon_more_black.png"),
      emptyTop: "46px",
      greenwayType: "activityEvent",
    };
  },
  components: {
    Loading,
    empty,
  },
  created() {
    this.loading = true;
    this.isChangeColor = false;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWechatApplet = true;
      this.WxShow = true;
      document.title = "活动详情";
      this.isInWx = true;
      var dataParams = {
        wxa_session_id: this.session_id,
      };
      this.getWxDebugData();
      this.$http
        .post(`/appserver/v1/user/get_auth_data`, qs.stringify(dataParams))
        .then((data) => {
          // console.log(data);
          if (data.data.ret === 0) {
            this.WxUid = data.data.data;
            // eslint-disable-next-line
            console.log(this.WxUid, "WxUid");
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    } else {
      this.WxShow = false;
      document.title = "活动详情";
      window.wii.app.invoke("showNativeBar", false);
      var title = this.$route.query.title;
      if (title != null) {
        window.wii.app.invoke("setTitle", title);
      }
    }
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
    });
  },
  mounted() {
    if (!this.isWechatApplet) {
      this.showLoading(this.loading);
    }
    this.getDetail();
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
    // 分享
    Share() {
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.name,
          summary: this.brief,
          pic: this.shareImgUrl,
          // link: `${this.domain}activityDetailShare?id=${this.$route.query.id}`,
          link: `${this.domain}activityDetail?id=${this.$route.query.id}&session_id=&uid=&from=web&isShareWeb=true`,
          isMiniProgram: true,
          miniProgramId: "gh_e72fb9e614d4",
          miniProgramPath: `/etcPackages/pages/h5-view?src=${encodeURIComponent(
            window.location.href
          )}&shareTitle=${encodeURIComponent(
            this.name
          )}&shareImg=${encodeURIComponent(this.shareImgUrl)}`,
        },
        collect: {
          isShow: false,
          isCollect: true,
          type: "tips",
          articleId: "",
        },
      });
    },
    // 返回活动列表
    Back() {
      // eslint-disable-next-line
      console.log(this.WxUid, "Back()  WxUid");
      var urlWX = `${this.domain}activityEvent?id=${this.$route.query.id}&uid=${this.WxUid.uid}&nameNick=${this.WxUid.nickname}&phone=${this.WxUid.mobile}&sex=${this.$route.query.sex}`;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
            urlWX
          )}`,
        });
      } else {
        if (this.$route.query.from) {
          this.$router.go(-1);
        } else {
          window.wii.app.invoke("closeWindow");
        }
        // window.wii.app.invoke('closeWindow');
      }
    },
    buyTicket() {
      //this.buyTicketAddress = "https://www.baidu.com"
      if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(this.buyTicketAddress)) {
        this.$toast("门票购买地址有误!");
        return false;
      } else {
        window.location.href = this.buyTicketAddress;
      }
    },
    // 立即报名
    Enroll() {
      if (this.butottonDisabled) {
        // alert('点了')
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
          if (
            this.session_id === "" ||
            this.session_id === undefined ||
            this.session_id === null
          ) {
            // eslint-disable-next-line
            wx.miniProgram.navigateTo({
              url: `/pages/index/login`,
            });
          } else {
            // eslint-disable-next-line
            console.log(this.session_id);
            var dataParams = {
              wxa_session_id: this.session_id,
            };
            this.$http
              .post(
                `/appserver/v1/user/get_auth_data`,
                qs.stringify(dataParams)
              )
              .then((data) => {
                // eslint-disable-next-line
                console.log(data);
                if (data.data.ret === 0) {
                  var _data = data.data.data;
                  var urlWX = `${this.domain}enroll?id=${this.$route.query.id}&sex=${this.$route.query.sex}&uid=${_data.uid}&session_id=${this.session_id}&name=${this.name}`;
                  // eslint-disable-next-line
                  wx.miniProgram.navigateTo({
                    url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
                      urlWX
                    )}`,
                  });
                } else {
                  this.$toast(data.data.msg);
                }
              })
              .catch((error) => {
                this.$toast("网络异常,检查网络再试试~~");
              });
          }
        } else {
          if (this.uid) {
            this.$router.push({
              path: "/enroll",
              query: {
                id: this.$route.query.id,
                name: this.name,
              },
            });
            // window.wii.app.invoke('openWindow', {
            // 	openUrl: `${this.domain}enroll?id=${this.$route.query.id}&name=${this.name}`,
            // 	isFullScreen: 0,
            // 	setTitle: '活动赛事',
            // 	needLoading: 0
            // });
          } else {
            window.wii.app.invoke("login", {
              callback: "",
            });
          }
        }
      }
    },
    onChange(index) {
      this.current = index;
    },
    getDetail() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.uid = this.$route.query.uid;
      } else {
        this.uid = this.uid;
      }
      var data = {
        id: this.id,
        userId: this.uid,
      };
      this.$http
        .post(`/appserver/v1/activity/detail`, qs.stringify(data), {
          headers: {
            wxa_session_id: this.session_id,
          },
        })
        .then((data) => {
          this.loading = false;
          if (data.data.ret === 0) {
            if (data.data.data.online_status !== 1) {
              this.showLoading(this.loading);
              this.toastTitle = "糟糕,数据找不到了";
              this.emptyTop = this.$refs.headbaractivity.offsetHeight + "px";
              this.emptyShow = true;
              return;
            }
            this.name = data.data.data.name;
            this.images = data.data.data.galleryVos;
            this.shareImgUrl = this.images[0].imageUrl;
            this.sponsor = data.data.data.sponsor;
            this.address = data.data.data.address;
            this.activityStartTime = data.data.data.activityStartTime;
            this.activityEndTime = data.data.data.activityEndTime;
            this.brief = data.data.data.brief;
            this.content = data.data.data.content;
            this.isEnroll = data.data.data.isEnroll;
            this.type = data.data.data.type;
            if (data.data.data.collect) {
              this.collectionShow = true;
            } else {
              this.collectionShow = false;
            }
            this.activity_status = data.data.data.activity_status;
            this.userIsEnroll = data.data.data.userIsEnroll;
            this.tag = data.data.data.tag;
            this.enrollStartTime = data.data.data.enrollStartTime;
            this.enrollEndTime = data.data.data.enrollEndTime;
            this.replyCount = data.data.data.replyCount;
            this.enrollLimit = data.data.data.enrollLimit
              ? data.data.data.enrollLimit
              : "无上限";
            if (data.data.data.tag !== "") {
              this.tagArr = data.data.data.tag.split(",");
            }
            if (data.data.data.type == "2" && data.data.data.isEnroll == "1") {
              this.lastNum =
                data.data.data.enrollLimit - data.data.data.replyCount;
            }
            if (data.data.data.type == "1") {
              this.buyTicketAddress = data.data.data.buyTicketAddress;
            }
            this.scenicName = data.data.data.scenicName;
            this.addressLatitude = data.data.data.latitude;
            this.addressLongitude = data.data.data.longitude;
            this.isHaveLive = data.data.data.activityLive ? true : false;
            this.isResident = data.data.data.isResident;
            if (this.isHaveLive === true) {
              this.liveID = data.data.data.activityLive.liveId;
              this.liveImageUrl = data.data.data.activityLive.imageUrl;
              // this.liveTitle = data.data.data.activityLive.liveTitle;
              this.liveStartTime = data.data.data.activityLive.startTime;
              this.liveSubscribeNum =
                data.data.data.activityLive.audience == null
                  ? 0
                  : data.data.data.activityLive.audience;
              this.liveBrief = data.data.data.activityLive.brief;
              this.pushName = data.data.data.activityLive.pushName;
              if (this.pushName === "预告") {
                this.liveTitle = "直播预告";
                if (this.liveSubscribeNum == 0) {
                  this.liveSubscribeNum = "立即预约";
                } else {
                  this.liveSubscribeNum = this.liveSubscribeNum + "人已预约";
                }
              } else if (this.pushName === "直播中") {
                this.liveTitle = "正在直播";
                if (this.liveSubscribeNum == 0) {
                  this.liveSubscribeNum = "立即观看";
                } else {
                  this.liveSubscribeNum = this.liveSubscribeNum + "人正在观看";
                }
              } else {
                this.liveTitle = "直播回放";
                if (this.liveSubscribeNum == 0) {
                  this.liveSubscribeNum = "立即围观";
                } else {
                  this.liveSubscribeNum = this.liveSubscribeNum + "人已观看";
                }
              }
            }
            if (this.userIsEnroll == 1) {
              this.bottomButtonTitle = "已报名";
              this.bottomButtonBGColor = "#F1F1F1";
              this.bottomButtonColor = "#248960";
            } else if (this.userIsEnroll == 2 || this.userIsEnroll == null) {
              this.userIsEnroll == 2;
              this.butottonDisabled = true;
              this.bottomButtonTitle = "立即报名";
              this.bottomButtonBGColor = "#188357";
              this.bottomButtonColor = "#F1F1F1";
            } else if (this.userIsEnroll == 3) {
              this.bottomButtonTitle = "报名已截止";
              this.bottomButtonBGColor = "#F1F1F1";
              this.bottomButtonColor = "#999999";
            }
            if (
              this.type == 2 &&
              this.isEnroll == 1 &&
              this.activity_status == "报名中"
            ) {
              this.paddin_bottom = "padding-bottom:90px";
            } else if (this.type == "1") {
              this.paddin_bottom = "padding-bottom:90px";
            }
            if (!this.isWechatApplet) {
              this.showLoading(this.loading);
            }
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.toastTitle = "网络异常,请检查网络再试~~";
          this.emptyTop = this.$refs.headbaractivity.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    /* eslint-disable */
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
        title: this.name,
        label: this.tag,
      };
      var dataParams = {
        srcType: "activity",
        srcId: this.$route.query.id,
        data: JSON.stringify(data),
      };
      this.isTouchCollect = true;
      this.$http
        .post(`/appserver/v1/collect/save`, qs.stringify(dataParams))
        .then((data) => {
          setTimeout(() => {
            this.isTouchCollect = false;
          }, 3000);
          if (data.data.ret === 0) {
            this.collectionShow = true;
            this.$toast("收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = false;
              this.$toast("请登录");
              window.wii.app.invoke("login", {
                callback: "",
              });
            } else {
              this.$toast(data.data.msg);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },

    // 取消收藏
    CancelCollection() {
      var params = {
        srcType: "activity",
        srcId: this.$route.query.id,
      };
      if (this.isTouchCollect == true) {
        return;
      }
      this.isTouchCollect = true;
      this.$http
        .post(`/appserver/v1/collect/cancel`, qs.stringify(params))
        .then((data) => {
          setTimeout(() => {
            this.isTouchCollect = false;
          }, 3000);
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = true;
              this.$toast("请登录");
              window.wii.app.invoke("login", {
                callback: "",
              });
            } else {
              // this.$toast(data.data.msg);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // wx添加收藏
    AddCollectionWx() {
      // eslint-disable-next-line
      console.log(this.session_id, "添加收藏");
      if (this.isTouchCollect == true) {
        return;
      }
      this.isTouchCollect = true;
      if (
        this.session_id === "" ||
        this.session_id === undefined ||
        this.session_id === null
      ) {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/pages/index/login`,
        });
      } else {
        var data = {
          imageUrl: this.images[0].imageUrl,
          intro: this.brief,
          title: this.name,
          label: this.tag,
        };
        var dataParams = {
          srcType: "activity",
          srcId: this.$route.query.id,
          data: JSON.stringify(data),
        };
        this.$http
          .post(`/appserver/v1/collect/save`, qs.stringify(dataParams), {
            headers: {
              wxa_session_id: this.session_id,
            },
          })
          .then((data) => {
            // eslint-disable-next-line
            setTimeout(() => {
              this.isTouchCollect = false;
            }, 3000);
            console.log(data);
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
      }
    },

    // wx取消收藏
    CancelCollectionWx() {
      if (this.isTouchCollect == true) {
        return;
      }
      this.isTouchCollect = true;
      if (
        this.session_id === "" &&
        this.session_id === undefined &&
        this.session_id === null
      ) {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/pages/index/login`,
        });
      } else {
        var params = {
          srcType: "activity",
          srcId: this.$route.query.id,
        };
        this.$http
          .post(`/appserver/v1/collect/cancel`, qs.stringify(params), {
            headers: {
              wxa_session_id: this.session_id,
            },
          })
          .then((data) => {
            setTimeout(() => {
              this.isTouchCollect = false;
            }, 3000);
            if (data.data.ret === 0) {
              this.collectionShow = false;
              this.$toast("取消收藏成功");
            } else {
              this.$toast(data.data.msg);
            }
          })
          .catch((error) => {
            this.$toast("网络异常,检查网络再试试~~");
          });
      }
    },
    // 跳转活动地点导航页
    gotoActivityAddress() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.openLocation();
      } else {
        // eslint-disable-next-line
        window.wii.app.invoke(
          "naviRoute",
          `greenway://map_navi?name=${this.name}&address=${this.address}&lat=${this.addressLatitude}&lng=${this.addressLongitude}&type=${this.greenwayType}`
        );
      }
    },
    /* eslint-disable */
    openLocation() {
      wx.config({
        debug: this.wxDebugData.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: this.wxDebugData.appId, // 必填，公众号的唯一标识
        timestamp: this.wxDebugData.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.wxDebugData.nonceStr, // 必填，生成签名的随机串
        signature: this.wxDebugData.signature, // 必填，签名
        jsApiList: ["openLocation", "getLocation"], // 必填，需要使用的JS接口列表
      });
      var that = this;
      wx.ready(() => {
        wx.openLocation({
          latitude: Number(that.addressLatitude),
          longitude: Number(that.addressLongitude),
          name: that.name,
          address: that.address,
          scale: 20,
          infoUrl: "",
        });
      });

      // eslint-disable-next-line
    },
    gotoLiveVC() {
      window.wii.app.invoke(
        "naviRoute",
        `greenway://live_detail?id=${this.liveID}`
      );
    },
    // 获取用户位置经纬度
    getWxDebugData() {
      this.$http
        .post(
          `/appserver/v1/user/get_jsapi_config?url=${encodeURIComponent(
            location.href.split("#")[0]
          )}&jsapi=${this.$cookie.get("w_skey")}`
        )
        .then((data) => {
          this.wxDebugData = JSON.parse(data.data.data.jsapi_config);
          wx.config({
            debug: this.wxDebugData.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.wxDebugData.appId, // 必填，公众号的唯一标识
            timestamp: this.wxDebugData.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.wxDebugData.nonceStr, // 必填，生成签名的随机串
            signature: this.wxDebugData.signature, // 必填，签名
            jsApiList: ["openLocation", "getLocation"], // 必填，需要使用的JS接口列表
          });

          wx.ready(function() {});
          wx.error(function(res) {
            console.log(res);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        });
    },
  },
};
</script>
<style lang="scss">
.van-nav-bar__left {
  left: 14px;
  // padding-left: 0px !important;
}
#activityContent {
  width: 100%;
  p {
    font-size: 15px;
    line-height: 25px;
  }
  strong {
    font-weight: bold;
    // font-size: 16px;
  }
  h1 {
    font-size: 32px;
    font-weight: bold;
    line-height: 42px;
  }
  h2 {
    font-size: 27px;
    font-weight: bold;
    line-height: 37px;
  }
  h3 {
    font-size: 19px;
    font-weight: bold;
    line-height: 29px;
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
  }
  h5 {
    font-size: 13px;
    font-weight: bold;
    line-height: 23px;
  }
  h6 {
    font-size: 12px;
    font-weight: bold;
    line-height: 22px;
  }
  img {
    margin-top: 8px;
    width: 100%;
    height: auto;
    border-radius: 2px;
  }
}
</style>
<style lang="scss" scoped>
.site p img {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.activity-details {
  /deep/ .van-loading {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .title {
    /*margin: 0 10px;*/
    z-index: 500;
    /*top: 10px;*/
    position: fixed;
    width: 100%;
    height: 50px;
    top: 0;
    margin: 0 auto;
    /deep/ .van-nav-bar .van-icon {
      color: #fff;
      font-weight: 700;
      font-size: 22px;
    }
    /deep/ .van-nav-bar {
      background: linear-gradient(rgba(0, 0, 0, 0));
      color: white;
    }
    /deep/ [class*="van-hairline"]::after {
      border: 0px;
    }
    .whiteNavbar {
      background: white;
      z-index: 500;
    }
  }

  .header-img {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 36px;
    /deep/ .van-image {
      width: 100%;
      height: 100%;
      top: -46px;
    }
    /deep/ .van-swipe__indicator {
      width: 10px;
      height: 4px;
      border-radius: 0px;
      background: #dfdfdf;
    }
    /deep/ .van-swipe__indicator--active {
      background: #37384d;
    }
    /deep/ .van-swipe__indicators {
      bottom: 30px;
      z-index: 1200;
    }
    .collect-shadow {
      position: absolute;
      right: 30px;
      bottom: -20px;
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
      bottom: -20px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-image {
        position: static;
      }
    }
  }
  .site {
    padding: 0px 20px;
    margin-bottom: 19px;
    color: #555959;
    font-size: 15px;
    width: 100%;
    box-sizing: border-box;
    & > h3 {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 34px;
      margin-bottom: 12px;
    }
    & > h4 {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFangSC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 26px;
      margin-bottom: 15px;
    }
    .step {
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(55, 56, 77, 1);
      line-height: 22px;
    }
    & > p {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      color: #555959;
      line-height: 25px;
      font-size: 15px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(85, 89, 89, 1);
      border-bottom: 1px solid #f8f8f8;
      & > span {
        margin-bottom: 10px;
        padding: 7px 10px;
        display: inline-block;
        background: #f6f6f6;
        border-radius: 2px;
        margin-right: 8px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: #555959;
        line-height: 11px;
        margin-right: 12px;
      }
    }
    & > div {
      width: 100%;
      // height: 120px;
      margin-top: 19px;
      /deep/ .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .step {
      p {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        line-height: 16px;
      }
      h3 {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #37384d;
        line-height: 22px;
        margin-top: 7px;
      }
      .img {
        margin: 10px 0 20px 0;
        width: 297px;
        // height: 160px;
      }
    }
  }
  .liveView {
    height: 150px;
    // position: absolute;
    margin: 10px 20px;
    // right: 20px;
    // top: 10px;
    // bottom: 10px;
    // padding-left: 17px;

    padding-top: 15px;
    border-radius: 2px;
    .shadow {
      position: relative;
      width: 100%;
      height: 131px;
      top: 19px;
      left: 0px;
    }
    .liveTime {
      position: relative;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 13px;
      left: 17px;
      top: -57px;
    }
    .liveTitle {
      position: relative;
      left: 17px;
      top: -140px;
      margin-top: 90px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      align-items: center;
      display: flex;
      .watchPersonNumber {
        position: relative;
        top: 0px;
        height: 12px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 12px;
        margin-right: 5px;
        margin-left: 10px;
        bottom: 0px;
      }
      .liveWhiteArrow {
        width: 7px;
        height: 11px;
        bottom: 0px;
      }
    }
    .liveMessage {
      position: relative;
      top: -140px;
      left: 17px;
      margin-top: 7px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 13px;
    }
  }
  .time {
    margin: 20px;
    // padding-top: 29px;
    margin-bottom: 35px;
    // margin-top: 10px;
    color: #37384d;
    font-size: 16px;
    line-height: 30px;
    // border-top: 2px solid #f6f6f6;
    p {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 16px;
      margin-bottom: 16px;
    }
  }
  .footer {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    bottom: 0px;
    padding: 10px 20px 15px 20px;
    .btn {
      /deep/ .van-button:active::before {
        opacity: 0;
      }
      /deep/ .van-button {
        width: 100%;
        height: 40px;
        border: 0px;
        opacity: 0.95;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }

      .haslimit {
        .numlimit {
          font-size: 14px;
          color: red;
        }
        /deep/.van-button__text {
          color: #333333b3;
        }
      }
    }
    .h-color {
      /deep/ .van-button span {
        color: #999;
      }
    }
    // .l-color {
    // 	/deep/ .van-button span {
    // 		// color: #248960;
    // 	}
    // }
  }

  .img-banner {
    img {
      width: 100%;
      height: 210px;
    }
  }

  .addressView {
    display: flex;
    span {
      display: inline-block;
      width: 65%;
    }
    .arrowImageView {
      float: right;
      height: 20px;
      width: 20px;
      right: 0;
      margin-left: 20px;
    }
  }
}
</style>
