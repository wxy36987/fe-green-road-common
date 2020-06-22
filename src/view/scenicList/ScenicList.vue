<template>
  <div class="scenic-list">
    <div class="title" ref="headbarscenlist">
      <van-nav-bar :title="title">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div class="search">
        <van-search
          placeholder="搜索目的地或景点"
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
        <div class="list">
          <div
            class="list-item"
            v-for="(item, index) in listData"
            :key="index"
            @click="ScenicCard(item)"
          >
            <div class="images">
              <van-image :src="item.cover_img"></van-image>
              <p v-if="index < 3">TOP{{ index + 1 }}</p>
            </div>
            <p>{{ item.name }}</p>
          </div>
        </div>
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
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      value: "",
      listData: [],
      title: "",
      loading: false,
      finished: false,
      finishedText: "",
      p: 1,
      pn: "10",
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  created() {
    window.scrollTo(0, 0);
  },
  mounted() {
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
        this.loading = false;
      }, 500);
    },
    getData() {
      this.title = this.$route.query.greenWayName + "景区";
      this.$http
        .get(
          `/appserver/v1/manage/scenic/list?type=1&scenic_id=${
            this.$route.query.id
          }&p=${this.p}&pn=${this.pn}`
        )
        .then((data) => {
          var _data = data.data.data;
          if (_data.list.length === 0) {
            this.finished = true;
            this.finishedText = "没有更多数据了";
          } else {
            if (this.listData.length === 0) {
              this.listData = _data.list;
            } else {
              for (var i in _data.list) {
                this.listData.push(_data.list[i]);
              }
            }
            // if (this.listData.length >= 10) {
            //   this.finishedText = "没有更多数据了"
            // } else if (this.listData.length < 10) {
            //   this.finishedText = ""
            // } else if (this.listData.length === 0) {
            //   this.finishedText = "暂无数据"
            // }
          }
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbarscenlist.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    // 景区名片
    ScenicCard(item) {
      this.$router.push({
        path: "/scenicCard",
        query: {
          id: item.scenic_id,
          // cover_img: item.cover_img
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
  components: {
    empty,
  },
};
</script>
<style lang="scss" scoped>
.scenic-list {
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
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .list-item {
        width: 47.5%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-bottom: 20px;

        .images {
          width: 100%;
          height: 92px;
          position: relative;
          /deep/ .van-image {
            width: 100%;
            height: 100%;
          }
          /deep/ .van-image__img {
            border-radius: 3px;
          }
          & > p {
            position: absolute;
            top: 8px;
            left: 8px;
            padding: 3px 6px;
            background: rgba(55, 56, 77, 0.9);
            font-size: 13px;
            font-family: DINCondensed-Bold, DINCondensed;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            line-height: 13px;
          }
        }
        & > p {
          color: #000;
          font-size: 15px;
          margin-top: 12px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
