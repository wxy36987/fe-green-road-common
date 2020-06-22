<template>
  <div class="enroll">
    <div class="wrap" v-if="successShow">
      <div class="input-item">
        <p>
          <span>昵称</span>
        </p>
        <van-field v-model="nickname" />
      </div>
      <div class="input-item">
        <p>
          <span>联系电话</span>
          <i>(必填)</i>
        </p>
        <van-field
          v-model="phone"
          type="number"
          placeholder="您的手机号码"
          @input="InputBlur()"
        />
      </div>
      <div class="input-item">
        <p>
          <span>姓名</span>
        </p>
        <van-field
          v-model="name"
          placeholder="您的真实姓名"
          @input="InputBlur()"
        />
      </div>
      <div class="input-item">
        <p>
          <span>性别</span>
        </p>
        <van-radio-group v-model="radio">
          <van-radio name="1">
            男
            <img
              width="15px"
              height="16px"
              slot="icon"
              slot-scope="props"
              :src="props.checked ? activeIcon : inactiveIcon"
            />
          </van-radio>
          <van-radio name="2">
            女
            <img
              width="15px"
              height="16px"
              slot="icon"
              slot-scope="props"
              :src="props.checked ? activeIcon : inactiveIcon"
            />
          </van-radio>
        </van-radio-group>
      </div>
      <div class="input-item">
        <p>
          <span>邮箱</span>
        </p>
        <van-field
          v-model="mail"
          placeholder="example@xx.com"
          @input="InputBlur()"
        />
      </div>
      <!-- <div class="btn" v-if="nextBtn">
				<van-button color="#F1F1F1">下一步</van-button>
			</div> -->
      <!-- <div class="btn w-color" v-if="!nextBtn"> -->
      <div class="btn w-color">
        <van-button color="#188357" @click="Next()" v-if="!WXShow"
          >下一步</van-button
        >
      </div>
      <div class="btn w-color">
        <van-button color="#188357" @click="NextWx()" v-if="WXShow"
          >下一步</van-button
        >
      </div>
    </div>
    <div class="submit-success" v-if="!successShow">
      <van-image :src="enrollIcon" width="200px" height="200px"></van-image>
      <p>报名资料提交成功，报名结果将在活动开始前通过邮件或电话通知您</p>
      <div class="btn w-color">
        <van-button color="#188357" @click="DetermineBtn()" v-if="!WXShow"
          >确&nbsp; 定</van-button
        >
      </div>
      <div class="btn w-color">
        <van-button color="#188357" @click="DetermineBtnWx()" v-if="WXShow"
          >确&nbsp; 定</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      enrollTitle: this.$route.query.name, // 报名表名称
      nickname: "", // 昵称
      phone: "", // 电话
      name: "", // 姓名
      radio: "", // 性别
      activeIcon: require("../../assets/iconImage/yes_radio@2x.png"),
      inactiveIcon: require("../../assets/iconImage/no_radio@2x.png"),
      mail: "", // 邮箱
      nextBtn: true,
      enrollIcon: require("../../assets/iconImage/baoming@2x.png"),
      successShow: true,
      WXShow: true,
      WxUid: "",
      session_id: this.$route.query.session_id,
    };
  },
  created() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.WXShow = true;
      //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      var dataParams = {
        wxa_session_id: this.session_id,
      };
      this.$http
        .post(`/appserver/v1/user/get_auth_data`, qs.stringify(dataParams))
        .then((data) => {
          if (data.data.ret === 0) {
            var _data = data.data.data;
            this.nickname = _data.nickname;
            this.phone = _data.mobile;
            this.radio = "";
            this.name = _data.real_name;
            this.mail = _data.email;
            this.WxUid = _data.uid;
          }
        });
      document.title = this.$route.query.name + "报名表";
    } else {
      this.WXShow = false;
      this.commonGetUserInfo((userInfo) => {
        this.phone = userInfo.phone;
        this.nickname = userInfo.username;
        this.radio = userInfo.radio;
      });
      document.title = this.$route.query.name + "报名表";
      window.wii.app.invoke("setTitle", this.$route.query.name + "报名表");
      window.wii.app.invoke("showNativeBar", true);
    }
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", this.$route.query.name + "报名表");
    };
  },
  methods: {
    InputBlur() {
      if (this.nickname !== "" && this.phone !== "" && this.name !== null) {
        this.nextBtn = false;
      } else {
        this.nextBtn = true;
      }
    },
    // 下一步
    Next() {
      if (!/^1[34578]\d{9}$/.test(this.phone)) {
        this.$toast("请填写正确手机号码!");
        return false;
      }
      // if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.mail))) {
      //   this.$toast("请填写正确邮箱!")
      //   return false
      // }
      if (
        this.radio === null ||
        this.radio === undefined ||
        this.radio === ""
      ) {
        this.radio = "";
      }
      var data = {
        userId: this.uid,
        activityId: this.$route.query.id,
        name: this.name,
        nickName: this.nickname,
        sex: this.radio,
        contactTel: this.phone,
        email: this.mail,
      };

      //接入提交报名信息接口
      this.$http.post(`/appserver/v1/activity/save`, data).then((data) => {
        if (data.data.ret === 0) {
          this.successShow = false;
        } else {
          this.$toast(data.data.msg);
        }
      });
    },
    // 确定
    DetermineBtn() {
      this.$router.push({
        path: "/activityDetail",
        query: {
          id: this.$route.query.id,
          type: 1,
          from: "web",
          isShareWeb: false,
        },
      });
    },
    // 下一步
    NextWx() {
      if (!/^1[34578]\d{9}$/.test(this.phone)) {
        this.$toast("请填写正确手机号码!");
        return false;
      }
      // if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.mail))) {
      //   this.$toast("请填写正确邮箱!")
      //   return false
      // }
      // eslint-disable-next-line
      console.log(this.radio, 555);
      if (this.radio == undefined) {
        // eslint-disable-next-line
        console.log(this.radio, "44");
        this.radio = "";
      }
      var data = {
        userId: this.WxUid,
        activityId: this.$route.query.id,
        name: this.name,
        nickName: this.nickname,
        sex: this.radio,
        contactTel: this.phone,
        email: this.mail,
      };

      //接入提交报名信息接口
      this.$http.post(`/appserver/v1/activity/save`, data).then((data) => {
        if (data.data.ret === 0) {
          this.successShow = false;
        } else {
          this.$toast(data.data.msg);
        }
      });
    },
    // 确定
    DetermineBtnWx() {
      var urlWX = `${this.domain}activityDetail?id=${
        this.$route.query.id
      }&session_id=${this.session_id}`;
      // eslint-disable-next-line
      wx.miniProgram.navigateTo({
        url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
          urlWX
        )}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.enroll {
  width: 100%;
  height: 100%;
  position: relative;
  .wrap {
    padding: 0 20px;
    .input-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      min-height: 60px;
      /deep/ .van-cell {
        padding-left: 0px;
        padding-right: 0px;
        width: 240px;
      }
      /deep/ .van-radio-group {
        width: 240px;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      /deep/ .van-radio {
        &:nth-of-type(1) {
          margin-right: 20px;
        }
      }
      & > p {
        width: 130px;
        display: flex;
        align-items: center;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(55, 56, 77, 1);
        & > i {
          font-size: 11px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          margin-left: 6px;
        }
      }
      .span-1 {
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 ~ 18 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10 ~ 11 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      ::-ms-input-placeholder {
        /* Microsoft Edge */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }

      ::placeholder {
        /* 大部分现代浏览器 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
    }
    .btn {
      width: 100%;
      margin-top: 70%;
      width: 100%;
      box-sizing: border-box;
      /deep/ .van-button {
        width: 100%;
        border: 0px;
        height: 40px;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(153, 153, 153, 1);
      }
    }
    .w-color {
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
  .submit-success {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 55px;
    p {
      width: 234px;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(155, 155, 155, 1);
      line-height: 25px;
      text-align: center;
      margin-top: 14px;
    }
    .btn {
      position: fixed;
      bottom: 30px;
      left: 0px;
      padding: 0 20px;
      width: 100%;
      box-sizing: border-box;
      /deep/ .van-button {
        width: 100%;
        border: 0px;
        height: 40px;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
}
</style>
