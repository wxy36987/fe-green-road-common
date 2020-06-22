<template>
  <div>
    <div style="height:60px;width:100%;"></div>
    <div class="footer">
      <van-tabbar
        v-model="activeStyle"
        active-color="#1aad17"
      >
        <van-tabbar-item
          replace
          to="/"
        >
          <div class="tabs">
            <van-image
              :src="homeYes"
              width="30px"
              height="30px"
              v-if="activeStyle === 0"
            ></van-image>
            <van-image
              :src="homeNo"
              width="30px"
              height="30px"
              v-if="activeStyle !== 0"
            ></van-image>
            <p>推荐</p>
          </div>
        </van-tabbar-item>
        <van-tabbar-item
          replace
          to="/personalCenter"
        >
          <div class="tabs">
            <van-image
              :src="myNo"
              width="30px"
              height="30px"
              v-if="activeStyle === 0"
            ></van-image>
            <van-image
              :src="myYes"
              width="30px"
              height="30px"
              v-if="activeStyle !== 0"
            ></van-image>
            <p>我的</p>
          </div>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeStyle: 0,
      homeYes: require("../assets/iconImage/home_yes.png"),
      homeNo: require("../assets/iconImage/home_no.png"),
      myYes: require("../assets/iconImage/my_yes.png"),
      myNo: require("../assets/iconImage/my_no.png")
    }
  },
  props: {
    active: {
      type: Number,
      default: () => []
    }
  },
  created() {
    this.activeStyle = this.active
  }
}
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 60px;
  flex: 0 0 auto;
  box-shadow: 1px 0px 10px #ddd;
  z-index: 1200;
  position: fixed;
  bottom: 0px;
  /deep/ .van-tabbar {
    height: 55px;
    padding-bottom: 5px;
  }
  /deep/ .van-tabbar-item {
    color: #9b9b9b;
  }
  .tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    p {
      width: 100%;
      text-align: center;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(20, 21, 25, 1);
    }
  }
}
</style>
