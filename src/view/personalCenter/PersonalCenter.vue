<template>
  <div class="personal">
    <div class="content">
      <div class="title">
        <van-nav-bar title="个人中心">
          <van-icon name="cross" slot="left" />
          <van-icon name="ellipsis" slot="right" />
        </van-nav-bar>
      </div>
      <div class="personal-news">
        <van-image round :src="userImg"></van-image>
        <p>{{ userName }}</p>
      </div>
      <div class="feedback" @click="Feedback()">
        <div>
          <van-image :src="feedbackIcon"></van-image>
          <span>意见反馈</span>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="feedback" @click="MyCollect()">
        <div>
          <van-image :src="collectionIcon"></van-image>
          <span>我的收藏</span>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="feedback" @click="Questions()">
        <div>
          <van-image :src="collectionIcon"></van-image>
          <span>问答</span>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="feedback" @click="yijian()">
        <div>
          <van-image :src="collectionIcon"></van-image>
          <span>一键求助</span>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="feedback" @click="MyComplain()">
        <div>
          <van-image :src="complaintIcon"></van-image>
          <span>我的投诉</span>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>

    <footer-tab :active="active"></footer-tab>
  </div>
</template>
<script>
import FooterTab from "@/components/FooterTab";
export default {
  data() {
    return {
      active: 1,
      feedbackIcon: require("../../assets/iconImage/ic_feedback@2x.png"),
      collectionIcon: require("../../assets/iconImage/ic_collection@2x.png"),
      complaintIcon: require("../../assets/iconImage/ic_collection@2x.png"),
      state: "abc123",
      url: "https://cos-web-h5.wiiqq.com/#/", // 微信授权地址
      userName: localStorage.getItem("userName"), // 用户名
      userImg: localStorage.getItem("userImg"), //用户头像
    };
  },
  components: {
    FooterTab,
  },
  mounted() {
    // this.wxAuth();
  },
  methods: {
    // 意见反馈
    Feedback() {
      this.$router.push({ path: "/feedback" });
    },
    // 问答
    Questions() {
      this.$router.push({
        path: "/QuestionHome",
      });
    },
    // 我的收藏
    MyCollect() {
      if (
        localStorage.getItem("mobile") === "" ||
        localStorage.getItem("mobile") === undefined
      ) {
        this.$router.push({ path: "/bindingPhone" });
      } else {
        this.$router.push({ path: "/myCollection" });
      }
    },
    // 一键求助
    yijian() {
      this.$router.push({
        path: "/oneSeekHelp",
        query: {
          scenicId: "5da954ffaca1ac00406f42dc",
        },
      });
    },
    // 我的投诉
    MyComplain() {
      this.$router.push({
        path: "/myComplain",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.personal {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow: auto;
    .title {
      /deep/ .van-nav-bar .van-icon {
        color: #000;
        font-weight: 700;
        font-size: 20px;
      }
      /deep/ .van-nav-bar__title {
        font-size: 18px;
        font-weight: 600;
        color: #2c2c2c;
      }
    }
    .personal-news {
      width: 100%;
      height: 158px;
      padding: 0 24px;
      box-sizing: border-box;
      background: url("../../assets/iconImage/person_bg.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      /deep/ .van-image {
        width: 60px;
        height: 60px;
        margin-right: 18px;
      }
      p {
        color: #fff;
        font-size: 20px;
      }
    }
    .feedback {
      margin: 0px 20px;
      padding: 28px 0px 25px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      /deep/ .van-image {
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }
      /deep/ .van-icon {
        color: #999;
      }
      & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        color: #444444;
      }
    }
  }
}
</style>
