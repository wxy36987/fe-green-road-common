import moment from 'moment'

var dateFrm = function (el, formatString) {

  if (el === '') {
    return ''
  }

  if (el == null) return '-'
  else {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss'
    return moment(parseInt(el)).format(formatString)
  }
}
var dateFrms = function (el, formatString) {

  if (el === '') {
    return ''
  }

  if (el == null) return '-'
  else {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss'
    return moment(parseInt(el)).format(formatString)
  }
}

var add0 = function (m) {
  return m < 10 ? '0' + m : m
}
var dateFrmzh = function (el) {
  var time = new Date(el);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + '年' + add0(m) + '月' + add0(d) + '日';
}

var timesAgo = val => {
  var now = moment()

  var times = val.match(/\d+/g)
  times[1] = Number(times[1]) - 1

  var time = moment(times)

  var m = now.diff(time, 'm')
  if (0 < m && m < 60) return `${m}分钟前`
  if (m == 0) return `刚刚`

  var h = now.diff(time, 'h')
  if (h < 24) return `${h}小时前`

  var d = now.diff(time, 'd')
  if (d <= 2) return `${d}天前`

  return val
}

var limitCount = function (value, num) {
  if (!value) return ''
  if (value.length > num) {
    return value.slice(0, num) + '...'
  }
  return value
}

export default {
  dateFrm,
  dateFrms,
  timesAgo,
  limitCount,
  dateFrmzh
}