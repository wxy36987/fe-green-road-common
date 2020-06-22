<template>
  <div class="video-play-page">
    <div class="content" v-if="playerOptions.sources.length > 0">
      <video
        id="videoPlayer"
        class="video-style"
        controls
        autoplay
        @play="onPlayerPlay"
        @pause="onPlayerPause"
        :poster="playerOptions.poster"
        webkit-playsinline=""
        playsinline=""
        x5-playsinline=""
        preload="true"
        x5-video-player-type="h5-page"
        x-webkit-airplay="allow"
      >
        <source :src="playerOptions.sources[0].src" type="video/mp4" />
      </video>
      <van-image
        :src="waterMarkImage"
        class="water-marker"
        v-show="isWaterMarkImage"
      ></van-image>
      <msgToast ref="msgToast" :showWrap="isShowMsgToast"></msgToast>
    </div>
  </div>
</template>
<script>
import msgToast from "@/components/msgToast.vue";
export default {
  data() {
    return {
      title: "全部视频图片",
      isShowMsgToast: false,
      isWaterMarkImage: false,
      waterMarkImage: require("../../assets/iconImage/ic_watermark@3x.png"),
      playerOptions: {
        sources: [],
        poster: "", //你的封面地址
      },
      videoItem: {},
      interval: null,
    };
  },
  created() {
    window.wii.app.invoke("setTitle", this.title);
    this.videoItem = this.$route.query.data;
    this.videoItem.type = "video/mp4";
    this.playerOptions.sources.push(this.videoItem);
    this.playerOptions.poster = this.videoItem.cover_img;
  },
  components: {
    msgToast,
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", this.title);
    };
    document.getElementById("videoPlayer").play();
  },
  methods: {
    // 视频播放
    onPlayerPlay() {
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
      setTimeout(() => {
        document.getElementById("videoPlayer").webkitEnterFullscreen();
      }, 1000);
    },
    // eslint-disable-next-line
    onPlayerPause() {
      this.isWaterMarkImage = false;
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
  },
};
</script>
<style lang="scss" scoped>
.video-play-page {
  //background: #000;
  width: 100%;
  height: 100%;
  padding-top: 50%;
  .content {
    height: 189px;
    padding: 0 0px;
    .water-marker {
      right: 5%;
      top: 30%;
      transform: translate(-20%, -30%);
      position: fixed;
      width: 100px;
      height: 22px;
      z-index: 1000;
    }
    .video-style {
      object-fit: fill; /*这里是关键*/
      width: 100%;
      height: 100%;
    }
  }
}
</style>
