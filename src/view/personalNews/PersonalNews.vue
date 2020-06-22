<template>
  <div class="personal-news">
    <div class="title">
      <van-nav-bar title="个人信息">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
        <van-icon name="ellipsis" slot="right" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="head-portrait">
        <p>头像</p>
        <div>
          <van-image round :src="userImg"></van-image>
          <van-icon name="arrow" />
        </div>
      </div>
      <van-cell title="名字" is-link :value="userName" />
      <van-cell title="帐号绑定" is-link @click="AccountBind()" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      userImg: "",
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
    //
    getUserInfo() {
      var data = {
        open_id: this.$cookie.get("open_id"),
        skey: this.$cookie.get("skey"),
        uid: this.$cookie.get("uid"),
      };
      // console.log(this.$cookie);
      this.$http.get("/appserver/v1/user/get_auth_data", data).then((data) => {
        this.userName = data.data.nickname;
        this.userImg = data.data.head_img_url;
      });
    },
    // 账号绑定
    AccountBind() {
      this.$router.push({ path: "/accountBind" });
    },
  },
};
</script>
<style lang="scss" scoped>
.personal-news {
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
    padding: 20px 25px 0px 25px;
    .head-portrait {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;

      & > div {
        width: 100%;
      }
      /deep/ .van-uploader__input-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        & > p {
          color: #444444;
          font-size: 18px;
        }
        & > div {
          display: flex;
          align-items: center;
        }
      }
      /deep/ .van-image--round {
        width: 45px;
        height: 45px;
        margin-right: 10px;
      }
      /deep/ .van-icon {
        font-size: 14px;
        color: #999;
      }
    }
    /deep/ .van-cell {
      padding: 25px 0px;
      border-bottom: 1px solid #e8e8e8;
    }
    /deep/ .van-cell__title {
      color: #444444;
      font-size: 18px;
    }
    /deep/ .van-cell__value {
      color: #999;
      font-size: 16px;
    }
    /deep/ .van-cell:not(:last-child)::after {
      border: 0px;
    }
    /deep/ .van-icon {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
