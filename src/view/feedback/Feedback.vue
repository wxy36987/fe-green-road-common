<template>
  <div class="feedback">
    <div class="wrap">
      <div class="cell-list">
        <div @click="MyFeedback()">
          <van-image :src="feedbackIcon" width="50px" height="50px"></van-image>
          <p>我的反馈</p>
        </div>
        <div @click="FeedbackBtn()">
          <van-image :src="wjIcon" width="50px" height="50px"></van-image>
          <!-- 需要修改入口 -->
          <p>我要反馈</p>
        </div>
      </div>
      <div
        v-if="isHaveQuestion"
        class="questionView"
        @click="Questionnaire"
        v-bind:style="{
          backgroundImage: 'url(' + questionImage + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }"
      >
        <div class="questionTitle">{{ questionTitle }}</div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="list">
          <div class="list-item" v-for="(item, index) in list" :key="index">
            <div class="left">
              <van-image
                v-if="item.headSculpture === null || item.headSculpture === ''"
                :src="userImg"
                round
              ></van-image>
              <van-image v-else :src="item.headSculpture" round></van-image>
            </div>
            <div class="right">
              <div class="name">{{ item.userName }}</div>
              <div class="time">
                {{ item.addTime | dateFrm("YYYY-MM-DD HH:mm:ss") }}
              </div>
              <!-- timesAgo -->
              <div class="problem">{{ item.opinionQuestion }}</div>
              <div class="feedImg" v-for="(x, i) in item.galleryVos" :key="i">
                <van-image
                  width="80"
                  height="80"
                  :src="x.imageUrl"
                  fit="cover"
                  @click="BigPicture(item, i)"
                />
              </div>
              <div class="answer" v-if="item.opinionAnswer !== null">
                <div>
                  <p><span>成都绿道客服</span> 的回复</p>
                  <p>{{ item.opinionAnswer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <div style="height:75px;width:100%;"></div>
    <!-- <div class="feedback-btn">
			需要修改
			<van-button color="#188357" @click="FeedbackBtn()">我要反馈</van-button>
		</div> -->
    <!-- 图片放大 -->
    <div>
      <displayimage ref="displayimage" @isShowWatch="showWatch"></displayimage>
    </div>

    <div class="noList" v-if="noneDataShow">
      <van-image :src="noList" width="200px" height="200px"></van-image>
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import displayimage from "@/components/displayImage.vue";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      feedbackIcon: require("../../assets/iconImage/fk.png"), // 我的反馈
      wjIcon: require("../../assets/iconImage/wj.png"), // 问卷调查
      list: [], // 反馈列表的数据
      pageNum: 0,
      bigShow: false, // 图片变大
      numIndex: 0, // 显示第几个
      galleryVosList: "",
      userImg: require("../../assets/iconImage/my_moren@2x.png"), //用户头像
      isHaveQuestion: false,
      questionImage: "",
      questionTitle: "标题",
      noList: require("../../assets/iconImage/h_mao@2x.png"),
      noneDataShow: false,
    };
  },
  created() {
    window.wii.app.invoke("showNativeBar", true);
    window.wii.app.invoke("setTitle", "意见反馈");
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "意见反馈");
    };
  },
  methods: {
    // 上拉加载
    onLoad() {
      this.pageNum = this.pageNum + 1;
      this.getSuggestList();
      this.getIsHaveQuestion();
    },
    // 图片点击放大
    BigPicture(item, index) {
      var imageArray = [];
      for (var i of item.galleryVos) {
        imageArray.push(i.imageUrl);
      }
      this.$refs.displayimage.showBigPictureLook(imageArray, index);
    },
    //获取反馈列表
    getSuggestList() {
      var params = {
        pageNum: this.pageNum,
      };
      this.$http
        .post(`/appserver/v1/opinion/list`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret == 0) {
            if (
              data.data.data.list !== null &&
              data.data.data.list.length > 0
            ) {
              // 异步更新数据
              // setTimeout(() => {

              var rows = data.data.data.list;
              for (var i of rows) {
                this.list.push(i);
              }
              // 加载状态结束
              this.loading = false;

              // 数据全部加载完成
              if (this.list.length >= data.data.data.pagination.total) {
                this.finished = true;
              }
              this.finished = true;
              // }, 500);
            } else {
              this.loading = false;
              this.finished = true;
              this.noneDataShow = true;
            }
          } else {
            this.finished = true;
            this.noneDataShow = true;
          }
          this.showLoading(false);
        })
        .catch((error) => {
          this.showLoading(false);
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    getIsHaveQuestion() {
      var that = this;
      this.$http.post("/appserver/v1/opinion/img").then((data) => {
        if (data.data.ret == 0) {
          if (data.data.data == null) {
            this.isHaveQuestion = false;
          } else {
            this.isHaveQuestion = true;
            that.questionImage = data.data.data.imgUrl;
            that.questionTitle = data.data.data.title;
            this.noneDataShow = false;
          }
        }
      });
    },

    // 我的反馈
    MyFeedback() {
      if (this.uid) {
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.domain}myFeedback`,
          isFullScreen: 0,
          setTitle: "我的反馈",
          needLoading: 1,
        });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 问卷调查
    Questionnaire() {
      if (this.uid) {
        // window.wii.app.invoke('openWindow', {
        // 	openUrl: `${this.domain}questionnaire`,
        // 	isFullScreen: 0,
        // 	setTitle: '问卷调查',
        // 	needLoading: 1
        // });
        this.$router.push({
          path: "/questionnaire",
        });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 我要反馈
    FeedbackBtn() {
      if (this.uid) {
        window.wii.app.invoke("openWindow", {
          openUrl: `${this.domain}feedbackBtn`,
          isFullScreen: 0,
          setTitle: "我要反馈",
          needLoading: 1,
        });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    showWatch(isShow) {
      if (isShow) {
        window.wii.app.invoke("showNativeBar", false);
      } else {
        window.wii.app.invoke("showNativeBar", true);
      }
    },
  },
  components: {
    displayimage,
  },
};
</script>
<style lang="scss" scoped>
.noList {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  background: #f8f8f8;
  position: absolute;
  top: 136px;
  bottom: 0px;
  p {
    width: 100%;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
}
.feedback {
  width: 100%;
  height: 100%;
  .wrap {
    flex: 1;
    overflow: auto;
    .cell-list {
      padding: 30px 20px;
      display: flex;
      justify-content: space-around;
      border-bottom: 5px solid #f8f8f8;
      & > div {
        width: 80px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        & > p {
          width: 100%;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFangSC;
          font-weight: 600;
          color: rgba(55, 56, 77, 1);
          line-height: 14px;
          margin-top: 8px;
        }
      }
    }
    .questionView {
      flex: 1;
      height: 150px;
      width: 100%;
      text-align: center;
      background: #37384d;
      .questionTitle {
        // height: 30px;
        border-radius: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 12px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        position: relative;
        text-align: center;
        flex: flex;
        top: 40%;
        width: fit-content;
        padding: 8px 10px;
        margin: 0 auto;
      }
    }
    .list {
      padding: 0 20px;
      .list-item {
        display: flex;
        justify-content: flex-start;
        margin-top: 20px;
        .left {
          margin-right: 9px;
          /deep/ .van-image {
            width: 32px;
            height: 32px;
          }
        }
        .right {
          width: 100%;
          font-family: PingFangSC-Medium, PingFangSC;
          .name {
            font-size: 14px;
            font-weight: 700;
            color: rgba(55, 56, 77, 1);
            line-height: 14px;
          }
          .time {
            margin-top: 7px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 12px;
          }
          .problem {
            width: 100%;
            margin-top: 12px;
            font-size: 16px;
            font-weight: 700;
            color: #37384d;
            word-wrap: break-word;
            word-break: break-word;
            line-height: 24px;
          }
          .feedImg {
            margin: 15px 0;
            height: 80px;
            float: left;
            .van-image {
              margin-right: 10px;
            }
          }
          .answer {
            width: 100%;
            box-sizing: border-box;
            clear: both;
            margin-top: 10px;
            padding: 15px 12px;
            background: #f8f8f8;
            & > div {
              & > p {
                &:nth-of-type(1) {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFangSC;
                  font-weight: 600;
                  color: rgba(153, 153, 153, 1);
                  line-height: 14px;
                  & > span {
                    color: rgba(24, 131, 87, 1);
                  }
                }
                &:nth-of-type(2) {
                  margin-top: 15px;
                  font-size: 15px;
                  font-family: PingFangSC-Light, PingFangSC;
                  color: rgba(55, 56, 77, 1);
                  line-height: 23px;
                }
              }
            }
          }
        }
      }
    }
  }
  .feedback-btn {
    width: 100%;
    height: 70px;
    padding: 15px 25px;
    box-sizing: border-box;
    flex: 0 0 auto;
    box-shadow: 1px 0px 10px #ddd;
    z-index: 1200;
    position: fixed;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    /deep/ .van-button {
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 15px;
    }
  }
}
.van-image-preview {
  /deep/ .van-image-preview__index {
    display: none;
  }
}
</style>
