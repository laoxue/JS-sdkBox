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
        this.examList = [];
        this.wrongList = [];
        this.wrongCount = 0; //错题
        this.fitCount = 0; //对题
        this.holeCount = 100; //对题
        // 当前第几题
        this.examIndex = 0;
        this.userMis = userNo;
        // console.log(this.userMis)
        // 假数据
        var dataJson = {
            "data": [
                {
                    "title": "1.薛强是男孩么?",
                    "type": "judgment",
                    "choiceList": [
                        {
                            "value": true
                        },
                        {
                            "value": false
                        }
                    ],
                    "anwser": true
                },
                {
                    "title": "2.李四是男人还是女人？",
                    "type": "single",
                    "choiceList": [
                        {
                            "value": "A.男人"
                        },
                        {
                            "value": "B.女人"
                        }
                    ],
                    "anwser": "A"
                },
                {
                    "title": "3.我最喜欢吃什么？",
                    "type": "multiple",
                    "choiceList": [
                        {
                            "value": "A.西瓜"
                        },
                        {
                            "value": "B.菠萝"
                        },
                        {
                            "value": "C.生菜"
                        },
                        {
                            "value": "D.鳄鱼"
                        }
                    ],
                    "anwser": "A,B,C"
                }
            ]
        };
        this.wrongList = dataJson.data;
        if (this.wrongList.length !== 0) {
            // 准备数据加载弹框
            this.initData();
        }
        else {
            console.log('当前未有考试!');
        }
        // this.fetchData('/getexam', {
        //     method: 'get',
        //     data: {},
        //     mode: 'cors'
        // })
        // .then((data) => {
        //     console.log(data)
        // })
        // .catch(e => {
        //     console.log(e)
        // })
    }
    /**
   * @param void
   * @return void
   * @desc 启动数据函数
   */
    examModelSDK.prototype.initData = function () {
        var _this = this;
        // 加载蒙版
        this.addMask();
        // 增加样式
        this.addCss();
        this.definePropertyProps([{
                // 已选择列表
                value: 'selectList',
                default: [],
                watcher: function (item) {
                    if (!item.length) {
                        _this.removeElement('J_question_container_valid');
                        return;
                    }
                    !_this.checkDOM('J_question_container_valid') && _this.addValidButton();
                }
            }, {
                // 当前问题
                value: 'examList',
                default: {},
                watcher: function (item) {
                    if (Object.keys(item).length) {
                        _this.addExamContainer(_this.examIndex);
                        return;
                    }
                }
            }]);
        this.examList = this.wrongList;
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
    examModelSDK.prototype.addExamContainer = function (index) {
        var examContainer = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader();
        // 增加题干部分
        this.addExamContainerContent(index);
        // 增加脚部
        this.addExamContainerFooter();
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目头部
   */
    examModelSDK.prototype.addExamContainerHeader = function () {
        var header = this.createElement('div');
        header.className = 'exam_container_header';
        var header_title = this.createElement('span');
        header_title.className = 'exam_container_header_title';
        header_title.innerHTML = '驾考宝典v1.0';
        this.appendChild(header, header_title);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目题干部分
   */
    examModelSDK.prototype.addExamContainerContent = function (index) {
        var content = this.createElement('div');
        // const under = this.createElement('div');
        content.className = 'exam_container_content';
        // this.appendChild(content, under);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], content);
        // 添加题目部分
        this.addExamContainerContentTitle(index);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目
   */
    examModelSDK.prototype.addExamContainerContentTitle = function (index) {
        var data = this.examList[index];
        // 创建题目类型 以及题目内容
        var topic = this.createElement('div');
        topic.className = 'exam_container_content_topic';
        var topicType = this.createElement('span');
        var topicTitle = this.createElement('span');
        topicTitle.innerHTML = data.title;
        topicType.className = 'exam_container_content_topicType';
        topicTitle.className = 'exam_container_content_topicTitle';
        if (data.type === 'single') {
            topicType.innerHTML = '单选:';
        }
        else if (data.type === 'multiple') {
            topicType.innerHTML = '多选:';
        }
        else {
            topicType.innerHTML = '判断:';
        }
        this.appendChild(topic, topicType);
        this.appendChild(topic, topicTitle);
        this.appendChild(this.doc.getElementsByClassName('exam_container_content')[0], topic);
        console.log('接下来添加题目');
        this.addExamContainerContentAnwser(index);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题选项
   */
    examModelSDK.prototype.addExamContainerContentAnwser = function (index) {
        var _this = this;
        var data = this.examList[index].choiceList;
        // 创建题目类型 以及题目内容
        var underAnwser = this.createElement('div');
        underAnwser.className = 'exam_container_content_under';
        var anwserList = data.map(function (item) {
            var tContainer = _this.createElement('span');
            tContainer.className = 'exam_container_content_item';
            if (_this.examList[index].type === 'judgment') {
                tContainer.innerHTML = (item.value ? '正确' : '错误');
            }
            else {
                tContainer.innerHTML = item.value;
            }
            tContainer.addEventListener('click', function () {
                if (_this.examList[index].type === 'judgment') {
                    tContainer.className = 'exam_container_content_item activeItem';
                    console.log('答案:', item);
                    if ((tContainer.innerHTML === '正确') !== item.value) {
                        alert('不对');
                    }
                    else {
                        alert('答对了');
                    }
                }
                if (_this.examList[index].type === 'single') {
                    if (item.innerHTML !== item.anwser) {
                        alert('不对');
                    }
                }
                if (_this.examList[index].type === 'multiple') {
                }
                return;
            });
            return tContainer;
        });
        console.log(anwserList);
        // this.appendChild(this.doc.getElementsByClassName('exam_container_content_topic')[0], anwserList[index]);
        anwserList.every(function (item) {
            _this.appendChild(underAnwser, item);
            return true;
        });
        this.appendChild(this.doc.getElementsByClassName('exam_container_content')[0], underAnwser);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目脚部
   */
    examModelSDK.prototype.addExamContainerFooter = function () {
        var footer = this.createElement('div');
        // 增加 进度 和记录 
        var wrongCount = this.createElement('div');
        wrongCount.innerHTML = "\u9519\u8BEF\uFF1A" + this.wrongCount;
        var fitCount = this.createElement('div');
        fitCount.innerHTML = "\u6B63\u786E\uFF1A" + this.fitCount;
        var proess = this.createElement('div');
        proess.innerHTML = "\u5269\u4F59\uFF1A" + (this.holeCount - this.fitCount) + "/" + this.holeCount;
        footer.className = 'exam_container_footer';
        this.appendChild(footer, wrongCount);
        this.appendChild(footer, fitCount);
        this.appendChild(footer, proess);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], footer);
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
            "\n        @keyframes scale {\n            form {\n            transform:scale(0)\n            }\n            to {\n            transform: scale(1)\n            }\n        }\n        @keyframes slideIn {\n            0% {\n            opacity: 0;\n            transform: translateY(500px)\n        }\n        100% {\n            opacity: 1;\n            transform: translateY(0px)\n        }\n        }\n        @keyframes fadeIn {\n            0% {\n            opacity: 0;\n            height: 0px;\n            transform: translateX(170px)\n        }\n        50% {\n            opacity: 0;\n            height: 32px;\n            transform: translateX(170px)\n        }\n        100% {\n            opacity: 1;\n            height: 32px;\n            transform: translateX(70px)\n        }\n        }\n        @keyframes fadeInContent {\n        0% {\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n        }\n        }\n        @keyframes loading {\n        0% {\n            opacity: 0;\n        }\n        40% {\n            opacity: 0.5;\n        }\n        70% {\n            opacity: 1;\n        }\n        100% {\n            opacity: 0.5;\n        }\n        }\n        @keyframes insert {\n        0% {\n            height: 0;\n            opacity: 0;\n        }\n        80% {\n            height: auto;\n        }\n        100% {\n            opacity: 1;\n            }\n        }\n        p{\n            margin:0;\n            padding:0;\n        }\n        .mask_dialog {\n            position: fixed;\n            display: flex;\n            flex: 1;\n            justify-content: center;\n            align-items: center;\n            z-index: 9999999;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.9);\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n\n        .exam_container{\n            position: fixed;\n            height: 20rem;\n            width: 50rem;\n            background: white;\n            z-index: 10000000;\n            margin-left: -25rem;\n            margin-top: -10rem;\n            left: 50%;\n            top: 50%;\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n        .exam_container_header{\n            width: 100%;\n            background: #63a2c7;\n            height: 2rem;\n        }\n        .exam_container_header_title{\n            color:white;\n            font-size: 15px;\n            font-family: cursive;\n            line-height: 2rem;\n            margin-left: 0.5rem;\n            font-weight: 800;\n        }\n        .exam_container_content{\n            height:16rem;\n        }\n        .exam_container_content_topic{\n            height:10rem;\n            display:flex;\n            justify-content:flex-start;\n        }\n        .exam_container_content_topicType{\n            padding:0.5rem;\n            height:1.5rem;\n            margin-left: 5%;\n        }\n        .exam_container_content_topicTitle{\n            height:1.5rem;\n            line-height:1.5rem;\n            padding: 0.5rem;\n        }\n        .exam_container_content_under{\n            height:6rem;\n            display:flex;\n            justify-content:space-around;\n        }\n        .exam_container_content_item{\n            height:2rem;\n            line-height:2rem;\n            cursor:pointer;\n        }\n        .exam_container_footer{\n            height:2rem;\n            line-height:2rem;\n            display:flex;\n            justify-content:space-around;\n        }\n        .activeItem{\n            background:red;\n            color:white\n        }\n        ";
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
   * @param url string
   * @return promise fetch
   * @desc ajax请求
   */
    examModelSDK.prototype.fetchData = function (url, config) {
        var _this = this;
        if (config === void 0) { config = {
            method: 'get',
            data: {},
            mode: 'cors'
        }; }
        var pre = 'http://localhost:3000'; //基础地址
        var data = config.data, method = config.method;
        method = method || 'GET';
        var defaultFetchConfig = {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include',
            method: method
        };
        url = url.substring(0, 1) === '/' ? url : '/' + url;
        if (method.toLowerCase() == 'get' && data) {
            var t = '';
            for (var key in data) {
                t += key + "=" + data[key] + "&";
            }
            t = t.slice(0, -1);
            url += "?" + t;
            defaultFetchConfig = Object.assign({}, defaultFetchConfig, {
                body: undefined
            });
        }
        else if (method.toLowerCase() == 'post') {
            var body = JSON.stringify(data);
            defaultFetchConfig = Object.assign({}, defaultFetchConfig, {
                body: body
            });
        }
        return fetch("" + pre + url, defaultFetchConfig)
            .then(function (r) { return r.json(); })
            .then(function (r) { return _this.typeof(r, 'string') ? JSON.parse(r) : r; })
            .catch(function (e) {
            _this.removeElement('J_boot_exam_sdk');
        });
    };
    /**
   * 数据监听
   * @param @item
   * @return void
   * @desc
   * item: [{
   *  value: 被监听字段
   *  default: 默认属性
   *  needInit: 默认是否执行
   *  watcher: 数据变动时回调
   * }...]
   * void
   * ------ model ----- ← -------
   * ------ | ---------- ↑ ------
   * ------ | -- → - controller -
   * ------ ↓ ---------- ↓ ------
   * ----- view ------- ← -------
   */
    examModelSDK.prototype.definePropertyProps = function (items) {
        var _this = this;
        var template = {};
        items.every(function (item) {
            template[item.value] = item.default;
            if (item.needInit)
                item.watcher && item.watcher(item.default);
            Object.defineProperty(_this, item.value, {
                enumerable: true,
                set: function (val) {
                    if (this.isEquel(template[item.value], val))
                        return;
                    template[item.value] = val;
                    item.watcher && item.watcher(val);
                },
                get: function () {
                    return template[item.value];
                }
            });
            return true;
        });
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
    /**
   * 检查类型
   * @param @data, @type
   * @return boolean
   * @desc check data type is @type
   */
    examModelSDK.prototype.typeof = function (data, type) {
        return type ? Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type.toLowerCase() : Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
    };
    /**
   * 检查是否相等
   * @param @form, @to
   * @return boolean
   * @desc check @from and @to is equal
   */
    examModelSDK.prototype.isEquel = function (form, to) {
        var _this = this;
        // form to 类型不一致直接返回
        if (this.typeof(form) !== this.typeof(to))
            return false;
        // 数组对比toString
        if (this.typeof(to, 'array')) {
            return form.toString() === to.toString();
        }
        // 字符串完全对比
        if (this.typeof(to, 'string')) {
            return form === to;
        }
        // obj进行深度校验
        if (this.typeof(to, 'object')) {
            if (Object.keys(to).length !== Object.keys(form).length)
                return false;
            var t = Object.keys(form);
            var t1 = Object.keys(to);
            if (t.every(function (i) { return _this.isEquel(form[i], to[i]); }))
                return true;
        }
        // boolean
        return form === to;
    };
    return examModelSDK;
}());
