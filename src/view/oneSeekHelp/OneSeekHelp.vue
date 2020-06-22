<template>
  <div class="one-seek-help">
    <!-- 地图 -->
    <div class="map-box">
      <div class="map">
        <div id="container"></div>
        <div class="help-content">
          <div class="help">
            <div @click="OnlineHelp">
              <van-image
                :src="onlineImg"
                width="38px"
                height="38px"
              ></van-image>
              <p>在线求助</p>
            </div>
            <div @click="callHelp">
              <van-image :src="photoImg" width="38px" height="38px"></van-image>
              <p>电话求助</p>
            </div>
          </div>
          <div class="site">
            <van-image :src="siteIcon" width="10px" height="11px"></van-image>
            <span>{{ locationText }}</span>
          </div>
        </div>
      </div>
      <div class="imgtextbtn-style" @click="goToMyHelp">
        <img :src="myhelpIcon" />
        <span>我的求助</span>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      siteIcon: require("../../assets/iconImage/ic_20_location@2x.png"),
      onlineImg: require("../../assets/iconImage/ic_fankui@2x.png"), // 在线求助
      photoImg: require("../../assets/iconImage/ic_wenjuan@2x.png"), // 电话求助
      lat: "",
      lng: "",
      locationText: "",
      uid: this.uid,
      myhelpIcon: require("../../assets/iconImage/ic_myhelp@2x.png"),
    };
  },
  watch: {
    uid: function(oldUid, newUid) {
      // eslint-disable-next-line
      console.log("oldUid = " + oldUid + ",newUid =" + newUid);
      this.init();
      this.Location();
    },
  },
  created() {
    //设置title
    window.wii.app.invoke("setTitle", "一键求助");
    // eslint-disable-next-line
    if (this.uid) {
    } else {
      window.wii.app.invoke("login", {
        callback: "",
      });
    }
  },
  mounted() {
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
      this.init(); // 地图
      this.Location();
    });
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "一键求助");
      this.commonLatLong((LatLng) => {
        this.lat = LatLng.latitude;
        this.lng = LatLng.longitude;
        this.init(); // 地图
        this.Location();
      });
    };
  },
  methods: {
    //电话求助
    callHelp() {
      var data = {
        resourceId: this.$route.query.scenicId,
      };
      this.$http
        .post("/appserver/v1/help/contactTel", qs.stringify(data))
        .then((data) => {
          if (data.data.ret === 0) {
            if (data.data.data === null) {
              this.$toast({
                message: data.data.msg,
                duration: "5000",
              });
            } else {
              window.location.href = "tel://" + data.data.data;
            }
          } else {
            this.$toast({
              message: "该园区暂未提供电话求助服务",
              duration: "5000",
            });
          }
          this.showLoading(false);
        });
    },
    // 在线求助
    OnlineHelp() {
      // eslint-disable-next-line
      // this.$router.push({
      //   path: "/onlineHelp",
      //   query: {
      //     scenicId: this.$route.query.scenicId
      //   }
      // });
      if (this.uid) {
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.domain}onlineHelp?scenicId=${this.$route.query.scenicId}`,
          isFullScreen: "",
          setTitle: "在线求助",
          needLoading: 0,
        });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 地图
    init() {
      window.console.log(this.lat, this.lng, 555);
      /* eslint-disable */
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(this.lat, this.lng);
      // 定义工厂模式函数
      var myOptions = {
        zoom: 15, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        zoomControl: false,
        disableDefaultUI: true,
        mapTypeId: qq.maps.MapTypeId.ROADMAP, // 设置地图样式详情参见MapType
      };
      // 获取dom元素添加地图信息
      var map = new qq.maps.Map(
        document.getElementById("container"),
        myOptions
      );
      // var marker = new qq.maps.Marker({
      // 	position: myLatlng,
      // 	map: map
      // });
      // marker.setVisible(true);
    },
    Location() {
      // var params ={
      //   key: "LJKBZ-2WTRW-JT7RQ-OSONW-ZO6X7-ZMFMG", //开发密钥
      //   location: `${this.lat || 30.7288},${this.lng || 103.97373}`, //位置坐标
      //   get_poi: "1", //是否返回周边POI列表：1.返回；0不返回(默认)
      //   coord_type: "1", //输入的locations的坐标类型,1 GPS坐标
      //   output: "jsonp",
      // }
      // this.$http.get("https://apis.map.qq.com/ws/geocoder/v1",qs.stringify(params))
      // .then(data=>{
      //     this.locationText = data.result.formatted_addresses.recommend;
      // });

      $.ajax({
        type: "get",
        url: "https://apis.map.qq.com/ws/geocoder/v1",
        dataType: "jsonp",
        data: {
          key: "LJKBZ-2WTRW-JT7RQ-OSONW-ZO6X7-ZMFMG", //开发密钥
          location: `${this.lat},${this.lng}`, //位置坐标
          get_poi: "1", //是否返回周边POI列表：1.返回；0不返回(默认)
          coord_type: "1", //输入的locations的坐标类型,1 GPS坐标
          output: "jsonp",
        },
        success: (data) => {
          window.console.log(data);
          this.locationText = data.result.formatted_addresses.recommend;
          this.showLoading(false);
        },
      });
    },
    goToMyHelp() {
      window.wii.app.invoke("naviRoute", `greenway://my_help`);
    },
  },
};
</script>
<style src="../../common/css/imgtextbutton.css" scoped></style>
<style lang="scss" scoped>
.one-seek-help {
  width: 100%;
  height: 100%;
  position: relative;
  .title {
    /deep/ .van-nav-bar {
      z-index: 500 !important;
    }
    /deep/ .van-nav-bar .van-icon {
      color: #4a4a4a;
      font-size: 22px;
    }
    /deep/ .van-nav-bar__title {
      color: #4a4a4a;
      font-size: 16px;
    }
    /deep/ [class*="van-hairline"]::after {
      border: 0px;
    }
  }
  .map-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    z-index: 300;
    .map {
      width: 100%;
      height: 100%;
      position: relative;
      #container {
        width: 100%;
        height: 100%;
      }
      .help-content {
        width: 89.34%;
        position: absolute;
        left: 20px;
        bottom: 34px;
        .help {
          background-color: #fff;
          width: 100%;
          padding: 26px 0 20px 0;
          display: flex;
          justify-content: space-around;
          & > div {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            & > p {
              text-align: center;
              margin-top: 14px;
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFangSC;
              font-weight: 600;
              color: rgba(55, 56, 77, 1);
              line-height: 14px;
              width: 100%;
            }
          }
        }
        .site {
          margin-top: 10px;
          background-color: #fff;
          padding: 19px 15px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          & > span {
            margin-left: 6px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFangSC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 12px;
          }
        }
      }
    }
  }
}
</style>
