<template>
  <div class="my-question">
    <div class="title" ref="headbariwant">
      <van-image
        :src="backIcon"
        width="10px"
        height="19px"
        @click="Back()"
      ></van-image>
      <div class="publish-btn">
        <van-button color="#F1F1F1" class="btn-on" v-if="fbBtnShow"
          >发布</van-button
        >
        <van-button
          v-if="!fbBtnShow"
          color="#188357"
          class="btn-yes"
          :disabled="disabledReleaseBtn"
          @click="ReleaseBtn()"
          >发布</van-button
        >
      </div>
    </div>
    <div class="wray">
      <div class="classify">
        <van-field
          v-model="value"
          placeholder="请一句话完整描述你的问题"
          @focus="TitleFocus()"
          @input="InputVal()"
          maxlength="30"
        />
      </div>
      <div class="content">
        <van-field
          v-model="content"
          rows="1"
          autosize
          type="textarea"
          :contenteditable="true"
          placeholder="请对问题补充说明，以便获得更好的回答（选填）"
          @focus="TitleFocus()"
        />
      </div>
    </div>
    <!-- 分类 -->
    <div class="classify-input">
      <div class="line-gray">
        <van-image :src="lineGrayIcon" width="100%" height="14px"></van-image>
      </div>
      <div class="classify-box">
        <div class="class-flex">
          <van-image :src="jingIcon" width="20px" height="20px"></van-image>
          <div class="class-tab-box" @click="ClassTabActive()">
            {{ classInput }}
            <span v-if="classText !== ''">{{ classText }}</span>
          </div>
        </div>
        <div class="class-tab" v-if="classTabShow">
          <span
            v-for="(item, key, index) in classTab"
            :key="index"
            @click="ClassTab(item)"
            >{{ item.name }}</span
          >
        </div>
      </div>
    </div>
    <empty
      ref="emptyView"
      :emptyShow="emptyShow"
      :style="{ top: emptyTop }"
    ></empty>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
import empty from "@/components/empty.vue";
export default {
  data() {
    return {
      backIcon: require("../../assets/iconImage/ic_back@2x.png"), // titleBar 返回icon
      fbBtnShow: true, // 发布按钮
      value: "",
      content: "",
      lineGrayIcon: require("../../assets/iconImage/line_gray@2x.png"), // 下部输入框线
      jingIcon: require("../../assets/iconImage/ic_location@2x.png"), // 输入#
      classInput: "选择问题分类",
      classText: "", // 选择的标签
      classTab: [],
      classTabShow: true,
      navigator: false,
      classID: "",
      disabledReleaseBtn: false,
      emptyShow: false,
      emptyTop: "46px",
    };
  },
  created() {
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.navigator = true;
    }

    if (isIOS) {
      this.navigator = false;
    }
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    this.Topic();
  },
  methods: {
    // 话题
    Topic() {
      this.$http
        .get(`/appserver/v1/quesAnswer/getTager?tager_type=1`)
        .then((data) => {
          this.classTab = data.data.data;
        })
        .catch((error) => {
          this.emptyTop = this.$refs.headbariwant.offsetHeight + "px";
          this.emptyShow = true;
        });
    },
    Back() {
      // window.wii.app.invoke('closeWindow');
      this.$router.go(-1);
    },
    InputVal() {
      if (this.value !== "") {
        this.fbBtnShow = false;
      } else {
        this.fbBtnShow = true;
      }
    },
    // 发布
    ReleaseBtn() {
      this.disabledReleaseBtn = true;
      let params = {
        title: this.value,
        content: this.content,
        uid: this.uid,
        topics: this.classID,
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/saveProblem`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${this.skey}`,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            this.$toast("发布成功");
            setTimeout(() => {
              window.localStorage.setItem("iwant", "iwant");
              this.disabledReleaseBtn = false;
              // window.wii.app.invoke('closeWindow');
              this.$router.go(-1);
            }, 2000);
          } else {
            this.disabledReleaseBtn = false;
            this.$toast(data.data.msg);
          }
        });
    },
    TitleFocus() {
      this.classTabShow = false;
    },
    //
    ClassTab(item) {
      this.classInput = "";
      this.classText = item.name;
      this.classID = item.id;
    },
    ClassTabActive() {
      this.classTabShow = true;
    },
  },
  components: {
    empty,
  },
};
</script>
<style lang="scss" scoped>
.my-question {
  width: 100%;
  .title {
    width: 100%;
    padding: 9px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid #eee;
    .publish-btn {
      .btn-on span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .btn-yes span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
      }
      /deep/ .van-button {
        width: 60px;
        height: 30px;
        line-height: 30px;
        border: 0px;
      }
    }
  }
  .wray {
    padding: 0 20px;
    .classify {
      margin-top: 21px;
      /deep/ .van-cell {
        padding: 0px;
        padding-bottom: 10px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(55, 56, 77, 1);
        border-bottom: 0.5px solid #eee;
      }
    }
    .content {
      margin-top: 22px;
      /deep/ .van-cell {
        padding: 0px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(55, 56, 77, 1);
      }
      /deep/ .van-field__body textarea {
        -webkit-user-select: auto;
      }
    }
  }
  .classify-input {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    box-sizing: border-box;
    .classify-box {
      .class-flex {
        display: flex;
        padding: 15px 20px;
        align-items: center;
        .class-tab-box {
          margin-left: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          & > span {
            display: inline-block;
            padding: 9px 10px;
            box-sizing: border-box;
            min-width: 75px;
            height: 30px;
            text-align: center;
            background: rgba(246, 246, 247, 1);
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(85, 89, 89, 1);
          }
        }
      }
      .class-tab {
        padding: 0 20px;
        display: flex;
        justify-content: flex-start;
        align-content: space-between;
        flex-wrap: wrap;
        padding-bottom: 130px;
        & > span {
          display: inline-block;
          min-width: 75px;
          height: 30px;
          line-height: 30px;
          margin-right: 11px;
          margin-top: 17px;
          text-align: center;
          background: rgba(246, 246, 247, 1);
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(85, 89, 89, 1);
          &:nth-child(4n) {
            margin-right: 0px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 370px) {
  .my-question .classify-input .classify-box .class-tab > span {
    min-width: 70px;
  }
}
@media screen and (max-width: 340px) {
  .my-question .classify-input .classify-box .class-tab > span {
    min-width: 65px;
  }
}
</style>
