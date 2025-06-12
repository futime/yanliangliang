<template>
	<view class="page">
		
		<fa-navbar title=" " :background="{ background: scrollTop > 800 ? '#fff' : 'transparent' }" :borderBottom="false"
		:autoBack="true" title-color="#fff" :is-back="true"></fa-navbar>
		
		
		<view class="bg" v-if="vuex_config.loginPageBg.length > 56">
			<image :src="staticurl('/common/spacebg.jpg')" mode=""></image>
		</view>
		<view class="bg" v-else>
			<image :src="staticurl('/common/spacebg.jpg')" mode=""></image>
		</view>
		
		
		<view class="wrapTitleBox">
			<view class="pageTitle">
				<u-parse html="欢迎进入疼点典"></u-parse>
			</view>
			<view class="pageSubTitle">
				<u-parse html="感受自然能量 每日放松冥想<br>专注呼吸感知身心元炁，补炁养神<br>舒缓身体疼痛 重塑健康体态"></u-parse>
			</view>
		</view>
		
		<!-- 顶部导航 -->
			<!-- <view class="logo" v-if="vuex_config.loginLogo.length > 56">
				<image class="" :src="vuex_config.loginLogo" mode=""></image>
			</view> -->
			<!-- <view class="logo" v-else>
				<image class="" :src="staticurl('logo_yanliangliang.png')" mode=""></image>
			</view> -->
			<view class="loginBtn">
				<!-- #ifdef MP-WEIXIN -->
				<view class="u-text-center" style="width: 100%; height: 100%;" v-if="checkLogintype('wechatmobile')">
					<u-button hover-class="none" open-type="getPhoneNumber" text="立即登录" type="primary" :custom-style="{ backgroundColor: 'rgb(243, 148, 30)', width: '100%', height: '100%', color: '#fff'}" shape="circle" @getphonenumber="getPhoneNumber">
						手机号授权登录
					</u-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<view v-if="checkLogintype('mobile') || checkLogintype('wechatmobile')">
					<u-button hover-class="none" open-type="getPhoneNumber" text="立即登录" type="primary" 
					:custom-style="{ backgroundColor: 'rgb(243, 148, 30)', width: '100%', height: '100%', color: '#fff'}" shape="circle" 
					@click="goPage('/pages/login/mobilelogin')">
						手机号验证登录
					</u-button>
				</view>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import { loginfunc } from '@/common/fa.mixin.js';
	export default {
		mixins: [loginfunc],
		onLoad(opt) {
			// #ifdef MP-WEIXIN || APP-PLUS
			this.isThreeLogin = true;
			// #endif

			// #ifdef H5
			if (this.$util.isWeiXinBrowser()) {
				this.isThreeLogin = true;
			}
			// #endif
			if(opt.redirect){
				this.$u.vuex('vuex_lasturl', opt.redirect);
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
		},
		data() {
			return {
				labelPosition: 'top',
				border: false,
				errorType: ['message'],
				isThreeLogin: false,
				redirectUrl: ''
			};
		},
		methods: {
			goThreeLogin: async function() {
				// #ifdef MP-WEIXIN
				this.goMpLogin();
				// #endif

				// #ifdef H5
				this.goAuth();
				// #endif

				// #ifdef APP-PLUS
				this.goAppLogin();
				// #endif
			},
			goLogin: function() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						if (this.vuex_wx_uid) {
							this.form.wx_user_id = this.vuex_wx_uid;
						}
						let res = await this.$api.goLogin(this.form);
						if (!res.code) {
							this.$u.toast(res.msg);
							return;
						}
						this.$u.vuex('vuex_token', res.data.token);
						this.success();
					} else {
						this.$u.toast('验证失败');
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: transparent;
	}
	
	
	/deep/ .u-back-wrap{
		.u-icon-wrap{
			width:60rpx;
			height:60rpx;
			background: rgba(0,0,0,.3);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			.u-icon__icon,.u-iconfont{
				font-size:18px!important;
			}
		}
	}
	
	.page {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.logo {
			width: 518rpx;
			height: 653rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.loginBtn {
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
			position: relative;
			bottom:0rpx;
		}
		
		.bg {
			position: absolute;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			image {
				width: 100%;
				height: 100%;
			}
			
		}
	}
	
	.wrapTitleBox{
		padding:240rpx 80rpx 160rpx 80rpx;
	}
	
	.pageTitle {
		color: rgb(255, 255, 255);
		font-family: 思源黑体 CN;
		font-size: 64rpx;
		font-weight: 500;
		line-height: 80rpx;
		letter-spacing: 2rpx;
		position: relative;
		margin-bottom:140rpx;
	}
	
	.pageSubTitle{
		color:#fff;
		font-size: 32rpx;
		line-height: 56rpx;
		font-weight: 500;
		letter-spacing: 1px;
	}
	
	
	
	.login {
		padding: 80rpx 100rpx 0 100rpx;
	}

	.other {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 40rpx;
	}
</style>