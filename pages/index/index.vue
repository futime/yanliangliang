<template>
	<view class="page">
		<view class="topView">
			<view class="bg">
				<image :src="staticurl('homebanner_bg.jpeg')" mode=""></image>
			</view>
			<view class="person">
				<image :src="staticurl('homebanner_men.png')" mode="" v-if="vuex_user.gender == 1" ></image>
				<image :src="staticurl('homebanner_madam.png')" mode="" v-else-if="vuex_user.gender == 0" ></image>
				<image :src="staticurl('homebanner_men.png')" mode="" v-else ></image>
			</view>
		</view>
		<view class="content">
			<view class="sanjiaoBox">
				<view class="bgsanjiao">
					<image :src="staticurl('homekvbottom_logo.svg')" mode=""></image>
				</view>
				<view class="text">
					宇宙能量中心
				</view>
			</view>
			<view class="menus">
				<view class="menus-item" @click="handleClickNengliang">
					<view class="icon">
						<image :src="staticurl('energy_logo.png')" mode=""></image>
					</view>
					<view class="label">注入能量</view>
				</view>
				<view class="menus-item" @click="handleClickVip">
					<view class="icon">
						<image :src="staticurl('vip_icon.png')" mode=""></image>
					</view>
					<view class="label">开通会员</view>
				</view>
			</view> 
			<view class="helpbox" @click="goPage('/pages/page/page?diyname=aboutus')">
				<view class="icon">
					<image :src="staticurl('shuoming_icon.png')" mode=""></image>
				</view>
				<view class="helpbox-content">
					眼靓亮使用说明
				</view>
				<view class="rightIcon">
					<image :src="staticurl('shuoming_btn_arrow.png')" mode=""></image>
				</view>
			</view>
		</view>
		<faTabbarVue></faTabbarVue>
	</view>
</template>

<script>
	import faTabbarVue from '@/components/fa-tabbar/index.vue'
	export default {
		components: {
			faTabbarVue
		},
		data()  {
			return {
				
			}
		},
		methods: {
			handleClickNengliang() {
				if(!this.vuex_token){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				
				uni.navigateTo({
					url: '/pages/space/start'
				})
			},
			handleClickVip() {
				if(!this.vuex_token){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				
				uni.navigateTo({
					url: '/pages/vip/activate'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topView {
		width: 100%;
		height: 887rpx;
		position: relative;
		.bg {
			width: 100%;
			height: 100%;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.person {
			position: absolute;
			width: 330rpx;
			height: 688rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.content {
		position: relative;
		top: -4vh;
		padding: 0 40rpx 0 40rpx;
		.sanjiaoBox {
			width: 100%;
			height: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.bgsanjiao {
				width: 400rpx;
				height: 150rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.text {
				position: absolute;
				bottom: -20rpx;
				font-size: 36rpx;
				color: #009E96;
			}
		}
		.menus {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 20rpx;
			margin-top: 40rpx;
			.menus-item {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				border-radius: 12rpx;
				padding: 27rpx 0 27rpx 0;
				&:first-child {
					background: rgb(22, 209, 180);
				}
				&:last-child {
					background: rgb(252, 179, 88);
				}
				.icon {
					width: 88rpx;
					height: 85rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.label {
					color: rgb(255, 255, 255);
					font-family: 思源黑体 CN;
					font-size: 48rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: center;
					margin-top: 15rpx;
				}
			}
		}
		
		.helpbox { 
			width: 100%;
			height: 160rpx;
			background-color: #C0EFFF;
			border-radius: 16rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			padding: 0 48rpx;
			.icon {
				width: 100rpx;
				height: 100rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.helpbox-content { 
				color: rgb(51, 51, 51);
				font-family: 思源黑体 CN;
				font-size: 48rpx;
				font-weight: 400;
				display: flex;
				align-items: center;
				flex: 1;
				margin-left: 48rpx;
			}
			
			.rightIcon {
				width: 20rpx;
				height: 40rpx;
				flex-shrink: 0;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>