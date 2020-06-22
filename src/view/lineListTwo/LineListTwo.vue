<template>
  <div class="line-list">
    <div class="content">
      <div class="search">
        <van-search
          placeholder="搜索线路"
          v-model="value"
          @focus="showToast()"
        />
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <customListView :arraydata="list" @itemClick="LineDetails" />
      </van-list>
    </div>
  </div>
</template>
<script>
import customListView from "@/components/customListView.vue";
/* eslint-disable */
export default {
  data() {
    return {
      value: null,
      list: [],
      finishedText: "没有更多了",
      loading: false,
      finished: false,
      p: 1,
      pn: "10",
    };
  },
  components: {
    customListView,
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
        this.p = this.p + 1;
        this.getData();
      }, 500);
    },
    getData() {
      this.$http
        .get(
          `/appserver/v1/manage/route/list?type=${this.$route.query.type}&scenic_id=${this.$route.query.id}&p=${this.p}&pn=${this.pn}`
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
    // 攻略详情
    LineDetails(item) {
      var id = item.id;
      if (this.$route.query.type === 1) {
        // 绿道线路详情
        this.$router.push({
          path: "/lineDetails",
          query: {
            course_id: id,
          },
        });
      } else {
        // 景区线路详情
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
  }
}
</style>
