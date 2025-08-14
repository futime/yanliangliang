<template>
	<view class="page" v-if="Object.keys(archivesInfo).length > 0">
		<fa-navbar :title="' '" backIconColor="#fff" :borderBottom="false" :background="{ color: '#fff' }"
			:autoBack="true" :is-back="true"></fa-navbar>
		<!-- 背景图片 -->
		<view class="bg-image">
			<view v-if="archivesInfo.bgvertical" class="bg-img" :class="{ 'bg-animate': isPlaying }"
				:style="{ backgroundImage: `url(${archivesInfo.bgvertical})` }"></view>
			<view v-else class="bg-gradient"></view>
			<view class="bg-overlay"></view>
		</view>
		<view class="sound-detail">
			<!-- 内容区域 -->
			<view class="content">
				<!-- 标题和副标题 -->
				<view class="title-section">
					<text class="main-title">{{ archivesInfo.title || '山雨已来' }}</text>
					<text class="sub-title">{{ archivesInfo.subtitle || '缓解失眠问题' }}</text>
				</view>

				<view class="footer">
					<!-- 播放控制区域 -->
					<view class="player-section">
						<!-- 播放/暂停按钮 -->
						<view class="play-btn" @click="togglePlay">
							<!-- <u-icon :name="isPlaying ? 'pause' : 'play-right'" size="60" color="#fff"></u-icon> -->
							<image :src="staticurl('player_icon.svg')" v-if="!isPlaying" mode=""></image>
							<image :src="staticurl('pause_icon.svg')" v-else mode=""></image>
						</view>

						<!-- 进度条 -->
						<view class="progress-section">
							<text class="current-time">{{ formatTime(currentTime) }}</text>
			<view class="progress-bar" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
								<view class="progress-bg"></view>
								<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
								<view class="progress-thumb" :style="{ left: progressPercent + '%' }"></view>
							</view>
							<text class="total-time">{{ formatTime(duration) }}</text>
						</view>
					</view>

					<!-- 底部操作按钮 -->
					<view class="bottom-actions">
						<view class="action-btn" @click="toggleLoop">
							<view class="action-icon">
								<image :src="staticurl('cycle_icon.svg')" mode=""></image>
							</view>
							<text class="action-text" :class="{ active: isLoop }">{{ isLoop ? '已循环本集' : '循环播放' }}</text>
						</view>
						<view class="action-btn" @click="handleCollect">
							<view class="action-icon">
								<image :src="staticurl('collect.svg')" mode="" v-if="!isCollect"></image>
								<image :src="staticurl('collect_on.svg')" mode="" v-else></image>
							</view>
							<text class="action-text" :class="{ active: isCollect }">{{ isCollect ? '已收藏音频' : '收藏音频'
							}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoStarted: false,
			videoSrc: "",
			videoPoster: "",
			archivesInfo: {},
			isCollect: false,
			id: null,
			// 播放器状态
			isPlaying: false,
			isLoop: false,
			currentTime: 0,
			duration: 0,
			progressPercent: 0,
			audioId: 'audio_' + Date.now(),
			isDragging: false,
			progressBarRect: null,
			volume: 1,
			playbackRate: 1,
			audioContext: null,
		};
	},
	onLoad(opt) {
		this.id = opt.id;
		this.getArchiveDetail();
		if (this.vuex_token) {
			this.getUserIndex();
			this.checkCollection();
		}
	},
	onShareAppMessage() {
		return {
			title: this.archivesInfo.title,
			imageUrl: this.archivesInfo.image,
			path: `/pages/course/sound-detail?id=${this.id}`
		}
	},
	onShareTimeline() {
		return {
			title: this.archivesInfo.title,
			imageUrl: this.archivesInfo.image,
			path: `/pages/course/sound-detail?id=${this.id}`
		}
	},
	onUnload() {
		// 停止并销毁音频
		this.isPlaying = false;
		this.destroyAudio();
		// 重置状态
		this.currentTime = 0;
		this.duration = 0;
		this.progressPercent = 0;
		this.isDragging = false;
	},
	onShow() { },
	onReady() {
		this.$nextTick(() => {
			this.updateProgressBarRect();
		});
	},
	computed: {},
	methods: {
		// 播放控制
		togglePlay() {
			if (this.isPlaying) {
				this.pauseAudio();
			} else {
				this.playAudio();
			}
		},

		playAudio() {
			this.audioContext.play();
		},

		pauseAudio() {
			this.audioContext.pause();
		},

		// 循环播放切换
		toggleLoop() {
			this.isLoop = !this.isLoop;
			if (this.isLoop) {
				this.audioContext.loop = true;
			} else {
				this.audioContext.loop = false;
			}
		},

		// 静音切换
		toggleMute() {
			if (this.volume > 0) {
				this.volume = 0;
			} else {
				this.volume = 1;
			}

			if (this.audioContext) {
				this.audioContext.volume = this.volume;
			}
		},

		// 进度条控制
		onTouchStart(e) {
			this.isDragging = true;
			if (!this.progressBarRect) {
				this.updateProgressBarRect();
			}
		},

			onTouchMove(e) {
			if (!this.isDragging) return;

				const touch = e.touches[0];
				let percent = 0;
				const rect = this.progressBarRect;
				if (rect) {
					percent = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
				}
			this.progressPercent = percent;
			this.currentTime = (this.duration * percent) / 100;
		},

		onTouchEnd(e) {
			if (!this.isDragging) return;

			this.isDragging = false;
			// 设置音频播放位置
			const targetTime = (this.duration * this.progressPercent) / 100;
			this.audioContext && this.audioContext.seek(targetTime);
		},
		updateProgressBarRect() {
			try {
				const query = uni.createSelectorQuery().in(this);
				query.select('.progress-bar').boundingClientRect((rect) => {
					if (rect) this.progressBarRect = rect;
				}).exec();
			} catch (e) {}
		},
		// 时间格式化
		formatTime(seconds) {
			if (!seconds || isNaN(seconds)) return '00:00';
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		},

		handleCollect() {
			if (!this.vuex_token) {
				uni.showToast({
					title: '请登录',
					icon: 'none',
					success() {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				})
				return
			}
			if (this.isCollect) {
				this.$api.deleteCollection({
					aid: this.id
				})
			} else {
				this.$api.createCollection({
					aid: this.id,
					type: 'archives'
				})
			}
			setTimeout(() => {
				this.checkCollection(true)
			}, 400)
		},
		async checkCollection(showToast = false) {
			let res = await this.$api.checkCollection({
				id: this.id
			})
			if (res.data.check == 1) {
				this.isCollect = true
				if (showToast) {
					this.$u.toast('收藏成功')
				}
			} else {
				this.isCollect = false
				if (showToast) {
					this.$u.toast('取消收藏成功')
				}
			}
		},
		async getArchiveDetail() {
			let res = await this.$api.getArchiveDetail({
				id: this.id,
			});
			this.archivesInfo = res.data.archivesInfo;
			// this.videoSrc = res.data.archivesInfo.videourl;
			// this.videoPoster = res.data.archivesInfo.image;
			this.initAudio()
		},
		initAudio() {
			// 先销毁旧实例，避免多实例叠加
			this.destroyAudio();
			this.audioContext = uni.createInnerAudioContext();
			this.audioContext.src = this.archivesInfo.mp3url;
			this.audioContext.autoplay = false;
			this.audioContext.loop = this.isLoop;
			this.audioContext.volume = this.volume;

			this.audioContext.onCanplay(() => {
				console.log('onCanplay')
				setTimeout(() => {
					console.log(this.audioContext.duration); // 401.475918
					this.duration = this.audioContext.duration;
				}, 1000)
			})
			this.audioContext.onTimeUpdate(() => {
				console.log('onTimeUpdate')
				this.currentTime = this.audioContext.currentTime;
				this.duration = this.audioContext.duration;
				this.progressPercent = (this.currentTime / this.duration) * 100;
			})
			this.audioContext.onEnded(() => {
				console.log('onEnded')
				this.currentTime = 0;
				this.progressPercent = 0;
				this.isPlaying = false;
			})
			this.audioContext.onError(() => {
				console.log('onError')
			})
			this.audioContext.onPlay(() => {
				this.isPlaying = true;
			})
			this.audioContext.onPause(() => {
				this.isPlaying = false;
			})
		},
		// 停止并销毁当前音频实例
		destroyAudio() {
			if (this.audioContext) {
				try { this.audioContext.stop && this.audioContext.stop(); } catch (e) {}
				try { this.audioContext.offCanplay && this.audioContext.offCanplay(); } catch (e) {}
				try { this.audioContext.offTimeUpdate && this.audioContext.offTimeUpdate(); } catch (e) {}
				try { this.audioContext.offEnded && this.audioContext.offEnded(); } catch (e) {}
				try { this.audioContext.offError && this.audioContext.offError(); } catch (e) {}
				try { this.audioContext.offPlay && this.audioContext.offPlay(); } catch (e) {}
				try { this.audioContext.offPause && this.audioContext.offPause(); } catch (e) {}
				try { this.audioContext.destroy && this.audioContext.destroy(); } catch (e) {}
				this.audioContext = null;
			}
		}
	},
	onPullDownRefresh() { },
	onReachBottom() { },
};
</script>

