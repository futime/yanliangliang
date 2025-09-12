<template>
	<view class="page">
		<fa-navbar title=" " :background="{ background: scrollTop > 40 ? 'transparent' : 'transparent' }" :borderBottom="false"></fa-navbar>
		
		<view class="userInfo">
			<view class="leftWrap">
				<view class="nickname" @click="gotoProfile">{{ vuex_user.nickname || '点击登录' }}</view>
				
				<view v-if="vuex_config.isMyProfileTipsTxt== 1">
					<view class="vipstatus" v-if="vuex_token && vuex_vipinfo" @click="handleClickBuyVip">
						{{ 'VIP有效期至' || 'VIP截止'}}:{{ checkVipExpiry() || '已过期'}}
					</view>
				</view>
				<view v-else>
					<view class="vipstatus" @click="gotoProfile">
						{{ vuex_config.MyProfileNoVipTips || '每日放松冥想' }}
					</view>
				</view>
				
			</view>
			<view class="avatar" @click="gotoProfile">
				<image :src="staticurl('shuoming_icon.png')" mode=""></image>
			</view>
		</view>
		
		<view class="contentcard">
			<view class="topcard" v-if="vuex_config.isVipCenter == 1">
				<view class="leftBox">
					<view class="titile">
						<view class="">{{ vuex_config.vipPromptTitle || ''}}</view>
					</view>
					<view class="tips">
						<view v-if="!vuex_token">{{ vuex_config.vipPromptSubtitle || ''}}</view>
						<view v-else>
							<text v-if="vuex_token && vuex_vipinfo">{{ vuex_config.vipPromptSubtitleLogin || ''}}</text>
							<text v-else>{{ vuex_config.vipPromptSubtitle || ''}}</text>
						</view>
						
					</view>
				</view>
				<view class="rightBox" @click="handleClickBuyVip">
					<text v-if="vuex_token && vuex_vipinfo">{{ vuex_config.vipButtonVipTxt || ''}}</text>
					<text v-else>{{ vuex_config.vipButtonTxt || ''}}</text>
				</view>
			</view>
			
			
			<view class="memberRowWrap">
				<u-row gutter="16" v-if="vuex_config.isMyScoreShow == 1">
					<u-col span="6">
						<view class="cardInner" @click="handleClickMyCollects">
							<u-icon :name="staticurl('common/mycollects_icon.svg')" size="48"></u-icon>
							<view class="txt">我的收藏</view>
						</view>
					</u-col>
					<u-col span="6">
						<view class="cardInner" @click="handleClickMyScroe">
							<u-icon :name="staticurl('common/myscore_icon.svg')" size="48"></u-icon>
							<view class="txt">{{ vuex_config.myScoreMenuTitle || ''}}</view>
						</view>
					</u-col>
				</u-row>
				<u-row gutter="16" v-else>
					<u-col span="12">
						<view class="cardInner" @click="handleClickMyCollects">
							<u-icon :name="staticurl('common/mycollects_icon.svg')" size="48"></u-icon>
							<view class="txt">我的收藏</view>
						</view>
					</u-col>
				</u-row>
			</view>
			
			<!-- #ifdef MP-WEIXIN -->	
			<view class="memberMenu" v-if="vuex_config.isVipExperiencers == 1">
				<u-cell-group :border="false">
					<u-cell-item :icon="staticurl('common/myexperiencers_icon.svg')" icon-size="48" title="体验者管理" :border-bottom="false" @click="goPage('/pages/experiencer/list'),true"></u-cell-item>
				</u-cell-group>
			</view>
			<!-- #endif -->
			
			<view class="memberMenu">
					<u-cell-group :border="false">
					<u-cell-item :icon="staticurl('common/myordershop_icon.svg')" icon-size="48" title="我的商品订单" :border-bottom="false" v-if="vuex_config.isOrderMenu == 1" @click="handleClickOrder"></u-cell-item>
					<u-cell-item :icon="staticurl('common/myorder_icon.svg')" icon-size="48" :title="vuex_config.vipPromptMenuTxt || 'VIP订单记录'" :border-bottom="false" v-if="vuex_config.isVipOrderMenu == 1" @click="handleClickVipOrder"></u-cell-item>
				
					<u-cell-item :icon="staticurl('common/pointsmall_icon.svg')" icon-size="48" title="积分商城" :border-bottom="false" v-if="vuex_config.isVipExchangeMenu == 1" @click="handleClickExchange"></u-cell-item>
				
					<u-cell-item :icon="staticurl('common/faq_icon.svg')" icon-size="48" title="常见问题" :border-bottom="false" v-if="vuex_config.isMyFaqMenu == 1" @click="handleClickFaq"></u-cell-item>
					<u-cell-item :icon="item.img" icon-size="48" :title="item.label" :border-bottom="false" v-for="item in list" :key="item.id"  @click="handleClickItem(item)"></u-cell-item>
					<u-cell-item :icon="staticurl('common/setup_icon.svg')" icon-size="48" title="设置" :border-bottom="false"  @click="goPage('/pages/setting/setting')"></u-cell-item>
					<u-cell-item :icon="staticurl('common/loginout_icon.svg')" icon-size="48" title="退出登录" :border-bottom="false" v-if="vuex_token" @click="goPage('out')"></u-cell-item>
				</u-cell-group>
			</view>
			
		</view>
		
		<!-- 小程序在线客服 -->
		<!-- #ifdef MP-WEIXIN -->
		<button class="wechatKfLink" open-type="contact"></button>
		<!-- #endif -->
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
					// #ifdef MP-WEIXIN 
					{
						img: this.staticurl('common/myinvite_icon.svg'),
						label: '我的邀请',
						id: 0
					},
					{
						img: this.staticurl('common/address_icon.svg'),
						label: '收货地址',
						id: 1
					},
					// #endif
					{
						img: this.staticurl('common/document_icon.svg'),
						label: '隐私条款政策',
						id: 2
					},
					{
						img: this.staticurl('common/customerservice.svg'),
						label: '平台客服',
						id: 3
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
					case 0:
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
					
					case 1:
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
					case 2:
						uni.navigateTo({
							url: '/pages/page/page?diyname=privacypolicy'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/page/page?diyname=customerservice'
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
			handleClickFaq() {
				uni.navigateTo({
					url: '/pages/page/page?diyname=faq'
				})
			},
			handleClickMyCollects() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/my/collect-course'
				})
			},	
			handleClickExchange() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/score/exchange'
				})
			},
			handleClickMyScroe() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/score/score'
				})
			},
			handleClickOrder() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/order/list'
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
				console.log(this.vuexi_token)
				
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
			background: linear-gradient(180.00deg, rgb(199, 213, 241),rgb(219, 232, 235),rgb(245, 245, 245));
			z-index: -2;
		}

		.userInfo {
			padding: 50rpx 0 30rpx 0rpx;
			display: flex;
			justify-content: space-between;
			.avatar {
				width: 150rpx;
				height: 150rpx;
				border-radius: 100%;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				border-radius: 300rpx;

				image {
					width: 100%;
					height:100%;
				}
			}

			.leftWrap {
				height: 160rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-left: 20rpx;

				.nickname {
					color: rgb(0, 0, 0);
					font-size: 52rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 1px;
					text-align: left;
					margin-bottom: 16rpx;
				}

				.vipstatus {
					color: #787D7C;
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
		border-radius: 24rpx;
		position: relative;
		top: 10rpx;
		.topcard {
			padding:24rpx 38rpx;
			background: linear-gradient(90.00deg, rgb(39, 43, 51),rgb(57, 63, 69));
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			.leftBox {
				flex: 1;
				flex-direction: column;
				display: flex;
				justify-content: center;
				.titile {
					color: #E0E0E0;
					font-family: Dream Han Sans CN;
					font-size: 36rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
					margin-bottom: 2rpx;
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
				.tips {
					color: #797979;
					font-size: 28rpx;
					font-weight: 400;
					font-family: Dream Han Sans CN;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: left;
				}
			}
			.rightBox  {
				height: 76rpx;
				box-sizing: border-box;
				border-radius: 60px;
				padding:12rpx 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #E5B765;
				color: #1F190E;
				font-size:32rpx;
				font-family: Dream Han Sans CN;
				letter-spacing: 0px;
			}
		}
	}
	
	

	.memberRowWrap {
		border-radius: 8rpx;
		margin-top:30rpx;
		.cardInner{
			align-items: center;
			display: flex;
			border-radius: 30rpx;
			background: #fff;
			height:120rpx;
			gap:8px;
			padding:0rpx 30rpx;
			.txt{
				font-size:19px;
				color: #000000;
			}
		}
	}

	
	.memberMenu{
		margin-top:32rpx;
		/deep/ .u-cell-item-box{
		    padding:16rpx 0rpx;
			border-radius: 12px;
		}
		/deep/ .u-cell_title{
		    font-size: 19px;
		    margin-left: 8px;
			color: #000000;
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