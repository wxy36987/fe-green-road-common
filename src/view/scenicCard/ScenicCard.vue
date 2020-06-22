<template>
  <div class="business-card" v-cloak>
    <div class="header">
      <!-- <div class="title">
        <van-nav-bar>
          <van-icon name="arrow-left" slot="left" @click="Back()" />
        </van-nav-bar>
      </div> -->
      <van-loading size="24px" v-if="loading">加载中...</van-loading>
      <div v-if="!loading">
        <!-- 视频 -->
        <div class="video">
          <van-swipe :autoplay="0" :loop="false">
            <van-swipe-item>
              <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
              ></video-player>
              <van-image
                :src="waterMarkImage"
                class="water-marker"
                v-if="isWaterMarkImage"
              ></van-image>
            </van-swipe-item>
            <van-swipe-item
              v-for="(item, index) in banner"
              :key="index"
              @click="PicBigBanner(item.src_origin)"
            >
              <van-image
                width="100%"
                height="189px"
                :src="item.src_origin"
              ></van-image>
            </van-swipe-item>
            <van-swipe-item
              v-if="lastBanner"
              @touchstart="TouchStart"
              @touchmove="TouchMove"
              @click="PicBigBanner(lastBanner)"
            >
              <van-image
                width="100%"
                height="189px"
                :src="lastBanner"
              ></van-image>
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="header-location">
          <p>{{ name }}</p>
          <p>
            <span class="level" v-if="data.grade !== ''">{{ data.grade }}</span>
            <span v-for="(item, index) in tags" :key="index">{{ item }}</span>
          </p>
        </div>
      </div>
    </div>

    <div v-show="!loading">
      <div class="time">
        <p v-if="data.business_time !== ''">
          开放时间：{{ data.business_time }}
        </p>
        <p v-if="data.tour_time !== ''">预计游览时间：{{ data.tour_time }}</p>
      </div>
      <div class="psersion-num" v-if="scenic_person_count !== 0">
        <p>实时人数：{{ scenic_person_count }}</p>
        <p @click="gotoHotmap()">热力图景区</p>
        <van-image :src="arrowRight" @click="gotoHotmap()"></van-image>
      </div>

      <!-- 简介 -->
      <div class="synopsis">
        <div class="audio-box">
          <div class="audio">
            <my-audio :src="url" :autoPlay="autoPlay"></my-audio>
          </div>
          <div class="audio-tab" @click="switchShow = true">
            <van-image :src="tabIcon" width="20px" height="20px"></van-image>
            <p>切换主播</p>
          </div>
        </div>
        <div class="map" v-if="mapSrc !== null">
          <van-image :src="mapSrc" width="100%" height="120px"></van-image>
          <div class="details" @click="queryMore">查看更多导览</div>
        </div>
        <!-- 介绍折叠文本 -->
        <arrowview :introduce="introduce"></arrowview>
      </div>
      <!-- 知名景点 -->
      <div class="scenic-spot" v-if="scenicShow">
        <van-cell title="知名景点" :is-link="notedLink" @click="AllScenic()" />
        <div class="scenic-box">
          <div class="select-person">
            <div class="person-wrap" ref="scenicWrap">
              <ul class="person-list" ref="scenicTab">
                <li
                  class="person-item"
                  v-for="(item, index) in scenicListData"
                  :key="index"
                  @click="ScenicDetails(item)"
                >
                  <van-image
                    width="160px"
                    height="101px"
                    fit="fill"
                    :src="item.cover_img"
                    class="van-img"
                  />
                  <div class="van-div">
                    <p>{{ item.name }}</p>
                    <p v-if="item.distance !== ''">距离{{ item.distance }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 攻略 -->
      <div class="play-strategy" v-if="strategyShow">
        <van-cell
          :title="strategyTitle"
          :is-link="strategyLink"
          @click="StrategyList()"
        />
        <bannerview :dataList="strategyList" @itemClick="StrategyDetails" />
      </div>
      <!-- 线路 -->
      <div class="play-strategy line" v-if="lineShow">
        <van-cell
          :title="lineTitle"
          :is-link="lineLink"
          @click="LineListTwo()"
        />
        <bannerview :dataList="lineList" @itemClick="ScenicLineDetails" />
      </div>
      <!-- 最佳拍摄位 -->
      <div class="scenic-spot" v-if="bestShow">
        <van-cell
          :title="bastTitle"
          :is-link="bestLink"
          @click="BaseShotList()"
        />
        <div class="scenic-box">
          <div class="select-person">
            <div class="person-wrap" ref="BestLocationWrap">
              <ul class="person-list" ref="BestLocationTab">
                <li
                  class="person-item"
                  v-for="(item, index) in BestLocation"
                  :key="index"
                  @click="BaseShotLists()"
                >
                  <van-image
                    width="160px"
                    height="92px"
                    fit="fill"
                    :src="item.cover_img"
                    class="van-img"
                  />
                  <div class="van-div">
                    <p>{{ item.name }}</p>
                    <p v-if="item.distance !== ''">距离{{ item.distance }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-big" v-if="pic_BigShow" @click="pic_BigShow = false">
      <van-image :src="pic_Big" width="100%"></van-image>
    </div>
    <div class="qiehuan" v-if="switchShow === true">
      <div class="bg" @click="switchShow = false"></div>
      <div class="man-women">
        <div>
          <span>切换主播</span>
          <span @click="switchShow = false">取消</span>
        </div>
        <div>
          <p @click="Men()">男声</p>
          <p @click="WoMen()">女声</p>
        </div>
      </div>
    </div>
    <empty
      ref="emptyView"
      :toastTitle="toastTitle"
      :emptyShow="emptyShow"
    ></empty>
    <openAppDialog
      ref="openApp"
      :isShow="false"
      @openApp="openApp()"
    ></openAppDialog>
  </div>
</template>
<script>
/* eslint-disable */
import BScroll from "better-scroll";
import myAudio from "@/components/myRadio";
// import { videoPlayer } from "vue-video-player";
import empty from "@/components/empty.vue";
import openAppDialog from "@/components/openAppTopDialog.vue";
import arrowview from "@/components/arrowTextView.vue";
import bannerview from "@/components/bannerView.vue";
export default {
  data() {
    return {
      data: "",
      loading: true,
      scenicId: "",
      autoplayTime: 3000,
      banner: [], // banner
      pic_Big: "", // 点击查看图片
      pic_BigShow: false,
      cover_img: "",
      lastBanner: "",
      name: "", // 名称
      tags: [], // 标签
      // ---------------------- 视频
      playerOptions: {
        //        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: {
          type: "video/mp4",
          src: require("../../assets/video/mda-jev77th08erj3udk.mp4"), // 你的视频地址（必填）
        },
        poster: "", // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: "正在加载视频", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
        },
      },
      // ---------------------- 简介
      mapSrc: null, // 地图
      introduce: "",
      tabIcon: require("../../assets/iconImage/ic_20_voicechange@3x.png"), // 音频切换
      switchShow: false,
      womenVoice: "",
      menVoice: "",
      // ---------------------- 音频
      url: "http://mp3.9ku.com/m4a/183203.m4a",
      showCurrentTime: true, //默认true，是否显示当前播放时间
      showControls: false, //默认false，true:展示原生音频播放控制条，false：展示模拟播放控制条
      showVolume: false, //默认true，默认显示音量调节和静音按钮 true显示音量调节和静音按钮
      showDownload: false, //默认true，默认显示下载按钮
      autoPlay: false, //默认false，自动播放有效音频(由于高版本浏览器协议限制，初始化页面时无法自动播放，可以在点击页面后手动触发)
      waitBuffer: true, //默认true，拖拽到未加载的时间，是否需要等待加载，true:滑块位置不动，等待加载音频资源后播放，false：当滑动位置大于当前缓冲的最大位置，则重置到当前最大缓冲位置
      downloadName: "下载音频", //默认“下载音频”，在Chrome和火狐、同域名下，修改下载文件名称，其它保持原文件服务器名称
      hint: "音频正在加载中，请稍等…", //无音频情况下提示文案
      currentAudioId: "", //当前正在播放的audio id
      // 判断用户性别  女---0  男---1
      genderDecide: 1,
      // ---------------------- 知名景点
      scenicListData: [],
      scenicShow: true,
      notedLink: false, // 是否有更多
      // ---------------------- 攻略
      strategyTitle: "", // 攻略标题
      strategyList: [],
      strategyShow: true,
      strategyLink: false,
      // ---------------------- 线路
      lineTitle: "", // 线路标题
      lineList: [],
      lineShow: true,
      lineLink: false,
      // ---------------------- 最佳拍摄位
      bastTitle: "",
      BestLocation: [],
      bestShow: true,
      bestLink: false,
      // 轮播
      swiperOption: {
        slidesPerView: 1.183,
        spaceBetween: 0,
        centeredSlides: true,
      },
      lat: "30.56979",
      lng: "104.05453",
      waterMarkImage: require("../../assets/iconImage/ic_watermark@3x.png"),
      arrowRight: require("../../assets/iconImage/ic-arrow-gray-small-right@2x.png"),
      scenic_person_count: 0,
      isWaterMarkImage: false,
      clickNum: false,
      notAudio: true,
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      isShareWeb: this.$route.query.isShareWeb,
    };
  },
  components: {
    // videoPlayer
    myAudio,
    empty,
    openAppDialog,
    arrowview,
    bannerview,
  },
  created() {
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    //var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.notAudio = false;
    }
    var ua = window.navigator.userAgent.toLowerCase(),
      isWx = ua.match(/MicroMessenger/i) == "micromessenger",
      isQQ = ua.match(/QQ/i) == "qq",
      isWeiBo = ua.match(/WeiBo/i) == "weibo";
    if (isWx || isQQ || isWeiBo) {
      this.getData();
    } else {
      this.commonLatLong((LatLng) => {
        this.lat = LatLng.latitude;
        this.lng = LatLng.longitude;
        this.getData();
      });
    }
  },
  destroyed() {
    // if (this.$refs.videoPlayer.player !== undefined) {
    //   this.$refs.videoPlayer.player.pause();
    // }
    // if (document.getElementById(this.currentAudioId) !== null) {
    //   document.getElementById(this.currentAudioId).pause();
    // }
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
    getData() {
      this.$http
        .get(
          `/appserver/v1/manage/card/detail?type=2&scenic_id=${
            this.$route.query.id
          }`,
          {
            headers: {
              latitude: this.lat, //纬度
              longitude: this.lng, //经度
            },
          }
        )
        .then((data) => {
          this.data = data.data.data;
          if (this.data.online_status !== 1) {
            this.loading = false;
            this.toastTitle = "糟糕,数据找不到了";
            this.emptyShow = true;
            return;
          }
          this.scenicId = this.data.id;
          if (this.data.video) {
            this.playerOptions.sources.src = this.data.video.src; // 视频
            this.playerOptions.poster = this.data.video.cover_img; // 视频封面
          }
          this.banner = this.data.banner_imgs.slice(0, 5); // banner图
          if (this.banner.length >= 5) {
            this.lastBanner = this.banner.pop().src_origin;
          }
          this.name = this.data.name; // 名称
          this.tags = this.data.tags; // 标签
          this.womenVoice = this.data.audio.voiceWoman; // 女
          this.menVoice = this.data.audio.voiceMan; // 男
          if (this.genderDecide === 0) {
            this.url = this.data.audio.voiceWoman; // 女
          } else if (this.genderDecide === 1) {
            this.url = this.data.audio.voiceMan; // 男
          }
          if (this.data.map !== null) {
            if (this.data.map.src !== null) {
              this.mapSrc = this.data.map.src; // 地图
            }
          }
          this.introduce = this.data.brief; // 介绍
          this.scenicListData = this.data.scenic_list.list; // 知名景点;
          if (this.data.scenic_list.is_show === 1) {
            this.notedLink = true;
          } else {
            this.notedLink = false;
          }
          if (this.data.scenic_list.list !== null) {
            if (this.data.scenic_list.list.length !== 0) {
              this.scenicShow = true;
              this.scenicScroll(); // 知名景点
            } else {
              this.scenicShow = false;
            }
          } else {
            this.scenicShow = false;
          }
          this.strategyTitle = this.data.strategy_list.title; // 攻略标题
          this.strategyList = this.data.strategy_list.list; // 攻略列表
          if (this.data.strategy_list.is_show === 1) {
            this.strategyLink = true;
          } else {
            this.strategyLink = false;
          }
          if (this.data.strategy_list.list !== null) {
            if (this.data.strategy_list.list.length !== 0) {
              this.strategyShow = true;
            } else {
              this.strategyShow = false;
            }
          } else {
            this.strategyShow = false;
          }
          this.lineTitle = this.data.route_list.title; // 线路标题
          this.lineList = this.data.route_list.list; // 线路列表
          if (this.data.route_list.is_show === 1) {
            this.lineLink = true;
          } else {
            this.lineLink = false;
          }
          if (this.data.route_list.list !== null) {
            if (this.data.route_list.list.length !== 0) {
              this.lineShow = true;
            } else {
              this.lineShow = false;
            }
          } else {
            this.lineShow = false;
          }
          if (this.data.best_spot) {
            this.bastTitle = this.data.best_spot.title
              ? this.data.best_spot.title
              : ""; // 最佳拍摄位置标题
            this.BestLocation = this.data.best_spot.list
              ? this.data.best_spot.list
              : []; // 最佳拍摄位置
            if (this.data.best_spot.is_show === 1) {
              this.bestLink = true;
            } else {
              this.bestLink = false;
            }
            if (this.data.best_spot.list !== null) {
              if (this.data.best_spot.list.length !== 0) {
                this.bestShow = true;
                this.BestLocationScroll(); // 最佳拍摄位
              } else {
                this.bestShow = false;
              }
            } else {
              this.bestShow = false;
            }
          }
          this.loading = false;
          this.scenic_person_count = this.data.hot_map.scenic_person_count;
        })
        .catch((error) => {
          this.toastTitle = "网络异常,检查网络再试试~~";
          this.emptyShow = true;
        });
    },
    TouchStart(e) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    },
    TouchMove(e) {
      this.moveEndX = e.changedTouches[0].pageX;
      this.moveEndY = e.changedTouches[0].pageY;
      // eslint-disable-next-line
      let X, Y;
      X = this.moveEndX - this.startX;
      Y = this.moveEndY - this.startY;
      if (X < 0) {
        this.$router.push({
          path: "/scenicPicList",
          query: {
            scenic_id: this.scenicId,
          },
        });
      }
    },
    // 点击查看图片
    PicBigBanner(img) {
      this.pic_BigShow = true;
      this.pic_Big = img;
    },
    // 视频播放
    // eslint-disable-next-line
    onPlayerPlay(player) {
      this.autoplayTime = 0;
      document.getElementById(this.currentAudioId).pause();
      this.isWaterMarkImage = true;
    },
    // eslint-disable-next-line
    onPlayerPause(player) {
      this.autoplayTime = 3000;
      this.isWaterMarkImage = false;
    },
    /* eslint-disable */
    change(event) {
      if (event === true) {
        this.$refs.videoPlayer.player.pause();
      }
    },
    timeupdate(event) {
      // console.log("当前播放时间：", event)
    },
    metadata(event) {
      // console.log(event, "音频长度：", event.target.duration)
    },
    //获取正在播放音频currentAudioId，可存全局，用以播放和暂停音频
    audioId(event) {
      console.log(event);
      this.currentAudioId = event;
    },
    // 男生
    Men() {
      if (this.url !== this.menVoice) {
        this.url = this.menVoice;
        this.autoPlay = true;
      }
      this.switchShow = false;
      // document.getElementById(this.currentAudioId).play();
    },
    // 女生
    WoMen() {
      if (this.url !== this.womenVoice) {
        this.url = this.womenVoice;
        this.autoPlay = true;
      }
      this.switchShow = false;
      // document.getElementById(this.currentAudioId).play();
    },
    // 知名景点
    scenicScroll() {
      let width = this.scenicListData.length * 175;
      this.$refs.scenicTab.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scenicWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 景点详情
    ScenicDetails(item) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/scenicDetails",
        query: {
          id: item.scenic_id,
        },
      });
    },
    // 全部景点
    AllScenic() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.notedLink === true) {
        this.$router.push({
          path: "/allScenic",
          query: {
            id: this.scenicId,
          },
        });
      }
    },
    // 攻略列表
    StrategyList() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.strategyLink === true) {
        this.$router.push({
          path: "/strategyList",
          query: {
            id: this.scenicId,
            type: 2,
          },
        });
      }
    },
    // 攻略详情
    StrategyDetails(id) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/strategyDetails",
        query: {
          id: id,
        },
      });
    },
    // 线路列表
    LineListTwo() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.lineLink === true) {
        this.$router.push({
          path: "/lineListTwo",
          query: {
            id: this.scenicId,
            type: 2,
          },
        });
      }
    },
    // 线路详情
    ScenicLineDetails(id) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/scenicLineDetails",
        query: {
          id: id,
        },
      });
    },
    // 最佳拍摄点
    BestLocationScroll() {
      let width = this.BestLocation.length * 175;
      this.$refs.BestLocationTab.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.BestScroll) {
          this.BestScroll = new BScroll(this.$refs.BestLocationWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.BestScroll.refresh();
        }
      });
    },
    // 最佳拍摄点列表
    BaseShotList() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.bestLink === true) {
        this.$router.push({
          path: "/baseShotList",
          query: {
            type: 2,
            id: this.scenicId,
          },
        });
      }
    },
    // 最佳拍摄点详情列表
    BaseShotLists() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/baseShotList",
        query: {
          type: 2,
          id: this.scenicId,
        },
      });
    },
    gotoHotmap() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/scenicHotMap",
        query: {
          type: 2,
          id: this.scenicId,
        },
      });
    },
    //点击查看更多
    queryMore() {},
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
};
</script>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.onactive {
  display: none;
}
// 类别标题
.title-style {
  color: #222;
  font-size: 20px;
  font-weight: 600;
}
// 类别标题箭头
.icon-style {
  color: #37384d;
  font-size: 18px;
  font-weight: 600;
}

