<template>
  <div
    class="list"
    v-if="arraydata.length > 0"
    :style="isVertical ? 'block' : 'inline-block'"
  >
    <div
      class="list-item"
      v-for="(item, index) in arraydata"
      :key="index"
      @click="itemClick(item)"
    >
      <van-image :src="item.cover_img"></van-image>
      <div class="describe">
        <h6>{{ item.name }}</h6>
        <p>
          <span v-for="(x, i) in item.tags" :key="i">{{ x }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
//自定义listview，左图右文
export default {
  name: "customlistview",
  props: {
    arraydata: {
      type: Array,
      default: () => [],
    },
    propF: {},
    isVertical: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    itemClick(item) {
      this.$emit("itemClick", item);
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.list {
  .list-item {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
    /deep/ .van-image {
      margin-right: 15px;
      width: 40vw;
      height: 25vw;
    }
    /deep/.van-image img{
      object-fit: cover;
      border-radius: 2px;
    }
    .describe {
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      // width: 160px;
      width: 40vw;
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
</style>
