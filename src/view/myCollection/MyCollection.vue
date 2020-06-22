<template>
  <div class="my-collection">
    <div class="title">
      <van-nav-bar title="我的收藏">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
      </van-nav-bar>
    </div>
    <div class="tabs_content">
      <!--  v-if="noList" -->
      <van-tabs v-model="active">
        <van-tab
          v-for="(item, index) in dataList"
          :title="item.name"
          :key="index"
        >
          <div class="scroll">
            <div class="list">
              <div
                class="list-item"
                v-for="(x, i) in item.list"
                :key="i"
                @click="Details(x)"
              >
                <van-swipe-cell>
                  <div class="list-content">
                    <div class="images">
                      <van-image
                        :src="x.imageUrl"
                        width="160px"
                        height="100px"
                      ></van-image>
                      <!-- <p class="tags">{{ x.srcName }}</p> -->
                    </div>
                    <div class="news">
                      <p class="location-name">{{ x.title }}</p>
                      <p class="describe" v-html="x.intro"></p>
                      <p class="dateTime" v-for="(y, q) in x.labels" :key="q">
                        <span>{{ y }}</span>
                      </p>
                    </div>
                  </div>
                  <template slot="right">
                    <van-button
                      square
                      color="#F76161"
                      text="取消收藏"
                      @click="CancelCollection(x)"
                    />
                  </template>
                </van-swipe-cell>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="no-list" v-if="this.dataList.length == 0">
      <div>
        <van-image :src="noListIcon" width="200px" height="200px"></van-image>
        <p>还没有收藏任何内容，多去逛逛吧！</p>
        <div class="btn">
          <!-- <van-button>去逛逛</van-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
export default {
  data() {
    return {
      active: 0,
      dataList: [],
      srcType: "",
      noDate: false, //这是一个判断是否加载的开关
      noList: true,
      // noListIcon: require('../../assets/iconImage/collection_list.png'),
      noListContent: false,
    };
  },
  mounted() {
    this.CollectionList();
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
    // 收藏列表
    CollectionList() {
      this.$http
        .post(`/appserver/v1/collect/list`)
        .then((data) => {
          if (data.data.ret == 0) {
            // eslint-disable-next-line
            console.log(data.data.data);
            this.dataList = data.data.data;
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 跳转详情
    Details(item) {
      if (item.srcType === "route") {
        this.$router.push({
          path: "/lineDetails",
          query: {
            course_id: item.srcId,
          },
        });
      } else if (item.srcType === "strategy") {
        this.$router.push({
          path: "/strategyDetails",
          query: {
            id: item.srcId,
          },
        });
      }
    },
    // 取消收藏
    CancelCollection(item) {
      var params = {
        srcType: item.srcType,
        srcId: item.srcId,
      };
      this.$http
        .post(`/appserver/v1/collect/cancel`, qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            this.$toast("取消收藏成功");
            this.CollectionList();
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
.my-collection {
  .title {
    /deep/ .van-nav-bar .van-icon {
      color: #4a4a4a;
      font-size: 22px;
      font-weight: 600;
    }
    /deep/ .van-nav-bar__title {
      color: #4a4a4a;
      font-size: 16px;
      font-weight: 600;
    }
    /deep/ [class*="van-hairline"]::after {
      border: 0px;
    }
  }
  .tabs_content {
    padding: 0 20px;
    /deep/ .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: 0;
    }
    /deep/ .van-tabs__line {
      background: #188357;
    }
  }
  .scroll {
    /deep/ ._v-container[data-v-ecaca2b0] {
      top: 90px;
      left: 0;
      box-sizing: border-box;
      padding: 0 20px;
    }
    // /deep/
    //   ._v-container
    //   > ._v-content
    //   > .pull-to-refresh-layer
    //   .spinner-holder
    //   .spinner[data-v-ecaca2b0] {
    //   margin-top: 60px;
    // }
    // /deep/
    //   ._v-container
    //   > ._v-content
    //   > .loading-layer
    //   > .no-data-text[data-v-ecaca2b0] {
    //   top: 20px;
    // }
    .list {
      .list-item {
        margin-top: 21px;
        /deep/ .van-button {
          height: 100%;
        }
        .list-content {
          display: flex;
          justify-content: space-between;
          .images {
            position: relative;
            .tags {
              position: absolute;
              right: 10px;
              bottom: 10px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 2px;
              padding: 3px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFangSC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
            }
          }
          .news {
            width: 50%;
            display: flex;
            align-content: center;
            flex-wrap: wrap;
            & > p {
              margin-top: 8px;
            }
            .location-name {
              width: 100%;
              font-size: 15px;
              font-family: PingFangTC-Medium, PingFangTC;
              font-weight: 500;
              color: rgba(85, 89, 89, 1);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              margin-top: 0px;
            }
            .describe {
              width: 100%;
              height: 14px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFangSC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              // display: flex;
            }
            .dateTime {
              margin-top: 12px;
              & > span {
                display: inline-block;
                padding: 4px 7px;
                background: rgba(70, 71, 91, 0.05);
                border-radius: 2px;
                height: 11px;
                font-size: 11px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(70, 71, 91, 1);
                line-height: 11px;
              }
            }
          }
        }
      }
    }
  }
  .no-collection,
  .no-list {
    margin-top: 68px;
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
    .btn {
      width: 90%;
      margin-top: 30%;
      /deep/ .van-button {
        width: 100%;
        background: #188357;
        color: #fff;
        font-size: 15px;
        font-family: PingFangSC-Semibold, PingFangSC;
        font-weight: 600;
        line-height: 15px;
      }
    }
  }
}
</style>
