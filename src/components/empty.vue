<template>
  <div class="empty-style" v-if="emptyShow" @touchmove.prevent>
    <div class>
      <van-image :src="emptyIcon" width="200px" height="200px"></van-image>
      <p>{{ toastTitle }}</p>
    </div>
    <van-button v-if="isShowBtn" color="#188357" @click="clickButton()">{{
      buttonText
    }}</van-button>
  </div>
</template>

<script>
export default {
  name: "empty-div", //缺省页
  props: {
    toastTitle: {
      type: String,
      default: "网络异常,检查网络再试试~",
    },
    buttonText: {
      type: String,
      default: "刷新重试",
    },
    isShowBtn: {
      type: Boolean,
      default: false,
    },

    emptyShow: {
      type: Boolean,
      default: false,
    },

    propF: {},
  },
  data() {
    return {
      emptyIcon: require("../assets/iconImage/baoming@2x.png"),
    };
  },
  created() {},
  methods: {
    clickButton() {
      this.$emit("clickButton", "");
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.empty-style {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 3000;
  padding: 0 20px;
  box-sizing: border-box;
  background: white;
  & > div {
    margin-top: 30vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    p {
      width: 100%;
      text-align: center;
      margin-top: 19px;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(155, 155, 155, 1);
    }
  }
  /deep/ .van-button {
    margin-top: 100px;
    width: 100%;
    border: 0px;
    height: 40px;
  }
  /deep/ .van-button span {
    font-size: 17px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
