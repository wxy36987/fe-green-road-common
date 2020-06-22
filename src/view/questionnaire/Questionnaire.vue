<template>
  <div class="questionnaire">
    <div class="header">
      <van-nav-bar title="问卷调查" left-arrow @click-left="onClickLeft" />
    </div>
    <div class="wrap" v-if="success">
      <div class="list" v-if="isAnswer === 0">
        <div
          class="list-item"
          v-for="(item, index) in problemList"
          :key="index + '-label'"
        >
          <div v-if="item.type == 1">
            <p>{{ index + 1 }}.{{ item.problemName }} （单选题）</p>
            <van-radio-group v-model="radio[index]">
              <van-radio
                v-for="(x, i) in item.selects"
                :key="i"
                :name="x.selectSort"
              >
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? activeIcon : inactiveIcon"
                  width="20px"
                  height="20px"
                />{{ x.selectName }}</van-radio
              >
            </van-radio-group>
          </div>
          <div v-else-if="item.type == 2">
            <p>{{ index + 1 }}.{{ item.problemName }}（多选题）</p>
            <van-checkbox-group v-model="result[index]">
              <van-checkbox
                shape="square"
                v-for="(x, i) in item.selects"
                :key="i"
                :name="x.selectSort"
                >{{ x.selectName }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
          <div v-else-if="item.type == 3">
            <p>{{ index + 1 }}.{{ item.problemName }}(打分题)</p>
            <ul :id="'grade' + index">
              <li
                v-for="(x, i) in item.selects"
                :key="i"
                @click="changeIndex(index, i)"
              >
                {{ i + 1 }}
                <!-- <van-radio :name="x.selectSort"></van-radio> -->
              </li>
            </ul>
          </div>
          <div v-else-if="item.type == 4">
            <p>{{ index + 1 }}.{{ item.problemName }}（填空题）</p>
            <van-field
              v-model="item.questionDetails"
              type="textarea"
              placeholder="请输入留言"
              rows="1"
              autosize
              :maxlength="100"
              style="height:140px;"
            />
          </div>
          <div v-else-if="item.type == 5">
            <p>{{ index + 1 }}.{{ item.problemName }}（图片选择题）</p>
            <van-radio-group v-model="radio2[index]">
              <van-radio
                v-for="(x, index) in item.selects"
                :key="index"
                :name="x.selectName"
              >
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? activeIcon : inactiveIcon"
                  width="20px"
                  height="20px"
                />
                <img :src="x.selectName" alt width="144px" height="90px" />
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="list" v-if="isAnswer === 1">
        <div
          class="list-item"
          v-for="(item, index) in problemList"
          :key="index + '-label'"
        >
          <div v-if="item.type == 1">
            <p>{{ index + 1 }}.{{ item.problemName }} （单选题）</p>
            <van-radio-group v-model="item.content">
              <van-radio
                v-for="(x, i) in item.selects"
                :key="i"
                :name="x.selectSort"
                ><img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? activeIcon : inactiveIcon"
                  width="20px"
                  height="20px"
                />{{ x.selectName }}</van-radio
              >
            </van-radio-group>
          </div>
          <div v-else-if="item.type == 2">
            <p>{{ index + 1 }}.{{ item.problemName }}（多选题）</p>
            <van-checkbox-group v-model="result[index]">
              <van-checkbox
                shape="square"
                v-for="(x, i) in item.selects"
                :key="i"
                :name="x.selectSort"
                >{{ x.selectName }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
          <div v-else-if="item.type == 3">
            <p>{{ index + 1 }}.{{ item.problemName }}(打分题)</p>
            <ul :id="'grade' + index" :ref="'grade' + index">
              <li v-for="(x, i) in item.selects" :key="i">
                {{ i + 1 }}
                <!-- <van-radio :name="x.selectSort"></van-radio> -->
              </li>
            </ul>
          </div>
          <div v-else-if="item.type == 4">
            <p>{{ index + 1 }}.{{ item.problemName }}（填空题）</p>
            <van-field
              v-model="item.content"
              type="textarea"
              placeholder="请输入留言"
              rows="1"
              autosize
              maxlength="500"
              style="height:120px;"
            />
          </div>
          <div v-else-if="item.type == 5">
            <p>{{ index + 1 }}.{{ item.problemName }}（图片选择题）</p>
            <van-radio-group v-model="radio2[index]">
              <van-radio
                v-for="(x, index) in item.selects"
                :key="index"
                :name="x.selectName"
              >
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? activeIcon : inactiveIcon"
                  width="20px"
                  height="20px"
                />
                <img :src="x.selectName" alt width="144px" height="90px" />
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
      <div class="submit" v-if="isAnswer === 0">
        <van-button @click="SubmitBtn()" :disabled="disabledFbBtn"
          >提交问卷</van-button
        >
      </div>
    </div>
    <div class="sub-success" v-if="!success">
      <div>
        <van-image :src="successIcon" width="95px" height="95px"></van-image>
        <p>提交成功，感谢您的支持！</p>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      isAnswer: "", //是否作答
      radio: [], // 单选值
      radio2: [], // 图片选值
      success: true,
      liuyan: "",
      successIcon: require("../../assets/iconImage/ic-status-success@2x.png"),
      activeIcon: require("../../assets/iconImage/ic_danxuan2.png"),
      inactiveIcon: require("../../assets/iconImage/ic_danxuan.png"),
      problemList: [],
      result: [], // 多选题
      typeRadio: [], // 单选
      typeCheck: [], // 多选
      scoring: [], // 打分
      tianNull: [], // 填空
      picRadio: [], // 图片选择
      disabledFbBtn: false,
    };
  },
  created() {
    // 设置title
    window.wii.app.invoke("showNativeBar", false);
    // window.wii.app.invoke('setTitle', '问卷调查');
    ///this.uid = "5e04955ec0e5690043166298";
  },
  mounted() {
    this.getQuestionnaireList();
    // window.loadComplete = ()=>{
    //   window.wii.app.invoke("setTitle",this.headTitle)
    // };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //问卷调查
    getQuestionnaireList() {
      var params = {
        userId: this.uid,
      };
      this.$http
        .post("/appserver/v1/opinion/question", qs.stringify(params))
        .then((data) => {
          if (data.data.ret === 0) {
            this.isAnswer = data.data.data.isAnswer;
            this.problemList = data.data.data.problems;
            if (this.isAnswer === 0) {
              for (var i = 0; i < this.problemList.length; i++) {
                // 单选
                if (this.problemList[i].type == 1) {
                  this.typeRadio.push(this.problemList[i]);
                }
                // 多选
                if (this.problemList[i].type == 2) {
                  this.typeCheck.push(this.problemList[i]);
                }
                // 打分
                if (this.problemList[i].type == 3) {
                  this.scoring.push(this.problemList[i]);
                }
                // 填空
                if (this.problemList[i].type == 4) {
                  this.tianNull.push(this.problemList[i]);
                }
                // 图片
                if (this.problemList[i].type == 5) {
                  this.picRadio.push(this.problemList[i]);
                }
              }
            } else {
              for (var j = 0; j < this.problemList.length; j++) {
                // 单选
                if (this.problemList[j].type == 1) {
                  this.radio[j] = this.problemList[j].content;
                }
                // 多选
                if (this.problemList[j].type == 2) {
                  var array = [];
                  var NumArr = [];
                  array.push(this.problemList[j].content);
                  var num = array.join('"').replace(/[^0-9]/gi, "");
                  for (var k = 0; k < num.length; k++) {
                    NumArr.push(num[k]);
                  }
                  this.result[j] = NumArr;
                }
                // 填空
                if (this.problemList[j].type == 4) {
                  this.tianNull[j] = this.problemList[j];
                }
                // 图片
                if (this.problemList[j].type == 5) {
                  this.radio2[j] = this.problemList[j].content;
                }
              }
            }
          }
        })
        .then(() => {
          this.aScore();
        });
    },
    // 打分题回显
    aScore() {
      for (var i = 0; i < this.problemList.length; i++) {
        // 打分
        if (this.problemList[i].type == 3) {
          var _li = document
            .getElementById("grade" + i)
            .getElementsByTagName("li");
          for (var j = 0; j < _li.length; j++) {
            if (_li[j].innerText == this.problemList[i].content) {
              _li[this.problemList[i].content - 1].classList.add("active_li");
            }
          }
        }
      }
    },
    // 打分题选中
    changeIndex(index, li_index) {
      var _li = document
        .getElementById("grade" + index)
        .getElementsByTagName("li");
      for (var i = 0; i < _li.length; i++) {
        if (li_index === i) {
          _li[i].classList.add("active_li");
        } else {
          _li[i].classList.remove("active_li");
        }
      }
    },
    // 提交
    SubmitBtn() {
      var jsonParam = [];
      // 单选处理
      if (this.typeRadio.length !== 0) {
        for (var i = 0; i < this.problemList.length; i++) {
          if (this.radio[i] !== undefined) {
            jsonParam.push({
              userId: this.uid,
              problemId: this.problemList[i].problemId,
              content: this.radio[i],
              type: this.problemList[i].type,
            });
          }
        }
      }
      // 多选处理
      if (this.typeCheck.length !== 0) {
        for (var j = 0; j < this.problemList.length; j++) {
          if (this.result[j] !== undefined) {
            jsonParam.push({
              userId: this.uid,
              problemId: this.problemList[j].problemId,
              content: this.result[j],
              type: this.problemList[j].type,
            });
          }
        }
      }
      // 打分
      var active_li = document.getElementsByClassName("active_li");
      if (this.scoring.length !== 0) {
        if (active_li.length === this.scoring.length) {
          for (var x = 0; x < this.scoring.length; x++) {
            jsonParam.push({
              userId: this.uid,
              problemId: this.scoring[x].problemId,
              content: active_li[x].innerText,
              type: this.scoring[x].type,
            });
          }
        }
      }
      // 填空
      if (this.tianNull.length !== 0) {
        for (var y = 0; y < this.tianNull.length; y++) {
          if (this.tianNull[y].questionDetails !== null) {
            jsonParam.push({
              userId: this.uid,
              problemId: this.tianNull[y].problemId,
              content: this.tianNull[y].questionDetails,
              type: this.tianNull[y].type,
            });
          }
        }
      }
      // 图片
      if (this.picRadio.length !== 0) {
        for (var k = 0; k < this.problemList.length; k++) {
          jsonParam.push({
            userId: this.uid,
            problemId: this.problemList[k].problemId,
            content: this.radio2[k],
            type: this.problemList[k].type,
          });
        }
      }

      var jsonParamArray = [];
      for (var a = 0; a < jsonParam.length; a++) {
        if (jsonParam[a].content !== undefined) {
          if (jsonParam[a].content !== "") {
            jsonParamArray.push(jsonParam[a]);
          }
        }
      }
      if (jsonParamArray.length !== this.problemList.length) {
        this.$toast("请填写完整问题");
        return false;
      } else {
        this.disabledFbBtn = true;
        this.$http
          .post("/appserver/v1/opinion/saveQuestion", jsonParamArray)
          .then((data) => {
            this.disabledFbBtn = false;
            if (data.data.ret === 0) {
              this.success = false;
            } else {
              this.$toast(data.data.msg);
            }
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.van-nav-bar__left {
  left: 14px;
}
.questionnaire {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background: #fff;
    z-index: 1200;
    /deep/ .van-icon {
      font-size: 22px;
      color: #000;
    }
    /deep/ .van-hairline--bottom::after {
      border: 0px;
    }
  }
  .list {
    margin-top: 50px;
    .list-item {
      padding: 20px;
      padding-bottom: 0px;
      border-bottom: 5px solid #f8f8f8;
      font-size: 14px;
      /deep/ .van-field__body textarea {
        -webkit-user-select: auto;
      }
      &:last-child {
        border-bottom: 0px;
      }
      p {
        color: #222;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      /deep/ .van-radio__label {
        // font-size: 15px;
        color: #222;
      }
      /deep/ .van-radio-group {
        padding: 20px 0;
        border-bottom: 1px solid #eeeeee;
        &:last-child {
          border-bottom: 0px;
        }
      }
      /deep/ .van-checkbox {
        padding: 20px 0;
        border-bottom: 1px solid #eeeeee;
        &:last-child {
          border-bottom: 0px;
        }
      }
      /deep/ .van-checkbox__icon--checked .van-icon {
        color: #fff;
        background: #37384d;
        border-color: #37384d;
      }
      /deep/ .van-hairline--top-bottom::after {
        border: 0;
      }
      /deep/ .van-cell {
        width: 100%;
        border: 1px solid #e1e1e1;
        border-radius: 2px;
        margin: 20px 0;
      }
      /deep/ .van-radio {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
      /deep/.van-radio__icon--checked .van-icon {
        color: #fff;
        background-color: #37384d;
        border-color: #37384d;
      }
      ul {
        margin-top: 20px;
        display: flex;
        justify-content: flex-start;
        padding-bottom: 20px;
        li {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid #e1e1e1;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(55, 56, 77, 1);
          line-height: 35px;
          text-align: center;
          margin-right: 20px;
        }
        .active_li {
          background: #37384d;
          color: #fff;
        }
      }
    }
  }
  .submit {
    padding: 20px;
    margin-top: 40px;
    /deep/ .van-button {
      width: 100%;
      background: #188357;
      color: #fff;
      font-size: 15px;
      font-family: PingFangSC-Semibold, PingFangSC;
      font-weight: 600;
      line-height: 15px;
    }
  }
  .sub-success {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: flex;
      justify-content: center;
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
}
</style>
