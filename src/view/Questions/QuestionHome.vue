<template>
  <div class="QuestionHome">
    <div class="title">
      <van-nav-bar
        title="问答"
        right-text="我的问答"
        left-arrow
        @click-left="onClickLeft"
        @click-right="MyQuestion()"
      />
    </div>
    <div
      class="searchButtons"
      :class="{ 'btn-box-active': !buttonShow }"
      id="searchButtons"
    >
      <van-button
        type="primary"
        size="small"
        v-for="(item, index) in searchButtonArr"
        :key="index"
        id="tagButton"
        class="searchButton"
        @click="searchButton(index, item)"
        :class="
          activeClass == index
            ? 'clickStyle'
            : item.type == 1 || item.type == 2
            ? 'bottomRight'
            : ''
        "
        v-show="
          item.type == 1 ? buttonShow : item.type == 2 ? !buttonShow : true
        "
      >
        <p v-if="!item.type">
          {{ item.name }}
        </p>
        <p v-if="item.type == 1">
          <span>展开</span>
          <van-image :src="xiaIcon" width="7px" height="4px"></van-image>
        </p>
        <p v-if="item.type == 2">
          <span>收起</span>
          <van-image :src="shangIcon" width="7px" height="4px"></van-image>
        </p>
      </van-button>
    </div>
    <hr class="HrStyle" />
    <!-- 列表 -->
    <div class="listStyle">
      <van-tabs v-model="active" @click="TabScreen">
        <van-tab title="推荐"></van-tab>
        <van-tab title="关注"></van-tab>
      </van-tabs>
      <div v-if="!NoListShow">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="200"
        >
          <div
            v-for="(item, index) in listArr"
            :key="index"
            class="list-Question"
            @click="QuestionDetails(item)"
          >
            <div v-show="item.ReplyName" v-if="active != 0" class="userReply">
              <span></span>
              {{ item.ReplyName }}
              添加了回答
            </div>
            <div class="problem-toptag">
              <van-tag
                v-if="item.question_top == 1"
                color="#edf2f0"
                text-color="#188357"
                >置顶</van-tag
              >
              <span class="problem">{{ item.question_title }}</span>
            </div>
            <p class="answer">{{ item.question_content }}</p>
            <p class="zan-num">
              <span>{{ item.question_attentions }}关注</span>
              <span v-show="item.question_discuss_count != 0"
                >{{ item.question_discuss_count }}讨论</span
              >
              <!-- <span v-show="item.question_discuss_count == 0">未讨论</span> -->
            </p>
          </div>
        </van-list>
      </div>
      <div class="no-list" v-if="NoListShow">
        <div>
          <van-image :src="errorIcon" width="200px" height="200px"></van-image>
          <p>{{ nierou }}</p>
        </div>
      </div>
    </div>
    <!-- 我要提问底部 -->
    <div class="feedback-btn">
      <van-button color="#188357" @click="IWantQuestion">我要提问</van-button>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      backIcon: require("../../assets/iconImage/ic_back@2x.png"), // titleBar 返回icon
      value: "",
      searchButtonArr: [
        //  { name: "全部", id: "1" },
      ],
      activeClass: "",
      active: 0,
      buttonShow: true,
      listArr: [],
      xiaIcon: require("../../assets/iconImage/xia@2x.png"),
      shangIcon: require("../../assets/iconImage/shang@2x.png"),
      loading: false,
      finished: false,
      page: 0, // 当前页数
      page_size: "10", // 页面条数
      errorIcon: require("../../assets/iconImage/error@3x.png"),
      nierou: "暂无推荐",
      NoListShow: false,
      fangdou: true,
      ShowType: false,
    };
  },
  watch: {
    searchButtonArr: function(oldsearchButtonArr, newSearchButtonArr) {
      // eslint-disable-next-line
      console.log(
        "oldsearchButtonArr = " +
          oldsearchButtonArr +
          ",newSearchButtonArr =" +
          newSearchButtonArr
      );
      setTimeout(this.initWidth, 1000);
    },
  },
  created() {
    window.wii.app.invoke("showNativeBar", false);
  },
  mounted() {
    this.Topic();
  },
  methods: {
    initWidth() {
      /* eslint-disable */
      var searchButtons = document.getElementById("searchButtons");
      var Length = searchButtons.scrollHeight;
      console.log("Length:" + Length);
      if (Length > 126 && this.searchButtonArr.length > 8) {
        this.ShowType = true;
      } else {
        this.ShowType = false;
      }
    },
    /* eslint-disable */
    onClickLeft() {
      window.wii.app.invoke("closeWindow");
    },
    //按钮搜索
    searchButton(index, item) {
      if (item.type === 1) {
        this.buttonShow = false;
      } else if (item.type === 2) {
        this.buttonShow = true;
      } else {
        this.activeClass = index;
        this.$router.push({
          path: "/QuestionTopic",
          query: {
            id: item.id,
            name: item.name,
          },
        });
      }
    },
    // 话题
    Topic() {
      this.$http
        .get(`/appserver/v1/quesAnswer/getTager?tager_type=0`)
        .then((data) => {
          if (data.data.ret === 0) {
            if (data.data.data && data.data.data.length > 0) {
              data.data.data.splice(0, 0, { name: "全部", id: "1" });
              var screenWidth = document.documentElement.clientWidth;
              var vanButtonWidth = this.getVanBtnWidth(screenWidth); //70
              var searchButtonsWidth = screenWidth - 40; //320
              var maxItemWidth = searchButtonsWidth - 30 - vanButtonWidth;
              var line = 0;
              var totalItemWidth = 0;
              var twoLinePostion = 0;
              for (var index = 0; index < data.data.data.length; index++) {
                var item = data.data.data[index];
                var itemWidth =
                  this.textSize(
                    "12px",
                    "PingFangSC-Regular, PingFang SC",
                    item.name
                  ).width + 18;
                if (maxItemWidth <= itemWidth) {
                  itemWidth = maxItemWidth;
                }
                var realityWidth =
                  (itemWidth > vanButtonWidth ? itemWidth : vanButtonWidth) +
                  10;
                totalItemWidth = totalItemWidth + realityWidth;
                if (totalItemWidth > searchButtonsWidth) {
                  line++;
                  if (line == 2) {
                    if (
                      totalItemWidth - realityWidth + (vanButtonWidth + 10) <=
                      searchButtonsWidth
                    ) {
                      twoLinePostion = index;
                    } else {
                      twoLinePostion = index - 1;
                    }
                    break;
                  }
                  totalItemWidth = realityWidth;
                } else if (totalItemWidth == searchButtonsWidth) {
                  line++; //换行
                  if (line == 2 && index < data.data.data.length - 1) {
                    twoLinePostion = index;
                    break;
                  }
                  totalItemWidth = 0;
                }
              }
              if (twoLinePostion > 0) {
                data.data.data.splice(twoLinePostion, 0, {
                  name: "展开",
                  id: "1",
                  type: 1,
                });
                data.data.data.push({
                  name: "收起",
                  id: "2",
                  type: 2,
                });
              }
              this.searchButtonArr = data.data.data;
              // searchButtons  width:320,  tagButton  70 的标准计算
              // //一个标签外边距总长10px  6个字90  4个字70  5个字78  7个字102  8个字114
              // //字宽度+18 是否大于70,   最后还要加上外边距长10px
            }
          }
          this.showLoading(false);
        });
    },
    // 推荐 关注 筛选
    TabScreen() {
      this.loading = true;
      this.finished = false;
      this.listArr = [];
      this.page = 0;
      this.onLoad();
    },
    onLoad() {
      if (this.fangdou) {
        this.fangdou = false;
        this.page = this.page + 1;
        this.InitList();
      }
    },
    InitList() {
      var params = {
        type: this.active + 1,
        page: this.page,
        page_size: this.page_size,
      };
      if (this.active === 1) {
        params["uid"] = this.uid;
      }
      this.$http
        .post(`/appserver/v1/quesAnswer/list`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${this.skey}`,
          },
        })
        .then((data) => {
          this.loading = false; // 加载状态结束
          this.fangdou = true;
          if (data.data.ret === 0) {
            if (data.data.data) {
              this.listArr = this.listArr.concat(data.data.data.list);
              if (this.listArr.length >= data.data.data.pagination.total) {
                this.finished = true;
              }
            }
          }
          if (this.listArr.length == 0) {
            this.NoListShow = true;
            if (this.active === 1) {
              this.nierou = "暂无关注";
            } else {
              this.nierou = "暂无推荐";
            }
          } else {
            this.NoListShow = false;
          }
        })
        .catch((error) => {
          this.NoListShow = false;
        });
    },
    // 问答详情
    QuestionDetails(item) {
      this.$router.push({
        path: "/QuestionDetails",
        query: {
          id: item.question_id,
          from: "web",
          isShareWeb: false,
        },
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}QuestionDetails?id=${item.question_id}`,
      // 	isFullScreen: 0,
      // 	setTitle: '问答详情',
      // 	needLoading: 1
      // });
    },
    // 我的问答
    MyQuestion() {
      this.$router.push({
        path: "/MyQuestion",
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}MyQuestion`,
      // 	isFullScreen: 1,
      // 	setTitle: '',
      // 	needLoading: 0
      // });
    },
    // 我要提问
    IWantQuestion() {
      this.$router.push({
        path: "/IWantQuestion",
      });
      // window.wii.app.invoke('openWindow', {
      // 	openUrl: `${this.domain}IWantQuestion`,
      // 	isFullScreen: 1,
      // 	setTitle: '',
      // 	needLoading: 0
      // });
    },
    textSize(fontSize, fontFamily, text) {
      var span = document.createElement("span");
      var result = {};
      result.width = span.offsetWidth;
      result.height = span.offsetHeight;
      span.style.visibility = "hidden";
      span.style.fontSize = fontSize;
      span.style.fontFamily = fontFamily;
      span.style.display = "inline-block";
      document.body.appendChild(span);
      if (typeof span.textContent != "undefined") {
        span.textContent = text;
      } else {
        span.innerText = text;
      }
      result.width =
        parseFloat(window.getComputedStyle(span).width) - result.width;
      result.height =
        parseFloat(window.getComputedStyle(span).height) - result.height;
      return result;
    },
    getVanBtnWidth(screenWidth) {
      if (screenWidth <= 330) {
        return 60;
      } else if (screenWidth <= 340) {
        return 65;
      } else if (screenWidth <= 370) {
        return 70;
      } else if (screenWidth >= 400) {
        return 60;
      } else if (screenWidth >= 380) {
        return 75;
      } else {
        return 60;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.QuestionHome {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 1800;
    /deep/ .van-nav-bar {
      width: 100%;
    }
    /deep/ .van-nav-bar .van-icon {
      color: #000;
      font-size: 22px;
      font-weight: 600;
    }
    >>> .van-nav-bar .van-icon {
      color: #000;
      font-size: 22px;
      font-weight: 600;
    }
    /deep/ .van-nav-bar__title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
    }
    /deep/ .van-nav-bar__text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(24, 131, 87, 1);
    }
    /deep/ .van-nav-bar__text:active {
      background: #fff;
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
  }
  .van-search {
    padding: 10px 20px;
  }
  .van-search {
    padding-bottom: 0px;
    padding-top: 58px;
  }
}
</style>
<style lang="scss" scoped>
.QuestionHome {
  .searchButtons {
    padding-top: 46px;
    margin: 15px 20px;
    margin-top: 0px;
    max-height: 80px;
    overflow: hidden;
    display: inline-block;
    flex: auto;

    /deep/ .van-button {
      min-width: 73px;
    }
    .searchButton {
      color: #555959;
      background-color: #f6f6f7;
      border-color: #f6f6f7;
      margin: 5px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .clickStyle {
      background-color: #188357;
      border-color: #188357;
      color: white;
    }
    .bottomRight {
      position: relative;
      right: 0px;
      top: auto;
      display: flex;
      justify-content: flex-end;
      color: #188357;
      text-align: right;
      background-color: white;
      border-color: white;
      float: right;
    }
  }
  .btn-box-active {
    transition: all 2s;
    overflow: inherit;
    max-height: inherit;
    .btn-show {
      bottom: 15px;
    }
  }
  #clear {
    background: white;
    color: white;
    border-color: white;
  }
  .zhan {
    display: flex;
    // padding: 0 20px;
    // justify-content: flex-end;
    // margin-top: -20px;
    .btn-show {
      background: #fff;
      z-index: 1200;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(24, 131, 87, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      & > span {
        margin-right: 4px;
      }
    }
  }
  .isios {
    padding-bottom: 130px;
  }
  .HrStyle {
    border: none;
    width: 100%;
    height: 5px;
    background: #f8f8f8;
    margin-top: 20px;
  }
  .listStyle {
    padding-bottom: 120px;
    /deep/ .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: 0px;
    }
    /deep/ .van-tabs {
      padding: 0 10px;
      margin-top: 20px;
      width: 100px;
      left: 50vw;
      margin-left: -50px;
    }
    /deep/ .van-tabs__line {
      width: 33px !important;
      height: 3px !important;
      bottom: 28px;
      background-color: #188357;
    }
    /deep/ .van-tab {
      line-height: 20px;
      font-size: 16px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(85, 89, 89, 1);
    }
    /deep/ .van-tab--active {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(85, 89, 89, 1);
    }
    .list-Question {
      // border-bottom: 1px solid #f8f8f8; //分割线
      padding: 20px;
      margin-bottom: 15px;
      .userReply {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          border-radius: 50%;
          width: 6px;
          height: 6px;
          background: #f56666;
          margin-right: 3px;
        }
      }
      .problem {
        font-size: 17px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(55, 56, 77, 1);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .answer {
        margin-top: 15px;
        font-size: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(55, 56, 77, 1);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 24px;
      }
      .zan-num {
        margin-top: 15px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        span {
          margin-right: 6px;
        }
      }
    }
    .no-list {
      width: 100%;
      margin-top: 20px;
      & > div {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        & > p {
          width: 100%;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(155, 155, 155, 1);
        }
      }
    }
  }
  .feedback-btn {
    width: 100%;
    height: 70px;
    padding: 15px 25px;
    box-sizing: border-box;
    flex: 0 0 auto;
    box-shadow: 1px 0px 10px #ddd;
    z-index: 1200;
    position: fixed;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    /deep/ .van-button {
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 15px;
    }
  }
  .problem-toptag {
    display: flex;
    .van-tag {
      display: inline-flex;
      margin-right: 6px;
      background: rgba(24, 131, 87, 0.05);
      border-radius: 2px;
      font-size: 11px;
      font-weight: 400;
      color: rgba(24, 131, 87, 1);
      min-width: 23px;
    }
    .problem {
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(55, 56, 77, 1);
    }
  }
}
@media screen and (max-width: 370px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 70px;
    max-width: 230px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 80px;
  }
}
@media screen and (max-width: 340px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 65px;
    max-width: 205px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 65px;
  }
}
@media screen and (max-width: 330px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 60px;
    max-width: 200px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 60px;
  }
}
@media screen and (min-width: 370px) and (max-width: 380px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 60px;
    max-width: 235px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 85px;
  }
}
@media screen and (min-width: 380px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 75px;
    max-width: 235px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 85px;
  }
}
@media screen and (min-width: 400px) {
  .QuestionHome .searchButtons /deep/ .van-button {
    min-width: 60px;
    max-width: 270px;
  }
  .QuestionHome .searchButtons .btn-show {
    width: 73px;
  }
}
</style>
