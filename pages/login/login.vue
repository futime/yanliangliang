<template>
	<view class="page">
		
		<view class="bg" v-if="vuex_config.loginPageBg.length > 56">
			<image :src="vuex_config.loginPageBg" mode=""></image>
		</view>
		<view class="bg" v-else>
			<image :src="staticurl('loginbg.jpeg')" mode=""></image>
		</view>
		
		<fa-navbar title=" " :background="{ color: 'transparent' }" :borderBottom="false"></fa-navbar>
		<!-- 顶部导航 -->
			<view class="logo" v-if="vuex_config.loginLogo.length > 56">
				<image class="" :src="vuex_config.loginLogo" mode=""></image>
			</view>
			<view class="logo" v-else>
				<image class="" :src="staticurl('logo_yanliangliang.png')" mode=""></image>
			</view>
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
			margin-top: 173rpx;
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