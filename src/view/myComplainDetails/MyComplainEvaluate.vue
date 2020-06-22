<template>
  <div class="mycomplain-evaluate">
    <div class="header">
      <van-nav-bar title="投诉评价" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content" v-if="scuessShow">
      <p>您对本次投诉处理结果</p>
      <ul>
        <li>
          <van-image
            :src="pjIcon_2"
            width="33px"
            height="33px"
            v-if="veryPleased"
            @click="Pleased(1)"
          ></van-image>
          <van-image
            :src="pjxIcon_1"
            width="33px"
            height="33px"
            v-if="!veryPleased"
            @click="Pleased(1)"
          ></van-image>
          <p>非常满意</p>
        </li>
        <li>
          <van-image
            :src="pjIcon_2"
            width="33px"
            height="33px"
            v-if="pleased"
            @click="Pleased(2)"
          ></van-image>
          <van-image
            :src="pjxIcon_2"
            width="33px"
            height="33px"
            v-if="!pleased"
            @click="Pleased(2)"
          ></van-image>
          <p>满意</p>
        </li>
        <li>
          <van-image
            :src="pjIcon_3"
            width="33px"
            height="33px"
            v-if="noPleased"
            @click="Pleased(3)"
          ></van-image>
          <van-image
            :src="pjxIcon_3"
            width="33px"
            height="33px"
            v-if="!noPleased"
            @click="Pleased(3)"
          ></van-image>
          <p>不满意</p>
        </li>
      </ul>
      <div>
        <van-field
          v-model="message"
          rows="3"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请填写您对本次投诉处理的评价"
          show-word-limit
        />
      </div>
    </div>
    <div class="footer" v-if="scuessShow">
      <van-button class="cancel" @click="Submit()" :disabled="disabledFbBtn">
        <p>提交</p>
      </van-button>
    </div>
    <div class="success" v-if="!scuessShow">
      <van-image :src="scuessIcon" width="92px" height="92px"></van-image>
      <div>
        <p>提交成功，</p>
        <p>您的评价会让我们做的更好</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      pjIcon_3: require("../../assets/iconImage/pingjia1@3x.png"),
      pjIcon_1: require("../../assets/iconImage/pingjia2@3x.png"),
      pjIcon_2: require("../../assets/iconImage/pingjia3@3x.png"),
      pjxIcon_3: require("../../assets/iconImage/ic_nsf_de@2x.png"),
      pjxIcon_2: require("../../assets/iconImage/ic_nsf_dex@2x.png"),
      pjxIcon_1: require("../../assets/iconImage/pingjia2@3x.png"),
      message: "",
      scuessIcon: require("../../assets/iconImage/ic-status-success@2x.png"),
      veryPleased: false,
      pleased: true,
      noPleased: true,
      index: 1,
      scuessShow: true,
      disabledFbBtn: false,
    };
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //
    Pleased(index) {
      this.index = index;
      if (index == 1) {
        this.veryPleased = false;
        this.pleased = true;
        this.noPleased = true;
      } else if (index == 2) {
        this.veryPleased = true;
        this.pleased = false;
        this.noPleased = true;
      } else {
        this.veryPleased = true;
        this.pleased = true;
        this.noPleased = false;
      }
    },
    // 提交
    Submit() {
      this.disabledFbBtn = true;
      this.$http
        .get(
          `/appserver/v1/complaint/comment?id=${this.$route.query.id}&score=${
            this.index
          }&evaluation=${this.message}`
        )
        .then((data) => {
          this.disabledFbBtn = false;
          if (data.data.ret == 0) {
            this.scuessShow = false;
            setTimeout(() => {
              this.$router.go(-1);
            }, 10000);
          } else {
            this.scuessShow = true;
          }
        })
        .catch((error) => {
          this.disabledFbBtn = false;
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mycomplain-evaluate {
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
  .content {
    padding: 20px;
    padding-top: 46px;
    & > p {
      font-size: 15px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      margin-top: 10px;
    }
    ul {
      margin-top: 32px;
      display: flex;
      justify-content: space-around;
      li {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        p {
          margin-top: 7px;
          width: 100%;
          text-align: center;
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
    /deep/ .van-cell {
      width: 100%;
      margin-top: 30px;
      border: 1px solid #e8e8e8;
    }
  }
  .footer {
    position: fixed;
    bottom: 0px;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    /deep/ .van-button {
      border: 0px;
      height: 40px;
      width: 100%;
      background: #178357;
      span {
        font-size: 15px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .success {
    padding-top: 46px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    div {
      width: 100%;
      margin-top: 24px;
      p {
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 20px;
      }
    }
  }
}
</style>
