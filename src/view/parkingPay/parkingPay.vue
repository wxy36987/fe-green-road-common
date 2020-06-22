<template>
  <div class="parkingPay">
    <section class="header">
      <!-- <div class="title"><strong>停车缴费</strong></div> -->
      <div class="message">
        <span>温馨提示：</span
        >请选择您的车辆类型(燃油车/新能源)，输入完整的车牌号码，点击确认查询缴费信息。
      </div>
    </section>
    <div class="line"></div>
    <section class="typeView">
      <div class="carType"><strong>车辆类型</strong></div>
      <div class="car" @click="changeCarType('0')">
        <img :src="fuelCarImage" class="type" />
        <div>燃油车</div>
        <img
          :src="carType === '0' ? selectedCarTypeImage : unselectedCarTypeImage"
          class="select"
        />
      </div>
      <div class="car" @click="changeCarType('1')">
        <img :src="newEnergyCarImage" class="type" />
        <div>新能源车</div>
        <img
          :src="carType === '1' ? selectedCarTypeImage : unselectedCarTypeImage"
          class="select"
        />
      </div>
      <div class="inputView">
        <div class="province" @click="showProvinceView" id="tb0">
          {{ province }}
        </div>
        <div class="numberView" @click="focusHandler">
          <div class="tb-code" id="tb1">{{ carplateStr[1] }}</div>
          <!-- <input type="text" class="tb-code" id="tb0" /> -->
          <div class="point">.</div>
          <div class="tb-code" id="tb2">{{ carplateStr[2] }}</div>
          <div class="tb-code" id="tb3">{{ carplateStr[3] }}</div>
          <div class="tb-code" id="tb4">{{ carplateStr[4] }}</div>
          <div class="tb-code" id="tb5">{{ carplateStr[5] }}</div>
          <div class="tb-code" id="tb6">{{ carplateStr[6] }}</div>
          <div
            class="tb-code"
            id="tb7"
            :style="{
              background: carType === '0' ? 'rgba(248,248,248,1)' : '',
            }"
          >
            {{ carplateStr[7] }}
          </div>
        </div>
      </div>
      <!-- <input
        type="email"
        :maxlength="carType === '0' ? 6 : 7"
        id="hdcode"
        style="opacity: 0;"
        @keyup="keyupHandler"
        @blur="viewDefault"
      /> -->
      <!-- <div class="tapView" @click="onclose"></div> -->
    </section>
    <section class="footer">
      <button class="sureButton" @click="sureButtonClicked">确认</button>
    </section>
    <Keyboard
      :isShow="isShow"
      @exit="exit"
      @inputchange="getKey"
      :oinp="carplateStr"
      @ok="confirm"
      :keyBoardType="keyBoardType"
      :numberType="numberDisable"
    />
  </div>
