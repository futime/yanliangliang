<template>
	<view class="page">
		<fa-navbar title="申请注销账号" :show-back="true"></fa-navbar>
		<view class="content">
			<view class="desc">
				<text>{{this.logoffAreementCon}}</text>
			</view>
		</view>
		<view class="footerbar">
			<view class="btn danger" @click="confirm">
				我已了解，仍然注销
			</view>
			<view class="btn" @click="cancel">
				取消
			</view>
		</view>

		<u-modal v-model="show" title="确认注销该账号吗？" cancel-text="取消" show-cancel-button	confirm-color="#fa3534"	 ref="uModal" :async-close="true" confirm-text="确认注销" @confirm="modalConfirm">
			<view class="slot-content">
				<view class="desc">
					<text>{{this.logoffContent}}</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				logoffContent: '',
				logoffAreementCon: ''
			}
		},
		onLoad() {
			this.logoffTipsTxt()
			this.logoffAreementTxt()
		},
		methods: {
			async logoffTipsTxt() {
				const res = await this.$api.logoffContent()
				this.logoffContent = res.data
			},
			async logoffAreementTxt() {
				const res = await this.$api.logoffAreement()
				this.logoffAreementCon = res.data
			},
			async modalConfirm() {
				try {
					const res = await this.$api.deleteAccount()
					if (res.code === 1) {
						this.show = false
						uni.showModal({
							title: '提示',
							content: res.msg || '账号注销申请已提交，请耐心等待平台客服处理！',
							confirmText: '好的',
							confirmColor: '#f56c6c',
							showCancel: false,
							success: (res) => {
								uni.navigateBack()
							}
						})
						// this.$u.toast(res.msg || '账号注销申请已提交！请耐心等待平台客服处理！')
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 2600)
					} else {
						this.$u.toast(res.msg || '注销失败')
						this.$refs.uModal.clearLoading();
					}
				} catch (e) {
					this.$u.toast('注销失败，请稍后重试')
					this.$refs.uModal.clearLoading();
				}
			},
			// 执行注销
			async doDeleteAccount() {
				try {
					const res = await this.$api.deleteAccount()
					if (res.code === 1) {
						this.$u.toast(res.msg || '账号已进入注销流程')
						this.getUserIndex() // 刷新用户信息
					} else {
						this.$u.toast(res.msg || '注销失败')
					}
				} catch (e) {
					this.$u.toast('注销失败，请稍后重试')
				}
			},
			confirm() {
				this.show = true
			},
			cancel() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slot-content {
		padding: 24rpx;
		.title {
			font-size: 30rpx;
			color: #333;
			text-align: center;
		}
		.desc {
			color: #666;
			text-align: left;
			line-height: 48rpx;
			font-size:30rpx;
			padding:0px 20rpx;
		}
	}
	/deep/ .u-model__footer__button.hairline-left{
		background: #FF5B5A;
		color:#fff!important;
	}
	.page {
		padding: 20rpx;
		padding-bottom: 120rpx;
		
		.content {
			.desc {
				font-size: 30rpx;
				line-height: 46rpx;
				padding:20rpx 20rpx;
			}
		}

		.footerbar {
			position: fixed;
			height: 120rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;
			padding: 24rpx;
			border-top: 1rpx solid gainsboro;

			.btn {
				width:30%;
				height: 100%;
				padding: 14rpx 40rpx;
				background: #6387FF;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;
				&.danger {
					width:56%;
					background-color: #FF5B5A;
				}
			}
		}
	}
</style>