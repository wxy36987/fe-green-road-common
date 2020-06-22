<template>
  <!-- 游记详情 -->
  <div class="travel_detal">
    <div>
      <openAppDialog
        :isShow="isShareWeb"
        ref="openApp"
        :title="openTitle"
        :shareId="shareId"
        :shareType="shareType"
        @openApp="openApp()"
      ></openAppDialog>
    </div>
    <div
      class="bannar"
      v-bind:style="{
        backgroundImage: 'url(' + coverImage + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    ></div>

    <div class="travleView">
      <!-- 标题 -->
      <div class="titleView">
        <p>{{ travelName }}</p>
        <div class="tagView">
          <div class="tagItem" v-show="tagName.length > 0">{{ tagName }}</div>
          <div class="tagItem" v-show="tagTypeName.lenght > 0">
            {{ tagTypeName }}
          </div>
        </div>
        <div class="authorView">
          <img :src="authorHeader" alt="" id="authorHeader" />
          <div class="authorName">{{ authorName }}</div>
          <div class="time">{{ updateTime }}</div>
          <p class="watchNum">{{ watchNumber }}</p>
          <img :src="watchIconImg" alt="" id="watchIcon" />
        </div>
        <div class="topicView">
          <div>来自话题：#{{ topicName }}</div>
        </div>
      </div>
      <div class="line"></div>
      <!-- 正文 -->
      <div class="contentView">
        <div v-html="content" id="travelContentView"></div>
        <div class="endView">—— THE END ——</div>
      </div>
      <div class="partition"></div>
      <!-- 用户评论 -->
      <div class="listView">
        <div class="listTitle">
          <p>用户评论</p>
        </div>
        <ul class="list">
          <li class="listItem" v-for="(item, index) in list" :key="index">
            <img :src="item.userInfo.head_img_url" alt="" class="userHeader" />
            <div class="userName">{{ item.userInfo.nick }}</div>
            <div class="commentView">{{ item.content }}</div>
            <div class="commentImageView" v-if="item.image != null">
              <img
                :src="obj"
                alt=""
                class="commentImage"
                v-for="(obj, index) in item.image"
                :key="index"
              />
            </div>
            <div class="commentTime">
              {{ item.comment_time | dateFrm("YYYY-MM-DD HH:mm") }}
            </div>
            <div class="likeNum">{{ item.up }}</div>
            <img :src="likeImage" alt="" class="likeImg" />
            <div class="commentNum">{{ item.reply_count }}</div>
            <img :src="commentImage" alt="" class="commentImg" />
          </li>
        </ul>
      </div>
    </div>
    <div>
      <empty
        ref="emptyView"
        :toastTitle="toastTitle"
        :emptyShow="emptyShow"
      ></empty>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import openAppDialog from "@/components/openAppTopDialog.vue";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      travelName: "", //游记名称
      coverImage: "", //封面图
      list: [], //评论列表
      authorName: "",
      authorHeader: "",
      updateTime: "", //发布时间
      topicName: "", //话题名称
      watchNumber: "", //浏览量
      content: "", //正文
      commentNum: "", //评论数量
      tagName: "",
      tagTypeName: "",
      watchIconImg: require("../../assets/iconImage/ic-liulan.png"),
      commentImage: require("../../assets/iconImage/ic_talk.png"),
      likeImage: require("../../assets/iconImage/ic_like(1).png"),
      id: "",
      openTitle: "打开天府绿道APP<br/>分享游记,参与互动",
      isShareWeb: this.$route.query.isShareWeb,
      shareId: this.$route.query.id,
      shareType: "travel",
      toastTitle: "糟糕,数据找不到了",
      emptyShow: false,
    };
  },
  methods: {
    getDetail() {
      var params = { id: this.$route.query.id };
      this.$http
        .post("/appserver/v1/travels/detailed", qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            var response = data.data.data;
            if (response.online_status !== 1) {
              this.emptyShow = true;
              return;
            }
            this.travelName = response.name;
            this.coverImage = response.img;
            this.list = response.list;
            this.authorName = response.userInfo.nick;
            this.authorHeader = response.userInfo.head_img_url;
            this.updateTime = response.time;
            this.topicName = response.typeName;
            this.watchNumber = response.look;
            this.content = response.context;
            this.commentNum = response.comment_num;
            if (response.travelsRecommend.scenicName != null) {
              this.tagName = response.travelsRecommend.scenicName;
            }
            if (response.travelsRecommend.typeName != null) {
              this.tagTypeName = response.travelsRecommend.typeName;
            }
          } else {
            if (String(this.isShareWeb) == "true") {
              this.emptyShow = true;
            }
          }
        });
    },
    getID(key) {
      var url = location.href;
      var theParam = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theParam[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theParam[key];
    },
    openApp() {
      //打开APP,跳转到APP
      //eslint-disable-next-line
      console.log("openApp()");
    },
  },
  created() {
    this.getDetail();
  },
  updated() {
    var el = document.getElementById("contentView");
    var imgs = el.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
      // imgs[i].style.width = "100%";
      // imgs[i].style.height = 'auto';
    }
  },
  // props:{
  //     content:String
  // }
  components: {
    openAppDialog,
    empty,
  },
};
</script>

