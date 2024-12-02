<template>
	<view class="page">
		<fa-navbar :title="' '" :background="{ color: 'transparent' }" :borderBottom="false" :styleBack="true"></fa-navbar>
		<view class="bg">
			<!-- <image :src="staticurl('startpage_bg.jpeg')" mode=""></image> -->
			<video :src="videourl('startpage_bg.mp4')" :poster="staticurl('startpage_bg.jpeg')" autoplay :controls="false" loop muted=""></video>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			handleClickStart() {
				if(!this.vuex_user.face_image) {
					uni.navigateTo({
						url: '/pages/space/face'
					})
					return
				}
				uni.redirectTo({
					url: '/pages/space/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			width: 573rpx;
			height: 135rpx;
			margin-top: 137rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.sanjiao  {
			width: 600rpx;
			height: 572rpx;
			margin-top: 233rpx;
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