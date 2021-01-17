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
    wrongList:number[] = [];
    // 学员学号
    userMis:string;

    // 初始化考试人员
    constructor(userNo:string){
        this.userMis = userNo;
        this.initData();
        console.log(this.userMis)
    }
    /**
   * @param void
   * @return void
   * @desc 启动数据函数
   */
    initData () :void {
        // 加载蒙版
        this.addMask();
        this.addExamContainer();
        // 增加样式
        this.addCss();
        
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
    addExamContainer():void{
        const examContainer = this.createElement('div');
        examContainer.className = 'exam_container';
        this.appendChild(this.doc.body, examContainer);
        // 增加头部
        this.addExamContainerHeader()
    }
    /**
   * @param void
   * @return void
   * @desc 增加题目外框
   */
    addExamContainerHeader():void{
        const header = this.createElement('div');
        header.className = 'exam_container_header';
        const header_title = this.createElement('span');
        header_title.className = 'exam_container_header_title'
        header_title.innerHTML = '小葵花麻麻课堂开课了'
        this.appendChild(header, header_title);
        this.appendChild(this.doc.getElementsByClassName('exam_container')[0], header);
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

}