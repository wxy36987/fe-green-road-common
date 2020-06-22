<template>
  <div class="list" v-if="arraydata.length > 0">
    <div
      class="list-item"
      v-for="(item, index) in arraydata"
      :key="index"
      @click="itemClick(item)"
    >
      <div class="left">
        <van-image
          round
          width="32px"
          height="32px"
          :src="
            item.userInfo === null ||
            item.userInfo.head_img_url === null ||
            item.userInfo.head_img_url === ''
              ? headerUrl
              : item.userInfo.head_img_url
          "
        ></van-image>
        <div>
          <div>
            <p>
              {{
                item.userInfo === null ||
                item.userInfo.nick === null ||
                item.userInfo.nick === ""
                  ? ""
                  : item.userInfo.nick
              }}
            </p>
            <van-tag
              v-show="item.top === 1"
              color="#edf2f0"
              text-color="#188357"
              >置顶</van-tag
            >
            <!-- <span>置顶</span> -->
          </div>
          <!-- <p v-if="item.is_owner" @click="CommentDelete(item.comment_id)">
                  删除
                </p> -->
        </div>
      </div>
      <div class="right">
        <p style="width:32px;heihgt:32px;"></p>
        <div>
          <p>{{ item.content }}</p>
          <div
            class="images"
            v-if="item.image !== null && item.image.length !== 0"
          >
            <van-image
              v-for="(x, i) in item.image"
              :key="i"
              :src="x"
              width="32.5%"
              height="96px"
              fit="cover"
              @click="scaleAttrsImg(item, i)"
            ></van-image>
          </div>
          <div class="time-num">
            <!-- <p>{{ timestampToTime(item.comment_time) }}</p> -->
            <div class="time">
              <p>{{ timestampToTime(item.comment_time) }}</p>
              <p
                v-if="item.is_owner && isVisalbeDelBtn"
                @click="CommentDelete(item.comment_id, 1)"
              >
                删除
              </p>
            </div>

            <div class="num-box">
              <div>
                <van-image
                  :src="discussNum"
                  width="16px"
                  height="16px"
                ></van-image>
                {{ item.reply_count }}
              </div>
              <div>
                <van-image
                  v-if="!item.is_up"
                  :src="zanNum"
                  width="16px"
                  height="16px"
                  :disabled="isCanUp"
                  @click.stop="itemDianZan(item, item.comment_id)"
                ></van-image>
                <van-image
                  v-if="item.is_up"
                  :src="zanNumAct"
                  width="16px"
                  height="16px"
                ></van-image>
                {{ item.up }}
              </div>
            </div>
          </div>
        </div>
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
    isVisalbeDelBtn: {
      type: Boolean,
      default: false,
    },
    isCanUp: {
      type: Boolean,
      default: false,
    },

    propF: {},
  },
  data() {
    return {
      discussNum: require("../assets/iconImage/ic_talk@3x.png"),
      zanNum: require("../assets/iconImage/ic_like@3x.png"),
      zanNumAct: require("../assets/iconImage/ic_like_act@3x.png"),
      headerUrl: require("../assets/iconImage/my_moren@3x.png"),
    };
  },
  created() {},
  methods: {
    itemClick(item) {
      this.$emit("itemClick", item);
    },

    scaleAttrsImg(item, i) {
      this.$emit("bigPictureLook", item, i);
    },

    CommentDelete(id, type) {
      this.$emit("commentDelete", id, type);
    },

    itemDianZan(item, id) {
      if (id === null || id === "") {
        return;
      }
      if (this.uid) {
        //点赞需要登录验证
        this.$emit("itemDianZan", item, id);
      } else {
        window.wii.app.invoke("login", {
          callback: "",
        });
      }
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.list {
  .list-item {
    margin-bottom: 10px;
    .left {
      display: flex;
      justify-content: space-between;
      align-content: center;
      & > div {
        width: 100%;
        &:nth-of-type(2) {
          width: 87.7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          & > div {
            display: flex;
            align-items: center;
            width: 100%;
            & > p {
              max-width: 50%;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(55, 56, 77, 1);
              margin-right: 6px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            & > span {
              display: inline-block;
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(70, 71, 91, 1);
              line-height: 11px;
              padding: 4px 7px;
              background: rgba(70, 71, 91, 0.05);
              border-radius: 2px;
            }
          }
          & > p {
            width: 35px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(36, 137, 96, 1);
          }
        }
      }
    }
    .right {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      & > div {
        width: 87.8%;
        & > p {
          font-size: 15px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          line-height: 23px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }
        .images {
          margin-top: 15px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          /deep/ .van-image {
            margin-right: 3px;
            margin-bottom: 4px;
            &:nth-of-type(3n) {
              margin-right: 0px;
            }
          }
          /deep/ .van-image__img {
            border-radius: 2px;
          }
        }
        .time-num {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          //   & > p {
          //     font-size: 12px;
          //     font-family: PingFangSC-Regular, PingFang SC;
          //     font-weight: 400;
          //     color: rgba(153, 153, 153, 1);
          //     line-height: 12px;
          //   }
          .time {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > p {
              &:nth-of-type(1) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                margin-right: 15px;
              }
              &:nth-of-type(2) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(25, 131, 92, 1);
              }
            }
          }
          .num-box {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > div {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-left: 8px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 12px;
              min-width: 48px;
              /deep/ .van-image {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
