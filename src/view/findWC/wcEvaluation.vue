<!--厕所评价-->
<template>
  <div class="page-content">
    <div class="header">
      <van-nav-bar title="厕所评价" left-arrow @click-left="onClickLeft">
      </van-nav-bar>
    </div>
    <div class="wcev-content">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in wc.iconPath" :key="index">
          <img :src="item" alt="" />
        </van-swipe-item>
      </van-swipe>

      <div class="wcev-title">{{ wc.toiletName }}</div>
      <div
        v-for="(item, i) in options"
        :key="'wcev-key-' + i"
        class="wcev-item"
      >
        <div class="wcev-label">{{ item.option }}</div>
        <img
          v-for="(v, k) in 5"
          :key="'wcev-key-start-' + k"
          :src="v <= item.start ? find_wc_l : find_wc_d"
          alt=""
          @click="startClick(i, v)"
        />
      </div>
    </div>
    <div class="wcev-submit" @click="submit">
      提交
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import { mapState, mapActions } from 'vuex'
import { Dialog } from "vant";
import qs from "qs";
export default {
  data() {
    return {
      options: [
        { option: "环境", start: 0 },
        { option: "气味", start: 0 },
        { option: "卫生", start: 0 },
      ],
      find_wc_l: require("../../assets/iconImage/findwc_start_l.png"),
      find_wc_d: require("../../assets/iconImage/findwc_start_d.png"),
      isSubmit: false,
      wc: {},
      isShowDialog: false,
    };
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  pushHistory() {
    var state = {
      title: "title",
      url: "#",
    };
    window.history.pushState(state, "title", "#");
  },
  methods: {
    onClickLeft() {
      if (this.$route.query.from) {
        this.$router.go(-1);
      } else {
        window.wii.app.invoke("closeWindow");
      }
    },
    startClick(index, sta) {
      var options = this.options;
      var option = options[index];
      var start = option.start;
      if (sta > start) {
        option.start = sta;
      } else {
        option.start = sta - 1;
      }
      options[index] = option;
      this.options = options;
    },
    submit() {
      if (!this.isSubmit) {
        this.isSubmit = true;
        if (
          this.options[1].start === 0 ||
          this.options[0].start === 0 ||
          this.options[2].start === 0
        ) {
          this.isSubmit = false;
          return this.$toast({
            message: "请做出完整评价",
            duration: "2000",
          });
        }
        this.$http({
          url: `/appserver/v1/toilet/toiletComment?${qs.stringify({
            toiletId: this.$route.query.wc_id,
            userId: this.uid,
            environmentMark: this.options[0].start,
            smellMark: this.options[1].start,
            healthMark: this.options[2].start,
          })}`,
        })
          .then((res) => {
            this.isSubmit = false;
            if (res.data.ret == 0) {
              this.$toast({
                message: "评价成功",
                duration: "5000",
              });
              setTimeout(() => {
                this.$router.go(-1);
              }, 2000);
            } else {
              this.isShowDialog = true;
              window.history.pushState(null, null, "#");
              Dialog.confirm({
                title: "",
                message: res.data.msg,
                confirmButtonColor: "#178357",
                showCancelButton: false,
                closeOnPopstate: true, //是否在页面回退时自动关闭
              }).closed(() => {
                this.isShowDialog = false;
              });
            }
          })
          .catch((error) => {
            this.$toast("网络异常,检查网络再试试~~");
          });
      }
    },
    popstate() {
      // e.preventDefault();
      if (this.isShowDialog) {
        Dialog.close();
      } else {
        this.$router.go(-1);
      }
    },
  },
  mounted() {
    //设置标题
    window.wii.app.invoke("setTitle", "找厕所");
    this.$http({
      url: `/appserver/v1/toilet/detail?${qs.stringify({
        toiletId: this.$route.query.wc_id,
      })}`,
    }).then((res) => {
      // console.log(res)
      if (res.status === 200) {
        this.wc = res.data ? res.data.data : {};
      }
    });
    window.addEventListener("popstate", this.popstate, false);
  },
  destroyed() {
    window.removeEventListener("popstate", this.popstate, false);
  },
};
</script>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.page-content {
  width: 100%;
  height: 100%;
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
  .wcev-content {
    padding-top: 46px;
    width: 100%;
    height: calc(100% - 60px);
    padding: 10px 20px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 210px;
      border-radius: 2px;
    }
    .wcev-title {
      margin-top: 25px;
      padding: 16px 0px;
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      line-height: 17px;
    }
    .wcev-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .wcev-label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
        line-height: 15px;
        margin-right: 26px;
      }
      img {
        width: 18px;
        height: 18px;
        margin-right: 14px;
      }
    }
  }
  .wcev-submit {
    height: 40px;
    margin: 0 20px;
    background: #178357;
    font-size: 15px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
    text-align: center;
  }
}
</style>
