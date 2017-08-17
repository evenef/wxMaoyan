import { formatTime } from "../../utils/util.js"

Page({
  data: {
    movie_id: "",
    date: [],
    sceneArr: [],
    // cinemaShowArr: [{
    //   cinema: "",
    //   minPrice: "",
    //   address: "",
    //   sceneTime: []
    // }],
    cinemaShowArr: [],
    date_item: "date_item",
    chooseDateString: "",
    chooseDate: ""
  },
  onLoad(options) {
    this.data.movie_id = options.movie_id
    // this.data.movie_id = "595f177cfbb6f10990ea672c"
    this.getDate()
  },
  //获取场次数据
  getDataByUrl() {
    var that = this
    wx.request({
      url: "http://localhost:3000/scene/find",
      data: {
        movieId: this.data.movie_id,
        date: this.data.chooseDate
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.data.sceneArr = res.data
        var cinemaNameArr = []
        res.data.forEach((item) => {
          cinemaNameArr.push(item.cinemaName)
        })
        cinemaNameArr = that.getSetArr(cinemaNameArr)
        that.getCinemaData(cinemaNameArr, 0)
      }
    })
  },
  //获取影院数据
  getCinemaData(arr, index) {
    var that = this
    if (index === arr.length)
      return
    var obj = {}
    obj.cinema = arr[index]
    wx.request({
      url: "http://localhost:3000/cinema/find",
      data: {
        name: arr[index]
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        obj.address = res.data[0].address
        obj.sceneTime = []

        that.data.sceneArr.forEach((item) => {
          if (item.cinemaName !== res.data[0].name)
            return
          if (obj.minPrice)
            obj.minPrice = obj.minPrice < parseInt(item.price) ? obj.minPrice : parseInt(item.price)
          else
            obj.minPrice = parseInt(item.price)

          obj.sceneTime.push(item.startTime)
          var [...newArr] = new Set(obj.sceneTime)
          obj.sceneTime = newArr
          for (var i = 0; i < obj.sceneTime.length; i++) {
            for (var j = i; j < obj.sceneTime.length; j++) {
              var iHour = parseInt(obj.sceneTime[i].split(":")[0])
              var iMinute = parseInt(obj.sceneTime[i].split(":")[1])
              var jHour = parseInt(obj.sceneTime[j].split(":")[0])
              var jMinute = parseInt(obj.sceneTime[j].split(":")[1])
              if (iHour > jHour || (iHour === jHour && iMinute > jMinute)) {
                var temp = obj.sceneTime[j]
                obj.sceneTime[j] = obj.sceneTime[i]
                obj.sceneTime[i] = temp
              }
            }
          }
        })

        if (obj.sceneTime[2])
          obj.sceneTime = obj.sceneTime.slice(0, 3)
        that.data.cinemaShowArr.push(obj)

        that.setData(that.data)

        if (++index === arr.length)
          return
        else
          that.getCinemaData(arr, index)
      }
    })
  },
  //数组去重
  getSetArr(arr) {
    var [...newArr] = new Set(arr)
    return newArr
  },
  //初始化日期选择器
  getDate() {
    this.data.date = []
    var dateNow = new Date()
    var year = dateNow.getFullYear().toString()
    var month = (dateNow.getMonth() + 1).toString()
    month = month[1] ? month : 0 + month
    var day = dateNow.getDate().toString()
    day = day[1] ? day : 0 + day
    for (let i = 0; i < 8; i++) {
      let showDate = (Number(day) + i).toString()
      showDate = showDate[1] ? showDate : 0 + showDate
      this.data.date.push(`${year}-${month}-${showDate}`)
    }
    //转为显示string内容
    this.data.date.forEach((item, index) => {
      if (index === 0) {
        this.data.chooseDateString = this.data.date[index] = "今天" + Number(item.split("-")[1]) + "月" + item.split("-")[2] + "日"
        this.changeDateType(this.data.chooseDateString)
      }
      else if (index === 1)
        this.data.date[index] = "明天" + Number(item.split("-")[1]) + "月" + item.split("-")[2] + "日"
      else if (index === 2)
        this.data.date[index] = "后天" + Number(item.split("-")[1]) + "月" + item.split("-")[2] + "日"
      else if (index === 3)
        this.data.date[index] = "大后天" + Number(item.split("-")[1]) + "月" + item.split("-")[2] + "日"
      else
        this.data.date[index] = Number(item.split("-")[1]) + "月" + item.split("-")[2] + "日"
    })
    this.getDataByUrl()
    this.setData(this.data)
  },
  //显示日期string转化为规定格式
  changeDateType(string) {
    var arr = string.split("天")
    if (arr[1])
      var dateString = arr[1]
    else
      var dateString = arr[0]
    var month = dateString.split("月")[0]
    var day = dateString.split("月")[1].split("日")[0]
    month = month[1] ? month : "0" + month
    day = day[1] ? day : "0" + day
    this.data.chooseDate = month + "-" + day
  },
  //点击日期事件
  date_cl(event) {
    this.data.cinemaShowArr = []
    this.changeDateType(event.target.dataset.date)
    this.data.chooseDateString = event.currentTarget.dataset.date
    this.getDataByUrl()
    this.setData(this.data)
  },
  //跳转到购票页面
  topay_scene(event) {
    wx.navigateTo({
      url: '/pages/pay_scene/pay_scene?movie_id=' + this.data.movie_id + '&cinema=' + event.currentTarget.dataset.cinema + '&date=' + this.data.chooseDate,
    })
  }
})