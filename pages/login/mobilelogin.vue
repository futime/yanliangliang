<template>
	<view class="page">
		<!-- <view class="bg">
			<image :src="staticurl('/common/spacebg.jpg')" mode=""></image>
		</view> -->
		<!-- 顶部导航 -->
		<fa-navbar title="手机号验证登录"></fa-navbar>
		<view class="login">
			<view v-if="checkLogintype('mobile')">
				<view class="">
					<u-form :model="form" :rules="rules" ref="uForm" :errorType="errorType">
						<u-form-item :label-position="labelPosition" label="手机号码:" prop="mobile" label-width="120" :border-bottom="false">
							<u-input :border="true" placeholder="请输入手机号码" v-model="form.mobile" type="number"></u-input>
						</u-form-item>
						<u-form-item :label-position="labelPosition" label="验证码:" prop="captcha" label-width="120" :border-bottom="false">
							<u-input :border="true" placeholder="请输入验证码" v-model="form.captcha" type="text"></u-input>
							<u-button hover-class="none" type="primary" slot="right" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" size="mini" @click="getCode">
								{{ codeTips }}
							</u-button>
						</u-form-item>
					</u-form>
				</view>
				<view class="u-m-t-80 loginBtn">
					<u-button hover-class="none" type="primary" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" shape="circle" @click="goLogin">登录</u-button>
				</view>
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<!-- <view class="u-text-center u-m-t-40" v-if="checkLogintype('wechatmobile')">
				<u-button hover-class="none" open-type="getPhoneNumber" type="primary" :custom-style="{ backgroundColor: '#72C053', color: '#fff'}" shape="circle" @getphonenumber="getPhoneNumber">
					手机号快捷登录
				</u-button>
			</view> -->
			<!-- #endif -->

			<!-- <view class="u-text-center u-m-t-40" v-if="checkLogintype('account')">
				<u-button hover-class="none" type="warning" shape="circle" @click="goPage('/pages/login/login')">用户名登录</u-button>
			</view> -->
		
			<!-- <view class="u-text-center other" v-if="isThreeLogin && checkLogintype('wechat')">
				<u-grid :col="1" :border="false">
					<u-grid-item @click="goThreeLogin">
						<u-icon name="weixin-fill" color="#53c240" :size="50"></u-icon>
						<view class="grid-text">微信登录</view>
					</u-grid-item>
				</u-grid>
			</view> -->
		</view>
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<u-toast ref="uToast" />
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

			// 如果仅有账号登录一种方式则直接跳转至登录页
			if (this.checkLogintype('account') && this.vuex_config.logintypearr.length === 1) {
				this.$u.route({ url: '/pages/login/login', type: 'redirectTo' });
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			if(this.checkLogintype('mobile')){
				this.$refs.uForm.setRules(this.rules);
			}
		},
		data() {
			return {
				labelPosition: 'top',
				border: false,
				errorType: ['message'],
				form: {
					mobile: '',
					captcha: ''
				},
				rules: {
					mobile: [{
							required: true,
							message: '请输入手机号码',
							// 可以单个或者同时写两个触发验证方式
							trigger: ['change', 'blur']
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur']
						}
					],
					captcha: [{
						required: true,
						message: '请输入验证码',
						trigger: 'change'
					}]
				},
				isThreeLogin: false,
				codeTips: ''
			};
		},
		methods: {
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode: async function() {
				if (!this.$u.test.mobile(this.form.mobile)) {
					this.$u.toast('手机号码格式不正确！');
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					let res = await this.$api.getSmsSend({
						mobile: this.form.mobile,
						event: 'mobilelogin'
					});
					setTimeout(() => {
						this.$u.toast(res.msg);
					}, 50);
					if (res.code == 1) {
						this.$refs.uCode.start();
					}
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
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
						if (this.vuex_recdkey) {
							this.form.vuex_recdkey = this.vuex_recdkey;
						}
						let res = await this.$api.mobilelogin(this.form);
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
		align-items: center;
		
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
		padding: 360rpx 20rpx 0 20rpx;
	}

	.other {
		position: absolute;
		width: 100%;
		left: 0;
		bottom: 40rpx;
	}
	
	/deep/ .u-form-item--left {
		color: #999!important;
	}
	
	/deep/ .u-size-mini{
		height:38px;
	}
	
	/deep/ .u-input__input{
		padding-left: 6px;
	}
	
	.u-form{
		margin-top:-10vh;
	}
	.u-form-item--left__content__label{
	    font-size: 32rpx;
		font-weight: bold;
	}
	.u-input{
		background-color: #fff;
		border-radius: 6rpx;
	}
	.u-input__input{
		padding-left:16rpx;
		font-size:32rpx;
	}
	.u-btn--primary{
		font-size:26rpx!important;
		background: #F3941E!important;
	}
	.loginBtn .u-btn--primary{
		font-size:32rpx!important;
		background: #38A9AF!important;
	}
	.uni-input-input{
		padding-left:16rpx;
		font-size:36rpx;
		font-weight: bold;
	}
	.uni-input-placeholder{
		padding-left:0px;
	}
</style>