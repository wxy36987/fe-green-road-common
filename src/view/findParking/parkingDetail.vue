<!--厕所详情-->
<template>
  <div class="page-content">
    <div class="park-content">
      <div class="park-img">
        <van-swipe :autoplay="3000">
          <van-swipe-item
            v-for="(item, index) in parkingDetail.cover_img"
            :key="index"
          >
            <van-image :src="item" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="park-title">{{ parkingDetail.carParkName }}</div>
      <div class="park-point">
        {{ getDistance(parkingDetail.distance) }} | {{ parkingDetail.address }}
      </div>
      <div class="park-fee" v-if="showFee">
        收费：{{ parkingDetail.tempRule.tempUnitTimeDto.cycleMoney }}元每{{
          showFee
        }}（不足半小时按半小时算）
      </div>
      <div class="park-fee" v-if="!showFee">
        收费：暂无收费信息
      </div>
      <div class="park-line">
        <div></div>
      </div>
      <div class="park-msg">
        <div class="msg-item">
          普通车位：{{ parkingDetail.tempSpaces }}&#8195;个
        </div>
        <div class="msg-item">
          充电车位：{{ parkingDetail.chargeSpaces }}&#8195;个
        </div>
        <div class="msg-item">
          当前闲置普通车位：{{ parkingDetail.tempResidue }}&#8195;个
        </div>
        <div class="msg-item">
          当前闲置充电车位：{{ parkingDetail.chargeRsidue }}&#8195;个
        </div>
      </div>
      <div class="park-line-height"></div>
      <div class="park-title">简介</div>
      <div class="park-point">{{ parkingDetail.desc }}</div>
    </div>
    <div class="park-bottom">
      <div class="park-btn" @click="toMap">去这里</div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// import { mapState, mapActions } from 'vuex'
import qs from "qs";
export default {
  data() {
    return {
      parkingDetail: {},
      latitude: "",
      longitude: "",
    };
  },
  computed: {
    showFee() {
      var detail = this.parkingDetail;
      if (
        detail.tempRule &&
        detail.chargeType === 4 &&
        detail.tempRule.tempUnitTimeDto
      ) {
        return detail.tempRule.tempUnitTimeDto.cycleTime === 60
          ? "小时"
          : "半小时";
      } else {
        return "";
      }
    },
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
    });
    //设置title
    window.wii.app.invoke("setTitle", "找停车场");
  },
  methods: {
    getDistance(dist) {
      if (dist === undefined) {
        return "  ";
      } else {
        if (dist < 1000) return `${dist.toFixed(2)}m`;
        else return `${(dist / 1000).toFixed(2)}km`;
      }
    },
    toWxT() {},
    initData() {
      var { latitude, longitude } = this.$route.query;
      var _data = {
        carParkId: this.$route.query.id,
        resource_id: this.$route.query.resource_id,
      };
      this.$http
        .post("/appserver/v1/carPark/getParkDetail", qs.stringify(_data), {
          headers: {
            latitude,
            longitude,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            this.parkingDetail = res.data ? res.data.data : {};
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    toMap() {
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${this.parkingDetail.parkLat},${this.parkingDetail.parkLng}`,
          mode: "driving",
          from_name: "当前位置",
          to_name: this.parkingDetail.carParkName,
        });
      }

      if (isIOS) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${this.parkingDetail.parkLat},${this.parkingDetail.parkLng}`,
          mode: "driving",
          from_name: "当前位置",
          to_name: this.parkingDetail.carParkName,
          to_address: this.parkingDetail.address,
        });
      }
    },
  },
  mounted() {
    //设置标题
    window.wii.app.invoke("setTitle", "找停车场");
    this.initData();
  },
};
</script>
<style lang="scss" scoped>
.page-content {
  .park-content {
    width: 100%;
    height: calc(100% - 80px);
    padding: 10px 0;
    box-sizing: border-box;
    overflow-y: auto;
    .park-img {
      box-sizing: border-box;
      padding: 0 20px;
      /deep/ .van-swipe-item {
        color: #fff;
        font-size: 10px;
        // line-height: 20px;
        text-align: center;
        // width: 100%;
        // height: 210px;
        //@warn background-color: #39a9ed;
      }
      /deep/ .van-swipe {
        height: 210px;
      }
      /deep/ .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .park-title {
      padding: 16px 20px;
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      line-height: 17px;
      box-sizing: border-box;
    }
    .park-point,
    .park-fee {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(85, 89, 89, 1);
      line-height: 15px;
      box-sizing: border-box;
      padding: 0 20px;
    }
    .park-point {
      padding-bottom: 20px;
    }
    .park-fee {
      color: #178357;
      margin: 12px 0px;
    }
    .park-tags {
      display: flex;
      flex-wrap: wrap;
      padding: 12px 20px 19px 20px;
      .tags-item {
        width: 75px;
        height: 35px;
        background: rgba(246, 246, 247, 1);
        border-radius: 2px;
        padding: 0 10px;
        text-align: center;
        line-height: 35px;
        box-sizing: border-box;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
        margin-right: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .park-line {
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      div {
        width: 100%;
        height: 1px;
        background: #e8e8e8;
      }
    }
    .park-line-height {
      width: 100%;
      height: 10px;
      background: #e8e8e8;
    }
    .park-msg {
      box-sizing: border-box;
      padding: 20px 20px;
      .msg-item {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
        line-height: 14px;
        &:not(:last-child) {
          margin-bottom: 12px;
        }
      }
    }
    .park-map {
      width: 100%;
      height: 180px;
      border-radius: 2px;
    }
  }
  .park-bottom {
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.1);
    .park-nav {
      img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(85, 89, 89, 1);
      line-height: 16px;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
    .park-btn {
      flex: 1;
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      text-align: center;
      background: rgba(23, 131, 87, 1);
      border-radius: 2px;
    }
  }
}
</style>