.business-card {
  /deep/ .van-loading {
    margin-top: 20px;
    text-align: center;
  }
  .header {
    width: 100%;
    .title {
      z-index: 400;
      /deep/ .van-nav-bar .van-icon {
        color: #000;
        font-weight: 600;
        font-size: 26px;
      }
      /deep/ .van-nav-bar {
        background: rgba(255, 255, 255, 0);
        height: 50px;
        line-height: 50px;
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
    // 视频
    .video {
      height: 239px;
      overflow: hidden;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      /deep/ .van-swipe {
        height: 239px;
      }
      /deep/ .van-swipe__indicators {
        z-index: 1200;
        bottom: 30px;
      }
      /deep/ .van-swipe__indicator {
        background: #dfdfdf;
        border-radius: 0px;
        width: 24px;
        height: 3px;
        border-radius: 2px;
      }
      /deep/ .van-swipe__indicator--active {
        background: #37384d;
        width: 9px;
        height: 3px;
      }
      /deep/ .vjs-custom-skin > .video-js {
        height: 189px;
      }
      /deep/ .vjs_video_3-dimensions.vjs-fluid {
        padding-top: 0px;
      }
      /deep/ .vjs-custom-skin > .video-js .vjs-big-play-button {
        width: 50px;
        height: 50px !important;
        line-height: 50px !important;
        border-radius: 50%;
        left: 59%;
        top: 53%;
        border: 0px;
      }
      /deep/ .vjs-poster {
        width: 100%;
        background-size: 100%;
        border-radius: 3px;
      }
      .video-player {
        border-radius: 3px;
      }
      .water-marker {
        position: absolute;
        right: 3px;
        top: 3px;
        width: 100px;
        height: 22px;
      }
    }
    .header-location {
      padding: 30px 20px 10px 20px;
      & > p {
        font-size: 26px;
        font-family: PingFangSC;
        font-weight: 600;
        color: rgba(85, 89, 89, 1);
        line-height: 26px;
        &:nth-of-type(2) {
          margin-top: 15px;
          display: flex;
        }
        & > span {
          display: inline-block;
          font-size: 11px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(74, 75, 94, 1);
          line-height: 11px;
          padding: 4px 7px;
          background: rgba(70, 71, 91, 0.05);
          margin-right: 12px;
        }
      }
      .level {
        color: #fff;
        background: #188357;
      }
    }
  }
  .time {
    padding: 0px 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    p {
      margin-right: 10px;
      color: #7b7b7b;
      font-size: 12px;
    }
  }
  .psersion-num {
    padding: 0px 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    p {
      margin-right: 10px;
      color: #7b7b7b;
      font-size: 12px;
    }
    /deep/ .van-image {
      padding: 2px 0;
      border-radius: 3px;
      width: 12px;
      height: 12px;
      text-align: left;
    }
  }
  // 简介
  .synopsis {
    padding: 0px 20px;
    & > h3 {
      color: #222;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 25px;
    }
    .audio-box {
      display: flex;
      justify-content: space-between;
      .audio {
        position: relative;
        width: 81.4%;
        height: 57px;
        background: #f6f6f6;
        border-radius: 2px;
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .vueAudioNative .audio-left .iconfont {
          font-size: 34px;
          color: #188357;
          margin-right: 10px;
        }
        /deep/ .vueAudioNative .audio-left span {
          position: absolute;
          top: 30px;
          right: 5%;
          color: #afafaf;
          font-size: 14px;
        }
        /deep/ .vueAudioNative .audio-right .slider .slider-btn {
          border-color: #188357;
        }
        /deep/ .vueAudioNative .audio-right .slider .slider-bar {
          background: #188357;
        }
      }
      .audio-tab {
        width: 17%;
        height: 57px;
        background: #f6f6f6;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
        margin-bottom: 20px;
        & > p {
          width: 100%;
          margin-top: 5px;
          font-size: 9px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(24, 131, 87, 1);
          text-align: center;
          height: 8px;
          line-height: 8px;
        }
      }
    }
    .map {
      position: relative;
      /deep/.van-image__img {
        border-radius: 3px;
      }
      .details {
        position: absolute;
        right: 8px;
        bottom: 8px;
        background: rgba(24, 131, 87, 1);
        box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.06);
        padding: 8px 9px;
        border-radius: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  // 知名景点
  .scenic-spot {
    margin-top: 20px;
    /deep/ .van-cell {
      padding: 20px;
    }
    /deep/ .van-cell__title span {
      @extend .title-style;
    }
    /deep/ .van-cell__right-icon {
      @extend .icon-style;
    }
    /deep/ .van-cell:not(:last-child)::after {
      border: 0px;
    }
    .scenic-box {
      margin-left: 20px;
      .select-person {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding-bottom: 20px;
        .person-wrap {
          .person-list {
            .person-item {
              display: inline-block;
              height: 101px;
              width: 175px;
              /deep/ .van-image {
                border-radius: 3px;
              }
              .van-div {
                margin-top: 15px;
                p {
                  &:nth-of-type(1) {
                    font-size: 15px;
                    font-family: PingFangTC;
                    font-weight: 600;
                    color: rgba(85, 89, 89, 1);
                    line-height: 15px;
                    width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  &:nth-of-type(2) {
                    margin-top: 10px;
                    display: inline-block;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFangSC;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                    margin-right: 6px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // 攻略
  .play-strategy {
    margin-bottom: 20px;
    /deep/ .van-cell {
      padding: 20px 20px;
    }
    /deep/ .van-cell__title span {
      @extend .title-style;
    }
    /deep/ .van-cell__right-icon {
      @extend .icon-style;
    }
    /deep/ .van-cell:not(:last-child)::after {
      border: 0px;
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
}
.bg-big {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 2000;
  display: flex;
  align-items: center;
}
.qiehuan {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 2000;
  .bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  .man-women {
    position: fixed;
    bottom: 0px;
    left: 0px;
    padding: 20px;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    & > div {
      &:nth-of-type(1) {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        & > span {
          &:nth-of-type(1) {
            height: 15px;
            font-size: 15px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(85, 89, 89, 1);
            line-height: 15px;
          }
          &:nth-of-type(2) {
            height: 15px;
            font-size: 15px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(24, 131, 87, 1);
            line-height: 15px;
          }
        }
      }
      &:nth-of-type(2) {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        & > p {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          text-align: center;
          line-height: 78px;
          &:nth-of-type(1) {
            background: #37384d;
          }
          &:nth-of-type(2) {
            background: #188357;
          }
        }
      }
    }
  }
}
</style>
