// ==UserScript==
// @name        知识星球图片助手
// @namespace   ZSXQ_IMAGE_PANEL
// @match       https://wx.zsxq.com/dweb2/*
// @grant       none
// @version     1.0
// @author      linying
// @run-at      document-end
// @description 2020/3/1 下午9:22:35
// ==/UserScript==

(function() {
  // 图片创建
  class ImagesFactory {
    constructor() {
      this._createElements();
    }

    // 获取新建的图片元素
    get elements() {
      return this._elements;
    }

    // 设置图片点击事件
    initEvent() {
      this._elements.addEventListener('click', function(ev) {
        var indexStr = ev.target.getAttribute('imgIndex');
        if (!indexStr) return;

        var index = parseInt(indexStr);
        var imgs = document.querySelector('.topic-detail > .content').querySelectorAll('.image-container > img');
        if (!imgs[index]) return;

        var newEv = document.createEvent('Event');
        newEv.initEvent('click', true)
        imgs[index].dispatchEvent(newEv);

        ev.stopPropagation();
      });
    }

    // 根据已显示内容克隆图片
    _createElements() {
      var imgElements = document.querySelector('.topic-detail > .content').querySelector('app-image-gallery');
      if (!imgElements) return;

      this._elements = imgElements.cloneNode(true);
      var imgs = this._elements.querySelectorAll('.image-container > img');

      for (var i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute('imgIndex', i);
        this._addIndex(imgs[i], i + 1);
      }
    }

    // 给每张图片添加索引标记
    _addIndex(img, index) {
      var el = document.createElement('div');
      el.innerHTML = index.toString();
      this._setIndexStyle(el);
      img.parentNode.appendChild(el);
      img.parentNode.style.position = 'relative';
    }

    // 设置图片索引的样式
    _setIndexStyle(el) {
      var style = el.style;
      style.position = 'absolute';
      style.left = '2px';
      style.top = '2px';
      style.color = 'white';
      style.background = 'red';
      style.width = '20px';
      style.height = '20px';
      style.lineHeight = '18px';
      style.borderRadius = '10px';
      style.textAlign = 'center';
    }
  }

  // 图片面板
  class Panel {
    // 创建图片面板
    static create() {
      var factory = new ImagesFactory();
      var newImgEls = factory.elements;
      if (!newImgEls) return;

      var el = document.querySelector('.topic-detail');
      this.element = document.createElement('div');
      this.element.appendChild(newImgEls);
      el.appendChild(this.element);
      factory.initEvent();
      this._setPanelStyle(this.element);
    }

    // 销毁图片面板
    static destroy() {
      if (!this.element) return;

      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }

    // 设置图片面板样式
    static _setPanelStyle(el) {
      var contentElement = document.querySelector('.topic-detail > .content');
      var left = contentElement.offsetLeft + contentElement.offsetWidth;
      var top = contentElement.offsetTop;

      el.style.position = 'fixed';
      el.style.left = left + 10 + 'px';
      el.style.top = top + 'px';
    }
  }

  // 显隐处理
  var lastStatus = (!!document.querySelector('.topic-detail > .content'));
  document.addEventListener('click', function() {
    setTimeout(function() {
      var contentElement = document.querySelector('.topic-detail > .content');
      if (lastStatus === (!!contentElement)) return;

      lastStatus = (!!contentElement);
      if (lastStatus) {
        Panel.create();
      } else {
        Panel.destroy();
      }
    }, 200);
  }, true);
})();