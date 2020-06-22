<template>
  <div class="topicDetail">
    <div
      class="bannar"
      :style="{
        backgroundImage: 'url(' + bannarImage + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }"
    >
      <div class="title">#{{ topicTitle }}</div>
      <div class="message">{{ topicMessage }}</div>
      <div class="watchNum">{{ topicWatchNum }}浏览 {{ topicNum }}游记</div>
    </div>
    <ul class="list">
      <li
        class="listItem"
        @click="gotoDetail(item.id)"
        v-for="(item, index) in list"
        :key="index"
      >
        <div
          class="imageView"
          :style="{
            backgroundImage: 'url(' + item.img + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }"
        >
          <img :src="shadowImage" alt="" class="shadow" />
          <div class="smallTopic">#{{ item.typeName }}</div>
          <div class="itemTitle">{{ item.name }}</div>
        </div>
        <div class="itemMessage">
          <img :src="item.userInfo.head_img_url" alt="" class="header" />
          <div class="name">{{ item.userInfo.nick }}</div>
          <div class="address">{{ item.scenicName }}</div>
          <div class="commentNum">{{ item.comment }}</div>
          <img :src="commentImage" alt="" class="commentImageView" />
          <div class="itemWatchNum">{{ item.look }}</div>
          <img :src="watchIconImg" alt="" class="watchImg" />
        </div>
      </li>
    </ul>
    <empty ref="emptyView" :emptyShow="emptyShow"></empty>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      watchIconImg: require("../../assets/iconImage/ic-liulan.png"),
      commentImage: require("../../assets/iconImage/ic_talk.png"),
      shadowImage: require("../../assets/iconImage/black_shadow.png"),
      topicTitle: "",
      topicMessage: "",
      topicWatchNum: "",
      topicNum: "",
      bannarImage: "",
      list: [],
      topicId: "",
      emptyShow: false,
    };
  },
  methods: {
    getData() {
      var pramas = { id: this.topicId };
      this.$http
        .post("/appserver/v1/travels/typeDetailed", qs.stringify(pramas))
        .then((data) => {
          if (data.data.ret == 0) {
            var res = data.data.data;
            this.topicTitle = res.typeName;
            this.topicMessage = res.desc;
            this.bannarImage = res.img;
            this.topicWatchNum = res.look;
            this.topicNum = res.travels;
            this.list = res.listVoList;
          }
        })
        .catch((error) => {
          this.emptyShow = true;
        });
    },
    gotoDetail(idStr) {
      this.$router.push({
        path: "travelDetail",
        query: {
          id: idStr,
          isShareWeb: true,
        },
      });
    },
  },
  created() {
    this.topicId = this.$route.query.id;
    this.getData();
  },
  components: {
    empty,
  },
};
</script>

<style lang="scss" scoped>
.topicDetail {
  width: 100%;
  height: 100%;
  display: block;
}
.bannar {
  /* position: relative; */
  width: 100%;
  height: 210px;
  background-color: rgba(24, 131, 87, 1);
  color: rgba(255, 255, 255, 1);
  display: block;
  margin-bottom: 20px;
  object-fit: cover;
}
.title {
  position: relative;
  top: 120px;
  font-size: 19px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 18px;
  left: 15px;
  text-align: left;
}
.message {
  position: relative;
  top: 130px;
  font-size: 14px;
  font-family: PingFangTC-Regular, PingFangTC;
  font-weight: 400;
  line-height: 16px;
  left: 15px;
  margin-right: 25px;
  overflow: hidden; //隐藏多余行数
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //规定显示几行，其余行数用小数点代替
  -webkit-box-orient: vertical; //规定为垂直方向排列
}
.watchNum {
  position: relative;
  top: 140px;
  font-size: 14px;
  font-family: PingFangTC-Light, PingFangTC;
  font-weight: 300;
  line-height: 13px;
  left: 15px;
}
.list {
  list-style: none;
  width: 87%;
  left: 5%;
}
.item {
  height: 265px;
}
.imageView {
  position: relative;
  width: 100%;
  height: 190px;
  border-radius: 2px;
  padding-left: 13px;
  left: 20px;
  right: 20px;
  object-fit: cover;
}
.smallTopic {
  position: relative;
  top: 134px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 12px;
}
.itemTitle {
  position: relative;
  top: 140px;
  font-size: 19px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 18px;
}
.itemMessage {
  position: relative;
  width: 100%;
  height: 60px;
  text-align: center;
  display: inline-block;
  left: 20px;
  right: 20px;
  flex: 1;
}
.header {
  position: relative;
  float: left;
  top: 14px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid rgba(243, 243, 247, 1);
}
.name {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(55, 56, 77, 1);
  line-height: 14px;
  position: relative;
  float: left;
  margin-left: 8px;
  top: 23px;
  max-width: 100px;
}
.address {
  background-color: rgba(245, 244, 247, 1);
  border-radius: 2px;
  font-size: 11px;
  line-height: 11px;
  padding: 5px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(55, 56, 77, 1);
  position: relative;
  float: left;
  margin-left: 14px;
  top: 20px;
  /* height: 20px; */
}
.commentNum {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 12px;
  position: relative;
  float: right;
  right: 0px;
  top: 24px;
}
.commentImageView {
  position: relative;
  float: right;
  margin-right: 4px;
  width: 16px;
  height: 16px;
  top: 22px;
}
.itemWatchNum {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 12px;
  position: relative;
  float: right;
  margin-right: 8px;
  top: 24px;
}
.watchImg {
  position: relative;
  float: right;
  margin-right: 4px;
  width: 16px;
  height: 16px;
  top: 22px;
}
.shadow {
  position: absolute;
  width: 100%;
  height: 171px;
  top: 19px;
  left: 0px;
}
</style>
