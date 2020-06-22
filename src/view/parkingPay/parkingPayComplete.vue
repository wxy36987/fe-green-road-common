<template>
  <div class="parkingPayComplete">
    <div class="header" ref="headbarparking">
      <img :src="headerImage" alt="" class="headerImage" />
      <div class="headerTitle">支付成功</div>
    </div>
    <div class="line"></div>
    <div class="messageView">
      <div class="orderSign">订单号：{{ orderSign }}</div>
      <div class="collect">收款方：{{ collet }}</div>
      <div class="totalNum">总费用：{{ payNum }}</div>
      <div class="status">支付状态：{{ payStatus }}</div>
      <div class="payFunc">支付详情：{{ payFunction }}</div>
      <div class="payNum">实际支付：{{ payNum }}</div>
      <div class="payTime">
        付款时间：{{ time | dateFrm("YYYY-MM-DD HH:mm") }}
      </div>
    </div>
    <div class="footerView">
      <div class="footerLine"></div>
      <div class="footerMsg">
        <strong>温馨提示：</strong>付款成功后，请您在<span class="footerTime"
          >15分钟</span
        >内驶离停车场， 否则您可能需要支付额外的超时费用。
      </div>
    </div>
    <empty
      ref="emptyView"
      :emptyShow="emptyShow"
      :style="{ top: emptyTop }"
    ></empty>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      headerImage: require("../../assets/iconImage/xuanze.png"),
      orderSign: "",
      collet: "",
      totalNum: "",
      payStatus: "",
      payFunction: "",
      payNum: "",
      time: "",
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  methods: {
    getOrderDetail(orderSign) {
      var params = { carPlate: orderSign };
      this.$http
        .post("/appserver/v1/carPark/getPayDetail", qs.stringify(params))
        .then((data) => {
          if (data.data.ret == 0) {
            this.orderSign = data.data.data["orderSn"];
            this.collet = data.data.data["address"];
            this.totalNum = data.data.data["orderMoney"];
            // var status =data.data.data['payStatus'];
            // if (status == 1) {
            this.payStatus = "支付成功";
            // }else{
            //     this.payStatus = "暂未支付"
            // }
            var payNum = data.data.data["payMoney"];
            this.payNum = payNum / 100 + "元";
            this.time = Date.parse(new Date());
            var payid = data.data.data["payId"];
            if (payid == 1) {
              this.payFunction = "微信支付";
            } else if (payid == 2) {
              this.payFunction = "支付宝支付";
            } else {
              this.payFunction = "现金";
            }
          }
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbarparking.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
  },
  created() {
    var order = this.$route.query.orderSign;
    this.getOrderDetail(order);
  },
  components: {
    empty,
  },
};
</script>

<style lang="scss" scoped>
body {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 89, 89, 1);
  line-height: 14px;
}
.header {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  height: 50px;
}
.headerImage {
  width: 30px;
  height: 30px;
}
.headerTitle {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(55, 56, 77, 1);
  line-height: 26px;
  margin-left: 10px;
}
.line {
  background-color: #e8e8e8;
  height: 1px;
  width: 100%;
  top: 0px;
}
.messageView {
  margin-top: 30px;
  margin: 30px 20px;
}
.messageView div {
  font-size: 14px;
  margin-top: 15px;
}
.footerView {
  margin-top: 30px;
}
.footerLine {
  background: #f8f8f8;
  height: 10px;
  width: 100%;
}
.footerMsg {
  margin: 30px 20px;
  font-size: 14px;
}
.footerTime {
  color: #ff725f;
}
</style>
