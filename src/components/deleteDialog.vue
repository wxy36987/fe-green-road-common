<template>
  <div class="delete-box" v-if="isDeleteShow">
    <div class="bg" @click="isDeleteShow = false">
      <div class="btn">
        <van-button @click="deleteBtn()">删除</van-button>
        <van-button @click="isDeleteShow = false">取消</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "van-del-dialog",
  props: {
    isDeleteShow: {
      type: Boolean,
      default: false,
    },
    propF: {},
  },
  data() {
    return {
      //  isDeleteShow: this.isDeleteShow
    };
  },
  created() {},
  methods: {
    deleteBtn() {
      this.$emit("deleteBtn", "");
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.delete-box {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1200;
  .bg {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1200;
    display: flex;
    align-content: flex-end;
    align-items: flex-end;
    .btn {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      /deep/ .van-button {
        width: 100%;
        height: 60px;
        background: #fff;
        border: 0px;
        &:nth-of-type(1) {
          border-bottom: 5px solid #f8f8f8;
        }
      }
      /deep/ .van-button span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>