<style lang="scss" scoped>
.page {
	position: relative;
	width: 100vw;
	height: 100vh;
	// background: #000;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
}

.sound-detail {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.bg-img {
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	animation: bgZoom 60s ease-in-out infinite;
	animation-play-state: paused;
}

.bg-animate {
	animation-play-state: running;
}

@keyframes bgZoom {
	0% {
		background-size: 100% 100%;
	}

	50% {
		background-size: 120% 120%;
	}

	100% {
		background-size: 100% 100%;
	}
}

.bg-gradient {
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
}

.content {
	position: relative;
	z-index: 2;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 120rpx 40rpx 80rpx;
}

.title-section {
	text-align: center;
	margin-bottom: 100rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.main-title {
	color: #FFF;
	text-align: center;
	font-family: "PingFang SC";
	font-size: 72rpx;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.sub-title {
	color: #FFF;
	text-align: center;
	font-family: "PingFang SC";
	font-size: 42rpx;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.player-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100rpx;
}

.play-btn {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 60rpx;

	image {
		width: 100%;
		height: 100%;
	}
}


.progress-section {
	width: 100%;
	max-width: 600rpx;
	display: flex;
	align-items: center;
	gap: 26rpx;
}

.progress-bar {
	flex: 1;
	position: relative;
	width: 100%;
	height: 8rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 4rpx;
}

.progress-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 4rpx;
}

.progress-fill {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background: #fff;
	border-radius: 4rpx;
	transition: width 0.1s ease;
}

.progress-thumb {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 20rpx;
	height: 20rpx;
	background: #fff;
	border-radius: 50%;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
	z-index: 10;
}

.current-time,
.total-time {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.8);
	font-family: monospace;
}

.bottom-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 100rpx;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
}

.action-text {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-top: 10rpx;
	transition: color 0.3s ease;
}

.action-text.active {
	color: #fff;
}

.action-icon {
	width: 60rpx;
	height: 60rpx;
	flex-shrink: 0;

	image {
		width: 100%;
		height: 100%;
	}
}
</style>