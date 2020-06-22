<!-- 加载动画 -->
<template>
  <div class="loading-background">
    <div class="loading-div">
      <img src="@/assets/images/loading.gif" alt="" srcset="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Loading",
    };
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
.loading-background {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  box-sizing: border-box;
  background: white;
  .loading-div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/ img {
      width: 162px;
      height: 67.5px;
    }
  }
}
</style>
