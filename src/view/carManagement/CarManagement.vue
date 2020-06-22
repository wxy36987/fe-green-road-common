<template>
  <div class="car-management">
    <div class="content">
      <div class="car-list" ref="carPage">
        <div class="nodata" v-if="noData">
          <van-image :src="noListIcon" width="200px" height="200px"></van-image>
          <p>暂无数据</p>
        </div>
        <li class="list-item " v-for="(item, index) in listData" :key="index">
          <div class="item-wrap">
            <div class="item-img">
              <van-image
                :src="elIcon"
                width="50"
                height="50"
                v-if="item.carType == '1'"
              >
              </van-image>
              <van-image
                :src="fuelIcon"
                width="50"
                height="50"
                v-if="item.carType == '0'"
              >
              </van-image>
            </div>
            <div class="item-text">
              <p class="name" v-if="item.carType == '1'">新能源</p>
              <p class="name" v-if="item.carType == '0'">燃油车</p>
              <p>
                {{ item.carPlate }}
                <van-image
                  :src="editIcon"
                  width="20"
                  height="20"
                  class="edit"
                  @click="onEdit(item)"
                >
                </van-image>
                <van-image
                  :src="trashIcon"
                  width="20"
                  height="20"
                  class="trash"
                  @click="onTrash(item)"
                >
                </van-image>
              </p>
            </div>
          </div>
        </li>
      </div>
      <div class="bottom">
        <div class="adding-btn">
          <van-icon name="plus" />
          <van-button color="#188357" @click="showPopup">添加爱车</van-button>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="pop-wrap">
        <p class="title">添加/编辑车辆信息</p>
        <van-cell-group>
          <van-field
            v-model="carPlate"
            required
            label="车牌号"
            placeholder="请输入车牌号"
            @input="InputVal()"
          />
        </van-cell-group>

        <div class="input-item">
          <p>
            <span>车辆类型</span>
          </p>
          <van-radio-group v-model="radio">
            <van-radio name="1" checked-color="#178357">
              新能源
            </van-radio>
            <van-radio name="0" checked-color="#178357">
              燃油车
            </van-radio>
          </van-radio-group>
        </div>

        <!-- <van-field
					v-model="carOwnerPhone"
					required
					label="车主电话"
					placeholder="请输入车主电话"
				/> -->

        <div class="btn-apply">
          <div class="btn-cancel">
            <van-button color="#e8e8e8" @click="hidePopup">取消 </van-button>
          </div>
          <div class="btn-confirm">
            <van-button color="#188357" @click="onSubmit">提交 </van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <layer ref="layer"></layer>
  </div>
