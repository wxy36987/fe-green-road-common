<template>
  <div class="strategy-details">
    <div>
      <div class="fixed-title" id="title" ref="headbarstrategy">
        <van-nav-bar
          left-arrow
          @click-left="Back()"
          @click-right="Share()"
          :title="title"
        >
          <van-icon name="ellipsis" slot="right" />
        </van-nav-bar>
      </div>
      <div class="header-img">
        <div class="title">
          <van-nav-bar>
            <van-icon name="arrow-left" slot="left" @click="Back()" />
            <van-icon name="ellipsis" slot="right" @click="Share()" />
          </van-nav-bar>
        </div>
        <van-image :src="bannerImg" width="100%" height="210px"></van-image>
        <div class="collect-shadow"></div>
        <div class="collect">
          <van-image
            :src="collectIconN"
            width="30px"
            height="30px"
            v-if="!collectionShow"
            @click="AddCollection()"
          ></van-image>
          <van-image
            :src="collectIconT"
            width="30px"
            height="30px"
            v-if="collectionShow"
            @click="CancelCollection()"
          ></van-image>
        </div>
      </div>
      <div class="wrap">
        <div class="content-box">
          <h2>{{ title }}</h2>
          <div class="label">
            <p v-for="(item, index) in tags" :key="index">{{ item }}</p>
          </div>
          <h4>{{ subTitle }}</h4>
          <div class="subtitle">
            <div v-html="subContent" class="v-html" id="strategyContent"></div>
          </div>
        </div>
        <div class="recomTitleStyle" v-if="list.length > 0">
          <p>猜你喜欢</p>
          <customListView :arraydata="list" @itemClick="StrategyDetails" />
        </div>

        <div class="comment-box">
          <van-cell
            title="用户评价"
            is-link
            :value="CommentNum != 0 ? CommentNum + '条' : ''"
            @click="AllDiscussList()"
          />
          <div class="comment-list" v-if="CommentNum !== 0">
            <customListViewComment
              :arraydata="commentList"
              :isCanUp="true"
              @itemClick="Details"
              @bigPictureLook="BigPictureLook"
              @itemDianZan="itemDianZan"
            >
            </customListViewComment>
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
    <empty
      ref="emptyView"
      :emptyShow="emptyShow"
      :style="{ top: emptyTop }"
    ></empty>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import DeleteDialog from "@/components/deleteDialog.vue";
