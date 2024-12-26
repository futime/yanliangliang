<template>
	<view class="page">
		<fa-navbar :title="' '" :background="{ color: 'transparent' }" :borderBottom="false"
			:styleBack="true"></fa-navbar>
		<view class="bg">
			<!-- #ifdef APP -->
			<image :src="staticurl('startpage_bg.jpeg')" mode=""></image>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<video :src="videourl('startpage_bg.mp4')" :poster="staticurl('startpage_bg.jpeg')" autoplay
				:controls="false" loop muted=""></video>
			<!-- #endif -->
		</view>
		<view class="title">
			欢迎登录<br>
			新纪元能量空间系统<br>
			希望给你带来幸福健康！<br>
		</view>
		<view class="sanjiao">
			<image :src="staticurl('energy_triangle.png')" mode=""></image>
		</view>
		<view class="startbtn" @click="handleClickStart">
			<image :src="staticurl('startpage_btn.svg')" mode=""></image>
		</view>

		<u-popup v-model="show" mode="center" :custom-style="popupStyle" :border-radius="24">
			<view class="selectuser">
				<view class="selectuser-title">
					请选择体验者角色
				</view>
				<view class="tips">
					便于我们为您提供最佳服务
				</view>
				<view class="selectuserBox">
					<view class="selectuserBoxItem" :class="selectType == 1 ? 'active' : ''"
						@click="handleClickSelect(1)">
						<view class="icon">
							<image :src="staticurl('oneself_icon.png')" mode=""></image>
						</view>
						<view class="text">本人</view>
						<view class="check">
							<u-icon name="checkbox-mark" color="#fff"></u-icon>
						</view>
					</view>
					<view class="selectuserBoxItem" :class="selectType == 2 ? 'active' : ''"
						@click="handleClickSelect(2)">
						<view class="icon">
							<image :src="staticurl('others_icon.png')" mode=""></image>
						</view>
						<view class="text">亲友</view>
						<view class="check">
							<u-icon name="checkbox-mark" color="#fff"></u-icon>
						</view>
					</view>
				</view>
				<view class="nextBtn" @click="handleClickNext">
					下一步
				</view>
				<view class="cancel" @click="show = !show">稍后体验</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				popupStyle: {
					backgroundColor: 'transparent',
					borderRadius: '24rpx'
				},
				selectType: 1
			}
		},
		onShow() {
			if (this.vuex_token) {
				this.getUserIndex();
			}
		},
		methods: {
			getUserIndex: async function() {
				let res = await this.$api.getUserIndex();
				uni.stopPullDownRefresh();
				if (res.code == 1) {
					const res2 = await this.$api.getVipInfo()
					this.$u.vuex('vuex_vipinfo', res2.data.vipInfo);
					this.$u.vuex('vuex_user', res.data.userInfo || {});
					if (res.data.showProfilePrompt && !this.vuex_setting.prompted) {
						// 弹窗每次登录状态只提示一次
						this.$u.vuex('vuex_setting.prompted', true);
					// 	uni.showModal({
					// 		title: '温馨提示',
					// 		confirmText: '去设置',
					// 		cancelText: '取消',
					// 		showCancel: true,
					// 		content: '当前未设置昵称，请设置昵称后再继续操作',
					// 		success: (res) => {
					
					// 			if (res.confirm) {
					// 				this.$u.route("/pages/my/profile");
					// 			} else if (res.cancel) {
					
					// 			}
					// 		}
					// 	});
					}
				} else {
					this.$u.toast(res.msg);
					return;
				}
			},
			handleClickNext() {
				if (this.selectType == 1) {
					// #ifdef MP-WEIXIN
					if (!this.vuex_user.face_image) {
						uni.navigateTo({
							url: '/pages/space/face'
						})
						return
					}
					uni.redirectTo({
						url: '/pages/space/index'
					})
					this.show = false;
					// #endif
					// #ifdef APP
					if (!this.vuex_user.face_image) {
						uni.navigateTo({
							url: '/pages/my/profile-add'
						})
						return
					}
					uni.redirectTo({
						url: '/pages/space/index'
					})
					this.show = false;
					// #endif
				} else {
					uni.$once('SELECT_USER', (e) => {
						this.selectUserSuccess(e.id);
					});
					uni.navigateTo({
						url: '/pages/experiencer/list'
					})
				}
			},
			selectUserSuccess(id) {
				uni.redirectTo({
					url: '/pages/space/index?userid=' + id
				})
				this.show = false
			},
			handleClickSelect(type) {
				this.selectType = type
			},
			handleClickStart() {
				this.show = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.selectuser {
		width: 600rpx;
		// height: 961rpx;
		border-radius: 24rpx;
		background: linear-gradient(180.00deg, rgba(243, 148, 30, 0.16) 0%, rgba(255, 255, 255, 0) 21.904%), rgb(255, 255, 255);
		padding: 60rpx 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.selectuser-title {
			color: rgb(0, 0, 0);
			font-family: 思源黑体;
			font-size: 42rpx;
			font-weight: 400;
			line-height: 61rpx;
			letter-spacing: 0px;
			margin-bottom: 8rpx;
		}

		.tips {
			color: rgb(146, 146, 146);
			font-family: 思源黑体;
			font-size: 32rpx;
			font-weight: 400;
			line-height: 46rpx;
			letter-spacing: 0px;
		}

		.nextBtn {
			width: 100%;
			height: 100rpx;
			border-radius: 300px;
			background: rgb(243, 148, 30);
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 64rpx;
			color: #fff;
			font-size: 38rpx;
		}

		.cancel {
			color: rgb(153, 153, 153);
			font-family: Dream Han Sans CN;
			font-size: 34rpx;
			font-weight: 400;
			line-height: 39.58rpx;
			letter-spacing: 0px;
			margin-top: 23rpx;
		}

		.selectuserBox {
			margin-top: 77rpx;
			display: flex;

			.selectuserBoxItem {
				width: 251rpx;
				height: 358rpx;
				box-sizing: border-box;
				border: 2px solid rgb(221, 221, 221);
				border-radius: 9.61px;
				margin-right: 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				position: relative;

				&.active {
					border: 3rpx solid rgb(255, 141, 0);

					.text {
						color: rgb(255, 141, 0);

					}

					.check {
						display: flex;
					}
				}

				.check {
					width: 50rpx;
					height: 50rpx;
					border-radius: 8rpx;
					background-color: rgb(255, 141, 0);
					position: absolute;
					border-top-left-radius: 0;
					border-bottom-right-radius: 0;
					top: 0;
					right: 0;
					display: none;
					justify-content: center;
					align-items: center;
				}

				.icon {
					width: 163rpx;
					height: 163rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					color: rgb(153, 153, 153);
					font-family: Dream Han Sans CN;
					font-size: 38rpx;
					font-weight: 400;
					line-height: 39.58rpx;
					letter-spacing: 0px;
					margin-top: 40rpx;
				}

				&:last-child {
					margin-right: 0;
				}
			}
		}
	}

	.page {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.startbtn {
			width: 480rpx;
			height: 113rpx;
			margin-top: 100rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.sanjiao {
			width: 500rpx;
			height: 422rpx;
			margin-top: 80rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			color: rgb(255, 255, 255);
			font-family: 思源黑体 CN;
			font-size: 48rpx;
			font-weight: 400;
			line-height: 80rpx;
			letter-spacing: 4rpx;
			text-align: center;
			top: -120rpx;
			position: relative;
		}

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}

			video {
				height: 100%;
				width: 100%;
			}
		}
	}
</style>