</template>
<script>
import qs from "qs";
import Layer from "@/components/Layer";
export default {
  data() {
    return {
      elIcon: require("../../assets/iconImage/electric.png"),
      fuelIcon: require("../../assets/iconImage/fuel.png"),
      editIcon: require("../../assets/iconImage/edit.png"), // 位置图标
      trashIcon: require("../../assets/iconImage/trash.png"), // 位置图标
      noListIcon: require("../../assets/iconImage/list@2x.png"), // 搜索无数据
      noData: false,
      show: false,
      radio: "", // 车类型种类
      carPlate: "", //车牌号
      carOwnerPhone: "", //车主联系方式
      listData: [],
      id: [],
      ifEdit: false,
      result: false,
    };
  },
  created() {
    this.commonGetUserInfo((userInfo) => {
      this.carOwnerPhone = userInfo.phone;
      this.getCarlist();
    });
  },
  mounted() {},
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    },
  },
  components: {
    Layer,
  },
  methods: {
    //动态修改样式
    changeFixed(clientHeight) {
      this.$refs.carPage.style.height = clientHeight - 126 + "px";
    },
    showPopup() {
      this.ifEdit = false;
      this.show = true;
    },
    hidePopup() {
      this.show = false;
    },
    // 车牌校验
    InputVal() {
      if (this.carPlate.length == 7) {
        var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        this.result = express.test(this.carPlate);
      }
      if (this.result === false) {
        this.$toast("请填写正确的车牌号码");
        return false;
      }
    },
    //获取车辆信息
    getCarlist() {
      var data = {
        carOwnerPhone: this.carOwnerPhone,
      };
      this.$http
        .post("/appserver/v1/carManage/queryCar", qs.stringify(data))
        .then((data) => {
          // console.log(data.data.ret);
          if (data.data.ret === 0) {
            if (data.data.data.length == 0) {
              this.noData = true;
              this.listData = [];
            } else {
              this.noData = false;
              this.listData = data.data.data;
            }
          } else {
            this.$toast(data.data.msg);
          }
        });
    },

    //修改
    onEdit(item) {
      this.id = item.id;
      this.show = true;
      this.radio = item.carType;
      this.carPlate = item.carPlate;
      // this.carOwnerPhone = item.carOwnerPhone;
      this.ifEdit = true;
    },

    onTrash(item) {
      var data = {
        id: item.id,
      };
      this.$http
        .post("/appserver/v1/carManage/delCar", qs.stringify(data))
        .then((data) => {
          // console.log(data.data.ret);
          if (data.data.ret === 0) {
            var layer = this.$refs.layer;
            layer.open({
              type: 1,
              content: "删除成功",
            });
            this.show = false;
            this.listData;
            this.getCarlist();
          } else {
            this.$toast(data.data.msg);
          }
        });
    },

    //提交
    onSubmit() {
      if (this.carPlate == "" || this.radio == "") {
        this.$toast("不能为空!");
        return false;
      }
      if (this.result == false) {
        this.$toast("请填写正确车牌号！");
        return false;
      }
      // if (!/^1[34578]\d{9}$/.test(this.carOwnerPhone)) {
      // 	this.$toast('请填写正确手机号码!');
      // 	return false;
      // }
      var data = "";
      if (this.ifEdit) {
        data = {
          id: this.id,
          // carOwnerPhone: this.carOwnerPhone,
          carType: this.radio,
          carPlate: this.carPlate,
        };
        this.$http
          .post("/appserver/v1/carManage/editCar", qs.stringify(data))
          .then((data) => {
            // console.log(data.data.ret);
            if (data.data.ret === 0) {
              this.show = false;
              this.getCarlist();
              this.radio = "";
              this.carPlate = "";
            }
          });
      } else {
        data = {
          carOwnerPhone: this.carOwnerPhone,
          carType: this.radio,
          carPlate: this.carPlate,
        };
        this.$http
          .post("/appserver/v1/carManage/addCar", qs.stringify(data))
          .then((data) => {
            // console.log(data.data.ret);
            if (data.data.ret === 0) {
              this.show = false;
              this.getCarlist();
              this.radio = "";
              this.carPlate = "";
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
.car-management {
  font-size: 14px;
  .content {
    .car-list {
      overflow: auto;
      li {
        .item-wrap {
          display: flex;
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          .item-img {
            width: 60px;
          }
          .item-text {
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            p {
              width: 100%;
              color: #555959;
              position: relative;
              /deep/.van-image {
                position: absolute;
              }
              .edit {
                right: 30px;
              }
              .trash {
                right: 0;
              }
            }
            .name {
              color: #37384d;
              font-weight: 600;
            }
          }
        }
      }
      .nodata {
        text-align: center;
      }
    }

    .bottom {
      position: fixed;
      bottom: 0px;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      .adding-btn {
        width: 100%;
        position: relative;
        /deep/ .van-button {
          width: 100%;
          border-radius: 3px;
          border: 0px;
          height: 40px;
        }
        .van-icon {
          font-size: 25px;
          position: absolute;
          bottom: 8px;
          left: 30%;
          z-index: 99;
          color: #fff;
        }
      }
    }
  }
  .pop-wrap {
    padding: 20px;
    padding-bottom: 40px;
    p.title {
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 20px;
    }
    /deep/ .van-cell--required::before {
      font-size: 0;
    }
    /deep/ .van-cell {
      padding: 0;
      line-height: 40px;
    }
    /deep/ .van-field__control {
      border: 1px solid #ebebeb;
      padding-left: 10px;
    }
    .input-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      min-height: 60px;
      /deep/ .van-cell {
        padding: 0px;
        padding-left: 0px;
        padding-right: 0px;
        width: 240px;
        line-height: 40px;
      }
      /deep/ .van-radio-group {
        width: 240px;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      /deep/ .van-radio {
        &:nth-of-type(1) {
          margin-right: 20px;
        }
      }
      /deep/ .van-field__label {
        width: 90px;
      }
      & > p {
        width: 90px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(55, 56, 77, 1);
        & > i {
          font-size: 11px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(55, 56, 77, 1);
          margin-left: 6px;
        }
      }
      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 ~ 18 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10 ~ 11 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
      ::-ms-input-placeholder {
        /* Microsoft Edge */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }

      ::placeholder {
        /* 大部分现代浏览器 */
        font-size: 15px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
    }
    .btn-apply {
      display: flex;
      margin-top: 20px;
      /deep/ .van-button {
        width: 95%;
        border-radius: 3px;
        border: 0px;
        height: 40px;
      }
      .btn-cancel {
        flex: 1;
        /deep/.van-button__text {
          color: #333;
        }
      }
      .btn-confirm {
        flex: 1;
      }
    }
  }
  /deep/.van-hairline--top-bottom::after {
    border-width: 0;
  }
  /deep/.van-hairline-unset--top-bottom::after {
    border-width: 0;
  }
  /deep/.van-cell:not(:last-child)::after {
    border-width: 0;
  }
}
</style>