import writeComment from "@/components/writeComment.vue";
import displayimage from "@/components/displayImage.vue";
import customListView from "@/components/customListView.vue";
import customListViewComment from "@/components/customListViewComment.vue";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      loading: false,
      show: true,
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      message: "",
      strategyId: this.$route.query.id,
      bannerImg: "",
      title: "", // 标题
      tags: [], // 标签
      subTitle: "", // 副标题
      subContent: "",
      timer: "",
      // 收藏心
      collect: null,
      collectionShow: false,
      contentImg: require("../../assets/iconImage/ic_20_park.png"),
      commentList: [],
      CommentNum: 0, // 评论条数
      headImg: require("../../assets/iconImage/my_moren@3x.png"),
      publishShow: true,
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),
      // 收藏心
      collectIconN: require("../../assets/iconImage/ic_collection_nor@3x.png"),
      collectIconT: require("../../assets/iconImage/ic_collection@3x.png"),
      // 图片
      imageUrl: "",
      // 删除
      comment_id: "",
      isTouchCollect: false,
      shareInfo: {},
      list: [],
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  components: {
    DeleteDialog,
    writeComment,
    displayimage,
    customListView,
    customListViewComment,
    empty,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    this.upUserBehavior();
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
    window.addEventListener("scroll", this.scrollToTop);
    this.getData();

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
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
    Share() {
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.shareInfo.title,
          summary: this.shareInfo.content,
          pic: this.shareInfo.pic,
          link: this.shareInfo.url,
          isMiniProgram: this.shareInfo.isMiniProgram,
          miniProgramId: this.shareInfo.miniProgramId,
          miniProgramPath: this.shareInfo.miniProgramPath,
        },
        collect: {
          isShow: false,
          isCollect: true,
          type: "",
          articleId: "",
        },
      });
    },
    getData() {
      if (this.isIOSDev()) {
        this.showLoading(this.loading);
      }
      //
      //eslint-disable-next-line
      // console.log("StrategyDetails getData():" + this.strategyId);
      this.$http
        .post(`/appserver/v1/strategy/ld_detail?strategyId=${this.strategyId}`)
        .then((data) => {
          let _data = data.data.data;
          this.strategyId = _data.id;
          this.bannerImg = _data.img;
          this.title = _data.title;
          this.tags = _data.tags;
          this.subTitle = _data.subTitle; // 副标题
          this.subContent = _data.htmlContent;
          // this.subContent = this.subContent.replace("<img","<img style='height:auto'")
          this.collect = _data.collect;
          if (this.collect === 0) {
            this.collectionShow = false;
          } else {
            this.collectionShow = true;
          }
          this.shareInfo = _data.shareInfo;
          this.list = _data.recomBusinessInfoList;
          this.CommentList();
        })
        .catch((error) => {
          if (this.isIOSDev()) {
            this.loading = false;
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
          this.emptyTop = this.$refs.headbarstrategy.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    CommentList() {
      this.$http
        .post(
          `/appserver/v1/comment/list?cid=${this.strategyId}&type=travel_notes`
        )
        .then((data) => {
          if (data.data.ret === 0) {
            let _datas = data.data.data;
            this.commentList = _datas.list; // 评论列表
            this.CommentNum = _datas.comment_num;
          } else {
            this.$toast(data.data.msg);
          }
          if (this.isIOSDev()) {
            this.loading = false;
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
        })
        .catch((error) => {
          if (this.isIOSDev()) {
            this.loading = false;
            this.showLoading(this.loading);
          } else {
            this.showLoadingInAppVue(false);
          }
          this.emptyTop = this.$refs.headbarstrategy.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 添加
    AddCollection() {
      if (this.uid == null) {
        window.wii.app.invoke("login", {
          callback: "",
        });
        return;
      }
      if (this.isTouchCollect == true) {
        return;
      }
      this.data = {
        imageUrl: this.bannerImg,
        intro: this.subContent,
        title: this.title,
        label: this.tags,
      };
      let parms = {
        srcType: "strategy",
        srcId: this.strategyId,
        data: JSON.stringify(this.data),
      };
      this.isTouchCollect = true;
      this.$http
        .post(`/appserver/v1/collect/save`, qs.stringify(parms))
        .then((data) => {
          this.isTouchCollect = false;
          if (data.data.ret === 0) {
            this.collectionShow = true;
            this.$toast("收藏成功");
          } else {
            this.collectionShow = false;
            if (data.data.msg === "未登录") {
              this.$toast("请登录");
              setTimeout(() => {
                window.wii.app.invoke("login", {
                  callback: "",
                });
              }, 2000);
            } else {
              // this.$toast(data.data.msg);
            }
          }
        });
    },
    // 取消收藏
    CancelCollection() {
      if (this.isTouchCollect == true) {
        return;
      }
      this.isTouchCollect = true;
      this.$http
        .post(
          `/appserver/v1/collect/cancel?srcType=strategy&srcId=${this.strategyId}`
        )
        .then((data) => {
          this.isTouchCollect = false;
          if (data.data.ret === 0) {
            this.collectionShow = false;
            this.$toast("取消收藏成功");
          } else {
            if (data.data.msg === "未登录") {
              this.collectionShow = true;
              this.$toast("请登录");
              setTimeout(() => {
                window.wii.app.invoke("login", {
                  callback: "",
                });
              }, 2000);
            } else {
              //  this.$toast(data.data.msg);
            }
          }
        });
    },
    CommentDeleteBtn() {
      event.stopPropagation();
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
            for (var i in this.commentList) {
              if (this.commentList[i].comment_id == this.comment_id) {
                this.commentList.splice(i, 1);
                return;
              }
            }
            this.CommentNum = this.CommentNum - 1;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 评论删除
    CommentDelete(id) {
      event.stopPropagation();
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
      var message = msg[0];
      var gallerysStr = msg[1];
      let params = {
        content: message,
        cid: this.strategyId,
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
            // window.wii.app.invoke("login", {
            //   callback: ""
            // });
          }
        });
    },
    // 用户评论列表
    AllDiscussList() {
      // var u = navigator.userAgent;
      // // eslint-disable-next-line
      // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // if (isIOS) {
      //   window.wii.app.invoke("openWindow", {
      //     openUrl: `${this.domain}allDiscussList?cid=${
      //       this.strategyId
      //     }&page_size=${this.CommentNum}&type=travel_notes`,
      //     isFullScreen: 1,
      //     needLoading: 1,
      //   });
      // } else {
      //}
      this.$router.push({
        path: "/allDiscussList",
        query: {
          cid: this.strategyId,
          page_size: this.CommentNum,
          type: "travel_notes",
        },
      });
    },
    // 评论详情
    Details(item) {
      // var u = navigator.userAgent;
      // // eslint-disable-next-line
      // var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // if (isIOS) {
      //   window.wii.app.invoke("openWindow", {
      //     openUrl: `${this.domain}discussDetails?comment_id=${
      //       item.comment_id
      //     }&type=travel_notes&from=web`,
      //     isFullScreen: 1,
      //     needLoading: 1,
      //   });
      // } else {
      //}
      this.$router.push({
        path: "/discussDetails",
        query: {
          comment_id: item.comment_id,
          type: "travel_notes",
          from: "web",
        },
      });
    },
    // 攻略详情
    StrategyDetails(item) {
      if (this.strategyId === item.id) {
        return;
      }
      this.$router.push({
        path: "/strategyDetails",
        query: {
          id: item.id,
        },
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
    upUserBehavior() {
      this.commonLatLong((LatLng) => {
        var action = {};
        action.item_type = "4";
        action.item_id = this.strategyId;
        action.action_type = "102";
        action.longitude = LatLng.longitude;
        action.latitude = LatLng.latitude;
        action.uid = this.uid ? this.uid : "";
        this.commonUserBehavior(action);
      });
    },
  },
  watch: {
    //eslint-disable-next-line
    $route: function(to, from) {
      this.strategyId = to.query.id;
      this.loading = true;
      this.upUserBehavior();
      this.getData();
    },
  },
};
</script>
<style lang="scss">
#strategyContent {
  p {
    font-size: 15px;
    line-height: 28px;
    font-family: "PingFangSC-Light, PingFangSC";
  }
  strong {
    font-weight: bold;
  }
  h1 {
    font-size: 32px;
    font-weight: bold;
    line-height: 1.5em;
  }
  h2 {
    font-size: 27px;
    font-weight: bold;
    line-height: 1.5em;
  }
  h3 {
    font-size: 19px;
    font-weight: bold;
    line-height: 1.5em;
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5em;
  }
  h5 {
    font-size: 13px;
    font-weight: bold;
    line-height: 1.5em;
  }
  h6 {
    font-size: 12px;
    font-weight: bold;
    line-height: 1.5em;
  }
  img {
    width: 100% !important;
    height: auto;
    margin-top: 10px;
    border-radius: 2px;
  }
}
.icon-color {
  color: #fff;
}
</style>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.strategy-details {
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
    color: #000;
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
      // top: 10px;
      /deep/ .van-nav-bar .van-icon {
        color: #fff;
        font-weight: 500;
        font-size: 24px;
      }
      /deep/ .van-nav-bar {
        background: linear-gradient(
          rgba(0, 0, 0, 0.25),
          rgba(0, 0, 0, 0.18),
          rgba(0, 0, 0, 0)
        );
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
    /deep/ .van-image {
      width: 100%;
      height: 210px;
      top: -46px;
    }
    .collect-shadow {
      position: absolute;
      right: 30px;
      bottom: -30px;
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
      bottom: -30px;
      z-index: 200;
      background: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/ .van-image {
        top: 0;
      }
    }
  }
  .wrap {
    width: 100%;
    margin-top: 38px;
    .content-box {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom: 5px solid #f8f8f8;
      & > h2 {
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        line-height: 40px;
      }
      .label {
        display: flex;
        padding: 19px 0px;
        border-bottom: 1px solid #eee;
        p {
          font-size: 11px;
          color: #46475b;
          padding: 4px 7px;
          margin-right: 6px;
          background: rgba(70, 71, 91, 0.05);
          border-radius: 2px;
        }
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
      .subtitle {
        color: #222;
        font-size: 16px;
        margin-bottom: 20px;
        /deep/ img {
          width: 100%;
        }
        >>> img {
          width: 100%;
        }
        /deep/ .van-image {
          width: 100%;
          height: 188px;
        }
        & > span {
          margin-top: 10px;
          color: #999999;
          font-size: 12px;
        }
      }
    }
    .recomTitleStyle {
      margin-left: 20px;
      & > p {
        margin-bottom: 10px;
        font-family: PingFangTC-Medium, PingFangTC;
        font-size: 20px;
        font-weight: 500;
        color: rgba(55, 56, 77, 1);
        margin-top: 10px;
      }
    }
    .comment-box {
      border-top: 5px solid #f8f8f8;
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
  .strategy-details
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
  .strategy-details
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
  .strategy-details
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
  .strategy-details
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
