<template>
	<view class="page">
		<fa-navbar title="申请注销账号" :show-back="true"></fa-navbar>
		<view class="content">
			<view class="desc">
				请认真阅读并理解，注销账号将产生以下后果：<br />
				1、账号信息、第三方授权、手机号信息将被清空和取消; <br />
				2、所有使用、收藏、浏览记录和操作记录将被清空; <br />
				3、账户中所有的疼点典积分将被清空;<br />
				4、账户对应的疼点典会员身份与权益将被取消; <br />
				5、若仍坚定注销账号的想法，寻找页面上的 “我已了解，仍然注销” 按钮，点击该按钮，在弹出的确认框中再次点击 “确定”，以最终确认注销申请操作。 <br />
				6、提交账号注销申请后，将3个工作日内完成您当前账号的注销工作。
				7、一旦疼点典账号注销成功，该账号将从疼点典系统中彻底删除，且无法通过任何方式恢复。 <br />
				8、提交注销申请后，将进行数据清空操作，如您重新登录，将会注册新的账号。 <br />
				9、需要注意的是，新注册的账号与已注销的账号毫无关联，之前账号中的积分、收藏记录等信息无法转移到新账号中，一切都需重新开始积累。<br />
				10、根据相关法律法规，注销疼点典账号并不代表注销前的账号行为和相关责任得到豁免或减轻。 <br />
				<br/>所以，在操作注销前，务必再三确认自己的决定， <br />
				避免因一时冲动而造成无法挽回的损失。请谨慎考虑后决定。 <br />
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
					1. 注销账户是不可恢复的操作，一旦注销，您当前账号的我的收藏、呼吸练习等操作记录将被彻底删除且无法找回。<br/>
					2. 注销账户会永久删除该账户下的所有个人资料，且无法找回。<br/>
					3. 注销账户并不代表账户注销前的账号行为和相关责任得到豁免或减轻。<br/>
					4. 注销前，请确认该账号内所有服务均已妥善处理，如因账号注销造成的损失，由您自行承担。<br/>
					5. 提交账号注销申请后，将在3个工作日内完成您当前账号的注销流程。<br/>
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
			}
		},
		methods: {
			async modalConfirm() {
				try {
					const res = await this.$api.deleteAccount()
					if (res.code === 1) {
						this.$u.toast(res.msg || '账号已进入注销流程')
						this.show = false
						uni.navigateBack()
					} else {
						this.$u.toast(res.msg || '注销失败')
						this.$refs.uModal.clearLoading();
					}
				} catch (e) {
					this.$u.toast('注销失败，请稍后重试')
					this.$refs.uModal.clearLoading();
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