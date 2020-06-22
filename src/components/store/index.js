/* eslint-disable */
export default {
    getcookieUid() {
        var strcookie = document.cookie; //获取cookie字符串
        // eslint-disable-next-line
        console.log(strcookie);
        // eslint-disable-next-line
        var u = navigator.userAgent,
            // eslint-disable-next-line
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            var arrcookie = strcookie.split(';');
            for (var i = 0; i < arrcookie.length; i++) {
                var arr = arrcookie[i].split('=');
                console.log(arr)
                if (arr[0].trim() == 'w_uid') {
                    var _uid = arr[1];
                    var uid_arr = _uid.split(';');
                    var uid = uid_arr[0];
                }
            }
        }

        if (isIOS) {
            var arrcookie1 = strcookie.split(';');
            for (var i = 0; i < arrcookie1.length; i++) {
                var arr1 = arrcookie1[i].split('=');
                if (arr1[0].trim() == 'w_uid') {
                    var uid = arr1[1];
                }
            }
        }
        return uid
    },
    getcookieSkey() {
        var strcookie = document.cookie; //获取cookie字符串
        // eslint-disable-next-line
        var u = navigator.userAgent,
            // eslint-disable-next-line
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            var arrcookie = strcookie.split(';');
            for (var i = 0; i < arrcookie.length; i++) {
                var arr = arrcookie[i].split('=');
                if (arr[0].trim() == 'w_skey') {
                    var _skey = arr[1];
                    var skey_arr = _skey.split(';');
                    var skey = skey_arr[0];
                }
            }
        }

        if (isIOS) {
            var arrcookie1 = strcookie.split(';');
            for (var i = 0; i < arrcookie1.length; i++) {
                var arr1 = arrcookie1[i].split('=');
                if (arr1[0].trim() == 'w_skey') {
                    var skey = arr1[1];

                }
            }
        }
        return skey
    },
    getcookieOpen() {
        var strcookie = document.cookie; //获取cookie字符串
        // eslint-disable-next-line
        var u = navigator.userAgent,
            // eslint-disable-next-line
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            var arrcookie = strcookie.split(';');
            for (var i = 0; i < arrcookie.length; i++) {
                var arr = arrcookie[i].split('=');
                if (arr[0].trim() == 'w_open_id') {
                    var _open_id = arr[1];
                    var open_id_arr = _open_id.split(';');
                    var open_id = open_id_arr[0];
                }
            }
        }

        if (isIOS) {
            var arrcookie1 = strcookie.split(';');
            for (var i = 0; i < arrcookie1.length; i++) {
                var arr1 = arrcookie1[i].split('=');
                if (arr1[0].trim() == 'w_open_id') {
                    var open_id = arr1[1];
                }

            }
        }
        return open_id
    },
}