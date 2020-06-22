<template>
  <div class="nearby-details">
    <loading v-if="loading"></loading>
    <div>
      <openAppDialog
        :isShow="isShareWeb"
        ref="openApp"
        :title="openTitle"
        :shareId="shareId"
        :shareType="shareType"
        @openApp="openApp()"
      ></openAppDialog>
    </div>
    <div v-if="!loading">
      <div class="fixed-title" id="title" v-if="String(isShareWeb) !== 'true'">
        <van-nav-bar left-arrow @click-left="Back()" @click-right="Share()">
          <van-icon name="ellipsis" slot="right" />
        </van-nav-bar>
      </div>
      <div class="header-img">
        <div class="title" v-if="String(isShareWeb) !== 'true'">
          <van-nav-bar>
            <van-icon name="arrow-left" slot="left" @click="Back()" />
            <van-icon name="ellipsis" slot="right" @click="Share()" />
          </van-nav-bar>
        </div>
        <van-swipe
          :style="{
            width: '100%',
            height: '210px',
            top: `${vanSwipeTop}px`,
          }"
        >
          <van-swipe-item v-for="(item, index) in bannerImg" :key="index">
            <van-image :src="item" width="100%" height="210px"></van-image>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div class="wrap">
        <div class="content-box">
          <h2>
            {{ name }}
          </h2>
          <h5 v-if="scenicName && scenicName.length > 0">{{ scenicName }}</h5>
          <div class="label">
            <p v-for="(item, index) in tags" :key="index">{{ item }}</p>
          </div>
          <div class="price">
            <p class="price-unit">￥</p>
            <p class="price-num">{{ price }}</p>
            <p class="price-num-text" v-if="subTitle === '酒店介绍'">起</p>
            <p class="price-num-text" v-if="subTitle === '餐厅介绍'">/人</p>
          </div>
          <div class="position-title" @click="addressClick()">
            <div>
              <van-image :src="positionIcon"></van-image>
              <span>{{ address }}</span>
            </div>
            <van-icon name="arrow" slot="right" size="2rem" color="#999" />
          </div>
          <div class="position-title" @click="phoneClick(phone)">
            <div>
              <van-image :src="phoneIcon"></van-image>
              <span>{{ phone }}</span>
            </div>
            <van-icon name="arrow" slot="right" size="2rem" color="#999" />
          </div>
          <div class="position-title">
            <div>
              <van-image :src="aliveIcon"></van-image>
              <span>{{ alive }}</span>
            </div>
            <van-icon v-show="false" name="arrow" slot="right" />
          </div>
          <div v-if="recommendedDishesList && recommendedDishesList.length > 0">
            <div class="recommendation-title">
              <div>
                推荐菜
              </div>
              <van-icon name="arrow" slot="right" size="2rem" color="#222" />
            </div>
            <div class="recommendation-list">
              <div
                class="list-item"
                v-for="(item, index) in recommendedDishesList"
                :key="index"
              >
                <div class="images">
                  <van-image :src="item.img"></van-image>
                </div>
                <div>
                  <p>{{ item.name }}</p>
                  <h>￥{{ item.price }}</h>
                </div>
              </div>
            </div>
          </div>
          <h4>{{ subTitle }}</h4>
          <expandTextView :content="introduce"></expandTextView>
        </div>
        <div class="comment-box">
          <van-cell
            title="用户评价"
            is-link
            :value="CommentNum != 0 ? CommentNum + '条' : ''"
            @click="AllDiscussList()"
          />
          <div class="comment-list" v-if="CommentNum !== 0">
            <customListView
              :arraydata="commentList"
              :isCanUp="true"
              @itemClick="Details"
              @bigPictureLook="BigPictureLook"
              @itemDianZan="itemDianZan"
            >
            </customListView>
          </div>
          <div class="list-no" v-if="CommentNum === 0">
            <p>暂无评论，赶紧来抢沙发吧</p>
          </div>
          <div class="btn">
            <van-button color="#19835C" @click="Write()">
              <van-image :src="jiaIcon" width="14px" height="14px"></van-image>
              写点评
            </van-button>
          </div>
        </div>
      </div>

      <div>
        <writeComment
          ref="writeComment"
          @Fb="Fb(arguments)"
          id="modalId"
        ></writeComment>
      </div>
      <!-- 图片放大 -->
      <div>
        <displayimage ref="displayimage"></displayimage>
      </div>
    </div>
    <!-- 评论删除 -->
    <div>
      <DeleteDialog
        ref="deletedialog"
        @deleteBtn="CommentDeleteBtn()"
      ></DeleteDialog>
    </div>
    <div>
      <empty
        ref="emptyView"
        :toastTitle="toastTitle"
        :emptyShow="emptyShow"
      ></empty>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Loading from "@/components/loading";
