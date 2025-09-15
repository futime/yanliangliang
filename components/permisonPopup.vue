
<template>
	<view>
		<view class="popup-container">
			<view class="permission-alert" id="permission-alert">
				<text style="font-size: 40rpx; margin-bottom: 20rpx; display: block">{{ permisionName }}: </text>
				<text>{{ purpose }}</text>
			</view>
		</view>
	</view>
</template>
 
<script>
export default {
	props: {
		permisionName: {
			type: String,
			default: '' // 默认空文本
		},
		purpose: {
			type: String,
			default: '' // 默认按钮文本
		}
	},
	methods: {}
};
</script>
 
<style scoped>
 
.popup-container {
	position: fixed;
	top: 10%;
	left: 50%;
	width: 90%;
	transform: translate(-50%, -50%);
	z-index: 99999999999999999;
	background-color: #b5c3d2;
	border-radius: 32rpx;
	padding: 24rpx;
	color: #000;
	padding-top: 40rpx;
}
</style>
