import Vue from "vue";
import Router from "vue-router";
Vue.use(Router); //对路由组件进行懒加载
export default new Router({
  routes: [
    {
      // 首页
      path: "/",
      name: "HomePage",
      component: () => import("@/view/homePage/HomePage"),
    },
    {
      // 个人中心
      path: "/personalCenter",
      name: "PersonalCenter",
      component: () => import("@/view/personalCenter/PersonalCenter"),
    },
    {
      // 问答首页
      path: "/QuestionHome",
      name: "QuestionHome",
      component: () => import("@/view/Questions/QuestionHome"),
    },
    {
      // 问答详情
      path: "/QuestionDetails",
      name: "QuestionDetails",
      component: () => import("@/view/Questions/QuestionDetails"),
    },
    {
      // 我的问答
      path: "/MyQuestion",
      name: "MyQuestion",
      component: () => import("@/view/Questions/MyQuestion"),
    },
    {
      // 我要提问
      path: "/IWantQuestion",
      name: "IWantQuestion",
      component: () => import("@/view/Questions/IWantQuestion"),
    },
    {
      // 回答
      path: "/Answer",
      name: "Answer",
      component: () => import("@/view/Questions/Answer"),
    },
    {
      // 问题话题页
      path: "/QuestionTopic",
      name: "QuestionTopic",
      component: () => import("@/view/Questions/QuestionTopic"),
    },
    {
      // 回答详情
      path: "/AnswerDetails",
      name: "AnswerDetails",
      component: () => import("@/view/Questions/AnswerDetails"),
    },
    {
      // 全部评论
      path: "/AllComments",
      name: "AllComments",
      component: () => import("@/view/Questions/AllComments"),
    },
    {
      // 评论详情
      path: "/CommentsDetails",
      name: "CommentsDetails",
      component: () => import("@/view/Questions/CommentsDetails"),
    },
    {
      // 绿道名片
      path: "/greenwayCard",
      name: "greenwayCard",
      component: () => import("@/view/greenwayCard/GreenwayCard"),
    },
    {
      // 景区列表
      path: "/scenicList",
      name: "scenicList",
      component: () => import("@/view/scenicList/ScenicList"),
    },
    {
      // 景区名片
      path: "/scenicCard",
      name: "scenicCard",
      component: () => import("@/view/scenicCard/ScenicCard"),
    },
    {
      // 景区名片热力图
      path: "/scenicHotMap",
      name: "scenicHotMap",
      component: () => import("@/view/scenicHotMap/scenicHotMap"),
    },
    {
      // 全部景点
      path: "/allScenic",
      name: "allScenic",
      component: () => import("@/view/allScenic/AllScenic"),
    },
    {
      // 景点详情
      path: "/scenicDetails",
      name: "scenicDetails",
      component: () => import("@/view/scenicDetails/ScenicDetails"),
    },
    {
      // 攻略列表
      path: "/strategyList",
      name: "strategyList",
      component: () => import("@/view/strategyList/StrategyList"),
    },
    {
      // 全部评论列表
      path: "/allDiscussList",
      name: "allDiscussList",
      component: () => import("@/view/allDiscussList/AllDiscussList"),
    },
    {
      // 评论详情
      path: "/discussDetails",
      name: "discussDetails",
      component: () => import("@/view/discussDetails/DiscussDetails"),
    },
    {
      // 攻略详情
      path: "/strategyDetails",
      name: "strategyDetails",
      component: () => import("@/view/strategyDetails/StrategyDetails"),
    },
    {
      // 攻略详情分享页
      path: "/strategyShare",
      name: "strategyShare",
      component: () => import("@/view/strategyShare/StrategyShare"),
    },
    {
      // 线路列表
      path: "/lineList",
      name: "lineList",
      component: () => import("@/view/lineList/LineList"),
    },
    {
      // 名片线路列表
      path: "/LineListTwo",
      name: "lineListTwo",
      component: () => import("@/view/lineListTwo/LineListTwo"),
    },
    {
      // 绿道线路详情
      path: "/lineDetails",
      name: "lineDetails",
      component: () => import("@/view/lineDetails/LineDetails"),
    },
    {
      // 绿道线路详情
      path: "/lineDetailsShare",
      name: "lineDetailsShare",
      component: () => import("@/view/lineDetails/LineDetailsShare"),
    },
    {
      // 景区线路详情
      path: "/scenicLineDetails",
      name: "scenicLineDetails",
      component: () => import("@/view/scenicLineDetails/ScenicLineDetails"),
    },
    {
      // 景区线路详情
      path: "/scenicLineDetailsShare",
      name: "scenicLineDetailsShare",
      component: () =>
        import("@/view/scenicLineDetails/ScenicLineDetailsShare"),
    },
    {
      // 意见反馈
      path: "/feedback",
      name: "feedback",
      component: () => import("@/view/feedback/Feedback"),
    },
    {
      // 意见反馈-我要反馈
      path: "/feedbackBtn",
      name: "feedbackBtn",
      component: () => import("@/view/feedbackBtn/FeedbackBtn"),
    },
    {
      // 问卷调查
      path: "/questionnaire",
      name: "questionnaire",
      component: () => import("@/view/questionnaire/Questionnaire"),
    },
    {
      // 我的反馈
      path: "/myFeedback",
      name: "myFeedback",
      component: () => import("@/view/myFeedback/MyFeedback"),
    },
    {
      // 一键求助
      path: "/oneSeekHelp",
      name: "oneSeekHelp",
      component: () => import("@/view/oneSeekHelp/OneSeekHelp"),
    },
    {
      // 在线求助
      path: "/onlineHelp",
      name: "onlineHelp",
      component: () => import("@/view/onlineHelp/OnlineHelp"),
    },
    {
      // 我的收藏
      path: "/myCollection",
      name: "myCollection",
      component: () => import("@/view/myCollection/MyCollection"),
    },
    {
      // 活动赛事列表
      path: "/activityEvent",
      name: "activityEvent",
      component: () => import("@/view/activityEvent/ActivityEvent"),
    },
    {
      // 活动列表
      path: "/activityList",
      name: "activityList",
      component: () => import("@/view/activityList/ActivityList"),
    },
    {
      // 活动赛事详情
      path: "/activityDetail",
      name: "activityDetail",
      component: () => import("@/view/activityDetail/ActivityDetail"),
    },
    {
      // 立即报名填报
      path: "/enroll",
      name: "enroll",
      component: () => import("@/view/enroll/Enroll"),
    },
    {
      // 我的活动赛事
      path: "/myActivityEvent",
      name: "myActivityEvent",
      component: () => import("@/view/myActivityEvent/MyActivityEvent"),
    },
    {
      // 找厕所首页
      path: "/findWC",
      name: "findWC",
      component: () => import("@/view/findWC"),
    },
    {
      //厕所评价
      path: "/wcEvaluation",
      name: "wcEvaluation",
      component: () => import("@/view/findWC/wcEvaluation"),
    },
    {
      //厕所详情
      path: "/wcDetail",
      name: "wcDetail",
      component: () => import("@/view/findWC/wcDetail"),
    },
    {
      //停车助手
      path: "/parkingEn",
      name: "parkingEn",
      component: () => import("@/view/parking/entrance"),
    },
    {
      // 投诉
      path: "/complain",
      name: "complain",
      component: () => import("@/view/complain/Complain"),
    },
    {
      // 我的投诉
      path: "/myComplain",
      name: "myComplain",
      component: () => import("@/view/myComplain/MyComplain"),
    },
    {
      // 我的投诉详情
      path: "/myComplainDetails",
      name: "myComplainDetails",
      component: () => import("@/view/myComplainDetails/MyComplainDetails"),
    },
    {
      // 我的投诉评价
      path: "/myComplainEvaluate",
      name: "myComplainEvaluate",
      component: () => import("@/view/myComplainDetails/MyComplainEvaluate"),
    },
    {
      // 提交投诉
      path: "/complainSubmit",
      name: "complainSubmit",
      component: () => import("@/view/complainSubmit/ComplainSubmit"),
    },
    {
      // 在线客服
      path: "/onlineService",
      name: "onlineService",
      component: () => import("@/view/onlineService"),
    },
    {
      //车辆管理
      path: "/carManagement",
      name: "carManagement",
      component: () => import("@/view/carManagement/CarManagement"),
    },
    {
      //停车助手首页
      path: "/entrance",
      name: "entrance",
      component: () => import("@/view/entrance/Entrance"),
    },
    {
      //停车场
      path: "/parking",
      name: "parking",
      component: () => import("@/view/findParking/index"),
    },
    {
      //停车场搜索
      path: "/parkingSearch",
      name: "parkingSearch",
      component: () => import("@/view/findParking/parkingSearch"),
    },
    {
      //停车场详情
      path: "/parkingDetail",
      name: "parkingDetail",
      component: () => import("@/view/findParking/parkingDetail"),
    },
    {
      // 分享问题详情页
      path: "/questionDetailsShare",
      name: "questionDetailsShare",
      component: () => import("@/view/shareFile/QuestionDetailsShare"),
    },
    {
      // 分享回答详情页
      path: "/answerDetailsShare",
      name: "answerDetailsShare",
      component: () => import("@/view/shareFile/AnswerDetailsShare"),
    },
    {
      // 分享活动详情页
      path: "/activityDetailShare",
      name: "activityDetailShare",
      component: () => import("@/view/shareFile/ActivityDetailShare"),
    },
    {
      //停车缴费
      path: "/parkingPay",
      name: "parkingPay",
      component: () => import("@/view/parkingPay/parkingPay"),
    },
    {
      //停车缴费信息
      path: "/parkingPayInfo",
      name: "parkingPayInfo",
      component: () => import("@/view/parkingPay/parkingPayInfo"),
    },
    {
      //停车缴费完成
      path: "/parkingPayComplete",
      name: "parkingPayComplete",
      component: () => import("@/view/parkingPay/parkingPayComplete"),
    },
    {
      //游记详情
      path: "/travelDetail",
      name: "travelDetail",
      component: () => import("@/view/Travel/travelDetail"),
    },
    {
      //图片列表
      path: "/scenicPicList",
      name: "scenicPicList",
      component: () => import("@/view/scenicDetails/ScenicPicList"),
    },
    {
      //游记详情
      path: "/topicDetail",
      name: "topicDetail",
      component: () => import("@/view/topicDetail/topicDetail"),
    },
    {
      //隐私协议
      path: "/privacy",
      name: "privacy",
      component: () => import("@/view/privacy/privacy"),
    },
    {
      //周边详情
      path: "/nearbyDetail",
      name: "nearbyDetail",
      component: () => import("@/view/nearby/nearbyDetail"),
    },
    {
      //视频播放
      path: "/videoPlayPage",
      name: "videoPlayPage",
      component: () => import("@/view/scenicDetails/videoPlayPage"),
    },
    // {
    //   //架骨屏
    //   path: "/skeleton",
    //   name: "skeleton",
    //   component: () => import("@/skeleton/skeleton"),
    // },
  ],
});
