# JS-sdkBox
记录一些纯JS的sdk对象

1.考试SDK
```
// 使用方法 用script标签引入sdk文件 <examModelSDK.js>

// 1.绑定函数在需要点击生成考试弹框的按钮

button onclick="fn()">点击我弹出考试!</button> 上

// 2.创建sdk对象 sdk内封装了获取接口数据的fetch方法 这边方便演示使用文件中的json数据 二参不传默认使用fetch调用接口获取考试数据
function showExam () {
    // 一参为考试名字，二参为假数据
    let exam = new examModelSDK('阿强创建的考试',visualDom);
}
```
演示DEMO：


<a href="http://htmlpreview.github.io/?https://github.com/laoxue/JS-sdkBox/blob/master/index.html">点我开始考试</a>
