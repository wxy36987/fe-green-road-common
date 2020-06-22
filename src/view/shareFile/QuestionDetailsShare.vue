<template>
  <div class="details">
    <loading v-if="loading"></loading>
    <div class="DetaildTitle" v-if="!loading">
      <div>
        <p class="problem">{{ dataReceive.title }}</p>
        <!-- <p>
        <span
          v-for="(item,index) in DetailsContent.tags"
          :key="index"
        >{{item}}</span>
      </p>-->
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
            <!-- <span v-if="dataReceive.commentNum !== 0"
							>{{ dataReceive.discuss_count }}人讨论</span
						> -->
          </p>
          <!-- <p>
						<van-button icon="plus" class="detailsButton" v-if="!is_attention"
							>关注问题</van-button
						>
						<van-button class="detailsButton" v-if="is_attention"
							>已关注</van-button
						>
					</p> -->
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment-box" v-if="dataReceive.answers !== 0">
        <div class="list">
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
                <p v-if="item.nick !== null">{{ item.nick }}</p>
                <p class="p2">
                  {{ item.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
                </p>
              </div>
            </div>
            <div class="commit-content">
              <p>{{ item.content }}</p>
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
                  <!-- <van-image
									:src="x.head_img_url === null ? headerUrl : x.head_img_url"
									round
									width="32px"
									height="32px"
                ></van-image>-->
                  <span>{{ x.nick }}</span>
                  {{ x.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="huida">
					<div>
						<van-button color="#188357" @click="AnswerQuestion"
							>回答问题</van-button
						>
					</div>
				</div> -->
      </div>
      <!-- 暂无回答 -->
      <div class="detailsBitmap" v-if="dataReceive.answers === 0">
        <van-image width="270" height="270" :src="Bitmap" />
        <p>暂无回答</p>
        <!-- <div class="feedback-btn">
					<van-button color="#188357" @click="AnswerQuestion"
						>回答问题</van-button
					>
				</div> -->
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Loading from "@/components/loading";
import qs from "qs";
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
    };
  },
  components: {
    Loading,
    expandTextView,
  },
  mounted() {
    this.InitData();
  },
  beforeUpdate() {},
  beforeDestroy() {
    console.log("beforeDestroy");
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    InitData() {
      console.log(234);
      var params = {
        question_id: this.$route.query.id,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/detailsProblem`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            this.dataReceive = data.data.data;
            this.is_attention = this.dataReceive.is_attention; // 是否关注
            this.comment = this.dataReceive.answer_list; // 问题回答列表
            this.loading = false;
          }
        });
    },
    // 关注问题
    Concerns() {
      var params = {
        question_id: this.$route.query.id,
        uid: this.uid,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/concern`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            this.InitData();
            this.$toast("关注成功");
            this.is_attention = true;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 取消关注
    CancelConcerns() {
      var params = {
        question_id: this.$route.query.id,
        uid: this.uid,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/unconcern`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("您已取消关注");
            this.is_attention = true;
            this.InitData();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 回答详情
    HuiDa(item) {
      // eslint-disable-next-line
      // console.log(item)
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
      this.$router.push({
        path: "/Answer",
        query: {
          id: this.$route.query.id,
          questionTitle: this.dataReceive.title,
        },
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
    border-bottom: 5px solid #f8f8f8;
    .problem {
      padding-top: 21px;
      padding-bottom: 14px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
    }
    p:nth-child(2) {
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
                height: 14px;
                line-height: 14px;
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
          p {
            font-size: 15px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(55, 56, 77, 1);
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 20px;
            margin-top: 15px;
            &:nth-of-type(1) {
              margin-top: 0px;
            }
            span {
              font-size: 13px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(55, 56, 77, 1);
              margin-right: 7px;
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
      width: 100%;
      padding: 0px 20px;
      box-sizing: border-box;
      background: #fff;
      margin-top: 50px;
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
