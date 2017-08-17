function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDataByUrl({ url, page, rows }, cb) {
  wx.request({
    url,
    data: {
      page,
      rows
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      cb(res.data)
    }
  })
}

function getDataByUrl_id({ url, _id }, cb) {
  wx.request({
    url,
    data: {
      _id
    },
    header: {
      'content-type': 'application/xml'
    },
    success: function (res) {
      cb(res.data)
    }
  })
}

function getPeopleImg({ url, name }, cb) {
  wx.request({
    url,
    data: {
      name
    },
    header: {
      'content-type': 'application/xml'
    },
    success: function (res) {
      cb(res.data)
    }
  })
}

function loading() {
  wx.showLoading({
    title: "正在加载...",
    mask: true
  })
}

module.exports = {
  formatTime: formatTime,
  getDataByUrl,
  getDataByUrl_id,
  getPeopleImg,
  loading
}
