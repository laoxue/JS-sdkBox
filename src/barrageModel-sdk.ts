/**
 * barrageModel-sdk.js
 * @author laoxue
 * @time 2020-01-19
 * @param { HTMLElement vediodom }
 * @return barrageModel-sdk instance
 * @desc 弹幕模块sdk
 */
interface keyable {
    [key: string]: any  
}

class barrageModelSDK{
    win:object = window;
    doc:keyable = window.document;
    el:any;
    constructor(dom:object){
        console.log('进入构造函数')
        this.el = dom;
        this.initDom();
    }
     /**
   * @param void
   * @return void
   * @desc 准备初始化dom
   */
    initDom(): void{
        this.el
    }
    /**
   * @param void
   * @return void
   * @desc 在头部增加CSS样式
   */
    addCss() :void{
        const node:keyable = this.createElement('style');
        const themeColor = '#6096EA';
        node.type = 'text/css';
        node.innerHTML = 
        `
        
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
   * @param TagName
   * @return HTML-element
   * @desc 创建DOM
   */
    createElement(type:any) :object{
        return this.doc.createElement(type);
    }
}