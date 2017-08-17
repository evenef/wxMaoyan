// pay_scene.js
Page({
  data: {
    movie_id: "",
    movieData: {
      firstImg: "/img/error.jpg"
    },
    cinema: "",
    cinemaData: {},
    sceneArrAll: [],
    sceneArrShow: [],
    date: [],
    date_item: "date_item",
    chooseDateString: ""
  },
  onLoad: function (options) {
    this.data.chooseDateString = options.date.split("-")[0] + "月" + options.date.split("-")[1] + "日"
    this.data.movie_id = options.movie_id
    this.data.cinema = options.cinema
    // this.data.movie_id = "595f177cfbb6f10990ea672c"
    // this.data.cinema = "金牛万达"
    this.getCinemaByUrl()
    this.getMovieByUrl()
  },
  //获取影院数据
  getCinemaByUrl() {
    var that = this
    wx.request({
      url: "http://localhost:3000/cinema/find",
      data: {
        name: that.data.cinema
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.data.cinemaData = res.data[0]
        that.setData(that.data)
      }
    })
  },
  //获取电影数据
  getMovieByUrl() {
    var that = this
    wx.request({
      url: "http://localhost:3000/movie/find",
      data: {
        _id: that.data.movie_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.data.movieData = res.data
        that.data.movieData.actors = that.data.movieData.actors.split(",").map((item) => item.split("/")[0])
        that.getSceneByUrl()
        that.setData(that.data)
      }
    })
  },
  //获取场次数据
  getSceneByUrl() {
    var that = this
    wx.request({
      url: "http://localhost:3000/scene/find",
      data: {
        movieId: that.data.movie_id,
        cinemaName: that.data.cinema
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var arr = res.data
        for (var i = 0; i < arr.length; i++) {
          for (var j = i; j < arr.length; j++) {
            var iHour = parseInt(arr[i].startTime.split(":")[0])
            var iMinute = parseInt(arr[i].startTime.split(":")[1])
            var jHour = parseInt(arr[j].startTime.split(":")[0])
            var jMinute = parseInt(arr[j].startTime.split(":")[1])
            if (iHour > jHour || (iHour === jHour && iMinute > jMinute)) {
              var temp = arr[j]
              arr[j] = arr[i]
              arr[i] = temp
            }
          }
        }
        that.data.sceneArrAll = arr
        arr.forEach((item) => {
          that.data.date.push(item.date)
        })
        var [...dateArr] = new Set(that.data.date)
        for (var i = 0; i < dateArr.length; i++) {
          for (var j = i; j < dateArr.length; j++) {
            var iMonth = parseInt(dateArr[i].split("-")[1])
            var iDay = parseInt(dateArr[i].split("-")[2])
            var jMonth = parseInt(dateArr[j].split("-")[1])
            var jDay = parseInt(dateArr[j].split("-")[2])
            if (iMonth > jMonth || (iMonth === jMonth && iDay > jDay)) {
              var temp = dateArr[j]
              dateArr[j] = dateArr[i]
              dateArr[i] = temp
            }
          }
        }
        dateArr.forEach((item, index) => {
          dateArr[index] = item.split("-")[1] + "月" + item.split("-")[2] + "日"
        })
        that.data.date = dateArr
        // that.data.chooseDateString = dateArr[0]
        that.getSceneArrShow()
        that.setData(that.data)
      }
    })
  },
  //获取要显示的场次数据
  getSceneArrShow() {
    this.data.sceneArrShow = []
    this.data.sceneArrAll.forEach((item) => {
      var date = item.date.split("-")[1] + "月" + item.date.split("-")[2] + "日"
      if (date !== this.data.chooseDateString)
        return
      else
        this.data.sceneArrShow.push(item)
    })
  },
  //点击日期事件
  date_cl(event) {
    this.data.chooseDateString = event.currentTarget.dataset.date
    this.getSceneArrShow()
    this.setData(this.data)
  },
  toSeat(event) {
    wx.navigateTo({
      url: '/pages/seat/seat?sceneid=' + event.currentTarget.dataset.sceneid,
    })
  }
})