</template>
<script>
// import BottomView from "./provinceView";
import Keyboard from "./carPlateKeyboard";
import qs from "qs";
export default {
  data() {
    return {
      fuelCarImage: require("../../assets/iconImage/fuelCar.png"),
      newEnergyCarImage: require("../../assets/iconImage/new_energy.png"),
      selectedCarTypeImage: require("../../assets/iconImage/selected.png"),
      unselectedCarTypeImage: require("../../assets/iconImage/un_selected.png"),
      province: "",
      // inputValue: "",
      carType: "0",
      isShow: false,
      isAlipay: false,
      code: "",
      openID: "",
      carplateStr: "",
      keyBoardType: 1,
      maxLength: 7,
      numberDisable: true,
      currentIndex: 0,
      lastIndex: 0,
    };
  },
  /* eslint-disable */

  methods: {
    exit() {
      this.isShow = false;
    },
    getKey(val) {
      if (
        this.carplateStr.length >= this.maxLength &&
        val != "delete" &&
        this.keyBoardType != 1
      ) {
        return false;
      }
      if (val == "delete") {
        this.carplateStr = this.carplateStr.slice(
          0,
          this.carplateStr.length - 1
        );
        if (this.carplateStr.length < 1) {
          this.keyBoardType = 1;
        }
        if (this.carplateStr.length <= 1) {
          this.numberDisable = false;
        } else {
          this.numberDisable = true;
        }
      } else {
        if (this.keyBoardType == 1) {
          if (this.carplateStr.length > 1) {
            this.carplateStr = this.carplateStr.slice(
              1,
              this.carplateStr.length
            );
            this.carplateStr = val + this.carplateStr;
          } else {
            this.carplateStr = val;
          }
          this.keyBoardType = 2;
        } else {
          this.carplateStr += val;
        }
        if (this.carplateStr.length <= 1) {
          this.keyBoardType = 2;
        }
        if (this.carplateStr.length < 2) {
          this.numberDisable = false;
        } else {
          this.numberDisable = true;
        }
      }
      this.keyupHandler();
    },
    confirm() {
      this.isShow = false;
    },
    delete() {
      this.carplateStr = this.carplateStr.slice(0, this.carplateStr.length - 1);
    },
    changeCarType: function(type) {
      this.carType = type;
      this.maxLength = this.carType === "0" ? 7 : 8;
      if (this.carplateStr.length > this.maxLength) {
        console.log(this.carplateStr.length);
        this.carplateStr = this.carplateStr.substring(0, 7);
      }
      // this.focusHandler();
    },
    viewDefault: function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    showProvinceView: function() {
      this.isShow = true;
      // if (this.carplateStr.length > 1) {
      //   this.keyBoardType = 2;
      // }else{
      this.keyBoardType = 1;
      this.currentIndex = 0;
      // }
    },
    onClose() {
      this.isShow = false;
    },
    setProvince(provinceStr) {
      this.province = provinceStr;
      this.focusHandler();
    },
    sureButtonClicked() {
      const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
      const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
      if (this.carplateStr.length <= 7 && !creg.test(this.carplateStr)) {
        this.$toast("请输入正确的车牌");
      } else if (
        this.carplateStr.length >= 8 &&
        this.carplateStr.length <= 10 &&
        !reg.test(this.carplateStr)
      ) {
        this.$toast("请输入正确的车牌");
      } else {
        this.getOrderData();
      }
    },
    // 键盘输入后自动切换焦点
    keyupHandler() {
      var code = this.carplateStr;
      console.log(this.carplateStr);
      this.maxLength = this.carType === "0" ? 7 : 8;
      this.province = this.carplateStr.substring(0, 1);
    },
    focusHandler() {
      if (this.province.length == 1 && this.carplateStr.length == 0) {
        this.carplateStr = this.province;
        this.numberDisable = false;
      }
      this.isShow = true;
      if (this.carplateStr.length < 1) {
        this.keyBoardType = 1;
      } else {
        this.keyBoardType = 2;
      }
    },
    getOrderData() {
      let params = { carPlate: this.carplateStr };
      this.$http
        .post("/appserver/v1/carPark/getPayInfo", qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            console.log(data.data);
            this.$router.push({
              path: "parkingPayInfo",
              query: {
                carPlate: data.data.data["carPlate"],
                address: data.data.data["address"],
                intoTime: data.data.data["inTime"],
                endTime: data.data.data["endTime"],
                rule: data.data.data["feeRule"],
                payNum: data.data.data["orderMoney"],
                endtimeStr: data.data.data["endTimeStr"],
                intoTimeStr: data.data.data["inTimeStr"],
                isAlipay: this.isAlipay,
                code: this.code,
                openID: this.openID,
              },
            });
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    /***微信获取授权的方法***/
    getCode() {
      console.log("执行了");
      var openID = this.getCookie("w_open_id");
      if (openID == null) {
        console.log("没有openid");
        window.location.href = `https://app.tfgreenroad.com/appserver/v1/user/authorize?redirect_uri=https%3A%2F%2Ffe.tfgreenroad.com%2Fh5%2F%23%2FparkingPay&state=${2}`;
      }
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
    getAppClient() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.isAlipay = false;
        if (process.env.NODE_ENV == "development") {
          return;
        } else {
          this.getCode();
        }
      } else if (ua.match(/AlipayClient/i) == "alipayclient") {
        this.isAlipay = true;
      } else {
        alert("请在微信或支付宝中打开");
      }
    },
  },
  components: {
    Keyboard,
  },
  mounted() {
    document.title = "停车缴费";
    if (window.location.href.indexOf("?#") < 0) {
      window.location.href = window.location.href.replace("#", "?#");
    }

    this.getAppClient();
  },
  watch: {
    carplateStr: function() {
      this.currentIndex = this.carplateStr.length;
    },
    currentIndex: function(val, oldVal) {
      console.log(val, oldVal);
      if (val < this.maxLength) {
        var el = document.getElementById("tb" + val);
        el.style.borderColor = "rgba(23, 131, 87, 1)";
      }
      // var last = index - 1;
      // var next = index + 1;
      // if (val >= 0 || val < this.maxLength-1) {
      //   var el1 = document.getElementById('tb'+val);
      //   el1.style.borderColor = 'rgba(23, 131, 87, 1)';
      // }
      var el2 = document.getElementById("tb" + oldVal);
      el2.style.borderColor = "rgba(234, 234, 234, 1)";
    },
  },
};
</script>
<style lang="scss" scoped>
.car-modal {
  max-height: 300px;
  background: #fff;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  .car-city {
    height: 60px;
    line-height: 60px;
    border-bottom: solid 1px #e8e8e8;
    font-size: 14px;
    font-weight: 400;
    color: rgba(85, 89, 89, 1);
  }
}
</style>
<style lang="scss" scoped>
.typeView {
  width: 100%;
  height: 150px;
}
.parkingPay {
  max-width: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .typeView {
    flex: 1;
    box-sizing: border-box;
    padding: 15px 15px 0px 20px;
    .carType {
      font-size: 16px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      line-height: 17px;
      margin-bottom: 5px;
    }
    .car {
      height: 60px;
      display: flex;
      align-items: center;
      border-bottom: solid 1px #e8e8e8;
      img:nth-of-type(1) {
        height: 30px;
        width: 30px;
        margin-right: 10px;
      }
      div {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        color: rgba(55, 56, 77, 1);
        line-height: 14px;
      }
      img:nth-of-type(2) {
        height: 18px;
        width: 18px;
      }
    }
  }
  .footer {
    box-sizing: border-box;
    margin-bottom: 50px;
    padding: 0 20px;
  }
  .line {
    height: 10px;
    background: rgba(248, 248, 248, 1);
    width: 100%;
  }
}
body {
  background-color: #f8f8f8;
  width: 80%;
}
.bottomView {
  height: 200px;
  width: 100%;
  background: red;
}
.header {
  background-color: white;
  padding: 15px 15px 0px 20px;
  margin-bottom: 15px;
  align-items: center;
  .title {
    text-align: center;
    width: 68px;
    height: 17px;
    font-size: 17px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: blod;
    color: rgba(55, 56, 77, 1);
    line-height: 17px;
  }
  .message {
    font-size: 14px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    color: rgba(85, 89, 89, 1);
    line-height: 14px;
    span {
      font-weight: bold;
      line-height: 32px;
    }
  }
}
.typeView {
  background-color: white;
  margin-top: 0px;
  width: 100%;
  .carType {
    // display: flex;
    /* height: 60px; */
    align-items: center;
    /* border-bottom: solid 1px #E8E8E8; */
    .type {
      width: 30px;
      height: 30px;
    }
    div {
      font-size: 14px;
      font-weight: bold;
      color: rgba(55, 56, 77, 1);
      margin-left: 10px;
      flex: 1;
    }
    .select {
      width: 18px;
      height: 18px;
      border-radius: 15px;
    }
  }
  .inputView {
    margin-top: 30px;
    height: 30px;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
    .province {
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      font-weight: 200;
      color: rgba(34, 34, 34, 1);
      box-sizing: border-box;
      border-radius: 2px;
      border: 1px solid rgba(23, 131, 87, 1);
      margin-right: 8px;
    }
    .numberView {
      display: flex;
      align-items: center;
    }
    .tb-code {
      height: 30px;
      width: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      font-weight: 200;
      color: rgba(34, 34, 34, 1);
      box-sizing: border-box;
      border-radius: 2px;
      border: 1px solid rgba(234, 234, 234, 1);
      margin-right: 8px;
    }
    .point {
      width: 6px;
      height: 6px;
      background: rgba(153, 153, 153, 1);
      color: rgba(153, 153, 153, 1);
      margin-right: 8px;
      border-radius: 3px;
    }
    // input:last-child{
    // 		margin-right: 0px;
    // }
  }
}
.sureButton {
  height: 40px;
  width: 100%;
  background: rgba(23, 131, 87, 1);
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  font-size: 15px;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
}
</style>
