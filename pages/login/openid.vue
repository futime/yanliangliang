<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="授权登录"></fa-navbar>
		<u-modal v-model="show" title="" :content="content" confirm-text="返回" @confirm="confirm">
			<view class="slot-content u-text-center u-m-b-30">
				<u-loading mode="flower" size="100"></u-loading>
				<view class="u-p-20">{{ content }}</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { loginfunc } from '@/common/fa.mixin.js';
	export default {
		mixins: [loginfunc],
		onLoad() {
			this.state = this.$util.getQueryString('state');
			this.code = this.$util.getQueryString('code');
			if (this.state && this.code) {
				this.goWxAuth();
			} else {
				this.content = '授权登录失败！';
			}
			
			this.si = setTimeout(() => {
				this.show = true;
			}, 1000);
		},
		data() {
			return {
				state: '',
				code: '',
				show: false,
				show: false,
				content: '授权登录中...'
			};
		},
		methods: {
			goWxAuth: async function() {
				let data = {
					code: this.code,
					state: this.state,
					platform: 'wechat',
					base: 1 //仅返回用户信息，不绑定账号
				};
				let res = await this.$api.goAuthCallback(data);
				if (!res) {
					this.content = '授权登录失败！';
					return;
				}
				clearTimeout(this.si);
				
				this.$u.vuex('vuex_openid', res.data.openid);
				let url = this.vuex_lasturl || '/pages/index/index';
				
				//清空最后页面
				this.$u.vuex('vuex_lasturl', '');
				uni.reLaunch({
					url: url + (url.indexOf("?") > -1 ? "&" : "?") + "from=openid"
				});
				// this.success();
			},
			confirm() {
				window.history.go(-2);
			}
		}
	};
</script>

<style></style>