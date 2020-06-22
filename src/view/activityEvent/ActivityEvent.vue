<template>
  <div class="activity" v-if="!pageLoading">
    <div class="content">
      <div class="tab">
        <van-tabs v-model="activeTab" @click="ActiveTab">
          <van-tab title="活动" name="a">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="finishedText"
              v-if="!noList"
              @load="onLoad"
            >
              <div
                v-for="(item, index) in list"
                :key="index"
                class="activity-list"
                @click="ActivityDetail(item)"
              >
                <div class="bg"></div>
                <div class="images">
                  <van-image
                    :src="item.coverImg"
                    width="100%"
                    height="188px"
                  ></van-image>
                </div>
                <div class="introduce">
                  <p class="activity-tit">
                    <span
                      class="span-1"
                      v-if="
                        item.activity_status !== '已结束' &&
                          item.isResident != 1
                      "
                      >{{ item.activity_status }}</span
                    >
                    <span
                      class="span-1 spanend"
                      v-if="item.activity_status == '已结束'"
                      >{{ item.activity_status }}</span
                    >
                    <span class="span-2">{{ item.name }}</span>
                  </p>
                  <p class="active-details">
                    <span v-if="item.isResident == 0"
                      >活动时间：{{
                        item.activityStartTime | dateFrm("MM月DD日")
                      }}-{{ item.activityEndTime | dateFrm("MM月DD日") }}</span
                    >
                    <span v-if="item.isResident == 1">常驻活动</span>
                    <span
                      v-if="item.replyCount !== null && item.replyCount != 0"
                      v-show="item.isEnroll != 2 && item.type != 1"
                    >
                      已报名：{{ item.replyCount }}人</span
                    >
                    <!-- <span
											v-if="item.replyCount == null && item.replyCount == 0"
											v-show="item.isEnroll != 2 && item.type != 1"
											>已报名：0人</span
										> -->
                  </p>
                </div>
              </div>
            </van-list>
            <!-- 搜索无数据 -->
            <div class="search-result" v-if="noList">
              <div>
                <van-image
                  :src="noListIcon"
                  width="200px"
                  height="200px"
                ></van-image>
                <p>暂无活动内容哟</p>
              </div>
            </div>
          </van-tab>
          <van-tab title="赛事" name="b">
            <van-list
              v-model="loading1"
              :finished="finished1"
              :finished-text="finishedText1"
              @load="onLoad1"
              v-if="!noList1"
            >
              <div
                v-for="(item, index) in listSh"
                :key="index"
                class="activity-list activity-list1"
                @click="ShDetail(item)"
              >
                <div class="bg"></div>
                <div class="images">
                  <van-image
                    :src="item.point_pics"
                    width="100%"
                    height="188px"
                  ></van-image>
                </div>
                <div class="introduce">
                  <p class="activity-tit">
                    <span class="span-1" v-if="item.key !== '比赛结束'">{{
                      item.key
                    }}</span>
                    <span
                      class="span-1 spanend"
                      v-if="item.key == '比赛结束'"
                      >{{ item.key }}</span
                    >
                    <span class="span-2">{{ item.name }}</span>
                  </p>
                  <p class="active-details">
                    比赛时间：{{ getTime(item.game_time) }}
                    <span v-if="item.signup_end"
                      >&#12288;报名截止：{{ getTime(item.signup_end) }}</span
                    >
                  </p>
                </div>
              </div>
            </van-list>
            <!-- 搜索无数据 -->
            <div class="search-result" v-if="noList1">
              <div>
                <van-image
                  :src="noListIcon"
                  width="200px"
                  height="200px"
                ></van-image>
                <p>暂时没有赛事内容哟</p>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <empty ref="emptyView" :emptyShow="emptyShow"></empty>
  </div>
  <Loading v-else-if="pageLoading && isWechatApplet"></Loading>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import empty from "@/components/empty.vue";
