// seat.js
Page({
  data: {
    sceneid: "",
    sceneData: {
      seat: [[0]]
    },
    money: 0
  },
  onLoad: function (options) {
    this.data.sceneid = options.sceneid
    // this.data.sceneid = "599254486c372023081ada9c"
    this.getSceneByUrl()
  },
  //获取场次数据
  getSceneByUrl() {
    var that = this
    wx.request({
      url: "http://localhost:3000/scene/find",
      data: {
        _id: that.data.sceneid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.data.sceneData = res.data
        that.data.sceneData.date = res.data.date.split("-")[1] + "月" + res.data.date.split("-")[2] + "日"
        that.data.sceneData.seat = res.data.seat.split("-").map((item) => {
          return item.split("")
        })
        that.setData(that.data)
      }
    })
  },
  seatSelectBtn(event) {
    console.log(event.currentTarget.dataset)
    var i = event.currentTarget.dataset.index.split("-")[0]
    var j = event.currentTarget.dataset.index.split("-")[1]
    if (this.data.sceneData.seat[i][j] === "0") {
      this.data.sceneData.seat[i][j] = "*"
      this.data.money += parseInt(this.data.sceneData.price)
    } else if (this.data.sceneData.seat[i][j] === "*") {
      this.data.sceneData.seat[i][j] = "0"
      this.data.money -= parseInt(this.data.sceneData.price)
    }
    this.setData(this.data)
  },
  enterBtn() {
    this.data.money = 0
    this.data.sceneData.seat.forEach((item_a, i) => {
      item_a.forEach((item_b, j) => {
        if (item_b === "*")
          this.data.sceneData.seat[i][j] = "1"
      })
    })
    this.setData(this.data)
  }
})