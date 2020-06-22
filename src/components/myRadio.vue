<template>
  <div style="height:100%;width:100%">
    <audio
      ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      :autoplay='autoPlay'
      preload="auto"
      :src="src"
      controls="controls"
      style="display:none;"
    ></audio>

    <div class="audio-box" style="height:100%;width:100%">
      <div class="play-div">
        <img v-if="!audio.playing"
          class="play-btn"
          :src="imgStart"
          @click="startPlay"
        />
        <img v-else
          class="play-btn"
          :src="imgStop"
          @click="pausePlay"
        />
      </div>

      <div class="audio-timer">
        <!-- <Slider v-model="sliderPercent" @on-change="sliderMove"></Slider> -->
        <van-slider v-model="sliderPercent" @change="sliderMove"  bar-height="4px" active-color="#188357"/>
        <span class="timers">
          {{ audio.currentTime | formatSecond}}/{{ audio.maxTime | formatSecond}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
	import imgStart from '@/assets/iconImage/ic_play.png';
  import imgStop from '@/assets/iconImage/ic_play2.png';
  // import { clearInterval } from 'timers';

  // 将整数转换成 时：分：秒的格式
  function realFormatSecond(second) {
    var secondType = typeof second;
  
    if (secondType === "number" || secondType === "string") {
      second = parseInt(second);
  
      var hours = Math.floor(second / 3600);
      second = second - hours * 3600;
      var mimute = Math.floor(second / 60);
      second = second - mimute * 60;
      // hours + ':' +
      return ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
    } else {
      return "0:00:00";
    }
  }

  export default {
    props: {
      src: {
        default: ''
      },
      imgStart: {
        default: imgStart
      },
      imgStop: {
        default: imgStop
      },
      autoPlay: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sliderPercent: 0,
        audio: {
          // 该字段是音频是否处于播放状态的属性
          playing: false,
          // 音频当前播放时长
          currentTime: 0,
          // 音频最大播放时长
          maxTime: 0,
          minTime: 0,
        },
        isAndroid: false
      };
    },
    created() {
      var u = navigator.userAgent
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
      this.isAndroid = isAndroid
    },
    watch:{
      src () {
        // if (!this.isAndroid && this.autoPlay) {
        //   window.wii.app.invoke("playAudio", { url: n });
        // }
        if (this.isAndroid && this.autoPlay) {
          this.audio.playing = true;
        }
      }
    },
    mounted() {
    },
    methods: {
      startPlay () {
        this.audio.playing = true;
        var u = navigator.userAgent
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          this.$refs.audio.play();
        } else {
          // window.wii.app.invoke("playAudio", { url: this.src});
        }
        if (isIOS) {
          window.wii.app.invoke("playAudio", { url: this.src})
        }
      },
      pausePlay () {
        if (this.isAndroid) {
          this.$refs.audio.pause();
        }
        this.audio.playing = false;
      },
      // 当音频播放
      onPlay() {
        this.audio.playing = true;
      },
      // 当音频暂停
      onPause() {
        this.audio.playing = false;
        var startTime = parseInt(this.audio.currentTime);

        if (startTime >= this.audio.maxTime) {
          this.sliderPercent = 0;
          this.audio.currentTime = "00:00";
        }
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      // 结束时间
      onLoadedmetadata(res) {
        this.audio.maxTime = parseInt(res.target.duration);
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      // 当音频当前时间改变后，进度条也要改变
      onTimeupdate(res) {
        this.audio.currentTime = res.target.currentTime;
        this.sliderPercent = parseInt(
          (this.audio.currentTime / this.audio.maxTime) * 100
        );
      },
      sliderMove(percent) {
        this.setCurrentTime(percent);
        if (this.isAndroid) {
          this.$refs.audio.play();
        }
      },
      setCurrentTime(percent) { // 将 进度条 百分比转换为播放时间, 并设置当前时间
        const { maxTime, minTime } = this.audio;
        let value = (percent * maxTime) / 100;

        if (value > maxTime) {
          value = maxTime;
        } else if (value < minTime) {
          value = minTime;
        }
        this.$refs.audio.currentTime = value;
      },
    },
    filters: {
      // 将整数转化成时分秒
      formatSecond(second = 0) {
        return realFormatSecond(second);
      }
    }
  };
</script>

<style >
.audio-box{
  display: flex;
  align-items: center;
}

.play-div {
  /* float: left; */
}
.play-btn {
  width: 40px;
  height: 40px;
}

.audio-timer {
  width: 200px;
  margin-left: 15px;
  /* float: left; */
  flex: 1;
  padding-top: 20px;
}
.audio-timer .van-slider__button-wrapper .van-slider__button{
  width: 0 !important;
  height: 0 !important;
}
.van-slider .van-slider__bar{
  height: 4px!important;
  background: #188357;
}
.timers {
  float: right;
  color: #999999;
  padding-top: 5px;
}
</style>