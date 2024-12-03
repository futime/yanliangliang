<template>
	<view class="page">
		<fa-navbar title="我的" :background="{ background: scrollTop > 40 ? '#fff' : 'transparent' }" :borderBottom="false"></fa-navbar>
		<view class="bg">
			<image :src="staticurl('userbg.png')" mode=""></image>
		</view>
		<view class="userInfo" @click="gotoProfile">
			<view class="avatar">
				<image :src="staticurl('shuoming_icon.png')" mode=""></image>
			</view>
			<view class="right">
				<view class="nickname">{{ vuex_user.nickname || '点击登录' }}</view>
				<view class="vipstatus" v-if="vuex_token || vuex_vipinfo">{{ vuex_vipinfo.name || ''}}：{{ checkVipExpiry() || '已过期'}}</view>
			</view>
		</view>
		<view class="contentcard">
			<view class="topcard" @click="handleClickBuyVip">
				<view class="left">
					<view class="text1">
						<view class="">VIP套餐</view>
						<view class="icon">
							<image :src="staticurl('vip_icon.png')" mode=""></image>
						</view>
					</view>
					<view class="text2">
						购买套餐享更多优惠
					</view>
				</view>
				<view class="right">
					购买
				</view>
			</view>
			<view class="listitem" v-for="item in list" :key="item.id" @click="handleClickItem(item)">
				<view class="icon">
					<image :src="item.img" mode=""></image>
				</view>
				<view class="text">
					{{ item.label }}
				</view>
				<view class="rightIcon">
					<image :src="staticurl('shuoming_btn_arrow.png')" mode=""></image>
				</view>
				 <button v-if="item.id == 2" open-type="contact" class="contactButton"></button>
			</view>
			
			<view class="logout" v-if="vuex_token">
				<view class="logoutbtn" @click="goPage('out')">
					退出登录
				</view>
			</view>
		</view>
		<faTabbarVue :active="'my'"></faTabbarVue>
	</view>
</template>

