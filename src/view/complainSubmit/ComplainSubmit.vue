<template>
  <div class="complain-submit" id="myBtn" :class="{ nav_select: navdata }">
    <div class="content" ref="comPage" v-if="success">
      <div class="form-item">
        <div class="form-label">投诉类别<span>(必填)</span></div>
        <div class="form-choose wc-qt" v-if="WCshow">其他</div>
        <div class="form-choose" v-if="!WCshow">
          <p class="choosetype" @click="showChoose()">
            <span v-if="!chooseNote">请选择投诉类别</span>
            <span v-if="chooseNote" class="chooseNote">{{ choosetext }}</span>
            <van-icon name="arrow" v-if="!showType" />
            <van-icon name="arrow-down" v-if="showType" />
          </p>
        </div>
      </div>

      <van-tree-select
        v-if="showType"
        height="auto"
        :items="items"
        :active-id.sync="activeId"
        :main-active-index.sync="activeIndex"
        @itemclick="onItemClick"
      />

      <div class="form-item">
        <div class="form-label">投诉对象<span>(必填)</span></div>
        <div class="form-choose">
          <van-field
            placeholder="请填写投诉对象"
            v-model="respondent"
            :disabled="respondentDis"
          />
        </div>
      </div>

      <!-- 投诉对象所属园区 -->
      <div class="form-item greenway" ref="greenPage">
        <div class="form-label">事件发生地<span>(必填)</span></div>
        <div class="form-choose">
          <p class="choosetype" @click="showArea()">
            <span v-if="!areaNote">请选择投诉事件发生地</span>
            <span v-if="areaNote" class="chooseNote">{{ name }}</span>
            <van-icon name="arrow" v-if="!areaType" />
            <van-icon name="arrow-down" v-if="areaType" />
          </p>
        </div>
      </div>
      <van-action-sheet
        v-model="show"
        :actions="option1"
        @select="onSelect"
        @click-overlay="clickOverlay"
        :round="ifRound"
      />

      <van-cell-group>
        <van-field
          v-model="complaintReson"
          rows="5"
          autosize
          label="投诉原因"
          type="textarea"
          maxlength="50"
          placeholder="请填写投诉原因"
          show-word-limit
        />
        <span>(必填)</span>
      </van-cell-group>

      <div class="up-img">
        <p>上传图片<span>(最多上传10张)</span></p>
        <div class="fb-btn">
          <div class="icon-img">
            <div class="images-box">
              <div
                class="images"
                v-for="(item, index) in gallerys"
                :key="index"
              >
                <div>
                  <van-image
                    :src="item"
                    class="card-img"
                    width="80px"
                    height="80px"
                    fit="cover"
                  ></van-image>
                  <van-image
                    :src="deteleIcon"
                    width="15.2px"
                    height="15.2px"
                    class="detele"
                    @click="Delete(index)"
                  ></van-image>
                </div>
              </div>
              <van-uploader
                name="file"
                multiple
                :max-count="10"
                :after-read="onloadFile"
                v-if="isPhone"
                v-show="tenShow"
              ></van-uploader>
              <div
                class="upload"
                @click="ImagesUp()"
                v-if="!isPhone"
                v-show="tenShow"
              >
                <van-icon name="plus"></van-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-item">
        <div class="form-label">投诉人</div>
        <div class="form-choose">
          <van-field placeholder="请填写投诉人" v-model="complainant" />
        </div>
      </div>
      <div class="form-item">
        <div class="form-label">联系电话</div>
        <div class="form-choose">
          <van-field placeholder="" v-model="phone" disabled />
        </div>
      </div>
      <div class="subbutton">
        <van-button
          slot="button"
          size="small"
          class="submit"
          @click="onSubmit()"
          :loading="loadingbutton"
          type="info"
          :loading-text="loadingtext"
          :disabled="disabledFbBtn"
        >
          <p>提交</p>
        </van-button>
      </div>
    </div>
    <div class="jiazai" v-if="LoadShow">
      <div class="">
        <van-loading type="spinner" />
        <p>正在加载图片...</p>
      </div>
    </div>
    <div class="sub-success" v-if="!success">
      <div>
        <van-image :src="successIcon" width="95px" height="95px"></van-image>
        <p>提交成功，您的评价会让我们做的更好！</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import qs from "qs";
