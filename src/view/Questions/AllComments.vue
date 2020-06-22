<template>
  <div class="answer-details">
    <div class="header">
      <van-nav-bar title="全部评论" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="wrap">
      <div class="pl-box">
        <div class="list">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :offset="0"
          >
            <div
              class="list-item"
              v-for="(item, index) in list"
              :key="index"
              @click="CommentDetails(item.comment_id)"
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
                    <div v-if="item.support != 0">
                      <van-image
                        width="14px"
                        height="14px"
                        :src="zanIcon"
                        v-if="item.is_supported === false"
                      ></van-image>
                      <van-image
                        width="16px"
                        height="16px"
                        :src="zanActIcon"
                        v-if="item.is_supported === true"
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
              <div class="delete" v-if="item.is_owner === true">
                <p></p>
                <p>
                  <span @click="Delete(item.comment_id)">删除</span>
                </p>
              </div>
              <div
                class="reply_list-item"
                v-for="(replyitem, index) in item.reply_list == null
                  ? []
                  : item.reply_list.slice(0, 2)"
                :key="index"
                @click="CommentDetails(replyitem.reply_id)"
              >
                <div class="user-newsbox">
                  <van-image
                    round
                    :src="
                      replyitem.head_img_url === null ||
                      replyitem.head_img_url === ''
                        ? headerUrl
                        : replyitem.head_img_url
                    "
                    width="32px"
                    height="32px"
                  ></van-image>
                  <div class="right">
                    <div>
                      <p v-if="replyitem.nick !== null">
                        <span v-if="replyitem.nick !== ''">{{
                          replyitem.nick
                        }}</span>
                      </p>
                      <p class="p-t">
                        {{
                          replyitem.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss")
                        }}
                      </p>
                    </div>
                    <div>
                      <div v-if="replyitem.reply_count != 0">
                        <van-image
                          width="14px"
                          height="14px"
                          :src="plIcon"
                          @click="PingLun(replyitem)"
                        ></van-image>
                        <span>{{ replyitem.reply_count }}</span>
                      </div>
                      <div v-if="replyitem.support != 0">
                        <van-image
                          width="14px"
                          height="14px"
                          :src="zanIcon"
                          v-if="replyitem.is_supported === false"
                        ></van-image>
                        <van-image
                          width="16px"
                          height="16px"
                          :src="zanActIcon"
                          v-if="replyitem.is_supported === true"
                        ></van-image>
                        <span>{{ replyitem.support }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-content">
                  <p></p>
                  <p>{{ replyitem.content }}</p>
                </div>
                <div class="delete" v-if="replyitem.is_owner === true">
                  <p></p>
                  <p>
                    <span @click="Delete(replyitem.reply_id)">删除</span>
                  </p>
                </div>
              </div>
              <div class="delete" v-if="item.reply_count > 2">
                <p></p>
                <p>
                  <span @click="CommentDetails(item.comment_id)"
                    >查看全部回复</span
                  >
                </p>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <div class="write-comments-box">
      <div class="write-comments" v-if="writeShow">
        <div class="dianzan" v-if="false">
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
          <p>{{ support }}</p>
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
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      list: [],
      plIcon: require("../../assets/iconImage/pinglun@3x.png"),
      zanIcon: require("../../assets/iconImage/dianzan@3x.png"),
      zanActIcon: require("../../assets/iconImage/dianzan_active@3x.png"),
      loading: false,
      finished: false,
      userZanIcon: require("../../assets/iconImage/ic_dianzan@3x.png"),
      userNoZanIcon: require("../../assets/iconImage/ic_dianzan2@3x.png"),
      ZanShow: true,
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      value: "",
      writeShow: true,
      huifu: "",
      publishShow: true,
      page: 1, // 当前页数
      page_size: "10", // 页面条数
      support: this.$route.query.support,
      disabledFbBtn: false,
    };
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '全部评论');
    if (this.$route.query.ZanShow === true) {
      this.ZanShow = true;
    } else {
      this.ZanShow = false;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onLoad() {
      this.loading = true;
      this.InitList();
    },
    // 评论列表
    InitList() {
      var params = {
        answer_id: this.$route.query.answer_id,
        uid: this.uid,
        page: this.page,
        page_size: this.page_size,
      };
      this.$http
        .post(
          `/appserver/v1/quesAnswer/getListResponses`,
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
          this.loading = false;
          if (data.data.ret == 0) {
            if (data.data.data !== null) {
              // 异步更新数据
              setTimeout(() => {
                var rows = data.data.data.list;
                this.list = this.list.concat(rows);
                this.page = this.page + 1;
                // 数据全部加载完成
                if (this.list.length >= data.data.data.pagination.total) {
                  this.finished = true;
                }
              }, 500);
            } else {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
        });
    },
    // 子评论发布
    PingLun() {
      // event.stopPropagation();
    },
    // 点赞
    DianZan() {
      var params = {
        id: this.$route.query.answer_id,
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
            this.ZanShow = false;
            this.support = this.support + 1;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 取消点赞
    NoDianZan() {
      var params = {
        id: this.$route.query.answer_id,
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
            this.ZanShow = true;
            this.support = this.support - 1;
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 发布按钮
    Publish() {
      this.disabledFbBtn = true;
      //eslint-disable-next-line
      console.log("Publish()");
      var params = {
        to_reply_id: this.$route.query.answer_id,
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
            this.page = 1;
            this.list = [];
            this.loading = true;
            this.finished = false;
            this.$toast("评论成功");
            this.InitList();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    Delete(id) {
      event.stopPropagation();
      var params = {
        id: id,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/commentDelete`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret == 0) {
            this.page = 1;
            this.list = [];
            this.loading = true;
            this.finished = false;
            this.$toast("删除成功");
            this.InitList();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 评论详情
    CommentDetails(comment_id) {
      this.$router.push({
        path: "/CommentsDetails",
        query: {
          comment_id: comment_id,
        },
      });
      // window.wii.app.invoke("openWindow", {
      //   openUrl: `${this.domain}CommentsDetails&comment_id=${item.comment_id}`,
      //   isFullScreen: 0,
      //   setTitle: "评论详情",
      //   needLoading: 1
      // });
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
        window.setTimeout("scrollBottom()", 500);
      }
    },
    scrollBottom() {
      window.scrollTo(0, document.getElementsByTagName("body").height());
    },
    // 回复判断发布按钮是否可以触发
    ReplyInput() {
      //eslint-disable-next-line
      console.log("ReplyInput");
      if (this.huifu === "") {
        this.publishShow = true;
        this.writeShow = true;
        // document.getElementById("myInput").blur();
      } else {
        this.publishShow = false;
      }
    },
    ReplyBlur() {
      //eslint-disable-next-line
      console.log("ReplyBlur");
      if (this.huifu === "") {
        this.publishShow = true;
        this.writeShow = true;
      } else {
        this.publishShow = false;
      }
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
.van-nav-bar__left {
  left: 14px;
}
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
    margin-bottom: 68px;
    padding-top: 46px;
    .pl-box {
      padding-bottom: 70px;
      .list {
        padding: 0 20px;
        .list-item {
          margin-top: 34px;
          &:nth-of-type(1) {
            margin-top: 22px;
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
                font-size: 15px;
                font-family: PingFangSC-Light, PingFang SC;
                font-weight: 300;
                color: rgba(55, 56, 77, 1);
                line-height: 24px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 5; // 控制多行的行数
                -webkit-box-orient: vertical;
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
            }
          }
          .reply_list-item {
            margin-top: 10px;
            margin-left: 32px;
            &:nth-of-type(1) {
              margin-top: 22px;
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
                  font-size: 15px;
                  font-family: PingFangSC-Light, PingFang SC;
                  font-weight: 300;
                  color: rgba(55, 56, 77, 1);
                  line-height: 24px;

                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2; // 控制多行的行数
                  -webkit-box-orient: vertical;
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
              }
            }
          }
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
      // justify-content: space-between;
      justify-content: space-around;
      align-items: center;
      .dianzan {
        visibility: hidden;
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
