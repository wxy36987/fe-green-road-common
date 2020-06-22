<template>
  <div class="activity">
    <div class="title">
      <van-nav-bar title="活动赛事">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="tab">
        <activity-event></activity-event>
      </div>
    </div>
  </div>
</template>
<script>
import activityEvent from "../activityEvent/ActivityEvent";
export default {
  data() {
    return {
      img: require("../../assets/iconImage/person_bg.png"),
      activeTab: "1",
      list: [],
      loading: false,
      finished: false,
      pageNum: 0,
      pageSize: "10"
    };
  },
  components: {
    // eslint-disable-next-line
    activityEvent
  },
  created() {
    window.wii.app.invoke("setTitle", "活动赛事");
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.activity {
  .title {
    /deep/ .van-nav-bar .van-icon {
      color: #000;
      font-weight: 700;
      font-size: 20px;
    }
    /deep/ .van-nav-bar__title {
      font-size: 18px;
      font-weight: 600;
      color: #2c2c2c;
    }
  }
}
</style>
