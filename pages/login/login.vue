<template>
	<view class="page">
		
		<fa-navbar title=" " :background="{ background: scrollTop > 800 ? '#fff' : 'transparent' }" :borderBottom="false"
		:autoBack="true" title-color="#fff" :is-back="true"></fa-navbar>
		
		
		<view class="bg" v-if="vuex_config.loginPageBg.length > 56">
			<image :src="staticurl('common/spacebg.jpg')" mode=""></image>
		</view>
		
		<view class="bg" v-else>
			<image :src="staticurl('common/spacebg.jpg')" mode=""></image>
		</view>
		
		
		<view class="content-wrapper">
			<view class="wrapTitleBox">
				<view class="pageTitle">
					{{ vuex_config.loginPageTitle || '欢迎登录疼点典'}}
				</view>
				<view class="pageSubTitle">
					<u-parse :html="vuex_config.loginPageSubTitle || '感受自然能量 每日放松冥想<br>专注呼吸感知身心元炁，补炁养神'"></u-parse>
				</view>
			</view>
		</view>
			
		<view class="btnGroup">
			<view class="loginBtn">
				<!-- #ifdef MP-WEIXIN -->
				<view class="u-text-center" style="width: 100%; height: 100%;" v-if="checkLogintype('wechatmobile')">
					<u-button hover-class="none" open-type="getPhoneNumber" text="立即登录" type="primary" :custom-style="{ backgroundColor: '#12A89D', width: '100%', height: '100%', color: '#fff'}" shape="circle" @getphonenumber="getPhoneNumber">
						手机号授权登录
					</u-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 || APP-PLUS -->
				<view v-if="checkLogintype('mobile') || checkLogintype('wechatmobile')">
					<u-button hover-class="none" open-type="getPhoneNumber" text="立即登录" type="primary" 
					:custom-style="{ backgroundColor: '#12A89D', width: '100%', height: '100%', color: '#fff'}" shape="circle" 
					@click="goPage('/pages/login/mobilelogin')">
						手机号验证登录
					</u-button>
				</view>
				<!-- #endif -->
			</view>
			<!-- #ifdef H5 || APP-PLUS -->
			<view class="userLoginBtn">
				<view v-if="checkLogintype('account')">
					<u-button type="primary" hover-class="none" :custom-style="{ background: 'none', width: '100%', height: '100%', color: '#fff'}" shape="circle" 
					 @click="goPage('/pages/login/userlogin')">
						使用账号密码登录
					</u-button>
				</view>
			</view>
			<view class="u-flex u-row-between u-tips-color u-m-t-40 u-p-20 u-font-xl" v-if="checkLogintype('account')">
				<view @click="goPage('/pages/login/register')">注册新账号</view>
			</view>
			<!-- #endif -->
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
				scrollTop: 0,
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
	
	
	/deep/ u-parse{
		overflow: hidden!important;
	}
	
	
	.page {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
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
	
	.content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 60rpx;
		padding-top: 120rpx;
		padding-bottom: 200rpx;
	}

	.wrapTitleBox{
		text-align: center;
		padding: 40rpx 0;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 32rpx;
		backdrop-filter: blur(20rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 600rpx;
	}
	
	.pageTitle {
		color: rgb(255, 255, 255);
		font-size: 48rpx;
		font-weight: 600;
		line-height: 64rpx;
		letter-spacing: 2rpx;
		position: relative;
		margin-bottom: 32rpx;
		text-align: center;
		overflow: hidden;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
		padding: 0 40rpx;
	}
	
	.pageSubTitle{
		color: rgba(255, 255, 255, 0.9);
		font-size: 28rpx;
		line-height: 44rpx;
		font-weight: 400;
		letter-spacing: 1rpx;
		text-align: center;
		overflow: hidden;
		padding: 0 40rpx;
		text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);
	}
	
	.btnGroup {
	    width: 100%;
	    position: fixed;
	    bottom: 8vh;
	    left: 0;
	    right: 0;
	    display: flex;
	    justify-content: center;
	    flex-direction: column;
	    align-items: center;
		padding: 0 60rpx;
		z-index: 10;
	}
	
	.loginBtn {
		width: 70%;
		margin-top: 0rpx;
		color:#fff;
		font-size:42rpx;
		display: flex;
		justify-content: center;
		background: #12A89D;
		padding:16rpx 30rpx;
		border-radius: 60rpx;
	}
	
	.userLoginBtn{
		width: 70%;
		margin-top: 40rpx;
		color:#fff;
		font-size:36rpx;
		display: flex;
		justify-content: center;
		background: none;
		border:1px solid #fff;
		padding:12rpx 30rpx;
		border-radius: 60rpx;
	}
	
	/deep/ .u-size-default{
		font-size: 18px;
	}
	
	
</style>