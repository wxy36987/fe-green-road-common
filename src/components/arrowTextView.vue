<template>
  <div class="text">
    <div :class="showTotal ? 'total-introduce' : 'detailed-introduce'">
      <div class="intro-content" :title="introduce" ref="desc">
        <span class="merchant-desc" v-if="introduce">{{ introduce }}</span>
        <div class="unfold" @click="showTotalIntro" v-if="showExchangeButton">
          <p>
            {{ exchangeButton ? "展开" : "收起" }}
            <!-- <van-icon name="arrow-up" v-if="!exchangeButton" />
                <van-icon name="arrow-down" v-if="exchangeButton" />-->
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 折叠view
export default {
  name: "arrow-text-view",
  props: {
    // 是否展示所有文本内容
    showTotal: {
      type: Boolean,
      default: true,
    },
    // 显示展开还是收起
    exchangeButton: {
      type: Boolean,
      default: true,
    },
    // 是否显示展开收起按钮
    showExchangeButton: {
      type: Boolean,
      default: false,
    },
    introduce: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rem: "",
    };
  },
  created() {},
  methods: {
    // 文字展开/收起
    showTotalIntro() {
      this.showTotal = !this.showTotal;
      this.exchangeButton = !this.exchangeButton;
    },
    getRem() {
      const defaultRem = 16;
      let winWidth = window.innerWidth;
      let rem = (winWidth / 375) * defaultRem;
      return rem;
    },
  },

  computed: {},

  watch: {
    introduce: function() {
      this.$nextTick(
        function() {
          // 判断介绍是否超过三行
          let rem = parseFloat(this.getRem());
          if (!this.$refs.desc) {
            return;
          }
          let descHeight = window
            .getComputedStyle(this.$refs.desc)
            .height.replace("px", "");

          if (descHeight > 5.25 * rem) {
            // 显示展开收起按钮
            this.showExchangeButton = true;
            this.exchangeButton = true;
            // 不是显示所有
            this.showTotal = false;
          } else {
            // 不显示展开收起按钮
            this.showExchangeButton = false;
            // 没有超过三行行就显示所有
            this.showTotal = true;
          }
        }.bind(this)
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.text {
  /deep/ .van-icon {
    color: #9b9b9b;
    font-size: 14px;
    font-weight: 600;
  }
  .total-introduce {
    height: auto;
    overflow: hidden;
    font-size: 15px;
    color: #37384d;
    margin-top: 25px;
    .intro-content {
      .merchant-desc {
        width: 100%;
      }
    }
    .unfold {
      display: block;
      z-index: 11;
      float: right;
      width: 36px;
      p {
        margin: 0;
        color: #188357;
        font-size: 15px;
        display: flex;
        align-items: center;
      }
    }
  }
  .detailed-introduce {
    font-size: 15px;
    color: #37384d;
    position: relative;
    overflow: hidden;
    margin-top: 25px;
    font-family: PingFangSC-Regular, sans-serif;
    .intro-content {
      // 最大高度设为4倍的行间距
      max-height: 84px;
      word-wrap: break-word;
      /*强制打散字符*/
      word-break: break-all;
      background: #ffffff;
      /*同背景色*/
      color: #ffffff;
      .merchant-desc {
        width: 100%;
      }
      &:after,
      // 这是展开前实际显示的内容
      &:before {
        content: attr(title);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        color: #434343;
        // overflow: hidden;
      }
      // 把最后最后一行自身的上面三行遮住
      &:before {
        display: block;
        overflow: hidden;
        z-index: 1;
        max-height: 62px;
        background: #ffffff;
      }
      &:after {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        // height: 82px;
        /*截取行数*/
        -webkit-line-clamp: 4;
        text-overflow: ellipsis;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        /*行首缩进字符数，值为[(截取行数-1)*尾部留空字符数]*/
        text-indent: -12em;
        /*尾部留空字符数*/
        padding-right: 4em;
      }
      .unfold {
        z-index: 11;
        width: 36px;
        outline: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        p {
          margin: 0;
          color: #188357;
          font-size: 15px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
