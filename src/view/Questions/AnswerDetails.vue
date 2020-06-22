<template>
  <div class="answer-details">
    <div class="header" ref="headbaranswer">
      <van-nav-bar
        title="回答详情"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <!-- <van-icon name="ellipsis" slot="right" /> -->
      </van-nav-bar>
    </div>
    <!-- <loading v-if="loading"></loading> -->
    <div class="wrap" v-if="!loading">
      <div class="user-news">
        <div class="problem-toptag">
          <van-tag
            v-show="dataReceive.top === 1"
            color="#edf2f0"
            text-color="#188357"
            >置顶</van-tag
          >
          <p class="problem">
            {{ dataReceive.question_title }}
          </p>
        </div>
        <div
          class="searchButtons"
          v-if="dataReceive.topicids && dataReceive.topicids.length > 0"
        >
          <van-button
            type="primary"
            size="small"
            v-for="(item, index) in dataReceive.topicids"
            :key="index"
            class="problem-tag"
          >
            <p>
              {{ item.name }}
            </p>
          </van-button>
        </div>

        <div class="problem-describe">
          <div class="user">
            <van-image
              round
              :src="
                dataReceive.head_img_url === null ||
                dataReceive.head_img_url === ''
                  ? headerUrl
                  : dataReceive.head_img_url
              "
              width="32px"
              height="32px"
            ></van-image>
            <div>
              <p v-if="dataReceive.nick !== null">
                <span v-if="dataReceive.nick !== ''">{{
                  dataReceive.nick
                }}</span>
              </p>
              <p class="p_t">
                {{ dataReceive.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
              </p>
            </div>
          </div>
          <p>{{ dataReceive.content }}</p>
          <!-- 九宫格 -->
          <div class="images" v-if="images && images.length !== 0">
            <van-image
              v-for="(item, index) in images"
              :key="index"
              :src="item"
              width="32.5%"
              height="96px"
              fit="cover"
              @click="BigPictureLook(images, index)"
            ></van-image>
          </div>
        </div>
      </div>
      <div class="pl-box">
        <div class="pl-title">
          <van-cell
            title="评论"
            is-link
            :value="dataReceive.comment_count + '条'"
            v-if="dataReceive.comment_count != 0"
            @click="AllComment()"
          />
          <van-cell title="评论" v-if="dataReceive.comment_count == 0" />
        </div>
        <div class="list" v-if="dataReceive.comment_count != 0">
          <div
            class="list-item"
            v-for="(item, index) in list"
            :key="index"
            @click="CommentDetails(item)"
          >
            <div class="user-newsbox">
              <van-image
                round
                :src="
                  item.head_img_url === null || item.head_img_url === ''
                    ? headerUrl
                    : item.head_img_url
                "
                width="32px"
                height="32px"
              ></van-image>
              <div class="right">
                <div>
                  <p v-if="item.nick !== null">
                    <span v-if="item.nick !== ''">{{ item.nick }}</span>
                  </p>
                  <p class="p-t">
                    {{ item.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
                  </p>
                </div>
                <div>
                  <div v-if="item.reply_count != 0">
                    <van-image
                      width="14px"
                      height="14px"
                      :src="plIcon"
                      @click="PingLun(item)"
                    ></van-image>
                    <span>{{ item.reply_count }}</span>
                  </div>
                  <div v-if="item.support != null || item.support != 0">
                    <van-image
                      width="14px"
                      height="14px"
                      :src="zanIcon"
                      v-if="!item.is_supported"
                    ></van-image>
                    <van-image
                      width="16px"
                      height="16px"
                      :src="zanActIcon"
                      v-if="item.is_supported"
                    ></van-image>
                    <span>{{ item.support }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pl-content">
              <p></p>
              <p>{{ item.content }}</p>
            </div>
            <div class="delete" v-if="item.fruid === userId">
              <p></p>
              <p>
                <span @click="Delete(item)">删除</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="list-no" v-if="dataReceive.comment_count == 0">
        <div>
          <van-image width="189px" height="189px" :src="listNoIcon"></van-image>
          <p>还没有回复，留下你的评论吧</p>
        </div>
      </div>
    </div>
    <!-- 不自动聚焦版本 -->
    <div class="write-comments-box">
      <div class="write-comments" v-if="writeShow">
        <div class="dianzan">
          <van-image
            :src="userZanIcon"
            width="30px"
            height="30px"
            v-if="ZanShow"
            @click="DianZan()"
          ></van-image>
          <van-image
            :src="userNoZanIcon"
            width="30px"
            height="30px"
            v-if="!ZanShow"
            @click="NoDianZan()"
          ></van-image>
          <p v-if="dataReceive.support !== 0">{{ dataReceive.support }}</p>
        </div>
        <div class="write">
          <van-field
            v-model="value"
            placeholder="写下我的评论"
            @click="WriteComment"
          />
        </div>
      </div>
      <div class="write-input" v-if="!writeShow">
        <van-cell-group>
          <van-field
            v-model="huifu"
            rows="1"
            autosize
            type="textarea"
            ref="myInput"
            id="myInput"
            placeholder="回复"
            @input="ReplyInput()"
            @blur="ReplyBlur()"
          />
        </van-cell-group>
        <div class="btn">
          <van-button class="no-btn" v-if="publishShow" color="#F1F1F1"
            >发布</van-button
          >
          <van-button
            class="yes-btn"
            color="#188357"
            :disabled="disabledFbBtn"
            v-if="!publishShow"
            @click="Publish()"
            >发布</van-button
          >
        </div>
      </div>
    </div>
    <!-- 图片放大 -->
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
import qs from "qs";
// import Loading from "@/components/loading";
import displayimage from "@/components/displayImage.vue";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      loading: true,
      list: [],
      listNoIcon: require("../../assets/iconImage/huifu_no@3x.png"),
      plIcon: require("../../assets/iconImage/pinglun@3x.png"),
      zanIcon: require("../../assets/iconImage/dianzan@3x.png"),
      zanActIcon: require("../../assets/iconImage/dianzan_active@3x.png"),
      userZanIcon: require("../../assets/iconImage/ic_dianzan@3x.png"),
      userNoZanIcon: require("../../assets/iconImage/ic_dianzan2@3x.png"),
      ZanShow: true,
      value: "",
      writeShow: true,
      huifu: "",
      publishShow: true,
      dataReceive: "",
      answer_id: "",
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      userId: this.uid,
      data: [],
      images: [],
      emptyShow: false,
      disabledFbBtn: false,
      emptyTop: "46px",
    };
  },
  components: {
    // Loading,
    displayimage,
    empty,
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '回答详情');
  },
  mounted() {
    this.InitData();
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
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
    // 分享
    onClickRight() {
      // window.wii.app.invoke("setActionBar", {
      //   share: {
      //     isShow: true,
      //     title: this.dataReceive.question_title,
      //     summary: this.dataReceive.content,
      //     pic: this.dataReceive.image,
      //     link: `${this.domain}answerDetailsShare?answer_id=${
      //       this.$route.query.answer_id
      //     }`,
      //     // link: window.location.href
      //   },
      //   collect: {
      //     isShow: false,
      //     isCollect: false,
      //     type: "question_answer",
      //     articleId: this.$route.query.answer_id,
      //   },
      // });
    },
    InitData() {
      this.showLoading(this.loading);
      var params = {
        answer_id: this.$route.query.answer_id,
        uid: this.uid,
        // uid: this.$route.query.uid
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/forDetails`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          this.loading = false;
          if (data.data.ret == 0) {
            if (data.data.data !== null) {
              this.dataReceive = data.data.data;
              this.list = data.data.data.comment_list;
              if (data.data.data.is_supported === true) {
                this.ZanShow = false;
              } else {
                this.ZanShow = true;
              }
              if (this.dataReceive.images) {
                this.images = this.dataReceive.images;
              }
            }
          }
          this.showLoading(this.loading);
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbaranswer.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 全部评论
    AllComment() {
      this.$router.push({
        path: "/AllComments",
        query: {
          answer_id: this.dataReceive.answer_id,
          ZanShow: this.ZanShow,
          support: this.dataReceive.support,
        },
      });
    },
    // 评论详情
    CommentDetails(item) {
      this.$router.push({
        path: "/CommentsDetails",
        query: {
          comment_id: item.comment_id,
        },
      });
    },
    // 子评论发布
    PingLun(item) {
      this.answer_id = item.id;
    },
    Delete(item) {
      event.stopPropagation();
      var params = {
        id: item.comment_id,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/commentDelete`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("删除成功");
            this.InitData();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 点赞
    DianZan() {
      var params = {
        id: this.dataReceive.answer_id,
        uid: this.uid,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/thumbComments`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("点赞成功");
            this.InitData();
            this.ZanShow = false;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 取消点赞
    NoDianZan() {
      var params = {
        id: this.dataReceive.answer_id,
        uid: this.uid,
      };
      this.$http
        .post(
          `/appserver/v1/quesAnswer/cancelThumbComments`,
          qs.stringify(params),
          {
            headers: {
              "Set-Cookie": `w_uid=${this.uid};w_open_id=${
                this.open_id
              };w_skey=${this.skey}`,
            },
          }
        )
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("你取消了点赞");
            this.InitData();
            this.ZanShow = true;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 发布按钮
    Publish() {
      this.disabledFbBtn = true;
      var params = {
        to_reply_id: this.dataReceive.answer_id,
        reply_uid: this.uid,
        content: this.huifu,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/commentAnswer`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          this.disabledFbBtn = false;
          if (data.data.ret == 0) {
            this.huifu = "";
            this.publishShow = true;
            this.writeShow = true;
            this.$toast("评论成功");
            this.InitData();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 写评论
    WriteComment() {
      this.writeShow = false;
      this.$nextTick(() => {
        document.getElementById("myInput").focus();
      });
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        document.activeElement.scrollIntoViewIfNeeded(true);
        window.setTimeout("scrollBottom()", 100);
      }
    },
    scrollBottom() {
      // window.scrollTo(0, document.getElementsByTagName("body").height());
      const h = document.body.scrollHeight;
      if (document.body.scrollHeight < h) {
        document.body.style.height = h;
      }
    },
    // 回复判断发布按钮是否可以触发
    ReplyInput() {
      if (this.huifu === "") {
        this.publishShow = true;
        this.writeShow = true;
        document.getElementById("myInput").blur();
      } else {
        this.publishShow = false;
      }
    },
    ReplyBlur() {
      if (this.huifu === "") {
        this.publishShow = true;
        this.writeShow = true;
      } else {
        this.publishShow = false;
      }
    },
    // 图片点击放大
    BigPictureLook(images, index) {
      this.$refs.displayimage.showBigPictureLook(images, index);
    },
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    writeShow: function(newVal, oldVal) {
      //eslint-disable-next-line
      console.log("writeShow oldVal:" + oldVal);
      if (!newVal) {
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
      } else {
        document.body.style.position = "static";
        document.body.style.height = "auto";
      }
    },
  },
  destroyed() {
    if (document.body.style.height === "100%") {
      document.body.style.position = "static";
      document.body.style.height = "auto";
    }
  },
};
</script>
<style lang="scss" scoped>
.answer-details {
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
  .wrap {
    padding-bottom: 68px;
    padding-top: 46px;
    .user-news {
      .problem-toptag {
        padding: 21px 15px 10px 15px;
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
      .searchButtons {
        padding-top: 5px;
        margin: 15px 20px;
        margin-top: 0px;
        // max-height: 80px;
        overflow: hidden;
        display: inline-block;
        flex: auto;
        /deep/ .van-button {
          min-width: 73px;
        }
        .problem-tag {
          color: #555959;
          background-color: #f6f6f7;
          border-color: #f6f6f7;
          margin: 5px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }

      .problem-describe {
        border-top: 1px solid #f8f8f8;
        padding: 20px;
        padding-bottom: 30px;
        border-bottom: 5px solid #f8f8f8;
        .user {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          & > div {
            &:nth-of-type(2) {
              margin-left: 9px;
              display: flex;
              align-content: flex-start;
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
              .p_t {
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
        & > p {
          margin-top: 12px;
          font-size: 16px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          line-height: 26px;
        }
        // /deep/ .van-image {
        //   margin: 20px 0px;
        // }
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
    }
    .pl-box {
      .pl-title {
        /deep/ .van-cell {
          padding: 30px 20px 25px 20px;
          display: flex;
          align-items: center;
        }
        /deep/ .van-cell__title {
          height: 20px;
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(55, 56, 77, 1);
          line-height: 20px;
        }
        /deep/ .van-cell__value {
          height: 14px;
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          line-height: 14px;
        }
        /deep/ .van-cell__right-icon {
          color: #000;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .list {
        padding: 0 20px;
        .list-item {
          margin-top: 34px;
          &:nth-of-type(1) {
            margin: 0px;
          }
          .user-newsbox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right {
              width: 87.7%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              & > div {
                &:nth-of-type(1) {
                  & > p {
                    height: 14px;
                    font-size: 14px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: rgba(55, 56, 77, 1);
                    line-height: 14px;
                  }
                  .p-t {
                    margin-top: 6px;
                    height: 12px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);
                    line-height: 12px;
                  }
                }
                &:nth-of-type(2) {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  & > div {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-right: 14px;
                    span {
                      font-size: 12px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: rgba(153, 153, 153, 1);
                      line-height: 24px;
                      margin-left: 4px;
                    }
                  }
                }
              }
            }
          }
          .pl-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 14px;
            & > p {
              &:nth-of-type(1) {
                width: 32px;
                height: 32px;
              }
              &:nth-of-type(2) {
                width: 87.7%;
                //width: 30px;
                font-size: 15px;
                font-family: PingFangSC-Light, PingFang SC;
                font-weight: 300;
                color: rgba(55, 56, 77, 1);
                line-height: 24px;
              }
            }
          }
          .delete {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 14px;
            & > p {
              &:nth-of-type(1) {
                width: 32px;
                height: 32px;
              }
              &:nth-of-type(2) {
                width: 87.7%;
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(24, 131, 87, 1);
              }
              // &:nth-of-type(3) {
              //   width: 87.7%;
              // }
            }
          }
        }
      }
    }
    .list-no {
      margin-top: 30px;
      width: 100%;
      & > div {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        & > p {
          width: 100%;
          margin-top: 24px;
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(155, 155, 155, 1);
          text-align: center;
        }
      }
    }
  }
  .write-comments-box {
    box-shadow: 0px 4px 29px #d8d8d8;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    .write-comments {
      width: 100%;
      padding: 12px 20px 12px 28px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dianzan {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        & > p {
          margin-top: 4px;
        }
      }
      .write {
        width: 76%;
        /deep/ .van-cell {
          background: #f1f1f1;
          border-radius: 3px;
          height: 36px;
          line-height: inherit;
        }
        ::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
        }
        :-moz-placeholder {
          /* Mozilla Firefox 4 ~ 18 */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
          opacity: 1;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
          opacity: 1;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10 ~ 11 */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
        }
        ::-ms-input-placeholder {
          /* Microsoft Edge */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
        }

        ::placeholder {
          /* 大部分现代浏览器 */
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
    .write-input {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      padding: 19px 20px 17px 19px;
      display: flex;
      overflow-y: auto;
      justify-content: flex-start;
      /deep/ .van-field__body textarea {
        -webkit-user-select: auto;
      }
      /deep/ .van-hairline--top-bottom::after {
        border: 0px;
      }
      /deep/ .van-cell {
        line-height: inherit;
        width: 100%;
        background: rgba(248, 248, 248, 1);
        border-radius: 2px 0px 0px 2px;
        padding: 0px;
      }
      /deep/ .van-field__control {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        max-height: 54px !important;
        color: rgba(68, 68, 68, 1);
      }
      /deep/ .van-field {
        height: 100%;
      }
      /deep/ .van-cell-group {
        width: 82%;
        padding: 5px;
        background: rgba(248, 248, 248, 1);
        border-radius: 2px 0px 0px 2px;
      }
      .btn {
        height: auto;
        /deep/ .van-button {
          height: 100%;
        }
        .no-btn {
          span {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
        }
        .yes-btn {
          span {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }
}
@media screen and (min-width: 370px) {
  .answer-details .write-comments-box .write-input /deep/ .van-cell-group {
    width: 80%;
  }
}
@media screen and (min-width: 360px) {
  .answer-details .write-comments-box .write-input /deep/ .van-cell-group {
    width: 79%;
  }
}
@media screen and (min-width: 350px) {
  .answer-details .write-comments-box .write-input /deep/ .van-cell-group {
    width: 78%;
  }
}
@media screen and (min-width: 340px) {
  .answer-details .write-comments-box .write-input /deep/ .van-cell-group {
    width: 77%;
  }
}
</style>
