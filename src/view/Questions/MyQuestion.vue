<template>
  <div class="my-question">
    <div class="title">
      <van-nav-bar
        title="我的问答"
        right-text="我要提问"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
    </div>
    <div class="wrap">
      <div class="content">
        <van-tabs v-model="activeTab" @click="TabScreen">
          <van-tab title="回答"></van-tab>
          <van-tab title="提问"></van-tab>
        </van-tabs>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          v-if="!NoListShow"
        >
          <div
            v-for="(item, index) in AnswerList"
            :key="index"
            :offset="0"
            class="list-box"
          >
            <div class="list-item" @click="AnswerDetails(item)">
              <div class="problem-toptag">
                <van-tag
                  v-if="item.question_top == 1"
                  color="#edf2f0"
                  text-color="#188357"
                  >置顶</van-tag
                >
                <p class="problem">{{ item.question_title }}</p>
              </div>
              <!-- <p class="time">
                <i>{{
                  item.answer_submit_time | dateFrm("YYYY-MM-DD HH:mm:ss")
                }}</i>
                <span>添加了回答</span>
              </p> -->
              <div class="answer-box">
                <div class="text">
                  <p class="answer">{{ item.answer_content }}</p>
                  <p class="zan-num">
                    <span v-if="item.answer_support != 0">
                      <i>{{ item.answer_support }}</i
                      >点赞
                    </span>
                    <span v-if="item.answer_comment_count != 0"
                      >{{ item.answer_comment_count }}回复</span
                    >
                    <van-image
                      :src="deleteIcon"
                      @click.stop="AnswerDelete(item.answer_id)"
                    ></van-image>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <van-list
          v-model="loading1"
          :finished="finished1"
          finished-text="没有更多了"
          @load="onLoad1"
          v-if="!problemListShow"
          :offset="0"
        >
          <div
            v-for="(item, index) in problemList"
            :key="index"
            class="list-box"
          >
            <div class="list-item" @click="QuestionDetails(item)">
              <div class="problem-toptag">
                <van-tag
                  v-if="item.question_top == 1"
                  color="#edf2f0"
                  text-color="#188357"
                  >置顶</van-tag
                >
                <p class="problem">{{ item.question_title }}</p>
              </div>
              <!-- <p class="time">
                {{ item.question_submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
                <span>提出来问题</span>
              </p> -->
              <div class="answer-box">
                <div class="text">
                  <p class="answer">{{ item.question_content }}</p>
                  <p class="zan-num">
                    <span v-if="item.question_attentions != 0"
                      >{{ item.question_attentions }}人关注</span
                    >
                    <span v-if="item.question_discuss_count != 0"
                      >{{ item.question_discuss_count }}人讨论</span
                    >
                    <van-image
                      :src="deleteIcon"
                      @click.stop="QuestionDelete(item.question_id)"
                    ></van-image>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <!-- 回答 -->
    <div class="answer-nolist" v-if="answerShow">
      <div class>
        <van-image :src="answerIcon" width="200px" height="200px"></van-image>
        <p>没有任何内容，快去回答问题吧</p>
      </div>
      <van-button color="#188357" @click="GoAnswer()">去回答</van-button>
    </div>
    <!-- 提问 -->
    <div class="answer-nolist" v-if="problemShow">
      <div class>
        <van-image :src="problemIcon" width="200px" height="200px"></van-image>
        <p>没有任何内容，快去提问吧</p>
      </div>
      <van-button color="#188357" @click="onClickRight()">去提问</van-button>
    </div>
    <div>
      <DeleteDialog ref="deletedialog" @deleteBtn="deleteBtn()"></DeleteDialog>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import DeleteDialog from "@/components/deleteDialog.vue";
export default {
  data() {
    return {
      backIcon: require("../../assets/iconImage/ic_back@2x.png"), // titleBar 返回icon
      activeTab: 0,
      list: [],
      AnswerList: [],
      problemList: [],
      loading: false,
      finished: false,
      loading1: false,
      finished2: false,
      answerIcon: require("../../assets/iconImage/h_mao@2x.png"), // 回答
      answerShow: false,
      problemIcon: require("../../assets/iconImage/tw_mao@2x.png"), // 提问
      problemShow: false,
      NoListShow: false,
      problemListShow: true,
      page: 0, // 当前页数
      page_sidze: "10", // 页面条数
      ansfangdou: true,
      deleteIcon: require("../../assets/iconImage/icon_more_black.png"),
      deleteObject: {
        type: 0,
        deleteId: "",
      },
      page_size: 10,
    };
  },
  components: {
    DeleteDialog,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    var iwant = localStorage.getItem("iwant");
    if (iwant == "iwant") {
      localStorage.removeItem("iwant");
      this.activeTab = 1;
      this.TabScreen();
    }
  },
  mounted() {},
  methods: {
    // 原生关闭当前页
    onClickLeft() {
      // window.wii.app.invoke("closeWindow");
      this.$router.go(-1);
    },
    // 我要提问  去提问
    onClickRight() {
      this.$router.push({
        path: "/IWantQuestion",
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}IWantQuestion`,
      // 	isFullScreen: 1,
      // 	setTitle: '',
      // 	needLoading: 0
      // });
    },
    // 去回答
    GoAnswer() {
      this.$router.push({
        path: "/QuestionHome",
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}QuestionHome`,
      // 	isFullScreen: 1,
      // 	setTitle: '',
      // 	needLoading: 0
      // });
    },
    onLoad() {
      this.page = this.page + 1;
      this.AnswerInitData();
    },
    onLoad1() {
      this.page = this.page + 1;
      this.ProblemInitData();
    },
    // 回答 提问 筛选
    TabScreen() {
      this.loading = true;
      this.finished = false;
      this.loading1 = true;
      this.finished1 = false;
      this.AnswerList = [];
      this.problemList = [];
      this.page = 0;
      if (this.activeTab === 0) {
        if (this.ansfangdou) {
          this.ansfangdou = false;
          this.onLoad();
        }
      } else {
        this.onLoad1();
      }
    },
    // 回答
    AnswerInitData() {
      this.problemListShow = true;
      this.problemShow = false;
      var params = {
        uid: this.uid,
        page: this.page,
        page_size: this.page_size,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/myAnswerList`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          this.ansfangdou = true;
          if (data.data.ret === 0) {
            if (data.data.data !== null) {
              if (data.data.data.pagination.total == 0) {
                this.answerShow = true;
                this.NoListShow = true;
              } else {
                this.NoListShow = false;
              }
              // 异步更新数据
              setTimeout(() => {
                var rows = data.data.data.list;
                for (var i = 0; i < rows.length; i++) {
                  this.AnswerList.push(rows[i]);
                }
                // 加载状态结束
                this.loading = false;
                // 数据全部加载完成
                if (this.AnswerList.length >= data.data.data.pagination.total) {
                  this.finished = true;
                }
              }, 500);
            } else {
              this.answerShow = true;
              this.NoListShow = true;
            }
          } else {
            this.answerShow = true;
            this.NoListShow = true;
          }
          this.showLoading(false);
        });
    },
    ProblemInitData() {
      this.NoListShow = true;
      this.answerShow = false;
      var params = {
        uid: this.uid,
        page: this.page,
        page_size: this.page_size,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/myQuestions`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            if (data.data.data !== null) {
              if (data.data.data.pagination.total == 0) {
                this.problemShow = true;
                this.problemListShow = true;
              } else {
                this.problemListShow = false;
              }
              setTimeout(() => {
                var rows = data.data.data.list;
                for (var i of rows) {
                  this.problemList.push(i);
                }
                // 加载状态结束
                this.loading1 = false;
                // 数据全部加载完成
                if (
                  this.problemList.length >= data.data.data.pagination.total
                ) {
                  this.finished1 = true;
                }
              }, 500);
            } else {
              this.problemShow = true;
              this.problemListShow = true;
              this.finished1 = true;
            }
          } else {
            this.problemShow = true;
            this.problemListShow = true;
            this.finished1 = true;
          }
        });
    },
    AnswerDetails(item) {
      this.$router.push({
        path: "/AnswerDetails",
        query: {
          answer_id: item.answer_id,
          from: "web",
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}AnswerDetails?answer_id=${item.answer_id}`,
      // 	isFullScreen: 0,
      // 	setTitle: '回答详情',
      // 	needLoading: 0
      // });
    },
    QuestionDetails(item) {
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}QuestionDetails?id=${item.question_id}`,
      // 	isFullScreen: 0,
      // 	setTitle: '问答详情',
      // 	needLoading: 1
      // });
      this.$router.push({
        path: "/QuestionDetails",
        query: {
          id: item.question_id,
          from: "web",
          isShareWeb: false,
        },
      });
    },
    deleteBtn() {
      if (this.deleteObject.type === 0) {
        this.DeleteAnswer(this.deleteObject.deleteId);
      } else if (this.deleteObject.type === 1) {
        this.DeletlQuesition(this.deleteObject.deleteId);
      }
    },
    AnswerDelete(answerid) {
      this.$refs.deletedialog.isDeleteShow = true;
      // eslint-disable-next-line
      console.log("answerid:" + answerid);
      this.deleteObject.type = 0;
      this.deleteObject.deleteId = answerid;
    },
    QuestionDelete(questerid) {
      this.$refs.deletedialog.isDeleteShow = true;
      this.deleteObject.type = 1;
      this.deleteObject.deleteId = questerid;
    },
    //删除问题
    DeletlQuesition(question_id) {
      var data = {
        question_id: question_id,
      };
      this.$http
        .post("/appserver/v1/quesAnswer/issueDeletl", qs.stringify(data))
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("删除成功");
            this.deleteShow = false;
            this.TabScreen();
          } else {
            this.deleteShow = false;
            this.$toast(data.data.msg);
          }
        });
    },
    //删除回答
    DeleteAnswer(answer_id) {
      var data = {
        id: answer_id,
      };
      this.$http
        .post("/appserver/v1/quesAnswer/commentDelete", qs.stringify(data))
        .then((data) => {
          this.$refs.deletedialog.isDeleteShow = false;
          if (data.data.ret == 0) {
            this.$toast("删除成功");
            this.TabScreen();
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
.my-question {
  .title {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .van-nav-bar {
      width: 100%;
    }
    /deep/ .van-nav-bar .van-icon {
      color: #000;
      font-size: 22px;
      font-weight: 600;
    }
    /deep/ .van-nav-bar__title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
    }
    /deep/ .van-nav-bar__text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(24, 131, 87, 1);
    }
    /deep/ .van-nav-bar__text:active {
      background: #fff;
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
  }
  .wrap {
    margin-top: 20px;
    .content {
      /deep/ .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border: 0px;
      }
      /deep/ .van-tabs {
        // padding: 0 133px;
        padding: 0 35vw;
      }
      /deep/ .van-tabs__line {
        width: 33px !important;
        height: 3px !important;
        bottom: 28px;
        background-color: #188357;
      }
      /deep/ .van-tab {
        line-height: 20px;
        font-size: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(85, 89, 89, 1);
      }
      /deep/ .van-tab--active {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(85, 89, 89, 1);
      }
      .list-box {
        margin-top: 14px;
        padding: 0 20px;
        padding-bottom: 24px;
        border-bottom: 1px solid #eee;
        .list-item {
          .problem-toptag {
            display: flex;
            .van-tag {
              display: inline-flex;
              margin-right: 6px;
              background: rgba(24, 131, 87, 0.05);
              border-radius: 2px;
              font-size: 11px;
              font-weight: 400;
              color: rgba(24, 131, 87, 1);
              min-width: 23px;
            }
            .problem {
              font-size: 17px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(55, 56, 77, 1);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
          }
          .time {
            margin-top: 15px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            & > span {
              margin-left: 8px;
            }
          }
          .answer-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .answer {
              margin-top: 15px;
              font-size: 16px;
              font-family: PingFangSC-Light, PingFang SC;
              font-weight: 300;
              color: rgba(55, 56, 77, 1);
              line-height: 24px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
            .zan-num {
              margin-top: 15px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              span {
                margin-right: 6px;
              }
              /deep/ .van-image {
                width: auto;
                height: auto;
                fill: none;
                margin-top: 5px;
                position: absolute;
                right: 10px;
                padding: 10px;
              }
            }
          }
        }
      }
    }
  }
  .answer-nolist {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    margin-top: 50px;
    & > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      p {
        width: 100%;
        text-align: center;
        margin-top: 19px;
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(155, 155, 155, 1);
      }
    }
    /deep/ .van-button {
      margin-top: 100px;
      width: 100%;
      border: 0px;
      height: 40px;
    }
    /deep/ .van-button span {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
