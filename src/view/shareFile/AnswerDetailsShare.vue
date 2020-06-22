<template>
  <div class="answer-details">
    <div class="wrap">
      <div class="user-news">
        <div class="problem">
          <p>{{ dataReceive.question_title }}</p>
          <!-- <p>
            <span
              v-for="(x,i) in userNews.tags"
              :key="i"
            >{{x}}</span>
          </p>-->
        </div>
        <div class="problem-describe">
          <div class="user">
            <van-image
              round
              :src="
                dataReceive.head_img_url === null ||
                dataReceive.head_img_url === ''
                  ? headerUrl
                  : dataReceive.head_img_url
              "
              width="32px"
              height="32px"
            ></van-image>
            <div>
              <p v-if="dataReceive.nick !== null">
                <span v-if="dataReceive.nick !== ''">{{
                  dataReceive.nick
                }}</span>
              </p>
              <p class="p_t">
                {{ dataReceive.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
              </p>
            </div>
          </div>
          <p>{{ dataReceive.content }}</p>
          <!-- <van-image
            v-for="(item,index) in dataReceive.image"
            :key="index"
            :src="item"
            width="100%"
          ></van-image> -->
          <van-image
            v-if="dataReceive.image"
            :src="dataReceive.image"
            width="100%"
          ></van-image>
        </div>
      </div>
      <div class="pl-box">
        <div class="pl-title">
          <van-cell title="评论" :value="dataReceive.comment_count + '条'" />
        </div>
        <div class="list" v-if="dataReceive.comment_count != 0">
          <div class="list-item" v-for="(item, index) in list" :key="index">
            <div class="user-newsbox">
              <van-image
                round
                :src="
                  item.head_img_url === null || item.head_img_url === ''
                    ? headerUrl
                    : item.head_img_url
                "
                width="32px"
                height="32px"
              ></van-image>
              <div class="right">
                <div>
                  <p v-if="item.nick !== null">
                    <span v-if="item.nick !== ''">{{ item.nick }}</span>
                  </p>
                  <p class="p-t">
                    {{ item.submit_time | dateFrm("YYYY-MM-DD HH:mm:ss") }}
                  </p>
                </div>
                <div>
                  <div v-if="item.reply_count != 0">
                    <van-image
                      width="14px"
                      height="14px"
                      :src="plIcon"
                    ></van-image>
                    <span>{{ item.reply_count }}</span>
                  </div>
                  <div v-if="item.support != 0">
                    <van-image
                      width="14px"
                      height="14px"
                      :src="zanIcon"
                    ></van-image>
                    <van-image
                      width="16px"
                      height="16px"
                      :src="zanActIcon"
                      v-if="false"
                    ></van-image>
                    <span>{{ item.support }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pl-content">
              <p></p>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="list-no" v-if="dataReceive.comment_count == 0">
        <div>
          <van-image width="189px" height="189px" :src="listNoIcon"></van-image>
          <p>还没有回复，留下你的评论吧</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      list: [],
      listNoIcon: require("../../assets/iconImage/huifu_no@3x.png"),
      plIcon: require("../../assets/iconImage/pinglun@3x.png"),
      zanIcon: require("../../assets/iconImage/dianzan@3x.png"),
      zanActIcon: require("../../assets/iconImage/dianzan_active@3x.png"),
      userZanIcon: require("../../assets/iconImage/ic_dianzan@3x.png"),
      userNoZanIcon: require("../../assets/iconImage/ic_dianzan2@3x.png"),
      ZanShow: true,
      value: "",
      writeShow: true,
      huifu: "",
      publishShow: true,
      dataReceive: "",
      answer_id: "",
      headerUrl: require("../../assets/iconImage/my_moren@3x.png"),
    };
  },
  created() {},
  mounted() {
    this.InitData();
  },
  methods: {
    InitData() {
      var params = {
        answer_id: this.$route.query.answer_id,
        uid: this.uid,
        // uid: this.$route.query.uid
      };
      this.$http
        .post(`/appserver/v1/quesAnswer/forDetails`, qs.stringify(params), {
          headers: {
            "Set-Cookie": `w_uid=${this.uid};w_open_id=${this.open_id};w_skey=${
              this.skey
            }`,
          },
        })
        .then((data) => {
          if (data.data.ret == 0) {
            // eslint-disable-next-line
            console.log(data.data.data.image);
            if (data.data.data !== null) {
              this.dataReceive = data.data.data;
              // console.log(this.dataReceive)
              this.list = data.data.data.comment_list;
              if (data.data.data.is_supported === true) {
                this.ZanShow = false;
              } else {
                this.ZanShow = true;
              }
            }
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.answer-details {
	.header {
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0px;
		background: #fff;
		z-index: 1200;
		/deep/ .van-icon {
			color: #000;
			font-size: 20px;
		}
		/deep/ .van-hairline--bottom::after {
			border: 0px;
		}
	}
	.wrap {
		padding-bottom: 68px;
		.user-news {
			.problem {
				padding: 21px 15px 20px 15px;
				border-bottom: 5px solid #f8f8f8;
				& > p {
					&:nth-of-type(1) {
						height: 20px;
						font-size: 20px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: rgba(55, 56, 77, 1);
						line-height: 20px;
					}
					&:nth-of-type(2) {
						margin-top: 14px;
						& > span {
							display: inline-block;
							padding: 4px 7px;
							margin-left: 5px;
							font-size: 11px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(70, 71, 91, 1);
							line-height: 11px;
							background: rgba(70, 71, 91, 0.05);
							border-radius: 2px;
						}
					}
				}
			}
			.problem-describe {
				padding: 20px;
				padding-bottom: 30px;
				border-bottom: 5px solid #f8f8f8;
				.user {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					& > div {
						&:nth-of-type(2) {
							margin-left: 9px;
							display: flex;
							align-content: flex-start;
							flex-wrap: wrap;
							& > p {
								width: 100%;
								font-size: 14px;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
								color: rgba(55, 56, 77, 1);
								height: 14px;
								line-height: 14px;
							}
							.p_t {
								width: 100%;
								height: 12px;
								line-height: 12px;
								margin-top: 6px;
								font-size: 12px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: rgba(153, 153, 153, 1);
							}
						}
					}
				}
				& > p {
					margin-top: 12px;
					font-size: 16px;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: rgba(55, 56, 77, 1);
					line-height: 26px;
				}
				/deep/ .van-image {
					margin: 20px 0px;
				}
			}
		}
		.pl-box {
			.pl-title {
				/deep/ .van-cell {
					padding: 30px 20px 25px 20px;
					display: flex;
					align-items: center;
				}
				/deep/ .van-cell__title {
					height: 20px;
					font-size: 20px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: rgba(55, 56, 77, 1);
					line-height: 20px;
				}
				/deep/ .van-cell__value {
					height: 14px;
					font-size: 14px;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: rgba(55, 56, 77, 1);
					line-height: 14px;
				}
				/deep/ .van-cell__right-icon {
					color: #000;
					font-size: 16px;
					font-weight: 500;
				}
			}
			.list {
				padding: 0 20px;
				.list-item {
					margin-top: 34px;
					&:nth-of-type(1) {
						margin: 0px;
					}
					.user-newsbox {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.right {
							width: 87.7%;
							display: flex;
							justify-content: space-between;
							align-items: center;
							& > div {
								&:nth-of-type(1) {
									& > p {
										height: 14px;
										font-size: 14px;
										font-family: PingFangSC-Medium, PingFang SC;
										font-weight: 500;
										color: rgba(55, 56, 77, 1);
										line-height: 14px;
									}
									.p-t {
										margin-top: 6px;
										height: 12px;
										font-size: 12px;
										font-family: PingFangSC-Regular, PingFang SC;
										font-weight: 400;
										color: rgba(153, 153, 153, 1);
										line-height: 12px;
									}
								}
								&:nth-of-type(2) {
									display: flex;
									justify-content: flex-start;
									align-items: center;
									& > div {
										display: flex;
										justify-content: flex-start;
										align-items: center;
										margin-right: 14px;
										span {
											font-size: 12px;
											font-family: PingFangSC-Regular, PingFang SC;
											font-weight: 400;
											color: rgba(153, 153, 153, 1);
											line-height: 24px;
											margin-left: 4px;
										}
									}
								}
							}
						}
					}
					.pl-content {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 14px;
						& > p {
							&:nth-of-type(1) {
								width: 32px;
								height: 32px;
							}
							&:nth-of-type(2) {
								width: 87.7%;
								font-size: 15px;
								font-family: PingFangSC-Light, PingFang SC;
								font-weight: 300;
								color: rgba(55, 56, 77, 1);
								line-height: 24px;
							}
						}
					}
					.delete {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 14px;
						& > p {
							&:nth-of-type(1) {
								width: 32px;
								height: 32px;
							}
							&:nth-of-type(2) {
								width: 87.7%;
								font-size: 15px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: rgba(24, 131, 87, 1);
							}
						}
					}
				}
			}
		}
		.list-no {
			margin-top: 30px;
			width: 100%;
			& > div {
				width: 100%;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				& > p {
					width: 100%;
					margin-top: 24px;
					font-size: 14px;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: rgba(155, 155, 155, 1);
					text-align: center;
				}
			}
		}
	}
}
</style>
