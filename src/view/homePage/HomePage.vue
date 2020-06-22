<template>
  <div class="home-page">
    <lottie
      :options="defaultOptions"
      :height="45"
      :width="45"
      v-if="loading"
      v-on:animCreated="handleAnimation"
    />
    <div
      class="content"
      v-show="!loading"
      :class="{ 'content-show': searchShow }"
    >
      <div class="wrap" v-show="!searchShow">
        <div class="title">
          <div class="location">
            <van-image
              :src="locationIcon"
              width="20px"
              height="20px"
            ></van-image>
            <span>{{ cityLocation }}</span>
            <span @click="btn()">切换</span>
          </div>
          <div class="location">
            <van-image
              :src="searchIcon"
              width="20px"
              height="20px"
              @click="BigSearch"
            ></van-image>
            <div @click="weatherA" v-if="weatherShow">
              <img
                :src="user.weather.img"
                class="weatherImg"
                width="20px"
                height="20px"
              />
              <p>{{ user.weather.temperatureDay }}°C</p>
            </div>
          </div>
        </div>
        <!-- 不在绿道内banner -->
        <div class="banner" v-show="!greenwayIn">
          <van-swipe
            :autoplay="3000"
            v-if="bannerData !== null || bannerData.length !== 0"
          >
            <van-swipe-item
              v-for="(item, index) in bannerData"
              :key="index"
              @click="BannerTo(item)"
            >
              <div class="images">
                <div>
                  <img :src="item.img" width="100%" height="445px" />
                </div>
              </div>
              <div class="bannerbg-show"></div>
              <div class="introduce">
                <p>{{ item.title }}</p>
                <p>{{ item.subTitle }}</p>
              </div>
            </van-swipe-item>
          </van-swipe>
          <div
            class="images_null"
            v-if="bannerData === null || bannerData.length === 0"
          >
            <div>
              <img :src="noBanner" width="173px" height="126px" />
            </div>
          </div>
        </div>
        <!-- 在绿道内banner -->
        <div class="banner-in" v-show="greenwayIn">
          <van-swipe
            :autoplay="3000"
            v-if="bannerData !== null || bannerData.length !== 0"
          >
            <van-swipe-item
              v-for="(item, index) in bannerData"
              :key="index"
              @click="BannerTo(item)"
            >
              <div class="images">
                <div>
                  <img :src="item.img" width="100%" height="210px" />
                </div>
              </div>
              <div class="bannerbg-show"></div>
              <div class="introduce">
                <p>{{ item.title }}</p>
                <p>{{ item.subTitle }}</p>
              </div>
            </van-swipe-item>
          </van-swipe>
          <div
            class="images_null"
            v-if="bannerData === null || bannerData.length === 0"
          >
            <div>
              <img :src="noBanner" width="173px" height="126px" />
            </div>
          </div>
        </div>
        <!-- icon -->
        <div class="icon-box">
          <div>
            <div class="person-wrap" ref="iconWrap">
              <div class="person-list" ref="iconTab">
                <div
                  class="person-item"
                  v-for="(item, index) in buttonData"
                  :key="index"
                >
                  <div class="item" @click="showToast(item)">
                    <van-image
                      :src="item.image"
                      width="62px"
                      height="62px"
                    ></van-image>
                    <p>{{ item.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 当季最潮流 不在绿道内 -->
        <div class="tide-box" v-show="!greenwayIn" v-if="tideData !== ''">
          <van-cell title="当季最潮流" />
          <div class="tide-item" @click="BannerTo(tideData)">
            <van-image
              :src="tideData.img"
              width="101px"
              height="125px"
            ></van-image>
            <div class="right">
              <span v-for="(item, index) in tideData.tags" :key="index">
                {{ item }}
              </span>
              <p>{{ tideData.title }}</p>
              <div>
                <span>{{ tideData.subTitle }}</span>
                <van-icon
                  name="like"
                  v-if="!collectionShow"
                  @click="AddCollection(tideData)"
                  v-show="collShow"
                />
                <van-icon
                  name="like"
                  color="#FF725F"
                  v-if="collectionShow"
                  v-show="collShow"
                  @click="CancelCollection(tideData)"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 绿道必游线路 -->
        <div class="way" v-if="lineShow">
          <van-cell :title="wayData.title" />
          <div class="way-wrap">
            <div class="way-list">
              <swiper :options="swiperOption" ref="mySwiper">
                <!-- slides -->
                <swiper-slide
                  class="swiper-slide"
                  v-for="(item, index) in wayData.list"
                  :key="index"
                >
                  <div class="way-item" @click="LineDetails(item)">
                    <img :src="item.img" />
                    <div class="bg-show"></div>
                    <div class="way-introduce">
                      <p class="way-tips">必游推荐</p>
                      <p style="width:100%;height:1px;"></p>
                      <div>
                        <div class="way-location" v-if="item.address !== null">
                          <van-image
                            :src="whiteLocationIcon"
                            width="12px"
                            height="12px"
                            v-if="item.address !== ''"
                          ></van-image>
                          <p v-if="item.address !== ''">{{ item.address }}</p>
                        </div>
                        <p class="way-title">{{ item.title }}</p>
                        <p class="way-label">
                          <span v-for="(x, i) in item.tags" :key="i">
                            {{ x }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <!-- 绿道网红餐厅 -->
        <div class="way" v-show="!greenwayIn" v-if="restaurantShow">
          <van-cell :title="restaurantData.title" />
          <div class="way-wrap">
            <div class="way-list">
              <swiper :options="swiperOption" ref="mySwiper">
                <!-- slides -->
                <swiper-slide
                  class="swiper-slide"
                  v-for="(item, index) in restaurantData.list"
                  :key="index"
                >
                  <div class="way-item">
                    <img :src="item.img" />
                    <div class="bg-show"></div>
                    <div class="way-introduce">
                      <p class="way-tips">必吃餐厅</p>
                      <p style="width:100%;height:1px;"></p>
                      <div>
                        <div class="way-location" v-if="item.address !== null">
                          <van-image
                            :src="whiteLocationIcon"
                            width="12px"
                            height="12px"
                            v-if="item.address !== ''"
                          ></van-image>
                          <p v-if="item.address !== ''">{{ item.address }}</p>
                        </div>
                        <p class="way-title">{{ item.title }}</p>
                        <p class="way-label">
                          <span v-for="(x, i) in item.tags" :key="i">
                            {{ x }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
        <!-- 附近最热TOP 在绿道内-->
        <div v-if="greenwayIn">
          <div class="hot" v-show="hotShow">
            <van-cell :title="hotTitle" />
            <div class="hot-list">
              <div class="select-person">
                <div class="person-wrap" ref="scenicWrap">
                  <div class="person-list" ref="scenicTab">
                    <div
                      class="person-item"
                      v-for="(item, index) in hotList"
                      :key="index"
                      @click="HotTo(item)"
                    >
                      <van-image
                        :src="item.cover_img"
                        width="126px"
                        height="127px"
                      ></van-image>
                      <p class="distance" v-if="item.mileage !== ''">
                        距你{{ parseInt(item.mileage / 1000) }}km
                      </p>
                      <div>
                        <p>{{ item.name }}</p>
                        <p class="way-label">
                          <span v-for="(x, i) in item.tags" :key="i">
                            {{ x }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 标签分类 -->
    <div class="classify" v-show="!loading" v-if="classifyTab.length !== 0">
      <div :class="{ tab: searchShow }">
        <van-tabs v-model="activeTab" sticky @click="changeAct">
          <van-tab
            v-for="(item, index) in classifyTab"
            :title="item.title"
            :key="index"
            :disabled="disTab"
          ></van-tab>
        </van-tabs>
      </div>
      <van-list
        v-model="loadingList"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        v-if="noList"
      >
        <div class="list" :class="{ 'list-show': searchShow }">
          <div
            class="list-item"
            v-for="(item, index) in classData"
            :key="index"
            @click="Judge(item)"
          >
            <van-image :src="item.img" width="100%"></van-image>
            <p>{{ item.contentTitle }}</p>
          </div>
        </div>
      </van-list>
    </div>

    <div class="class-search" v-if="searchShow">
      <van-search
        placeholder="搜索附近或景点"
        v-model="value"
        @keypress="showToast"
        @blur="showToast"
      />
      <div @click="BackTop()">
        <a href="#">
          <van-image :src="backIcon" width="20px" height="20px"></van-image>
          <p>回顶部</p>
        </a>
      </div>
    </div>
    <div class="no-list" v-if="!noList">
      <div>
        <van-image :src="noListIcon" width="200px" height="200px"></van-image>
        <p>没有任何内容，去看看别的吧!</p>
      </div>
    </div>
    <footer-tab :active="active"></footer-tab>
  </div>
</template>
<script>
import FooterTab from "@/components/FooterTab";
import BScroll from "better-scroll";
import qs from "qs";
import Lottie from "@/components/lottie.vue";
import * as animationData from "../../assets/pull_refresh_loading.json";
export default {
  data() {
    return {
      cityLocation: "地球",
      noBanner: require("../../assets/iconImage/in_banner.png"),
      loading: true,
      loadingList: false,
      finished: false,
      isLoading: false,
      collShow: false,
      url: "https://cos-web-h5.wiiqq.com/#/",
      active: 0,
      value: "", //搜索附近景点
      greenWayId: "", //在园区内 景区id
      showIndicators: false,
      locationIcon: require("../../assets/iconImage/ic_20_location@2x.png"), // 位置图标
      searchIcon: require("../../assets/iconImage/ic_20_search@2x.png"), // 搜索图标
      weatherShow: true, // 天气隐藏
      bannerData: [], // 轮播
      // 功能列表--不在园区
      nobuttonModels: [
        {
          image: require("../../assets/iconImage/ic_park@2x.png"),
          title: "园区",
        },
        // {
        //   image: require("../../assets/iconImage/ic_food@2x.png"),
        //   title: "周边"
        // },
        {
          image: require("../../assets/iconImage/ic_cark@2x.png"),
          title: "找停车场",
        },
        // {
        //   image: require("../../assets/iconImage/ic_map@2x.png"),
        //   title: "去绿道"
        // },
        {
          image: require("../../assets/iconImage/ic_act@2x.png"),
          title: "活动赛事",
        },
        {
          image: require("../../assets/iconImage/ic_tousu@2x.png"),
          title: "投诉",
        },
      ],
      // 功能列表--在园区
      buttonModels: [
        {
          image: require("../../assets/iconImage/ic_bike@2x.png"),
          title: "找单车",
        },
        {
          image: require("../../assets/iconImage/ic_gcar@2x.png"),
          title: "找观光车",
        },
        {
          image: require("../../assets/iconImage/ic_wc@2x.png"),
          title: "找厕所",
        },
        {
          image: require("../../assets/iconImage/ic_cark@2x.png"),
          title: "找停车场",
        },
        // {
        //   image: require("../../assets/iconImage/ic_food@2x.png"),
        //   title: "周边"
        // },
        {
          image: require("../../assets/iconImage/ic_sos@2x.png"),
          title: "一键求助",
        },
        {
          image: require("../../assets/iconImage/ic_tousu@2x.png"),
          title: "投诉",
        },
        // {
        //   image: require("../../assets/iconImage/ic_flower@2x.png"),
        //   title: "拍照识花"
        // },
        // {
        //   image: require("../../assets/iconImage/ic_saosj@2x.png"),
        //   title: "扫码识景"
        // },
      ],
      buttonData: [],
      // 当季最潮流
      tideData: "",
      // 收藏
      collect: 0,
      collectionShow: false,
      // 绿道必游线路
      wayData: "",
      lineShow: false,
      // 绿道网红餐厅
      restaurantData: {
        isShow: "",
        list: [
          {
            address: "江家艺苑",
            h5URL: "",
            id: 1111111,
            img: require("../../assets/iconImage/img1.png"),
            latitude: 111.1111,
            longitude: 11.11111,
            tags: ["拍照", "当季最鲜美味餐厅"],
            title: "江家艺苑“网红餐厅”",
          },
          {
            address: "江家艺苑",
            h5URL: "",
            id: 1111111,
            img: require("../../assets/iconImage/img2.png"),
            latitude: 111.1111,
            longitude: 11.11111,
            tags: ["拍照", "当季最鲜美味餐厅"],
            title: "江家艺苑“网红餐厅”",
          },
        ],
        title: "绿道网红餐厅",
      },
      restaurantShow: false,
      whiteLocationIcon: require("../../assets/iconImage/tag_location@2x.png"), // 白色位置图标
      classifyTab: [], // 标签分类
      disTab: false,
      activeTab: 0,
      // 分类列表
      classData: [],
      // 分类列表有无数据展示
      noList: true,
      noListIcon: require("../../assets/iconImage/list@2x.png"),
      // 附近最热TOP
      hotList: [],
      hotTitle: "",
      hotShow: true,
      searchShow: false,
      backIcon: require("../../assets/iconImage/ic_back@2x.png"),
      // 在不在绿道内
      greenwayIn: true,
      scrollTop: "", //dom距离顶部的高度
      user: {
        cityID: "",
        weather: {
          temperatureDay: "",
          img: "",
        },
      },
      // 轮播
      swiperOption: {
        slidesPerView: 1.183,
        spaceBetween: 0,
        centeredSlides: true,
      },
      pageNum: 1,
      pageSize: "20",
      locationData: null,
      latitude: null, //纬度
      longitude: null, //经度
      classList: [],
      tabLoc: false,
      scenicId: "",
      greenWayName: "",
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
    };
  },
  components: {
    FooterTab,
    lottie: Lottie,
  },
  mounted() {
    // eslint-disable-next-line
    console.log("uid..." + this.uid);
    document.title = "绿道";
    setTimeout(() => {
      this.Location();
    }, 1000);
    setTimeout(() => {
      this.init();
    }, 2000);
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    //销毁实例
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    btn() {
      this.loading = true;
      if (this.tabLoc === false) {
        this.tabLoc = true;
        this.init();
      } else {
        this.tabLoc = false;
        this.init();
      }
    },
    /* eslint-disable */
    // 获取用户位置经纬度
    Location() {
      this.$http
        .post(
          `/appserver/v1/user/get_jsapi_config?url=${encodeURIComponent(
            location.href.split("#")[0]
          )}&jsapi=${this.$cookie.get("w_skey")}`
        )
        .then((data) => {
          this.locationData = JSON.parse(data.data.data.jsapi_config);
          wx.config({
            debug: this.locationData.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: this.locationData.appId, // 必填，公众号的唯一标识
            timestamp: this.locationData.timestamp, // 必填，生成签名的时间戳
            nonceStr: this.locationData.nonceStr, // 必填，生成签名的随机串
            signature: this.locationData.signature, // 必填，签名
            jsApiList: ["openLocation", "getLocation"], // 必填，需要使用的JS接口列表
          });

          wx.ready(function() {
            wx.getLocation({
              type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function(res) {
                this.latitude = res.latitude.substring(
                  0,
                  res.latitude.indexOf(".") + 5
                ); // 纬度，浮点数，范围为90 ~ -90
                this.longitude = res.longitude.substring(
                  0,
                  res.longitude.indexOf(".") + 5
                ); // 经度，浮点数，范围为180 ~ -180。
                sessionStorage.setItem("latitude", this.latitude); // 纬度
                sessionStorage.setItem("longitude", this.longitude); // 经度
                console.log(
                  sessionStorage.getItem("latitude"),
                  sessionStorage.getItem("longitude")
                );
              },
              cancel: function(res) {
                this.cityLocation = "地球";
              },
            });
          });
          wx.error(function(res) {
            this.cityLocation = "地球";
            console.log(res);
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        });
    },
    // 位置
    TextLocation() {
      console.log(this.latitude);
      console.log(this.longitude);
      // this.latitude = "39.90469"
      // this.longitude = "116.40717"
      if (this.latitude !== "" && this.longitude !== "") {
        $.ajax({
          type: "get",
          url: "http://apis.map.qq.com/ws/geocoder/v1",
          dataType: "jsonp",
          data: {
            key: "LJKBZ-2WTRW-JT7RQ-OSONW-ZO6X7-ZMFMG", //开发密钥
            location: `${this.latitude},${this.longitude}`, //位置坐标
            get_poi: "1", //是否返回周边POI列表：1.返回；0不返回(默认)
            coord_type: "1", //输入的locations的坐标类型,1 GPS坐标
            output: "jsonp",
          },
          success: (data) => {
            console.log(data, "逆解析");
            if (data.result.address_component.city === undefined) {
              this.cityLocation = "地球";
              this.weatherShow = false;
              console.log(this.cityLocation, "diqiu");
            } else {
              this.cityLocation = data.result.address_component.city;
              if (this.user.weather.temperatureDay === "") {
                this.weatherShow = false;
              } else {
                this.weatherShow = true;
              }
              console.log(this.cityLocation, "TextLocation");
            }
          },
        });
      }
    },
    init() {
      if (this.tabLoc === false) {
        if (
          sessionStorage.getItem("latitude") === null ||
          sessionStorage.getItem("longitude") === null
        ) {
          this.latitude = "";
          this.longitude = "";
          this.cityLocation = "地球";
        } else {
          this.latitude = sessionStorage.getItem("latitude");
          this.longitude = sessionStorage.getItem("longitude");
        }
      } else {
        this.latitude = "30.570065";
        this.longitude = "104.048416";
      }
      this.$http
        .get(`/appserver/v1/api/home/detail`, {
          headers: {
            latitude: this.latitude, //纬度
            longitude: this.longitude, //经度
            realatitude: this.latitude, //纬度
            realongitude: this.longitude, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            let _data = data.data.data;
            console.log(_data);
            this.greenWayName = _data.greenWayName;
            this.greenWayId = _data.greenWayId; //景区ID
            this.user.cityID = _data.areaId; //城市ID
            if (_data.banners !== null) {
              for (let i = 0; i < _data.banners.length; i++) {
                if (_data.banners[i].contentType != 6) {
                  this.bannerData.push(_data.banners[i]); //轮播
                }
              }
            }
            this.classifyTab = _data.topicManageVos; //景点标签
            this.wayData = _data.routes; //路线列表
            let routesList =
              _data.routes && _data.routes.list ? _data.routes.list : [];

            if (routesList.length !== 0) {
              this.lineShow = true;
            } else {
              this.lineShow = false;
            }

            // 在绿道内
            if (_data.current === "1") {
              this.buttonData = this.buttonModels;
              this.IconScroll();
              this.hotList =
                _data.homeNearbies && _data.homeNearbies.list
                  ? _data.homeNearbies.list
                  : []; //附近最热
              if (this.hotList.length !== 0) {
                this.hotShow = true;
              } else {
                this.hotShow = false;
              }
              this.hotTitle = _data.homeNearbies.title;
              this.greenwayIn = true;
              this.cityLocation = _data.scenicName;
              this.scenicId = _data.scenicId;
              this.scenicLatitude = _data.scenicLatitude;
              this.scenicLongitude = _data.scenicLongitude;
              this.hotScroll(); // 附近最热TOP
            } else {
              this.buttonData = this.nobuttonModels;
              this.IconScroll();
              // 不在绿道内
              if (_data.homeHotRecommend !== null) {
                if (_data.homeHotRecommend.contentType != 6) {
                  this.tideData = _data.homeHotRecommend; //不在绿道，当季最潮流-热门推荐
                } else {
                  this.tideData = "";
                }
                if (_data.homeHotRecommend.contentType == 1) {
                  this.collShow = false;
                } else if (_data.homeHotRecommend.contentType == 2) {
                  this.collShow = false;
                } else if (_data.homeHotRecommend.contentType == 3) {
                  this.collShow = false;
                } else if (_data.homeHotRecommend.contentType == 4) {
                  this.collShow = true;
                } else if (_data.homeHotRecommend.contentType == 5) {
                  this.collShow = true;
                }
                this.collect = this.tideData.collect;
                if (this.collect === 0) {
                  this.collectionShow = false;
                } else {
                  this.collectionShow = true;
                }
              }
              this.greenwayIn = false;
            }
            this.loading = false;
            this.TabScreen();
            if (this.cityLocation === "地球" || _data.weatherDetail === null) {
              this.weatherShow = false;
            } else {
              // 首页天气显示
              if (_data.weatherDetail !== null) {
                this.user.weather.img = _data.weatherDetail.eventsIcon;
                this.user.weather.temperatureDay =
                  _data.weatherDetail.temperature;
              }
            }
            this.TextLocation();
          }
        });
    },
    // 搜索
    BigSearch() {
      this.$router.push({
        path: "/bigSearch",
      });
    },
    // 天气
    weatherA() {
      window.location.href = `https://tgr.wiiqq.com/appserver/index.html#/?cityId=${this.user.cityID}`;
    },
    showToast(item) {
      console.log(item);
      if (item.title === "一键求助") {
        // 在园区内 一键求助
        this.$router.push({
          path: "/oneSeekHelp",
          query: {
            scenicId: this.scenicId,
          },
        });
      } else if (item.title === "园区") {
        // 不在园区内     园区跳转绿道名片
        this.$router.push({
          path: "/greenwayCard",
        });
      } else if (item.title === "找厕所") {
        this.$router.push({
          path: "/findWC",
          query: {
            scenicId: this.scenicId,
          },
        });
      } else if (item.title === "找停车场") {
        // 跳转小程序
        wx.miniProgram.navigateTo({ url: "/etcPackages/pages/parking/index" });
      } else if (item.title === "活动赛事") {
        this.$router.push({
          path: "/activityEvent",
          query: {
            id: this.scenicId,
            title: this.greenWayName,
          },
        });
      } else if (item.title === "投诉") {
        if (this.greenwayIn === true) {
          this.$router.push({
            path: "/complain",
            query: {
              greenwayIn: 1,
              scenicId: this.scenicId,
            },
          });
        } else {
          this.$router.push({
            path: "/complain",
            query: {
              greenwayIn: 2,
            },
          });
        }
      } else {
        this.$toast({
          message: "敬请期待~",
          duration: "2000",
        });
      }
    },
    //切换tab
    changeAct(index) {
      this.noList = true;
      this.disTab = true;
      this.searchShow = true;
      this.activeTab = index;
      this.pageNum = 1;
      this.classData = [];
      this.finished = false;
      this.loadingList = true;
      if (this.loadingList) {
        this.TabScreen();
      }
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.pageNum = this.pageNum + 1;
        this.TabScreen();
        this.loadingList = false;
      }, 500);
    },
    // 主题列表筛选
    TabScreen() {
      let topicId = "";
      for (var i = 0; i < this.classifyTab.length; i++) {
        if (this.activeTab === i) {
          topicId = this.classifyTab[i].id;
        }
      }
      var that = this;
      this.$http
        .get(
          `/appserver/v1/recommend/content/list?topicId=${topicId}&pageNum=${that.pageNum}&pageSize=${that.pageSize}`
        )
        .then((data) => {
          if (data.data.ret === 0) {
            let classList = [];
            for (let i = 0; i < data.data.data.list.length; i++) {
              if (data.data.data.list[i].type != 6) {
                classList.push(data.data.data.list[i]);
              }
            }
            if (classList.length === 0) {
              that.finished = true;
              this.disTab = false;
            } else {
              if (classList.length > 0) {
                that.classData = that.classData.concat(classList);
              }
            }
            that.loadingList = false;
            if (this.classData.length === 0) {
              this.noList = false;
            } else {
              this.noList = true;
            }
          }
          if (this.finished === false) {
            this.disTab = true;
          } else {
            this.disTab = false;
          }
        });
    },
    // 添加收藏
    AddCollection(item) {
      var srcType = "";
      if (item.contentType === "4") {
        srcType = "strategy";
      }
      if (item.contentType === "5") {
        srcType = "scenic_route";
      }
      let data = {
        imageUrl: item.img,
        intro: item.subTitle,
        title: item.title,
        label: item.tags,
      };
      let dataParams = {
        srcType: srcType,
        srcId: item.id,
        data: JSON.stringify(data),
      };
      this.$http
        .post(`/appserver/v1/collect/save`, qs.stringify(dataParams))
        .then((data) => {
          if (data.data.ret === 0) {
            this.collectionShow = true;
          } else if (data.data.msg === "未登录") {
            this.collectionShow = false;
            this.$toast.fail("请登录");
            this.$router.push({
              path: "/bindingPhone",
            });
          }
        });
    },
    // 取消收藏
    CancelCollection(item) {
      var srcType = "";
      if (item.contentType === "4") {
        srcType = "strategy";
      }
      if (item.contentType === "5") {
        srcType = "scenic_route";
      }
      this.$http
        .post(
          `/appserver/v1/collect/cancel?srcType=${srcType}&srcId=${item.id}`
        )
        .then((data) => {
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消收藏成功");
          }
          if (data.data.msg === "未登录") {
            this.collectionShow = true;
            this.$toast.fail("请登录");
            this.$router.push({
              path: "/bindingPhone",
            });
          }
        });
    },
    // banner  当季最潮流 跳转
    BannerTo(item) {
      if (item.hrefType == 2) {
        window.location.href = item.href;
      }
      if (item.contentType == 1) {
        // 绿道名片
        this.$router.push({
          path: "greenwayCard",
        });
      } else if (item.contentType == 2) {
        // 景区名片
        this.$router.push({
          path: "/scenicCard",
          query: {
            id: item.id,
          },
        });
      } else if (item.contentType == 3) {
        // 景点名片
        this.$router.push({
          path: "/scenicDetails",
          query: {
            id: item.id,
          },
        });
      } else if (item.contentType == 4) {
        // 攻略
        this.$router.push({
          path: "/strategyDetails",
          query: {
            id: item.id,
          },
        });
      } else if (item.contentType == 5) {
        // 线路
        if (this.greenwayIn === true) {
          this.$router.push({
            path: "/scenicLineDetails",
            query: {
              id: item.id,
            },
          });
        } else {
          this.$router.push({
            path: "/lineDetails",
            query: {
              course_id: item.id,
            },
          });
        }
      }
    },
    // 附近最热
    HotTo(item) {
      this.$router.push({
        path: "/scenicDetails",
        query: {
          id: item.scenic_id,
        },
      });
    },
    // 线路跳转
    LineDetails(item) {
      if (this.greenwayIn === true) {
        this.$router.push({
          path: "/scenicLineDetails",
          query: {
            id: item.id,
          },
        });
      } else {
        this.$router.push({
          path: "/lineDetails",
          query: {
            course_id: item.id,
          },
        });
      }
    },
    // 标签分类跳转详情
    Judge(item) {
      if (item.type == 1) {
        // 绿道名片
        this.$router.push({
          path: "greenwayCard",
        });
      } else if (item.type == 2) {
        // 景区名片
        this.$router.push({
          path: "/scenicCard",
          query: {
            id: item.contentId,
          },
        });
      } else if (item.type == 3) {
        // 景点名片
        this.$router.push({
          path: "/scenicDetails",
          query: {
            id: item.contentId,
          },
        });
      } else if (item.type == 4) {
        // 攻略
        this.$router.push({
          path: "/strategyDetails",
          query: {
            id: item.contentId,
          },
        });
      } else if (item.type == 5) {
        // 线路
        if (this.greenwayIn === true) {
          this.$router.push({
            path: "/scenicLineDetails",
            query: {
              id: item.contentId,
            },
          });
        } else {
          this.$router.push({
            path: "/lineDetails",
            query: {
              course_id: item.contentId,
            },
          });
        }
      }
    },
    // Icon
    IconScroll() {
      let width = this.buttonData.length * 85;
      this.$refs.iconTab.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.iconWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 附近最热TOP
    hotScroll() {
      let width = this.hotList.length * 141;
      if (this.$refs.scenicTab === undefined) {
        return false;
      }
      this.$refs.scenicTab.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scenicWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical",
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 回到顶部
    BackTop() {
      this.bannerData = this.bannerData;
      this.searchShow = false;
    },
    //滚动到一定高度出现搜索
    handleScroll() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop >= 1100 && this.greenwayIn === false) {
        this.searchShow = true;
        this.noList = true;
      } else if (that.scrollTop >= 610 && this.greenwayIn === true) {
        this.searchShow = true;
        this.noList = true;
      }
    },
    handleAnimation(anim) {
      this.anim = anim;
    },

    stop() {
      this.anim.stop();
    },

    play() {
      this.anim.play();
    },

    pause() {
      this.anim.pause();
    },

    onSpeedChange() {
      this.anim.setSpeed(this.animationSpeed);
    },
  },
};
</script>
<style lang="scss" scoped>
.home-page {
  /deep/ .van-loading {
    margin-top: 20px;
    text-align: center;
  }
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow: auto;
    .title {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .location {
        display: flex;
        align-items: center;
        & > span,
        div {
          display: flex;
          align-items: center;
          color: #37384d;
          font-size: 16px;
          font-weight: 600;
          & > p {
            margin-left: 2px;
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(55, 56, 77, 1);
          }
          .weatherImg {
            margin-left: 10px;
          }
        }
      }
    }
    .banner {
      padding: 0 20px;
      position: relative;
      .images {
        & > div {
          padding-bottom: 38px;
        }
      }
      .images_null {
        & > div {
          background: rgba(225, 241, 234, 1);
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 445px;
          margin-bottom: 38px;
        }
      }
      /deep/ .van-image__img {
        box-shadow: inset 0px -15px 10px -15px #000;
      }
      /deep/ .van-swipe__indicators {
        bottom: 19px;
        z-index: 1200;
      }
      /deep/ .van-swipe__indicator {
        background: #dfdfdf;
        border-radius: 0px;
        width: 28px;
        height: 4px;
      }
      /deep/ .van-swipe__indicator--active {
        background: #37384d;
        width: 14px;
      }
      .bannerbg-show {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 445px;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 1) 100%
        );
        border-radius: 1px;
        opacity: 0.5;
      }
      .introduce {
        position: absolute;
        bottom: 42px;
        left: 0px;
        padding: 0 18px 20px 18px;
        width: 100%;
        box-sizing: border-box;
        & > p {
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          &:nth-of-type(2) {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
          }
        }
      }
    }
    .banner-in {
      padding: 0 20px;
      position: relative;
      .images {
        & > div {
          padding-bottom: 38px;
        }
      }
      .images_null {
        & > div {
          background: rgba(225, 241, 234, 1);
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 210px;
          margin-bottom: 38px;
        }
      }
      /deep/ .van-swipe__indicators {
        bottom: 19px;
        z-index: 1200;
      }
      /deep/ .van-swipe__indicator {
        background: #dfdfdf;
        border-radius: 0px;
        width: 28px;
        height: 4px;
      }
      /deep/ .van-swipe__indicator--active {
        background: #37384d;
        width: 14px;
      }
      .bannerbg-show {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 210px;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 1) 100%
        );
        border-radius: 1px;
        opacity: 0.5;
      }
      .introduce {
        position: absolute;
        bottom: 42px;
        left: 0px;
        padding-left: 18px;
        padding-bottom: 20px;
        width: 100%;
        box-sizing: border-box;
        box-shadow: inset 0px -39px 30px -21px #000;
        & > p {
          color: #fff;
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          line-height: 33px;
          &:nth-of-type(2) {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
          }
        }
      }
    }
    .icon-box {
      padding-left: 20px;
      & > div {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .person-wrap {
        .person-list {
          .person-item {
            display: inline-block;
            width: 85px;
            position: relative;
            z-index: 100;
            .item {
              width: 62px;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              & > p {
                margin-top: 12px;
                color: #555959;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    // 当季最潮流
    .tide-box {
      margin-top: 10px;
      margin-bottom: 30px;
      /deep/ .van-cell {
        padding: 15px 20px;
      }
      /deep/ .van-cell__title span {
        color: #37384d;
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC;
      }
      /deep/ .van-cell__right-icon {
        color: #37384d;
        font-size: 18px;
        font-weight: 700;
      }
      /deep/ .van-cell:not(:last-child)::after {
        border: 0px;
      }
      .tide-item {
        padding: 0px 20px;
        display: flex;
        align-items: flex-end;
        a {
        }
        .right {
          width: 69%;
          box-shadow: 0px 2px 6px 2px rgba(62, 86, 90, 0.1);
          box-sizing: border-box;
          height: 110px;
          padding: 19px 12px;
          & > span {
            display: inline-block;
            color: #555959;
            font-size: 10px;
            padding: 5px;
            background: rgba(62, 86, 90, 0.1);
            border-radius: 2px;
            margin-bottom: 8px;
            margin-right: 6px;
          }
          & > p {
            color: #555959;
            line-height: 20px;
            font-size: 15px;
            font-weight: 700;
            width: 100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            margin-bottom: 5px;
          }
          & > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            & > span {
              color: #555959;
              line-height: 20px;
            }
            /deep/ .van-icon {
              color: #e4e4e4;
              font-size: 16px;
              margin-right: 12px;
              margin-top: -5px;
            }
          }
        }
      }
    }
    // 绿道必游路线
    .way {
      margin-top: 10px;
      /deep/ .van-cell {
        padding: 15px 20px;
      }
      /deep/ .van-cell__title span {
        color: #37384d;
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC;
      }
      /deep/ .van-cell__right-icon {
        color: #37384d;
        font-size: 18px;
        font-weight: 700;
      }
      /deep/ .van-cell:not(:last-child)::after {
        border: 0px;
      }
      .way-wrap {
        padding-left: 20px;
        .way-list {
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          .swiper-container {
            width: 100%;
            height: 100%;
            margin-left: -26px;
            overflow: initial;
            .swiper-slide {
              height: 187px;
              text-align: center;
              font-size: 18px;
              background: #fff;
              /* Center slide text vertically */
              display: -webkit-box;
              display: -ms-flexbox;
              display: -webkit-flex;
              display: flex;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              -webkit-align-items: center;
              align-items: center;
              transition: 300ms;
              transform: scale(0.9);
              .way-item {
                width: 100%;
                height: 100%;
                position: relative;
                & > img {
                  width: 100%;
                  height: 100%;
                  z-index: 100;
                }
                .bg-show {
                  position: absolute;
                  top: 0;
                  left: 0;
                  padding: 15px;
                  z-index: 200;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  background: linear-gradient(
                    180deg,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(0, 0, 0, 1) 100%
                  );
                  border-radius: 1px;
                  opacity: 0.7;
                }
                .way-introduce {
                  position: absolute;
                  top: 0;
                  left: 0;
                  padding: 15px;
                  z-index: 300;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  display: flex;
                  flex-wrap: wrap;
                  align-content: space-between;
                  text-align: left;
                  .way-tips {
                    background: rgba(242, 247, 251, 0.3);
                    text-align: center;
                    border-radius: 20px;
                    padding: 7px 10px;
                    color: #fff;
                    font-size: 12px;
                  }
                  & > div {
                    color: #fff;
                    width: 100%;
                    position: relative;
                    padding-top: 24px;
                    .way-location {
                      position: absolute;
                      top: 0;
                      left: 0;
                      display: inline;
                      padding: 7px 8px;
                      box-sizing: border-box;
                      background: rgba(255, 255, 255, 0.2);
                      border-radius: 20px;
                      display: flex;
                      & > p {
                        font-size: 12px;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                      }
                      /deep/ .van-image {
                        top: 2px;
                      }
                    }
                    .way-title {
                      margin-top: 8px;
                      font-size: 18px;
                      font-family: PingFangSC;
                      font-weight: 500;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 1;
                      overflow: hidden;
                    }
                  }
                }
              }
            }
            .swiper-slide-active,
            .swiper-slide-duplicate-active {
              transform: scale(1);
            }
          }
        }
      }
    }
    // tags-style
    .way-label {
      margin-top: 8px;
      & > span {
        display: inline-block;
        font-family: PingFangSC;
        font-weight: 400;
        padding: 3px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-right: 8px;
        font-size: 12px;
      }
    }
    // 附近最热TOP
    .hot {
      margin-top: 27px;
      /deep/ .van-cell {
        padding: 15px 20px;
      }
      /deep/ .van-cell__title span {
        color: #37384d;
        font-size: 16px;
        font-weight: 600;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
      /deep/ .van-cell__right-icon {
        color: #37384d;
        font-size: 18px;
        font-weight: 700;
      }
      /deep/ .van-cell:not(:last-child)::after {
        border: 0px;
      }
      .hot-list {
        margin-left: 20px;
        .select-person {
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          .person-wrap {
            .person-list {
              .person-item {
                display: inline-block;
                width: 141px;
                position: relative;
                z-index: 100;
                .distance {
                  position: absolute;
                  top: 0;
                  left: 0px;
                  z-index: 300;
                  font-size: 12px;
                  font-family: PingFangSC;
                  font-weight: 400;
                  color: #fff;
                  padding: 5px 10px;
                  background: rgba(0, 0, 0, 0.3);
                  border-radius: 2px;
                }
                & > div {
                  width: 126px;
                  font-family: PingFangSC;
                  color: #555959;
                  & > p {
                    margin-top: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    line-height: 15px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    &:nth-of-type(2) {
                      font-size: 12px;
                      font-weight: 300;
                      line-height: 12px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .content-show {
    flex: 0;
  }
  // 标签分类
  .classify {
    margin-top: 25px;
    background: #fff;
    position: relative;
    /deep/ .van-hairline--top-bottom::after {
      border: 0;
    }
    /deep/ .van-tabs__line {
      background: #188357;
    }
    /deep/ .van-tab {
      font-size: 16px;
      font-family: PingFangSC;
      color: rgba(85, 89, 89, 1);
    }
    /deep/ .van-tab--active {
      font-size: 16px;
      font-family: PingFangSC;
      font-weight: 600 !important;
      color: rgba(85, 89, 89, 1);
    }
    .tab {
      position: fixed;
      top: 54px;
      z-index: 1110;
      height: 43px;
      width: 100%;
      overflow: hidden;
    }
    .list {
      padding: 0 20px;
      // -moz-column-count: 2;
      // -webkit-column-count: 2;
      // column-count: 2;
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      .list-item {
        // break-inside: avoid;
        width: 48.5%;
        margin-bottom: 14px;
        margin-right: 3%;
        background: #fff;
        box-shadow: 0px 2px 6px 0px rgba(62, 86, 90, 0.15);
        border-radius: 2px;
        &:nth-child(even) {
          margin-right: 0px;
        }
        /deep/ .van-image__img {
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
        }

        p {
          padding: 11px;
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 600;
          color: rgba(85, 89, 89, 1);
          line-height: 20px;
        }
      }
    }

    .list-show {
      margin-top: 90px;
    }
  }
  .class-search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1100;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    /deep/ .van-search {
      padding: 10px 0;
      width: 283px;
    }
    /deep/ .van-search__content {
      background: rgba(241, 241, 241, 1);
      border-radius: 2px;
    }
    /deep/ .van-cell {
      background: rgba(241, 241, 241, 1);
      border-radius: 2px;
    }
    /deep/ .van-icon {
      color: #37384d;
      font-weight: 600;
    }
    /deep/ .van-tabs__line {
      z-index: 2000;
    }
    & > div {
      &:nth-of-type(2) {
        a {
          display: inline-block;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          width: 40px;
        }
      }
      .triangle {
        width: 0;
        height: 0;
        border-width: 0 7px 7px;
        border-style: solid;
        border-color: transparent transparent #37384d;
      }
      & > p {
        &:nth-of-type(2) {
          font-size: 12px;
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(85, 89, 89, 1);
          line-height: 17px;
          margin-top: 4px;
        }
      }
    }
  }
  .no-list {
    margin-top: 140px;
    display: flex;
    justify-content: center;
    & > div {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      & > p {
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
