<template>
  <div class="wx-page">
    <!-- <div class="header">
			<van-nav-bar title="找厕所" left-arrow @click-left="onClickLeft" />
		</div> -->
    <div v-if="loading" class="load-box">
      <van-loading size="24px">加载中...</van-loading>
    </div>
    <div class="flex" :style="loading ? { display: 'none' } : {}" id="flex">
      <div class="map-box" id="map-box">
        <div id="map" class="map"></div>
      </div>
      <div class="fixed">
        <div
          class="info-box"
          v-if="WCData.length > 0"
          id="info-box"
          @touchstart="Box"
        >
          <van-swipe
            :show-indicators="false"
            :loop="false"
            @change="onChange"
            :height="height"
            :initial-swipe="current"
          >
            <van-swipe-item v-for="(v, i) in WCData" :key="v.toiletId">
              <div class="item-content" :ref="v.toiletId">
                <div class="item-top">
                  <div class="title-box">
                    <span class="title">{{ v.toiletName }}</span>
                    <span class="page">{{ i + 1 }}/{{ WCData.length }}</span>
                  </div>
                  <div class="sub-title">
                    <span
                      >{{ getKM(v.distance || 0) }}km | {{ v.address }}</span
                    >
                  </div>
                  <div class="wc-type-box">
                    <span class="item" v-if="i === 0">离我最近</span>
                    <span class="item" v-if="v.smart">智慧厕所</span>
                    <span class="item" v-if="v.hasDisabled">残疾人厕所</span>
                    <span class="item" v-if="v.hasThird">第三人厕所</span>
                  </div>
                  <div class="wc-info" v-if="v.smart !== 0">
                    <span
                      >男厕：总坑位{{ v.maleCount || 0 }}个，空位{{
                        v.maleSurplusCount || 0
                      }}个</span
                    >
                    <span
                      >女厕：总坑位{{ v.femaleCount || 0 }}个，空位{{
                        v.femaleSurplusCount || 0
                      }}个</span
                    >
                    <span v-if="v.hasDisabled"
                      >残疾人厕： 总坑位{{ v.disabledCount || 0 }}个，空位{{
                        v.disabledSurplusCount || 0
                      }}个</span
                    >
                    <span v-if="v.hasThird"
                      >第三人厕： 总坑位{{ v.thirdCount || 0 }}个，空位{{
                        v.thirdSurplusCount || 0
                      }}个</span
                    >
                  </div>
                </div>
                <div class="btn-box">
                  <span :class="['btn']" @click="goToDetail(v, i)">详情</span>
                  <span :class="['btn', 'current']" @click="SetOut(v)"
                    >出发</span
                  >
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
var wcIcon = require("../../assets/iconImage/wc@2x.png");
export default {
  data() {
    return {
      latitude: "30.56979",
      longitude: "104.05453",
      curWC: 0,
      WCData: [],
      selWC: {},
      loading: true,
      height: 0,
      current: 0,
      currentMaker: {},
      markers: [],
      myLatlng: {},
      onchange: false,
    };
  },
  updated() {
    if (this.onchange) {
      this.onChange(0);
      this.onchange = false;
    }
  },
  created() {
    if (this.$route.query.num) {
      this.current = Number(this.$route.query.num);
    } else {
      this.current = 0;
    }
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
      this.initData();
    });
    //设置title
    window.wii.app.invoke("setTitle", "找厕所");
    window.wii.app.invoke("showNativeBar", true);
  },
  mounted() {},
  components: {},
  methods: {
    // onClickLeft() {
    // 	window.wii.app.invoke('closeWindow');
    // },
    /* eslint-disable */
    initData() {
      var markers = [];
      this.$http({
        url: `/appserver/v1/toilet/search?${qs.stringify({
          distance: 1000,
          scenicId: this.$route.query.scenicId || "",
        })}`,
        headers: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      })
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            var bounds = new qq.maps.LatLngBounds();
            this.loading = false;
            this.WCData = res.data && res.data.data ? res.data.data : [];
            this.initMap();
            this.selWC = this.WCData[0] || {};
            this.onchange = true;
            this.WCData.forEach((v, i) => {
              var myLatlng = new qq.maps.LatLng(
                Number(v.latitude),
                Number(v.longitude)
              );
              var marker = new qq.maps.Marker({
                position: myLatlng,
                map: this.map,
                icon: this.current === i ? this.currentIcon : this.icon,
              });
              marker.setVisible(true);
              qq.maps.event.addListener(marker, "click", () => {
                this.markerClick(marker, v, i);
              });
              if (i === this.current) {
                this.currentMaker = marker;
              }
              markers.push(marker);
              if (i <= 9) {
                bounds.extend(myLatlng);
              }
            });
            this.markers = markers;
            if (this.WCData.length === 0) {
              this.map.setZoom(3);
            }
            bounds.extend(
              new qq.maps.LatLng(
                this.latitude || 30.657387,
                this.longitude || 104.06593
              )
            );
            if (this.WCData.length <= 10 && this.WCData.length > 0) {
              setTimeout(() => {
                this.map.fitBounds(bounds);
              }, 300);
            }
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    Box() {
      var _height = document.getElementById("info-box");
      _height.scrollTop = _height.scrollHeight;
      window.scrollTo(0, document.documentElement.clientHeight);
    },
    onChange(index) {
      this.current = index;
      this.selWC = this.WCData[index] || {};
      var el = this.$refs[this.selWC.toiletId];
      //设置swiper高度
      this.height = el[0].offsetHeight;
      this.currentMaker.setIcon(this.icon);
      this.currentMaker = this.markers[index];
      this.currentMaker.setIcon(this.currentIcon);
      this.map.setCenter(this.currentMaker.getPosition());
    },
    /**
     * @description marker点击事件
     **/
    markerClick(marker, item, index) {
      if (this.selWC.toiletId !== item.toiletId) {
        this.currentMaker.setIcon(this.icon);
        marker.setIcon(this.currentIcon);
        this.currentMaker = marker;
        this.selWC = item;
        this.current = index;
      }
    },
    changeWCType(v) {
      this.curWC = v;
    },
    initMap() {
      /* eslint-disable */
      // // 设置地图中心点
      if (this.WCData.length === 0) {
        this.myLatlng = new qq.maps.LatLng(
          this.latitude || 30.657387,
          this.longitude || 104.06593
        );
        var map = new qq.maps.Map(document.getElementById("map"), {
          center: this.myLatlng,
          zoom: 16,
          zoomControl: false,
          disableDefaultUI: true,
        });
        var marker = new qq.maps.Marker({
          position: this.myLatlng,
          map: map,
        });

        document.getElementById("flex").style.height = "100%";
      } else {
        this.myLatlng = new qq.maps.LatLng(
          this.WCData[0].latitude || 30.657537,
          this.WCData[0].longitude || 104.080479
        );
        // 定义工厂模式函数
        var myOptions = {
          zoom: 11, // 设置地图缩放级别
          center: this.myLatlng, // 设置中心点样式
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
          wcIcon,
          size,
          origin,
          anchor,
          scaleSize
        );
        size = new qq.maps.Size(36, 38);
        anchor = new qq.maps.Point(18, 38);
        scaleSize = new qq.maps.Size(36, 38);
        this.currentIcon = new qq.maps.MarkerImage(
          wcIcon,
          size,
          origin,
          anchor,
          scaleSize
        );
      }
      //我的位置图标
      var mylocationmarker = new qq.maps.Marker({
        position: new qq.maps.LatLng(
          this.latitude || 30.657387,
          this.longitude || 104.06593
        ),
        map: this.map,
      });
      var markerIcon = new qq.maps.MarkerImage(
        "https://3gimg.qq.com/lightmap/api_v2/2/4/99/theme/default/imgs/marker.png",
        new qq.maps.Size(45, 45),
        new qq.maps.Point(0, 0),
        new qq.maps.Point(0, 39)
      );
      mylocationmarker.setIcon(markerIcon);
    },
    // 出发
    SetOut(item) {
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${this.WCData[0].latitude},${this.WCData[0].longitude}`,
          mode: "walking",
        });
      }

      if (isIOS) {
        window.wii.app.invoke("navigator", {
          from: `${this.latitude},${this.longitude}`,
          to: `${this.WCData[0].latitude},${this.WCData[0].longitude}`,
          mode: "walking",
          from_name: "",
          from_address: "",
          to_name: item.toiletName,
          to_address: item.address,
        });
      }
    },
    goToDetail(item, index) {
      this.$router.push({
        path: "/wcDetail",
        query: {
          id: item.toiletId,
          toiletNum: item.toiletNum,
          latitude: this.latitude,
          longitude: this.longitude,
          current: this.current,
          index: index,
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}wcDetail?id=${item.toiletId}&latitude=${this.latitude}&longitude=${this.longitude}&current=${this.current}`,
      // 	isFullScreen: 1,
      // 	setTitle: '找厕所',
      // 	needLoading: 0
      // });
    },
    getKM(m) {
      if (isNaN(m)) {
        return "";
      }
      return (m / 1000).toFixed(2);
    },
  },
};
</script>

