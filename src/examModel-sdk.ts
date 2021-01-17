/**
 * examModel-sdk.js
 * @author laoxue
 * @time 2020-01-15
 * @param { userNo 账号 }
 * @return examModel-sdk instance
 * @desc 考试模块sdk
 */
class examModelSDK {
    win:object = window;
    doc:object = this.win.document;
    examList:object[] = []
    wrongList:object[] = [];
    // 学员学号
    userMis:string;

    wrongCount:number = 0; //错题
    fitCount:number  = 0; //对题
    holeCount:number  = 100; //对题

    // 当前第几题
    examIndex = 0


    // 初始化考试人员
    constructor(userNo:string){
        this.userMis = userNo;
        // console.log(this.userMis)
        // 假数据
        const dataJson = {
            "data":[
                {
                    "title":"1.薛强是男孩么?",
                    "type": "judgment",
                    "choiceList" : [
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
                    "title":"2.李四是男人还是女人？",
                    "type": "single",
                    "choiceList" : [
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
                    "title":"3.我最喜欢吃什么？",
                    "type": "multiple",
                    "choiceList" : [
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
        }

        this.wrongList = dataJson.data;
        if(this.wrongList.length !== 0) {
            // 准备数据加载弹框
            this.initData();
        } else {
            console.log('当前未有考试!')
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
    initData () :void {
        // 加载蒙版
        this.addMask();
        // 增加样式
        this.addCss();
        this.definePropertyProps([{
            // 已选择列表
            value: 'selectList',
            default: [],
            watcher: item => {
              if (!item.length) {
                this.removeElement('J_question_container_valid')
                return
              }!this.checkDOM('J_question_container_valid') && this.addValidButton()
            }
          }, {
            // 当前问题
            value: 'examList',
            default: {},
            watcher: item => {
              if (Object.keys(item).length) {
                this.addExamContainer(this.examIndex);
                return
              }
            }
          }])
          this.examList = this.wrongList
        
    }
    /**
   * @param void
   * @return void
   * @desc 创建灰屏蒙版dom
   */
    addMask():void{
        const maskDom = this.createElement('div');
        maskDom.className = 'mask_dialog';
        this.appendChild(this.doc.body, maskDom);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目外框
   */
    addExamContainer(index):void{
        const examContainer = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader();
        // 增加题干部分
        this.addExamContainerContent(index);
        // 增加脚部
        this.addExamContainerFooter();
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目头部
   */
    addExamContainerHeader():void{
        const header = this.createElement('div');
        header.className = 'exam_container_header';
        const header_title = this.createElement('span');
        header_title.className = 'exam_container_header_title'
        header_title.innerHTML = '驾考宝典v1.0'
        this.appendChild(header, header_title);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目题干部分
   */
    addExamContainerContent(index):void{
        const content = this.createElement('div');
        // const under = this.createElement('div');
        content.className = 'exam_container_content';
        // this.appendChild(content, under);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], content);
        // 添加题目部分
        this.addExamContainerContentTitle(index);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目
   */
    addExamContainerContentTitle(index):void{
        let data = this.examList[index];
        // 创建题目类型 以及题目内容
        const topic = this.createElement('div');
        topic.className = 'exam_container_content_topic';
        const topicType = this.createElement('span');
        const topicTitle = this.createElement('span');
        topicTitle.innerHTML = data.title
        topicType.className = 'exam_container_content_topicType';
        topicTitle.className = 'exam_container_content_topicTitle';
        if(data.type === 'single') {
            topicType.innerHTML = '单选:'
        } else if(data.type === 'multiple'){
            topicType.innerHTML = '多选:'
        } else {
            topicType.innerHTML = '判断:'
        }
        
        this.appendChild(topic,topicType)
        this.appendChild(topic,topicTitle)
        this.appendChild(this.doc.getElementsByClassName('exam_container_content')[0], topic);
        console.log('接下来添加题目')
        this.addExamContainerContentAnwser(index);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题选项
   */
    addExamContainerContentAnwser(index):void{
        let data = this.examList[index].choiceList;
        // 创建题目类型 以及题目内容
        const underAnwser = this.createElement('div');
        underAnwser.className = 'exam_container_content_under';
        const anwserList = data.map(item => {
            const tContainer = this.createElement('span');
            tContainer.className = 'exam_container_content_item';
            if(this.examList[index].type === 'judgment') {
                tContainer.innerHTML = (item.value ? '正确' : '错误')
            } else {
                tContainer.innerHTML = item.value;
            }
            
            tContainer.addEventListener('click', () => {
                if (this.examList[index].type === 'judgment') {
                    tContainer.className = 'exam_container_content_item activeItem'
                    console.log('答案:',item)
                    if((tContainer.innerHTML === '正确') !== item.value) {
                        alert('不对')
                    } else {
                        alert('答对了')
                    }
                } 
                if (this.examList[index].type === 'single') {
                    if(item.innerHTML !== item.anwser) {
                        alert('不对')
                    }
                }
                if(this.examList[index].type === 'multiple') {

                }
                return 
            })
            return tContainer
        })
        console.log(anwserList)
        // this.appendChild(this.doc.getElementsByClassName('exam_container_content_topic')[0], anwserList[index]);
        anwserList.every(item => {
            this.appendChild(underAnwser, item);
            return true
          })
        
        this.appendChild(this.doc.getElementsByClassName('exam_container_content')[0], underAnwser);
        
        
    }
    
    /**
   * @param void
   * @return void
   * @desc 增加题目脚部
   */
    addExamContainerFooter():void{
        const footer = this.createElement('div');
        // 增加 进度 和记录 
        const wrongCount = this.createElement('div')
        wrongCount.innerHTML = `错误：${this.wrongCount}`
        const fitCount = this.createElement('div');
        fitCount.innerHTML = `正确：${this.fitCount}`
        const proess = this.createElement('div');
        proess.innerHTML = `剩余：${this.holeCount - this.fitCount}/${this.holeCount}`
        footer.className = 'exam_container_footer';
        this.appendChild(footer,wrongCount);
        this.appendChild(footer,fitCount);
        this.appendChild(footer,proess);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], footer);
    }
    /**
   * @param TagName
   * @return HTML-element
   * @desc 创建DOM
   */
    createElement(type) :object{
        return this.doc.createElement(type);
    }
    /**
   * @param void
   * @return void
   * @desc 在头部增加CSS样式
   */
    addCss() :void{
        const node = this.createElement('style');
        const themeColor = '#6096EA';
        node.type = 'text/css';
        node.innerHTML = 
        `
        @keyframes scale {
            form {
            transform:scale(0)
            }
            to {
            transform: scale(1)
            }
        }
        @keyframes slideIn {
            0% {
            opacity: 0;
            transform: translateY(500px)
        }
        100% {
            opacity: 1;
            transform: translateY(0px)
        }
        }
        @keyframes fadeIn {
            0% {
            opacity: 0;
            height: 0px;
            transform: translateX(170px)
        }
        50% {
            opacity: 0;
            height: 32px;
            transform: translateX(170px)
        }
        100% {
            opacity: 1;
            height: 32px;
            transform: translateX(70px)
        }
        }
        @keyframes fadeInContent {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
        }
        @keyframes loading {
        0% {
            opacity: 0;
        }
        40% {
            opacity: 0.5;
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
        }
        @keyframes insert {
        0% {
            height: 0;
            opacity: 0;
        }
        80% {
            height: auto;
        }
        100% {
            opacity: 1;
            }
        }
        p{
            margin:0;
            padding:0;
        }
        .mask_dialog {
            position: fixed;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            z-index: 9999999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            transform: scale(0);
            animation-name: scale;
            animation-delay: 0.1s;
            animation-duration: 0.2s;
            animation-fill-mode: forwards;
            animation-timing-function: ease-in-out;
            animation-iteration-count: 1;
        }

        .exam_container{
            position: fixed;
            height: 20rem;
            width: 50rem;
            background: white;
            z-index: 10000000;
            margin-left: -25rem;
            margin-top: -10rem;
            left: 50%;
            top: 50%;
            transform: scale(0);
            animation-name: scale;
            animation-delay: 0.1s;
            animation-duration: 0.2s;
            animation-fill-mode: forwards;
            animation-timing-function: ease-in-out;
            animation-iteration-count: 1;
        }
        .exam_container_header{
            width: 100%;
            background: #63a2c7;
            height: 2rem;
        }
        .exam_container_header_title{
            color:white;
            font-size: 15px;
            font-family: cursive;
            line-height: 2rem;
            margin-left: 0.5rem;
            font-weight: 800;
        }
        .exam_container_content{
            height:16rem;
        }
        .exam_container_content_topic{
            height:10rem;
            display:flex;
            justify-content:flex-start;
        }
        .exam_container_content_topicType{
            padding:0.5rem;
            height:1.5rem;
            margin-left: 5%;
        }
        .exam_container_content_topicTitle{
            height:1.5rem;
            line-height:1.5rem;
            padding: 0.5rem;
        }
        .exam_container_content_under{
            height:6rem;
            display:flex;
            justify-content:space-around;
        }
        .exam_container_content_item{
            height:2rem;
            line-height:2rem;
            cursor:pointer;
        }
        .exam_container_footer{
            height:2rem;
            line-height:2rem;
            display:flex;
            justify-content:space-around;
        }
        .activeItem{
            background:red;
            color:white
        }
        `
        this.appendChild(this.doc.head, node)
    }
    /**
   * appendChild
   * @param @container, @target
   * @return void
   * @desc 子级dom插入父级dom
   */
    appendChild(container,target) :void{
        container.appendChild(target);
    }
    /**
   * insertBefore
   * @param @container, @from, @target
   * @return void
   * @desc 插入兄弟节点
   */
    insertBefore(container, from, target) :void{
        container.insertBefore(target, from)
    }
    /**
   * @param url string
   * @return promise fetch
   * @desc ajax请求
   */
    fetchData(url, config = {
        method: 'get',
        data: {},
        mode: 'cors'
    }) {
        const pre = 'http://localhost:3000' //基础地址
        let {
        data,
        method
        } = config
        method = method || 'GET'
        let defaultFetchConfig = {
        headers: {
            'Accept': 'application/json'
        },
        credentials: 'include',
        method
        }
        url = url.substring(0, 1) === '/' ? url : '/' + url
        if (method.toLowerCase() == 'get' && data) {
        let t = ''
        for (let key in data) {
            t += `${key}=${data[key]}&`
        }
        t = t.slice(0, -1)
        url += `?${t}`
        defaultFetchConfig = Object.assign({}, defaultFetchConfig, {
            body: undefined
        })
        } else if (method.toLowerCase() == 'post') {
        let body = JSON.stringify(data)
        defaultFetchConfig = Object.assign({}, defaultFetchConfig, {
            body
        })
        }
        return fetch(`${pre}${url}`, defaultFetchConfig)
        .then(r => r.json())
        .then(r => this.typeof(r, 'string') ? JSON.parse(r) : r)
        .catch(e => {
            this.removeElement('J_boot_exam_sdk')
        })
    }
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
    definePropertyProps(items) {
        const template = {}
        items.every(item => {
        template[item.value] = item.default
        if (item.needInit) item.watcher && item.watcher(item.default)
        Object.defineProperty(this, item.value, {
            enumerable: true,
            set: function (val) {
            if (this.isEquel(template[item.value], val)) return
            template[item.value] = val
            item.watcher && item.watcher(val)
            },
            get: function () {
            return template[item.value]
            }
        })
        return true
        })
    }
    /**
   * removeElement
   * @param @classname
   * @return void
   * @desc 通过className 移除dom元素
   */
    removeElement(className, deep) :void{
        if (!className) return
        let t = this.doc.getElementsByClassName(className)
        if (!t.length) return
        if (!deep) {
        t[0].parentNode.removeChild(t[0])
        return
        }
        let parent = t[0].parentNode
        // 递归删除子节点
        for (let i = t.length - 1; i >= 0; i--) {
        ((i) => {
            parent.removeChild(t[i])
        })(i)
        }
    }
    /**
   * 检查类型
   * @param @data, @type
   * @return boolean
   * @desc check data type is @type
   */
    typeof (data, type) {
        return type ? Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type.toLowerCase() : Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
    }      
    /**
   * 检查是否相等
   * @param @form, @to
   * @return boolean
   * @desc check @from and @to is equal
   */
    isEquel(form, to) {
        // form to 类型不一致直接返回
        if (this.typeof(form) !== this.typeof(to)) return false
        // 数组对比toString
        if (this.typeof(to, 'array')) {
        return form.toString() === to.toString()
        }
        // 字符串完全对比
        if (this.typeof(to, 'string')) {
        return form === to
        }
        // obj进行深度校验
        if (this.typeof(to, 'object')) {
        if (Object.keys(to).length !== Object.keys(form).length) return false
        let t = Object.keys(form)
        let t1 = Object.keys(to)
        if (t.every(i => this.isEquel(form[i], to[i]))) return true
        }
        // boolean
        return form === to
    }

}