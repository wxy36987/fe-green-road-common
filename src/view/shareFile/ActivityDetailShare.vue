<template>
  <div class="activity-details">
    <div class="header-img">
      <div class="img-banner">
        <van-swipe :autoplay="3000" @change="onChange" indicator-color="white">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img v-lazy="image.imageUrl" />
          </van-swipe-item>
          <!--          <div class="custom-indicator" slot="indicator">-->
          <!--            {{ current + 1 }}/{{images.length}}-->
          <!--          </div>-->
        </van-swipe>
        <!--        <van-image-->
        <!--          width="100%"-->
        <!--          height="210px"-->
        <!--          :src="img"-->
        <!--        />-->
        <!-- <div class="collect-shadow"></div> -->
        <!-- <div class="collect" v-if="!WxShow">
					<van-image
						:src="collectIconN"
						width="30px"
						height="30px"
						v-if="!collectionShow"
					></van-image>
					<van-image
						:src="collectIconT"
						width="30px"
						height="30px"
						v-if="collectionShow"
					></van-image>
				</div> -->
      </div>
    </div>
    <div class="site">
      <h3>{{ name }}</h3>
      <p>
        <span v-for="(item, index) in tagArr" :key="index">{{ item }}</span>
      </p>
    </div>
    <div class="time">
      <p>活动主办：{{ sponsor }}</p>
      <p>活动地点：{{ address }}</p>
      <p>
        活动时间：{{ activityStartTime | dateFrm("YYYY-MM-DD HH:mm") }} ~
        {{ activityEndTime | dateFrm("YYYY-MM-DD HH:mm") }}
      </p>
      <p v-if="isEnroll == '1'">
        报名时间：{{ enrollStartTime | dateFrm("YYYY-MM-DD HH:mm") }} ~
        {{ enrollEndTime | dateFrm("YYYY-MM-DD HH:mm") }}
      </p>
      <p v-if="scenicName !== null && scenicName !== ''">
        开展景区：{{ scenicName }}
      </p>
      <p v-if="isEnroll == '1'">上限人数：{{ enrollLimit }}</p>
    </div>
    <div class="site">
      <h4>活动简介</h4>
      <p v-html="brief"></p>
    </div>
    <div class="site">
      <h4>活动内容</h4>
      <div v-html="content" class="step">
        <!-- {{ content }} -->
        <!--        <van-steps-->
        <!--          direction="vertical"-->
        <!--          :active="0"-->
        <!--        >-->
        <!--          <van-step>-->
        <!--            <p>09:30-14:10</p>-->
        <!--            <h3>曾经在花莲海边看过满天的星空，在划过的流星下许愿的你我，期待的是明天有更好的早晨， 新的一天，新的开始，好好地爱自己。</h3>-->
        <!--          </van-step>-->
        <!--          <van-step>-->
        <!--            <p>14:30-15:10</p>-->
        <!--            <h3>感动时刻，爱情乘着爱神的弓箭射入心房，一生只求一次与你深刻爱恋，为此求了千百年，好好的感受剎那时光。</h3>-->
        <!--          </van-step>-->
        <!--          <van-step>-->
        <!--            <p>14:30-15:10</p>-->
        <!--            <h3>徜徉在海风吹拂的夏日，阳光沙滩与美好的人生，寂寞上心头时，就到海边去。</h3>-->
        <!--          </van-step>-->
        <!--          <van-step>-->
        <!--            <p>14:30-15:10</p>-->
        <!--            <div class="img">-->
        <!--              <van-image-->
        <!--                width="100%"-->
        <!--                height="210px"-->
        <!--                :src="img"-->
        <!--              />-->
        <!--            </div>-->
        <!--            <h3>徜徉在海风吹拂的夏日，阳光沙滩与美好的人生，寂寞上心头时，就到海边去。</h3>-->
        <!--          </van-step>-->
        <!--        </van-steps>-->
      </div>
    </div>
    <div class="footer" v-if="type == '1'">
      <!-----演艺活动------>
      <div v-if="type == '1'">
        <div class="btn h-color" v-if="activity_status == '已结束'">
          <van-button color="rgba(241,241,241,1)">活动已结束</van-button>
        </div>
        <div class="btn" v-if="activity_status !== '已结束'">
          <van-button color="rgba(24,131,87,1)" @click="buyTicket()"
            >购买门票</van-button
          >
        </div>
      </div>
      <!-----演艺活动------>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import Vue from "vue";
