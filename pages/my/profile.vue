<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="个人资料"></fa-navbar>
		<!-- 内容 -->
		<view class="u-p-30">
			<u-form :model="form" ref="uForm">
				<u-form-item :label-position="labelPosition" label="头像:" prop="avatar" label-width="150">
					<!-- #ifdef MP-WEIXIN -->
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<image class="avatar" :src="url || userInfo.avatar"></image>
					</button>
					<!-- #endif -->

					<!-- #ifndef MP-WEIXIN -->
					<u-image width="70" height="70" :src="url || userInfo.avatar" @click="chooseAvatar"></u-image>
					<!-- #endif -->
				</u-form-item>
				<!-- <u-form-item label="用户名:" prop="nickname" label-width="150">
					<u-input v-model="form.nickname" />
				</u-form-item> -->
				<u-form-item label="姓名:" prop="nickname" label-width="150">
					<input type="nickname" v-model="form.nickname" @change="onInput" placeholder="请输入姓名" />
				</u-form-item>
				<!-- <u-form-item label="个人介绍:" prop="bio" label-width="150"><u-input v-model="form.bio" type="textarea" /></u-form-item> -->
			</u-form>
			<view class="u-p-30"><u-button type="primary" hover-class="none" :custom-style="{ backgroundColor: theme.bgColor, color: theme.color }" @click="submit">提交</u-button></view>
		</view>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
	import { avatar } from '@/common/fa.mixin.js';
	export default {
		mixins: [avatar],
		computed: {
			userInfo() {
				if (this.vuex_user.avatar && this.vuex_user.avatar.indexOf('data:image/svg+xml;base64') == -1) {
					this.form.avatar = this.vuex_user.avatar;
				}
				this.form.username = this.vuex_user.username || '';
				this.form.nickname = this.vuex_user.nickname == '' || this.vuex_user.nickname == '微信用户' ? '' : this.vuex_user.nickname;
				this.form.bio = this.vuex_user.bio;
				return this.vuex_user;
			}
		},
		onShow() {
			//移除事件监听
			uni.$off('uAvatarCropper', this.upload);
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		data() {
			return {
				labelPosition: 'left',
				url: '',
				form: {
					avatar: '',
					username: '',
					nickname: '',
					bio: ''
				},
				rules: {
					nickname: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							required: true,
							message: '请输入昵称',
							trigger: 'blur'
						}
					]
				}
			};
		},
		methods: {
			onChooseAvatar(e) {
				this.$api.goUpload({
					filePath: e.detail.avatarUrl,
					name: 'file',
				}).then(res => {
					this.url = res.data.fullurl;
					this.form.avatar = this.url;
				});
			},
			onInput(e) {
				this.form.nickname = e.detail.value;
			},
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						let res = await this.$api.getUserProfile(this.form);
						this.$u.toast(res.msg);
						if (res.code) {
							setTimeout(() => {
								this.$u.route("/pages/my/my");
							}, 800)
						}
					} else {
						console.log('验证失败');
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.avatar-wrapper {
		width: 100%;
		height: 70rpx;
		border-radius: 10rpx;
		padding: 0;
		margin-left: unset;
		text-align: left;
		background: none;
		border: none;

		&::after {
			border: none;
		}

		.avatar {
			width: 70rpx;
			height: 70rpx;
			border-radius: 10rpx;

			&::after {
				border: 1px solid #ccc;
			}
		}
	}
</style>