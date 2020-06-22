<template>
  <div class="strategy-details">
    <div class="header-img">
      <van-image :src="bannerImg" width="100%" height="210px"></van-image>
      <!-- <div class="collect-shadow"></div> -->
      <!-- <div class="collect">
				<van-image
					:src="collectIconN"
					width="30px"
					height="30px"
					v-if="!collectionShow"
				></van-image>
				<van-image
					:src="collectIconT"
					width="30px"
					height="30px"
					v-if="collectionShow"
				></van-image>
			</div> -->
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
      <div class="comment-box">
        <van-cell
          title="用户评价"
          is-link
          :value="CommentNum != 0 ? CommentNum + '条' : ''"
          @click="AllDiscussList()"
        />
        <div class="comment-list" v-if="CommentNum !== 0">
          <customListView :arraydata="commentList" @itemClick="Details">
          </customListView>
        </div>
      </div>
      <empty
        ref="emptyView"
        :toastTitle="toastTitle"
        :emptyShow="emptyShow"
      ></empty>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import empty from "@/components/empty.vue";
import customListView from "@/components/customListViewComment.vue";

export default {
  data() {
    return {
      show: false,
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
      message: "",
      strategyId: "",
      bannerImg: "",
      title: "", // 标题
      tags: [], // 标签
      subTitle: "", // 副标题
      subContent: "",
      // 收藏心
      collect: null,
      collectionShow: false,
      contentImg: require("../../assets/iconImage/ic_20_park.png"),
      commentList: [],
      CommentNum: 0, // 评论条数
      headImg: require("../../assets/iconImage/my_moren@3x.png"),
      publishShow: true,
      jiaIcon: require("../../assets/iconImage/ic_jia@3x.png"),
      // collectIconN: require('../../assets/iconImage/ic_collection_nor@3x.png'),
      // collectIconT: require('../../assets/iconImage/ic_collection@3x.png')
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
    };
  },
  created() {
    // window.wii.app.invoke('setTitle', '攻略详情');
    window.wii.app.invoke("showNativeBar", false);
  },
  components: {
    empty,
    customListView,
  },
  mounted() {
    this.getData();
  },
  methods: {
    //
    Back() {
      window.wii.app.invoke("closeWindow");
    },
    // 分享
    Share() {
      window.wii.app.invoke("setActionBar", {
        share: {
          isShow: true,
          title: this.title,
          summary: this.subTitle,
          pic: this.bannerImg,
          link: window.location.href,
          isMiniProgram: true,
          miniProgramId: "gh_e72fb9e614d4",
          miniProgramPath: `/subPackages/pages/scenic-card/index?type=2&id=${this.$route.query.id}&from=home&action=click`,
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
      this.$http
        .post(
          `/appserver/v1/strategy/ld_detail?strategyId=${this.$route.query.id}`
        )
        .then((data) => {
          var _data = data.data.data;
          if (_data.online_status !== 1) {
            this.emptyShow = true;
            return;
          }
          this.strategyId = _data.id;
          this.bannerImg = _data.img;
          this.title = _data.title;
          this.tags = _data.tags;
          this.subTitle = _data.subTitle; // 副标题
          this.subContent = _data.htmlContent;
          this.collect = _data.collect;
          if (this.collect === 0) {
            this.collectionShow = false;
          } else {
            this.collectionShow = true;
          }
          this.commentList = _data.commentPage.list; // 评论列表
          this.CommentNum = _data.commentPage.comment_num;
        });
    },
    MyInput() {
      window.addEventListener("resize", function() {
        if (
          document.activeElement.tagName == "INPUT" ||
          document.activeElement.tagName == "TEXTAREA"
        ) {
          window.setTimeout(function() {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      });
      if (this.message !== "") {
        this.publishShow = false;
      }
    },
    // 写评论
    Write() {
      if (this.uid) {
        this.show = true;
        this.$refs.myInput.focus();
        this.$nextTick(() => {
          document.getElementById("myInput").focus();
        });
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
    // 用户评论列表
    AllDiscussList() {
      this.$router.push({
        path: "/allDiscussList",
        query: {
          cid: this.$route.query.id,
          page_size: this.CommentNum,
          type: "travel_notes",
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}allDiscussList?cid=${this.$route.query.id}&page_size=${this.CommentNum}`,
      // 	isFullScreen: 0,
      // 	setTitle: '全部评论',
      // 	needLoading: 1
      // });
    },
    // 评论详情
    Details(item) {
      window.wii.app.invoke("openWindow", {
        openUrl: `${this.domain}discussDetails?comment_id=${item.comment_id}`,
        isFullScreen: 0,
        setTitle: "评论详情",
        needLoading: 1,
      });
    },
    // 发表
    Fb() {
      var params = {
        content: this.message,
        cid: this.$route.query.id,
        ctitle: this.title,
        type: "travel_notes",
        source_type: "app",
      };
      this.$http
        .post(`/appserver/v1/comment/addComment`, qs.stringify(params), {
          headers: {
            uid: this.uid,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("发布成功");
            this.commentList.unshift(data.data.data);
            this.CommentNum = this.CommentNum + 1;
            this.show = false;
            this.message = "";
          } else {
            this.$toast(data.data.msg);
          }
        });
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
    line-height: 42px;
    margin-top: 15px;
  }
  h2 {
    font-size: 27px;
    font-weight: bold;
    line-height: 37px;
    margin-top: 15px;
  }
  h3 {
    font-size: 19px;
    font-weight: bold;
    line-height: 29px;
    margin-top: 15px;
  }
  h4 {
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
    margin-top: 15px;
  }
  h5 {
    font-size: 13px;
    font-weight: bold;
    line-height: 23px;
    margin-top: 15px;
  }
  h6 {
    font-size: 12px;
    font-weight: bold;
    line-height: 22px;
    margin-top: 15px;
  }
  img {
    width: 100%;
    height: auto;
    margin-top: 15px;
  }
}
.icon-color {
  color: #fff;
}
</style>
<style>
.icon-color {
  color: #fff;
}
.subtitle img {
  width: 100%;
  border-radius: 2px;
  margin: 18px 0px;
  margin-left: -3px;
}

/* .subtitle div p {
  display: flex;
  word-break: break-all;
  line-height: 26px;
} */

.subtitle h1,
h2,
h3 {
  font-size: 20px;
  font-family: PingFangSC-Semibold, PingFangSC;
  font-weight: 600;
  color: rgba(55, 56, 77, 1);
  margin-bottom: 10px;
}
</style>
<style lang="scss" scoped>
.strategy-details {
  width: 100%;
  height: 100%;
  .header-img {
    width: 100%;
    height: 210px;
    position: relative;
    .title {
      position: relative;
      z-index: 500;
      top: 10px;
      /deep/ .van-nav-bar .van-icon {
        color: #fff;
        font-weight: 500;
        font-size: 24px;
      }
      /deep/ .van-nav-bar {
        background: rgba(255, 255, 255, 0);
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
    /deep/ .van-image {
      width: 100%;
      height: 210px;
      // top: -46px;
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
    margin-top: 38px;
    .content-box {
      padding: 0 20px;
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
    .comment-box {
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
    }
  }
}
</style>
