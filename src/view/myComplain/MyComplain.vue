<template>
  <div class="mycomplain-list">
    <div class="header">
      <van-nav-bar title="我的投诉" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content" v-if="!loadings || !ListShow">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <div
          class="list-item"
          v-for="(item, index) in list"
          :data-type="0"
          :key="index"
          @click="skip(item)"
        >
          <van-swipe-cell>
            <div class="list-box"></div>
            <div class="list-content">
              <div class="wrap">
                <div class="top">
                  <div class="name">投诉对象：{{ item.respondent }}</div>
                  <div class="status" v-if="item.state == '0'">
                    受理中
                    <van-icon name="arrow" slot="right" />
                  </div>
                  <div class="status" v-if="item.state == '1'">
                    受理中
                    <van-icon name="arrow" slot="right" />
                  </div>
                  <div class="status" v-if="item.state == '2'">
                    已处理
                    <van-icon name="arrow" slot="right" />
                  </div>
                  <div class="status" v-if="item.state == '3'">
                    已撤销
                    <van-icon name="arrow" slot="right" />
                  </div>
                  <div class="status" v-if="item.state == '4'">
                    未通过
                    <van-icon name="arrow" slot="right" />
                  </div>
                </div>
                <div class="bottom">
                  <div class="text">投诉原因：{{ item.complaintReson }}</div>
                  <div class="time">
                    {{ item.complaintTime }}
                  </div>
                </div>
              </div>
            </div>
            <template slot="right">
              <van-button
                square
                type="danger"
                text="删除"
                @click="deleteItem(item.id, index)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-list>
    </div>
    <div class="noList" v-if="ListShow">
      <van-image :src="noList" width="200px" height="200px"></van-image>
      <p>您目前还没有投诉信息</p>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
export default {
  data() {
    return {
      loadings: true,
      value: null,
      list: [],
      loading: false,
      finishedText: "没有更多了",
      finished: false,
      pageNum: 0,
      pageSize: "10",
      ListShow: false,
      deleteShow: false,
      noList: require("../../assets/iconImage/h_mao@2x.png"),
      deleteId: "",
    };
  },
  components: {
    // Loading
  },
  created() {
    // th   window.wii.app.invoke("showNativeBar", false);is.uid = '5e04955ec0e5690043166299';
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '我的投诉');
  },
  mounted() {
    // this.onLoad();
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
  },
  methods: {
    onClickLeft() {
      window.wii.app.invoke("closeWindow");
    },
    //动态修改样式
    changeFixed(clientHeight) {
      this.$refs.comPage.style.height = clientHeight + "px";
    },
    //跳转
    skip(item) {
      // if (item.state == 4) {
      //   return false;关闭
      // } else {

      this.$router.push({
        path: "/myComplainDetails",
        query: {
          itemData: item,
          from: "web",
          // id: item.id
        },
      });
      // }
    },
    //删除
    deleteItem(id, index) {
      this.deleteShow = true;
      this.deleteId = id;
      this.$dialog
        .confirm({
          title: "",
          message: "您确定要删除吗？",
        })
        .then(() => {
          var data = {
            nid: id,
          };
          this.$http
            .post("/appserver/v1/complaint/deleteComplain", qs.stringify(data))
            .then((data) => {
              if (data.data.ret === 0) {
                this.$toast("删除成功");
                this.list.splice(index, 1);
              } else {
                this.$toast(data.data.msg);
              }
            })
            .catch((error) => {
              this.$toast("网络异常,检查网络再试试~~");
            });
        })
        .catch(() => {
          // eslint-disable-next-line
          console.log("取消删除");
        });
    },
    onLoad() {
      // 异步更新数据
      this.pageNum = this.pageNum + 1;
      console.log("onLoad() :" + this.pageNum);
      this.getData();
    },
    getData() {
      this.$http
        .get(
          `/appserver/v1/complaint/queryComplainMobi?uid=${this.uid}&page=${this.pageNum}&size=${this.pageSize}`
        )
        .then((data) => {
          this.loading = false;
          if (data.data.ret == 0) {
            if (data.data.data !== null) {
              if (data.data.data.pagination.total === 0 && this.pageNum === 1) {
                this.ListShow = true;
                return false;
              }
              // 异步更新数据
              setTimeout(() => {
                var rows = data.data.data.list;
                this.list = this.list.concat(rows);
                this.loadings = false;
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
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
  },
  updated() {},
};
</script>
<style lang="scss" scoped>
.mycomplain-list {
  font-size: 14px;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
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
  .content {
    background: #f8f8f8;
    padding: 20px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /deep/ .van-list {
      padding-top: 46px;
    }
    .list-item {
      margin-bottom: 20px;
      .list-content {
        background: #fff;
        padding: 16px;
        .wrap {
          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 0px 18px 0px;
            border-bottom: 1px solid#E8E8E8;
            .name {
              width: 70%;
              font-size: 14px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: rgba(55, 56, 77, 1);
              line-height: 20px;
              height: 20px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .status {
              height: 12px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(23, 131, 87, 1);
              line-height: 12px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              /deep/ .van-icon {
                margin-left: 14px;
                font-size: 16px;
              }
            }
          }
          .bottom {
            margin-top: 16px;
            .text {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(85, 89, 89, 1);
              line-height: 24px;
            }
            .time {
              margin-top: 16px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 12px;
            }
          }
        }
      }
      /deep/ .van-button {
        height: 100%;
        width: 74px;
        border: 0px;
        background: rgba(255, 114, 95, 1);
        border-radius: 0px 2px 2px 0px;
      }
      /deep/ .van-button span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .noList {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    background: #f8f8f8;
    p {
      width: 100%;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
