<template>
  <div class="strategy-list">
    <div class="title" ref="headbarstrategylist">
      <van-nav-bar title="攻略">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="search">
        <van-search
          placeholder="搜索想要的攻略"
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
        <customListView :arraydata="list" @itemClick="StrategyDetails" />
      </van-list>
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
import customListView from "@/components/customListView.vue";
import empty from "@/components/empty.vue";
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
      totalSize: 0,
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  components: {
    customListView,
    empty,
  },
  created() {
    this.getStrategyList();
    window.scrollTo(0, 0);
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
        this.getStrategyList();
        this.loading = false;
      }, 500);
    },
    getStrategyList() {
      //获取攻略列表
      this.$http
        .get(
          `/appserver/v1/manage/strategy/list?type=${
            this.$route.query.type
          }&scenic_id=${this.$route.query.id}&p=${this.p}&pn=${this.pn}`
        )
        .then((data) => {
          var _data = data.data.data;
          this.totalSize = _data.pagination.total;
          if (_data.list.length === 0 || this.list.length == this.totalSize) {
            this.p--;
            this.finished = true;
          } else {
            if (this.list.length === 0) {
              this.list = _data.list;
              setTimeout(() => {
                this.finishedText = "";
              }, 2000);
            } else {
              // for (var i in _data.list) {
              // this.list.push(_data.list[i]);
              this.list = this.list.concat(_data.list);
              // }
            }
          }
          if (this.list.length === this.totalSize) {
            this.finished = true;
            this.p--;
            setTimeout(() => {
              this.finishedText = "";
            }, 2000);
          }
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbarstrategylist.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 攻略详情
    StrategyDetails(item) {
      this.$router.push({
        path: "/strategyDetails",
        query: {
          id: item.id,
        },
      });
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
.van-nav-bar__left {
  left: 14px;
}
.strategy-list {
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