export default {
  data() {
    return {
      WCshow: false,
      LoadShow: false,
      activeId: 1,
      activeIndex: 0,
      items: [],
      respondent: "", //投诉对象
      respondentDis: false,
      complaintReson: "", //投诉原因
      complainant: "", //投诉人
      phone: "", //投诉人联系电话
      uid: this.uid, //投诉人的id
      type: "", //一级分类
      category: "", //二级分类
      showType: false,
      choosetext: "", //选中二级菜单后展示的内容
      chooseNote: false,
      picDisabled: false,
      fileList: [], // 图片上传临时存放数组
      gallerys: [], // 图片上传服务器返回的数组
      picDelete: require("../../assets/iconImage/icon_delate@2x.png"),
      latitude: "",
      range: "100000",
      longitude: "",
      value: "",
      option1: [],
      optionTitle: "请选择事件发生地",
      loadingbutton: false,
      loadingtext: "加载中",
      navdata: false,
      show: false,
      areaType: false,
      areatext: "", //选中二级菜单后展示的内容
      areaNote: false,
      name: "",
      ifRound: false,
      deteleIcon: require("../../assets/iconImage/icon_delate@3x.png"),
      isPhone: false,
      gallerysLength: 0,
      greenwayIn: true,
      scenicId: "",
      lat: null,
      lng: null,
      tenShow: true,
      success: true,
      successIcon: require("../../assets/iconImage/ic-status-success@2x.png"),
      disabledFbBtn: false,
    };
  },
  created() {
    this.commonLatLong((LatLng) => {
      this.lat = LatLng.latitude;
      this.lng = LatLng.longitude;
      this.getArea();
      this.init();
    });
    window.wii.app.invoke("setTitle", "投诉");
    window.wii.app.invoke("showNativeBar", true);
    this.getComplainttype();
    // eslint-disable-next-line
    var u = navigator.userAgent,
      // eslint-disable-next-line
      app = navigator.appVersion;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.isPhone = false;
    }
    if (isIOS) {
      this.isPhone = true;
    }
    // 厕所投诉
    if (this.$route.query.typeWc == 1) {
      this.WCshow = true;
      this.choosetext = "1";
      this.respondent =
        this.$route.query.toiletName + "(" + this.$route.query.toiletNum + ")";
      this.respondentDis = true;
    } else {
      this.WCshow = false;
      this.respondent = "";
      this.respondentDis = false;
    }
    if (Object.keys(this.$route.query).length !== 0) {
      if (
        this.$route.query.item !== undefined &&
        this.$route.query.item !== ""
      ) {
        this.type = this.$route.query.item.complainType;
        this.category = this.$route.query.item.complainCatagory;
        this.choosetext = this.$route.query.item.complainCatagoryName;
        this.complaintReson = this.$route.query.item.content;
        this.chooseNote = true;
      }
    }
  },
  mounted() {
    this.commonGetUserInfo((userInfo) => {
      this.phone = userInfo.phone;
      this.complainant = userInfo.username;
    });

    // eslint-disable-next-line
    window.ImagesInfo = (params) => {
      var img = [];
      for (let i = 0; i < JSON.parse(params).length; i++) {
        img.push(
          "data:image/" +
            JSON.parse(params)[i].type +
            ";base64," +
            JSON.parse(params)[i].dataUrl
        );
      }
      for (let i = 0; i < img.length; i++) {
        var arr = img[i].split(",");
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        this.file = new File([u8arr], "aaa." + JSON.parse(params)[0].type, {
          type: mime,
        });
        this.onloadFile(this.file);
      }
    };
    window.loadComplete = () => {
      window.wii.app.invoke("setTitle", "投诉");
    };
  },
  methods: {
    init() {
      if (this.$route.query.greenwayIn !== null && this.$route.query.scenicId) {
        this.greenwayIn = this.$route.query.greenwayIn;
        this.scenicId = this.$route.query.scenicId;
        return false;
      }
      this.$http
        .get(`/appserver/v1/api/home/detail`, {
          headers: {
            latitude: this.lat, //纬度
            longitude: this.lng, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            let _data = data.data.data;
            // 在绿道内
            if (_data.current === "1") {
              this.greenwayIn = true;
              this.scenicId = _data.scenicId;
            } else {
              this.greenwayIn = false;
            }
          }
        });
    },
    showArea() {
      if (this.areaType) {
        this.areaType = false;
      } else {
        this.areaType = true;
        this.show = true;
      }
    },
    onSelect(item) {
      this.areaType = false;
      this.areaNote = true;
      this.name = item.name;
      this.value = item.value;
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      this.show = false;
    },
    clickOverlay() {
      this.areaType = false;
    },
    //获取投诉人所在园区
    getArea() {
      if (this.$route.query.initAddres && this.$route.query.option1) {
        this.option1 = this.$route.query.option1;
        this.areaNote = this.$route.query.initAddres.areaNote;
        this.name = this.$route.query.initAddres.name;
        this.value = this.$route.query.initAddres.value;
        return false;
      }
      if (this.lat === null || this.lng === null) {
        this.latitude = "1";
        this.longitude = "1";
      } else {
        this.latitude = this.lat;
        this.longitude = this.lng;
      }
      this.$http
        .get(`/appserver/v1/complaint/findGarden?range=${this.range}`, {
          headers: {
            latitude: this.latitude, //纬度
            longitude: this.longitude, //经度
          },
        })
        .then((data) => {
          if (data.data.ret === 0) {
            for (let i = 0; i < data.data.data.scenicList.length; i++) {
              if (this.option1.length <= data.data.data.scenicList.length - 1) {
                this.option1.push({
                  name: data.data.data.scenicList[i].scenic,
                  value: data.data.data.scenicList[i].poiId,
                });
              }
              if (this.scenicId === data.data.data.scenicList[i].scenicId) {
                this.areaNote = true;
                this.name = data.data.data.scenicList[i].scenic;
                this.value = data.data.data.scenicList[i].poiId;
              } else {
                this.optionTitle = "请选择事件发生地";
              }
            }
          } else {
            this.$toast(data.data.msg);
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
    ImagesUp() {
      window.wii.app.invoke("getGallery", {
        number: 10,
        callback: "ImagesInfo",
      });
    },
    //上传图片到服务器
    onloadFile(file) {
      if (this.gallerys.length > 10) {
        this.$toast("上传图片最多可10张");
        return false;
      }
      this.LoadShow = true;
      // 此时可以自行将文件上传至服务器
      let params = []; //创建form对象new FormData()
      // eslint-disable-next-line
      var u = navigator.userAgent,
        // eslint-disable-next-line
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        let fromData = new FormData();
        fromData.append("file", file);
        this.$http
          .post("/appserver/v1/upload/image", fromData)
          .then((res) => {
            if (res.data.ret == 0) {
              this.gallerys.push(res.data.data.fileUrl);
              this.gallerysLength = this.gallerys.length;
              if (this.gallerysLength > 10) {
                this.gallerys.splice(9, this.gallerysLength - 10);
                this.$toast("上传图片最多可10张");
              }
              this.ImagesLength();
              this.LoadShow = false;
            } else {
              this.$toast(res.data.msg);
            }
          })
          .catch((err) => {
            // eslint-disable-next-line
            console.log(err);
          });
      }
      if (isIOS) {
        if (Array.isArray(file) === true) {
          for (let i = 0; i < file.length; i++) {
            params.push(file[i].file);
            let fromData = new FormData();
            fromData.append("file", params[i]);
            this.$http
              .post("/appserver/v1/upload/image", fromData)
              .then((res) => {
                if (res.data.ret == 0) {
                  this.gallerys.push(res.data.data.fileUrl);
                  this.gallerysLength = this.gallerys.length;
                  if (this.gallerysLength > 10) {
                    this.gallerys.splice(9, this.gallerysLength - 10);
                    this.$toast("上传图片最多可10张");
                  }
                  this.ImagesLength();
                  this.LoadShow = false;
                } else {
                  this.$toast(res.data.msg);
                }
              })
              .catch((error) => {
                this.$toast("网络异常,检查网络再试试~~");
              });
          }
        } else {
          let fromData = new FormData();
          fromData.append("file", file.file);
          this.$http
            .post("/appserver/v1/upload/image", fromData)
            .then((res) => {
              if (res.data.ret == 0) {
                this.gallerys.push(res.data.data.fileUrl);
                this.gallerysLength = this.gallerys.length;
                if (this.gallerysLength > 10) {
                  this.gallerys.splice(9, this.gallerysLength - 10);
                  this.$toast("上传图片最多可10张");
                }
                this.ImagesLength();
                this.LoadShow = false;
              } else {
                this.$toast(res.data.msg);
              }
            })
            .catch((error) => {
              this.$toast("网络异常,检查网络再试试~~");
            });
        }
      }
    },
    ImagesLength() {
      if (this.gallerysLength >= 10) {
        this.tenShow = false;
      } else {
        this.tenShow = true;
      }
    },
    // 删除图片
    Delete(index) {
      if (index != -1) {
        if (this.gallerys.length < 10) {
          this.picDisabled = false;
        }
        this.gallerys.splice(index, 1);
        this.tenShow = true;
      }
    },
    //获取投诉类别
    getComplainttype() {
      this.$http
        .get(`/appserver/v1/complaint/complaintType`)
        .then((data) => {
          if (data.data.ret === 0) {
            for (let i in data.data.data) {
              var obj = data.data.data[i];
              for (var key in obj) {
                var newKey = "children";
                var newKey2 = "text";
                if (key == "child") {
                  obj[newKey] = obj[key];
                  delete obj[key];
                } else if (key == "prmValue") {
                  obj[newKey2] = obj[key];
                  delete obj[key];
                }
              }
              for (let j in data.data.data[i].children) {
                var obj2 = data.data.data[i].children[j];

                for (var key2 in obj2) {
                  var newKey3 = "text";
                  var newKey4 = "preprmKey";

                  if (key2 == "prmValue") {
                    obj2[newKey3] = obj2[key2];
                    delete obj2[key2];
                  } else if (key2 == "sortNum") {
                    obj2[newKey4] = data.data.data[i].prmKey;
                    delete obj2[key2];
                  }
                }
              }
              this.items.push(obj);
            }
          }
        })
        .catch((error) => {
          this.$toast("网络异常,检查网络再试试~~");
        });
    },

    //点击显示投诉类别
    showChoose() {
      if (this.showType) {
        this.showType = false;
      } else {
        this.showType = true;
      }
    },

    //选则投诉类别
    onItemClick(data) {
      this.choosetext = data.text;
      this.type = data.preprmKey;
      this.category = data.prmKey;
      this.activeId = data.id;
      this.showType = false;
      this.chooseNote = true;
    },

    //提交投诉
    onSubmit() {
      if (this.choosetext == "") {
        this.$toast("请选择投诉事件类别!");
        return false;
      }
      if (this.value == "") {
        this.$toast("请选择投诉事件发生地!");
        return false;
      }
      if (this.respondent == "") {
        this.$toast("请填写投诉对象!");
        return false;
      }
      if (this.complaintReson == "") {
        this.$toast("请填写投诉原因!");
        return false;
      }
      if (this.complaintReson.split(" ").join("").length === 0) {
        this.complaintReson = "";
        this.$toast("投诉原因请用文字描述");
        return false;
      }
      if (this.gallerys.length > 10) {
        this.$toast("最多可上传10张图片");
        return false;
      }
      this.disabledFbBtn = true;
      this.loadingbutton = true;
      this.loadingtext = "加载中...";
      let data = {
        areaId: this.value, //投诉对象所属园区
        complainant: this.complainant, //投诉人名称
        uid: this.uid,
        respondent: this.respondent, //投诉对象
        complaintReson: this.complaintReson, //投诉原因
        phone: this.phone,
        imgUrls: this.gallerys.toString(),
        channel: 2,
      };
      if (this.$route.query.typeWc == 1) {
        data["wisdomNum"] = this.respondent;
        data["type"] = "3";
        data["category"] = "9"; //投诉分类
      } else {
        data["type"] = this.type; //投诉类别
        data["category"] = this.category; //投诉分类
      }
      this.$http
        .post("/appserver/v1/complaint/submit", qs.stringify(data))
        .then((data) => {
          this.disabledFbBtn = false;
          if (data.data.ret == 0) {
            this.loadingbutton = false;
            this.loadingtext = "";
            this.success = false;
            //投诉成功跳转到投诉主页
            setTimeout(() => {
              // window.wii.app.invoke('closeWindow');
              this.$router.go(-1);
            }, 2000);
          } else {
            this.$toast(data.data.msg);
            this.loadingbutton = false;
          }
        })
        .catch((error) => {
          this.disabledFbBtn = false;
          this.$toast("网络异常,检查网络再试试~~");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
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
.nav_select {
  position: fixed;
  width: 100%;
  background: #fff;
}
.complain-submit {
  font-size: 14px;
  .content {
    /deep/ .van-field__body textarea {
      -webkit-user-select: auto;
    }
    .van-cell-group {
      padding: 0 20px;
    }
    /deep/ .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border: 0px;
    }
    .form-item {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin: 0 20px;
      border-bottom: 1px solid #e1e1e1;
      /deep/ .van-hairline--top-bottom::after,
      .van-hairline-unset--top-bottom::after {
        border: 0px;
      }
      /deep/ .van-ellipsis {
        min-width: 156px;
      }
      .form-label {
        display: flex;
        align-items: center;
        width: 150px;
        font-size: 14px;
        span {
          font-size: 11px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
        }
      }
      .wc-qt {
        line-height: 50px;
        flex: 1;
        padding-left: 10px;
      }
      .form-choose {
        flex: 1;
        display: flex;
        position: relative;
        color: #969799;
        .choosetype {
          line-height: 50px;
          display: flex;
          align-items: center;
          width: 100%;
          padding-left: 8px;
          i {
            position: absolute;
            right: 0;
          }
        }
      }
      /deep/.van-dropdown-menu__title {
        color: #969799;
      }
      .van-cell {
        line-height: 50px;
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .greenway {
    }
    .subbutton {
      padding: 0 20px;
      /deep/ .van-button--info {
        border: 0px;
      }
      .submit {
        background: #178357;
        color: #fff;
        width: 100%;
        height: 40px;
        font-size: 15px;
        border-radius: 3px;
        margin-top: 50px;
      }
    }

    .van-cell {
      padding-left: 0;
    }
    /deep/.van-field__label {
      width: 150px;
    }
    /deep/.van-cell__title {
      width: 150px;
    }
    /deep/.van-cell__value {
      padding-left: 8px;
    }
    .van-cell-group span {
      text-align: right;
      position: absolute;
      top: 14px;
      left: 79px;
      font-size: 11px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #37384d;
    }
    .up-img {
      border-top: 10px solid #f8f8f8;
      padding: 0 20px;
      padding-top: 20px;
      p {
        margin-bottom: 10px;
        span {
          font-size: 11px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: #37384d;
        }
      }
    }
  }

  /deep/.van-sidebar-item--select {
    font-weight: normal;
  }
  /deep/.van-tree-select__item {
    font-weight: normal;
  }

  .fb-btn {
    margin-top: 15px;
    .icon-img {
      .images-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .upload {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        border: #d2d2d2 dashed 0.5px;
        position: relative;
        /deep/ .van-icon {
          color: #d2d2d2;
          font-weight: 500;
          font-size: 20px;
        }
        & > input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
      .images {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
        margin-right: 10px;
        /deep/ .van-image__img {
          border-radius: 4px;
        }
        & > div {
          width: 80px;
          height: 80px;
          position: relative;
          .detele {
            position: absolute;
            top: -7.6px;
            right: -7.6px;
          }
        }
      }
      .icon-image {
        width: 20px;
        height: 20px;
      }
      .pic_delete {
        position: relative;
        .delImg {
          position: absolute;
          bottom: 5px;
          right: 10px;
          width: 15px;
          height: 15px;
        }
      }
    }
  }
  .chooseNote {
    color: #333;
  }
  .form-item {
    /deep/.van-field__body {
      height: 50px;
    }
    /deep/.van-field__control {
      height: 30px;
      line-height: 30px;
    }
  }
  /deep/.van-popup--bottom {
    height: 250px;
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
