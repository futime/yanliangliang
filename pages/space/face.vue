<template>
	<view class="page">
		<fa-navbar title="扫描面部信息" :background="{ color: '#fff' }"></fa-navbar>
		<view class="icon">
			<image :src="staticurl('facescan_icon.png')" mode=""></image>
		</view>
		<view class="title">
			扫描面部信息<br>
			提取面部图像特征
		</view>
		<view class="nextBtn" @click="nextFun">
			开始扫描
		</view>
		<view class="xieyi" @click="check = !check">
			<view class="check">
				<checkbox :checked="check" />
			</view>
			<view class="text">
				已阅读并同意 <text @click="goPage('/pages/page/page?diyname=facialprivacy')">《人脸信息采集用户隐私条款》</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				check: false
			}
		},
		methods: {
			nextFun(){ 
				if(!this.check) {
					uni.showToast({
						title: '请勾选同意隐私协议',
						icon: 'none'
					})
					return 
				}
				uni.redirectTo({
					url: '/pages/space/face-detect'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.icon {
			width: 478rpx;
			height: 467rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.title {
			color: rgb(17, 17, 17);
			font-family: Dream Han Sans CN;
			font-size: 48rpx;
			font-weight: 400;
			line-height: 80rpx;
			letter-spacing: 0px;
			text-align: center;
			margin-top: 120rpx;
		}
	}
	.nextBtn {
		width: 648rpx;
		height: 130rpx;
		border-radius: 300px;
		background: rgb(243, 148, 30);
		color: rgb(255, 255, 255);
		font-family: 思源黑体 CN;
		font-size: 40rpx;
		font-weight: 400;
		line-height: 50rpx;
		letter-spacing: 0px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 75rpx;
	}
	
	.xieyi {
		display: flex;
		margin-top: 80rpx;
		.text {
			font-family: Dream Han Sans CN;
			font-size: 30rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;
			text {
				color: #1B78FB;
			}
		}
	}
</style>