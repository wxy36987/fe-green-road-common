<template>
  <div class="wx-page">
    <div v-if="loading" class="load-box">
      <van-loading size="24px">加载中...</van-loading>
    </div>
    <div class="search-box">
      <div class="search">
        <input
          class="input"
          placeholder="搜索目的地"
          @keyup.enter="searchHandle"
          v-model="inputVal"
          @input="searchHandle"
          id="input"
        />
      </div>
    </div>
    <div class="search-list-box" v-if="isList">
      <div class="none" v-if="searchData.length < 1"><span>无数据</span></div>
      <div class="list">
        <div
          class="item"
          v-for="item in searchData"
          :key="item.id"
          @tap="getParking(item)"
        >
          <span class="text">{{ item.title }}</span>
          <span class="go"
            >到这去<image class="img" src="../../assets/iconImage/dh@2x.png"
          /></span>
        </div>
      </div>
    </div>

    <div class="flex" :style="loading ? { display: 'none' } : {}" id="flex-box">
      <div class="map-box" @click="inputBlur()">
        <div id="map" class="map"></div>
        <div class="func-btn-box">
          <img
            @click="setFilter()"
            class="btn"
            src="../../assets/iconImage/parking-filter@2x.png"
          />
          <img
            class="btn"
            src="../../assets/iconImage/parking-current@2x.png"
            @click="toMapIcon"
          />
        </div>
      </div>
      <div class="info-box" v-if="isInfo">
        <div class="title-box">
          <span class="title">{{ currentPark.carParkName }}</span>
          <img
            @click="closeInfo()"
            class="img"
            src="../../assets/iconImage/parking-delete@2x.png"
          />
        </div>
        <div class="sub-title">
          <span
            >{{ getDistance(currentPark.distance || 0) }} |
            {{ currentPark.address }}</span
          >
          <!-- <span class='green'>asdfasdfas</span> -->
        </div>
        <div class="parking-info">
          <span>普通车位：{{ currentPark.tempSpaces }}个</span>
          <span>充电车位：{{ currentPark.chargeSpaces }}个</span>
          <span>当前闲置普通车位：{{ currentPark.tempResidue }}个</span>
          <span>当前闲置充电车位：{{ currentPark.chargeRsidue }}个</span>
        </div>
        <div class="btn-box">
          <span :class="['btn']" @click="goToDetail">详情</span>
          <span :class="['btn', 'current']" @click="toMap">去这里</span>
        </div>
      </div>
    </div>
    <div class="info-box" v-if="isFilter">
      <div class="title-box">
        <span class="title">停车场状态</span>
        <img
          @click="setFilter()"
          class="img"
          src="../../assets/iconImage/parking-delete@2x.png"
        />
      </div>
      <div class="radio-box">
        <van-radio-group class="radio-group" v-model="type">
          <van-cell-group>
            <van-cell
              class="item"
              :title="item.name"
              v-for="(item, ind) in parkingType"
              :key="ind"
            >
              <van-radio
                class="radio"
                checked-color="#07c160"
                slot="right-icon"
                :name="item.value"
                @click="radio = item.value"
              />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="btn-box">
        <span :class="['btn', 'current']" @click="filterParking">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
