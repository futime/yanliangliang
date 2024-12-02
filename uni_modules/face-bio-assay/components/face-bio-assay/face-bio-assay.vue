<template>
	<view class="modal bottom-modal" :class="show ? 'show' : ''">
		<camera flash="off" :device-position="device" resolution="high" @stop="stop" @error="error"
			style="width: 100vw;height: 100vh; position: fixed;top: 0;left: 0;">
			<cover-view class="cover">
				<cover-view class="cover-top cover-item">
					<cover-view class="bar bg-white" style="justify-content: flex-start;">
						<cover-view class="action" @tap="close">关闭
						</cover-view>
					</cover-view>
					<template>
						<slot>
							<cover-view v-if="isDev && face">
								<cover-view :style="Math.abs(face.pitch)>0.5?'color:red':''">
									{{ face.pitch ? face.pitch.toFixed(2): 'null'}}
								</cover-view>
								<cover-view :style="Math.abs(face.roll)>0.5?'color:red':''">
									{{ face.roll ? face.roll.toFixed(2):'null'}}
								</cover-view>
								<cover-view :style="Math.abs(face.yaw)>0.5?'color:red':''">
									{{ face.yaw ? face.yaw.toFixed(2):'null'}}
								</cover-view>
							</cover-view>
						</slot>
					</template>
					<cover-view class="detectInfo">{{ isSuccess ? '人脸检测成功' : tipsText}}</cover-view>
				</cover-view>
				<cover-view class="camera">
					<cover-image class="camera" src="../../static/images/cover.png"></cover-image>
				</cover-view>
				<cover-view class="cover-bottom cover-item">
					<cover-image v-if="hasSwitch" class="qhImage" @click="deviceQH"
					src="../../static/images/qh.png"></cover-image>
				</cover-view>
			</cover-view>
		</camera>
	</view>
</template>

<script>
	// 人脸检测
	/**
	 * @event {Function} photoChange 拍照完成事件
	 * @event {Function} detectFailed 人脸检测失败
	 * @event {Function} detectOver 人脸检测结束
	 * @method {Function} initData 初始化人脸检测
	 */
	import {
		NodHead,
		StraightenHead,
		ShakeHead
	} from './actions/index.js'
	import ActionContainer from './ActionContainer.js'

	export default {
		name: 'face-detect',
		data() {
			return {
				device:'front',
				show: false,
				tipsText: '检测不到人脸',
				isSuccess: false, //是否检测完成
				face: {},
				actionsList: null,
				context: "",
				tipsTextCss: "tipsTextCss",
				listener: null
			}
		},
		props: {
			buildActionContainer: Function,
			actions:Function,
			hasSwitch:false,
			isDev: false,
		},
		mounted() {
			// uni.initFaceDetect()
			// this.onCameraFrame()
		},
		destroyed() {

		},
		methods: {
			deviceQH() {
				if (!this.hasSwitch) {
					return
				}
				this.device = this.device == 'back' ? 'front' : 'back';
			},
			setMaxFace(faceData) {
				const faces = faceData.faceInfo // 获取到所有人脸信息
				let maxFaceIndex = 0
				let maxFaceSize = 0
				// 遍历所有人脸信息，找到最大的人脸
				for (let i = 0; i < faces.length; i++) {
					const face = faces[i]
					const faceSize = face.width * face.height
					if (faceSize > maxFaceSize) {
						maxFaceSize = faceSize
						maxFaceIndex = i
					}
				}
				// 返回最大的那张脸的坐标信息
				const maxFace = faces[maxFaceIndex]
				faceData.faceInfo = [maxFace]
			},
			onCameraFrame() {
				uni.initFaceDetect()
				let time = new Date().getTime()
				this.context = uni.createCameraContext()
				this.listener = this.context.onCameraFrame((frame) => {
					uni.faceDetect({
						frameBuffer: frame.data,
						width: frame.width,
						height: frame.height,
						enablePoint: true,
						enableConf: true,
						enableAngle: true,
						enableMultiFace: true,
						success: (faceData) => {
							time = new Date().getTime()
							this.setMaxFace(faceData)
							this.showData(faceData)
							this.actionsList.next(faceData)
							this.tipsText = this.actionsList.tip
						},
						fail: (err) => {
							if ((time + 10 * 1000) < new Date().getTime()) {
								this.tipsText = '检测不到人脸'
								this.cameraError()
								return
							}
							if (err.x == -1 || err.y == -1) {
								this.tipsText = '检测不到人脸'
							}
						}
					})
				})
				this.listener.start()
			},
			error() {
				// this.tipsText = '相机异常'
				// this.cameraError()
			},
			stop() {
				// this.tipsText = '相机异常'
				// this.cameraError()
			},
			// 核验失败
			cameraError(e) {
				this.t = setTimeout(() => {
					clearTimeout(this.t)
					this.hideModal()
					this.$emit('detectFailed')
				}, 2000);
			},
			close() {
				clearTimeout(this.t)
				this.hideModal()
				this.$emit('detectFailed')
			},
			// 关闭
			hideModal() {
				uni.stopFaceDetect()
				this.show = false
				this.tipsText = '检测不到人脸'
				this.face = {}
				this.isSuccess = false
			},
			// 拍照
			takePhoto() {
				this.context.takePhoto({
					quality: 'high',
					success: (res) => {
						this.$emit('photoChange', res.tempImagePath)
					},
					fail: (e) => {
						console.log(e)
					},
					complete: (e) => {
						console.log(e)
					}
				});
			},

			// 检测完成
			detectOver() {
				this.isSuccess = true
				let t = setTimeout(() => {
					this.hideModal()
					clearTimeout(t)
					this.$emit('detectOver')
				}, 3000);
			},

			initData() {
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.camera']===true) {
							this.onCameraFrame()
							this.faceDetect()
						} else if(res.authSetting['scope.camera']=== false) {
							this.getCameraAuth()
						}else{
							this.onCameraFrame()
							this.faceDetect()
						}
					}
				})
			},

			getCameraAuth() {
				uni.showModal({
					title: '温馨提示',
					content: '需要获取您摄像头权限才能更好的为您服务！是否授权摄像头权限？',
					confirmText: '授权',
					confirmColor: '#f94218',
					success: (res) => {
						if (res.confirm) {
							// 选择弹框内授权
							uni.openSetting({
								success: (res) => {
									if (res.authSetting[
											'scope.camera'
										]) {
										this.onCameraFrame()
										this.faceDetect()
									} else {
										this.tipsText = "您未授权摄像头权限"
										this.cameraError()
									}
								}
							})
						} else if (res.cancel) {
							this.tipsText = "您未授权摄像头权限"
							this.cameraError()
						}
					}
				})
			},

			showData(faceData) {
				this.$emit("showData", faceData)
				if (this.isDev) {
					let face = faceData.faceInfo[0].angleArray
					this.face = face
				}
			},

			buildActions() {
				if (this.buildActionContainer) {
					return this.buildActionContainer()
				}
				let actions = []
				if (!this.actions) {
					let nodHead = new NodHead()
					const fun = (state) => {
						if (state === 'success') {
							this.takePhoto()
						}
					}
					let straightenHead = new StraightenHead(10, fun)
					let straightenHead2 = new StraightenHead(10)
					let shakeHead = new ShakeHead()
					actions = [straightenHead2, nodHead, shakeHead, straightenHead]
				} else {
					actions = this.actions(this.takePhoto)
				}
				let act = new ActionContainer(actions)
				act.end(() => {
					this.detectOver()
				}).fail(() => {
					this.cameraError()
				})
				return act
			},

			// 初始化人脸检测
			faceDetect() {
				this.show = true
				this.actionsList = this.buildActions()
			}

		}
	}
