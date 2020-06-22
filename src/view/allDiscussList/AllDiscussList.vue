<template>
  <div class="all-discuss-list">
    <!-- <loading v-if="loading"></loading> -->
    <div class="content" v-if="!loading">
      <div class="header" ref="headbaralldiscusslist">
        <van-nav-bar title="全部评论" left-arrow @click-left="onClickLeft">
        </van-nav-bar>
      </div>
      <div class="comment-box">
        <div class="comment-list" v-if="CommentNum !== 0">
          <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getCommentList"
            :offset="200"
          >
            <customListView
              :arraydata="commentList"
              :isCanUp="true"
              @itemClick="Details"
              @bigPictureLook="BigPictureLook"
              @itemDianZan="itemDianZan"
            >
            </customListView>
          </van-list>
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
    <!-- 写评论 -->
    <div>
      <writeComment
        ref="writeComment"
        @Fb="Fb(arguments)"
        id="modalId"
      ></writeComment>
    </div>
    <div>
      <DeleteDialog
        ref="deletedialog"
        @deleteBtn="CommentDeleteBtn()"
      ></DeleteDialog>
    </div>
    <!-- 评论图片放大 -->
    <div>
      <displayimage ref="displayimage"></displayimage>
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
// import Loading from "@/components/loading";
import qs from "qs";
import writeComment from "@/components/writeComment.vue";
import displayimage from "@/components/displayImage.vue";
import DeleteDialog from "@/components/deleteDialog.vue";
import customListView from "@/components/customListViewComment.vue";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      loading: true,
      publishShow: true,
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),
      //评论列表
      commentList: [],
      // 删除
      comment_id: "",
      galleryVosList: [],
      CommentNum: "", // 评论条数

      listLoading: false,
      finished: false,
      page: "", // 当前页数
      page_size: "10", // 页面条数
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  components: {
    // Loading,
    DeleteDialog,
    writeComment,
    displayimage,
    customListView,
    empty,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    this.showLoading(this.loading);
    this.getCommentList();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getCommentList() {
      this.listLoading = true;
      if (this.commentList.length > 0) {
        var item = this.commentList[this.commentList.length - 1];
        this.page = item.comment_id;
      }
      var data = {
        cid: this.$route.query.cid,
        comment_id: this.page,
        page_size: this.page_size,
      };
      this.$http
        .post("/appserver/v1/comment/tyrantlist", qs.stringify(data))
        .then((data) => {
          this.loading = false;
          this.showLoading(this.loading);
          if (data.data.ret == 0) {
            var listdata = data.data.data.list ? data.data.data.list : [];
            if (listdata) {
              if (listdata.length > 0) {
                // 问题回答列表
                this.commentList = this.commentList.concat(listdata);
              }
            }
            if (this.commentList.length >= data.data.data.comment_num) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.listLoading = false;
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbaralldiscusslist.offsetHeight + "px";
          this.emptyShow = true;
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
            this.$refs.deletedialog.isDeleteShow = false;
            var index = 0;
            for (let key in this.commentList) {
              if (this.commentList[key].comment_id === this.comment_id) {
                index = key;
                break;
              }
            }
            this.commentList.splice(index, 1);
            this.$toast("删除成功");
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
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
        cid: this.$route.query.cid,
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
            window.wii.app.invoke("login", {
              callback: "",
            });
          }
        });
    },
    // 评论详情
    Details(item) {
      // window.wii.app.invoke("openWindow", {
      //   openUrl: `${this.domain}discussDetails?comment_id=${item.comment_id}`,
      //   isFullScreen: 0,
      //   setTitle: "评论详情",
      //   needLoading: 1
      // });
      this.$router.push({
        path: "/discussDetails",
        query: {
          comment_id: item.comment_id,
          type: this.$route.query.type,
          from: "web",
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
  },
};
</script>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.all-discuss-list {
  width: 100%;
  height: 100%;
  /deep/ .van-loading {
    width: 100%;
    margin-top: 30px;
    text-align: center;
  }
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
  .comment-box {
    padding: 20px;
    padding-top: 46px;
    .comment-list {
      padding-bottom: 80px;
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
      position: fixed;
      bottom: 0px;
      left: 0px;
      width: 100%;
      padding: 20px;
      background: #fff;
      box-sizing: border-box;
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
@media screen and (max-width: 360px) {
  .all-discuss-list
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
  .all-discuss-list
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
  .all-discuss-list
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
  .all-discuss-list
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
