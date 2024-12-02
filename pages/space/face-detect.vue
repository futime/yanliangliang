<template>
	<view class="page">
		<fa-navbar title="扫描面部信息" :background="{ background: '#fff' }"></fa-navbar>
		<view class="faceBox">
			<camera :device-position="'back'" class="camera" flash="off" resolution='high' />
			<view class="mask">
				<image :src="staticurl('facescan_mask.png')" mode=""></image>
			</view>
		</view>
		<view class="statusText">{{ tipsText }}</view>
		<view class="progressBox">
			<view class="progress">
				<view class="bar" :style="{ width: progress + '%'}"></view>
			</view>
			<view class="label">{{ progress }}%</view>
		</view>

		<canvas id="myCanvas" canvas-id="myCanvas"
			:style="'width:'+screenWidth+'px;'+'height:'+screenHeight+'px'"></canvas>
	</view>
</template>

<script>
	import { loginfunc } from '@/common/fa.mixin.js';
	export default {
		mixins: [loginfunc],
		data() {
			return {
				tipsText: '正在提取中',
				cameraEngine: null,
				isAuthCamera: true,
				progress: 0,
				faceDetectInitialized: null,
				screenWidth: 375,
				screenHeight: 640,
				isFlag2: true,
			}
		},
		onLoad() {
			this.initData()
		},
		onReady() {


		},
		methods: {
			// 初始化相机引擎
			initData() {
				// #ifdef MP-WEIXIN
				// 1、初始化人脸识别
				if (!this.faceDetectInitialized) {
					wx.initFaceDetect();
					this.faceDetectInitialized = true;
				}
				// 2、创建 camera 上下文 CameraContext 对象
				this.cameraEngine = wx.createCameraContext()
				// 3、获取 Camera 实时帧数据
				const listener = this.cameraEngine.onCameraFrame((frame) => {
					if (this.tempImg) {
						return;
					}

					if (this.isFlag2) {
						this.isFlag2 = false;
						this.screenWidth = frame.width;
						this.screenHeight = frame.height;
					}
					// 4、人脸识别，使用前需要通过 wx.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据
					wx.faceDetect({
						frameBuffer: frame.data,
						width: frame.width,
						height: frame.height,
						enablePoint: true,
						enableConf: true,
						enableAngle: true,
						enableMultiFace: true,
						success: (faceData) => {
							let face = faceData.faceInfo[0]
							if (faceData.x == -1 || faceData.y == -1) {
								if (this.progress == 100) return
								this.tipsText = '检测不到人'
								this.progress = 0
							}
							if (faceData.faceInfo.length > 1) {
								if (this.progress == 100) return
								this.tipsText = '请保证只有一个人'
								this.progress = 0
							} else {
								const {
									pitch,
									roll,
									yaw
								} = face.angleArray;
								const standard = 0.5
								if (Math.abs(pitch) >= standard || Math.abs(roll) >= standard ||
									Math.abs(yaw) >= standard) {
									if (this.progress == 100) return
									this.tipsText = '请平视摄像头'
									this.progress = 0
								} else if (face.confArray.global <= 0.8 || face.confArray.leftEye <=
									0.8 || face.confArray.mouth <= 0.8 || face.confArray.nose <= 0.8 ||
									face.confArray.rightEye <= 0.8) {
									if (this.progress == 100) return
									this.tipsText = '请勿遮挡五官'
									this.progress = 0
								} else {
									this.tipsText = '正在提取中'
									// 这里可以写自己的逻辑了
									// 每隔几秒钟增加进度条的百分之10
									if (!this.progressInterval) {
										let progressStep = 10; // 每次增加10%
										let interval = 500; // 每隔5秒更新一次

										this.progressInterval = setInterval( async () => {
											if (this.progress < 100) {
												this.progress = Math.min(this.progress +
													progressStep, 100); // 进度条最大为100%
											} else {
												clearInterval(this
													.progressInterval); // 进度到达100%时停止定时器
												uni.showLoading({
													title: '加载中...'
												})
												const filePath = await this.changeDataToBase64(
													frame);

												let res = await this.$api.goUpload({
													filePath: filePath
												});
												if (!res.code) {
													this.$u.toast(res.msg);
												}
												const uploadres = await this.$api.uploadFaceImage({
													image: res.data.url
												})
												if(!uploadres.code) {
													this.$u.toast(uploadres.msg);
												}
												this.getVipInfo()
												uni.redirectTo({
													url: '/pages/space/index'
												})
											}
										}, interval);
									}

								}
							}
						},
						fail: (err) => {
							if (err.x == -1 || err.y == -1) {
								if (this.progress == 100) return
								this.tipsText = '检测不到人'
								this.progress = 0
							} else {
								if (this.progress == 100) return
								this.tipsText = err.errMsg || '网络错误，请退出页面重试'
								this.progress = 0
							}
						},
					})
				})
				// 5、开始监听帧数据
				listener.start()
				// #endif
			},
			changeDataToBase64(frame) {
				return new Promise((resolve, reject) => {
					var data = new Uint8Array(frame.data);
					var clamped = new Uint8ClampedArray(data);
					let that = this;
					// 当前帧数据转为data并画在canvas上
					wx.canvasPutImageData({
						canvasId: 'myCanvas',
						x: 0,
						y: 0,
						width: frame.width,
						height: frame.height,
						data: clamped,
						success(res) {
							// 转换临时文件
							wx.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: frame.width,
								height: frame.height,
								canvasId: 'myCanvas',
								fileType: 'jpg',
								destWidth: frame.width,
								destHeight: frame.height, // 精度修改  
								quality: 0.5,
								success(res) {
									// 临时文件转base64
									// wx.getFileSystemManager().readFile({
									// 	filePath: res.tempFilePath, //选择图片返回的相对路径 
									// 	encoding: 'base64', //编码格式  
									// 	success: res => {
									// 		// 保存base64
									// 		resolve(res.data);
									// 	}
									// })
									resolve(res.tempFilePath)
								},
								fail(res) {
									reject(false);
								}
							});
						},
						fail(error) {
							console.log(error);
						}
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.faceBox {
		width: 100vw;
		height: 60vh;
		background-color: #c0c0c0;
		position: relative;

		// position: absolute;
		// top: 0;
		// left: 0;
		.camera {
			width: 100%;
			height: 100%;
		}

		.mask {
			width: 630rpx;
			height: 630rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.statusText {
		color: rgb(51, 51, 51);
		font-family: Dream Han Sans CN;
		font-size: 48rpx;
		font-weight: 400;
		line-height: 50rpx;
		letter-spacing: 0px;
		text-align: center;
		margin-top: 65rpx;
	}

	.progressBox {
		margin-top: 65rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.progress {
			width: 689rpx;
			height: 24rpx;
			border-radius: 24rpx;
			background: rgb(255, 235, 211);
			overflow: hidden;

			.bar {
				border-radius: 24rpx;
				height: 24rpx;
				background-color: #F3941E;
			}
		}

		.label {
			margin-top: 30rpx;
		}
	}

	#myCanvas {
		position: absolute;
		z-index: 1;
		top: -10000px;
	}
</style>