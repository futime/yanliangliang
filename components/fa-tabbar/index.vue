<template>
	<view class="tabbar"  @touchmove.stop.prevent>
		<view class="tabbar-content">
			<view class="tabbar-item" :class="active == 'home' ? 'active' : ''" @click="handleClickTabItem('/pages/index/index')">
				<view class="icon">
					<image v-if="active == 'home'" :src="staticurl('navbar_menu_home_on.png')" mode=""></image>
					<image v-else :src="staticurl('navbar_menu_home.png')" mode=""></image>
				</view>
				<view class="label">
					首页
				</view>
			</view>
			<!-- <view class="tabbar-item middle">
				<view class="icon">
					<image class="icon-center" :src="staticurl('logo.png')" mode=""></image>
				</view>
				<view class="label">
					<image :src="staticurl('logo_txt.png')" mode=""></image>
				</view>
			</view> -->
			<view class="tabbar-item" :class="active == 'my' ? 'active' : ''" @click="handleClickTabItem('/pages/my/my')">
				<view class="icon">
					<image v-if="active == 'my'" :src="staticurl('navbar_menu_user_on.png')" mode=""></image>
					<image v-else :src="staticurl('navbar_menu_user.png')" mode=""></image>
				</view>
				<view class="label">
					我的
				</view>
			</view>
		</view>
		<view class="u-fixed-placeholder safe-area-inset-bottom" :style="{height: `calc(${$u.addUnit(210)} + ${true ? 48 : 0}rpx)`}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			active: {
				type: String,
				default: 'home'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			handleClickTabItem(url){
				console.log(url)
				uni.switchTab({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabbar {
		height: 210rpx;
		background: rgb(247, 247, 247);
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		
		.tabbar-content {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			height: 100%;
			
			.tabbar-item {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				
				&.active {
					.label {
						color: #F3941E;
					}
				}
				
				&.middle {
					position: relative;
					.label {
						width: 109rpx;
						height: 37rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					// .icon {
					// 	width: 296rpx;
					// 	height: 179rpx;
					// 	position: absolute;
					// 	top: -92rpx;
					// 	display: flex;
					// 	justify-content: center;
					// 	align-items: center;
					// 	.bg {
					// 		position: absolute;
					// 		top: 0;
					// 		left: 0;
					// 		width: 100%;
					// 		height: 100%;
					// 	}
					// }
				}
				
				.icon {
					width: 70rpx;
					height: 70rpx;
					margin-bottom: 14rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>