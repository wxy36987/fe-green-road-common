<template>
  <div class="mycomplain-details">
    <div class="header">
      <van-nav-bar title="投诉详情" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="content" id="content" v-if="item">
      <div class="info">
        <div class="name">投诉编号：{{ item.complaintNumber }}</div>
        <div
          class="status"
          v-if="item.state == '1' || item.state == '0'"
          v-show="showbtn"
        >
          <span>受理中</span>
        </div>
        <div class="status" v-if="item.state == '2'">
          <span>已处理</span>
        </div>
        <div class="status" v-if="item.state == '3' || !showbtn">
          <span>已撤销</span>
        </div>
        <div class="status" v-if="item.state == '4'">
          <span>未通过</span>
        </div>
      </div>
      <div class="info-detail">
        <li>
          <span class="title">投诉类别</span>
          <span class="text" v-if="item.type == '1'">商家经营</span>
          <span class="text" v-if="item.type == '2'">园区</span>
          <span class="text" v-if="item.type == '3'">其他</span>
        </li>
        <li>
          <span class="title">投诉对象</span>
          <span class="text">{{ item.respondent }}</span>
        </li>
        <li>
          <span class="title">投诉原因</span>
          <span class="text">{{ item.complaintReson }}</span>
        </li>
        <li v-if="imgArr.length == 0">
          <span class="title">投诉证据</span>
          <span class="text">暂无</span>
        </li>
        <li
          class="clainz"
          v-if="item.imgUrls !== '' && item.imgUrls !== undefined"
        >
          <span class="title">投诉证据</span>
          <div class="clainz-info">
            <p v-for="(img, index) in imgArr" :key="index">
              <van-image
                :src="img"
                @click="BigPicture(index)"
                fit="cover"
                width="80px"
                height="80px"
              />
            </p>
          </div>
        </li>
        <li>
          <span class="title">投诉人</span>
          <span class="text">{{ item.complainant }}</span>
        </li>
        <li>
          <span class="title">联系方式</span>
          <span class="text">{{ item.phone }}</span>
        </li>
        <li>
          <span class="title">投诉时间</span>
          <span class="text"> {{ item.complaintTime }}</span>
        </li>
        <van-button
          slot="button"
          size="small"
          class="cancel"
          @click="onCancel()"
          v-if="item.state == '1' || item.state == '0'"
          v-show="showbtn"
        >
          <p>撤销投诉</p>
        </van-button>
      </div>
      <div class="adivice" v-if="item.state == '2' || item.state == '4'">
        <p class="title">处理意见</p>
        <p class="adcontent">
          {{ item.remark }}
        </p>
      </div>
      <div
        class="mycomplain-evaluate"
        v-if="item.state == '2' && item.userIsComment == 0"
      >
        <div class="mycomplain-evaluate-content">
          <p>处理结果评价</p>
          <div class="complain-radio">
            <div @click="score = 1" class="complain-radio-item">
              <van-image :src="score === 1 ? ic_vsf_sel2x : ic_vsf_de" />
              <p :style="{ color: score === 1 ? '#178357' : '#000' }">
                非常满意
              </p>
            </div>
            <div @click="score = 2" class="complain-radio-item">
              <van-image :src="score === 2 ? ic_sf_sel2x : ic_sf_de2x" />
              <p :style="{ color: score === 2 ? '#178357' : '#000' }">
                &nbsp; 满意
              </p>
            </div>
            <div @click="score = 3" class="complain-radio-item">
              <van-image :src="score === 3 ? ic_nsf_sel2x : ic_nsf_de" />
              <p :style="{ color: score === 3 ? '#178357' : '#000' }">不满意</p>
            </div>
          </div>
          <van-cell-group>
            <van-field
              v-model="message"
              rows="3"
              autosize
              type="textarea"
              maxlength="50"
              placeholder="请填写您对本次投诉处理的评价(选填)"
              show-word-limit
            />
          </van-cell-group>
          <div class="footer">
            <van-button
              disabled
              class="submit"
              slot="button"
              v-if="score === 0"
              size="small"
            >
              <p>提交</p>
            </van-button>
            <van-button
              class="submit-enable"
              slot="button"
              v-if="score !== 0"
              size="small"
              :disabled="disabledFbBtn"
              @click="Submit()"
            >
              <p>提交</p>
            </van-button>
          </div>
        </div>
      </div>
      <div
        class="mycomplain-evaluate-result"
        v-if="item.state == '2' && item.userIsComment == 1"
      >
        <div class="mycomplain-evaluate-content-result" id="complain-result">
          <p>处理结果评价</p>
          <ul>
            <li v-if="item.score === '1'">
              <van-image
                :src="ic_vsf_sel"
                width="15px"
                height="15px"
              ></van-image>
              <p>
                &nbsp;
                {{
                  item.evaluation !== null && item.evaluation.length > 0
                    ? item.evaluation
                    : ""
                }}
              </p>
            </li>
            <li v-if="item.score === '2'">
              <van-image :src="ic_sf_de" width="15px" height="15px"></van-image>
              <p>
                &nbsp;
                {{
                  item.evaluation !== null && item.evaluation.length > 0
                    ? item.evaluation
                    : ""
                }}
              </p>
            </li>
            <li v-if="item.score === '3'">
              <van-image
                :src="ic_nsf_sel"
                width="15px"
                height="15px"
              ></van-image>
              <p>
                &nbsp;
                {{
                  item.evaluation !== null && item.evaluation.length > 0
                    ? item.evaluation
                    : ""
                }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <layer ref="layer"></layer>
    <!-- 评论图片放大 -->
    <div>
      <displayimage ref="displayimage"></displayimage>
    </div>
    <div class="sub-success" id="sub-success" v-show="!success">
      <div>
        <van-image :src="successIcon" width="95px" height="95px"></van-image>
        <p>提交成功，您的评价会让我们做的更好！</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Layer from "@/components/Layer";
import qs from "qs";
import displayimage from "@/components/displayImage.vue";
export default {
  data() {
    return {
      imgArr: [],
      bigShow: false, // 图片变大
      numIndex: 0, // 显示第几个
      item: this.$route.query.itemData,
      showbtn: true,
      //非常满意
      ic_vsf_de: require("../../assets/iconImage/ic_vsf_de@2x.png"),
      ic_vsf_sel: require("../../assets/iconImage/ic_vsf_sel.png"),
      ic_vsf_sel2x: require("../../assets/iconImage/ic_vsf_sel@2x.png"),
      //满意
      ic_sf_de: require("../../assets/iconImage/ic_sf_de.png"),
      ic_sf_de2x: require("../../assets/iconImage/ic_sf_de@2x.png"),
      ic_sf_sel2x: require("../../assets/iconImage/ic_sf_sel@2x.png"),
      //不满意
      ic_nsf_de: require("../../assets/iconImage/ic_nsf_de@2x.png"),
      ic_nsf_sel: require("../../assets/iconImage/ic_nsf_sel.png"),
      ic_nsf_sel2x: require("../../assets/iconImage/ic_nsf_sel@2x.png"),
      score: 0,
      success: true,
      successIcon: require("../../assets/iconImage/ic-status-success@2x.png"),
      message: "",
      disabledFbBtn: false,
    };
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '投诉详情');
  },
  mounted() {
    window.loadComplete = () => {
      window.wii.app.invoke("showNativeBar", false);
    };
    var successDialog = document.getElementById("sub-success");
    successDialog.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      },
      { passive: false }
    );
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id);
    } else {
      this.changeData();
    }
  },
  components: {
    Layer,
    displayimage,
  },
  methods: {
    onClickLeft() {
      if (this.success) {
        if (this.$route.query.from) {
          this.$router.go(-1);
        } else {
          window.wii.app.invoke("closeWindow");
        }
      } else {
        this.success = true;
      }
    },
    // 图片点击放大
    BigPicture(index) {
      this.$refs.displayimage.showBigPictureLook(this.imgArr, index);
    },
    changeData() {
      if (this.item.imgUrls !== "" || this.item.imgUrls !== undefined) {
        this.imgArr = this.item.imgUrls.split(",");
      }
    },
    onCancel() {
      let data = {
        nid: this.item.id,
      };
      this.$http
        .post("/appserver/v1/complaint/repealComplain", qs.stringify(data))
        .then((data) => {
          //撤销成功，跳转到我的投诉列表页面
          if (data.data.ret === 0) {
            this.$toast("撤销成功");
            // this.$router.go(-1);
            this.showbtn = false;
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 评价
    Submit() {
      this.disabledFbBtn = true;
      var that = this;
      this.$http
        .get(
          `/appserver/v1/complaint/comment?id=${that.item.id}&score=${that.score}&evaluation=${that.message}`
        )
        .then((data) => {
          this.disabledFbBtn = false;
          if (data.data.ret === 0) {
            this.success = false;
            this.getDetail(this.item.id);
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.disabledFbBtn = false;
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    //获取详情
    getDetail(id) {
      this.$http
        .get(
          `/appserver/v1/complaint/complainMobiDetail?id=${id}&uid=${this.uid}`
        )
        .then((data) => {
          if (data.data.ret === 0) {
            this.item = data.data.data;
            this.changeData();
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mycomplain-details {
  width: 100%;
  height: 100%;
  font-size: 14px;
  .header {
    width: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background: #fff;
    z-index: 1200;
    /deep/ .van-icon {
      color: #000;
      font-size: 20px;
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
  }
  .content {
    padding-top: 46px;
  }
  .info {
    display: flex;
    border-bottom: 10px solid #f8f8f8;
    padding: 20px;
    align-items: center;
    .status {
      flex: 1;
      display: flex;
      color: #178357;
      justify-content: flex-end;
      position: relative;
      span {
        background: #e7f2ee;
        padding: 5px;
        display: inline-block;
        padding-left: 10px;
        padding-right: 10px;
        line-height: 30px;
      }
    }
  }
  .info-detail {
    padding: 20px;
    border-bottom: 10px solid #f8f8f8;
    li {
      margin-bottom: 10px;
      display: flex;
      img {
        width: 50px;
        height: 50px;
      }
    }
    li.clainz {
      display: block;
      .clainz-info {
        display: flex;
        flex-wrap: wrap;
        /deep/ img {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          margin-right: 5px;
          border-radius: 2px;
        }
        .van-image {
          border-radius: 2px;
        }
      }
    }
    .title {
      font-size: 14px;
      display: inline-block;
      width: 80px;
      color: #999999;
    }
    .text {
      color: #555959;
      display: flex;
      flex: 1;
    }
    .cancel {
      background: #178357;
      color: #fff;
      width: 100%;
      height: 40px;
      font-size: 15px;
      border-radius: 3px;
      margin-top: 50px;
    }
  }
  .adivice {
    margin-top: 10px;
    margin-left: 10px;
    min-height: 90px;
    margin-right: 10px;
    .title {
      font-size: 15px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      margin-top: 10px;
    }
    & > p {
      width: 80px;
      color: #999999;
    }
    .adcontent {
      overflow: hidden;
      overflow-y: auto;
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
    }
  }
  .mycomplain-evaluate {
    border-top: 10px solid #f8f8f8;
    .mycomplain-evaluate-content {
      padding: 0 10px;
      & > p {
        font-size: 15px;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        margin-top: 10px;
        margin-bottom: 20px;
      }
      .complain-radio {
        display: flex;
        justify-content: space-around;
        .complain-radio-item {
          margin: auto;
          /deep/.van-image {
            width: 45px;
            height: 45px;
          }
        }
      }
      /deep/ .van-cell-group {
        margin-left: 5px;
        margin-right: 5px;
        background: rgba(249, 249, 249, 1);
        border-radius: 3px;
      }
      /deep/ .van-field--min-height .van-field__control {
        min-height: 60px;
      }
      /deep/ .van-cell {
        background: rgba(249, 249, 249, 1);
        border-radius: 3px;
        margin-top: 15px;
        margin-bottom: 10px;
      }
      .footer {
        margin-top: 10px;
        margin-bottom: 30px;
        width: 100%;
        /deep/ .van-button {
          border: 0px;
          height: 40px;
          width: 100%;
          // background: #178357;
          span {
            font-size: 15px;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
          }
        }
        .submit {
          background: #999999;
          color: #fff;
          width: 100%;
          height: 40px;
          font-size: 15px;
          border-radius: 3px;
        }
        .submit-enable {
          background: #178357;
          color: #fff;
          width: 100%;
          height: 40px;
          font-size: 15px;
          border-radius: 3px;
        }
      }
    }
  }
  .mycomplain-evaluate-result {
    .mycomplain-evaluate-content-result {
      padding: 0 10px;
      & > p {
        font-size: 15px;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        margin-top: 10px;
        margin-bottom: 20px;
      }
      ul {
        li {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 10px;
          /deep/ .van-image {
            flex-shrink: 0;
            margin-top: 1px;
          }
          & > p {
            width: 90%;
          }
        }
      }
    }
  }
}
.sub-success {
  width: 100%;
  height: 150%;
  position: absolute;
  top: 0;
  background: white;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    display: flex;
    justify-content: center;
    margin-top: 20vh;
    flex-wrap: wrap;
  }
  p {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    font-size: 12px;
    font-family: PingFangSC-Light, PingFangSC;
    font-weight: 300;
    color: rgba(153, 153, 153, 1);
    line-height: 12px;
  }
}
</style>
