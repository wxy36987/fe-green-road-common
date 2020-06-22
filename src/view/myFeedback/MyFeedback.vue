<template>
  <div class="my-feedback">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      v-if="noList"
    >
      <div class="list">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="right">
            <div class="time">
              {{ item.addTime | dateFrm("YYYY-MM-DD HH:mm:ss") }}
            </div>
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
    <div class="no-list" v-if="!noList">
      <div>
        <van-image :src="noListIcon" width="200px" height="200px"></van-image>
        <p>没有任何内容，快去反馈问题吧!</p>
      </div>
    </div>
    <div>
      <displayimage ref="displayimage" @isShowWatch="showWatch"></displayimage>
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
      loading: false, // 加载动画
      finished: false,
      list: [],
      pageNum: 0,
      noList: true,
      noListIcon: require("../../assets/iconImage/list@2x.png"),
    };
  },
  created() {
    //设置title
    window.wii.app.invoke("setTitle", "我的反馈");
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "我的反馈");
      this.showLoading(false);
    };
  },
  methods: {
    // 图片点击放大
    BigPicture(item, index) {
      var imageArray = [];
      for (var i in item.galleryVos) {
        imageArray.push(item.galleryVos[i].imageUrl);
      }
      this.$refs.displayimage.showBigPictureLook(imageArray, index);
    },

    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1;
        this.getSuggestList();
      }, 500);
    },
    //我的反馈列表
    getSuggestList() {
      var data = {
        pageNum: this.pageNum,
        userId: this.uid,
      };
      this.$http
        .post("/appserver/v1/opinion/list", qs.stringify(data))
        .then((data) => {
          if (data.data.ret === 0) {
            if (
              data.data.data.list === null ||
              data.data.data.list.length === 0
            ) {
              this.finished = true;
              this.pageNum -= 1;
            } else {
              this.list = this.list.concat(data.data.data.list);
              if (this.list.length >= data.data.data.list.length) {
                this.finished = true;
              }
            }
            if (this.list.length === 0) {
              this.noList = false;
            } else {
              this.noList = true;
            }
          }
          this.loading = false;
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
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
.my-feedback {
  .list {
    .list-no {
      width: 100%;
      height: 260px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      p {
        font-size: 12px;
        font-family: PingFangSC-Light, PingFangSC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
        line-height: 12px;
      }
    }
    .list-item {
      padding: 20px;
      display: flex;
      justify-content: flex-start;
      border-bottom: 1px solid #eeeeee;
      .right {
        width: 100%;
        font-family: PingFangSC-Medium, PingFangSC;
        .time {
          margin-top: 7px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 12px;
        }
        .problem {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 700;
          color: rgba(55, 56, 77, 1);
          line-height: 16px;
        }
        .feedImg {
          margin: 10px 0;
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
  .no-list {
    padding-top: 68px;
    display: flex;
    justify-content: center;
    & > div {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      & > p {
        width: 100%;
        text-align: center;
        margin-top: 19px;
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(155, 155, 155, 1);
      }
    }
  }
}
</style>
