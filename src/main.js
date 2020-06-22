// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import axios from "axios";
import router from "./router";
// import Router from "vue-router";
import Vant from "vant";
import "vant/lib/index.css";
import "@/assets/css/reset.css";
import "../node_modules/swiper/css/swiper.css";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import VueVideoPlayer from "vue-video-player";
import filters from "./filters/index";
import VueAwesomeSwiper from "vue-awesome-swiper";
import VueCookie from "vue-cookie";
import VueScroller from "vue-scroller";
import store from "@/components/store/index.js";
Vue.config.productionTip = false;
// import Vconsole from "vconsole";
// var vConsole = new Vconsole();
// Vue.use(vConsole);
Vue.use(Vant);
Vue.use(VueVideoPlayer);
Vue.use(VueAwesomeSwiper);
Vue.use(VueCookie);
Vue.use(VueScroller);
// 引入公用js
import utils from "./common/js/utils.js";
Vue.use(utils);

// var originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => err);
// };

// document.cookie = "w_uid=5e17e16cc0e56909e866a4b7";
// document.cookie = "w_open_id=13712428136";
// document.cookie = "w_skey=lE1deEK7Z20YcLTEAN46Bs91WZV04Hpv";

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://94.191.92.153:8099'
Vue.prototype.axios = axios;

// var host = process.env.VUE_APP_baseURL
// var host = 'https://app.tfgreenroad.com'
// var host = 'https://tgr.wiiqq.com'
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
var instance = axios.create({
  baseURL: process.env.VUE_APP_baseURL,
  withCredentials: true,
});
Vue.prototype.$http = instance;

Vue.prototype.baseURL = process.env.VUE_APP_saishiBaseUrl;
Vue.prototype.domain = process.env.VUE_APP_proUrl;
Vue.prototype.baseURL = process.env.VUE_APP_SHUrl; // 赛事接口
Vue.prototype.saishi = process.env.VUE_APP_saishiUrl; // 赛事h5地址
Vue.prototype.uid = store.getcookieUid();
Vue.prototype.skey = store.getcookieSkey();
Vue.prototype.open_id = store.getcookieOpen();
// eslint-disable-next-line
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
/* eslint-disable no-new */
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
