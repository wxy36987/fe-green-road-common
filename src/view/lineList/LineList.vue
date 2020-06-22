<template>
  <div class="line-list">
    <!-- <div class="title">
      <van-nav-bar title="线路">
        <van-icon
          name="arrow-left"
          slot="left"
          @click="Back()"
        />
      </van-nav-bar>
    </div> -->
    <div class="content">
      <div class="search">
        <van-search
          placeholder="搜索线路"
          v-model="value"
          @focus="showToast()"
        />
      </div>
      <!-- 首页绿道进入 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <div class="list">
          <div
            class="list-item"
            v-for="(item, index) in list"
            :key="index"
            @click="LineDetails(item)"
          >
            <van-image
              width="160px"
              height="100px"
              :src="item.cover_pic"
            ></van-image>
            <div class="describe">
              <h6>{{ item.name }}</h6>
              <p>
                <span v-for="(x, i) in item.tags" :key="i">{{ x }}</span>
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      value: null,
      list: [],
      loading: false,
      finishedText: "没有更多了",
      finished: false,
      type: this.$route.query.scenic_id,
      pageNum: 1,
      pageSize: "10",
    };
  },
  created() {
    window.scrollTo(0, 0);
    this.getData();
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.pageNum = this.pageNum + 1;
        this.getData();
      }, 500);
    },
    getData() {
      this.$http
        .get(
          `/appserver/v1/route/list?type=${this.type}&pageNum=${
            this.pageNum
          }&pageSize=${this.pageSize}`
        )
        .then((data) => {
          this.loading = false;
          if (data.data.ret === 0) {
            if (data.data.data.list.length === 0) {
              this.finished = true;
            } else {
              if (this.list.length === 0) {
                this.list = data.data.data.list;
                if (this.list.length <= 10) {
                  setTimeout(() => {
                    this.finishedText = "";
                  }, 2000);
                }
              } else {
                this.list = this.list.concat(data.data.data.list);
              }
            }
            if (this.list.length === data.data.data.list.length) {
              this.finished = true;
              setTimeout(() => {
                this.finishedText = "";
              }, 2000);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 线路详情
    LineDetails(item) {
      var id = item.id;
      if (this.$route.query.scenic_id === "1") {
        // 不在绿道内--绿道线路详情
        this.$router.push({
          path: "/lineDetails",
          query: {
            course_id: id,
          },
        });
      } else {
        // 在绿道内--景区线路详情
        this.$router.push({
          path: "/scenicLineDetails",
          query: {
            id: id,
          },
        });
      }
    },
    // 第2个迭代 提示
    showToast() {
      this.$toast({
        message: "敬请期待~",
        duration: "2000",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.line-list {
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
  .content {
    padding: 0 20px;
    .search {
      margin: 15px 5px 25px 5px;
      background: #f1f1f1;
      /deep/ .van-search {
        padding: 0px;
      }
      /deep/ .van-search__content {
        background: #f1f1f1;
      }
      /deep/ .van-field__control {
        color: #999;
        font-size: 14px;
      }
      /deep/ .van-icon {
        font-weight: 700;
        font-size: 20px;
      }
    }
    .list {
      .list-item {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-bottom: 20px;
        /deep/ .van-image {
          margin-right: 15px;
        }
        .describe {
          display: flex;
          align-content: center;
          flex-wrap: wrap;
          width: 160px;
          & > h6 {
            width: 100%;
            font-size: 15px;
            font-family: PingFangTC-Medium, PingFangTC;
            font-weight: 500;
            color: rgba(85, 89, 89, 1);
            line-height: 15px;
            margin-bottom: 10px;
          }
          & > p {
            span {
              background: rgba(70, 71, 91, 0.05);
              border-radius: 2px;
              display: inline-block;
              padding: 4px 7px;
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFangSC;
              font-weight: 400;
              color: rgba(70, 71, 91, 1);
              line-height: 11px;
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
}
</style>
