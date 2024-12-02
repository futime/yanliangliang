# props
|参数名|类型|默认值|可选择值|描述|
|----|----|----|---|---|
|buildActionContainer|Function|null|""|创建ActionContainer类的函数，要求返回值必需是ActionContainer类|
|actions|Function|(takePhoto)=>return [straightenHead2, nodHead, shakeHead, straightenHead]|""|动作组（目前已有动作：点头，摇头，平视）|
|isDev|boolen|false|true|是否是开发者模式,开启后可显示人脸的三个角度|
|hasSwitch|boolen|false|true|默认只有前置摄像头，开启后可切换摄像头

# emits
|方法名|参数|描述|
|----|---|---|
|detectFailed|[]|核验失败|
|photoChange|[url:'照片路径']|拍照后的回调|
|detectOver|[]|检测完成|
|showData|[faceData:'人脸数据']|每一帧的人脸数据|
# slots
|插槽名|参数|描述|
|----|---|---|
|default|无|用户可配合showData钩子展示人脸数据方便调试|

# 方法
## initData 
开始进行人脸核验 使用案例：
```
//html
<face-bio-assay ref="faceDetect" ></face-bio-assay>
//js
//调用
this.$refs.faceDetect.initData()
```
## takePhoto 
拍照获取照片，配合动作使用：
 ```
 在每个动作创建时第二个参数是动作完成的回调 如平视动作的使用：
 const fun = (state) => {
	 //state 有成功success和fail，ing(进行时不会触发该函数，忽略)
 	if (state === 'success') {
 		this.$refs.faceDetect.takePhoto() //调用拍照方法
 	}
 }
 let straightenHead = new StraightenHead(10, fun)
 ```
	
# 使用建议
```
ios中bug解决方案：
在ios中，二次进入使用该组件有问题，解决办法：单独将该组件作为一个页面（或者下载demo查看），代码如下：

//主页面
<template>
	<view>
		<button type="default" @click="init">人脸检测</button>
		<image mode="aspectFit" :src="imgSrc" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgSrc: '',
			}
		},
		methods: {
			init(){
				uni.navigateTo({
					url:"/pages/face/face",
					events:{
						data: (path) => {
							this.imgSrc = path
						}
					}
				})
			}
		}
	}
</script>



//face.vue页 demo1
<template>
	<view>
		<face-bio-assay :isDev="false" ref="faceDetect" @detectFailed="detectFailed" @photoChange="photoChange">
		</face-bio-assay>
	</view>
</template>

<script>
	import faceBioAssay from '@/uni_modules/face-bio-assay/components/face-bio-assay/face-bio-assay.vue'
	export default {
		components: {
			faceBioAssay,
		},
		onLoad(option) { //一定要onLoad，onShow在进入相机授权页面退回时会再次触发
			this.$refs.faceDetect.initData()
		},
		methods: {
			detectFailed() {
				uni.showToast({
					title: "人脸核验失败~",
					icon: 'none'
				})
				uni.navigateBack()
			},
			photoChange(path) {
				uni.navigateBack()
				this.getOpenerEventChannel().emit('data',path);
			}
		}
	}
</script>



//face demo2
actions 本版本改用funaction否则action子类继承的父类信息在prop中会丢失.
<template>
	<view>
		<face-bio-assay :hasSwitch="false" :actions="actions" :isDev="false" ref="faceDetect"
			@detectFailed="detectFailed" @photoChange="photoChange">
		</face-bio-assay>
	</view>
</template>

<script>
	import faceBioAssay from '@/uni_modules/face-bio-assay/components/face-bio-assay/face-bio-assay.vue'
	import StraightenHead from '@/uni_modules/face-bio-assay/components/face-bio-assay/actions/StraightenHead.js'

	export default {
		components: {
			faceBioAssay,
		},

		onLoad(option) {
			this.$refs.faceDetect.initData()
		},

		data() {
			return {
				actions: (takePhoto) => {
					return [new StraightenHead(10, (state) => {
						if (state === 'success') {
							takePhoto()
						}
					})]
				}
			}
		},


		methods: {
			detectFailed() {
				uni.showToast({
					title: "人脸核验失败~",
					icon: 'none'
				})
				uni.navigateBack()
			},

			photoChange(path) {
				uni.navigateBack()
				this.getOpenerEventChannel().emit('data', path);
			}
		}

	}
</script>

<style>
</style>


```

# 类的使用
## Action
	动作类，开发者可继承该类重写 takeFrame 方法 如：
```
//点头动作
import Action from "./Action.js"
class NodHead extends Action {
	constructor(second=10,fun) {
		//时间限制（s），结束时回调，完成次数(limit)，基本提示
		super(second,fun,1,'请点头')
		this.maxPitch = 0
		this.minPitch = 0
	}
	takeFrame(faceData){
		let face = faceData.faceInfo[0]
		if(face.angleArray.pitch>this.maxPitch){
			this.maxPitch = face.angleArray.pitch
		}
		if(face.angleArray.pitch<this.minPitch){
			this.minPitch = face.angleArray.pitch
		}
		if(Math.abs(this.minPitch-this.maxPitch)>0.45 &&  (this.minPitch || this.maxPitch)  ){
			this.frames.push('点头') //frames 完成的帧数组 根据该数组长度和limit判断是否完成
			this.maxPitch = 0
			this.minPitch = 0
		}
	}
}

export default NodHead
```
## ActionContainer
	动作容器的使用案例
``` 
buildActions() {
				if (this.buildActionContainer) {
					return this.buildActionContainer()
				}
				let actions = []
				if (!this.actions?.length) {
					let nodHead = new NodHead()
					const fun = (state) => {
						if (state === 'success') {
							this.takePhoto() //拍照
						}
					}
					let straightenHead = new StraightenHead(10, fun) //平视 结束拍照
					let straightenHead2 = new StraightenHead(10) //平视
					let shakeHead = new ShakeHead()
					actions = [straightenHead2, nodHead, shakeHead, straightenHead]
				} else {
					actions = this.actions
				}
				//new ActionContainer(actions,...)
				//动作组 actions
				//起始动作下标 index
				//初始提示 tip
				//绑定 完成所有动作的回调 endFun
				//绑定 动作进行中 ingFun
				//绑定 动作完成时 successFun
				//绑定 动作失败时 failFun
				let act = new ActionContainer(actions)
				act.end(() => { //也可用该方法绑定endFun方法
					this.detectOver()
				}).fail(() => { //也可用该方法绑定failFun方法
					this.cameraError()
				})
				//....其他方法类似
				return act
			}
```