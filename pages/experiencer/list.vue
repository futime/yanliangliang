<template>
	<view class="page">
		<fa-navbar title="体验者列表" :borderBottom="true"></fa-navbar>
		<view class="tipBox">
			<view class="icon">
				<u-icon name="info-circle" color="#F3941E" size="55"></u-icon>
			</view>
			<view class="text">
				添加完资料后，点击选择按钮进入能量空间
			</view>
		</view>
		<view class="listBox">
			<view class="listItem">
				<view class="listItem-content">
					<view class="userinfo">
						<view class="name">Marks</view>
						<view class="phone">18888888888</view>
					</view>
					<view class="icon">
						<u-icon name="arrow-right" color="#999999" size="40"></u-icon>
					</view>
				</view>
				<view class="listItem-action">
					<view class="buttonitem select">选择</view>
					<view class="buttonitem edit">编辑</view>
				</view>
			</view>
			
			<view class="tishi">
				<view class="tishititle">
					温馨提示:
				</view>
				<view class="desc">
					<text>1. 体验者信息仅用于平台能量空间体验服务，<br>不会外传，请您填写真实个人资料。<br> </text>
					<text>2. 为确保数据准确性，建议上传体验者照片，<br>添加体验者时，请确认信息无误后再提交。 </text>
				</view>
			</view>
		</view>
		
		<view class="btnGroup">
			<view class="addbottom" @click="handleClickAdd">
				<view class="icon">
					<image :src="staticurl('adduser_icon.png')" mode=""></image>
				</view>
				<view class="text">
					新增体验者资料
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectColor: {
					color: rgb(243, 148, 30)
				},
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			async getList() {
				const res = await this.$api.listpatient()
				console.log(res)
			},
			handleClickAdd() {
				uni.navigateTo({
					url: '/pages/experiencer/add'
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F6F8FB;
	}
</style>
<style lang="scss" scoped>
	
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom:180rpx;
	}
	
	.tipBox {
		display: flex;
		align-items: center;
		color: #F3941E;
		font-family: 思源黑体;
		font-size: 30rpx;
		font-weight: 400;
		line-height: 43rpx;
		letter-spacing: 0px;
		text-align: left;
		background: rgb(253, 241, 225);
		padding: 26rpx 50rpx;
		.icon {
			margin-right: 10rpx;
		}
	}
	.listBox{ 
		padding: 39rpx 50rpx;
		
		.listItem {
			padding: 20rpx;
			border-radius: 20rpx;
			box-shadow: 0px 4rpx 4rpx 2rpx rgba(0, 0, 0, 0.08);
			background: rgb(255, 255, 255);
			margin-bottom:40rpx;
			.listItem-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				padding-bottom: 30rpx;
				
				.userinfo {
					color: rgb(0, 0, 0);
					font-family: Arial;
					font-size: 38rpx;
					font-weight: 400;
					line-height: 44rpx;
					letter-spacing: 0%;
					text-align: left;
					color: rgb(85, 99, 111);

					.name {
						margin-bottom: 20rpx;
					}
					.phone{
						font-size:32rpx;
					}
				}
			}
			.listItem-action {
				padding-top: 20rpx;
				display: flex;
				justify-content: flex-end;
				
				.buttonitem {
					margin-right: 30rpx;
					// width: 122rpx;
					padding: 20rpx;
					height: 70rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					border: 1px solid rgba(0, 0, 0, 0.2);
					color: rgb(102, 102, 102); 
					border-radius: 8rpx;
					&.select {
						border: 2px solid rgb(243, 148, 30);
						color:  rgb(243, 148, 30);
					}
					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}
	
	.tishi {
		margin-top: 80rpx;
		.tishititle {
			color: #666;
			font-size: 36rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;
			margin-bottom: 20rpx;
		}
		.desc {
			color: #666;
			font-size: 32rpx;
			font-weight: 400;
			line-height: 1.8;
			letter-spacing: 0px;
			text-align: left;
			text{
				display: block;
				margin-bottom:12rpx;
			}
		}
	}
	
	.btnGroup{
		width:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom:0vh;
		left:0px;
		height:160rpx;
		background: #fff;
	}
	
	.addbottom {
		width:80%;
		height: 123rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background:#F3941E;
		border-radius: 100rpx;
		margin: 0 50rpx;
		.icon {
			width: 45rpx;
			height:48rpx;
			margin-right: 30rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.text {
			color: rgb(255, 255, 255);
			font-family: 思源黑体 CN;
			font-size: 42rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: center;
		}
	}
</style>