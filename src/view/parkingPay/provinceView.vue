<template>
  <div
    :class="[
      'animated feikuai',
      show ? 'fadeIn' : 'fadeOut',
      show ? 'show' : '',
    ]"
    v-show="show"
  >
    <div
      :class="[
        'modal-warpper animated feikuai',
        show ? 'fadeIn' : 'fadeOut',
        show ? 'show' : '',
      ]"
      @click="onClose"
    ></div>
    <div
      :class="[
        'modal-content  animated feikuai',
        show ? 'fadeIn' : 'fadeOut',
        show ? 'show' : '',
      ]"
    >
      <div class="modal-title">
        <span>{{ title }}</span>
        <img
          src="../../assets/iconImage/cancel.png"
          alt=""
          srcset=""
          @click="onClose"
        />
      </div>
      <div class="modal-body">
        <div
          v-for="(item, index) in provinceArr"
          :key="index"
          class="province"
          @click="selectProvince(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      provinceArr: [
        "川",
        "京",
        "津",
        "沪",
        "渝",
        "冀",
        "豫",
        "云",
        "辽",
        "黑",
        "湘",
        "皖",
        "鲁",
        "新",
        "苏",
        "浙",
        "赣",
        "鄂",
        "桂",
        "甘",
        "晋",
        "蒙",
        "陕",
        "吉",
        "闽",
        "贵",
        "粤",
        "青",
        "藏",
        "宁",
        "琼",
        "使",
        "领",
      ],
    };
  },
  props: {
    title: {
      type: String,
      default: "请选择省区",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectProvince: function(index) {
      this.$emit("provinceStr", this.provinceArr[index]);
      this.onClose();
    },
    remove: function() {},
    onClose() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.province {
  height: 60px;
  line-height: 60px;
  border-bottom: solid 1px #e8e8e8;
  font-size: 14px;
  font-weight: 400;
  color: rgba(85, 89, 89, 1);
}
.modal-body {
  overflow: hidden;
}
.provinceView {
  height: 100px;
}
.modal-warpper {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1003;
  display: none;
}

.modal-warpper.feikuai {
  animation-duration: 0.4s;
}

.modal-warpper.show {
  display: block;
}

.modal-content {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 15px 20px 10px 20px;
  // border-radius: 24px 24px 0 0;
  width: 100%;
  background-color: #fff;
  z-index: 1004;
  box-sizing: border-box;
  max-height: 300px;
  background: #fff;
  overflow: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}

.modal-content.feikuai {
  animation-duration: 0.4s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.fadeOut {
  animation-name: fadeOut;
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}

.fadeOutDown {
  animation-name: fadeOutDown;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fadeInUp {
  animation-name: fadeInUp;
}
.modal-title {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
  line-height: 17px;
  span {
    flex: 1;
  }
  img {
    height: 18px;
    width: 18px;
    float: right;
  }
}
</style>
