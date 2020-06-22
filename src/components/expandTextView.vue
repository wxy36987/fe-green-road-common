<template>
  <div v-if="content !== null && content !== ''">
    <div class="introduce" v-if="expandFourLine">
      <div class="newslist">
        <p class="p" ref="liCon">
          <span>{{ content }}</span>
        </p>
        <div
          class="open"
          @click="openExpand(liConHeight)"
          v-if="content !== null && content !== '' && content.length > 78"
        >
          <div v-if="expandButton">【展开】</div>
          <div v-else>【收缩】</div>
        </div>
      </div>
    </div>
    <div class="newslist-ten-line" v-if="!expandFourLine">
      <p class="p" ref="liCon">
        <span>{{ content }}</span>
      </p>
      <div
        class="open"
        @click="openExpand(liConHeightTenLineHeight)"
        v-if="content !== null && content !== '' && content.length > 200"
      >
        <div v-if="expandButton">
          展开问题描述
          <van-icon name="arrow-down"></van-icon>
        </div>
        <div v-else>
          收起问题描述
          <van-icon name="arrow-up"></van-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 折叠view
export default {
  name: "expand-text-view",
  props: {
    // 显示展开还是收起
    expandButton: {
      type: Boolean,
      default: true,
    },
    content: {
      type: String,
      default: "",
    },
    expandFourLine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rem: "",
      liConHeight: 100,
      liConHeightTwoLineHeight: 56,
      liConHeightTenLineHeight: 280,
    };
  },
  created() {},
  methods: {
    openExpand(maxHeight) {
      var liCon = this.$refs.liCon;
      var height = liCon.offsetHeight;
      if (height <= maxHeight) {
        // 展开
        liCon.style.height = "auto";
        liCon.className = "snow-container";
        height = liCon.offsetHeight;
        liCon.style.height = maxHeight + "px";
        // eslint-disable-next-line
        var f = document.body.offsetHeight; // 必加
        liCon.style.height = height + "px";
      } else {
        // 收缩
        liCon.className = "p";
        liCon.style.height = maxHeight + "px";
      }
      if (this.expandButton) {
        this.expandButton = false;
      } else {
        this.expandButton = true;
      }
    },
  },

  computed: {},
};
</script>
<style lang="scss" scoped>
.introduce {
  margin-top: 14px;
  border-radius: 3px;
  padding: 20px 15px;
  background: #f8f8f8;
  .newslist {
    .p {
      font-size: 14px;
      color: #555;
      line-height: 25px;
      height: auto;
      overflow: hidden;
      transition: height 0.3s;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }
    .snow-container {
      font-size: 14px;
      color: #555;
      line-height: 25px;
      height: auto;
      overflow: hidden;
      transition: height 0.3s;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 0;
    }
    .open {
      & > div {
        text-align: right;
        color: #188357;
      }
    }
  }
}
.newslist-two-line {
  // margin-top: 15px; 超过两行省略
  .p {
    font-size: 16px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(55, 56, 77, 1);
    line-height: 28px;
    height: auto;
    overflow: hidden;
    transition: height 0.3s;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .snow-container {
    font-size: 16px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(55, 56, 77, 1);
    line-height: 28px;
    height: auto;
    overflow: hidden;
    transition: height 0.3s;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 0;
  }
  .open {
    & > div {
      margin-top: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      /deep/.van-icon {
        margin-left: 8px;
      }
    }
  }
}
.newslist-ten-line {
  // margin-top: 15px;  超过10行省略
  .p {
    font-size: 16px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(55, 56, 77, 1);
    line-height: 28px;
    height: auto;
    overflow: hidden;
    transition: height 0.3s;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
  }
  .snow-container {
    font-size: 16px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(55, 56, 77, 1);
    line-height: 28px;
    height: auto;
    overflow: hidden;
    transition: height 0.3s;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 0;
  }
  .open {
    & > div {
      margin-top: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      /deep/.van-icon {
        margin-left: 8px;
      }
    }
  }
}
</style>