var redPack = require("../../assets/iconImage/redPark@3x.png");
var parkIcon = require("../../assets/iconImage/parking@2x.png");
export default {
  data() {
    return {
      inputVal: "",
      latitude: "29.594591741816267",
      longitude: "106.50308121655272",
      parkingList: [],
      parkingList1: [],
      currentPark: {},
      currentMarker: {},
      isInfo: false,
      isFilter: false,
      isList: false,
      parkingType: [
        {
          name: "全部停车场",
          value: "null",
        },
        {
          name: "只看有闲置车位停车场",
          value: "1",
        },
      ],
      type: "null",
      loading: true,
      markers: [],
      current: 0,
    };
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
      this.initMap();
      this.init();
      this.initData();
    });
    //设置title
    window.wii.app.invoke("setTitle", "找停车场");
  },
  components: {},
  destroyed() {
    this.map = null;
  },
  methods: {
    inputBlur() {
      document.getElementById("input").blur();
    },
    init() {
      this.$http
        .get(`/appserver/v1/api/home/detail`, {
          headers: {
            latitude: this.latitude || 30.575045991831505, //纬度
            longitude: this.longitude || 104.05059712158203, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            var _data = data.data.data;
            // 在绿道内
            if (_data.current === "1") {
              this.current = 1;
            } else {
              this.current = 0;
            }
          }
        });
    },
    /* eslint-disable */
    initData() {
      if (this.$route.query.latlng == 1) {
        this.latitude = this.$route.query.lat;
        this.longitude = this.$route.query.lng;
      } else {
        this.latitude = this.latitude;
        this.longitude = this.longitude;
      }
      var markers = [];
      this.$http({
        url: `/appserver/v1/carPark/listByLocation?${qs.stringify({
          type: this.type,
          radius: 3000000,
        })}`,
        headers: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.parkingList = res.data ? res.data.data : [];
            var bounds = new qq.maps.LatLngBounds();
            var myLatlng = "";
            var marker = "";
            this.parkingList.forEach((v, index) => {
              if (v.tempResidue < 10 || v.tempResidue < v.tempSpaces * 0.1) {
                myLatlng = new qq.maps.LatLng(v.parkLat, v.parkLng);
                marker = new qq.maps.Marker({
                  position: myLatlng,
                  map: this.map,
                });
                marker.setIcon(this.iconred);
                marker.setVisible(true);
                markers.push(marker);
                qq.maps.event.addListener(marker, "click", () => {
                  this.markerClick(markers[index], v);
                });
                if (index <= 9) {
                  bounds.extend(myLatlng);
                }
              } else {
                myLatlng = new qq.maps.LatLng(v.parkLat, v.parkLng);
                marker = new qq.maps.Marker({
                  position: myLatlng,
                  map: this.map,
                });
                marker.setIcon(this.icon);
                marker.setVisible(true);
                markers.push(marker);
                qq.maps.event.addListener(marker, "click", () => {
                  this.markerClick(markers[index], v);
                });
                if (index <= 9) {
                  bounds.extend(myLatlng);
                }
              }
            });
            if (this.parkingList.length > 0) {
              // bounds.extend(new qq.maps.LatLng(this.latitude, this.longitude));
              setTimeout(() => {
                this.map.fitBounds(bounds);
              }, 300);
            } else {
              this.map.setZoom(15);
            }
            this.markers = markers;
            if (
              sessionStorage.getItem("zoom") !== null &&
              sessionStorage.getItem("center") !== null
            ) {
              var zoom = sessionStorage.getItem("zoom");
              var center = sessionStorage.getItem("center").split(",");
              this.map.setZoom(parseInt(zoom));
              this.map.panTo(new qq.maps.LatLng(center[0], center[1]));
              sessionStorage.removeItem("zoom");
              sessionStorage.removeItem("center");
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    initData1() {
      this.$http({
        url: `/appserver/v1/carPark/listByLocation?${qs.stringify({
          type: this.type,
          radius: 1000000,
        })}`,
        headers: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      }).then((res) => {
        if (res.status === 200) {
          this.parkingList1 = res.data ? res.data.data : [];
        }
      });
    },
    searchHandle() {
      // console.log(this.inputVal);
      if (this.inputVal) {
        this.$router.push({
          path: "/parkingSearch",
          query: {
            inputVal: this.inputVal,
            latitude: this.latitude,
            longitude: this.longitude,
          },
        });
        // window.wii.app.invoke('openWindow', {
        // 	openUrl: `${this.domain}parkingSearch?inputVal=${this.inputVal}&latitude=${this.latitude}&longitude=${this.longitude}`,
        // 	isFullScreen: 0,
        // 	setTitle: '找停车场',
        // 	needLoading: 0
        // });
      }
    },
    filterParking() {
      var markers = this.markers;
      if (markers.length > 0) {
        markers.forEach((o) => {
          o.getMap(null);
        });
      }
      this.setFilter();
      this.initData();
    },
    setFilter() {
      this.isFilter = !this.isFilter;
      this.closeInfo();
    },
    /**
     * @description marker点击事件
     **/
    markerClick(marker, item) {
      if (this.currentPark.id === item.id) {
        this.currentPark = {};
        if (item.tempResidue < 10 || item.tempResidue < item.tempSpaces * 0.1) {
          this.currentMarker.setIcon(this.iconred);
        } else {
          this.currentMarker.setIcon(this.icon);
        }
        this.isInfo = false;
      } else {
        if (this.currentPark.id) {
          if (
            this.currentPark.tempResidue < 10 ||
            this.currentPark.tempResidue < this.currentPark.tempSpaces * 0.1
          ) {
            this.currentMarker.setIcon(this.iconred);
          } else {
            this.currentMarker.setIcon(this.icon);
          }
        }
        this.currentMarker = marker;
        var position = marker.getPosition();
        this.map.panTo(position);
        if (item.tempResidue < 10 || item.tempResidue < item.tempSpaces * 0.1) {
          this.currentMarker.setIcon(this.currentIconred);
        } else {
          this.currentMarker.setIcon(this.currentIcon);
        }
        this.currentPark = item;
        this.isInfo = true;
        if (this.isFilter) {
          this.isFilter = false;
        }
      }
      if (this.isFilter || this.isInfo) {
        document.getElementById("flex-box").style.height = "68%";
      } else {
        document.getElementById("flex-box").style.height = "100%";
      }
    },
    closeInfo() {
      if (this.isInfo) {
        this.isInfo = false;
        if (
          this.currentPark.tempResidue < 10 ||
          this.currentPark.tempResidue < this.currentPark.tempSpaces * 0.1
        ) {
          this.currentMarker.setIcon(this.iconred);
        } else {
          this.currentMarker.setIcon(this.icon);
        }
        this.currentPark = {};
      }
      if (this.isFilter || this.isInfo) {
        document.getElementById("flex-box").style.height = "68%";
      } else {
        document.getElementById("flex-box").style.height = "100%";
      }
    },
    toMap() {
      window.wii.app.invoke("navigator", {
        from: `${this.latitude},${this.longitude}`,
        to: `${this.currentPark.parkLat},${this.currentPark.parkLng}`,
        mode: "driving",
        from_name: "当前位置",
        to_name: this.currentPark.carParkName,
      });
    },
    toMapIcon() {
      this.initData();
    },
    getDistance(dist) {
      if (dist < 1000) return `${dist}m`;
      else return `${(dist / 1000).toFixed(2)}km`;
    },
    changeWCType(v) {
      this.curWC = v;
    },
    searchComplete() {},
    initMap() {
      /* eslint-disable */
      if (this.$route.query.latlng == 1) {
        this.latitude = this.$route.query.lat;
        this.longitude = this.$route.query.lng;
      } else {
        this.latitude = this.latitude;
        this.longitude = this.longitude;
      }
      var myLatlng = new qq.maps.LatLng(this.latitude, this.longitude);
      // 定义工厂模式函数
      var myOptions = {
        zoom: 13, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        zoomControl: false,
        disableDefaultUI: true,
        mapTypeId: qq.maps.MapTypeId.ROADMAP, // 设置地图样式详情参见MapType
      };

      // 获取dom元素添加地图信息
      this.map = new qq.maps.Map(document.getElementById("map"), myOptions);

      var size = new qq.maps.Size(28, 30);
      var origin = new qq.maps.Point(0, 0);
      var anchor = new qq.maps.Point(14, 30);
      var scaleSize = new qq.maps.Size(28, 30);
      this.icon = new qq.maps.MarkerImage(
        parkIcon,
        size,
        origin,
        anchor,
        scaleSize
      );
      size = new qq.maps.Size(28, 30);
      origin = new qq.maps.Point(0, 0);
      anchor = new qq.maps.Point(14, 30);
      scaleSize = new qq.maps.Size(28, 30);
      this.iconred = new qq.maps.MarkerImage(
        redPack,
        size,
        origin,
        anchor,
        scaleSize
      );
      size = new qq.maps.Size(36, 38);
      anchor = new qq.maps.Point(18, 38);
      scaleSize = new qq.maps.Size(36, 38);
      this.currentIcon = new qq.maps.MarkerImage(
        parkIcon,
        size,
        origin,
        anchor,
        scaleSize
      );
      size = new qq.maps.Size(36, 38);
      anchor = new qq.maps.Point(18, 38);
      scaleSize = new qq.maps.Size(36, 38);
      this.currentIconred = new qq.maps.MarkerImage(
        redPack,
        size,
        origin,
        anchor,
        scaleSize
      );
      //我的位置图标
      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: this.map,
      });
      anchor = new qq.maps.Point(0, 39);
      size = new qq.maps.Size(45, 45);
      origin = new qq.maps.Point(0, 0);
      var markerIcon = new qq.maps.MarkerImage(
        "https://3gimg.qq.com/lightmap/api_v2/2/4/99/theme/default/imgs/marker.png",
        size,
        origin,
        anchor
      );
      marker.setIcon(markerIcon);
      this.loading = false;
    },
    goToDetail() {
      var zoom = this.map.getZoom(); //获取当前地图级别
      var center = this.map.getCenter(); //获取当前地图中心位置
      sessionStorage.setItem("zoom", zoom);
      sessionStorage.setItem("center", center.toString());
      this.$router.push({
        path: "/parkingDetail",
        query: {
          id: this.currentPark.id,
          latitude: this.latitude,
          longitude: this.longitude,
          resource_id: this.currentPark.resource_id,
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}parkingDetail?id=${this.currentPark.id}&latitude=${this.latitude}&longitude=${this.longitude}&resource_id=${this.currentPark.resource_id}`,
      // 	isFullScreen: 0,
      // 	setTitle: '找停车场',
      // 	needLoading: 0
      // });
    },
    getKM(m) {
      return m / 1000;
    },
  },
};
</script>

<style lang="scss" scoped>
.wx-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .load-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}

.search-box {
  position: absolute;
  z-index: 1000;
  top: 20px;
  left: 0;
  width: 100%;
  .search {
    height: 100%;
    margin: 0 20px;
    height: 35px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 25px 0 rgba(174, 192, 213, 0.3);
    border-radius: 2px;
    border: 0px !important;
    padding: 0;
  }

  .input {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #999;
    margin: 0;
    border: 2px solid #178357;
    box-sizing: border-box;
    padding-left: 16px;
  }
}
.search-list-box {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 900;
  left: 0;
  top: 0;
  background-color: white;
  padding-top: 70px;
  box-sizing: border-box;

  .none {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 70px;
    font-size: 14px;
    color: #999;
  }

  .list {
    height: 100%;
    overflow: auto;
  }

  .item {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 20px;
    border-bottom: 1px solid #e8e8e8;

    &:last-child {
      border: none;
    }

    .text {
      font-size: 15px;
      color: #555959;
    }

    .go {
      font-size: 15px;
      color: #999;
      display: flex;
      align-items: center;
    }

    .img {
      width: 18px;
      height: 18px;
      margin-left: 5px;
    }
  }
}

.map-box {
  flex: 1;
  width: 100%;
  background-color: rgba(174, 192, 213, 0.1);
  position: relative;
  .map {
    width: 100%;
    height: 100%;
  }
}

.func-btn-box {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 500;
  right: 20px;
  bottom: 100px;
  .btn {
    width: 38px;
    height: 38px;
    margin-top: 10px;
    border-radius: 19px;
  }
}

.info-box {
  padding: 20px;
  background-color: white;
  position: fixed;
  width: 100%;
  bottom: 0px;
  left: 0px;
  box-sizing: border-box;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    .title {
      font-size: 16px;
      color: #37384d;
    }

    .page {
      font-size: 12px;
      color: #999;
    }

    .img {
      width: 18px;
      height: 18px;
    }
  }

  .sub-title {
    font-size: 12px;
    color: #555959;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    .green {
      color: #178357;
    }
  }

  .parking-type-box {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;

    .item {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 35px;
      font-size: 11px;
      background-color: #f6f6f7;
      color: #555959;
      border-radius: 2px;
      overflow: hidden;

      &.current {
        color: white;
        background-color: #178357;
      }
    }
  }

  .parking-info {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #555959;
    padding-top: 15px;
    border-top: 1px solid #e8e8e8;

    span {
      margin-bottom: 5px;

      &:last-child {
        margin: 0;
      }
    }
  }

  .btn-box {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      flex: 1;
      background-color: #e8e8e8;
      font-size: 15px;
      color: #444;
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }

      &.current {
        color: white;
        background-color: #178357;
      }
    }
  }
  .radio-box .item {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