<style lang="scss">
#travelContentView {
  width: 100%;
  img {
    margin-top: 10px;
    width: 100% !important;
    height: auto !important;
  }
  p {
    font-size: 15px;
    line-height: 20px;
  }
  span {
    font-size: 15px;
    line-height: 20px;
    margin: 20px 0px;
  }
}
</style>

<style lang="scss" scoped>
.travel_detal {
  width: 100%;
  overflow-x: hidden;
}
.bannar {
  width: 100%;
  height: 210px;
  text-align: center;
  background-position: center;
}
.travleView {
  // margin: 0px 20px;
  padding: 0px 20px;
  font-size: 15px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(85, 89, 89, 1);
  line-height: 14px;
  width: 100%;
  box-sizing: border-box;
}
.titleView {
  margin-top: 38px;
  font-size: 26px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(55, 56, 77, 1);
  line-height: 150%;
  width: 100%;
  box-sizing: border-box;
}

.contentView {
  width: 100%;
  margin-top: 20px;
  img {
    width: 100%;
    height: auto;
  }
}
.tagItem {
  display: inline-flex;
  background: #f6f5f8;
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 89, 89, 1);
  line-height: 11px;
  padding: 8px;
  border-radius: 2px;
  margin-right: 8px;
}
.authorView {
  margin: 15px 0px;
  position: relative;
  height: 32px;
  /* display: inline-flexbox; */
}
#authorHeader {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: yellowgreen;
  left: 0px;
}
.authorName {
  position: relative;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(55, 56, 77, 1);
  line-height: 14px;
  top: -40px;
  left: 40px;
}
.time {
  position: relative;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 12px;
  top: -35px;
  left: 40px;
}
.watchNum {
  position: relative;
  float: right;
  right: 0px;
  top: -63px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 12px;
}
#watchIcon {
  position: relative;
  float: right;
  margin-right: 7px;
  top: -65px;
}
.topicView {
  background: #f6f6f6;
  margin: 10px 0px;
  padding-left: 18px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(85, 89, 89, 1);
  height: 50px;
  justify-content: center;
  position: relative;
}
.topicView div {
  text-align: left;
}
.content {
  font-size: 15px;
  font-family: PingFangSC-Light, PingFang SC;
  font-weight: 300;
  color: rgba(85, 89, 89, 1);
  line-height: 150%;
  width: 100%;
}
.content >>> img,
video {
  width: 100%;
}
.content >>> video {
  width: 100%;
}
.endView {
  font-size: 11px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
  text-align: center;
  margin-top: 10px;
}
.listTitle {
  font-size: 20px;
  font-family: PingFangTC-Medium, PingFangTC;
  font-weight: 500;
  color: rgba(55, 56, 77, 1);
  line-height: 20px;
  // margin: 10px 0px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.list {
  margin-top: 20px;
  list-style: none;
  padding-left: 0px;
  // padding-right: 20px;
}
.listItem {
  /* position: relative; */
  margin-top: 10px;
  margin-bottom: 10px;
  display: inline-flexbox;
  // padding-right: 10px;
  .commentImageView {
    position: relative;
    left: 40px;
    margin-bottom: 10px;
  }
  .commentImage {
    width: 96px;
    height: 96px;
    margin: 2px;
  }

  .likeNum {
    position: relative;
    float: right;
    right: 0px;
    bottom: 18px;
    font-size: 12px;
  }
  .likeImg {
    position: relative;
    float: right;
    margin-right: 5px;
    bottom: 20px;
  }
  .commentNum {
    position: relative;
    float: right;
    margin-right: 10px;
    bottom: 18px;
    font-size: 12px;
  }
  .commentImg {
    position: relative;
    float: right;
    margin-right: 5px;
    bottom: 20px;
  }
}
.userHeader {
  position: relative;
  width: 32px;
  height: 32px;
  top: 0px;
  left: 0px;
}
.userName {
  position: relative;
  top: -24px;
  left: 40px;
}
.commentView {
  position: relative;
  left: 40px;
  top: -10px;
  line-height: 150%;
}
.commentTime {
  position: relative;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  left: 40px;
  top: -5px;
}
.line {
  background: #eeeeee;
  height: 1px;
  margin-top: 15px;
}
.partition {
  background: #f8f8f8;
  height: 5px;
  margin-top: 15px;
  margin-right: -20px;
  margin-left: -20px;
}
</style>
