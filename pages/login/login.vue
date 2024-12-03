<template>
	<view class="page">
		<view class="bg">
			<image :src="staticurl('loginbg.jpeg')" mode=""></image>
		</view>
		<fa-navbar title=" " :background="{ color: 'transparent' }" :borderBottom="false"></fa-navbar>
		<!-- 顶部导航 -->
			<!-- <view class="u-text-center other" v-if="isThreeLogin && checkLogintype('wechat')">
				<u-grid :col="1" :border="false">
					<u-grid-item @click="goThreeLogin">
						<u-icon name="weixin-fill" color="#53c240" :size="50"></u-icon>
						<view class="grid-text">微信登录</view>
					</u-grid-item>
				</u-grid> 
			</view> -->
			<view class="logo">
				<image class="" :src="staticurl('logo_yanliangliang.png')" mode=""></image>
			</view>
			<view class="loginBtn">
				<!-- #ifdef MP-WEIXIN -->
				<view class="u-text-center" style="width: 100%; height: 100%;" v-if="checkLogintype('wechatmobile')">
					<u-button hover-class="none" open-type="getPhoneNumber" text="立即登录" type="primary" :custom-style="{ backgroundColor: 'rgb(243, 148, 30)', width: '100%', height: '100%', color: '#fff'}" shape="circle" @getphonenumber="getPhoneNumber">
						立即登录
					</u-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
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
		onLoad() {
			// #ifdef MP-WEIXIN || APP-PLUS
			this.isThreeLogin = true;
			// #endif

			// #ifdef H5
			if (this.$util.isWeiXinBrowser()) {
				this.isThreeLogin = true;
			}
			// #endif
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
		},
		data() {
			return {
				labelPosition: 'top',
				border: false,
				errorType: ['message'],
				isThreeLogin: false
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