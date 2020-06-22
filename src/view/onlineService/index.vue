<template>
  <div class="online-service-page" id="apply">
    <!-- <div class="title">
      <van-nav-bar title="在线客服">
        <van-icon name="arrow-left" slot="left" @click="Back()" />
      </van-nav-bar>
    </div> -->
    <div class="chat-box" id="chat_box">
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh"
        success-text="刷新成功"
        class="refresh"
        id="chat-scoll"
      >
        <!-- <div class="chat-scoll" id='chat-scoll'> -->
        <div class="chat-block" v-for="(item, ind) in messageData" :key="ind">
          <div class="date-time" v-if="item.isSys && item.type != 400">
            <span>{{ getDateTime(item.time) }}</span>
          </div>
          <div class="date-time" v-if="item.type == 400">
            <span>{{ item.question }}</span>
          </div>
          <div
            :class="['service-box', item.isSys ? '' : 'my-box']"
            v-if="item.type != 400"
          >
            <div class="avatar">
              <img v-if="item.isSys" :src="defaultAvatar" />
              <img v-else :src="userAvatar || defaultAvatar" />
            </div>

            <div class="chat">
              <div class="block">
                <span>{{ item.answer || item.question }}</span>
                <!-- <div class="block" v-if="item.type=300"> -->
                <span
                  class="green"
                  v-for="(ite, ind) in item.list"
                  :key="ind"
                  @click="sendHandle(ite.question)"
                  >{{ `${ind + 1}、${ite.question}?` }}
                </span>
                <!-- </div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </van-pull-refresh>
    </div>

    <div :class="['chat-input-box', btnType === 0 ? '' : 'yuyin-input-box']">
      <div class="header-box">
        <div class="input-type-box">
          <img
            class="change-btn"
            @click="changeInputType"
            :src="btnType === 0 ? yuyinIcon : keyboardIcon"
          />
        </div>
        <div class="input-box">
          <input
            class="input"
            placeholder="输入任何你想问的问题..."
            v-model="inputVal"
            @focus="focusIn"
            @blur.prevent="blurIn"
          />
        </div>
        <div class="sub-box" @click="sendHandle(inputVal)">
          <span>发送</span>
        </div>
      </div>
      <div class="yuin-input" v-if="btnType === 1 || yuinShow">
        <div class="yuyin-btn">
          <span class="text"
            >{{ !yuyinTip ? "按住说话" : "松开结束" }}
            <!-- {{ yuyinTip ? ` ${yuyinLong}s` : '' }} -->
          </span>
          <div class="div-img" @touchstart="touchStart" @touchend="touchEnd">
            <img style="width:70px" :src="imgPath" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!-- <input :ref='ref' type="file" /> -->
    <div class="jiazai" v-if="LoadShow">
      <div class="">
        <van-loading type="spinner" />
        <p>正在上传...</p>
      </div>
    </div>
    <div class="jiazai" v-if="yuyinTip">
      <div class="">
        <van-loading type="spinner" />
        <p>正在录音...</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
