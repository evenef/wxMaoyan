var amapFile = require('../../libs/amap-wx.js');
import { getDataByUrl, loading } from "../../utils/util.js"

Page({
  data: {
    nowCity: "定位",
    hot_btn_class: "nav_btn_cl",
    wait_btn_class: "",
    movieData: {
      url: 'http://localhost:3000/movie/find',
      page: 1,
      rows: 4,
      total: 0,
      dataArr: [],
      cinemaNum: 0,
      sceneNum: 0
    },
    isGetData: true,
    bottomTipsText: "正在努力加载 . . ."
  },

  onLoad: function (options) {
    loading()
    this.getAddress()
    this.getMovieData()
  },

  getPlace() {
    wx.showLoading({
      title: "定位中...",
      mask: true
    })
    var that = this
    var myAmapFun = new amapFile.AMapWX({ key: '93f179624746dd836d978bc27fc072ae' });
    myAmapFun.getRegeo({
      success(data) {
        var city = data[0].name.split("市")[0]
        var district = data[0].name.split("市")[1].split("区")[0]
        that.data.nowCity = city + "市" + district + "区"
        that.setData(that.data)
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  getAddress() {

  },

  //获取场次信息
  getScene(movieId) {
    var date = new Date()
    var month = (date.getMonth() + 1).toString()
    month = month[1] ? month : "0" + month
    var day = date.getDate().toString()
    day = day[1] ? day : "0" + day
    date = month + "-" + day

    var that = this
    wx.request({
      url: 'http://localhost:3000/scene/find',
      data: {
        movieId,
        date
      },
      success(res) {
        var sceneNum = res.data.length
        var cinemaArr = []
        res.data.forEach((item) => {
          cinemaArr.push(item.cinemaName)
        })
        var [...cinemaArr] = new Set(cinemaArr)
        // console.log(cinemaArr)
        that.data.movieData.dataArr.forEach((item, index) => {
          if (item._id === movieId) {
            that.data.movieData.dataArr[index].cinemaNum = cinemaArr.length
            that.data.movieData.dataArr[index].sceneNum = sceneNum
          }
        })
        that.setData(that.data)
      }
    })
  },

  //获取电影信息
  getMovieData() {
    getDataByUrl(this.data.movieData, (data) => {
      var index = 0
      this.data.movieData.page++
      data.rows.map((item) => {
        this.getScene(item._id)
        item.actors = item.actors.split(",").map((i) => {
          if (index++ > 3)
            index = 0
          return i.split("/")[0]
        })
        item.actors.splice(3)
      })
      this.data.movieData.dataArr.push(...data.rows)
      if (this.data.movieData.dataArr.length === data.total) {
        this.data.isGetData = false
        this.data.bottomTipsText = "-----我是有底线的-----"
      }
      this.setData(this.data)
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  nav_btn(event) {
    this.data.hot_btn_class = ""
    this.data.wait_btn_class = ""
    this.data[event.currentTarget.dataset.page + "_btn_class"] = "nav_btn_cl"
    this.setData(this.data)
  },

  toMovieInfo(event) {
    wx.navigateTo({
      url: '/pages/info/info?movie_id=' + event.currentTarget.dataset.movie_id,
    })
  },

  toPay(event) {
    wx.navigateTo({
      url: '/pages/pay/pay?movie_id=' + event.currentTarget.dataset.movie_id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isGetData)
      return
    loading()
    setTimeout(
      this.getMovieData
      , 1000)
  }
})