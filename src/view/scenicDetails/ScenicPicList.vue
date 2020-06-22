<template>
  <div class="scenic-list">
    <div class="content">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="onLoad"
      >
        <div class="list">
          <div
            class="list-item"
            v-for="(item, index) in allListData"
            :key="index"
          >
            <div class="images" @click="BigPictureLook(item, index)">
              <van-image :src="item.src_origin"></van-image>
              <img
                :src="playIcon"
                class="play-icon-style"
                v-if="item.cover_img"
              />
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 评论图片放大 -->
    <div>
      <displayimage
        ref="displayimage"
        @isShowWatch="showWatch"
        @onItemClick="onItemClick"
      ></displayimage>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import displayimage from "@/components/displayImage.vue";
export default {
  data() {
    return {
      listData: [], //全部图片
      video_list: [], //全部视频
      allListData: [],
      title: "全部视频图片",
      loading: false,
      playIcon: require("../../assets/iconImage/icon_bofang_da@2x.png"),
      scenic_id: "",
      finished: false,
      finishedText: "",
    };
  },
  created() {
    window.scrollTo(0, 0);
    window.wii.app.invoke("setTitle", this.title);
    this.scenic_id = this.$route.query.scenic_id
      ? this.$route.query.scenic_id
      : sessionStorage.getItem("saveScenicId");
  },
  components: {
    displayimage,
  },
  mounted() {
    this.getData();
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", this.title);
    };
  },
  methods: {
    // 返回上一页
    Back() {
      this.$router.go(-1);
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {}, 500);
    },
    getData() {
      /* eslint-disable */
      this.loading = true;
      var params = {
        scenic_id: this.scenic_id, // "5e844fafc33c2a5af5505ec2", //this.scenic_id,
        type: "3",
      };
      // sessionStorage.removeItem("saveScenicId");
      this.$http
        .post(`/appserver/v1/manage/image/list`, qs.stringify(params))
        .then((data) => {
          this.loading = false;
          if (data.data.ret == 0) {
            if (data.data.data.list) {
              this.listData = data.data.data.list;
              this.video_list = data.data.data.video_list;
              this.allListData = this.allListData.concat(this.listData);
              for (var item of this.video_list) {
                item.src_origin = item.cover_img;
                this.allListData.unshift(item);
              }
              this.finished = true;
              this.finishedText = "没有更多数据了"; //"没有更多数据了";
            } else {
              this.$toast(data.data.msg);
            }
          } else {
            this.$toast(data.data.msg);
          }
        });
    },
    // 图片点击放大
    BigPictureLook(item, index) {
      var imageArray = [];
      for (var video of this.video_list) {
        var item = { url: "", isvideo: true };
        item.url = video.cover_img;
        item.isvideo = true;
        imageArray.push(item);
      }
      for (var i of this.listData) {
        imageArray.push(i.src_origin);
      }
      // if (this.video_list.length > 0) {
      //   if (this.video_list.length > index) {
      //     //视频播放
      //     console.log("scenic_id: " + this.scenic_id);
      //     sessionStorage.setItem("saveScenicId", this.scenic_id);
      //     this.$router.push({
      //       path: "/videoPlayPage",
      //       query: {
      //         data: item,
      //         from: "web",
      //       },
      //     });
      //   } else {
      //     index = index - this.video_list.length;
      //     this.$refs.displayimage.showBigPictureLook(imageArray, index);
      //   }
      // } else {
      //   this.$refs.displayimage.showBigPictureLook(imageArray, index);
      // }
      this.$refs.displayimage.showBigPictureLook(imageArray, index);
    },
    showWatch(isShow) {
      if (isShow) {
        window.wii.app.invoke("showNativeBar", false);
      } else {
        window.wii.app.invoke("showNativeBar", true);
      }
    },
    onItemClick(index) {
      if (this.video_list.length > index) {
        sessionStorage.setItem("saveScenicId", this.scenic_id);
        this.$router.push({
          path: "/videoPlayPage",
          query: {
            data: this.allListData[index],
            from: "web",
          },
        });
      }
    },
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
    padding: 0 0px;
    .list {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding-left: 1vw;
      .list-item {
        width: 32vw;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-right: 1vw;
        margin-top: 1vw;
        .images {
          width: 100%;
          height: 32vw;
          position: relative;
          /deep/ .van-image {
            width: 100%;
            height: 100%;
          }
          /deep/ .van-image__img {
            border-radius: 3px;
          }
          .play-icon-style {
            position: absolute;
            flex-wrap: wrap;
            left: 50%;
            top: 50%;
            width: 50px;
            height: 50px;
            z-index: 100;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>