</script>

<style scoped>
	.modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1110;
		opacity: 0;
		outline: 0;
		text-align: center;
		backface-visibility: hidden;
		perspective: 2000rpx;
		background: rgba(0, 0, 0, 0.6);
		pointer-events: none;
	}
	
	.qhImage{
		background-color: #ccc;
		width: 80rpx;
		height: 80rpx;
		z-index: 1001;
		margin: 30rpx;
		border-radius: 50%;
		padding: 16rpx;
	}

	.modal::before {
		content: "\200B";
		display: inline-block;
		height: 100%;
		vertical-align: middle;
	}

	.modal.show {
		opacity: 1;
		overflow-x: hidden;
		overflow-y: auto;
		pointer-events: auto;
	}

	.modal.bottom-modal::before {
		vertical-align: bottom;
	}

	.modal.bottom-modal .dialog {
		width: 100%;
		border-radius: 0;
	}

	.modal.bottom-modal {
		margin-bottom: -1000rpx;
	}

	.modal.bottom-modal.show {
		margin-bottom: 0;
	}

	.dialog {
		position: fixed;
		display: inline-block;
		vertical-align: middle;
		margin-left: auto;
		margin-right: auto;
		/* width: 680rpx; */
		height: 100vh;
		width: 100vw;
		max-width: 100%;
		background-color: #f8f8f8;
		border-radius: 10rpx;
		overflow: hidden;
		left: 0;
		top: 0;
	}

	.bar {
		display: flex;
		position: relative;
		align-items: center;
		min-height: 180rpx;
		height: 180rpx;
		padding: 0rpx 40rpx;
		justify-content: space-between;
	}

	.bg-white {
		background-color: #ffffff;
		color: #666666;
	}

	.action {
		color: #0081ff;
		font-size: 35rpx;
		padding: 10rpx;
	}

	.detectInfo {
		padding: 20rpx 0rpx;
		font-size: 34rpx;
		text-align: center;
		animation-duration: 1.5s;
		color: #000000;
		z-index: 999;
	}

	.faceContent {
		height: 700rpx;
		position: relative;
	}

	.successImage {
		overflow: hidden;
		width: 600rpx;
		height: 600rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 50%;
		z-index: 999;
		transform: translateX(-50%);
	}

	.tipsTextCss {
		animation: 1.5s tipsTextAnimation;
		animation-duration: 1.5s;
	}

	@keyframes tipsTextAnimation {
		0% {
			transform: scale(1);
		}

		20% {
			transform: scale(1.5);
		}

		70% {
			transform: scale(1.5);
		}

		100% {
			transform: scale(1);
		}
	}

	.cover {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.cover-bottom{
		display: flex;
		justify-content: center;
	}

	.cover-item {
		flex: 1;
		width: 100%;
		background-color: #FFFFFF;
	}

	.camera {
		width: 100vw;
		height: 100vw;
		transform: scale(1.05);
		z-index: 999;
	}
</style>