import Vant, { Lazyload } from "vant";
Vue.use(Lazyload);
Vue.use(Vant);

export default {
  data() {
    return {
      WxShow: true,
      collectionShow: false,
      img: require("../../assets/iconImage/person_bg.png"),
      id: this.$route.query.id,
      name: "", //活动名称
      images: [],
      current: 0,
      tagArr: [],
      sponsor: "", //主办方
      address: "", //活动地点
      activityStartTime: "", //活动开始时间
      activityEndTime: "", //活动结束时间
      scenicName: "", //开展景区
      brief: "", //活动简介
      content: "",
      isEnroll: "", //是否需要报名
      type: "", //活动类型
      activity_status: "", //活动状态
      userIsEnroll: "", //用户是否已报名
      tag: "", //标签
      enrollStartTime: "",
      enrollEndTime: "",
      uid: this.uid || null,
      enrollLimit: "",
      replyCount: "",
      buyTicketAddress: "",
      lastNum: 0,
      loginShow: true, // true
      shareImgUrl: "",
      WxUid: "",
      collectIconN: require("../../assets/iconImage/ic_collection_nor@3x.png"),
      collectIconT: require("../../assets/iconImage/ic_collection@3x.png"),
      session_id: this.$route.query.session_id,
    };
  },
  created() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.WxShow = true;
      document.title = "活动详情";
      var dataParams = {
        wxa_session_id: this.session_id,
      };
      this.$http
        .post(`/appserver/v1/user/get_auth_data`, qs.stringify(dataParams))
        .then((data) => {
          if (data.data.ret === 0) {
            this.WxUid = data.data.data;
            // eslint-disable-next-line
            console.log(this.WxUid, "WxUid");
          }
        });
    } else {
      this.WxShow = false;
      document.title = "活动详情";
      // window.wii.app.invoke('setTitle', '活动详情');
      window.wii.app.invoke("showNativeBar", false);
    }
    this.getDetail();
  },
  mounted() {},
  methods: {
    buyTicket() {
      //this.buyTicketAddress = "https://www.baidu.com"
      if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(this.buyTicketAddress)) {
        this.$toast("门票购买地址有误!");
        return false;
      } else {
        window.location.href = this.buyTicketAddress;
      }
    },
    onChange(index) {
      this.current = index;
    },
    getDetail() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.uid = this.$route.query.uid;
      } else {
        this.uid = this.uid;
      }
      var data = {
        id: this.id,
        userId: this.uid,
      };
      this.$http
        .post(`/appserver/v1/activity/detail`, qs.stringify(data), {
          headers: {
            wxa_session_id: this.session_id,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            this.name = data.data.data.name;
            this.images = data.data.data.galleryVos;
            this.shareImgUrl = this.images[0].imageUrl;
            this.sponsor = data.data.data.sponsor;
            this.address = data.data.data.address;
            this.activityStartTime = data.data.data.activityStartTime;
            this.activityEndTime = data.data.data.activityEndTime;
            this.brief = data.data.data.brief;
            this.content = data.data.data.content;
            this.isEnroll = data.data.data.isEnroll;
            this.type = data.data.data.type;
            if (data.data.data.collect) {
              this.collectionShow = true;
            } else {
              this.collectionShow = false;
            }
            this.activity_status = data.data.data.activity_status;
            this.userIsEnroll = data.data.data.userIsEnroll;
            this.tag = data.data.data.tag;
            this.enrollStartTime = data.data.data.enrollStartTime;
            this.enrollEndTime = data.data.data.enrollEndTime;
            this.replyCount = data.data.data.replyCount;
            this.enrollLimit = data.data.data.enrollLimit;
            if (data.data.data.tag !== "") {
              this.tagArr = data.data.data.tag.split(",");
            }
            if (data.data.data.type == "2" && data.data.data.isEnroll == "1") {
              this.lastNum =
                data.data.data.enrollLimit - data.data.data.replyCount;
            }
            if (data.data.data.type == "1") {
              this.buyTicketAddress = data.data.data.buyTicketAddress;
            }
            this.scenicName = data.data.data.scenicName;
            //this.lastNum = '1'
            //this.activity_status = '等待中';
          }
        });
    },

    // 添加收藏
    AddCollection() {
      var data = {
        imageUrl: this.images[0].imageUrl,
        intro: this.brief,
        title: this.name,
        label: this.tag,
      };
      var dataParams = {
        srcType: "activity",
        srcId: this.$route.query.id,
        data: JSON.stringify(data),
      };
      this.$http
        .post(`/appserver/v1/collect/save`, qs.stringify(dataParams))
        .then((data) => {
          if (data.data.ret === 0) {
            this.collectionShow = true;
            this.$toast("收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = false;
              this.$toast("请登录");
              window.wii.app.invoke("login", {
                callback: "",
              });
            }
          }
        });
    },

    // 取消收藏
    CancelCollection() {
      var params = {
        srcType: "activity",
        srcId: this.$route.query.id,
      };
      this.$http
        .post(`/appserver/v1/collect/cancel`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = true;
              this.$toast("请登录");
              window.wii.app.invoke("login", {
                callback: "",
              });
            }
          }
        });
    },
    // wx添加收藏
    AddCollectionWx() {
      // eslint-disable-next-line
      console.log(this.session_id, "添加收藏");
      if (
        this.session_id === "" &&
        this.session_id === undefined &&
        this.session_id === null
      ) {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/pages/index/login`,
        });
      } else {
        var data = {
          imageUrl: this.images[0].imageUrl,
          intro: this.brief,
          title: this.name,
          label: this.tag,
        };
        var dataParams = {
          srcType: "activity",
          srcId: this.$route.query.id,
          data: JSON.stringify(data),
        };
        this.$http
          .post(`/appserver/v1/collect/save`, qs.stringify(dataParams), {
            headers: {
              wxa_session_id: this.session_id,
            },
          })
          .then((data) => {
            // eslint-disable-next-line
            console.log(data);
            if (data.data.ret === 0) {
              this.collectionShow = true;
              this.$toast("收藏成功");
            } else {
              this.$toast(data.data.msg);
              // eslint-disable-next-line
              wx.miniProgram.navigateTo({
                url: `/pages/index/login`,
              });
            }
          });
      }
    },

    // wx取消收藏
    CancelCollectionWx() {
      if (
        this.session_id === "" &&
        this.session_id === undefined &&
        this.session_id === null
      ) {
        // eslint-disable-next-line
        wx.miniProgram.navigateTo({
          url: `/pages/index/login`,
        });
      } else {
        var params = {
          srcType: "activity",
          srcId: this.$route.query.id,
        };
        this.$http
          .post(`/appserver/v1/collect/cancel`, qs.stringify(params), {
            headers: {
              wxa_session_id: this.session_id,
            },
          })
          .then((data) => {
            if (data.data.ret === 0) {
              this.collectionShow = false;
              this.$toast("取消收藏成功");
            } else {
              this.$toast(data.data.msg);
              // eslint-disable-next-line
              wx.miniProgram.navigateTo({
                url: `/pages/index/login`,
              });
            }
          });
      }
      // var dataParams = {
      // 	wxa_session_id: this.session_id
      // };
      // this.$http
      // 	.post(`/appserver/v1/user/get_auth_data`, qs.stringify(dataParams))
      // 	.then(data => {
      // 		// eslint-disable-next-line
      // 		console.log(data);
      // 		if (data.data.ret === 0) {
      // 			var params = {
      // 				srcType: 'activity',
      // 				srcId: this.$route.query.id
      // 			};
      // 			this.$http
      // 				.post(`/appserver/v1/collect/cancel`, qs.stringify(params), {
      // 					headers: {
      // 						wxa_session_id: this.session_id
      // 					}
      // 				})
      // 				.then(data => {
      // 					if (data.data.ret === 0) {
      // 						this.collectionShow = false;
      // 					} else {
      // 						this.$toast(data.data.msg);
      // 					}
      // 				});
      // 		} else {
      // 			// eslint-disable-next-line
      // 			wx.miniProgram.navigateTo({
      // 				url: `/pages/index/login`
      // 			});
      // 		}
      // 	});
    },
  },
};
</script>
<style lang="scss">
.site p img {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.activity-details {
  .header-img {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 36px;
    .title {
      /*margin: 0 10px;*/
      /*z-index: 500;*/
      /*top: 10px;*/
      position: absolute;
      width: 100%;
      margin: 0 auto;
      /deep/ .van-nav-bar .van-icon {
        color: #fff;
        font-weight: 700;
        font-size: 22px;
      }
      /deep/ .van-nav-bar {
        background: rgba(255, 255, 255, 0);
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
    /deep/ .van-image {
      width: 100%;
      height: 100%;
      top: -46px;
    }
    /deep/ .van-swipe__indicator {
      width: 10px;
      height: 4px;
      border-radius: 0px;
      background: #dfdfdf;
    }
    /deep/ .van-swipe__indicator--active {
      background: #37384d;
    }
    /deep/ .van-swipe__indicators {
      bottom: 30px;
      z-index: 1200;
    }
    .collect-shadow {
      position: absolute;
      right: 30px;
      bottom: -20px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
    }
    .collect {
      position: absolute;
      right: 30px;
      bottom: -20px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-image {
        position: static;
      }
    }
  }
  .site {
    padding: 0px 20px;
    margin-bottom: 19px;
    color: #555959;
    font-size: 15px;
    & > h3 {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 26px;
      margin-bottom: 20px;
    }
    & > h4 {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFangSC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 26px;
      margin-bottom: 15px;
    }
    .step {
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(55, 56, 77, 1);
      line-height: 22px;
    }
    & > p {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 100%;
      color: #555959;
      line-height: 25px;
      font-size: 15px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(85, 89, 89, 1);
      & > span {
        margin-bottom: 10px;
        padding: 7px 10px;
        display: inline-block;
        background: #f6f6f6;
        border-radius: 2px;
        margin-right: 8px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: #555959;
        line-height: 11px;
        margin-right: 12px;
      }
    }
    & > div {
      width: 100%;
      // height: 120px;
      margin-top: 19px;
      /deep/ .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .step {
      p {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        line-height: 16px;
      }
      h3 {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: #37384d;
        line-height: 22px;
        margin-top: 7px;
      }
      .img {
        margin: 10px 0 20px 0;
        width: 297px;
        // height: 160px;
      }
    }
  }
  .time {
    margin: 0 20px;
    padding-top: 29px;
    margin-bottom: 35px;
    color: #37384d;
    font-size: 16px;
    line-height: 30px;
    border-top: 2px solid #f6f6f6;
    p {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
      line-height: 16px;
      margin-bottom: 16px;
    }
  }
  .footer {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    bottom: 0px;
    padding: 20px;
    .btn {
      /deep/ .van-button:active::before {
        opacity: 0;
      }
      /deep/ .van-button {
        width: 100%;
        height: 40px;
        border: 0px;
        opacity: 0.95;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }

      .haslimit {
        .numlimit {
          font-size: 14px;
          color: red;
        }
        /deep/.van-button__text {
          color: #333333b3;
        }
      }
    }
    .h-color {
      /deep/ .van-button span {
        color: #999;
      }
    }
    .l-color {
      /deep/ .van-button span {
        color: #248960;
      }
    }
  }

  .img-banner {
    img {
      width: 100%;
      height: 210px;
    }
  }
}
</style>
