<template>
  <div class="details">
    <div>
      <openAppDialog
        ref="openApp"
        :isShow="isShareWeb"
        :title="openTitle"
        :shareId="shareId"
        :shareType="shareType"
        @openApp="openApp()"
      ></openAppDialog>
    </div>
    <div
      class="header"
      v-if="String(isShareWeb) !== 'true'"
      ref="headbarquestiondtl"
    >
      <van-nav-bar
        title="问答详情"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <van-icon name="ellipsis" slot="right" />
      </van-nav-bar>
    </div>
    <loading v-if="loading && isSharePage"></loading>
    <div class="DetaildTitle" v-if="!loading">
      <div
        :style="{
          'margin-top': String(isShareWeb) === 'true' ? '-46px' : '0px',
        }"
      >
        <div class="problem-toptag">
          <van-tag
            v-show="dataReceive.top === 1"
            color="#edf2f0"
            text-color="#188357"
            >置顶</van-tag
          >
          <p class="problem">
            {{ dataReceive.title }}
          </p>
        </div>
        <div
          class="searchButtons"
          v-if="dataReceive.topicids && dataReceive.topicids.length > 0"
        >
          <van-tag v-for="(item, index) in dataReceive.topicids" :key="index">
            {{ item.name }}
          </van-tag>
        </div>
        <div v-if="dataReceive.content !== null && dataReceive.content !== ''">
          <expandTextView
            :content="dataReceive.content"
            :expandFourLine="false"
          ></expandTextView>
        </div>
        <div class="follow">
          <p>
            <span v-if="dataReceive.attentions !== 0"
              >{{ dataReceive.attentions }}人关注</span
            >
            <span
              v-if="
                dataReceive.discuss_count !== null &&
                  dataReceive.discuss_count !== 0
              "
              >{{ dataReceive.discuss_count }}人讨论</span
            >
          </p>
          <p>
            <van-button
              icon="plus"
              class="detailsButton"
              v-if="!is_attention"
              @click="Concerns()"
              >关注问题</van-button
            >
            <van-button
              class="detailsButton"
              v-if="is_attention"
              @click="CancelConcerns()"
              >已关注</van-button
            >
          </p>
        </div>
      </div>
      <!-- 评论 -->

      <div class="comment-box" v-if="comment && comment.length > 0">
        <div class="list">
          <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :offset="200"
          >
            <div
              class="list-item"
              v-for="(item, index) in comment"
              :key="index"
              @click="HuiDa(item)"
            >
              <div class="user-news">
                <van-image
                  :src="
                    item.head_img_url === null ? headerUrl : item.head_img_url
                  "
                  round
                  width="32px"
                  height="32px"
                ></van-image>
                <div>
                  <p class="userName" v-if="item.nick !== null">
                    {{ item.nick }}
                  </p>
                  <p class="p2">
                    {{ item.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
                  </p>
                </div>
              </div>
              <div class="commit-content">
                <p>{{ item.content }}</p>
                <div
                  class="images"
                  v-if="item.image && item.image.length !== 0"
                >
                  <van-image
                    v-for="(x, i) in item.image"
                    :key="i"
                    :src="x"
                    width="32.5%"
                    height="96px"
                    fit="cover"
                    @click="BigPictureLook(item, i)"
                  ></van-image>
                </div>
              </div>
              <div class="people-number">
                <p v-if="item.support !== 0">{{ item.support }}点赞</p>
                <div v-if="item.comment_count != 0">
                  <p>{{ item.comment_count }}回复</p>
                  <div class="sanjiao" v-if="item.comment_count != 0"></div>
                </div>
              </div>
              <div class="reply-box" v-if="item.comment_count != 0">
                <div>
                  <p v-for="(x, i) in item.comment_list.slice(0, 2)" :key="i">
                    <span class="nick">{{ x.nick }}</span>
                    <span class="content">{{ x.content }}</span>
                  </p>
                </div>
              </div>
            </div>
          </van-list>
        </div>
        <div class="huida">
          <div>
            <van-button color="#188357" @click="AnswerQuestion"
              >回答问题</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无回答 -->
    <div class="detailsBitmap" v-if="isloadcomplain && commentNum <= 0">
      <van-image fit="contain" width="200" height="200" :src="Bitmap" />
      <p>暂无回答</p>
      <div class="feedback-btn">
        <van-button color="#188357" @click="AnswerQuestion"
          >回答问题</van-button
        >
      </div>
    </div>
    <!-- 评论图片放大 -->
    <div>
      <displayimage ref="displayimage"></displayimage>
    </div>
    <empty
      ref="emptyView"
      :toastTitle="toastTitle"
      :emptyShow="emptyShow"
      :style="{ top: emptyTop }"
    ></empty>
  </div>
</template>
<script>
/* eslint-disable */
import Loading from "@/components/loading";
import qs from "qs";
import displayimage from "@/components/displayImage.vue";
import openAppDialog from "@/components/openAppTopDialog.vue";
import empty from "@/components/empty.vue";
import expandTextView from "@/components/expandTextView.vue";
export default {
  data() {
    return {
      loading: true,
      dataReceive: "",
      DetailsContent: {
        title: "在成都生活是一种怎样的人生体验?",
        tags: ["户外运动", "测试"],
        followNum: 0,
        commentNum: 0,
        description: "",
      },
      is_attention: false, // 是否关注
      Bitmap: require("@/assets/img/okoko.png"),
      comment: [], // 评论列表
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      openTitle: "打开天府绿道APP<br/>参与问答互动",
      isShareWeb: this.$route.query.isShareWeb,
      shareId: this.$route.query.id,
      shareType: "question",
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
      listLoading: false,
      finished: false,
      page: 0, // 当前页数
      page_size: "10", // 页面条数
      isSharePage: false,
      emptyTop: "46px",
      isloadcomplain: false,
      commentNum: 0,
    };
  },
  components: {
    Loading,
    displayimage,
    openAppDialog,
    empty,
    expandTextView,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    this.InitData();
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
  },
  beforeDestroy() {
    console.log("beforeDestroy");
  },
  methods: {
    onClickLeft() {
      if (this.$route.query.from) {
        this.$router.go(-1);
      } else {
        window.wii.app.invoke("closeWindow");
      }
    },
    onClickRight() {
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.dataReceive.shareInfo.title,
          summary: this.dataReceive.shareInfo.content,
          pic: this.dataReceive.shareInfo.pic,
          link: this.dataReceive.shareInfo.url,
        },
        collect: {
          isShow: false,
          isCollect: false,
          type: "tips",
          articleId: "",
        },
      });
    },
    InitData() {
      if (String(this.isShareWeb) == "true") {
        this.isSharePage = true;
      } else {
        this.showLoading(this.loading);
      }
      var params = {
        question_id: this.$route.query.id,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/detailsProblem`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${this.skey}`,
          },
        })
        .then((data) => {
          this.loading = false;
          this.showLoading(this.loading);
          if (data.data.ret === 0) {
            this.dataReceive = data.data.data;
            if (this.dataReceive.online_status !== 1) {
              this.toastTitle = "糟糕,数据找不到了";
              this.emptyTop = this.$refs.headbarquestiondtl.offsetHeight + "px";
              this.emptyShow = true;
              return;
            }
            this.is_attention = this.dataReceive.is_attention; // 是否关注
            this.onLoad();
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.toastTitle = "网络异常,检查网络再试试~~";
          this.emptyTop = this.$refs.headbarquestiondtl.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 关注问题
    Concerns() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.uid) {
        var params = {
          question_id: this.$route.query.id,
          uid: this.uid,
        };
        this.$http
          .post(`/appserver/v1/quesAnswer/concern`, qs.stringify(params), {
            headers: {
              "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${this.skey}`,
            },
          })
          .then((data) => {
            if (data.data.ret == 0) {
              this.page = 0;
              this.InitData();
              this.is_attention = true;
              this.$toast("关注成功");
            } else {
              this.$toast(data.data.msg);
            }
          });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 取消关注
    CancelConcerns() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.uid) {
        var params = {
          question_id: this.$route.query.id,
          uid: this.uid,
        };
        this.$http
          .post(`/appserver/v1/quesAnswer/unconcern`, qs.stringify(params), {
            headers: {
              "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${this.skey}`,
            },
          })
          .then((data) => {
            if (data.data.ret == 0) {
              this.is_attention = true;
              this.page = 0;
              this.InitData();
              this.$toast("您已取消关注");
            } else {
              this.$toast(data.data.msg);
            }
          });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 回答详情
    HuiDa(item) {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      this.$router.push({
        path: "/AnswerDetails",
        query: {
          answer_id: item.answer_id,
          from: "web",
        },
      });
    },
    // 回答问题
    AnswerQuestion() {
      if (String(this.isShareWeb) == "true") {
        this.$refs.openApp.showToast();
        return;
      }
      if (this.uid) {
        this.$router.push({
          path: "/Answer",
          query: {
            id: this.$route.query.id,
            questionTitle: this.dataReceive.title,
          },
        });
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
    openApp() {
      //打开APP,跳转到APP
      //eslint-disable-next-line
      console.log("openApp()");
    },
    onLoad() {
      this.listLoading = true;
      this.page = this.page + 1;
      this.InitList();
    },
    InitList() {
      var params = {
        question_id: this.$route.query.id,
        page: this.page,
        page_size: this.page_size,
      };
      this.$http
        .post(
          `/appserver/v1/quesAnswer/questionAnswerList`,
          qs.stringify(params)
        )
        .then((data) => {
          if (data.data.ret === 0) {
            var listdata = data.data.data;
            if (listdata && listdata.list) {
              if (listdata.pagination.total > 0) {
                // 问题回答列表
                if (this.page == 1) {
                  this.comment = listdata.list;
                }
                else{
                  this.comment = this.comment.concat(listdata.list);
                }
              }
            }
            if (this.comment.length >= listdata.pagination.total) {
              this.finished = true;
            }
            this.commentNum = listdata.pagination.total;
          } else {
            this.finished = true;
          }
          this.listLoading = false;
          this.isloadcomplain = true;
        })
        .catch((error) => {
          this.listLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.details {
  .detailsButton {
    border-color: #188357;
    color: #188357;
  }
}
</style>
<style lang="scss" scoped>
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
.details {
  padding-bottom: 20px;
  .DetaildTitle {
    padding: 0 20px;
    padding-top: 46px;
    border-bottom: 5px solid #f8f8f8;
    .problem-toptag {
      padding-top: 21px;
      padding-bottom: 14px;
      display: flex;
      position: relative;
      justify-content: flex-start;
      /deep/ .van-tag {
        margin-top: 5px;
        margin-bottom: 5px;
        height: 15x;
        margin-right: 8px;
        top: 50%;
        min-width: 23px;
        max-height: 18px;
      }
      .problem {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        overflow-wrap: break-word;
      }
    }
    & > p:nth-child(2) {
      display: flex;
      justify-content: flex-start;
      & > span {
        padding: 4px 7px;
        display: inline-block;
        background: rgba(70, 71, 91, 0.05);
        border-radius: 2px;
        margin-right: 8px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(70, 71, 91, 1);
      }
    }
    .searchButtons {
      padding-top: 5px;
      margin: 15px 0px;
      margin-top: 0px;
      overflow: hidden;
      display: inline-block;
      flex: auto;
      /deep/ .van-tag {
        margin-bottom: 10px;
        margin-right: 10px;
        padding: 5px;
        background-color: #f6f6f7;
        color: #555959;
      }
    }
    .follow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-bottom: 20px;

      & > p {
        &:nth-of-type(1) {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          & > span {
            margin-right: 6px;
          }
        }
        &:nth-of-type(2) {
          /deep/ .van-button {
            width: 80px;
            height: 30px;
            border-radius: 2px;
            border: 1px solid rgba(24, 131, 87, 1);
            padding: 0px;
            line-height: 30px;
          }
          /deep/ .van-button span {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(24, 131, 87, 1);
          }
          /deep/ .van-icon {
            font-size: 12px;
          }
        }
      }
    }
  }
  .comment-box {
    margin-bottom: 40px;
    .list {
      .list-item {
        padding: 0 20px;
        margin-top: 20px;
        padding-bottom: 20px;
        border-bottom: 0.5px solid #eeeeee;
        &:nth-last-child(1) {
          border: 0px;
        }
        .user-news {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          & > div {
            width: 89%;

            &:nth-of-type(2) {
              margin-left: 9px;
              display: flex;
              align-content: center;
              flex-wrap: wrap;
              & > p {
                width: 100%;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(55, 56, 77, 1);
                height: 16px;
                min-height: 17px;
                line-height: 14px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
              .userName {
                height: 20px;
                line-height: 20px;
              }

              .p2 {
                width: 100%;
                height: 12px;
                line-height: 12px;
                margin-top: 6px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
            }
          }
        }
        .commit-content {
          margin-top: 12px;
          p {
            font-size: 16px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(55, 56, 77, 1);
            line-height: 28px;
          }
          .images {
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
        .people-number {
          margin-top: 15px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          p {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          & > div {
            margin-left: 6px;
            position: relative;
            .sanjiao {
              position: absolute;
              background: #f8f8f8;
              width: 12px;
              height: 12px;
              bottom: -20px;
              left: 35%;
              -webkit-transform: rotate(125deg);
              transform: rotate(135deg);
            }
          }
        }
        .reply-box {
          margin-top: 13px;
          padding: 20px 14px;
          background: rgba(248, 248, 248, 1);
          border-radius: 3px;
          & > div {
            & > p {
              // display: flex;
              // justify-content: flex-start;
              // align-items: center;
              // flex-wrap: wrap;
              line-height: 20px;
              margin-top: 15px;
              &:nth-of-type(1) {
                margin-top: 0px;
              }
              .nick {
                font-size: 13px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(55, 56, 77, 1);
                margin-right: 7px;
              }
              .content {
                font-size: 15px;
                font-family: PingFangSC-Light, PingFang SC;
                font-weight: 300;
                color: rgba(55, 56, 77, 1);
              }
            }
          }
        }
      }
    }
    .huida {
      position: fixed;
      bottom: 0px;
      left: 0px;
      z-index: 200;
      width: 100%;
      box-sizing: border-box;
      background: #fff;
      div {
        padding: 20px;
        padding-top: 0px;
        /deep/ .van-button {
          width: 100%;
          border: 0px;
          height: 40px;
        }
        /deep/ .van-button span {
          font-size: 15px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .detailsBitmap {
    margin-top: 20px;
    text-align: center;
    p {
      // margin-top: 20px;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(155, 155, 155, 1);
    }
    .feedback-btn {
      position: fixed;
      bottom: 20px;
      left: 0px;
      width: 100%;
      padding: 0px 20px;
      box-sizing: border-box;
      background: #fff;
      /deep/ .van-button {
        width: 100%;
        border: 0px;
        height: 40px;
      }
      /deep/ .van-button span {
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
