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
					:custom-style="{ backgroundColor: '#12A89D', width: '100%', height: '100%', color: '#fff'}" 
					@click="goPage('/pages/login/mobilelogin')">
						手机号验证登录
					</u-button>
				</view>
				<!-- #endif -->
			</view>
			<!-- #ifdef H5 -->
			<view class="userLoginBtn">
				<view v-if="checkLogintype('account')">
					<u-button type="primary" hover-class="none" :custom-style="{ background: 'none', width: '100%', height: '100%', color: '#fff'}" 
					 @click="goPage('/pages/login/userlogin')">
						使用账号密码登录
					</u-button>
				</view>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<view class="userLoginBtn">
				<view v-if="isThreeLogin && checkLogintype('wechat')">
					<u-button type="primary" hover-class="none" :custom-style="{ background: 'none', width: '100%', height: '100%', color: '#fff'}" 
					 @click="goThreeLogin">
						<image :src="staticurl('common/wechatlogin.svg')" mode="" class="wechatIcon"></image>
						<text>微信登录</text>
					</u-button>
				</view>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<view class="u-p-t-30 u-text-center tiplabel u-flex">
				<u-checkbox :active-color="theme.bgColor" v-model="agreeChecked" name="agree"><text
						class="u-font-28 tiplabel">我已阅读并同意</text></u-checkbox>
				<text class="u-font-28 agree" @click="goPage('/pages/page/page?diyname=agreement')"
					:style="[{ color: theme.bgColor }]">《用户协议》</text>
				和<text class="u-font-28 privacypolicy" @click="goPage('/pages/page/page?diyname=privacypolicy')"
					:style="[{ color: theme.bgColor }]">《隐私政策》</text>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<view class="u-flex u-row-between u-tips-color u-m-t-60 u-p-20 u-font-lg w-80" v-if="checkLogintype('account')">
				<view @click="goPage('/pages/login/userlogin')" class="tiplabel">账号密码登录</view>
				<view @click="goPage('/pages/login/register')" class="tiplabel">注册新账号</view>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef H5 -->
			<view class="u-flex u-row-between u-tips-color u-m-t-60 u-p-20 u-font-lg" v-if="checkLogintype('account')">
				<view @click="goPage('/pages/login/register')" class="tiplabel">还没有账号，立即注册</view>
			</view>
			<!-- #endif -->
			
			<u-toast ref="uToast" />
			<AgreementModal ref="AgreementModal" @confirm="onAgreementConfirm"></AgreementModal>
			
		</view>
		
	</view>
</template>

<script>
	import { loginfunc } from '@/common/fa.mixin.js';
	import AgreementModal from '@/components/AgreementModal.vue'
	export default {
		mixins: [loginfunc],
		components: {
			AgreementModal
		},
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
				agreeChecked: false,
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
				if (!this.agreeChecked) {
					if (!this.confirm) {
						this.$refs.AgreementModal.open()
					} else {
						this.$u.toast('请勾选同意并阅读用户协议及隐私政策');
					}
					return
				}
				this.goAppLogin();
				// #endif
			},
			// 用户同意协议后的处理
			onAgreementConfirm() {
				this.confirm = true
				this.agreeChecked = true
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
		// flex: 1;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// padding: 0 60rpx;
		// padding-top: 120rpx;
		// padding-bottom: 200rpx;
	}

	.wrapTitleBox{
		padding:240rpx 80rpx 160rpx 80rpx;
	}
	
	.pageTitle {
		color: rgb(255, 255, 255);
		font-size: 64rpx;
		font-weight: 500;
		line-height: 80rpx;
		letter-spacing: 2rpx;
		position: relative;
		margin-bottom: 32rpx;
		text-align: center;
		overflow: hidden;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
	}
	
	.pageSubTitle{
		color:#fff;
		font-size: 36rpx;
		line-height: 64rpx;
		font-weight: 500;
		letter-spacing: 1px;
		text-align: center;
		overflow: hidden;
		text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.2);
	}
	
	.btnGroup {
	    width: 100%;
	    position: fixed;
	    bottom: 9vh;
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
		width: 80%;
		margin-top: 0rpx;
		color:#fff;
		font-size:42rpx;
		display: flex;
		justify-content: center;
		background: #12A89D;
		padding:16rpx 30rpx;
		border-radius:12rpx;
	}
	
	.userLoginBtn{
		width: 80%;
		margin-top: 40rpx;
		color:#fff;
		font-size:36rpx;
		display: flex;
		justify-content: center;
		background: none;
		border:1px solid #fff;
		padding:12rpx 30rpx;
		border-radius: 12rpx;
	}
	
	.w-80{
		width:80%;
		padding-left:0px!important;
		padding-right:0px!important;
	}
	
	.tiplabel{
		color:rgba(255,255,255,.5);
	}
	
	.titleLight{
		color:#fff;
	}
	
	.wechatIcon{
		width:48rpx;
		height:48rpx!important;
		margin-right:16rpx;
	}
	
	/deep/ .u-size-default{
		font-size: 18px;
	}
	
	/deep/ .u-checkbox__label {
		margin-right: 0px;
	}
	
	
	
</style>