// import Recorder from 'js-audio-recorder';
import img from "../../assets/images/online-service/ic_Voice@2x.png";
import imgTauch from "../../assets/images/online-service/ic_Voice_touch@2x.png";
import Vue from "vue";
import { PullRefresh, Toast } from "vant";
Vue.use(PullRefresh);
// var recorder = new Recorder({
// 	sampleBits: 8, // 采样位数，支持 8 或 16，默认是16
// 	sampleRate: 111025, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
// 	numChannels: 1, // 声道，支持 1 或 2， 默认是1
// 	compiling: false // 是否边录边转换，默认是false
// });
var yuyinIcon = require("../../assets/images/online-service/icon_yuyin@2x.png");
var keyboardIcon = require("../../assets/images/online-service/icon_keyboard@2x.png");
var voiceIcon = require("../../assets/images/online-service/ic_Voice@2x.png");
var touchIcon = require("../../assets/images/online-service/ic_Voice_touch@2x.png");
var defaultAvatar = require("../../assets/images/online-service/ic_photo@2x.png");
var artificial = "人工";
var isArtificial = false;
var success = false;
var isPullRefresh = false;
var souceStr = "h5";
var souceType = "2";
var welcomeType = "1";
export default {
  data() {
    return {
      LoadShow: false,
      yuinShow: false,
      yuyinIcon,
      keyboardIcon,
      voiceIcon,
      touchIcon,
      defaultAvatar,
      userId: "",
      userAvatar: require("../../assets/iconImage/my_moren@3x.png"),
      nickName: "",
      btnType: 0,
      inputVal: "",
      yuyinManager: null,
      yuyinTip: 0,
      yuyinLong: 5,
      messageData: [],
      imgPath: imgTauch,
      baseViode: "",
      count: 0,
      intervalId: null,
      showtiem: false,
      huifuNum: 0,
      isLoading: false,
      historyMsg: [],
      websock: null,
      isActivity: true,
      artificialInterval: null,
    };
  },
  components: {},
  created() {
    this.commonGetUserInfo((userInfo) => {
      this.uid = userInfo.phone;
      this.userAvatar = userInfo.avatarUrl;
    });
    window.callbackName = (params) => {
      console.log(params, 888);
    };
    window.EndRecord = (params) => {
      this.showtiem = true;
      console.log("voiceData = " + params);
      if (JSON.parse(params).ret == 0) {
        this.inputVal = JSON.parse(params).data;
      } else {
        this.$toast(JSON.parse(params).msg);
      }
      this.LoadShow = false;
    };
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      souceStr = "h5";
      souceType = "2";
      welcomeType = "1";
    } else {
      souceStr = "app";
      souceType = "3";
      welcomeType = "2";
    }
    this.getHistoryMessage();
    this.getWelcome();
    if (this.uid == null || this.uid.length == 8) {
      this.uid = Math.random()
        .toString(36)
        .slice(-8);
    }

    this.uid = this.uid + "android";
  },
  mounted() {
    document.title = "在线客服";
  },

  updated() {
    // 聊天定位到底部
    if (!isPullRefresh) {
      this.gotoBottom();
    }
  },
  destoryed() {
    isArtificial = false;
    this.websock.close();
    this.isActivity = false;
  },
  methods: {
    gotoBottom() {
      var _height = document.getElementById("chat-scoll");
      _height.scrollTop = _height.scrollHeight;
    },
    onRefresh() {
      isPullRefresh = true;
      setTimeout(() => {
        // Toast('刷新成功');
        this.getMessageData();
        this.isLoading = false;
      }, 500);
    },
    getWelcome() {
      console.log("welcontype" + welcomeType);
      var params = { clientType: welcomeType };
      this.$http
        .get("/appserver/v1/customer_server/welcome?clientType=" + welcomeType)
        .then((res) => {
          if (res.data.ret == 0) {
            this.messageData = this.messageData.concat({
              type: 200,
              question: res.data.data.welcome,
              isSys: true,
              time: Date.now(),
            });
            if (res.data.data.list != null && res.data.data.list.length > 0) {
              this.messageData = this.messageData.concat({
                type: 300,
                question: "我猜您想问",
                list: res.data.data.list,
                isSys: true,
                time: Date.now(),
              });
            }
          }
        });
    },
    getAskQuestion(o) {
      if (isArtificial == true) {
        this.messageData = this.messageData.concat({
          question: "您好，会话排队中",
          isSys: true,
          type: 400, //type == 200时，正常显示消息,type == 300时，显示多条消息，type == 400时，显示系统默认消息
          time: Date.now(),
        });
        return;
      }
      var data = this.formDataCreator({
        userId: this.uid,
        username: "user",
        platform: "other",
        source: souceType,
        sessionId: this.uid,
        ...o,
      });

      this.$http
        .post("/appserver/v1/customer_server/askQuestion", data)
        .then((res) => {
          if (res.data.ret === 0) {
            console.log(res.data);
            var response = res.data.data;
            if (response.toManual == 1) {
              this.addMessageData([
                {
                  question: "正在为您转接人工服务，请稍候！",
                  isSys: true,
                  time: Date.now(),
                  type: 400,
                },
              ]);

              this.getManualService({
                method: "start",
              });
            } else {
              if (response.isStaffOnline == 1 || response.toManual == 0) {
                //客服在线
                if (response.type == 200) {
                  this.messageData = this.messageData.concat(
                    res.data.data.info.map((v) => {
                      return {
                        ...v,
                        isSys: true,
                        type: 200,
                        time: Date.now(),
                      };
                    })
                  );
                } else if (response.type == 300) {
                  this.messageData = this.messageData.concat({
                    type: 300,
                    question: res.data.data.optionalReply,
                    list: res.data.data.info,
                    isSys: true,
                    time: Date.now(),
                  });
                }
              }
              if (response.toManual == 2) {
                this.messageData = this.messageData.concat({
                  question: res.data.data.promptContent,
                  isSys: true,
                  type: 400, //type == 200时，正常显示消息,type == 300时，显示多条消息，type == 400时，显示系统默认消息
                  time: Date.now(),
                });
              }
              this.huifuNum = res.data.data.info.length;
              console.log(typeof this.messageData);
            }
          } else if (res.data.ret === 1) {
            this.messageData = this.messageData.concat({
              type: 200,
              question: res.data.msg,
              isSys: true,
              time: Date.now(),
            });
          }
        });
    },
    getManualService(o) {
      console.log(this.uid);
      var data = this.formDataCreator({
        user_id: this.uid,
        source: souceStr,
        ...o,
      });
      this.$http
        .post("/appserver/v1/customer_server/manualService", data)
        .then((res) => {
          console.log("请求转人工：%o", res.data);
          if (res.status === 200 && o.method === "start") {
            if (res.data.ret == 0 || res.data.ret == 1051) {
              console.log("转人工接口请求成功");
              // isArtificial = true;
              // this.artificialInterval = setInterval(() => {
              //   this.getClientPullRespMessages({
              //     user_id: this.userId,
              //   });
              // }, 2000);
              success = true;
              this.initWebSocket();
            } else {
              //1051 正在人工会话中 1050 正在排队  1044当前无人工客服在线
              this.messageData = this.messageData.concat({
                question: res.data.msg,
                isSys: true,
                time: Date.now(),
                type: 400,
              });
            }
          }
        });
    },
    // getClientPullRespMessages() {
    //   console.log(this.uid);
    //   var data = this.formDataCreator({
    //     user_id: this.uid,
    //     source: souceStr,
    //   });
    //   var that = this;
    //   this.$http
    //     .post("/appserver/v1/customer_server/clientPullRespMessages", data)
    //     .then((res) => {
    //       console.log(res.data.data);
    //       if (res.status === 200 && res.data.data && res.data.data.length > 0) {
    //         var arr = res.data.data;
    //         var obj = arr[0];
    //         console.log(obj.code);
    //         success = true;
    //         this.messageData = this.messageData.concat(
    //           res.data.data.map((v) => {
    //             return {
    //               ...v,
    //               question: v.content,
    //               isSys: true,
    //               time: Date.now(),
    //               type: v.cmd == "sendMsg" ? 200 : 400,
    //             };
    //           })
    //         );
    //         if (obj.code === 1) {
    //           console.log("结束会话");
    //           isArtificial = false;
    //           // clearInterval(that.artificialInterval);
    //           return;
    //         }
    //       }
    //     });
    // },
    // 增加信息
    addMessageData(v) {
      this.messageData = this.messageData.concat(v);
    },
    changeInputType() {
      if (this.btnType === 0) {
        this.btnType = 1;
      } else {
        this.btnType = 0;
      }
    },
    add() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.count += 1;
      });
    },
    // 停止定时器
    stop() {
      clearInterval(this.intervalId); //清除计时器
      this.count = 0;
      this.intervalId = null; //设置为null
    },
    touchStart() {
      this.add();
      window.wii.app.invoke("startRecord", {
        callback: "callbackName",
      });
      this.imgPath = img;
      this.yuyinTip = !this.yuyinTip;
    },
    touchEnd() {
      this.yuyinTip = !this.yuyinTip;
      this.imgPath = imgTauch;
      // if (this.str != '00:00:00' && this.str != '') {
      if (this.count >= 10) {
        this.LoadShow = true;
        window.wii.app.invoke("endRecord", {
          callback: "EndRecord",
        });
      } else {
        this.$toast("您录制的语音太短!");
      }
      this.stop();
    },

    sendHandle(val) {
      isPullRefresh = false;
      this.inputVal = "";
      if (val.length <= 0) return;

      if (isArtificial && success) {
        // 人工
        this.addMessageData([
          {
            question: val,
            isSys: false,
            time: Date.now(),
          },
        ]);
        // this.getManualService({
        //   method: "send",
        //   message: val,
        // });
        this.websocketsend(val);
        return;
      }

      // 智能
      this.addMessageData([
        {
          question: val,
          isSys: false,
          time: Date.now(),
          type: 200,
        },
      ]);
      this.getAskQuestion({
        question: val,
      });
    },
    Substr(item) {
      return item.toString().substring(0, 12);
    },
    getDateTime(date) {
      var dateTime = new Date(date);
      // var y = dateTime.getFullYear();
      var m = dateTime.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = dateTime.getDate();
      d = d < 10 ? "0" + d : d;
      var h = dateTime.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = dateTime.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = dateTime.getSeconds();
      second = second < 10 ? "0" + second : second;
      return m + "月" + d + "日  " + h + ":" + minute + ":" + second;
    },
    formDataCreator(o) {
      var data = new FormData();
      for (var k in o) {
        data.append(k, o[k]);
      }
      return data;
    },
    blob2base64(blob, callback) {
      var blobUrl = window.URL.createObjectURL(blob);
      var File = new FileReader();
      File.onload = function(e) {
        callback(e.target.result);
      };
      File.readAsDataURL(blobUrl);
    },

    focusIn() {
      this.btnType = 0;
      this.yuinShow = false;
      window.addEventListener("resize", function() {
        if (
          document.activeElement.tagName == "INPUT" ||
          document.activeElement.tagName == "TEXTAREA"
        ) {
          window.setTimeout(function() {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      });
      // ios键盘弹出底部留白问题
      var body = document.querySelector(".input-box"); // input所在的容器
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        this.gotoBottom();
      }, 300);
    },
    blurIn() {
      // ios键盘弹出底部留白问题
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    },
    getMessageData() {
      if (this.historyMsg != null) {
        console.log("before history length = " + this.historyMsg.length);
        console.log("before message length = " + this.messageData.length);
        if (this.historyMsg.length <= 10 && this.historyMsg.length > 0) {
          for (let index = this.historyMsg.length - 1; index >= 0; index--) {
            const element = this.historyMsg[index];
            this.messageData.unshift(element);
          }
          this.historyMsg = [];
        } else if (this.historyMsg.length > 10) {
          var arr = this.historyMsg.slice(-10);
          console.log("current arr length = " + arr.length);
          for (let index = arr.length - 1; index >= 0; index--) {
            const element = arr[index];
            this.messageData.unshift(element);
          }
          this.historyMsg = this.historyMsg.splice(
            0,
            this.historyMsg.length - 10
          );
        }
        console.log("after history length = " + this.historyMsg.length);
        console.log("after message length = " + this.messageData.length);
        let scrollTop =
          document.documentElement.scrollTo || document.body.scrollTop;
        if (scrollTop > 0) {
          window.requestAnimationFrame(scrollTop);
          window.scrollTop(0, scrollTop - scrollTo / 8);
        }
      }
    },
    getHistoryMessage() {
      var arr = [];
      try {
        var jsonString = window.localStorage.getItem("message");
        arr = JSON.parse(jsonString);
      } catch (error) {}
      if (arr != null && arr.length > 0) {
        arr = arr.filter(
          (v) => (Date.now() - v.time) / (1000 * 60 * 60 * 24) <= 3
        );
        console.log("history = " + arr);
        this.historyMsg = arr;
      }
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri =
        "wss://tgr.wiiqq.com/appserver/customer_service/" + this.uid;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      this.artificialInterval = setInterval(() => {
        let actions = {
          time: Date.now(),
          method: "heartbeat",
        };
        this.websock.send(JSON.stringify(actions));
      }, 15 * 1000);
    },
    websocketonerror() {
      //连接建立失败重连
      if (this.isActivity) {
        this.initWebSocket();
      }
    },
    websocketonmessage(e) {
      //数据接收
      // const redata = JSON.parse(e.data);
      console.log("数据接收:%o", e);
      const redata = JSON.parse(e.data);
      if (redata.data == "连接成功") {
        isArtificial = true;
        return;
      }

      if (redata.heartbeat !== undefined) {
        return;
      }
      var v = redata.data;
      if (v.cmd !== undefined) {
        this.messageData = this.messageData.concat({
          ...v,
          question: v.content,
          isSys: true,
          time: Date.now(),
          type: v.cmd == "sendMsg" ? 200 : 400,
        });
        if (v.cmd == "timeoutEnd" || v.cmd == "closeSession") {
          //会话已经超时结束
          this.websock.close();
        }
      }
    },
    websocketsend(msg) {
      //数据发送
      let actions = {
        source: souceStr,
        session_id: this.uid,
        method: "send",
        message: msg,
      };
      this.websock.send(JSON.stringify(actions));
    },
    websocketclose(e) {
      //关闭
      isArtificial = false;
      clearInterval(this.artificialInterval);
    },
  },
  watch: {
    messageData: function() {
      if (this.historyMsg != null) {
        var arr = this.historyMsg.concat(this.messageData);
        var jsonString = JSON.stringify(arr);
        window.localStorage.setItem("message", jsonString);
      } else {
        var jsonString = JSON.stringify(this.messageData);
        window.localStorage.setItem("message", jsonString);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早起浏览器*/
  -moz-user-select: none; /*火狐浏览器*/
  -ms-user-select: none; /*IE浏览器*/
  user-select: none; /*用户是否能够选中文本*/
}
input {
  -webkit-user-select: auto; /*webkit浏览器*/
}
.online-service-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .chat-box {
    // display: flex;
    height: 100%;
    background-color: #f8f8f8;
    overflow: auto;
    .refresh {
      overflow: hidden;
      margin: 0%;
      width: 100%;
      height: 100% !important;
      overflow-y: auto;
    }
    .refresh > div {
      overflow: hidden;
      height: 100% !important;
    }

    .chat-scoll {
      width: 100%;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
    .date-time {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      color: #999;
      font-size: 12px;
      text-align: center;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .chat-block {
    &:last-child {
      padding-bottom: 20px;
    }
  }

  .service-box {
    margin: 20px 44px 0 20px;
    display: flex;

    &.my-box {
      flex-direction: row-reverse;
      margin: 20px 20px 0 44px;

      .avatar {
        margin: 0 0 0 8px;
      }
      .chat {
        flex-direction: row-reverse;
        .block {
          background-color: #178357;
          color: white;
        }
        .green {
          color: #178357;
        }
      }
    }
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50px;
      overflow: hidden;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .chat {
      display: flex;
      flex: 1;

      .block {
        display: flex;
        flex-direction: column;
        padding: 10px 15px;
        border-radius: 2px;
        background-color: white;
        font-size: 15px;
        color: #37384d;
      }
    }

    .green {
      color: #178357;
      margin-top: 5px;

      &:first-child {
        margin: 0;
      }
    }
  }

  .chat-input-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 58px;
    background-color: white;
    margin-bottom: 10px;

    &.yuyin-input-box {
      height: 274px;
    }

    .header-box {
      height: 58px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .input-type-box {
      width: 64px;
      // height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;

      .change-btn {
        width: 29px;
        height: 29px;
      }
    }

    .input-box {
      height: 38px;
      flex: 1;
      background-color: #f8f8f8;
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding: 0 5px;

      .input {
        font-size: 14px;
        color: #37384d;
        background: none;
        border: none;
        height: 100%;
        width: 100%;
      }
    }

    .sub-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 100%;
      font-size: 16px;
      color: #178357;
    }

    .yuin-input {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      width: 100%;

      .yuyin-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #999;

        .div-img {
          width: 70px;
          height: 70px;
          // background-image: url('../../assets/images/online-service/ic_Voice_touch@2x.png');
          background-size: 70px 70px;
          background-repeat: no-repeat;

          -webkit-user-select: auto;
        }
        .text {
          margin-bottom: 12px;
        }
      }
    }
  }
  .title .van-icon {
    color: #4a4a4a;
    font-size: 22px;
    font-weight: 600;
  }
}
.jiazai {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .van-loading {
    color: #fff;
  }
  & > div {
    width: 150px;
    height: 150px;
    background-color: rgba(50, 50, 51, 0.88);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    & > p {
      width: 100%;
      margin-top: 20px;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
