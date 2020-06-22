<template>
  <div class="scenic-details">
    <!-- <div class="header">
			<van-nav-bar title="" left-arrow @click-left="onClickLeft" />
		</div> -->
    <!-- <loading v-if="loading"></loading> -->
    <div v-show="!loading">
      <div class="header-img">
        <van-swipe
          v-if="playerOptionsArray.length > 0 || banner.length > 0"
          id="swipe"
          :autoplay="autoplayTime"
          :loop="false"
          @change="onChange"
        >
          <van-swipe-item v-if="playerOptions.sources.src.length > 0">
            <video
              v-show="videoVisable"
              id="videoPlayer"
              class="video-style"
              controls
              preload
              autoplay
              muted
              @play="onPlayerPlay"
              @pause="onPlayerPause"
              @canplay="onCanplay"
              :poster="playerOptions.poster"
              webkit-playsinline
              playsinline
              x5-playsinline
              x5-video-player-type="h5-page"
              x-webkit-airplay="allow"
              controlsList="nofullscreen"
              object-fit="fill"
            >
              <source :src="playerOptions.sources.src" type="video/mp4" />
            </video>
            <div
              v-if="!videoVisable && isautoplay"
              class="imgvideo"
              @click="imgPlay()"
            >
              <van-image :src="playerOptions.poster"></van-image>
              <img :src="playIcon" class="play-icon-style" />
            </div>

            <van-image
              :src="waterMarkImage"
              class="water-marker"
              v-show="isWaterMarkImage"
            ></van-image>
            <msgToast ref="msgToast" :showWrap="isShowMsgToast"></msgToast>
          </van-swipe-item>
          <van-swipe-item
            @click="tapImage()"
            v-for="(item, index) in banner"
            :key="index"
          >
            <van-image
              width="100%"
              height="189px"
              :src="item.src_origin"
              @click="tapImage(banner_imgs, index)"
            ></van-image>
          </van-swipe-item>
          <van-swipe-item
            v-if="lastBanner"
            @touchstart="TouchStart"
            @touchmove="TouchMove"
          >
            <van-image
              width="100%"
              height="189px"
              :src="lastBanner"
              @click="tapImage(banner_imgs, banner.length - 1)"
            ></van-image>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="site">
        <h3>{{ name }}</h3>
        <p>
          <span v-for="(item, index) in tags" :key="index">{{ item }}</span>
        </p>
      </div>
      <div class="time" v-if="tourTime !== null">
        <p v-if="tourTime !== ''">预计游览时间：{{ tourTime }}</p>
      </div>
      <!-- 简介 -->
      <div class="synopsis">
        <div class="voice-box">
          <div class="voice">
            <div class="m-main">
              <!-- <div class="audio">
                <my-audio :src="url" :autoPlay="autoPlay"></my-audio>
              </div> -->
              <div class="player">
                <a
                  href="javascript:void(0)"
                  rel="external nofollow"
                  id="js-play"
                >
                  <img
                    src="../../assets/iconImage/ic_voc@2x.png"
                    width="34px"
                    height="34px"
                  />
                </a>
                <a
                  href="javascript:void(0)"
                  rel="external nofollow"
                  id="js-pause"
                >
                  <img
                    src="../../assets/iconImage/ic_voc_pause@2x.png"
                    width="34px"
                    height="34px"
                  />
                </a>
                <div class="play-box">
                  <div class="left">
                    <p class="timeline">
                      <span>
                        <span> </span>
                      </span>
                    </p>
                    <div class="info">
                      <span class="size">00:00</span>
                      <span class="character">/</span>
                      <span class="timeshow">00:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="video">
                <audio name="media" id="js-video" :src="url"></audio>
              </div>
            </div>
          </div>
          <div class="audio-tab" @click="switchShow = true">
            <van-image :src="tabIcon" width="20px" height="20px"></van-image>
            <p>切换主播</p>
          </div>
        </div>
        <div class="map-box">
          <div class="map" v-if="mapSrc" @click="MapTX()">
            <van-image :src="mapSrc" width="100%" height="120px"></van-image>
            <div id="container"></div>
            <div class="details" @click="queryMore">查看更多导览</div>
          </div>
        </div>
        <!-- 介绍折叠文本 -->
        <arrowview :introduce="introduce"></arrowview>
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
      <div class="comment-box">
        <van-cell
          title="用户评论"
          is-link
          :value="CommentNum != 0 ? CommentNum + '条' : ''"
          @click="AllDiscussList()"
        />
        <div class="comment-list" v-if="CommentNum !== 0">
          <customListView
            :arraydata="commentList"
            :isCanUp="true"
            @itemClick="Details"
            @bigPictureLook="BigPictureLook"
            @itemDianZan="itemDianZan"
          >
          </customListView>
        </div>
        <div class="list-no" v-if="CommentNum === 0">
          <p>暂无评论，赶紧来抢沙发吧</p>
        </div>
        <div class="btn">
          <van-button color="#19835C" @click="Write()">
            <van-image :src="jiaIcon" width="14px" height="14px"></van-image>
            写点评
          </van-button>
        </div>
      </div>
    </div>
    <!-- 写评论 -->
    <div>
      <writeComment
        ref="writeComment"
        @Fb="Fb(arguments)"
        id="modalId"
      ></writeComment>
    </div>
    <!-- 图片放大 -->
    <div>
      <displayimage ref="displayimage" @isShowWatch="showWatch"></displayimage>
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
// import Loading from "@/components/loading";
import qs from "qs";
import writeComment from "@/components/writeComment.vue";
import displayimage from "@/components/displayImage.vue";
import empty from "@/components/empty.vue";
import openAppDialog from "@/components/openAppTopDialog.vue";
import msgToast from "@/components/msgToast.vue";
import customListView from "@/components/customListViewComment.vue";
import arrowview from "@/components/arrowTextView.vue";
var isPlay = false;
export default {
  data() {
    return {
      hasAdd: false,
      loading: true,
      scenicId: "", // 景点id
      banner: [],
      name: "", //景点名片 名称
      tags: [], // 标签
      textImage: require("../../assets/iconImage/ic_20_park.png"),
      tourTime: "",
      mapSrc: "", // 地图
      brief: "", // 介绍
      tabIcon: require("../../assets/iconImage/ic_20_voicechange@3x.png"), // 音频切换
      switchShow: false,
      womenVoice: "",
      menVoice: "",
      genderDecide: 1,
      introduce: "",
      shareimg: "", //分享图片
      lat: "",
      lng: "",
      shareInfo: "",
      clickNum: false,
      address: "",
      commentList: [],
      CommentNum: 0, // 评论条数
      // 添加评论
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),
      show: false,
      publishShow: true,
      // ---------------------- 视频
      autoplayTime: 0,
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
          src: "", // 你的视频地址（必填）
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
      waterMarkImage: require("../../assets/iconImage/ic_watermark@3x.png"),
      playerOptionsArray: [],
      startX: 0,
      currentIndex: 0,
      disX: 0,
      banner_imgs: [],
      isWaterMarkImage: false,
      interval: null,
      banner_imgs_is_show: 0,
      autoPlay: false,
      url: "",
      isShareWeb: this.$route.query.isShareWeb,
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      showContent: true,
      isShowMsgToast: false,
      videoVisable: true,
      playIcon: require("../../assets/iconImage/icon_bofang_da@2x.png"),
      lastBanner: "",
      toMorePic: false,
      isautoplay: false,
    };
  },
  components: {
    // Loading,
    writeComment,
    displayimage,
    empty,
    openAppDialog,
    msgToast,
    customListView,
    arrowview,
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
    });
    // window.wii.app.invoke('showNativeBar', true);
    window.wii.app.invoke("setTitle", this.name);
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", this.name);
    };
    this.showLoading(this.loading);
    this.getData();
  },
  destroyed() {
    document.getElementById("videoPlayer").pause();
    if (document.getElementById(this.currentAudioId) !== null) {
      document.getElementById(this.currentAudioId).pause();
    }
  },
  updated() {
    let mSwipe = document.getElementById("swipe");
    if (mSwipe && !this.hasAdd) {
      this.hasAdd = true;
    }
  },
  methods: {
    onClickLeft() {
      window.wii.app.invoke("closeWindow");
    },
    // 分享
    Share() {
      window.wii.app.invoke("setTitle", this.name);
      window.wii.app.invoke("showNativeBar", true);
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.shareInfo.title,
          summary: this.shareInfo.content,
          pic: this.shareInfo.pic,
          link: this.shareInfo.url,
          isMiniProgram: true,
          miniProgramId: "gh_e72fb9e614d4",
          miniProgramPath: this.shareInfo.miniProgramPath,
        },
        collect: {
          isShow: false,
          isCollect: false,
          type: "",
          articleId: "",
        },
      });
    },
    /* eslint-disable */
    getData() {
      this.$http
        .get(
          `/appserver/v1/manage/card/detail?type=3&scenic_id=${this.$route.query.id}`
        )
        .then((data) => {
          this.loading = false;
          let _data = data.data.data;
          if (_data.online_status !== 1) {
            this.toastTitle = "糟糕,数据找不到了";
            this.emptyShow = true;
            this.showLoading(this.loading);
            return;
          }
          this.address = _data.address;
          this.shareInfo = _data.shareInfo;
          this.scenicId = _data.id;
          this.latitude = _data.latitude;
          this.longitude = _data.longitude;
          let playerOptionsArray = [];
          if (_data.video) {
            this.playerOptions.sources.src = _data.video.src; // 视频
            this.playerOptions.poster = _data.video.cover_img; // 视频封面
            playerOptionsArray.push(this.playerOptions);
            this.playerOptionsArray = playerOptionsArray;
          }
          if (_data.banner_imgs) {
            this.banner_imgs = _data.banner_imgs;
            this.banner = _data.banner_imgs.slice(0, 5); // banner
            this.shareimg = _data.banner_imgs[0].src_origin;
            this.banner_imgs_is_show = _data.banner_imgs_is_show;
          }
          console.log(this.banner_imgs.length);
          if (this.banner_imgs.length >= 5) {
            this.lastBanner = _data.banner_imgs[4].src_origin;
            this.banner = _data.banner_imgs.slice(0, 4); // banner
          }
          console.log(this.banner_imgs.length);
          this.name = _data.name; // 名称
          this.tags = _data.tags; // 标签
          if (_data.audio) {
            this.womenVoice = _data.audio.voiceWoman; // 女
            this.menVoice = _data.audio.voiceMan; // 男
          }
          if (this.genderDecide === 0) {
            this.url = this.womenVoice; // 女
          } else if (this.genderDecide === 1) {
            this.url = this.menVoice; // 男
          }
          this.tourTime = _data.tour_time; // 游览时长
          this.introduce = _data.brief; // 介绍
          this.loading = false;
          if (_data.map !== null) {
            if (_data.map.src !== null) {
              this.mapSrc = _data.map.src; // 地图
            }
          }
          if (_data.comment_list !== null) {
            this.commentList = _data.comment_list.list;
            this.CommentNum = _data.comment_list.comment_num; // 评论条数
          }
          document.title = this.name;
          document.getElementById("js-video").load();
          AudioControl("js-video");
          this.showLoading(this.loading);
        })
        .then(() => {
          this.init();
          this.Share();
          if (this.playerOptionsArray.length <= 0) {
            this.autoplayTime = 3000;
          }
        })
        .catch((error) => {
          this.showLoading(false);
          this.toastTitle = "网络异常,检查网络再试试~~";
          this.emptyShow = true;
        });
    },
    // 男生
    Men() {
      if (this.url !== this.menVoice) {
        this.url = this.menVoice;
        this.autoPlay = true;
      }
      this.switchShow = false;
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
    change(event) {
      // console.log('change', event);
      if (event === true) {
        var videoPlayer = document.getElementById("videoPlayer");
        if (videoPlayer != null) {
          videoPlayer.pause();
        }
      }
    },
    timeupdate(event) {
      // console.log('当前播放时间：', event);
    },
    metadata(event) {
      // console.log(event, '音频长度：', event.target.duration);
    },
    //获取正在播放音频currentAudioId，可存全局，用以播放和暂停音频
    audioId(event) {
      this.currentAudioId = event;
    },
    /* eslint-disable */
    init() {
      var center = new qq.maps.LatLng(this.latitude, this.longitude);
      var map = new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 16,
        draggable: false,
        scrollwheel: false, //设置是否可以滚动 ！！此处修改！！
        disableDoubleClickZoom: false,
        zoomControl: false,
        disableDefaultUI: true,
      });
      var label = new qq.maps.Label({
        position: center,
        map: map,
        // content: '<p class="a">' + this.name + '</p>'
      });
      var marker = new qq.maps.Marker({
        position: center,
        map: map,
      });

      var anchor = new qq.maps.Point(0, 39),
        size = new qq.maps.Size(30, 30),
        origin = new qq.maps.Point(0, 0),
        markerIcon = new qq.maps.MarkerImage(
          "https://3gimg.qq.com/lightmap/api_v2/2/4/99/theme/default/imgs/marker.png",
          size,
          origin,
          anchor
        );
      marker.setIcon(markerIcon);
    },
    MapTX() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.clickNum === false) {
        this.clickNum = true;
        setTimeout(() => {
          this.clickNum = false;
        }, 500);
        window.wii.app.invoke(
          "naviRoute",
          `greenway://map_navi?name=${this.name}&address=${this.address}&lat=${this.latitude}&lng=${this.longitude}&type=3`
        );
      }
    },
    // 用户评论列表
    AllDiscussList() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.CommentNum <= 0) {
        return;
      }
      this.$router.push({
        path: "/allDiscussList",
        query: {
          cid: this.$route.query.id,
          type: "scenicSpot",
        },
      });
    },
    // 评论详情
    Details(item) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (item.comment_id === null || item.comment_id === "") {
        return;
      }
      this.$router.push({
        path: "/discussDetails",
        query: {
          comment_id: item.comment_id,
          type: "scenicSpot",
          from: "web",
        },
      });
    },
    tapImage(banner, index) {
      console.log(this.banner_imgs.length + " " + index);
      var imgs = [];
      for (let index = 0; index < this.banner_imgs.length; index++) {
        const element = this.banner_imgs[index];
        imgs.push(element.src_origin);
      }
      this.$refs.displayimage.showBigPictureLook(imgs, index);
    },
    // 图片点击放大
    BigPictureLook(item, index) {
      this.$refs.displayimage.showBigPictureLook(item.image, index);
    },
    // 写评论
    Write() {
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        let windheight = document.documentElement.clientHeight; //为唤起软键盘时当前窗口高度
        document.getElementById("modalId").style.position = "relative";
        window.onresize = function() {
          var docheight = document.documentElement.clientHeight; //唤起软键盘时窗口高度
          document.getElementById("write").style.bottom =
            docheight - windheight + "px";
        };
      }
      if (this.uid) {
        this.$refs.writeComment.showWriteDialog();
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 发表
    Fb(msg) {
      var message = msg[0];
      var gallerysStr = msg[1];
      let params = {
        content: message,
        cid: this.$route.query.id,
        ctitle: this.title,
        type: "scenicSpot",
        source_type: "app",
        image: gallerysStr,
      };
      this.$http
        .post(`/appserver/v1/comment/addComment`, qs.stringify(params), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          this.$refs.writeComment.ClosePost();
          if (data.data.ret == 0) {
            this.$toast("发布成功");
            this.commentList.unshift(data.data.data);
            if (this.commentList.length > 2) {
              this.commentList.pop();
            }
            this.CommentNum = this.CommentNum + 1;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 视频播放
    // eslint-disable-next-line
    onPlayerPlay() {
      this.autoplayTime = 0;
      isPlay = false;
      document.getElementById("js-video").load();
      AudioControl("js-video");
      this.isWaterMarkImage = true;
      this.commonGetNetStatus((netWorkInfo) => {
        if (netWorkInfo.netType !== "1") {
          var start_time = window.localStorage.getItem("start_time");
          if (start_time === null) {
            this.showMsgToast();
          } else {
            var day = this.commonCalculateDiffTime(start_time);
            if (day > 30) {
              this.showMsgToast();
            }
          }
        }
      });
    },
    onPlayerPause() {
      this.videoVisable = false;
      this.autoplayTime = 3000;
      this.isWaterMarkImage = false;
    },
    onCanplay() {
      this.isautoplay = true;
      // document.getElementById("videoPlayer").play();
    },
    onChange(index) {
      var videoPlayer = document.getElementById("videoPlayer");
      if (videoPlayer != null) {
        videoPlayer.pause();
      }
      this.currentIndex = index;
    },
    // 更多图片
    morePic() {
      if (this.toMorePic) {
        return;
      }
      this.toMorePic = true;
      this.$router.push({
        path: "scenicPicList",
        query: {
          scenic_id: this.$route.query.id,
        },
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
        this.morePic();
      }
    },
    //点击查看更多
    queryMore() {
      // window.wii.app.invoke(
      //   "naviRoute",
      //   `greenway://map_navi?name=${this.name}&address=${this.address}&lat=${this.latitude}&lng=${this.longitude}`
      // );
    },
    showMsgToast() {
      this.isShowMsgToast = true;
      var that = this;
      setTimeout(() => {
        that.isShowMsgToast = false;
      }, 3000);
      window.localStorage.setItem(
        "start_time",
        Math.round(new Date() / 1000) + ""
      );
    },
    showWatch(isShow) {
      if (isShow) {
        window.wii.app.invoke("showNativeBar", false);
      } else {
        window.wii.app.invoke("showNativeBar", true);
      }
    },
    imgPlay() {
      if (this.videoVisable) {
        return;
      }
      this.videoVisable = true;
      setTimeout(() => {
        var videoPlayer = document.getElementById("videoPlayer");
        videoPlayer.play();
      }, 1000);
    },
    //评论列表item点赞
    itemDianZan(item, comment_id) {
      let data = {
        comment_id: comment_id,
        number: "1",
      };
      this.$http
        .post(`/appserver/v1/comment/deleteOrUp`, qs.stringify(data), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            item.up++;
            item.is_up = !item.is_up;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
  },
};
function AudioControl(id) {
  // 音频控制进度条
  var audio = document.getElementById(id);
  $(audio).on("loadedmetadata", function() {
    if (isPlay === true) {
      audio.play();
      $("#js-pause").show();
      $("#js-play").hide();
    } else {
      audio.pause();
      $("#js-pause").hide();
      $("#js-play").show();
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
    // 进度条控制
    $(document).on("touchend", ".timeline", function(e) {
      var x = e.originalEvent.changedTouches[0].clientX - this.offsetLeft;
      var X = x < 0 ? 0 : x;
      var W = $(this).width();
      var place = X > W ? W : X;
      audio.currentTime = (place / W).toFixed(2) * audio.duration;
      $(this)
        .children()
        .css({
          width: (place / W).toFixed(2) * 100 + "%",
        });
    });
    // 播放
    $("#js-play").on("click", function() {
      $(this).hide();
      $("#js-pause").show();
      audio.play();
      for (var i = 0; i < $("video").length; i++) {
        $("video")[i].pause();
      }
    });
    // 暂停
    $("#js-pause").on("click", function() {
      $(this).hide();
      $("#js-play").show();
      audio.pause();
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    });
  });
  audio.addEventListener("playing", function() {
    if (this.interval === null) {
      this.interval = setInterval(function() {
        var currentTime = audio.currentTime;
        setTimeShow(currentTime);
      }, 1000);
    }
  });
  audio.addEventListener("pause", function() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  });
  audio.addEventListener(
    "ended",
    function() {
      if (this.interval !== null) {
        clearInterval(this.interval);
        this.interval = null;
      }
      $("#js-pause").hide();
      $("#js-play").show();
    },
    false
  );
  //加载完成监听
  audio.addEventListener("canplay", function() {
    var currentTime = audio.currentTime;
    setTimeShow(currentTime);
  });
  // 设置播放时间
  function setTimeShow(t) {
    t = Math.floor(t);
    var playTime = secondToMin(audio.currentTime);
    $(".size").html(playTime);
    $(".timeshow").text(secondToMin(audio.duration));
    $(".timeline")
      .children()
      .css({
        width: (t / audio.duration).toFixed(4) * 100 + "%",
      });
  }
  // 计算时间
  function secondToMin(s) {
    var MM = Math.floor(s / 60);
    var SS = s % 60;
    if (MM < 10) MM = "0" + MM;
    if (SS < 10) SS = "0" + SS;
    var min = MM + ":" + SS;
    return min.split(".")[0];
  }
}
</script>
<style>
body,
* {
  padding: 0;
  margin: 0;
}

.m-main {
  width: 100%;
  height: 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  position: relative;
}

.m-main video {
  display: none;
}

.m-main .player {
  width: 100%;
  /* height: 3rem; */
  /* position: relative;
  bottom: 0px;
  top: 10px; */
  display: flex;
  align-items: center;
  height: 100%;
}

#js-play {
  display: block;
  width: 34px;
  height: 34px;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  /* position: absolute;
  left: 1rem;
  top: 0; */
  margin-left: 1rem;
  display: block;
}

#js-pause {
  display: block;
  width: 34px;
  height: 34px;
  margin: 0 auto;
  color: #fff;
  /* text-align: center;
  position: absolute;
  left: 1rem;
  top: 0; */
  margin-left: 1rem;
  display: none;
}

#js-play #js-pause img {
  width: 100%;
}
.m-main > .audio {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.m-main .play-box {
  /* width: 100%; */
  flex: 1;
  /* margin-left: 3.8rem; */
  height: 100%;
}

.m-main .play-box .left {
  /* width: 25.6rem;
  float: left; */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding-left: 20px;
  align-items: center;
  padding-right: 5px;
}

.m-main .play-box .left p.timeline {
  /* width: calc(75% - 20px); */
  width: 100%;
  height: 7px;
  background-color: #dfdfdf;
  border-radius: 5px;
  /* margin-top: 1.2rem; */
  /* margin-left: 10px; */
  position: relative;
  margin-top: 15px;
  z-index: 2;
}

.m-main .play-box .left p.timeline span {
  position: relative;
  width: 0px;
  height: 7px;
  background-color: #188357;
  border-radius: 5px;
  display: block;
  -webkit-transition: width ease-out 0.3s;
  -o-transition: width ease-out 0.3s;
  transition: width ease-out 0.3s;
}

.m-main .play-box .left p.timeline span span {
  position: absolute;
  content: " ";
  right: -10px;
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  border: 2px solid #188357;
  top: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  margin-top: -7px;
  margin-left: 0px;
  cursor: pointer;
}

.m-main .play-box .left p.timeline span:after {
  content: "";
  position: absolute;
  top: -5px;
  right: -0.6rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: #ec6538;
}

.m-main .play-box .left div.info {
  width: 100%;
  /* height: 26px; */
  font-size: 0.8rem;
  color: #000;
  z-index: 1;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  /* width: calc(75% - 10px); */
  margin-top: 2px;
}

.m-main .play-box .left div.info .size {
  float: none;
  display: block;
  font-size: 12px;
  color: #afafaf;
  margin-right: 2px;
}

.m-main .play-box .left div.info .character {
  float: none;
  display: block;
  font-size: 12px;
  color: #afafaf;
  margin-right: 2px;
}

.m-main .play-box .left div.info .timeshow {
  float: none;
  display: block;
  font-size: 12px;
  color: #afafaf;
}
.m-main .play-box .left p.timeline span:after {
  background: none;
}
:root {
  --swiper-theme-color: rgba(0, 0, 0, 0.45) !important;
  --swiper-navigation-size: 0px !important;
}
</style>
<style lang="scss" scoped>
.scenic-details {
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
  /deep/ .van-loading {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .header-img {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    .title {
      z-index: 500;
      top: 10px;
      /deep/ .van-nav-bar .van-icon {
        color: #000;
        font-weight: 700;
        font-size: 22px;
      }
      /deep/ .van-nav-bar {
        background: rgba(255, 255, 255, 0);
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
      /deep/ .van-nav-bar__left {
        left: 0;
      }
      /deep/ .van-nav-bar__right {
        right: 0;
      }
    }
    /deep/ .van-swipe-item {
      width: 100%;
      height: 100%;
    }
    /deep/ .van-swipe {
      height: 238px;
    }
    /deep/ .van-image {
      width: 100%;
      height: 100%;
    }
    /deep/ .van-swipe__indicator {
      background: #dfdfdf;
      border-radius: 0px;
      width: 24px;
      height: 3px;
    }
    /deep/ .van-swipe__indicator--active {
      background: #37384d;
      width: 8px;
      margin: 0 8px !important;
    }
    /deep/ .van-swipe__indicators {
      bottom: 19px;
      z-index: 1200;
    }
    .video-style {
      height: 189px;
      width: 100%;
      object-fit: cover;
      /deep/ .-webkit-media-controls-fullscreen-button {
        display: none;
      }
    }

    .water-marker {
      position: absolute;
      right: 3px;
      top: 3px;
      width: 100px;
      height: 22px;
    }
    .imgvideo {
      height: 189px;
      width: 100%;
      position: relative;
      /deep/ .van-image {
        width: 100%;
        height: 100%;
      }
      /deep/ .van-image__img {
        border-radius: 3px;
      }
      .play-icon-style {
        position: absolute;
        flex-wrap: wrap;
        left: 50%;
        top: 50%;
        width: 60px;
        height: 60px;
        z-index: 50;
        transform: translate(-50%, -50%);
      }
    }
  }
  .site {
    padding: 0px 20px;
    & > h3 {
      font-size: 26px;
      font-family: PingFangSC-Semibold, PingFangSC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 26px;
      margin-bottom: 15px;
    }
    & > p {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      & > span {
        padding: 4px 7px;
        display: inline-block;
        background: rgba(246, 246, 246, 1);
        border-radius: 2px;
        margin-right: 8px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
        line-height: 11px;
        margin-right: 12px;
      }
    }
    & > div {
      width: 100%;
      height: 120px;
      margin-top: 19px;
      /deep/ .van-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .time {
    padding: 0px 20px;
    margin-top: 12px;
    color: #999;
    font-size: 12px;
  }
  .synopsis {
    padding: 0px 20px;
    .voice-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .voice {
        position: relative;
        width: 81.4%;
        height: 57px;
        background: #f6f6f6;
        border-radius: 2px;
        margin: 25px 0px;
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
          color: #dfdfdf;
          font-size: 9px;
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
  }
  .map-box {
    overflow: hidden;
    width: 100%;
    height: 120px;
    margin-top: 10px;
    .map {
      width: 100%;
      height: 120px;
      position: relative;
      #container {
        width: 100%;
        height: 120px;
      }
      a {
        display: none;
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
}
.comment-box {
  padding: 20px;
  /deep/ .van-cell {
    margin: 25px 0px;
    padding: 0px;
  }
  /deep/ .van-cell__title span {
    font-size: 20px;
    font-family: PingFangTC-Medium, PingFangTC;
    font-weight: 500;
    color: rgba(55, 56, 77, 1);
  }
  /deep/ .van-cell__value {
    font-size: 15px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(153, 153, 153, 1);
  }
  /deep/ .van-cell:not(:last-child)::after {
    border: 0px;
  }
  /deep/ .van-icon {
    color: #37384d;
    font-size: 16px;
  }
  .comment-list {
    padding: 0px;
  }
  .list-no {
    text-align: center;
    padding: 30px 0px 0px 0px;
    & > p {
      height: 14px;
      font-size: 15px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(153, 153, 153, 1);
      line-height: 14px;
    }
  }
  .btn {
    margin-top: 29px;
    width: 100%;
    opacity: 0.95;
    margin-bottom: 24px;
    /deep/ .van-image {
      margin-right: 4px;
      margin-top: -3px;
    }
    /deep/ .van-button {
      width: 100%;
      border: 0px;
      height: 40px;
    }
    /deep/ .van-button span {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      /deep/ .van-icon {
        color: #fff;
        margin-right: 7px;
      }
    }
    /deep/ .van-icon {
      color: #fff;
      margin-right: 7px;
    }
  }
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
