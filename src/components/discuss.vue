<template>
  <div>
    <div class="write-comment-box" v-if="son.publishShow">
      <div class="mask" @click="TZBtn()"></div>
      <div class="write-comment">
        <van-cell
          title="发帖子"
          is-link
          arrow-direction="down"
          @click="TZBtn()"
        />
        <van-cell-group>
          <van-field
            v-model="message"
            type="textarea"
            placeholder="我来发表评论"
            rows="1"
            autosize
            @blur="fbBlur"
          />
        </van-cell-group>
        <div class="pic_show" v-if="fileList.length !== 0">
          <div>
            <van-swipe
              :loop="false"
              :width="60"
              :height="60"
              :show-indicators="false"
            >
              <van-swipe-item v-for="(item, index) in fileList" :key="index">
                <van-image
                  :src="item.content"
                  width="50px"
                  height="50px"
                ></van-image>
                <div class="pic_delete">
                  <van-image
                    :src="picDelete"
                    width="15px"
                    height="15px"
                    @click="Delete(index)"
                  ></van-image>
                </div>
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
        <div class="fb-btn">
          <div class="icon-img">
            <van-uploader :after-read="afterRead" multiple :max-count="9">
              <van-image :src="photoImg"></van-image>
            </van-uploader>
            <van-image :src="expressionImg" @click="faceContent"></van-image>
          </div>
          <van-button v-if="btnShow">发表</van-button>
          <van-button
            v-if="!btnShow"
            @click="referContent"
            color="#19835c"
            :disabled="disabledFbBtn"
            >发表</van-button
          >
        </div>
        <!-- 表情区域 -->
        <div class="browBox" v-if="faceShow">
          <ul>
            <li
              v-for="(item, index) in faceList"
              :key="index"
              @click="getBrow(index)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
// 导入JSON格式的表情库
var appData = require("@/assets/emojis.json");
export default {
  data() {
    return {
      faceList: [],
      faceShow: false,
      getBrowString: "",
      content: [],
      // 写点评
      message: "",
      photoImg: require("../assets/iconImage/ic_pic@2x.png"),
      expressionImg: require("../assets/iconImage/ic_em@2x.png"),
      btnShow: true,
      fileList: [],
      picDelete: require("../assets/iconImage/icon_delate@2x.png"),
      disabledFbBtn: false,
    };
  },
  props: {
    son: {
      type: Object,
      default: () => [],
    },
  },
  methods: {
    fbBlur() {
      if (this.message === "") {
        // alert(111);
        this.btnShow = true;
      } else {
        this.btnShow = false;
      }
    },
    // 图片上传
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      this.fileList.push(file);
      console.log(this.fileList);
    },
    // 删除图片
    Delete(index) {
      for (var i = 0; i < this.fileList.length; i++) {
        if (i === index) {
          this.fileList.splice(this.fileList.indexOf(index), i);
        }
      }
      // console.log(this.fileList)
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow;
      if (this.faceShow == true) {
        for (var i in appData) {
          this.faceList.push(appData[i].char);
        }
      } else {
        this.faceList = [];
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (var i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.message += this.getBrowString;
        }
      }
      // console.log(this.message)
      this.faceShow = false;
      if (this.message === "") {
        this.btnShow = true;
      } else {
        this.btnShow = false;
      }
    },
    // 将input的内容渲染到页面上
    referContent() {
      console.log(this.son.id);
      this.disabledFbBtn = true;
      var params = {
        content: this.message,
        uid: this.uid,
        target_id: this.son.id,
        source_type: "h5",
      };
      //获取添加列表
      this.$http
        .post("/appserver/v1/comment/addComment", params)
        .then((data) => {
          this.disabledFbBtn = false;
          console.log(data);
          // 清空数据
          this.message = "";
          this.fileList = [];
          // 关闭表情列表
          this.faceShow = false;
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    // 发帖子
    TZBtn() {
      this.$emit("close", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.write-comment-box {
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.3);
  z-index: 1300;
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0px;
    z-index: 1400;
  }
  .write-comment {
    position: fixed;
    bottom: 0px;
    width: 100%;
    background: #fff;
    z-index: 1500;
    padding: 20px;
    box-sizing: border-box;
    /deep/ .van-cell {
      padding: 0px;
    }
    .van-cell:not(:last-child)::after {
      border-bottom: 0px;
    }
    /deep/ .van-cell__title {
      color: #444;
      font-size: 13px;
    }
    /deep/ .van-cell__right-icon {
      color: #999;
      font-size: 16px;
    }
    /deep/ .van-field__control {
      padding: 10px;
      background: #f9f9f9;
      color: #444444;
      font-size: 14px;
      margin-top: 15px;
      min-height: 80px;
    }
    .fb-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      .icon-img {
        /deep/ .van-image {
          width: 20px;
          height: 20px;
          &:nth-of-type(1) {
            margin-right: 10px;
          }
        }
      }
      /deep/ .van-button {
        width: 60px;
        height: 30px;
        border: 0px;
        line-height: 30px;
        font-size: 15px;
        color: #999;
        background: #f8f8f8;
        color: #fff;
      }
    }
  }
}
.pic_show {
  margin-top: 5px;
  /deep/ .van-image {
    top: 10px;
  }
  .pic_delete {
    position: absolute;
    top: -7.5px;
    right: 3.5px;
  }
}
.browBox {
  width: 100%;
  height: 200px;
  background: #e6e6e6;
  overflow: scroll;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    li {
      width: 14%;
      font-size: 26px;
      list-style: none;
      text-align: center;
    }
  }
}
</style>
