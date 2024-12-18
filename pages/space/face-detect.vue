<template>
	<view class="page">
		<fa-navbar title="扫描面部信息" :background="{ background: '#fff' }"></fa-navbar>

	</view>
</template>

<script>
	import {
		loginfunc
	} from '@/common/fa.mixin.js';
	import face from "@/uni_modules/mcc-face2/index.js"
	export default {
		mixins: [loginfunc],
		data() {
			return {

			}
		},
		onLoad() {},
		onReady() {
			
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
			
			    // face.close() 
			})
		},
		methods: {}
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