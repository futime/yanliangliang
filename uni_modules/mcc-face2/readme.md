
## 特别强调 请勿修改 js文件所在列表 文件名 文件目录结构 文件地址 请用真机调试 模拟器可能有问题

测版本为2.0 可自定义版本 如需要带有界面的版本 请去1 版本 
[活体检测 人脸识别](https://ext.dcloud.net.cn/plugin?id=7435)  
#url

### 确保勾选了对应权限
### 相对于1 完全可自定页面样式， 方法。 

#### 1 引入  
``` javascript
import face from "@/uni_modules/mcc-face2/index.js"
```


#### 2 调用  打开相机页面
``` javascript


	
face.open().then(()=>{
	
	// 在这里处理的你的逻辑
	
	// 提供基本方法1
	face.opendataStream((data , off) => {
		
		// data 返回的实时的人脸点位图  
		// off() 取消人脸点位图返回
		
		
	})
	// 提供基本方法2  获取截图
	face.getimg((img) => {_this.img = img;face.close()})
	
	// 提供基本方法3 设置相机样式内容等 
	
	face.sethtml(`$('#hello').html("我看不到你的脸")`)
	
	
	// 关闭页面
	
	face.close() 
})


```
### 人脸点位图 ![image](https://img-cdn-aliyun.dcloud.net.cn/stream/plugin_screens/e0ff2ae0-7303-11ee-991b-b7ada5ec798e_0.png?image_process=quality,q_70/format,webp&v=1698218517)

#####  具体使用 请参考 示例     


####  提供方法
 ####  可在插件 静态资源中修改 页面页面样式  mcc-face2/static/index.css  也在index.js 中自定义页面 节点
### 内置 JQ.js

#### 注意事项  不可以删除 页面根本元素 video 
####  联系
####  有问题请进群 qq 296355527

