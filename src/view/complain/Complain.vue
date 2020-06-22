<template>
  <div class="complain">
    <div class="content">
      <div id="map" class="complain-map"></div>
      <div class="top">
        <van-image :src="timeIcon" width="20" height="20"> </van-image>
        投诉受理时间：08:30~18:30
      </div>
      <div class="type">
        <div class="online type-item" @click="goComplain()">
          <van-image :src="onlineIcon" width="70" height="70"> </van-image>
          <p>在线投诉</p>
        </div>
        <div class="phone type-item">
          <van-image
            :src="offlineIcon"
            width="70"
            height="70"
            @click="showTellist"
            :disabled="pDisabled"
          ></van-image>
          <p>电话投诉</p>
        </div>
        <van-action-sheet
          v-model="show"
          :actions="option1"
          @select="onSelect"
          @click-overlay="clickOverlay"
          :round="ifRound"
          description="请拨打投诉对象所属园区电话"
        />
      </div>
      <div class="aLine"></div>
      <div class="position-title">
        <van-image :src="positionIcon" width="20" height="20"> </van-image>
        {{ locationDetails }}
      </div>
      <div class="exa-list">
        <p>常见问题</p>
        <ul>
          <li
            class="list-item "
            v-for="(item, index) in quesList"
            :data-type="0"
            :key="index"
          >
            <div class="wrap">
              <div class="exa-title">{{ item.content }}</div>
              <div class="exa-aply" @click="goComplaindetail(item)">
                去投诉
                <van-icon name="arrow" slot="right" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="imgtextbtn-style" @click="goToMyComplain">
        <img :src="mycomplainIcon" />
        <span>我的投诉</span>
      </div>
    </div>
    <empty ref="emptyView" :emptyShow="emptyShow"></empty>
  </div>
