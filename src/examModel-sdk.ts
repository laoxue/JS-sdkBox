/**
 * examModel-sdk.js
 * @author laoxue
 * @time 2020-01-15
 * @param { examtitle 考试名称 }
 * @return examModel-sdk instance
 * @desc 考试模块sdk
 */


class examModelSDK {
    win:any = window;
    doc:any = this.win.document;
    examList:object[] = []
    examQuestion:object = {}
    wrongList:object[] = [];
    // 学员学号
    examTitle:string;

    wrongCount:number = 0; //错题
    fitCount:number  = 0; //对题
    holeCount:number  = 0; //全部题

    // 当前第几题
    examIndex = 0


    // 初始化考试人员
    constructor(examtitle:string, objData:any){
        this.examTitle = examtitle;
        if(objData) {
             // console.log(res.data)
            this.wrongList = objData.data;
            if(this.wrongList.length !== 0) {
                 // 准备数据加载弹框
                this.holeCount = this.wrongList.length;
                this.initData();
            } else {
                console.log('当前未有考试!')
            }
        } else {
            this.fetchData('getExam', {
                method: 'get',
                data: {},
                mode: 'cors'
            })
            .then((res) => {
                // console.log(res.data)
                this.wrongList = res.data;
                if(this.wrongList.length !== 0) {
                    // 准备数据加载弹框
                    this.holeCount = this.wrongList.length;
                    this.initData();
                } else {
                    console.log('当前未有考试!')
                }
            })
            .catch(e => {
                console.log(e)
            })
        }
        
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
            watcher: (item:any) => {
            if (!item.length) {
                // this.removeElement('J_question_container_valid')
                return
              }
            //   !this.checkDOM('J_question_container_valid') && this.addValidButton()
            }
          }, {
            // 当前问题
            value: 'examQuestion',
            default: {},
            watcher: (item:any) => {
              if (Object.keys(item).length) {
                // console.log(examQuestion)
                console.log(this.examQuestion)
                this.removeElement('exam_container',true)
                this.addExamContainer(this.examQuestion);
                return
              }
            }
          },{
              //当前数量
            value:'fitCount',
            default: 0,
            needInit: true,
            watcher: (item:any) => {
                //   alert('最新值'+item)
                const fitCount = this.doc.querySelector('.fitCount')
                if(fitCount) fitCount.innerHTML = `正确: ${item}`
                
                //  this.addExamContainerFooter()
            }
        },{
              //当前数量
            value:'wrongCount',
            default: 0,
            needInit: true,
            watcher: (item:any) => {
                //   alert('最新值'+item)
                const wrongCount = this.doc.querySelector('.wrongCount')
                if (wrongCount) wrongCount.innerHTML = `正确: ${item}`
            }

        },{
            //当前数量
            value:'examIndex',
            default: 0,
            needInit: true,
            watcher: (item:any) => {
              //   alert('最新值'+item)
             if (item === this.holeCount)  this.doc.querySelector('.exam_container').innerHTML = 
             `
             <p class="exam_result">您已经完成全部题目,正确${this.fitCount},错误${this.wrongCount}</p>
             `
              //  this.addExamContainerFooter()
            }

        }])
          this.examList = this.wrongList
          this.examQuestion = this.examList[this.examIndex];
        
    }
    /**
   * @param void
   * @return void
   * @desc 创建灰屏蒙版dom
   */
    addMask():void{
        const maskDom:any = this.createElement('div');
        maskDom.className = 'mask_dialog';
        this.appendChild(this.doc.body, maskDom);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目外框
   */
    addExamContainer(obj:any):void{
        const examContainer:any = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader();
        // 增加题干部分
        this.addExamContainerContent(obj);
        // 增加脚部
        this.addExamContainerFooter();
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目头部
   */
    addExamContainerHeader():void{
        const header:any = this.createElement('div');
        header.className = 'exam_container_header';
        const header_title:any = this.createElement('span');
        const close_menu:any = this.createElement('span');
        header_title.className = 'exam_container_header_title'
        close_menu.className = "exam_container_close_menu"
        header_title.innerHTML = this.examTitle;
        close_menu.innerHTML = 'X';
        close_menu.addEventListener('click',() => {
            this.removeElement('exam_container',true);
            this.removeElement('mask_dialog',true);
        })
        this.appendChild(header, header_title);
        this.appendChild(header, close_menu);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目题干部分
   */
    addExamContainerContent(obj:any):void{
        const content:any = this.createElement('div');
        // const under = this.createElement('div');
        content.className = 'exam_container_content';
        // this.appendChild(content, under);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], content);
        // 添加题目部分
        this.addExamContainerContentTitle(obj);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目
   */
    addExamContainerContentTitle(obj:any):void{
        let data = obj;
        // 创建题目类型 以及题目内容
        const topic:any = this.createElement('div');
        topic.className = 'exam_container_content_topic';
        const topicType:any = this.createElement('span');
        const topicTitle:any = this.createElement('span');
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
        this.addExamContainerContentAnwser(obj);
    }
    /**
   * @param void
   * @return void
   * @desc 增加题选项
   */
    addExamContainerContentAnwser(obj:any):void{
        let data = obj.choiceList;
        // 创建题目类型 以及题目内容
        const underAnwser:any = this.createElement('div');
        underAnwser.className = 'exam_container_content_under';
        const underAnwserText:any = this.createElement('div');
        underAnwserText.className = 'exam_container_content_under_text';
        const underAnwserImage:any = this.createElement('div');
        underAnwserImage.className = 'exam_container_content_under_image';
        if (obj.hasImage) {
            underAnwserImage.innerHTML = 
            `
            <img src="${obj.imgUrl}" width="130" height="130"/>
            `
        }
        const anwserList = data.map((item:any) => {
            const tContainer:any = this.createElement('span');
            tContainer.className = 'exam_container_content_item';
            if(obj.type === 'judgment') {
                tContainer.innerHTML = (item.value ? '正确' : '错误')
            } else {
                tContainer.innerHTML = item.value;
            }
            let {className} = tContainer
            tContainer.addEventListener('click', () => {
                if (obj.type === 'judgment') {
                   
                     if (/active/.test(className)) {
                         tContainer.className = 'exam_container_content_item'
                     } else {
                         tContainer.className = 'exam_container_content_item'
                     }
                    console.log('答案:',item)
                    if(item.value === obj.anwser) {
                        // alert('答对了')
                        this.fitCount ++;
                        // alert(this.fitCount)
                    } else {
                        // alert('不对')
                        this.wrongCount ++;
                    }
                } 
                if (obj.type === 'single') {
                    // alert('当前是单选题')
                    if(item.value === obj.anwser) {
                        // alert('答对了')
                        this.fitCount ++;
                        // alert(this.fitCount)
                    } else {
                        // alert('不对')
                        this.wrongCount ++;
                    }
                }
                if(obj.type === 'multiple') {

                }
                this.examIndex++;
                this.examQuestion = this.examList[this.examIndex];
                return 
            })
            return tContainer
        })
        console.log(anwserList)
        // this.appendChild(this.doc.getElementsByClassName('exam_container_content_topic')[0], anwserList[index]);
        anwserList.every((item:any) => {
            this.appendChild(underAnwserText, item);
            return true
        })
        this.appendChild(underAnwser, underAnwserText);
        this.appendChild(underAnwser, underAnwserImage);
        this.appendChild(this.doc.getElementsByClassName('exam_container_content')[0], underAnwser);
        
        
    }
    
    /**
   * @param void
   * @return void
   * @desc 增加题目脚部
   */
    addExamContainerFooter():void{
        const footer:any = this.createElement('div');
        // 增加 进度 和记录 
        const wrongCount:any = this.createElement('div')
        wrongCount.innerHTML = `错误：${this.wrongCount}`
        wrongCount.className = 'wrongCount'
        const fitCount:any = this.createElement('div');
        fitCount.className = 'fitCount'
        fitCount.innerHTML = `正确：${this.fitCount}`
        const process:any = this.createElement('div');
        process.className = 'process'
        process.innerHTML = `剩余：${this.holeCount - (this.fitCount+this.wrongCount)}/${this.holeCount}`
        footer.className = 'exam_container_footer';
        this.appendChild(footer,wrongCount);
        this.appendChild(footer,fitCount);
        this.appendChild(footer,process);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], footer);
    }
    /**
   * @param TagName
   * @return HTML-element
   * @desc 创建DOM
   */
    createElement(type:any) :object{
        return this.doc.createElement(type);
    }
    /**
   * @param void
   * @return void
   * @desc 在头部增加CSS样式
   */
    addCss() :void{
        const node:any = this.createElement('style');
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
            display:flex;
            justify-content:space-between;
        }
        .exam_container_header_title{
            color:white;
            font-size: 15px;
            font-family: cursive;
            line-height: 2rem;
            margin-left: 0.5rem;
            font-weight: 800;
        }
        .exam_container_close_menu{
            color:white;
            font-size:13px;
            display: inline-block;
            height: 2rem;
            line-height:2rem;
            width: 50px;
            text-align: center;
            cursor:pointer;
        }
        .exam_container_content{
            height:16rem;
        }
        .exam_container_content_topic{
            height:5rem;
            display:flex;
            align-items: center; 
            justify-content:flex-start;
        }
        .exam_container_content_topicType{
            padding:0.1rem 1rem;
            height:1.5rem;
            margin-left: 5%;
            border: 1px solid #37B5F8;
            background-color: #37B5F8;
            color: #fff;
        }
        .exam_container_content_topicTitle{
            height:1.5rem;
            line-height:1.5rem;
            padding: 0.5rem;
        }
        .exam_container_content_under{
            height:11rem;
            display:flex;
            flex-flow:row;
            justify-content: space-between;
            padding: 0 5%;
        }
        .exam_container_content_under_text{
            height:11rem;
            display:flex;
            flex-flow:column;
            width:50%;
        }
        .exam_container_content_under_image{
            height:11rem;
            width:50%;
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
            font-size:13px;
            justify-content:space-around;
        }
        .activeItem{
            background:red;
            color:white
        }
        .wrongCount{
            color:red;
        }
        .fitCount{
            color:green;
        }
        .process{
            color:blue;
        }
        .exam_result{
            height: 100%;
            width: 100%;
            line-height: 20rem;
            text-align: center;
            display: inline-block;
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
    appendChild(container:any,target:any) :void{
        container.appendChild(target);
    }
    /**
   * insertBefore
   * @param @container, @from, @target
   * @return void
   * @desc 插入兄弟节点
   */
    insertBefore(container:any, from:any, target:any) :void{
        container.insertBefore(target, from)
    }
    /**
   * @param url string
   * @return promise fetch
   * @desc ajax请求
   */
    fetchData(url:string, config:any = {
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
        // credentials: 'include',
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
        defaultFetchConfig = (<any>Object).assign({}, defaultFetchConfig, {
            body: undefined
        })
        } else if (method.toLowerCase() == 'post') {
        let body = JSON.stringify(data)
        defaultFetchConfig = (<any>Object).assign({}, defaultFetchConfig, {
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
    definePropertyProps(items:any) {
        const template:any = {}
        items.every((item:any) => {
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
    removeElement(className:any, deep?:any) :void{
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
    typeof (data:any, type?:any) {
        return type ? Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type.toLowerCase() : Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
    }      
    /**
   * 检查是否相等
   * @param @form, @to
   * @return boolean
   * @desc check @from and @to is equal
   */
    isEquel(form:any, to:any) {
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