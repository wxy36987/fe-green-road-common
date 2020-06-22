<template>
  <div class="all-discuss-list">
    <div class="header" ref="navbarRef">
      <van-nav-bar title="评论详情" left-arrow @click-left="onClickLeft">
        <!-- @click-right="onClickRight" -->
        <!-- <van-icon name="ellipsis" slot="right" /> -->
        <van-icon
          name="ellipsis"
          color="black"
          slot="right"
          @click="CommentDelete(comment_id, 0)"
          id="navicon2"
          v-if="isOwner"
        />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="userInfo">
        <van-image
          round
          width="32px"
          height="32px"
          :src="head_img_url"
        ></van-image>
        <div>
          <p class="p-one">{{ nick }}</p>
          <span>{{ timestampToTime(dataReceive.comment_time) }}</span>
        </div>
      </div>
      <div class="comment-conent">
        <p>{{ dataReceive.content }}</p>
        <div>
          <van-image
            v-for="(x, i) in image"
            :key="i"
            :src="x"
            width="32.5%"
            height="96px"
            fit="cover"
            @click="BigPictureLook(item, i)"
          ></van-image>
        </div>
      </div>
      <div class="reply-box">
        <div class="reply-zan-box">
          <div class="title">
            <p>回复</p>
            <span>{{ dataReceive.reply_count }}</span>
          </div>
          <div class="title">
            <p>赞</p>
            <span>{{ dataReceive.up }}</span>
          </div>
        </div>

        <div class="comment-list">
          <customListView
            :arraydata="commentList"
            :isCanUp="true"
            :isVisalbeDelBtn="true"
            @itemClick="Details"
            @bigPictureLook="BigPictureLook"
            @commentDelete="CommentDelete"
            @itemDianZan="itemDianZan"
          >
          </customListView>
        </div>
        <div class="list-no" v-if="CommentNum === 0">
          <p>暂无评论，赶紧来抢沙发吧</p>
        </div>
        <div class="footer">
          <van-image :src="yinIcon" width="100%"></van-image>
          <div class="btn-box">
            <div v-if="!dataReceive.is_up" @click="DianZan('1')">
              <van-image :src="zanIcon" width="30px" height="30px"></van-image>
              <p>点赞</p>
            </div>
            <!-- <div v-if="dataReceive.is_up" @click="DianZan('3')"> -->
            <div v-if="dataReceive.is_up">
              <van-image
                :src="dianzanIcon"
                width="30px"
                height="30px"
              ></van-image>
              <p>点赞</p>
            </div>
            <div @click="Write()">
              <van-image :src="hfIcon" width="30px" height="30px"></van-image>
              <p>回复</p>
            </div>
          </div>
        </div>
      </div>
      <empty
        ref="emptyView"
        :emptyShow="emptyShow"
        :style="{ top: emptyTop }"
      ></empty>
    </div>
    <!-- 回复 -->
    <div>
      <writeComment
        ref="writeComment"
        :isUploadIconShow="false"
        @Fb="Fb(arguments)"
        id="modalId"
      ></writeComment>
    </div>
    <!-- 评论删除 -->
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
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import DeleteDialog from "@/components/deleteDialog.vue";
import writeComment from "@/components/writeComment.vue";
import displayimage from "@/components/displayImage.vue";
import customListView from "@/components/customListViewComment.vue";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      listData: [],
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      dataReceive: "",
      head_img_url: "",
      nick: "",
      image: [],
      loading: true,
      // 评论列表icon
      zanNum: require("../../assets/iconImage/ic_like@3x.png"),
      zanNumAct: require("../../assets/iconImage/ic_like_act@3x.png"),
      publishShow: true,
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),
      commentList: [],
      // 删除
      comment_id: "",
      galleryVosList: [],
      // 底部
      yinIcon: require("../../assets/iconImage/line_gray_hf@3x.png"),
      zanIcon: require("../../assets/iconImage/ic_dianzan_hf@3x.png"),
      dianzanIcon: require("../../assets/iconImage/ic_dianzan2_hf@3x.png"),
      hfIcon: require("../../assets/iconImage/ic_talk_hf@3x.png"),
      top: 0,
      isOwner: false,
      CommentNum: "", // 评论条数,
      type: 0,
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  components: {
    DeleteDialog,
    writeComment,
    displayimage,
    customListView,
    empty,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    // this.isOwner = this.$route.query.isOwner;
  },
  mounted() {
    this.getCommentList();
    // eslint-disable-next-line
    window.ImagesInfo = (params) => {
      var img = [];
      for (let i = 0; i < JSON.parse(params).length; i++) {
        img.push(
          "data:image/" +
            JSON.parse(params)[i].type +
            ";base64," +
            JSON.parse(params)[i].dataUrl
        );
      }
      for (let i = 0; i < img.length; i++) {
        var arr = img[i].split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        this.file = new File([u8arr], "aaa." + JSON.parse(params)[0].type, {
          type: mime,
        });
        this.afterRead(this.file);
      }
    };
  },
  methods: {
    onClickLeft() {
      if (this.$route.query.from) {
        this.$router.go(-1);
      } else {
        window.wii.app.invoke("closeWindow");
      }
    },
    getCommentList() {
      let data = {
        comment_id: this.$route.query.comment_id,
      };
      this.$http
        .post("/appserver/v1/comment/getDetailComment", qs.stringify(data))
        .then((data) => {
          this.dataReceive = data.data.data;
          // console.log(this.dataReceive)
          if (data.data.data.userInfo && data.data.data.userInfo.head_img_url) {
            this.head_img_url = data.data.data.userInfo.head_img_url;
          } else {
            this.head_img_url = this.headerUrl;
          }
          if (data.data.data.userInfo && data.data.data.userInfo.nick) {
            this.nick = data.data.data.userInfo.nick;
          } else {
            this.nick = "";
          }

          this.image = this.dataReceive.image;
          this.commentList = this.dataReceive.reply_list;
          this.CommentNum = this.commentList.length;
          // this.isOwner = this.dataReceive.is_owner;
          this.isOwner = this.dataReceive.uid == this.uid;
        })
        .catch((error) => {
          this.emptyTop = this.$refs.navbarRef.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    CommentDeleteBtn() {
      event.stopPropagation();
      let data = {
        comment_id:
          this.type == 0 ? this.$route.query.comment_id : this.comment_id,
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
            if (this.type == 0) {
              if (this.$route.query.from) {
                this.$router.go(-1);
              } else {
                window.wii.app.invoke("closeWindow");
              }
            } else {
              this.getCommentList();
            }
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 评论删除
    CommentDelete(id, type) {
      event.stopPropagation();
      if (this.uid) {
        this.$refs.deletedialog.isDeleteShow = true;
        this.comment_id = id;
        this.type = type;
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },

    // 图片点击放大
    BigPictureLook(item, index) {
      this.$refs.displayimage.showBigPictureLook(this.image, index);
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
        cid: this.$route.query.comment_id,
        ctitle: this.title,
        type: this.$route.query.type ? this.$route.query.type : "travel_notes",
        source_type: "app",
        image: gallerysStr,
        parent_id: this.$route.query.comment_id,
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
            // window.wii.app.invoke("login", {
            //   callback: ""
            // });
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    //点赞
    DianZan(type) {
      if (this.uid) {
        //点赞需要登录验证
        let data = {
          comment_id: this.$route.query.comment_id,
          number: type,
        };
        this.$http
          .post(`/appserver/v1/comment/deleteOrUp`, qs.stringify(data), {
            headers: {
              uid: this.uid,
            },
          })
          .then((data) => {
            if (data.data.ret === 0) {
              if (type === "1") {
                this.$toast("点赞成功");
                if (this.dataReceive.up !== null) {
                  this.dataReceive.up++;
                }
              } else if (type === "3") {
                this.$toast("取消点赞成功");
                if (this.dataReceive.up !== null) {
                  this.dataReceive.up--;
                }
              }
              this.dataReceive.is_up = !this.dataReceive.is_up;
            } else {
              this.$toast(data.data.msg);
            }
          })
          .catch((error) => {
            this.$toast("网络异常,检查网络再试试~~");
          });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
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
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
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
  .content {
    padding-top: 46px;
    .userInfo {
      padding: 0 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      /deep/ .van-image {
        margin-right: 8px;
      }
      & > div {
        &:nth-of-type(2) {
          .p-one {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(55, 56, 77, 1);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          & > span {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(55, 56, 77, 1);
            margin-top: 6px;
          }
        }
      }
    }
    .comment-conent {
      padding: 20px;
      font-size: 15px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(55, 56, 77, 1);
      line-height: 23px;
      border-bottom: 5px solid #f8f8f8;
      & > div {
        margin-top: 15px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        /deep/ .van-image {
          margin-right: 3px;
          margin-bottom: 4px;
          &:nth-of-type(3n) {
            margin-right: 0px;
          }
        }
        /deep/ .van-image__img {
          border-radius: 2px;
        }
      }
    }
    .reply-box {
      padding: 0 20px;
      padding-top: 30px;
      .reply-zan-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          & > p {
            font-size: 20px;
            font-family: PingFangTC-Medium, PingFangTC;
            font-weight: 500;
            color: rgba(55, 56, 77, 1);
            margin-right: 8px;
          }
          & > span {
            font-size: 15px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(153, 153, 153, 1);
          }
        }
      }
      .comment-list {
        padding-bottom: 100px;
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
      .footer {
        width: 100%;
        position: fixed;
        bottom: 0px;
        left: 0px;
        .btn-box {
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          & > div {
            height: 60px;
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            &:nth-of-type(1) {
              border-right: 2px solid #eeeeee;
            }
            /deep/ .van-image {
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .all-discuss-list .content .comment-conent > div .van-image {
    height: 90px !important;
  }
}
@media screen and (max-width: 350px) {
  .all-discuss-list .content .comment-conent > div .van-image {
    height: 88px !important;
  }
}
@media screen and (max-width: 340px) {
  .all-discuss-list .content .comment-conent > div .van-image {
    height: 86px !important;
  }
}
@media screen and (max-width: 330px) {
  .all-discuss-list .content .comment-conent > div .van-image {
    height: 80px !important;
  }
}
</style>
