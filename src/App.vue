<template>
  <div id="app">
    <router-view> </router-view>
    <loading
      id="apploading"
      v-show="isShowLoading"
      :style="{ paddingBottom: paddingTopValue }"
    ></loading>
    <!-- <span>骨架屏</span> -->
  </div>
</template>

<script>
/* eslint-disable */
import Loading from "@/components/loading";
export default {
  components: {
    Loading,
  },
  data() {
    return {
      isShowLoading: false,
      paddingTopValue: "0px",
    };
  },

  created() {},
  watch: {
    $route: function(to, from) {
      if (this.isIOSDev()) {
        return;
      }
      if (to.name === "activityEvent") {
        this.paddingTopValue = "46px";
        this.isShowLoading = true;
        // this.showLoadingInAppVue(true);
      } else if (
        to.name === "strategyDetails" ||
        to.name === "lineDetails" ||
        to.name === "scenicLineDetails"
      ) {
        //没有调用原生titlebar就加top距离
        this.paddingTopValue = "0px";
        this.isShowLoading = true;
        // this.showLoadingInAppVue(true);
      } else {
        this.paddingTopValue = "0px";
        this.isShowLoading = false;
        // this.showLoadingInAppVue(false);
      }
    },
  },
  updated() {
    this.$nextTick(() => {
      //  this.isShowLoading = false;
    });
  },
};
</script>
<style></style>