<style lang="scss">
.wx-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
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
  .title {
    /deep/ .van-nav-bar .van-icon {
      color: #4a4a4a;
      font-size: 22px;
      font-weight: 600;
    }
    /deep/ .van-nav-bar__title {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
    }
    /deep/ [class*="van-hairline"]::after {
      border: 0px;
    }
  }
  .load-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    position: relative;
    .fixed {
      position: fixed;
      background: #fff;
      bottom: 0;
      width: 100%;
    }
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
    border: 2px solid rgba(23, 131, 87, 1);
    padding: 0 5px;
  }

  .input {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #999;
    margin: 0;
    box-sizing: border-box;
  }
}

.map-box {
  flex: 1;
  width: 100%;
  background-color: rgba(174, 192, 213, 0.1);

  .map {
    width: 100%;
    height: 100%;
  }
}

.info-box {
  padding: 20px;
  .item-content {
    display: flex;
    flex-direction: column;
    .item-top {
      flex: 1;
    }
  }
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
  }

  .sub-title {
    font-size: 12px;
    color: #555959;
    margin-bottom: 10px;
  }

  .wc-type-box {
    display: flex;
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
    .item:not(:first-child) {
      margin-left: 10px;
    }
  }

  .wc-info {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #555959;
    padding-top: 20px;

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
      // padding: 10px;
      flex: 1;
      background-color: #e8e8e8;
      font-size: 15px;
      color: #444;
      margin-right: 10px;
      border-radius: 2px;
      &:last-child {
        margin-right: 0;
      }

      &.current {
        color: white;
        background-color: #178357;
      }
    }
  }
}
</style>
