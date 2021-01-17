/**
 * examModel-sdk.js
 * @author laoxue
 * @time 2020-01-15
 * @param { userNo 账号 }
 * @return examModel-sdk instance
 * @desc 考试模块sdk
 */
var examModelSDK = /** @class */ (function () {
    // 初始化考试人员
    function examModelSDK(userNo) {
        this.win = window;
        this.doc = this.win.document;
        this.wrongList = [];
        this.userMis = userNo;
        this.initData();
        console.log(this.userMis);
    }
    /**
   * @param void
   * @return void
   * @desc 启动数据函数
   */
    examModelSDK.prototype.initData = function () {
        // 加载蒙版
        this.addMask();
        this.addExamContainer();
        // 增加样式
        this.addCss();
    };
    /**
   * @param void
   * @return void
   * @desc 创建灰屏蒙版dom
   */
    examModelSDK.prototype.addMask = function () {
        var maskDom = this.createElement('div');
        maskDom.className = 'mask_dialog';
        this.appendChild(this.doc.body, maskDom);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目外框
   */
    examModelSDK.prototype.addExamContainer = function () {
        var examContainer = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader();
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目外框
   */
    examModelSDK.prototype.addExamContainerHeader = function () {
        var header = this.createElement('div');
        header.className = 'exam_container_header';
        var header_title = this.createElement('span');
        header_title.className = 'exam_container_header_title';
        header_title.innerHTML = '小葵花麻麻课堂开课了';
        this.appendChild(header, header_title);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
    };
    /**
   * @param TagName
   * @return HTML-element
   * @desc 创建DOM
   */
    examModelSDK.prototype.createElement = function (type) {
        return this.doc.createElement(type);
    };
    /**
   * @param void
   * @return void
   * @desc 在头部增加CSS样式
   */
    examModelSDK.prototype.addCss = function () {
        var node = this.createElement('style');
        var themeColor = '#6096EA';
        node.type = 'text/css';
        node.innerHTML =
            "\n        @keyframes scale {\n            form {\n            transform:scale(0)\n            }\n            to {\n            transform: scale(1)\n            }\n        }\n        @keyframes slideIn {\n            0% {\n            opacity: 0;\n            transform: translateY(500px)\n        }\n        100% {\n            opacity: 1;\n            transform: translateY(0px)\n        }\n        }\n        @keyframes fadeIn {\n            0% {\n            opacity: 0;\n            height: 0px;\n            transform: translateX(170px)\n        }\n        50% {\n            opacity: 0;\n            height: 32px;\n            transform: translateX(170px)\n        }\n        100% {\n            opacity: 1;\n            height: 32px;\n            transform: translateX(70px)\n        }\n        }\n        @keyframes fadeInContent {\n        0% {\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n        }\n        }\n        @keyframes loading {\n        0% {\n            opacity: 0;\n        }\n        40% {\n            opacity: 0.5;\n        }\n        70% {\n            opacity: 1;\n        }\n        100% {\n            opacity: 0.5;\n        }\n        }\n        @keyframes insert {\n        0% {\n            height: 0;\n            opacity: 0;\n        }\n        80% {\n            height: auto;\n        }\n        100% {\n            opacity: 1;\n            }\n        }\n        .mask_dialog {\n            position: fixed;\n            display: flex;\n            flex: 1;\n            justify-content: center;\n            align-items: center;\n            z-index: 9999999;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.9);\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n\n        .exam_container{\n            position: fixed;\n            height: 20rem;\n            width: 50rem;\n            background: white;\n            z-index: 10000000;\n            margin-left: -25rem;\n            margin-top: -10rem;\n            left: 50%;\n            top: 50%;\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n        .exam_container_header{\n            width: 100%;\n            background: #63a2c7;\n            height: 2rem;\n        }\n        .exam_container_header_title{\n            color:white;\n            font-size: 15px;\n            font-family: cursive;\n            line-height: 2rem;\n            margin-left: 0.5rem;\n            font-weight: 800;\n        }\n        ";
        this.appendChild(this.doc.head, node);
    };
    /**
   * appendChild
   * @param @container, @target
   * @return void
   * @desc 子级dom插入父级dom
   */
    examModelSDK.prototype.appendChild = function (container, target) {
        container.appendChild(target);
    };
    /**
   * insertBefore
   * @param @container, @from, @target
   * @return void
   * @desc 插入兄弟节点
   */
    examModelSDK.prototype.insertBefore = function (container, from, target) {
        container.insertBefore(target, from);
    };
    /**
   * removeElement
   * @param @classname
   * @return void
   * @desc 通过className 移除dom元素
   */
    examModelSDK.prototype.removeElement = function (className, deep) {
        if (!className)
            return;
        var t = this.doc.getElementsByClassName(className);
        if (!t.length)
            return;
        if (!deep) {
            t[0].parentNode.removeChild(t[0]);
            return;
        }
        var parent = t[0].parentNode;
        // 递归删除子节点
        for (var i = t.length - 1; i >= 0; i--) {
            (function (i) {
                parent.removeChild(t[i]);
            })(i);
        }
    };
    return examModelSDK;
}());