import qs from "qs";
import DeleteDialog from "@/components/deleteDialog.vue";
import writeComment from "@/components/writeComment.vue";
import displayimage from "@/components/displayImage.vue";
import openAppDialog from "@/components/openAppTopDialog.vue";
import empty from "@/components/empty.vue";
import { Dialog } from "vant";
import customListView from "@/components/customListViewComment.vue";
import expandTextView from "@/components/expandTextView.vue";
export default {
  data() {
    return {
      loading: true,
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      message: "",
      bannerImg: [],
      name: "", // 标题
      address: "", //地址
      tags: [], // 标签
      price: "",
      scenicName: "",
      phone: "", //电话
      alive: "", //营业时间
      subTitle: "", // 副标题

      commentList: [],
      CommentNum: 0, // 评论条数
      headImg: require("../../assets/iconImage/my_moren@3x.png"),
      publishShow: true,
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),

      // 删除
      comment_id: "",
      isTouchCollect: false,
      positionIcon: require("../../assets/iconImage/ic_location.png"),
      phoneIcon: require("../../assets/iconImage/ic_phone.png"),
      aliveIcon: require("../../assets/iconImage/ic_time_list@2x.png"),
      recommendedDishesList: [], //推荐菜图
      lat: "30.56979",
      lng: "104.05453",
      introduce: "",
      //餐饮：5e5defad34f783727173e3d4  repast
      //酒店：5e57fbe05431c761c04ef035  hotel
      openTitle: "打开天府绿道APP<br/>周边好店尽收眼底",
      isShareWeb: this.$route.query.isShareWeb,
      shareId: this.$route.query.id,
      shareType: this.$route.query.type,
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      vanSwipeTop: -46,
    };
  },
  components: {
    Loading,
    DeleteDialog,
    writeComment,
    displayimage,
    openAppDialog,
    empty,
    [Dialog.Component.name]: Dialog.Component,
    customListView,
    expandTextView,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    if (String(this.isShareWeb) == "true") {
      this.vanSwipeTop = 0;
    } else {
      this.vanSwipeTop = -46;
    }
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
    window.addEventListener("scroll", this.scrollToTop);
    if (String(this.isShareWeb) == "true") {
      this.lat = this.$route.query.latitude;
      this.lng = this.$route.query.longitude;
      this.getData();
      //eslint-disable-next-line
      console.log("1111");
    } else {
      //eslint-disable-next-line
      console.log("2222");
      this.lat = this.$route.query.latitude;
      this.lng = this.$route.query.longitude;
      this.getData();
      this.commonLatLong((LatLng) => {
        this.lat = LatLng.latitude;
        this.lng = LatLng.longitude;
        this.getData();
      });
    }
  },
  methods: {
    // 关闭详情
    Back() {
      window.wii.app.invoke("closeWindow");
    },
    scrollToTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let title = document.getElementById("title");
      if (scrollTop != 0) {
        this.commonfadeIn(title, 0);
      } else {
        this.commonfadeOut(title, 50);
      }
    },
    // 分享
    Share() {},
    getData() {
      this.$http
        .get(`/appserver/v1//periphery/detailed?id=${this.$route.query.id}`, {
          headers: {
            latitude: this.lat, //纬度
            longitude: this.lng, //经度
          },
        })
        .then((data) => {
          let _data = data.data.data;
          if (_data.online_status !== 1) {
            this.loading = false;
            this.toastTitle = "糟糕,数据找不到了";
            this.emptyShow = true;
            return;
          }
          this.address = _data.address;
          this.scenicName = _data.scenicName;
          this.name = _data.name;
          this.tags = _data.labels;
          this.bannerImg = _data.img;
          this.price = _data.price;
          this.phone = _data.phone;
          this.alive = _data.ci_co_time;
          this.introduce = _data.desc;
          this.recommendedDishesList = _data.recommendedDishesList;
          this.commentList = _data.list; // 评论列表
          this.CommentNum = _data.comment_num;
          if (this.$route.query.type === "repast") {
            this.subTitle = "餐厅介绍";
          } else if (this.$route.query.type === "hotel") {
            this.subTitle = "酒店介绍";
          } else {
            this.subTitle = "";
          }
          this.loading = false;
        })
        .catch((error) => {
          this.toastTitle = "网络异常,检查网络再试试~~";
          this.emptyShow = true;
        });
    },
    CommentDeleteBtn() {
      event.stopPropagation();
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      let data = {
        comment_id: this.comment_id,
        number: 2,
      };
      this.$http
        .post(`/appserver/v1/comment/deleteOrUp`, qs.stringify(data), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            this.$toast("删除成功");
            this.$refs.deletedialog.isDeleteShow = false;
            this.getData();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 评论删除
    CommentDelete(id) {
      event.stopPropagation();
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.uid) {
        this.$refs.deletedialog.isDeleteShow = true;
        this.comment_id = id;
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 图片点击放大
    BigPictureLook(item, index) {
      this.$refs.displayimage.showBigPictureLook(item.image, index);
    },

    // 写评论
    Write() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        let windheight = document.documentElement.clientHeight; //为唤起软键盘时当前窗口高度
        document.getElementById("modalId").style.position = "relative";
        window.onresize = function() {
          var docheight = document.documentElement.clientHeight; //唤起软键盘时窗口高度
          document.getElementById("write").style.bottom =
            docheight - windheight + "px";
        };
      }
      if (this.uid) {
        this.$refs.writeComment.showWriteDialog();
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 发表
    Fb(msg) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      var message = msg[0];
      var gallerysStr = msg[1];
      let params = {
        content: message,
        cid: this.$route.query.id,
        ctitle: this.title,
        type: "travel_notes",
        source_type: "app",
        image: gallerysStr,
      };

      this.$http
        .post(`/appserver/v1/comment/addComment`, qs.stringify(params), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          this.$refs.writeComment.ClosePost();
          if (data.data.ret == 0) {
            this.$toast("发布成功");
            this.commentList.unshift(data.data.data);
            this.CommentNum = this.CommentNum + 1;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 用户评论列表
    AllDiscussList() {
      //其他事件
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
    },
    // 评论详情
    Details(item) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/discussDetails",
        query: {
          comment_id: item.comment_id,
          type: "",
          from: "web",
        },
      });
    },
    openApp() {
      //打开APP,跳转到APP
      //eslint-disable-next-line
      console.log("openApp()");
    },
    addressClick() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
    },
    phoneClick(phone) {
      Dialog.alert({
        message: "确定拨打电话:" + phone,
        closeOnPopstate: true,
        closeOnClickOverlay: true,
        confirmButtonColor: "#178357",
        confirmButtonText: "确定",
      }).then(() => {
        window.location.href = "tel://" + phone;
      });
    },
    //评论列表item点赞
    itemDianZan(item, comment_id) {
      let data = {
        comment_id: comment_id,
        number: "1",
      };
      this.$http
        .post(`/appserver/v1/comment/deleteOrUp`, qs.stringify(data), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            item.up++;
            item.is_up = !item.is_up;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
  },
};
</script>
<style>
.icon-color {
  color: #fff;
}
</style>
<style lang="scss" scoped>
.nearby-details {
  width: 100%;
  height: 100%;
  .fixed-title {
    opacity: 0;
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
  .header-img {
    width: 100%;
    height: 210px;
    position: relative;
    .title {
      position: relative;
      z-index: 500;
      top: 10px;
      /deep/ .van-nav-bar .van-icon {
        color: #fff;
        font-weight: 500;
        font-size: 24px;
      }
      /deep/ .van-nav-bar {
        background: rgba(255, 255, 255, 0);
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
    // /deep/ .van-swipe {
    //   width: 100%;
    //   height: 210px;
    //   top: -46px;
    // }
    /deep/ .van-swipe__indicators {
      z-index: 1200;
      bottom: 30px;
    }
    /deep/ .van-swipe__indicator {
      background: #dfdfdf;
      border-radius: 0px;
      width: 24px;
      height: 3px;
      border-radius: 2px;
    }
    /deep/ .van-swipe__indicator--active {
      background: #37384d;
      width: 9px;
      height: 3px;
    }
  }
  .wrap {
    margin-top: 10px;
    .content-box {
      padding: 0 20px;
      border-bottom: 5px solid #f8f8f8;
      & > h2 {
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        line-height: 26px;
      }
      & > h5 {
        margin-top: 10px;
        font-size: 12px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: normal;
        color: rgba(153, 153, 153, 1);
        line-height: 14px;
      }
      .label {
        display: flex;
        padding: 5px 0px;
        p {
          font-size: 11px;
          color: #46475b;
          padding: 4px 7px;
          margin-right: 6px;
          background: rgba(70, 71, 91, 0.05);
          border-radius: 2px;
        }
      }
      .price {
        display: flex;
        padding: 10px 0px;
        .price-unit {
          font-size: 8px;
          margin-top: 5px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: red;
          margin-right: 3px;
        }
        .price-num {
          margin-top: -5px;
          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: red;
          margin-right: 3px;
        }
        .price-num-text {
          font-size: 13px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(153, 153, 153, 1);
          margin-right: 3px;
        }
      }
      .aLine {
        background-color: #e6e3e3;
        height: 1px;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 15px;
      }
      .position-title {
        margin: 0px 0px;
        padding: 14px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // border-bottom: 1px solid #e8e8e8;
        /deep/ .van-image {
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #444444;
        }
      }
      .recommendation-title {
        margin: 0px 0px;
        padding: 14px 0px 10px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 22px;
          color: #222;
          font-weight: 600;
        }
      }

      .recommendation-list {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-left: 1vw;
        .list-item {
          width: 42vw;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-right: 1vw;
          margin-top: 1vw;
          .images {
            width: 100%;
            position: relative;
            /deep/ .van-image {
              width: 100%;
              height: 100%;
            }
            /deep/ .van-image__img {
              border-radius: 3px;
            }
          }
          & > div {
            p {
              margin-top: 10px;
              font-size: 20px;
              color: #222;
            }
            &:nth-of-type(2) {
              color: red;
              font-size: 20px;
            }
          }
        }
      }
      >>> img {
        width: 100%;
        border-radius: 5px;
      }
      & > h6 {
        margin-top: 29px;
        font-size: 16px;
        font-weight: 600;
        color: #222;
      }
      .introduce {
        margin-top: 20px;
        font-size: 16px;
        color: #222;
        line-height: 26px;
      }
      & > h4 {
        margin-top: 25px;
        font-size: 22px;
        color: #222;
        font-weight: 600;
      }
    }
    .comment-box {
      padding: 20px;
      /deep/ .van-cell {
        margin: 25px 0px;
        padding: 0px;
      }
      /deep/ .van-cell__title span {
        font-size: 20px;
        font-family: PingFangTC-Medium, PingFangTC;
        font-weight: 500;
        color: rgba(55, 56, 77, 1);
      }
      /deep/ .van-cell__value {
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      /deep/ .van-cell:not(:last-child)::after {
        border: 0px;
      }
      /deep/ .van-icon {
        color: #37384d;
        font-size: 16px;
      }
      .comment-list {
        padding: 0px;
      }
      .list-no {
        text-align: center;
        padding: 30px 0px 0px 0px;
        & > p {
          height: 14px;
          font-size: 15px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
          line-height: 14px;
        }
      }
      .btn {
        margin-top: 29px;
        width: 100%;
        opacity: 0.95;
        margin-bottom: 24px;
        /deep/ .van-image {
          margin-right: 4px;
          margin-top: -3px;
        }
        /deep/ .van-button {
          width: 100%;
          border: 0px;
          height: 40px;
        }
        /deep/ .van-button span {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          /deep/ .van-icon {
            color: #fff;
            margin-right: 7px;
          }
        }
        /deep/ .van-icon {
          color: #fff;
          margin-right: 7px;
        }
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .nearby-details
    .wrap
    .comment-box
    .comment-list
    .list-item
    .right
    > div
    .images
    .van-image {
    height: 90px !important;
  }
}
@media screen and (max-width: 350px) {
  .nearby-details
    .wrap
    .comment-box
    .comment-list
    .list-item
    .right
    > div
    .images
    .van-image {
    height: 88px !important;
  }
}
@media screen and (max-width: 340px) {
  .nearby-details
    .wrap
    .comment-box
    .comment-list
    .list-item
    .right
    > div
    .images
    .van-image {
    height: 86px !important;
  }
}
@media screen and (max-width: 330px) {
  .nearby-details
    .wrap
    .comment-box
    .comment-list
    .list-item
    .right
    > div
    .images
    .van-image {
    height: 80px !important;
  }
}
</style>
