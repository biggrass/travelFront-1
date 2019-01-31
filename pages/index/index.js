//index.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    page: 1,
    feed: [],
    feed_length: 0,
     //这是轮播图图片
    imgUrls: [
      '../../images/logo.jpg',
      '../../images/logo.jpg',
      '../../images/logo.jpg',
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },
  //事件处理函数
  bindItemTap: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../answer/answer'
    })
  },
  bindQueTap: function(e) {
    console.log(e)
    let qid = e.currentTarget.dataset.qid;
    app.requestDetailId = qid
    console.log(qid)
    wx.navigateTo({
      url: '../question/question?id='+qid
    })
  },
  bindAskTap: function(e){
    console.log(e);
    wx.navigateTo({
      url:'../writeQuestion/writeQuestion'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    this.getData();
  },

  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function(){wx.hideNavigationBarLoading();wx.stopPullDownRefresh();}, 2000);
  },

  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    console.log("lower")
  },


  //网络请求数据, 实现首页刷新
  refresh0: function(){
    var index_api = '';
    util.getData(index_api)
        .then(function(data){
          console.log(data);
        });
  },

  //使用本地 fake 数据实现刷新效果
  getData: function(){
    let that = this
    console.log(that.data.page)
    let url = "question/list/"+that.data.page+"/8"
    var result = util.getData(url).then(function (res) {
      that.setData({
        feed: res.data.data.content,
        feed_length: res.data.data.content.length
      });
      console.log(that.data.feed);
    }).catch(function (e) { return Promise.reject(e); });
  },

  onShow: function(){
    this.getData()
  },

  refresh: function(){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed:feed_data,
      feed_length: feed_data.length
    });
    setTimeout(function(){
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    },3000)

  },
  my_activity: function () {
    wx.navigateTo({
      url: '/pages/notify/notify',
    })
  },
  clock_in: function () {
    wx.navigateTo({
      url: '/pages/do_activity/do_activity',
    })
  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    var next = util.getData();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
    setTimeout(function(){
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    },3000)
  }
})
