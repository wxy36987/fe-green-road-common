<template>
  <div class="all-scenic">
    <!-- <div class="title">
      <van-nav-bar title="景点">
        <van-icon
          name="arrow-left"
          slot="left"
          @click="Back()"
        />
      </van-nav-bar>
    </div> -->
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="finishedText"
      @load="onLoad"
    >
      <div class="content">
        <ul>
          <li
            v-for="(item, index) in dataList"
            :key="index"
            @click="ScenicDetails(item)"
          >
            <div class="list">
              <van-image
                width="160px"
                height="100px"
                :src="item.cover_img"
              ></van-image>
              <div class="text">
                <h6>{{ item.name }}</h6>
                <p>{{ item.subtitle }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      loading: false,
      finished: false,
      p: 1,
      pn: "10",
      finishedText: "",
    };
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
      this.$http
        .get(
          `/appserver/v1/manage/scenic/list?type=2&scenic_id=${
            this.$route.query.id
          }&p=${this.p}&pn=${this.pn}`
        ) // 获取详情数据
        .then((data) => {
          var _data = data.data.data;
          if (_data.list !== null) {
            if (_data.list.length === 0) {
              this.finished = true;
              this.finishedText = "没有更多数据了";
            } else {
              if (this.dataList.length === 0) {
                this.dataList = _data.list;
              } else {
                for (var i in _data.list) {
                  this.dataList.push(_data.list[i]);
                }
              }
            }
          } else {
            this.finished = true;
            this.finishedText = "暂无数据";
          }
        });
    },
    // 景点详情
    ScenicDetails(item) {
      this.$router.push({
        path: "/scenicDetails",
        query: {
          id: item.scenic_id,
          // cover_img: item.cover_img
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.all-scenic {
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
    margin-top: 6px;
    ul {
      li {
        margin-top: 21px;
        .list {
          display: flex;
          justify-content: flex-start;
          /deep/ .van-image__img {
            border-radius: 2px;
          }
          .text {
            margin-left: 15px;
            width: 160px;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            & > h6 {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              font-size: 15px;
              font-family: PingFangTC-Medium, PingFangTC;
              font-weight: 600;
              color: rgba(85, 89, 89, 1);
              line-height: 15px;
            }
            & > p {
              width: 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              margin-top: 10px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFangSC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
