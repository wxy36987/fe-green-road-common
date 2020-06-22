<template lang="">
  <!-- <div class='panel-wrap'  v-if="isShow" data-value="exit"  @click='close_da'> -->
  <div class="vehicle-panel" v-if="isShow">
    <div class="topView">
      <div class="closeButton" @click="close_da">取消</div>
    </div>
    <!--省份简写键盘-->
    <div v-if="keyBoardType === 1">
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyVehicle1"
          @click="vehicleTap(item)"
          :key="idx + item"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyVehicle2"
          @click="vehicleTap(item)"
          :key="idx + item"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyVehicle3"
          @click="vehicleTap(item)"
          :key="idx + item"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row-last">
        <div
          class="vehicle-panel-row-button vehicle-panel-row-button-last"
          @click="vehicleTap(item)"
          v-for="(item, idx) in keyVehicle4"
          :style="{ border: buttonBorder }"
          :key="idx + item"
        >
          {{ item }}
        </div>
        <div
          :style="{ border: buttonBorder }"
          class="vehicle-panel-row-button vehicle-panel-row-button-img"
        >
          <img
            src="../../assets/iconImage/keyboard_Delete@2x.png"
            class="vehicle-en-button-delete"
            @click="vehicleTap('delete')"
            mode="aspectFit"
          />
        </div>
      </div>
    </div>
    <div v-if="keyBoardType === 2">
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button vehicle-panel-row-button-number"
          @click="numberType == true ? vehicleTap(item) : null"
          v-for="(item, idx) in keyNumber"
          :style="{
            border: buttonBorder,
            backgroundColor: numberType ? '#fff' : '#eee',
          }"
          :key="item + idx"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyEnInput1"
          @click="vehicleTap(item)"
          :key="idx + item"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row">
        <div
          class="vehicle-panel-row-button"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyEnInput2"
          @click="vehicleTap(item)"
          :key="idx + item"
        >
          {{ item }}
        </div>
      </div>
      <div class="vehicle-panel-row-last">
        <div
          class="vehicle-panel-row-button vehicle-panel-row-button-last"
          @click="vehicleTap(item)"
          :style="{ border: buttonBorder }"
          v-for="(item, idx) in keyEnInput3"
          :key="idx + item"
        >
          {{ item }}
        </div>
        <div class="vehicle-panel-row-button vehicle-panel-row-button-number">
          港
        </div>
        <div class="vehicle-panel-row-button vehicle-panel-row-button-number">
          澳
        </div>
        <div
          :style="{ border: buttonBorder }"
          class="vehicle-panel-row-button vehicle-panel-row-button-img"
        >
          <img
            src="../../assets/iconImage/keyboard_Delete@2x.png"
            class="vehicle-en-button-delete"
            @click="vehicleTap('delete')"
            mode="aspectFit"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
// import func from '../../../vue-temp/vue-editor-bridge';
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    oinp: {
      type: String,
      default: "",
    },
    keyBoardType: {
      type: Number,
      default: 1,
    },
    numberType: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      keyVehicle1: ["京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏"],
      keyVehicle2: ["浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤"],
      keyVehicle3: ["琼", "川", "贵", "云", "陕", "甘", "青", "蒙"],
      keyVehicle4: ["桂", "宁", "新", "藏", "使", "领"],
      keyNumber: "1234567890",
      keyEnInput1: "ABCDEFGHJK",
      keyEnInput2: "LMNPQRSTUV",
      keyEnInput3: "WXYZ",
      buttonBorder: "1px solid #ccc",
      numberDisable: this.numberType,
    };
  },
  methods: {
    vehicleTap: function(event) {
      //   console.log(event);
      switch (event) {
        case "delete":
          this.$emit("delete");
          this.$emit("inputchange", event);
          break;
        case "ok":
          this.$emit("ok");
          break;
        case "exit":
          this.$emit("exit");
          break;
        default:
          this.$emit("inputchange", event);
      }
    },
    close_da() {
      this.$emit("exit");
    },
    check() {
      if (this.keyBoardType == 1) {
        this.keyBoardType = 2;
      } else if (this.keyBoardType == 2) {
        this.keyBoardType = 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
:host {
  width: 100%;
}
.panel-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.topView {
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  .closeButton {
    font-size: 15px;
    line-height: 15px;
    float: right;
  }
}
.vehicle-panel {
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1000;
  background: #d3d5db;
  padding-bottom: 0.68rem;
}

.vehicle-panel-row {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}
.vehicle-panel-row-last {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vehicle-panel-row-button {
  background-color: white;
  color: rgb(51, 51, 51);
  width: 30px;
  height: 40px;
  margin: 2px;
  text-align: center;
  line-height: 40px;
  border-radius: 3px;
  font-size: 15px;
}
.vehicle-panel-row-button-number {
  background-color: #eee;
}
.vehicle-panel-row-button-last {
  width: 30px;
  height: 40px;
  line-height: 40px;
}
.vehicle-hover {
  background-color: #ccc;
}
.vehicle-panel-row-button-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
}
.vehicle-en-button-delete {
  width: 30px;
  height: 30px;
}
</style>