import Loading from "@/components/loading.vue";
export default {
  data() {
    return {
      img: require("../../assets/iconImage/person_bg.png"),
      activeTab: "1",
      list: [],
      loading: false,
      finished: false,
      pageNum: 0,
      pageSize: "10",
      noList: false,
      noListIcon: require("../../assets/iconImage/list@2x.png"), // 无数据
      finishedText: "",
      listSh: [],
      loading1: false,
      finished1: false,
      pageNum1: 0,
      finishedText1: "",
      noList1: false,
      lat: "",
      lng: "",
      title: "",
      id: "",
      headTitle: "活动赛事",
      emptyShow: false,
      pageLoading: false,
      pageSet: false,
      isWechatApplet: false,
    };
  },
  created() {
    var ua = navigator.userAgent.toLowerCase();
    // eslint-disable-line no-unused-vars
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      document.title = this.headTitle;
      this.isWechatApplet = true;
    } else {
      window.wii.app.invoke("setTitle", this.headTitle);
      window.wii.app.invoke("showNativeBar", true);
      this.commonLatLong((LatLng) => {
        this.latitude = LatLng.latitude;
        this.longitude = LatLng.longitude;
      });
    }
    // }
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", this.headTitle);
    };
  },
  methods: {
    init() {
      this.$http
        .get(`/appserver/v1/api/home/detail`, {
          headers: {
            latitude: this.lat, //纬度
            longitude: this.lng, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            let _data = data.data.data;
            this.title = _data.greenWayName;
            document.title = this.title;
            window.wii.app.invoke("showNativeBar", true);
          }
        });
    },
    onLoad() {
      this.loading = true;
      this.pageNum = this.pageNum + 1;
      if (!this.pageSet) {
        this.pageSet = true;
        this.pageLoading = true;
        if (!this.isWechatApplet && this.isIOSDev()) {
          this.showLoading(true);
        }
      }
      if (this.pageNum === 1) {
        setTimeout(() => {
          this.getActiveList();
        }, 600);
      } else {
        this.getActiveList();
      }
    },
    onLoad1() {
      this.loading1 = true;
      this.pageNum1 = this.pageNum1 + 1;
      this.getShList();
    },
    // 活动获取列表
    getActiveList() {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        scenicId: this.$route.query.id,
      };
      this.$http
        .post(`/appserver/v1/activity/list`, qs.stringify(params))
        .then((data) => {
          this.loading = false;
          this.pageLoading = false;
          if (data.data.ret == 0) {
            if (
              data.data.data == null ||
              data.data.data.list == null ||
              data.data.data.list.length == 0
            ) {
              this.finished = true;
              this.finishedText = "";
            } else {
              this.list = this.list.concat(data.data.data.list);
              // 数据全部加载完成
              if (this.list.length >= data.data.data.pagination.total) {
                this.finished = true;
                this.finishedText = "没有更多了";
              }
            }
          } else {
            this.finished = true;
          }
          if (this.list.length <= 0) {
            this.noList = true;
          }
          if (!this.isWechatApplet && this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
        })
        .catch((error) => {
          this.emptyShow = true;
          this.loading = false;
          if (!this.isWechatApplet && this.isIOSDev()) {
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
        });
    },
    // 赛事获取列表
    getShList() {
      var self = this;
      // eslint-disable-next-line
      $.ajax({
        type: "post",
        url: `${this.baseURL}/game/api/game/game-list?current_page=${this.pageNum1}&page_size=${this.pageSize}`,
        xhrFields: {
          withCredentials: true,
        },
        success: function(data) {
          self.loading1 = false;
          if (data.ret == 0) {
            if (
              data.data == null ||
              data.data.list == null ||
              data.data.list.length == 0
            ) {
              self.finishedText1 = "";
              self.finished1 = true;
            } else {
              self.listSh = self.listSh.concat(data.data.list);
              //加载状态结束
              if (self.listSh.length >= data.data.pagination.total) {
                self.finished1 = true;
                self.finishedText1 = "没有更多了";
              }
            }
          } else {
            self.finishedText1 = "";
            self.finished1 = true;
          }
          if (self.listSh.length <= 0) {
            self.noList1 = true;
          }
        },
      });
    },
    getTime(time) {
      var year = time.slice(2);
      return year.replace("-", ".").replace("-", ".");
    },
    // 活动详情
    ActivityDetail(item) {
      //eslint-disable-next-line
      console.log(
        "this.$route.query.session_id:" +
          this.$route.query.session_id +
          " ==" +
          this.$route.query.uid +
          "==" +
          item.id
      );
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.$router.push({
          path: "/activityDetail",
          query: {
            id: item.id,
            session_id: this.$route.query.session_id,
            uid: this.$route.query.uid,
            from: "web",
            isShareWeb: false,
          },
        });
      } else {
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.domain}activityDetail?id=${item.id}&session_id=${this.$route.query.session_id}`,
          isFullScreen: 0,
          setTitle: "活动详情",
          needLoading: 1,
        });
      }
    },
    // 赛事详情
    ShDetail(item) {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
            `${this.saishi}${item.gid}`
          )}&shareTitle=${item.name}&shareImg=${item.point_pics}`,
          // url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
          // 	`https://cos-web-h5.wiiqq.com/fwpt-h5-dc/index.html#/detail/${item.gid}`
          // )}`
        });
      } else {
        // window.location.href = urlWX;
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.saishi}${item.gid}`,
          // openUrl: `https://cos-web-h5.wiiqq.com/fwpt-h5-dc/index.html#/detail/${item.gid}`,
          isFullScreen: 0,
          setTitle: "赛事详情",
          needLoading: 0,
        });
      }
    },
    ActiveTab(index) {
      if (index == "b") {
        this.onLoad1();
      }
    },
  },
  components: {
    empty,
    Loading,
  },
};
</script>
<style lang="scss" scoped>
.activity {
  width: 100%;
  height: 100%;
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
  .content {
    .tab {
      margin-top: 10px;
      /deep/ .van-tabs__nav {
        margin: 0 28%;
      }
      /deep/ .van-tabs__line {
        background: #188357;
        width: 36px !important;
        border-radius: 0px;
      }
      /deep/ .van-tab__pane {
        height: 100%;
      }
      /deep/ .van-list {
        margin-top: 20px;
      }
      /deep/ .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border-width: 0px 0;
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
      .activity-list {
        position: relative;
        margin-bottom: 5%;
        height: 188px;
        margin: 0 20px;
        margin-bottom: 15px;
        .bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0px;
          left: 0px;
          background-image: linear-gradient(
            rgba(0, 0, 0, 0),
            50%,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.6)
          );
          z-index: 200;
          border-radius: 2px;
        }
        .images {
          position: relative;
          width: 100%;
          height: 188px;
          z-index: 1;
          border-radius: 2px;
          /deep/ .van-image__error {
            background: #e1f1ea;
          }
          /deep/ .van-icon {
            display: none;
          }
          /deep/ .van-image {
            border-radius: 2px;
          }
          /deep/ .van-image img {
            border-radius: 2px;
          }
        }
        .introduce {
          position: absolute;
          bottom: 11px;
          color: #fff;
          z-index: 999;
          padding: 0 12px;
          width: 100%;
          box-sizing: border-box;
          .activity-tit {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            .span-1 {
              display: inline-block;
              min-width: 50px;
              color: #fff;
              font-size: 12px;
              background: #188357;
              border-radius: 2px;
              margin-right: 7px;
              text-align: center;
              padding: 2px 1px;
              height: 15px;
              font-size: 10px;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
              line-height: 15px;
            }
            .spanend {
              background: #000;
            }
            .span-2 {
              display: inline-block;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              font-size: 18px;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
            }
          }
          .active-details {
            margin-top: 5px;
            height: 15px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      #activityEvent {
        width: 100%;
        min-height: 750px;
      }
    }
    .search-result {
      margin-top: 54px;
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
}
.activity-list1 {
  .span-2 {
    width: 77% !important;
  }
}
</style>
