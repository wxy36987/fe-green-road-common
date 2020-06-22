<template>
  <div class="payInfo">
    <!-- <div class="title">停车缴费</div> -->
    <!-- <div class="orderSign">我的停车缴费信息(订单号：{{ orderSign }})</div> -->
    <div class="carPlate">车牌号：{{ carPlate }}</div>
    <div class="address">停车场：{{ address }}</div>
    <div class="intoTime">
      车辆入场时间：{{ intoTime | dateFrm("YYYY-MM-DD HH:mm") }}
    </div>
    <div class="endtime">
      计费截止时间：{{ endTime | dateFrm("YYYY-MM-DD HH:mm") }}
    </div>
    <div class="time">停车时长：{{ time }}</div>
    <div class="rule">收费规则：{{ rule }}</div>
    <div class="payNum">待缴停车费{{ payNum }}</div>
    <div class="payButton" @click="payNow">立即支付</div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
export default {
  data() {
    return {
      orderTrade: "",
      carPlate: "",
      address: "",
      intoTime: 0,
      endTime: 0,
      intoTimeStr: "",
      endTimeStr: "",
      time: "",
      rule: "",
      payNum: "",
      isAlipay: false, //支付宝or微信
      aliPaySign: "",
      wechatPayInfo: {},
      code: "",
      openID: "",
      wxDebugData: {},
    };
  },
  mounted() {
    if (window.location.href.indexOf("?#") < 0) {
      window.location.href = window.location.href.replace("#", "?#");
    }

    this.getAppClient();
  },
  created() {
    this.getAppClient();
    this.setData();
  },
  methods: {
    setData() {
      this.orderTrade = this.$route.query.orderTrade;
      this.carPlate = this.$route.query.carPlate;
      this.address = this.$route.query.address;
      this.intoTime = this.$route.query.intoTime;
      this.endTime = Date.parse(new Date());
      this.intoTimeStr = this.$route.query.intoTimeStr;
      this.endTimeStr = this.$route.query.endTimeStr;
      this.rule = this.$route.query.rule;
      var totalSeconds =
        (this.$route.query.endTime - this.$route.query.intoTime) / 1000;
      var min = parseInt((totalSeconds / 60) % 60);
      var hour = parseInt(totalSeconds / 3600.0);
      if (hour > 0) {
        this.time = hour + "小时" + min + "分";
      } else {
        this.time = min + "分";
      }
      var number = this.$route.query.payNum / 100.0;
      this.payNum = number + "元";
      // if (!this.isAlipay) {
      // 	this.getWxDebugData();
      // }
    },
    payNow: function() {
      if (this.isAlipay) {
        this.getAliPayInfo();
      } else {
        this.getWechatPayInfo();
        // this.getWeChatOpenID();
      }
    },
    getAliPayInfo: function() {
      let params = { carPlate: this.carPlate };
      var that = this;
      this.$http
        .post("/appserver/v1/carPark/aliPay", qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            that.aliPaySign = data.data.data;
            this.alipayNow();
          } else if (data.data.errorcode === 6006) {
            this.$toast("免费停车");
            this.payComplete();
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    /* eslint-disable */

    getWechatPayInfo: function() {
      var openID = this.getCookie("w_open_id");
      console.log(openID);
      let params = {
        carPlate: this.carPlate,
        tradeType: "3",
        openId: openID,
      };
      var that = this;
      this.$http
        .post("/appserver/v1/carPark/wxPay", qs.stringify(params))
        .then((data) => {
          // eslint-disable-next-line
          console.log(data);
          if (data.data.ret === 0) {
            that.wechatPayInfo = data.data.data;
            that.wechatPayNow();
          } else if (data.data.errorcode === 6006) {
            this.$toast("免费停车");
            this.payComplete();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // 判断这个cookie的参数名是不是我们想要的
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },
    /**********调用支付宝支付，使用支付宝JSApi**********/

    alipayNow() {
      // eslint-disable-next-line
      var that = this;
      ap.tradePay(
        {
          orderStr: this.aliPaySign,
        },
        function(res) {
          // eslint-disable-next-line
          // ap.alert(res.resultCode);
          if (res.resultCode == 9000) {
            //支付成功
            that.payComplete();
          }
          switch (res.resultCode) {
            case 4000:
              //支付失败
              // eslint-disable-next-line
              ap.alert("支付失败");
              break;
            case 6001:
              //支付取消
              // eslint-disable-next-line
              ap.alert("取消支付");
              break;
            case 6002:
              //网络错误
              // eslint-disable-next-line
              ap.alert("支付失败");
              break;
            default:
              break;
          }
        }
      );
    },
    wechatPayNow() {
      var that = this;
      console.log("appid = " + this.wechatPayInfo.appid);
      console.log("timestamp = " + this.wechatPayInfo.timestamp);
      console.log("nonceStr = " + this.wechatPayInfo.noncestr);
      console.log("sign = " + this.wechatPayInfo.sign);
      console.log("packages = " + this.wechatPayInfo.packages);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: this.wechatPayInfo.appid, // 必填，公众号的唯一标识
        timestamp: this.wechatPayInfo.timestamp, // 必填，生成签名的时间戳
        nonceStr: this.wechatPayInfo.noncestr, // 必填，生成签名的随机串
        signature: this.wechatPayInfo.sign, // 必填，签名
        jsApiList: ["chooseWXPay"], // 必填，需要使用的JS接口列表
      });

      wx.ready(function() {
        wx.chooseWXPay({
          timestamp: that.wechatPayInfo.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: that.wechatPayInfo.noncestr, // 支付签名随机串，不长于 32 位
          package: that.wechatPayInfo.packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: that.wechatPayInfo.sign, // 支付签名
          success: function(res) {
            that.payComplete();
          },
          cancle: function(res) {
            alert("支付取消");
          },
          fail: function(res) {
            alert("支付失败");
          },
        });
      });
    },
    payComplete() {
      localStorage.removeItem("tfgreenroadPriviteKey");
      this.$router.push({
        path: "parkingPayComplete",
        query: {
          orderSign: this.carPlate,
        },
      });
    },
    getWxDebugData() {
      // this.$http
      // 	.post(
      // 		`/appserver/v1/user/get_jsapi_config?url=${encodeURIComponent(
      // 			location.href.split('#')[0]
      // 		)}&jsapi=${this.$cookie.get('w_skey')}`
      // 	)
      // 	.then(data => {
      // 		this.wxDebugData = JSON.parse(data.data.data.jsapi_config);
      // 		wx.config({
      // 			debug: this.wxDebugData.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      // 			appId: 'wx4028829e469cca48', // 必填，公众号的唯一标识
      // 			timestamp: this.wxDebugData.timestamp, // 必填，生成签名的时间戳
      // 			nonceStr: this.wxDebugData.nonceStr, // 必填，生成签名的随机串
      // 			signature: this.wxDebugData.signature, // 必填，签名
      // 			jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
      // 		});
      // 		wx.ready(function() {
      // 		});
      // 		wx.error(function(res) {
      // 			console.log(res);
      // 			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      // 		});
      // 	});
    },
    getAppClient() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.isAlipay = false;
        this.getWxDebugData();
        console.log("微信支付");
        // alert('微信支付');
      } else if (ua.match(/AlipayClient/i) == "alipayclient") {
        console.log("支付宝支付");
        // alert('支付宝支付');
        this.isAlipay = true;
      } else {
        console.log("其他app");
      }
    },
  },
};
</script>

<style scoped>
body {
  padding: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 89, 89, 1);
  align-items: center;
}
div {
  /* height: 36px; */
  margin-top: 10px;
  font-size: 14px;
}
/* .title{
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        text-align: center;
        width: 100%;
    } */
.orderSign {
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  margin-top: 20px;
  font-size: 14px;
  height: 36px;
}
.payInfo {
  /* height: 100%;
        width: 100%; */
  margin: 20px;
}
.payNum {
  color: #ff725f;
}
.payButton {
  height: 40px;
  background: rgba(23, 131, 87, 1);
  border-radius: 2px;
  font-size: 15px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 40px;
  text-align: center;
  /* bottom: 20px;
        left: 20px;
        right: 20px; */
}
</style>
