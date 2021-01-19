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
    function examModelSDK(examtitle, objData) {
        var _this = this;
        this.win = window;
        this.doc = this.win.document;
        this.examList = [];
        this.examQuestion = {};
        this.wrongList = [];
        this.wrongCount = 0; //错题
        this.fitCount = 0; //对题
        this.holeCount = 0; //全部题
        // 当前第几题
        this.examIndex = 0;
        this.examTitle = examtitle;
        if (objData) {
            // console.log(res.data)
            this.wrongList = objData.data;
            if (this.wrongList.length !== 0) {
                // 准备数据加载弹框
                this.holeCount = this.wrongList.length;
                this.initData();
            }
            else {
                console.log('当前未有考试!');
            }
        }
        else {
            this.fetchData('getExam', {
                method: 'get',
                data: {},
                mode: 'cors'
            })
                .then(function (res) {
                // console.log(res.data)
                _this.wrongList = res.data;
                if (_this.wrongList.length !== 0) {
                    // 准备数据加载弹框
                    _this.holeCount = _this.wrongList.length;
                    _this.initData();
                }
                else {
                    console.log('当前未有考试!');
                }
            })
                .catch(function (e) {
                console.log(e);
            });
        }
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
                        // this.removeElement('J_question_container_valid')
                        return;
                    }
                    //   !this.checkDOM('J_question_container_valid') && this.addValidButton()
                }
            }, {
                // 当前问题
                value: 'examQuestion',
                default: {},
                watcher: function (item) {
                    if (Object.keys(item).length) {
                        // console.log(examQuestion)
                        console.log(_this.examQuestion);
                        _this.removeElement('exam_container');
                        _this.addExamContainer(_this.examQuestion);
                        return;
                    }
                }
            }, {
                //当前数量
                value: 'fitCount',
                default: 0,
                needInit: true,
                watcher: function (item) {
                    var _a;
                    //   alert('最新值'+item)
                    (_a = _this.doc.querySelector('.fitCount')) === null || _a === void 0 ? void 0 : _a.innerHTML = "\u6B63\u786E: " + item;
                    //  this.addExamContainerFooter()
                }
            }, {
                //当前数量
                value: 'wrongCount',
                default: 0,
                needInit: true,
                watcher: function (item) {
                    var _a;
                    //   alert('最新值'+item)
                    (_a = _this.doc.querySelector('.wrongCount')) === null || _a === void 0 ? void 0 : _a.innerHTML = "\u6B63\u786E: " + item;
                    //  this.addExamContainerFooter()
                }
            }, {
                //当前数量
                value: 'examIndex',
                default: 0,
                needInit: true,
                watcher: function (item) {
                    //   alert('最新值'+item)
                    if (item === _this.holeCount)
                        _this.doc.querySelector('.exam_container').innerHTML =
                            "\n             <p class=\"exam_result\">\u60A8\u5DF2\u7ECF\u5B8C\u6210\u5168\u90E8\u9898\u76EE,\u6B63\u786E" + _this.fitCount + ",\u9519\u8BEF" + _this.wrongCount + "</p>\n             ";
                    //  this.addExamContainerFooter()
                }
            }]);
        this.examList = this.wrongList;
        this.examQuestion = this.examList[this.examIndex];
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
    examModelSDK.prototype.addExamContainer = function (obj) {
        var examContainer = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader();
        // 增加题干部分
        this.addExamContainerContent(obj);
        // 增加脚部
        this.addExamContainerFooter();
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目头部
   */
    examModelSDK.prototype.addExamContainerHeader = function () {
        var _this = this;
        var header = this.createElement('div');
        header.className = 'exam_container_header';
        var header_title = this.createElement('span');
        var close_menu = this.createElement('span');
        header_title.className = 'exam_container_header_title';
        close_menu.className = "exam_container_close_menu";
        header_title.innerHTML = this.examTitle;
        close_menu.innerHTML = 'X';
        close_menu.addEventListener('click', function () {
            _this.removeElement('exam_container');
            _this.removeElement('mask_dialog');
        });
        this.appendChild(header, header_title);
        this.appendChild(header, close_menu);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目题干部分
   */
    examModelSDK.prototype.addExamContainerContent = function (obj) {
        var content = this.createElement('div');
        // const under = this.createElement('div');
        content.className = 'exam_container_content';
        // this.appendChild(content, under);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], content);
        // 添加题目部分
        this.addExamContainerContentTitle(obj);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题目
   */
    examModelSDK.prototype.addExamContainerContentTitle = function (obj) {
        var data = obj;
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
        this.addExamContainerContentAnwser(obj);
    };
    /**
   * @param void
   * @return void
   * @desc 增加题选项
   */
    examModelSDK.prototype.addExamContainerContentAnwser = function (obj) {
        var _this = this;
        var data = obj.choiceList;
        // 创建题目类型 以及题目内容
        var underAnwser = this.createElement('div');
        underAnwser.className = 'exam_container_content_under';
        var underAnwserText = this.createElement('div');
        underAnwserText.className = 'exam_container_content_under_text';
        var underAnwserImage = this.createElement('div');
        underAnwserImage.className = 'exam_container_content_under_image';
        if (obj.hasImage) {
            underAnwserImage.innerHTML =
                "\n            <img src=\"" + obj.imgUrl + "\" width=\"130\" height=\"130\"/>\n            ";
        }
        var anwserList = data.map(function (item) {
            var tContainer = _this.createElement('span');
            tContainer.className = 'exam_container_content_item';
            if (obj.type === 'judgment') {
                tContainer.innerHTML = (item.value ? '正确' : '错误');
            }
            else {
                tContainer.innerHTML = item.value;
            }
            var className = tContainer.className;
            tContainer.addEventListener('click', function () {
                if (obj.type === 'judgment') {
                    if (/active/.test(className)) {
                        tContainer.className = 'exam_container_content_item';
                    }
                    else {
                        tContainer.className = 'exam_container_content_item';
                    }
                    console.log('答案:', item);
                    if (item.value === obj.anwser) {
                        // alert('答对了')
                        _this.fitCount++;
                        // alert(this.fitCount)
                    }
                    else {
                        // alert('不对')
                        _this.wrongCount++;
                    }
                }
                if (obj.type === 'single') {
                    // alert('当前是单选题')
                    if (item.value === obj.anwser) {
                        // alert('答对了')
                        _this.fitCount++;
                        // alert(this.fitCount)
                    }
                    else {
                        // alert('不对')
                        _this.wrongCount++;
                    }
                }
                if (obj.type === 'multiple') {
                }
                _this.examIndex++;
                _this.examQuestion = _this.examList[_this.examIndex];
                return;
            });
            return tContainer;
        });
        console.log(anwserList);
        // this.appendChild(this.doc.getElementsByClassName('exam_container_content_topic')[0], anwserList[index]);
        anwserList.every(function (item) {
            _this.appendChild(underAnwserText, item);
            return true;
        });
        this.appendChild(underAnwser, underAnwserText);
        this.appendChild(underAnwser, underAnwserImage);
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
        wrongCount.className = 'wrongCount';
        var fitCount = this.createElement('div');
        fitCount.className = 'fitCount';
        fitCount.innerHTML = "\u6B63\u786E\uFF1A" + this.fitCount;
        var process = this.createElement('div');
        process.className = 'process';
        process.innerHTML = "\u5269\u4F59\uFF1A" + (this.holeCount - (this.fitCount + this.wrongCount)) + "/" + this.holeCount;
        footer.className = 'exam_container_footer';
        this.appendChild(footer, wrongCount);
        this.appendChild(footer, fitCount);
        this.appendChild(footer, process);
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
            "\n        @keyframes scale {\n            form {\n            transform:scale(0)\n            }\n            to {\n            transform: scale(1)\n            }\n        }\n        @keyframes slideIn {\n            0% {\n            opacity: 0;\n            transform: translateY(500px)\n        }\n        100% {\n            opacity: 1;\n            transform: translateY(0px)\n        }\n        }\n        @keyframes fadeIn {\n            0% {\n            opacity: 0;\n            height: 0px;\n            transform: translateX(170px)\n        }\n        50% {\n            opacity: 0;\n            height: 32px;\n            transform: translateX(170px)\n        }\n        100% {\n            opacity: 1;\n            height: 32px;\n            transform: translateX(70px)\n        }\n        }\n        @keyframes fadeInContent {\n        0% {\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n        }\n        }\n        @keyframes loading {\n        0% {\n            opacity: 0;\n        }\n        40% {\n            opacity: 0.5;\n        }\n        70% {\n            opacity: 1;\n        }\n        100% {\n            opacity: 0.5;\n        }\n        }\n        @keyframes insert {\n        0% {\n            height: 0;\n            opacity: 0;\n        }\n        80% {\n            height: auto;\n        }\n        100% {\n            opacity: 1;\n            }\n        }\n        p{\n            margin:0;\n            padding:0;\n        }\n        .mask_dialog {\n            position: fixed;\n            display: flex;\n            flex: 1;\n            justify-content: center;\n            align-items: center;\n            z-index: 9999999;\n            left: 0;\n            top: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.9);\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n\n        .exam_container{\n            position: fixed;\n            height: 20rem;\n            width: 50rem;\n            background: white;\n            z-index: 10000000;\n            margin-left: -25rem;\n            margin-top: -10rem;\n            left: 50%;\n            top: 50%;\n            transform: scale(0);\n            animation-name: scale;\n            animation-delay: 0.1s;\n            animation-duration: 0.2s;\n            animation-fill-mode: forwards;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: 1;\n        }\n        .exam_container_header{\n            width: 100%;\n            background: #63a2c7;\n            height: 2rem;\n            display:flex;\n            justify-content:space-between;\n        }\n        .exam_container_header_title{\n            color:white;\n            font-size: 15px;\n            font-family: cursive;\n            line-height: 2rem;\n            margin-left: 0.5rem;\n            font-weight: 800;\n        }\n        .exam_container_close_menu{\n            color:white;\n            font-size:13px;\n            display: inline-block;\n            height: 2rem;\n            line-height:2rem;\n            width: 50px;\n            text-align: center;\n            cursor:pointer;\n        }\n        .exam_container_content{\n            height:16rem;\n        }\n        .exam_container_content_topic{\n            height:5rem;\n            display:flex;\n            align-items: center; \n            justify-content:flex-start;\n        }\n        .exam_container_content_topicType{\n            padding:0.1rem 1rem;\n            height:1.5rem;\n            margin-left: 5%;\n            border: 1px solid #37B5F8;\n            background-color: #37B5F8;\n            color: #fff;\n        }\n        .exam_container_content_topicTitle{\n            height:1.5rem;\n            line-height:1.5rem;\n            padding: 0.5rem;\n        }\n        .exam_container_content_under{\n            height:11rem;\n            display:flex;\n            flex-flow:row;\n            justify-content: space-between;\n            padding: 0 5%;\n        }\n        .exam_container_content_under_text{\n            height:11rem;\n            display:flex;\n            flex-flow:column;\n            width:50%;\n        }\n        .exam_container_content_under_image{\n            height:11rem;\n            width:50%;\n        }\n        .exam_container_content_item{\n            height:2rem;\n            line-height:2rem;\n            cursor:pointer;\n        }\n        .exam_container_footer{\n            height:2rem;\n            line-height:2rem;\n            display:flex;\n            font-size:13px;\n            justify-content:space-around;\n        }\n        .activeItem{\n            background:red;\n            color:white\n        }\n        .wrongCount{\n            color:red;\n        }\n        .fitCount{\n            color:green;\n        }\n        .process{\n            color:blue;\n        }\n        .exam_result{\n            height: 100%;\n            width: 100%;\n            line-height: 20rem;\n            text-align: center;\n            display: inline-block;\n        }\n        ";
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
            // credentials: 'include',
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
