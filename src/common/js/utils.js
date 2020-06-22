export default {
    // eslint-disable-next-line
    install(Vue, options) {
        // js里面调用this.timestampToTime(row);
        Vue.prototype.timestampToTime = function(row) {
            if (isNaN(row)) {
                return "";
            }
            // eslint-disable-next-line
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var date = new Date(row); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear();
            var M =
                (date.getMonth() + 1 < 10 ?
                    "0" + (date.getMonth() + 1) :
                    date.getMonth() + 1) + "-";
            var D = "";
            if (String(date.getDate()).length <= 1) {
                D = "0" + date.getDate() + " ";
            } else {
                D = date.getDate() + " ";
            }
            // eslint-disable-next-line
            var hour = now.getHours(); //当前时间的小时数
            var minute = now.getMinutes(); //当前时间分钟数
            var h = date.getHours(); //评论时间的小时数
            var m = date.getMinutes(); //评论时间的分钟数
            // eslint-disable-next-line
            var s = date.getSeconds();
            if (year == Y) {
                if (hour == h) {
                    if (minute - m <= 1) {
                        return "刚刚";
                    } else {
                        return M + D;
                    }
                } else {
                    return M + D;
                }
            } else {
                return Y + "-" + M + D;
            }
        };

        Vue.prototype.commonShare = function(paramArray) {
            window.wii.app.invoke("setActionBar", {
                share: {
                    isShow: paramArray[0],
                    title: paramArray[1],
                    summary: paramArray[2],
                    pic: paramArray[3],
                    link: paramArray[4],
                    isMiniProgram: paramArray[5],
                    miniProgramId: paramArray[6],
                    miniProgramPath: paramArray[7],
                },
                collect: {
                    isShow: paramArray[8],
                    isCollect: paramArray[9],
                    type: paramArray[10],
                    articleId: paramArray[11],
                },
            });
        };
        Vue.prototype.commonLatLong = function(onLocationInfoListener) {
            window.latLong = (params) => {
                // eslint-disable-next-line
                var u = navigator.userAgent,
                    // eslint-disable-next-line
                    app = navigator.appVersion;
                var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var LatLng = {
                    latitude: "",
                    longitude: "",
                };
                if (isAndroid) {
                    LatLng.latitude = JSON.parse(params).lat;
                    LatLng.longitude = JSON.parse(params).lng;
                } else if (isIOS) {
                    LatLng.latitude = params.latitude;
                    LatLng.longitude = params.longitude;
                }
                onLocationInfoListener(LatLng);
            };
            window.wii.app.invoke("locationInfo", {
                callback: "latLong",
            });
        };
        Vue.prototype.commonGetUserInfo = function(onGetUserInfoListener) {
            // eslint-disable-next-line
            // console.log('调用userinfo');
            window.UesrInfo = (params) => {
                // eslint-disable-next-line
                var u = navigator.userAgent,
                    // eslint-disable-next-line
                    app = navigator.appVersion;
                var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var userInfo = {
                    phone: "",
                    username: "",
                    radio: "",
                    userAvatar: "",
                };
                if (isAndroid) {
                    userInfo.phone = JSON.parse(params).mobile;
                    userInfo.username = JSON.parse(params).nickName;
                    userInfo.radio = JSON.parse(params).gender;
                    userInfo.userAvatar = JSON.parse(params).avatarUrl;
                }
                if (isIOS) {
                    userInfo.phone = params.mobile;
                    userInfo.username = params.nickName;
                    userInfo.radio = params.gender.toString();
                    userInfo.userAvatar = params.avatarUrl;
                }
                onGetUserInfoListener(userInfo);
            };
            window.wii.app.invoke("getUserInfo", {
                callback: "UesrInfo",
            });
        };
        Vue.prototype.commonfadeIn = function(element, speeds) {
            if (element === null) {
                return false;
            }
            if (element.style.opacity != 1) {
                let speed = speeds;
                let num = 0;
                let st = setInterval(function() {
                    num++;
                    element.style.opacity = num / 10;
                    if (num >= 10) {
                        clearInterval(st);
                    }
                }, speed);
            }
        };
        Vue.prototype.commonfadeOut = function(element, speeds) {
            if (element === null) {
                return false;
            }
            if (element.style.opacity != 0) {
                var speed = speeds || 30;
                var num = 10;
                var st = setInterval(function() {
                    num--;
                    element.style.opacity = num / 10;
                    if (num <= 0) {
                        clearInterval(st);
                    }
                }, speed);
            }
        };
        //计算时间戳与当前时间的差值
        Vue.prototype.commonCalculateDiffTime = function(start_time) {
            if (!parseInt(start_time)) return "0";
            var endTime = Math.round(new Date() / 1000);
            var timeDiff = endTime - start_time;
            var day = parseInt(timeDiff / 86400);
            // var hour = parseInt((timeDiff % 86400) / 3600);
            // var minute = parseInt((timeDiff % 3600) / 60);
            // day = day ? day + "天" : "";
            // hour = hour ? hour + "时" : "";
            // minute = minute ? minute + "分" : "";
            return day;
        };
        Vue.prototype.commonGetNetStatus = function(onStatusCallBack) {
            window.GetNetStatus = (params) => {
                // eslint-disable-next-line
                var u = navigator.userAgent,
                    // eslint-disable-next-line
                    app = navigator.appVersion;
                var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var netWorkInfo = {
                    netType: "0",
                };
                if (isAndroid) {
                    netWorkInfo.netType = JSON.parse(params).netType;
                }
                if (isIOS) {
                    netWorkInfo.netType = params.netType;
                }
                onStatusCallBack(netWorkInfo);
            };
            window.wii.app.invoke("getNetStatus", {
                callback: "GetNetStatus",
            });
        };
        Vue.prototype.commonUserBehavior = function(action) {
            //eslint-disable-next-line
            console.log("用户行为上报：%o", action);
            this.$http
                .post(
                    `/appserver/v1/user/user_behavior?
          item_type=${action.item_type} 
          &action_type=${action.item_id}
          &action_type=${action.action_type}
          &user_id=${action.uid}`, {
                        headers: {
                            longitude: action.longitude,
                            latitude: action.latitude,
                        },
                    }
                )
                .then((data) => {
                    //eslint-disable-next-line
                    console.log("用户行为上报 结果：%o", data);
                });
        };
        Vue.prototype.showLoading = function(isShow) {
            var u = navigator.userAgent,
                // eslint-disable-next-line
                app = navigator.appVersion;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (!isShow) {
                setTimeout(() => {
                    loading();
                }, 200);
            } else {
                loading();
            }

            function loading() {
                if (isAndroid) {
                    window.wii.app.invoke("showLoading", isShow);
                }
                if (isIOS) {
                    window.wii.app.invoke("showLoading", {
                        showLoading: isShow,
                    });
                }
            }
        };
        Vue.prototype.showLoadingInAppVue = function(isShow) {
            if (isShow) {
                document.getElementById("apploading").style.display = "inline";
            } else {
                document.getElementById("apploading").style.display = "none";
            }
        };
        Vue.prototype.isIOSDev = function() {
            var u = navigator.userAgent;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            return isIOS;
        };
        Vue.prototype.isAndroidDev = function() {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
            return isAndroid;
        };
    },
};