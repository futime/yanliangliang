<template>
	<view class="page">
		<fa-navbar title="我的" :background="{ background: scrollTop > 40 ? '#fff' : 'transparent' }" :borderBottom="false"></fa-navbar>
		<view class="bg">
			<image :src="staticurl('userbg.png')" mode=""></image>
		</view>
		<view class="userInfo">
			<view class="avatar" @click="gotoProfile">
				<image :src="staticurl('shuoming_icon.png')" mode=""></image>
			</view>
			<view class="right">
				<view class="nickname" @click="gotoProfile">{{ vuex_user.nickname || '点击登录' }}</view>
				<view class="vipstatus" v-if="vuex_token && vuex_vipinfo" @click="handleClickBuyVip">{{ 'VIP有效期至' || 'VIP截止'}}：{{ checkVipExpiry() || '已过期'}}</view>
			</view>
		</view>
		<view class="contentcard">
			<view class="topcard" v-if="vuex_config.isVipCenter == 1" @click="handleClickBuyVip">
				<view class="left">
					<view class="text1">
						<view class="">VIP套餐</view>
						<view class="icon">
							<image :src="staticurl('vip_icon.png')" mode=""></image>
						</view>
					</view>
					<view class="text2">
						{{ vuex_config.vipPrompt || '购买VIP享更多体验服务' }}
					</view>
				</view>
				<view class="right">
					{{ vuex_config.vipButtonTxt || '开通'}}
				</view>
			</view>
			<view class="listitem" v-if="vuex_config.isOrderMenu == 1" @click="goPage('/pages/order/list'),true">
				<view class="icon">
					<image :src="staticurl('orderinquiry_icon.png')" mode=""></image>
				</view>
				<view class="text">
					商品订单
				</view>
				<view class="rightIcon">
					<image :src="staticurl('shuoming_btn_arrow.png')" mode=""></image>
				</view>
			</view>
			<view class="listitem" v-if="vuex_config.isVipOrderMenu == 1" @click="handleClickVipOrder">
				<view class="icon">
					<image :src="staticurl('orderinquiry_icon.png')" mode=""></image>
				</view>
				<view class="text">
					{{ vuex_config.vipPromptMenuTxt || 'VIP订单'}} 
				</view>
				<view class="rightIcon">
					<image :src="staticurl('shuoming_btn_arrow.png')" mode=""></image>
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
		
		<!-- 小程序在线客服 -->
		<button class="wechatKfLink" open-type="contact"></button>
		<fa-tabbar></fa-tabbar>
		<!-- <faTabbarVue :active="'my'"></faTabbarVue> -->
	</view>
</template>

<script>
	import { avatar } from '@/common/fa.mixin.js';
	// import faTabbarVue from '@/components/fa-tabbar/index.vue'

	export default {
		mixins: [avatar],
		// components: {
		// 	faTabbarVue
		// },
		data() {
			return {
				list: [
					// {
					// 	img: this.staticurl('orderinquiry_icon.png'),
					// 	label: '我的订单',
					// 	id: 1
					// },
					{
						img: this.staticurl('userlist_icon.png'),
						label: '体验者资料',
						id: 0
					},
					{
						img: this.staticurl('mypoints_icon.png'),
						label: '我的积分',
						id: 5
					},
					// #ifdef MP-WEIXIN || H5
					{
						img: this.staticurl('inviteshare_icon.png'),
						label: '邀请分享',
						id: 3
					},
					// #endif
					{
						img: this.staticurl('pointsmall_icon.png'),
						label: '积分商城',
						id: 4
					},
					{
						img: this.staticurl('address_icon.png'),
						label: '收货地址',
						id: 6
					},
					{
						img: this.staticurl('onlineservice _icon.png'),
						label: '在线客服',
						id: 2
					},
					{
						img: this.staticurl('privacypolicy_icon.png'),
						label: '隐私条例政策',
						id: 7
					},
					// {
					// 	img: this.staticurl('setup_icon.png'),
					// 	label: '清除本机缓存',
					// 	id: 8
					// }
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
					case 0:
						if(!this.vuex_token) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
							return
						}
						uni.navigateTo({
							url: '/pages/experiencer/list'
						})
						break
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
						if(!this.vuex_token) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
							return
						}
						uni.navigateTo({
							url: '/pages/my/invitation'
						})
						break;
					case 4: 
						uni.navigateTo({
							url: '/pages/score/exchange'
						})
						break;
					case 5:
						if(!this.vuex_token) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
							return
						}
						uni.navigateTo({
							url: '/pages/score/score'
						})
						break;
					case 6:
						if(!this.vuex_token) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
							return
						}
						uni.navigateTo({
							url: '/pages/address/address'
						})
						break;
					case 7:
						uni.navigateTo({
							url: '/pages/page/page?diyname=privacypolicy'
						})
						break;
					case 8:
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
			handleClickVipOrder() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/vip/orderlist'
				})
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
		},
		//下拉刷新
		onPullDownRefresh() {
			if (this.vuex_token) {
				this.getUserIndex();
			} else {
				uni.stopPullDownRefresh();
				this.$u.toast('请先登录');
				this.$u.vuex('vuex_user', {});
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
				width: 150rpx;
				height: 150rpx;
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
				margin-left: 20rpx;

				.nickname {
					color: rgb(0, 0, 0);
					font-size: 48rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
					margin-bottom: 22rpx;
				}

				.vipstatus {
					color: rgb(0, 0, 0);
					font-size: 30rpx;
					font-weight: 500;
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
		top: 10rpx;
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
		padding: 30rpx 36rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #e5e5e5;
		position: relative;
		.contactButton,.shareButton {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: transparent;
			border:none;
			&:after{
				display: none;
			}
		}
		&:last-child {
			border-bottom: none;
		}
		.icon {
			width: 54rpx;
			height: 54rpx;
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
			font-size: 38rpx;
			font-weight: 500;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;
		}
		
		.rightIcon {
			flex-shrink: 0;
			width: 20rpx;
			height: 40rpx;
			opacity: .6;
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
	
	
	.wechatKfLink{
		  border:none;
		  outline:none;
		  box-shadow:none;
		  position: fixed;
		  bottom:15vh;
		  right:30rpx;
		  width:110rpx;
		  height:110rpx;
		  background: url(https://yanliangliang.com/static/images/wechatkf_icon_s2.svg) center center no-repeat;
		  background-size: cover;
		  z-index:5000;
		  &:after{
			  display:none;
		  }
	}
</style>