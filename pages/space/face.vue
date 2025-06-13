<template>
	<view class="page">
		<fa-navbar title=" " :background="{ color: '#fff' }" :border-bottom="false"></fa-navbar>
		<view class="titleWrap">
			<view class="title">
				扫描面部信息
			</view>
			<view class="subtitle">
				提取面部图像特征,检测您的能量频率
			</view>
		</view>
		<view class="icon">
			<image :src="staticurl('/common/facescan_con.png')" mode=""></image>
		</view>
		
		
		<view class="tipsWrap">
			<view class="tipsInner">
				<u-icon :name="staticurl('/common/facescan_ico1.svg')" size="80"></u-icon>
				<text>正对手机</text>
			</view>
			<view class="tipsInner">
				<u-icon :name="staticurl('/common/facescan_ico2.svg')" size="80"></u-icon>
				<text>光线充足</text>
			</view>
			<view class="tipsInner">
				<u-icon :name="staticurl('/common/facescan_ico3.svg')" size="80"></u-icon>
				<text>脸无遮挡</text>
			</view>
		</view>
		
		
		<view class="xieyi" @click="check = !check">
			<view class="check">
				<checkbox :checked="check" />
			</view>
			<view class="text">
				已阅读并同意 <text @click="goPage('/pages/page/page?diyname=facialprivacy')">《人脸信息采集用户隐私条款》</text>
			</view>
		</view>
		<view class="nextBtn" @click="nextFun">
			开始扫描
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
					url: '/pages/space/face-detect'
				})
			},
			nextFun() {
				if (!this.check) {
					this.showModal = true
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
		
		.titleWrap{
			margin-bottom:100rpx;
			margin-top:80rpx;
		}

		.title {
			color: rgb(17, 17, 17);
			font-family: Dream Han Sans CN;
			font-size: 48rpx;
			font-weight: 600;
			margin-bottom:12rpx;
			line-height: 80rpx;
			letter-spacing: 0px;
			text-align: center;
		}
		
		.subtitle{
			font-size: 32rpx;
			color: rgba(0, 0, 0,.6);
		}
	}
	
	.tipsWrap{
		display: flex;
		gap:80rpx;
		margin:80rpx 0rpx 30rpx 0rpx;
		.tipsInner{
			display: flex;
			flex-direction: column;
			align-items: center;
			gap:12rpx;
		}
	}

	.nextBtn {
		width: 648rpx;
		height: 110rpx;
		border-radius: 300px;
		background: #12A89D;
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
		margin-top: 36rpx;
	}
	
	/deep/ uni-checkbox .uni-checkbox-input {
		border-radius: 50%!important;
	}

	.xieyi {
		display: flex;
		margin-top: 80rpx;
		align-items: center;
		.text {
			font-family: Dream Han Sans CN;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;

			text {
				color: #12A89D;
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