<template>
  <div class="wrap" v-if="showWrap" :class="showWrap ? 'fadein' : 'fadeout'">
    <p class="title">流量观看</p>
    <p class="content">本月不再提示</p>
  </div>
</template>
<script>
export default {
  name: "msgDialog",
  props: {
    showWrap: {
      type: Boolean,
      default: true,
    },
    showContent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // title: "",
    };
  },
  created() {},

  computed: {},
};
</script>
<style lang="scss" scoped>
.wrap {
  position: fixed;
  left: 50%;
  top: 30%;
  width: 30%;
  height: 40%;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  transform: translate(-50%, -30%);
  color: #fff;
  font-size: 0.1rem;
  text-align: center;
  z-index: 3000;
  .title {
    position: fixed;
    left: 50%;
    top: 40%;
    font-size: 13px;
    transform: translate(-50%, -60%);
  }
  .content {
    position: fixed;
    left: 50%;
    top: 60%;
    width: 60px;
    padding: 2px;
    font-size: 10px;
    transform: translate(-50%, -40%);
    border: 0.5px solid white;
  }
}
.fadein {
  animation: animate_in 0.5s;
}
.fadeout {
  animation: animate_out 0.5s;
  opacity: 0;
}
</style>
