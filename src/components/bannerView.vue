<template>
  <div class="strategy-wrap" v-if="dataList.length > 0">
    <div class="strategy-list">
      <swiper :options="swiperOption" class="swiper-container">
        <!-- slides -->
        <swiper-slide
          class="swiper-item"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <div class="strategy-item" @click="onItemClick(item.id)">
            <img :src="item.cover_img" />
            <div class="bg-show"></div>
            <div class="strategy-introduce">
              <div style="height:20px;width:100%"></div>
              <div>
                <p class="strategy-title">{{ item.name }}</p>
                <p class="strategy-describe" v-html="item.subtitle"></p>
                <p class="strategy-label">
                  <span v-for="(x, i) in item.tags" :key="i">{{ x }}</span>
                </p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
//画廊效果（中间大两边小）的无限轮播banner
export default {
  name: "banner-view",
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },

    propF: {},
  },
  data() {
    return {
      // 攻略列表轮播
      swiperOption: {
        slidesPerView: 1.183,
        spaceBetween: 0,
        centeredSlides: true,
      },
    };
  },
  created() {},
  methods: {
    onItemClick(id) {
      this.$emit("itemClick", id);
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.strategy-wrap {
  padding-left: 20px;
  .strategy-list {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .swiper-container {
      width: 100%;
      height: 100%;
      margin-left: -26px;
      overflow: initial;
      .swiper-slide {
        height: 187px;
        text-align: center;
        font-size: 18px;
        background: #fff;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        transition: 300ms;
        transform: scale(0.9);
        .strategy-item {
          width: 100%;
          height: 100%;
          position: relative;
          & > img {
            width: 100%;
            height: 100%;
            z-index: 100;
          }
          .bg-show {
            position: absolute;
            top: 0;
            left: 0;
            padding: 15px;
            z-index: 200;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 1) 100%
            );
          }
          .strategy-introduce {
            position: absolute;
            top: 0;
            left: 0;
            padding: 15px;
            z-index: 300;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-end;
            text-align: left;
            & > div {
              color: #fff;
              width: 100%;
              font-family: PingFangSC;
              .strategy-title {
                font-size: 18px;
                font-weight: 500;
                line-height: 18px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }
              .strategy-describe {
                margin-top: 8px;
                font-size: 13px;
                font-weight: 300;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                height: 16px;
                /deep/ p {
                  display: inline;
                }
              }
              .strategy-label {
                margin-top: 8px;
                display: flex;
                & > span {
                  display: inline-block;
                  font-weight: 400;
                  padding: 3px;
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 2px;
                  margin-right: 6px;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .swiper-slide-active,
      .swiper-slide-duplicate-active {
        transform: scale(1);
      }
    }
  }
}
</style>
