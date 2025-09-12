<template>
	<view class="page">
		<!-- 导航栏 -->
		<fa-navbar title="设置" :show-back="true"></fa-navbar>
		
		<view class="setting-content">
			<!-- 编辑资料 -->
			<view class="setting-item" @click="goPage('/pages/my/profile-add', true)" v-if="vuex_token">
				<view class="item-left">
					<text class="item-title">编辑资料</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#c0c4cc" size="16"></u-icon>
				</view>
			</view>
			
			<!-- 清除缓存 -->
			<view class="setting-item" @click="clearCache"> 
				<view class="item-left">
					<text class="item-title">清除缓存</text> 
				</view>
				<view class="item-right">
					<text class="cache-size">{{ cacheSize }}</text>
					<u-icon name="arrow-right" color="#c0c4cc" size="16"></u-icon>
				</view>
			</view>
			
			<!-- 版本信息 -->
			<view class="setting-item">
				<view class="item-left">
					<text class="item-title">版本信息</text>
				</view>
				<view class="item-right">
					<text class="version-text">V {{ version }}</text>
				</view>
			</view>
			
			<!-- 用户协议 -->
			<view class="setting-item" @click="goPage('/pages/page/page?diyname=agreement')">
				<view class="item-left">
					<text class="item-title">用户协议</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#c0c4cc" size="16"></u-icon>
				</view>
			</view>
			
			<!-- 隐私政策 -->
			<view class="setting-item" @click="goPage('/pages/page/page?diyname=privacypolicy')">
				<view class="item-left">
					<text class="item-title">隐私政策</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#c0c4cc" size="16"></u-icon>
				</view>
			</view>
			
			<!-- 注销账号 -->
			<view class="setting-item" @click="deleteAccount">
				<view class="item-left" v-if="vuex_token && vuex_vipinfo">
					<view class="item-title" v-if="vuex_user.logoff == 0">注销账号</view>
					<view class="item-title" v-else>
						注销账号（申请审核中）
					</view>
				</view>
				<view class="item-left" v-else>
					<view class="item-title" @click="gotoLogin">
						注销账号
					</view>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#c0c4cc" size="16"></u-icon>
				</view>
			</view>
			
			<!-- 关闭个性化推荐 -->
			<view class="setting-item" v-if="vuex_token">
				<view class="item-left">
					<text class="item-title">关闭个性化推荐</text>
				</view>
				<view class="item-right">
					<u-switch :value="vuex_user.switch_recommend == 1" :active-color="switchActiveColor" @change="onRecommendChange"></u-switch>
				</view>
			</view>
		
		</view>
		
		<!-- 退出登录按钮 -->
		<view class="logout-wrapper" v-if="vuex_token">
			<!-- <u-button type="default" :custom-style="logoutBtnStyle" @click="logout">退出登录</u-button> -->
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				cacheSize: '8 M',
				version: '2.6.6',
				recommendSwitch: true,
				pushSwitch: true,
				logoutBtnStyle: {
					backgroundColor: 'transparent',
					color: '#666',
					border: '1px solid #e5e5e5',
					borderRadius: '28px',
					marginTop: '60px'
				}
			}
		},
		computed: {
			...mapState(['theme']),
			switchActiveColor() {
				return this.theme?.bgColor || '#007aff'
			}
		},
		onLoad() {
			this.getCacheSize()
			this.getSettings()
		},
		methods: {
			// 获取缓存大小
			getCacheSize() {
				// #ifdef APP-PLUS
				plus.cache.calculate((size) => {
					let cacheSize = (size / 1024 / 1024).toFixed(1)
					this.cacheSize = cacheSize + ' M'
				})
				// #endif
				
				// #ifndef APP-PLUS
				// H5和小程序可以使用其他方式计算
				try {
					const storage = uni.getStorageInfoSync()
					this.cacheSize = '8 M' // 默认显示
				} catch (e) {
					this.cacheSize = '0 M'
				}
				// #endif
			},
			
			// 清除缓存
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							// #ifdef APP-PLUS
							plus.cache.clear(() => {
								this.cacheSize = '0 M'
								this.$u.toast('缓存清除成功')
							})
							// #endif
							
							// #ifndef APP-PLUS
							try {
								uni.clearStorageSync()
								this.cacheSize = '0 M'
								this.$u.toast('缓存清除成功')
							} catch (e) {
								this.$u.toast('清除失败')
							}
							// #endif
						}
					}
				})
			},
			
			// 获取设置状态
			async getSettings() {
				try {
					// 从本地存储或接口获取设置状态
					const recommend = uni.getStorageSync('recommend_switch')
					const push = uni.getStorageSync('push_switch')
					if (recommend !== '') this.recommendSwitch = recommend
					if (push !== '') this.pushSwitch = push
				} catch (e) {
					console.log('获取设置失败', e)
				}
			},
			
			// 推荐开关改变
			onRecommendChange() {
				let value = this.vuex_user.switch_recommend == 1 ? 0 : 1
				this.$api.switchRecommend({ recommend: value }).then(res => {
					if (res.code === 1) {
						this.getUserIndex() // 刷新用户信息
						this.$u.toast('设置成功')
					} else {
						this.$u.toast(res.msg || '设置失败')
					}
				}).catch(() => {
					this.$u.toast('设置失败，请稍后重试')
				})
			},
			
			// 推送开关改变
			onPushChange(value) {
				this.pushSwitch = value
				uni.setStorageSync('push_switch', value)
				// 可以调用接口保存到服务器
			},
			
			// 注销账号
			async deleteAccount() {
				if(this.vuex_user.logoff == 0) {
					uni.showModal({
						title: '注销账号',
						content: '注销后将无法恢复账号数据，确定要注销吗？',
						confirmColor: '#f56c6c',
						success: (res) => {
							if (res.confirm) {
								// 调用注销接口
								this.doDeleteAccount()
							}
						}
					})
					return
				}else {
					const res = await this.$api.deleteAccountDay()
					uni.showModal({
						title: '提示',
						content: `账号已提交注销申请，请耐心等待平台客服处理，${res.data}天后将完成您账号注销任务！`,
						confirmColor: '#f56c6c',
						confirmText: '取消注销申请',
						cancelText: '关闭',
						success: (res) => {
							if (res.confirm) {
								// 调用注销接口
								this.cancelDeleteAccount()
							}
						}
					})
					return
				}
				
			},
			// 执行取消注销
			async cancelDeleteAccount() {
				try {
					const res = await this.$api.cancelDeleteAccount()
					if (res.code === 1) {
						this.$u.toast(res.msg || '已取消账号注销')
						this.getUserIndex() // 刷新用户信息
					} else {
						this.$u.toast(res.msg || '取消失败')
					}
				} catch (e) {
					this.$u.toast('取消失败，请稍后重试')
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
			gotoLogin() {
				if(!this.vuex_token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/setting/setting'
				})
			},
			
			// 退出登录 
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// // 清除token和用户信息
							// this.$u.vuex('vuex_token', '')
							// this.$u.vuex('vuex_user', {})
							
							// // 跳转到登录页
							// uni.reLaunch({
							// 	url: '/pages/login/login'
							// })
                            this.goPage('out')
                            uni.reLaunch({
								url: '/pages/index/index'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 100rpx;
	}
	
	.setting-content {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 36rpx 32rpx;
		border-bottom: 1px solid #f8f8f8;
		position: relative;
		
		&:last-child {
			border-bottom: none;
		}
		
		&:active {
			background-color: #f8f8f8;
		}
	}
	
	.item-left {
		flex: 1;
		
		.item-title {
			font-size: 32rpx;
			color: #333;
			font-weight: 400;
			line-height: 1.4;
		}
	}
	
	.item-right {
		display: flex;
		align-items: center;
		gap: 16rpx;
		
		.cache-size,
		.version-text {
			font-size: 28rpx;
			color: #999;
		}
		
		.cache-size {
			min-width: 60rpx;
			text-align: right;
		}
		
		.version-text {
			min-width: 80rpx;
			text-align: right;
		}
	}
	
	.logout-wrapper {
		padding: 0 32rpx;
		margin-top: 60rpx;
		
		:deep(.u-button) {
			height: 88rpx !important;
			border-radius: 44rpx !important;
			font-size: 32rpx !important;
			background-color: #fff !important;
			border: 2rpx solid #e5e5e5 !important;
			color: #333 !important;
			
			&:active {
				background-color: #f8f8f8 !important;
			}
		}
	}
	
	// 开关组件样式调整
	:deep(.u-switch) {
		transform: scale(0.9);
		
		.u-switch__bg {
			width: 100rpx !important;
			height: 60rpx !important;
			border-radius: 30rpx !important;
			background-color: #e5e5e5 !important;
			
			&.u-switch__bg--active {
				background-color: var(--theme-color, #007aff) !important;
			}
		}
		
		.u-switch__node {
			width: 52rpx !important;
			height: 52rpx !important;
			border-radius: 26rpx !important;
			background-color: #fff !important;
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1) !important;
		}
	}
	
	// 确保开关在所有setting-item中样式一致
	.setting-item .item-right .u-switch {
		margin: 0;
	}
</style>