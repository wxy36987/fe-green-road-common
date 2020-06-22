<template>
  <div class="set-name">
    <div class="title">
      <van-nav-bar title="设置名字">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
        <van-icon name="ellipsis" slot="right" />
      </van-nav-bar>
    </div>
    <div class="content">
      <div>
        <van-cell-group>
          <van-field
            v-model="value"
            placeholder="请输入新的用户名"
            ref="inputs"
          />
        </van-cell-group>
        <van-icon name="clear" @click="Clear()" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "詹一美"
    };
  },
  created() {
    this.changfouce();
  },
  methods: {
    // input聚焦
    changfouce() {
      this.$nextTick(x => {
        // 正确写法
        // eslint-disable-next-line
        console.log("x" + x);
        this.$refs.inputs.focus();
      });
    },
    // 清空input文字
    Clear() {
      this.value = "";
      this.changfouce();
    },
    // 返回上一页
    Back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.set-name {
  .title {
    /deep/ .van-nav-bar .van-icon {
      color: #000;
      font-weight: 700;
      font-size: 20px;
    }
    /deep/ .van-nav-bar__title {
      font-size: 18px;
      font-weight: 600;
      color: #2c2c2c;
    }
  }
  .content {
    padding: 0 25px;
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      /deep/ .van-cell {
        padding: 35px 0px 25px 0px;
        color: #4a4a4a;
        font-size: 18px;
      }
      /deep/ .van-icon {
        color: #d8d8d8;
        font-size: 14px;
      }
      /deep/ [class*="van-hairline"]::after {
        border: 0px;
      }
    }
  }
}
</style>