</template>
<script>
/* eslint-disable */
import { Dialog } from "vant";
import qs from "qs";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      timeIcon: require("../../assets/iconImage/time.png"), // 位置图标
      onlineIcon: require("../../assets/iconImage/complainonline.png"), // 位置图标
      offlineIcon: require("../../assets/iconImage/complainoffline.png"), // 位置图标
      quesList: [],
      option1: [],
      telType: false,
      show: false,
      ifRound: false,
      greenwayIn: false,
      scenicId: "",
      lat: "30.56979",
      lng: "104.05453",
      positionIcon: require("../../assets/iconImage/ic_combined_shape@2x.png"),
      locationDetails: "",
      range: "100000",
      telStr: "",
      tellData: {
        code: 3,
        msg: "",
      },
      pDisabled: true,
      initAddres: {
        areaNote: false,
        name: "",
        value: "",
      },
      emptyShow: false,
      mycomplainIcon: require("../../assets/iconImage/ic_complain@2x.png"),
    };
  },
  created() {
    if (this.uid) {
      this.getQueslist();
      window.wii.app.invoke("setTitle", "投诉");
      window.wii.app.invoke("showNativeBar", true);
    } else {
      window.wii.app.invoke("login", {
        callback: "",
      });
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  mounted() {
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
      this.initMap(); // 地图
      this.init();
    });
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "投诉");
    };
  },
  methods: {
    getQueslist() {
      this.$http.get(`/appserver/v1/complaint/complainProblem`).then((data) => {
        this.quesList = data.data.data;
      });
    },
    init() {
      this.searchLocation();
      this.getTell();
    },
    goComplain() {
      if (this.pDisabled) {
        return false;
      }
      /* eslint-disable */
      this.$router.push({
        path: "/complainSubmit",
        query: {
          item: "",
          greenwayIn: this.greenwayIn,
          scenicId: this.scenicId,
          initAddres: this.initAddres,
          option1: this.option1,
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}complainSubmit?item=''&greenwayIn=${this.greenwayIn}&scenicId=${this.scenicId}`,
      // 	isFullScreen: 0,
      // 	setTitle: '投诉',
      // 	needLoading: 0
      // });
    },
    goComplaindetail(item) {
      if (this.pDisabled) {
        return false;
      }

      this.$router.push({
        path: "/complainSubmit",
        query: {
          item: item,
          greenwayIn: this.greenwayIn,
          scenicId: this.scenicId,
          initAddres: this.initAddres,
          option1: this.option1,
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}complainSubmit?item=${item}&greenwayIn=${this.greenwayIn}&scenicId=${this.scenicId}`,
      // 	isFullScreen: 0,
      // 	setTitle: '投诉',
      // 	needLoading: 0
      // });
    },
    showTellist() {
      if (this.tellData.code === 0) {
        Dialog.alert({
          message: this.tellData.msg,
          closeOnPopstate: true,
          closeOnClickOverlay: true,
          confirmButtonColor: "#178357",
          confirmButtonText: "拨号",
        }).then(() => {
          window.location.href = "tel://" + this.tellData.msg;
        });
      } else if (this.tellData.code === 1) {
        this.$toast({
          message: this.tellData.msg,
          duration: "5000",
        });
      } else if (this.tellData.code === 2) {
        this.noIncludeScenic();
      }
    },
    getTell() {
      this.scenicId = this.$route.query.scenicId;
      if (this.scenicId != null && this.scenicId != undefined) {
        this.greenwayIn = true;
      } else {
        this.greenwayIn = false;
      }
      if (this.greenwayIn) {
        let param = {
          resourceId: this.scenicId,
        };
        this.$http
          .post("/appserver/v1/help/contactTel", qs.stringify(param))
          .then((data) => {
            this.pDisabled = false;
            if (data.data.ret === 0) {
              if (data.data.data === null) {
                this.tellData.code = 1;
                this.tellData.msg = data.data.msg;
              } else {
                let tel = data.data.data;
                this.tellData.code = 0;
                this.tellData.msg = tel;
              }
            } else {
              this.tellData.code = 1;
              this.tellData.msg = "该园区暂未提供电话求助服务";
            }
          });
      } else {
        this.tellData.code = 2;
        this.pDisabled = false;
      }
      this.$http
        .get(`/appserver/v1/complaint/findGarden?range=${this.range}`, {
          headers: {
            latitude: this.lat || 30.56979, //纬度
            longitude: this.lng || 104.05453, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            if (data.data.data) {
              for (let i = 0; i < data.data.data.scenicList.length; i++) {
                if (
                  this.option1.length <=
                  data.data.data.scenicList.length - 1
                ) {
                  this.option1.push({
                    name: data.data.data.scenicList[i].scenic,
                    value: data.data.data.scenicList[i].poiId,
                  });
                }
                if (this.scenicId === data.data.data.scenicList[i].scenicId) {
                  this.initAddres.areaNote = true;
                  this.initAddres.name = data.data.data.scenicList[i].scenic;
                  this.initAddres.value = data.data.data.scenicList[i].poiId;
                }
              }
            }
          }
        });
    },
    onSelect(item) {
      /* eslint-disable */
      console.log(item.tel);
    },
    clickOverlay() {
      this.telType = false;
    },
    /* eslint-disable */
    initMap() {
      var myLatlng = new qq.maps.LatLng(
        this.lat || 30.56979,
        this.lng || 104.05453
      );
      var map = new qq.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 16,
        zoomControl: false,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: false,
      });
      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: map,
      });
      var anchor = new qq.maps.Point(0, 39),
        size = new qq.maps.Size(45, 45),
        origin = new qq.maps.Point(0, 0),
        markerIcon = new qq.maps.MarkerImage(
          "https://3gimg.qq.com/lightmap/api_v2/2/4/99/theme/default/imgs/marker.png",
          size,
          origin,
          anchor
        );
      marker.setIcon(markerIcon);
    },
    searchLocation() {
      /* eslint-disable */
      $.ajax({
        type: "get",
        url: "https://apis.map.qq.com/ws/geocoder/v1",
        dataType: "jsonp",
        data: {
          key: "LJKBZ-2WTRW-JT7RQ-OSONW-ZO6X7-ZMFMG", //开发密钥
          location: `${this.lat || 30.7288},${this.lng || 103.97373}`, //位置坐标
          get_poi: "1", //是否返回周边POI列表：1.返回；0不返回(默认)
          coord_type: "1", //输入的locations的坐标类型,1 GPS坐标
          output: "jsonp",
        },
        success: (data) => {
          if (data.result.address !== undefined) {
            this.locationDetails = data.result.address;
          }
        },
      });
    },
    noIncludeScenic() {
      Dialog.alert({
        message: "您不在园区内，无法电话投诉",
        closeOnPopstate: true,
        closeOnClickOverlay: true,
        confirmButtonColor: "#178357",
      }).then(() => {});
    },
    goToMyComplain() {
      // this.$router.push({
      //   path: "/myComplain",
      // });
      window.wii.app.invoke("openWindow", {
        openUrl: `${this.domain}myComplain`,
        isFullScreen: 0,
        setTitle: "",
        needLoading: 1,
      });
    },
  },
  components: {
    empty,
  },
};
</script>
<style src="../../common/css/imgtextbutton.css" scoped></style>
<style lang="scss" scoped>
.complain {
  font-size: 14px;
  .content {
    .complain-map {
      width: 100%;
      height: 50vw;
    }
    .top {
      text-align: center;
      color: #178357;
      border-bottom: 1px solid #f8f8f8;
      padding-top: 20px;
      padding-bottom: 25px;
      display: flex;
      justify-content: center;
      .van-image {
        margin-right: 10px;
      }
    }

    .type {
      display: flex;
      margin-top: 15px;
      .online {
        flex: 1;
        flex: 1;
        justify-content: center;
        text-align: center;
      }
      .phone {
        flex: 1;
        flex: 1;
        justify-content: center;
        text-align: center;
      }
      .type-item {
        color: #b3b3b3;
      }
    }
    .aLine {
      background-color: #e6e3e3;
      height: 1px;
      margin-left: 15px;
      margin-right: 15px;
      margin-top: 15px;
    }
    .position-title {
      text-align: left;
      color: #565a5a;
      border-bottom: 10px solid #f8f8f8;
      padding: 15px;
      display: flex;
      justify-content: left;
      .van-image {
        margin-right: 10px;
      }
    }
    .exa-list {
      margin: 20px;
      p {
        color: #37384d;
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 13px;
        border-bottom: 1px solid #e8e8e8;
      }
      li {
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: 20px;
        padding-top: 20px;
        color: #838686;
      }
    }
    .wrap {
      display: flex;
      .exa-aply {
        flex: 1;
        display: flex;
        color: #9c9c9c;
        justify-content: flex-end;
        position: relative;
        padding-right: 28px;
        i {
          position: absolute;
          bottom: 0;
          font-size: 20px;
          right: 0;
        }
      }
    }
  }
}
</style>
