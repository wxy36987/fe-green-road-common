<template>
  <div class="activity" v-if="!pageLoading">
    <div class="content">
      <div class="tab">
        <van-tabs v-model="activeTab">
          <van-tab title="活动" name="a">
            <van-list
              v-model="loading"
              :finished="finished"
              :finished-text="finishedText"
              @load="onLoad"
            >
              <div
                v-for="(item, index) in list"
                :key="index"
                class="activity-listbox"
                @click="ActivityDetail(item)"
              >
                <div class="activity-list">
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
                            item.isEnroll == 1
                        "
                        >{{ item.activity_status }}</span
                      >
                      <span
                        class="spanend span-1"
                        v-if="item.activity_status == '已结束'"
                        >{{ item.activity_status }}</span
                      >
                      <span class="span-2">{{ item.name }}</span>
                    </p>
                    <p class="active-details">
                      <span v-if="item.isResident == 0"
                        >活动时间：{{
                          item.activityStartTime | dateFrm("MM月DD日")
                        }}-{{
                          item.activityEndTime | dateFrm("MM月DD日")
                        }}</span
                      >
                      <span v-if="item.isResident == 1">常驻活动</span>
                      <span
                        v-if="item.replyCount !== null && item.replyCount != 0"
                        v-show="item.isEnroll != 2 && item.type != 1"
                      >
                        已报名：{{ item.replyCount }}人</span
                      >
                    </p>
                  </div>
                </div>
                <div class="stats" v-if="item.isExamine == 0">
                  <van-image :src="Icon" width="14px" height="14px"></van-image>
                  报名审核中，请耐心等待…
                </div>
                <div class="stats" v-if="item.isExamine == 1">
                  <van-image
                    :src="IconSuc"
                    width="14px"
                    height="14px"
                  ></van-image>
                  报名成功，请及时参与
                </div>
                <div class="stats" v-if="item.isExamine == 2">
                  <van-image
                    :src="IconSad"
                    width="14px"
                    height="14px"
                  ></van-image>
                  报名失败
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
                <p>您尚未参加任何活动</p>
              </div>
            </div>
          </van-tab>
          <van-tab title="赛事" name="b">
            <van-list
              v-model="loading1"
              :finished="finished1"
              :finished-text="finishedText1"
              @load="onLoad1"
            >
              <div
                class="activity-listbox"
                v-for="(item, index) in listSh"
                :key="index"
                @click="ShDetail(item)"
              >
                <div class="activity-list activity-list1">
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
                      <span class="span-1">{{ item.key }}</span>
                      <span class="span-2">{{
                        item.name | limitCount("12")
                      }}</span>
                    </p>
                    <p class="active-details">
                      比赛时间：{{ getTime(item.game_time) }}
                      <span v-if="item.signup_end"
                        >报名截止：{{ getTime(item.signup_end) }}</span
                      >
                    </p>
                  </div>
                </div>
                <div class="stats" v-if="item.user_type == 1">
                  <van-image :src="Icon" width="14px" height="14px"></van-image>
                  报名审核中，请耐心等待…
                </div>
                <div class="stats" v-if="item.user_type == 2">
                  <van-image
                    :src="IconSuc"
                    width="14px"
                    height="14px"
                  ></van-image>
                  报名成功，请及时参与
                </div>
                <div class="stats" v-if="item.user_type == 3">
                  <van-icon name="smile-o"></van-icon>
                  比赛已结束
                </div>
                <div class="stats" v-if="item.user_type == 4">
                  <van-image
                    :src="IconSad"
                    width="14px"
                    height="14px"
                  ></van-image>
                  对不起，您的此次报名审核不通过
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
                <p>暂无赛事</p>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
  <Loading v-else-if="pageLoading && isWechatApplet"></Loading>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import Loading from "@/components/loading"
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
      finishedText: "没有更多数据了",
      listSh: [],
      loading1: false,
      finished1: false,
      pageNum1: 0,
      finishedText1: "没有更多数据了",
      noList: false,
      noList1: false,
      noListIcon: require("../../assets/iconImage/list@2x.png"), // 无数据
      Icon: require("../../assets/iconImage/ic_right@3x.png"),
      IconSuc: require("../../assets/iconImage/ic_right_scuess@3x.png"),
      IconSad: require("../../assets/iconImage/ic_sad@3x.png"),
      WxUid: "",
      isWechatApplet: false,
      pageLoading: false,
      pageSet: false    
    };
  },
  created() {
    // eslint-disable-next-line
    this.fullloading = true;
    console.log(this.$route.query.session_id, "555");
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      document.title = "我的活动赛事";
      this.isWechatApplet = true;
      var dataParams = {
        wxa_session_id: this.$route.query.session_id,
      };
      this.$http
        .post(`/appserver/v1/user/get_auth_data`, qs.stringify(dataParams))
        .then((data) => {
          if (data.data.ret === 0) {
            var _data = data.data.data;
            this.WxUid = _data.uid;
            // eslint-disable-next-line
            console.log(this.WxUid, "wxuid");
          }
        });
    } else {
      document.title = "我的活动赛事";
      window.wii.app.invoke("setTitle", "我的活动赛事");
      window.wii.app.invoke("showNativeBar", true);
    }
    this.onLoad();
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "我的活动赛事");
    };
  },
  methods: {
    getTime(time) {
      var year = time.slice(2);
      return year.replace("-", ".").replace("-", ".");
    },
    onLoad() {
      this.loading = true;
      this.pageNum = this.pageNum + 1;
      if (!this.pageSet) {
        this.pageSet = true
        this.pageLoading = true
      }
      this.getActiveList();
    },
    onLoad1() {
      this.loading1 = true;
      this.pageNum1 = this.pageNum1 + 1;
      this.getShList();
    },
    //获取列表
    getActiveList() {
      // eslint-disable-next-line
      console.log(this.uid);
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.uid = this.$route.query.uid;
      } else {
        this.uid = this.uid;
      }
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.uid,
      };
      // eslint-disable-next-line
      console.log(this.uid);
      this.$http
        .post(`/appserver/v1/activity/list`, qs.stringify(params))
        .then((data) => {
          // 加载状态结束
          this.loading = false;
          this.pageLoading = false;
          if (data.data.ret == 0) {
            if (data.data.data !== null) {
              if (data.data.data.list !== null) {
                // 异步更新数据
                setTimeout(() => {
                  var rows = data.data.data.list;
                  for (var i = 0; i < rows.length; i++) {
                    this.list.push(rows[i]);
                  }

                  // 数据全部加载完成
                  if (this.list.length >= data.data.data.pagination.total) {
                    this.finished = true;
                  }
                  if (this.list.length === 0 && this.loading === false) {
                    this.finishedText = "";
                    this.noList = true;
                  } else {
                    this.noList = false;
                  }
                }, 500);
              } else {
                this.finished = true;
                this.finishedText = "";
                this.noList = true;
              }
            } else {
              this.finished = true;
              this.finishedText = "";
              this.noList = true;
            }
          } else {
            this.finished = true;
            this.finishedText = data.data.msg;
          }
          this.showLoading(false);
        })
        .catch((error) => {
          this.showLoading(false);
          this.$toast("网络异常,检查网络再试试~~");
          this.pageLoading = false
        });
    },
    // 赛事获取列表
    getShList() {
      var ua = navigator.userAgent.toLowerCase();
      var url = "";
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        url = `${this.baseURL}/game/api/user/my-game?current_page=${
          this.pageNum1
        }&page_size=${this.pageSize}&wxa_session_id=${
          this.$route.query.session_id
        }`;
      } else {
        url = `${this.baseURL}/game/api/user/my-game?current_page=${
          this.pageNum1
        }&page_size=${this.pageSize}`;
      }
      var self = this;
      // eslint-disable-next-line
      $.ajax({
        type: "post",
        url: url,
        xhrFields: {
          withCredentials: true,
        },
        success: function(data) {
          if (data.ret == 0) {
            if (data.data !== null) {
              if (data.data.list !== null) {
                setTimeout(() => {
                  var rows = data.data.list;
                  self.listSh = self.listSh.concat(rows);
                  //加载状态结束
                  self.loading1 = false; //数据全部加载完成
                  if (self.listSh.length >= data.data.pagination.total) {
                    self.finished1 = true;
                  }
                  if (self.listSh.length === 0 && self.loading1 === false) {
                    self.finishedText1 = "";
                    self.noList1 = true;
                  } else {
                    self.noList1 = false;
                  }
                }, 500);
              } else {
                self.finishedText1 = "";
                self.finished1 = true;
                self.loading1 = false;
                self.noList1 = true;
              }
            } else {
              self.finishedText1 = "";
              self.finished1 = true;
              self.loading1 = false;
              self.noList1 = true;
            }
          }
        },
      });
    },
    // 活动赛事详情
    ActivityDetail(item) {
      if (item.isPublish == 1) {
        this.$toast("该活动已下线");
        return false;
      }
      if (item.curStatus == 1) {
        this.$toast("该活动已下线");
        return false;
      }
      var urlWX = `${this.domain}activityDetail?id=${item.id}&uid=${
        this.$route.query.uid
      }&session_id=${this.$route.query.session_id}&type=1`;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
            urlWX
          )}`,
        });
      } else {
        this.$router.push({
          path: "/activityDetail",
          query: {
            id: item.id,
            session_id: this.$route.query.session_id,
            uid: this.$route.query.uid,
            from: "web",
          },
        });
      }
    },
    // 赛事详情
    ShDetail(item) {
      if (item.status == 2) {
        this.$toast("该赛事已下线");
        return false;
      }
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/etcPackages/pages/h5-view?needLogin=1&src=${encodeURIComponent(
            `${this.saishi}${item.gid}?wxa_session_id=${
              this.$route.query.session_id
            }`
          )}&shareTitle=活动赛事&shareImg=${item.point_pics}`,
        });
      } else {
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.saishi}${item.gid}?wxa_session_id=${
            this.$route.query.session_id
          }`,
          isFullScreen: 0,
          setTitle: "赛事详情",
          needLoading: 0,
        });
      }
    },
  },
  components: {
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
        transform: translateX(41.5px) translateX(-50%);
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
      .activity-listbox {
        margin-bottom: 5%;
        margin: 0 20px;
        margin-bottom: 15px;
        .stats {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 15px 12px;
          border: 1px solid #eee;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(55, 56, 77, 1);
          line-height: 12px;
          /deep/ .van-icon {
            font-size: 18px;
            color: #999;
          }
          & > div {
            margin-right: 6px;
          }
        }
      }
      .activity-list {
        height: 188px;
        position: relative;
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
              min-width: 30px;
              color: #fff;
              font-size: 12px;
              background: #188357;
              border-radius: 2px;
              margin-right: 7px;
              text-align: center;
              padding: 2px 5px;
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
              width: 75%;
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
            margin-top: 11px;
            height: 15px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 14px;
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
@media screen and (max-width: 360px) {
  .activity .content .tab .activity-list .introduce .activity-tit .span-2 {
    width: 77%;
  }
}
@media screen and (max-width: 350px) {
  .activity .content .tab .activity-list .introduce .activity-tit .span-2 {
    width: 75%;
  }
}
@media screen and (max-width: 360px) {
  .activity .content .tab .activity-list1 .introduce .activity-tit .span-2 {
    width: 78% !important;
  }
}
@media screen and (max-width: 350px) {
  .activity .content .tab .activity-list1 .introduce .activity-tit .span-2 {
    width: 75% !important;
  }
}
</style>
