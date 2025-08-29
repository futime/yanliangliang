<template>
	<u-modal v-model="show" :show-cancel-button="true" :show-confirm-button="true" 
		title="提示" confirm-text="同意并登录" cancel-text="取消"
		@confirm="onConfirm" @cancel="onCancel">
		<view class="slot-content">
			<view class="agreement-text">
				请先阅读并同意疼点典
				<text class="agreement-link" @click="openAgreement('agreement')">《用户服务协议》</text>和
				<text class="agreement-link" @click="openAgreement('privacy')">《隐私政策》</text>
			</view>
		</view>
	</u-modal>
</template>

<script>
export default {
	name: 'AgreementModal',
	data() {
		return {
			show: false
		}
	},
	methods: {
		// 打开弹窗
		open() {
			this.show = true
		},
		// 关闭弹窗
		close() {
			this.show = false
		},
		// 点击确认
		onConfirm() {
			this.show = false
			this.$emit('confirm')
		},
		// 点击取消
		onCancel() {
			this.show = false
			this.$emit('cancel')
		},
		// 打开协议页面
		openAgreement(type) {
			let page = ''
			switch(type) {
				case 'agreement':
					page = '/pages/page/page?diyname=agreement'
					break
				case 'privacy':
					page = '/pages/page/page?diyname=privacypolicy'
					break
				case 'telecom':
					page = '/pages/page/page?diyname=telecomagreement'
					break
			}
			if(page) {
				uni.navigateTo({
					url: page
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.slot-content {
	padding: 30rpx;
}

.agreement-text {
	font-size: 28rpx;
	line-height: 40rpx;
	color: #333;
	text-align: left;
}

.agreement-link {
	color: #38A9AF;
	text-decoration: underline;
}
</style>