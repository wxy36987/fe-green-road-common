<template>
  <div class="mask" v-if="layershow">
    <div class="layermbox">
      <div class="laymshade" :class="{'laymshadeBgNo': type >= 2 ? false : shade}" @click="laymshadeClose"></div>
      <div class="layermmain" :class="layermmain[type]">
        <template v-if="type == 1">
          <div class="section">
            <transition name="fade">
              <div class="layermchild layermPrompts" v-if="layershow">
                <section class="layermcont">
                  <p class="text">{{content}}</p>
                </section>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        layershow: false, // 是否显示弹出框
        type: 1, // 显示类型
        shade: true, // 蒙层
        shadeClose: false, // 蒙层是否点击隐藏
        content: '全力加载中',  // 默认内容
        time: 2, // 倒计时隐藏时间
        callback: '', // 是否回调-type大于1
        no: '', // 点击确认按钮回调
        yes: '' // 点击取消按钮回调
      }
    },
    created () {
      this.layermmain = ['layermmain0']
    },
    methods: {
      open (opt) {
        this.close()
        if (opt) {
          for (var key in opt) {
            this.$data[key] = opt[key]
          }
          this.layershow = true
          if (this.time && this.type === 1) {
            setTimeout(() => {
              this.close()
              this.callback && this.callback()
            }, this.time * 1000)
            return false
          }
        }
        this.callback && this.callback()
      },
      close () {
        this.layershow = false
        this.type = 0
        this.shade = true
        this.shadeClose = false
        this.content = '全力加载中'
      },
      laymshadeClose () {
        this.shadeClose && this.close()
      }
    },
    computed: {
    }
  }
</script>
<style lang="scss" scoped>
  .layermbox{
    position:fixed;
    left: 0;
    top: 0;
    z-index:19891014;
    right: 0;
    bottom: 0;
  }
  .laymshade,.layermmain{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index:19891014;
  }
  .laymshadeBgNo{
    background: none;
  }
  .laymshade{
    background: rgba(0,0,0,0.3);
  }
  .layermmain{
    display: table;
    pointer-events: none;
  }
  .section{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .layermchild{
    width: 14rem;
    height: 7.5rem;
    position: relative;
    display: inline-block;
    text-align: center;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 15px rgba(0,0,0,.1);
    pointer-events: auto;
    color: #4a4a4a;
    overflow: hidden;
    box-sizing: border-box;
  }
  .layermPrompts{
    background: rgba(0,0,0,.7);
    width: auto;
    height: auto;
    min-width: 7rem;
    min-height: 6rem;
    max-width: 14rem;
    color: #fff;
    padding: 0 0.8rem;
  }
  .fade-enter-active,.fade-leave-active{
    transition: all 0.3s;
  }
  .fade-enter,.fade-leave-active{
    opacity: 0;
    transform: scale(0);
  }
  .layermcont{
    display: block;
    padding: 0.8rem 0.8rem 0.4rem;
    line-height: 1rem;
    display:flex;
    align-items:center;
    justify-content: center;
    flex-direction: column;
    min-height: 5rem;
    box-sizing: border-box;
  }
  .img{
    display: block;
    width: 2.2rem;
    height: 2.2rem;
    margin: 0.2rem auto;
  }
  .layermbtn{
    width: 100%;
    display: flex;
    height: 2.4rem;
    line-height: 2.4rem;
    border-top: 1px solid #ebebeb;
    font-size: 0.9rem;
  }
  .layermspan{
    display: block;
    flex: 1;
  }
  .layermspan:first-child{
    border-right: 1px solid #ebebeb;
    color: #4a4a4a;
  }
  .layermspan::last-child{
    border: none;
    color: #e60012;
  }
  .layermmain0{
    display:flex;
    align-items:center;
    justify-content: center;
  }

</style>
