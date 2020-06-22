<template>
  <div class="parking-search">
    <div id="map"></div>
    <div class="header-search">
      <van-field
        v-model="searchVal"
        clearable
        @input="SearchBtn"
        @clear="ClearSearch"
      />
      <van-button @click="ClearSearch">取消</van-button>
    </div>
    <div class="list-box" v-if="!emptyToastShow">
      <div
        class="list-item"
        v-for="(item, index) in listData"
        :key="index"
        @click="GoBack(item)"
      >
        <p @click="TextClick(item)">{{ item.carParkName }}</p>
        <div @click.stop="GoBack(item)">
          到这里去
          <van-image :src="goIcon" width="18px" height="18px"></van-image>
        </div>
      </div>
    </div>
    <div class="empty-toast" v-if="emptyToastShow">
      <div class>
        <van-image :src="emptyIcon" width="200px" height="200px"></van-image>
        <p>无搜索结果</p>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      searchVal: this.$route.query.inputVal,
      goIcon: require("../../assets/iconImage/sb@3x.png"),
      cityLocation: "",
      latitude: 30.7288,
      longitude: 103.97373,
      listData: [],
      from_name: "",
      from_address: "",
      emptyIcon: require("../../assets/iconImage/h_mao@2x.png"), // 回答
      emptyToastShow: false,
    };
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
    });
    //设置title
    window.wii.app.invoke("setTitle", "找停车场");
  },
  mounted() {
    this.Service();
    this.SearchBtn();
  },
  methods: {
    SearchBtn() {
      if (this.searchVal) {
        /* eslint-disable */
        var that = this;
        this.$http({
          url: `/appserver/v1/carPark/listByLocationName?${qs.stringify({
            type: "null",
            radius: 3000000,
            longitude: this.$route.query.longitude || 103.97373,
            latitude: this.$route.query.latitude || 30.7288,
            name: this.searchVal,
          })}`,
          headers: {
            latitude: this.latitude,
            longitude: this.longitude,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              if (res.data && res.data.data && res.data.data.length > 0) {
                this.listData = res.data.data;
                this.emptyToastShow = false;
              } else {
                this.listData = [];
                this.emptyToastShow = true;
              }
            }
          })
          .catch((error) => {
            this.$toast("网络异常,检查网络再试试~~");
          });
      } else {
        // window.wii.app.invoke('closeWindow');
        this.$router.go(-1);
      }
    },
    Service() {
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(
        this.latitude || 30.7288,
        this.longitude || 103.97373
      );

      // 定义工厂模式函数
      var myOptions = {
        zoom: 20, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        zoomControl: false,
        disableDefaultUI: true,
        mapTypeId: qq.maps.MapTypeId.ROADMAP, // 设置地图样式详情参见MapType
      };
    },
    //
    TextClick(item) {
      window.wii.app.invoke("openWindow", {
        openUrl: `${this.domain}parking?lat=${item.latLng.lat}&lng=${
          item.latLng.lng
        }&latlng=1`,
        isFullScreen: 0,
        setTitle: "找停车场",
        needLoading: 0,
      });
      setTimeout(() => {
        window.wii.app.invoke("closeWindow");
      }, 2000);
    },
    Location() {
      $.ajax({
        type: "get",
        url: "https://apis.map.qq.com/ws/geocoder/v1",
        dataType: "jsonp",
        data: {
          key: "LJKBZ-2WTRW-JT7RQ-OSONW-ZO6X7-ZMFMG", //开发密钥
          location: `${this.latitude},${this.longitude}`, //位置坐标
          get_poi: "1", //是否返回周边POI列表：1.返回；0不返回(默认)
          coord_type: "1", //输入的locations的坐标类型,1 GPS坐标
          output: "jsonp",
        },
        success: (data) => {
          this.from_name = data.result.formatted_addresses.recommend;
          this.from_address = data.result.address;
        },
      });
    },
    // 去这里
    GoBack(item) {
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${item.parkLat},${item.parkLng}`,
          mode: "driving",
          from_name: "当前位置",
          to_name: item.carParkName,
        });
      }

      if (isIOS) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${item.latLng.lat},${item.latLng.lng}`,
          mode: "driving",
          from_name: "当前位置",
          to_name: item.name,
          to_address: item.address,
        });
      }
    },
    // 清除
    ClearSearch() {
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}parking`,
      // 	isFullScreen: 0,
      // 	setTitle: '找停车场',
      // 	needLoading: 0
      // });
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.parking-search {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .header-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    /deep/ .van-cell {
      width: 84.4%;
      border-radius: 2px;
      border: 2px solid rgba(23, 131, 87, 1);
      height: 35px;
      padding: 5px 16px;
    }
    /deep/ .van-field__control {
      height: 21px;
    }
    /deep/ .van-button {
      height: 35px;
      line-height: 35px;
      border: 0px;
      padding: 0px;
    }
    /deep/ .van-button span {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
    }
    /deep/ .van-button:active::before {
      opacity: 0;
    }
  }
  .list-box {
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 19px 0px;
      border-bottom: 1px solid #e8e8e8;
      & > p {
        width: 70%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(85, 89, 89, 1);
      }
      & > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        /deep/ .van-image {
          margin-left: 6px;
        }
      }
    }
  }
  .empty-toast {
    margin-top: 50px;
    & > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      p {
        width: 100%;
        text-align: center;
        margin-top: 19px;
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(155, 155, 155, 1);
      }
    }
  }
}
</style>
