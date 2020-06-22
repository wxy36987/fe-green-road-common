<!--停车助手-->
<template>
  <div class="parking-content">
    <div class="parking-bg">
      <van-nav-bar
        title="停车助手"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
      <img :src="bg" width="100%" height="188px" />
    </div>
    <div class="parking-var">
      <div class="var-item">
        <img :src="car_m" @click="toUrl" />
        <span>车辆管理</span>
      </div>
      <div class="var-item">
        <img :src="car_mm" @click="noWork" />
        <span>车位长租</span>
      </div>
      <div class="var-item">
        <img :src="car_s" @click="noWork" />
        <span>反向寻车</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bg: require("../../assets/iconImage/parking_bg.png"),
      car_m: require("../../assets/iconImage/parking_car_m.png"),
      car_mm: require("../../assets/iconImage/parking_m.png"),
      car_s: require("../../assets/iconImage/parking_search.png"),
    };
  },
  components: {},
  created() {
    this.showLoading(true);
  },
  methods: {
    onClickLeft() {
      window.wii.app.invoke("closeWindow");
    },
    noWork() {
      this.$toast({
        message: "敬请期待",
        duration: "2000",
      });
    },
    toUrl() {
      window.wii.app.invoke("openWindow", {
        openUrl: `${this.domain}carManagement`,
        isFullScreen: 0,
        setTitle: "车辆管理",
        needLoading: 0,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.parking-content {
  height: 100%;
  width: 100%;
  position: relative;
  .parking-bg {
    position: relative;
    height: 188px;
    width: 100%;
    /deep/ .van-nav-bar {
      width: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      background: rgba(0, 0, 0, 0);
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
    /deep/ .van-icon {
      color: #fff;
      font-size: 20px;
      font-weight: 500;
    }
    /deep/ .van-nav-bar__title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
    }
  }
  .parking-var {
    height: 128px;
    display: flex;
    position: absolute;
    left: 20px;
    right: 20px;
    top: 166px;
    align-items: center;
    background: #fff;
    flex-wrap: wrap;
    box-shadow: 0px 4px 20px 0px rgba(114, 122, 144, 0.1);
    border-radius: 4px;
    justify-content: space-between;
    .var-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 33.3%;
      img {
        width: 38px;
        height: 38px;
        margin-bottom: 10px;
      }
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(85, 89, 89, 1);
      line-height: 15px;
    }
  }
}
</style>
