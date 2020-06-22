<template>
  <div class="hot-map">
    <van-loading size="24px" v-if="loading">加载中...</van-loading>
    <div class="title" v-show="!loading">
      <div class="senic">{{ detail.name }}</div>
      <div
        class="people"
        v-if="detail.hot_map && detail.hot_map.scenic_person_count"
      >
        实时人数：{{ detail.hot_map && detail.hot_map.scenic_person_count }}
      </div>
    </div>
    <div v-show="!loading" class="map-box" id="map-box">
      <div id="hotmap" class="map"></div>
    </div>
    <empty ref="emptyView" :emptyShow="emptyShow"></empty>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
const QQMap = window.qq.maps;
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      loading: false,
      latitude: "",
      longitude: "",
      detail: {},
      emptyShow: false,
    };
  },
  created() {
    //设置标题
    window.wii.app.invoke("setTitle", "实时景区热度");
    //获取经纬度
    this.commonLatLong((LatLng) => {
      this.latitude = LatLng.latitude;
      this.longitude = LatLng.longitude;
      this.initData();
    });
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "实时景区热度");
    };
  },
  methods: {
    initData() {
      let _param = {
        type: "2",
        scenic_id: this.$route.query.id,
      };
      try {
        this.loading = true;
        this.$http
          .get(`/appserver/v1/manage/card/detail?${qs.stringify(_param)}`)
          .then((res) => {
            this.detail = res.data.data;
            this.loading = false;
            this.initMap();
          })
          .catch((error) => {
            this.emptyShow = true;
          });
      } catch (error) {
        this.loading = false;
      }
    },
    initMap() {
      var myLatlng = new QQMap.LatLng(
        this.latitude || 30.657387,
        this.longitude || 104.06593
      );
      this.map = new QQMap.Map(document.getElementById("hotmap"), {
        center: myLatlng,
        zoom: 16,
        zoomControl: false,
        disableDefaultUI: true,
      });
      // 创建散点图对象
      var heat = new QQMap.visualization.Heat({
        map: this.map, // 必填参数，指定显示散点图的地图对象
        radius: 30, // 辐射半径，默认为20
      });
      // 获取散点数据
      var data = this.getHeatData();
      // 向散点图传入数据
      heat.setData(data);
    },
    getHeatData() {
      let data = [];
      let dots = [];
      let lats = [];
      let lngs = [];
      let max = 0;
      let min = 0;
      try {
        dots = this.detail.hot_map.hot_spread[0].points;
      } catch (error) {}
      dots.forEach((e) => {
        if (Number(e.weight) > max) {
          max = e.weight;
        }
        if (Number(e.weight) < min) {
          min = e.weight;
        }
        lats.push(Number(e.lat));
        lngs.push(Number(e.lng));
        data.push({
          lat: Number(e.lat),
          lng: Number(e.lng),
          value: Number(e.weight),
        });
      });
      if (lats.length > 0) {
        lats = lats.sort();
        lngs = lngs.sort();
        let sw = new QQMap.LatLng(lats[0], lngs[0]);
        let ne = new QQMap.LatLng(lats[lats.length - 1], lngs[lngs.length - 1]);

        let llb = new QQMap.LatLngBounds(sw, ne);
        this.map.fitBounds(llb);
      }
      return {
        data,
        max,
        min,
      };
    },
  },
  components: {
    empty,
  },
};
</script>
<style lang="scss" scoped>
.hot-map {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 20px;
    padding-bottom: 15px;
    .senic {
      font-size: 18px;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 26px;
    }
    .people {
      font-size: 12px;
      font-weight: 300;
      color: rgba(85, 89, 89, 1);
      line-height: 15px;
    }
  }
  .map-box {
    flex: 1;
    width: 100%;
    .map {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
