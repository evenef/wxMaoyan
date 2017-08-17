import { getDataByUrl_id, getDataByUrl, getPeopleImg } from "../../utils/util.js"

Page({
  data: {
    movie_id: "",
    ranking: 0,
    data: {
      firstImg: "img/loading.jpg",
      director: { img: "img/loading.jpg" },
      actors: [],
      imgs: ["img/loading.jpg"]
    },
    storyClass: "story",
    storyBtnClass: "story_bottom"
  },
  onLoad: function (options) {
    this.data.movie_id = options.movie_id
    // this.data.movie_id = "595f177cfbb6f10990ea672c"
    this.getData()
    this.getRanking()
  },

  getRanking() {
    getDataByUrl({ url: "http://localhost:3000/movie/find", page: 1, rows: 1000 }, (data) => {
      data.rows.forEach((item, i) => {
        data.rows.forEach((itemd, j) => {
          if (!parseInt(data.rows[j].getMoney))
            data.rows[j].getMoney = 0
          if (i >= j)
            return
          if (parseInt(data.rows[i].getMoney) < parseInt(data.rows[j].getMoney)) {
            var temp = data.rows[i]
            data.rows[i] = data.rows[j]
            data.rows[j] = temp
          }
        })
      })
      data.rows.forEach((item, index) => {
        if (item._id === this.data.movie_id) {
          this.data.ranking = index + 1
          this.setData(this.data)
        }
      })
    })
  },

  getData() {
    getDataByUrl_id({ url: "http://localhost:3000/movie/find", _id: this.data.movie_id }, (data) => {
      this.data.data = data
      this.data.data.director = { name: data.director, act: "导演" }
      this.data.data.actors = data.actors.split(",").map((item) => {
        var obj = {
          name: item.split("/")[0],
          img: "img/loading.jpg",
          act: item.split("/")[1].substring(2)
        }
        return obj
      })
      //获取导演照片
      getPeopleImg({ url: "http://localhost:3000/people/find", name: this.data.data.director.name }, (data) => {
        this.data.data.director.img = data[0].headImg
        this.setData(this.data)
      })
      //获取演员照片
      this.data.data.actors.forEach((item, index) => {
        getPeopleImg({ url: "http://localhost:3000/people/find", name: item.name }, (data) => {
          this.data.data.actors[index].img = data[0].headImg
          if (index === this.data.data.actors.length - 1)
            this.setData(this.data)
        })
      })
    })
  },

  toPay(event) {
    wx.navigateTo({
      url: '/pages/pay/pay?movie_id=' + this.data.movie_id,
    })
  },

  storyAllBtn() {
    this.data.storyClass += " storyAll"
    this.data.storyBtnClass += " storyAll_bottom"
    this.setData(this.data)
  }
})