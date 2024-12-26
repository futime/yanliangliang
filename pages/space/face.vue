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

		<u-popup v-model="showModal" :safe-area-inset-bottom="true" mode="bottom" border-radius="24">
			<view class="modal">
				<view class="modal-title">
					请阅读并同意以下条款
				</view>
				<view class="modal-content">
					<text @click="goPage('/pages/page/page?diyname=facialprivacy')">《人脸信息采集用户隐私条款》</text>
				</view>
				<view class="action">
					<view class="confirmBtn" @click="confirmBtn">
						同意并继续
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				check: false,
				showModal: false
			}
		},
		methods: {
			confirmBtn() {
				this.check = true
				uni.redirectTo({
					url: '/pages/space/face'
				})
			},
			nextFun() {
				if (!this.check) {
					this.showModal = true
					return
				}
				uni.redirectTo({
					url: '/pages/space/face'
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
	
	.modal {
		.modal-title {
			padding: 40rpx 0;
			font-size: 38rpx;
			color: #333;
			text-align: center;
			border-bottom: 2rpx solid #ddd;
		}
		.modal-content {
			padding: 40rpx 0;
			text-align: center;
			color: #1B78FB;
		}
		.action {
			padding:  0 40rpx 0 80rpx;
			text-align: center;
			display: flex;
			justify-content: center;
			.confirmBtn {
				width: 80%;
				height: 123rpx;
				border-radius: 100rpx;
				background-color: rgb(243, 148, 30);
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			
		}
	}
</style>