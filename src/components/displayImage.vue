<template>
  <!-- 图片放大 -->
  <div class="big-picture" v-if="bigShowLook">
    <div class="carousel">
      <div class="back">
        <van-icon name="arrow-left" @click="bigShowLook = false"></van-icon>
        <p>{{ numIndexLook + 1 }}/{{ galleryVosList.length }}</p>
        <span></span>
      </div>
      <div class="swiper">
        <van-swipe
          :loop="false"
          :show-indicators="false"
          :initial-swipe="numIndexLook"
          @change="Slide"
        >
          <van-swipe-item
            v-for="(item, index) in galleryVosList"
            :key="index"
            @click="itemClick(index)"
          >
            <div class="imageItem">
              <van-image
                :src="item.url || item"
                width="100%"
                fit="cover"
              ></van-image>
              <img
                :src="playIcon"
                class="play-icon-style"
                v-if="item.isvideo"
              />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "customvan-display-image",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    propF: {},
  },
  data() {
    return {
      // 图片放大
      galleryVosList: [],
      bigShow: false, // 图片变大
      numIndex: 0, // 显示第几个
      bigShowLook: false, // 图片变大
      numIndexLook: 0, // 显示第几个
      playIcon: require("../assets/iconImage/icon_bofang_da@2x.png"),
    };
  },
  created() {},
  methods: {
    showBigPictureLook(images, index) {
      event.stopPropagation();
      this.galleryVosList = images;
      this.numIndexLook = index;
      this.bigShowLook = true;
    },
    Slide(index) {
      this.numIndex = index;
      this.numIndexLook = index;
    },
    itemClick(index) {
      this.bigShowLook = false;
      var that = this;
      setTimeout(() => {
        that.$emit("onItemClick", index);
      }, 500);
    },
  },
  computed: {},
  watch: {
    //eslint-disable-next-line
    bigShowLook: function(newVal, oldVal) {
      this.$emit("isShowWatch", newVal);
    },
  },
};
</script>
<style lang="scss" scoped>
.big-picture {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1200;
  background: #000;
  .carousel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .swiper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      /deep/ .van-swipe {
        width: 100%;
      }
      /deep/ .van-swipe__track {
        height: 600px;
      }
      /deep/ .van-image {
        max-height: 600px;
      }
      /deep/ .van-swipe-item {
        display: flex;
        align-items: center;
      }
      .imageItem{
        margin:auto;
      }
      .images-box {
        width: 100%;
      }
      .play-icon-style {
        position: absolute;
        flex-wrap: wrap;
        left: 50%;
        top: 50%;
        width: 50px;
        height: 50px;
        z-index: 100;
        transform: translate(-50%, -50%);
      }
    }
    .back {
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1300;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      /deep/ .van-icon {
        font-size: 20px;
        font-weight: 600;
      }
      p {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFangSC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 16px;
      }
      span {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
