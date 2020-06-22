<template>
  <div class="question-topic">
    <div class="title" ref="headbartopic">
      <van-nav-bar
        :title="this.$route.query.name"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div class="list">
      <div
        class="answer-nolist"
        v-if="listData.length <= 0 && loading === false"
      >
        <div class>
          <van-image
            :src="problemIcon"
            width="200px"
            height="200px"
          ></van-image>
          <p>没有任何内容，快去提问吧</p>
        </div>
        <van-button color="#188357" @click="IWantQuestion()">去提问</van-button>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :offset="200"
        v-if="(listData.length > 0 && loading === false) || loading === true"
      >
        <div
          class="list-item"
          v-for="(item, index) in listData"
          :key="index"
          @click="QuestionDetails(item)"
        >
          <div class="problem-toptag">
            <van-tag
              v-if="item.question_top == 1"
              color="#edf2f0"
              text-color="#188357"
              >置顶</van-tag
            >
            <span class="problem">{{ item.question_title }}</span>
          </div>
          <!-- <p>{{ item.question_title }}</p> -->
          <p>
            {{ item.question_content }}
          </p>
          <p>
            <span>{{ item.question_attentions }}人关注</span>
            <span>{{ item.question_discuss_count }}人讨论</span>
          </p>
        </div>
      </van-list>
    </div>
    <div class="pl-btn" v-if="listData.length > 0">
      <div>
        <van-button color="#188357" @click="IWantQuestion">我要提问</van-button>
      </div>
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
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      problemIcon: require("../../assets/iconImage/tw_mao@2x.png"), // 提问
      listData: [],
      loading: true,
      finished: false,
      page: 1, // 当前页数
      page_size: "10", // 页面条数
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onLoad() {
      this.ListDataInit();
    },
    // 我要提问  去提问
    IWantQuestion() {
      this.$router.push({
        path: "/IWantQuestion",
      });
    },
    ListDataInit() {
      var params = {
        page: this.page + "",
        page_size: this.page_size,
        topic: this.$route.query.id,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/get_topic_list`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            // 异步更新数据
            setTimeout(() => {
              // this.listArr = [];
              if (data.data.data !== null) {
                var rows = data.data.data.list;
                for (var i of rows) {
                  this.listData.push(i);
                }
                // 加载状态结束
                this.loading = false;
                // 数据全部加载完成
                if (this.listData.length >= data.data.data.pagination.total) {
                  this.finished = true;
                }
                if (rows.length > 0) {
                  this.page = this.page + 1;
                }
              }
            }, 500);
          } else {
            // 加载状态结束
            this.loading = false;
          }
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbartopic.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 问答详情
    QuestionDetails(item) {
      this.$router.push({
        path: "/QuestionDetails",
        query: {
          id: item.question_id,
          from: "web",
          isShareWeb: false,
        },
      });
    },
  },
  components: {
    empty,
  },
};
</script>
<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.question-topic {
  .title {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1800;

    /deep/ .van-nav-bar {
      width: 100%;
    }
    /deep/ .van-nav-bar .van-icon {
      color: #000;
      font-size: 22px;
      font-weight: 600;
    }
    >>> .van-nav-bar .van-icon {
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
  .list {
    padding-top: 46px;
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
    .list-item {
      padding: 24px 20px;
      border-bottom: 0.5px solid #eeeeee;
      &:nth-last-child(1) {
        border: 0px;
      }
      & > p {
        // &:nth-of-type(1) {
        //   font-size: 17px;
        //   font-family: PingFangSC-Semibold, PingFang SC;
        //   font-weight: 600;
        //   color: rgba(55, 56, 77, 1);
        // }
        &:nth-of-type(1) {
          margin-top: 10px;
          font-size: 16px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          line-height: 26px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          line-clamp: 2;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 12px;
          & > span {
            margin-right: 6px;
          }
        }
      }
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
        }
      }
    }
  }
  .pl-btn {
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    & > div {
      padding: 20px;
      padding-top: 0px;
      width: 100%;
      box-sizing: border-box;
    }
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
</style>
