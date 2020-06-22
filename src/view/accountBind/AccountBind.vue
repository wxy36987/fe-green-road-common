<template>
  <div class="account-bind">
    <div class="title">
      <van-nav-bar title="账号绑定">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
        <van-icon name="ellipsis" slot="right" />
      </van-nav-bar>
    </div>
    <div class="content">
      <ul>
        <li>
          <div>
            <van-image :src="WeChatIcon"></van-image>
            <span>微信</span>
          </div>
          <p>已绑定</p>
        </li>
        <li>
          <div>
            <van-image :src="qqIcon"></van-image>
            <span>QQ</span>
          </div>
          <p :class="{ 'bind-active': bindState }">
            {{ bindState === 0 ? "已绑定" : "立即绑定" }}
          </p>
        </li>
        <li>
          <div>
            <van-image :src="phoneIcon"></van-image>
            <span>{{ phoneText }}</span>
          </div>
          <p>已绑定</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      WeChatIcon: require("../../assets/iconImage/ic_wechat@2x.png"),
      qqIcon: require("../../assets/iconImage/shezhi_ic_qq@2x.png"),
      phoneIcon: require("../../assets/iconImage/shezhi_ic_iphone@2x.png"),
      bindState: 1,
      phoneText: "18513051235",
    };
  },
  created() {
    this.PhoneShow();
  },
  methods: {
    // 手机号隐藏中间4位数
    PhoneShow() {
      var _phoneText = this.phoneText;
      this.phoneText = _phoneText.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    },
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.account-bind {
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
  .content {
    padding: 0 25px;
    ul {
      width: 100%;
      margin-top: 10px;
      li {
        padding: 25px 0px;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /deep/ .van-image {
          width: 19.06px;
          height: 18px;
        }
        span {
          margin-left: 14px;
          font-size: 18px;
          color: #444;
        }
        & > p {
          color: #999;
          font-size: 16px;
        }
        .bind-active {
          color: #2784f4;
        }
      }
    }
  }
}
</style>