<script>
	import faTabbarVue from '@/components/fa-tabbar/index.vue'

	export default {
		components: {
			faTabbarVue
		},
		data() {
			return {
				list: [
					{
						img: this.staticurl('vip_icon.png'),
						label: '订单查询',
						id: 1
					},
					{
						img: this.staticurl('vip_icon.png'),
						label: '联系客服',
						id: 2
					},
					{
						img: this.staticurl('vip_icon.png'),
						label: '邀请分享',
						id: 3
					},
					{
						img: this.staticurl('vip_icon.png'),
						label: '隐私条例政策',
						id: 4
					},
					{
						img: this.staticurl('vip_icon.png'),
						label: '积分商城',
						id: 5
					},
					{
						img: this.staticurl('vip_icon.png'),
						label: '清除本机缓存',
						id: 6
					}
				],
				scrollTop: 0
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onShow() {
			if (this.vuex_token) {
				this.getUserIndex();
			} else {
				this.$u.vuex('vuex_user', {});
			}
		},
		methods: {
			handleClickItem(item) {
				switch(item.id) {
					case 1:
						if(!this.vuex_token) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
							return
						}
						uni.navigateTo({
							url: '/pages/vip/orderlist'
						})
						break
					case 3: 
						uni.showToast({
							title: '功能待开放',
							icon: 'none'
						})
						break
					case 4: 
						uni.navigateTo({
							url: '/pages/page/page?diyname=privacypolicy'
						})
						break;
					case 5:
						uni.navigateTo({
							url: '/pages/score/exchange'
						})
						break;
					case 6:
						uni.showToast({
							title: '清除缓存成功！',
							icon: 'none'
						})
						break;
				}
			},
			handleClickBuyVip() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/vip/activate'
				})
			},
			getUserIndex: async function() {
				let res = await this.$api.getUserIndex();
				uni.stopPullDownRefresh();
				if (res.code == 1) {
					const res2 = await this.$api.getVipInfo()
					this.$u.vuex('vuex_vipinfo', res2.data.vipInfo);
					this.$u.vuex('vuex_user', res.data.userInfo || {});
					if (res.data.showProfilePrompt && !this.vuex_setting.prompted) {
						// 弹窗每次登录状态只提示一次
						this.$u.vuex('vuex_setting.prompted', true);
					// 	uni.showModal({
					// 		title: '温馨提示',
					// 		confirmText: '去设置',
					// 		cancelText: '取消',
					// 		showCancel: true,
					// 		content: '当前未设置昵称，请设置昵称后再继续操作',
					// 		success: (res) => {
					
					// 			if (res.confirm) {
					// 				this.$u.route("/pages/my/profile");
					// 			} else if (res.cancel) {
					
					// 			}
					// 		}
					// 	});
					}
				} else {
					this.$u.toast(res.msg);
					return;
				}
			},
			gotoProfile(){
				console.log(this.vuex_token)
				if(this.vuex_token){
					uni.navigateTo({
						url: '/pages/my/profile-add'
					})
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		padding: 0 40rpx;
		min-height: 100vh;
		padding-bottom: 220rpx;

		&:before {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: linear-gradient(180.00deg, rgb(192, 239, 255) 0%, rgba(192, 239, 255, 0) 21.453%), rgb(228, 237, 240);
			z-index: -2;
		}

		.userInfo {
			padding: 50rpx 0;
			display: flex;

			.avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 100%;
				overflow: hidden;
				border: 4rpx solid rgb(255, 255, 255);
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				border-radius: 300rpx;
				box-shadow: 0px 10rpx 30rpx 0px rgba(0, 0, 0, 0.1);
				background: rgb(192, 239, 255);

				image {
					width: 100rpx;
					height: 100rpx;
				}
			}

			.right {
				height: 160rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 37rpx;

				.nickname {
					color: rgb(0, 0, 0);
					font-family: Dream Han Sans CN;
					font-size: 48rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
					margin-bottom: 22rpx;
				}

				.vipstatus {
					color: rgb(0, 0, 0);
					font-family: Dream Han Sans CN;
					font-size: 30rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
				}
			}
		}

		.bg {
			position: absolute;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			left: 0;
			top: 0;
			bottom: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.contentcard {
		width: 100%;
		background-color: #fff;
		border-radius: 24rpx;
		position: relative;
		top: -20rpx;
		.topcard {
			padding: 40rpx 38rpx;
			border-radius: 24rpx 24rpx 0px 0px;
			background: linear-gradient(180.00deg, rgb(243, 148, 30), rgba(243, 148, 30, 0) 100%), rgb(252, 179, 88);
			display: flex;
			.left {
				flex: 1;
				height: 120rpx;
				flex-direction: column;
				display: flex;
				justify-content: center;
				.text1 {
					color: rgb(255, 255, 255);
					font-family: Dream Han Sans CN;
					font-size: 42rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
					display: flex;
					align-items: center;
					margin-bottom: 12rpx;
					.icon {
						width: 42rpx;
						height: 42rpx;
						margin-left:16rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
				.text2 {
					color: rgb(255, 255, 255);
					font-family: Dream Han Sans CN;
					font-size: 36rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
				}
			}
			.right  {
				width: 210rpx;
				height: 100rpx;
				box-sizing: border-box;
				border: 4rpx solid rgb(255, 255, 255);
				border-radius: 300px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: rgb(255, 255, 255);
				font-family: Dream Han Sans CN;
				font-size: 42rpx;
				font-weight: 400;
				line-height: 42rpx;
				letter-spacing: 0px;
				text-align: left;
			}
		}
	}
	
	.listitem {
		padding: 30rpx 60rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #DDDDDD;
		position: relative;
		.contactButton {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: transparent;
		}
		&:last-child {
			border-bottom: none;
		}
		.icon {
			width: 60rpx;
			height: 60rpx;
			flex-shrink: 0;
			margin-right: 20rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.text {
			flex: 1;
			color: rgb(17, 17, 17);
			font-family: Dream Han Sans CN;
			font-size: 40rpx;
			font-weight: 500;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;
		}
		
		.rightIcon {
			flex-shrink: 0;
			width: 20rpx;
			height: 40rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.logout {
		padding: 91rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.logoutbtn {
			width: 480rpx;
			height: 120rpx;
			border-radius: 300px;
			background: rgb(243, 148, 30);
			display: flex;
			justify-content: center;
			align-items: center;
			
			color: rgb(255, 255, 255);
			font-family: 思源黑体 CN;
			font-size: 40rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: center;
		}
	}
</style>