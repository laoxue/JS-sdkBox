var barrageModelSDK = /** @class */ (function () {
    function barrageModelSDK(dom) {
        this.win = window;
        this.doc = window.document;
        console.log('进入构造函数');
        this.el = dom;
        this.initDom();
    }
    /**
  * @param void
  * @return void
  * @desc 准备初始化dom
  */
    barrageModelSDK.prototype.initDom = function () {
        this.el;
    };
    /**
   * @param void
   * @return void
   * @desc 在头部增加CSS样式
   */
    barrageModelSDK.prototype.addCss = function () {
        var node = this.createElement('style');
        var themeColor = '#6096EA';
        node.type = 'text/css';
        node.innerHTML =
            "\n        \n        ";
        this.appendChild(this.doc.head, node);
    };
    /**
   * appendChild
   * @param @container, @target
   * @return void
   * @desc 子级dom插入父级dom
   */
    barrageModelSDK.prototype.appendChild = function (container, target) {
        container.appendChild(target);
    };
    /**
   * @param TagName
   * @return HTML-element
   * @desc 创建DOM
   */
    barrageModelSDK.prototype.createElement = function (type) {
        return this.doc.createElement(type);
    };
    return barrageModelSDK;
}());
