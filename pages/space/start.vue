<template>
	<view class="page">
	<!-- 	<fa-navbar :title="' '" :background="{ color: 'transparent' }" :borderBottom="false"
			:styleBack="true"></fa-navbar> -->
		<view class="bg" v-if="vuex_config.energySpaceBg.length > 56">
			<image :src="vuex_config.energySpaceBg" mode=""></image>
		</view> 
		<view class="bg" v-else>
			<image :src="staticurl('/common/spacebg.jpg')" mode=""></image>
		</view>
		
		
		<view class="wrapTitleBox">
			<view class="pageTitle">
				{{ vuex_config.energySpaceTitle || '欢迎进入能量空间'}}
			</view>
			<view class="pageSubTitle">
				<u-parse :html="vuex_config.energySpaceSubTitle || '感受自然能量 每日放松冥想<br>专注呼吸感知身心元炁，补炁养神<br>舒缓身体疼痛 重塑健康体态'"></u-parse>
			</view>
		</view>
		
		
		<view class="btnGroup">
			<view class="startbtn" @click="handleClickStart">
				<view class="btntxt">
					{{ vuex_config.energySpaceBtnTxt || '开始注入能量'}}
				</view>
			</view>
			
			<view class="tipsbtn" @click="goPage('/pages/page/page?diyname=aboutus')" v-if="vuex_config.isEnergySpaceShowTips == 1">
				使用说明
			</view>
		</view>

		<u-popup v-model="show" mode="center" :custom-style="popupStyle" :border-radius="24">
			<view class="selectuser">
				<view class="selectuser-title">
					{{ vuex_config.energySpaceSelectTitle || '请选择体验者角色'}}
				</view>
				<view class="poptips">
					{{ vuex_config.energySpaceSelectSubTitle || '便于我们为您提供最佳服务'}}
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
		
		<fa-tabbar :visible="true"></fa-tabbar>
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
				selectType: 1,
				videoContext: null
			}
		},
		onReady() {
			//#ifndef APP 
			this.videoContext = uni.createVideoContext('myVideo')
			//#endif
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
					uni.navigateTo({
						url: '/pages/space/index'
					})
					this.show = false;
					// #endif
					// #ifdef APP
					if (!this.vuex_user.face_image) {
						uni.navigateTo({
							url: '/pages/my/profile-add'
						})
						this.show = false;
						return
					}
					uni.navigateTo({
						url: '/pages/space/index'
					})
					this.show = false;
					// #endif
				} else {
					uni.$once('SELECT_USER', (e) => {
						this.selectUserSuccess(e.id);
					});
					uni.navigateTo({
						url: '/pages/experiencer/list',
						success() {
							this.show = false;
						}
					})
				}
				this.show = false;
			},
			selectUserSuccess(id) {
				uni.navigateTo({
					url: '/pages/space/index?userid=' + id,
					success() {
						this.show = false
					}
				})
			},
			handleClickSelect(type) {
				this.selectType = type
			},
			handleClickStart() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				this.show = true
			},
			handleVideoEnd() {
				this.videoContext.play()
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	/deep/ u-parse{
		overflow: hidden!important;
	}
	
	.selectuser {
		width: 600rpx;
		// height: 961rpx;
		border-radius: 24rpx;
		background: linear-gradient(180.00deg, rgba(18, 168, 157, 0.16) 0%, rgba(255, 255, 255, 0) 21.904%), rgb(255, 255, 255);
		padding: 60rpx 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

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
		
		
		.poptips {
			color: rgb(146, 146, 146);
			font-size: 32rpx;
			font-weight: 400;
			line-height: 46rpx;
			letter-spacing: 0px;
		}
		
		
		.selectuser-title {
			color: rgb(0, 0, 0);
			font-family: 思源黑体;
			font-size: 42rpx;
			font-weight: 400;
			line-height: 61rpx;
			letter-spacing: 0px;
			margin-bottom: 8rpx;
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
		
		
		.btnGroup{
			width: 100%;
			position: absolute;
			bottom:20vh;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
		}
		

		.startbtn {
			width: 70%;
			margin-top: 100rpx;
			.btntxt{
				color:#fff;
				font-size:42rpx;
				display: flex;
				justify-content: center;
				background: #12A89D;
				padding:32rpx 40rpx;
				border-radius: 60rpx;
			}
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		
		.tipsbtn{
			color:rgba(255, 255, 255,0.7);
			margin-top:60rpx;
			font-size:36rpx;
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
			margin-bottom:140rpx;
			overflow: hidden;
		}
		
		.pageSubTitle{
			color:#fff;
			font-size: 36rpx;
			line-height: 64rpx;
			font-weight: 500;
			letter-spacing: 1px;
			overflow: hidden;
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