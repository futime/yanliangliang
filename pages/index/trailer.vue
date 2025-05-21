<template>
	<view class="page">
		<!-- 视频播放器 -->
		<view class="media-card video-card">
			<view v-if="!videoStarted" class="video-cover-box">
				<image
					class="video-cover"
					:src="videoPoster"
					mode="aspectFill"
				/>
				<image
					class="video-play-btn"
					src="https://yanliangliang.com/static/video/videoplayer.svg"
					@click="playVideo"
				/>
			</view>
			<video
				v-show="videoStarted"
				ref="videoRef"
				class="media-video"
				:src="videoSrc"
				:controls="true"
				:autoplay="false"
				:poster="videoPoster"
				@play="onVideoPlay"
			></video>
			<view class="media-label">
				<u-icon name="play-circle" color="#1abc9c" size="36"></u-icon>
				<text class="media-title">宣传片 · 视频</text>
			</view>
		</view>
		<!-- 音频播放器 -->
		<view class="media-card audio-card">
			<audio
				ref="audioRef"
				class="media-audio"
				:src="audioSrc"
				controls
				name="眼亮亮宣传片"
				author="眼亮亮"
				poster="https://yanliangliang.com/static/video/videothumb.jpg"
				@play="onAudioPlay"
			></audio>
			<view class="media-label">
				<u-icon name="volume-up" color="#f39c12" size="36"></u-icon>
				<text class="media-title">宣传片 · 音频</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoStarted: false,
			videoSrc: 'https://yanliangliang.com/static/video/qiangang_video.mp4',
			videoPoster: 'https://yanliangliang.com/static/video/videothumb.jpg',
			audioSrc: 'https://yanliangliang.com/static/video/qiangang_video.mp3',
		};
	},
	methods: {
		playVideo() {
			this.videoStarted = true;
			this.$nextTick(() => {
				// #ifdef H5
				this.$refs.videoRef && this.$refs.videoRef.play && this.$refs.videoRef.play();
				// #endif
			});
		},
		onVideoPlay() {
			this.videoStarted = true;
			// 自动暂停音频，兼容 H5 和小程序
			const audio = this.$refs.audioRef;
			if (audio) {
				// H5 原生 audio
				if (audio.pause) {
					audio.pause();
				}
				// 微信小程序 audio context
				if (audio.context && audio.context.pause) {
					audio.context.pause();
				}
				// #ifdef MP-WEIXIN
				if (typeof wx !== 'undefined' && wx.createAudioContext) {
					const ctx = wx.createAudioContext(audio.id, this);
					ctx && ctx.pause && ctx.pause();
				}
				// #endif
			}
		},
		onAudioPlay() {
			// 自动暂停视频
			if (this.$refs.videoRef) {
				this.$refs.videoRef.pause && this.$refs.videoRef.pause();
			}
		},
	},
};
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: linear-gradient(135deg, #f8fafc 0%, #e9f0fb 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0;
}
.header {
	width: 100vw;
	max-width: 700rpx;
	margin: 0 auto 24rpx auto;
	padding-top: 48rpx;
	text-align: center;
}
.title {
	font-size: 44rpx;
	font-weight: 700;
	color: #222;
	letter-spacing: 2rpx;
	font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}
.divider {
	width: 80rpx;
	height: 6rpx;
	background: linear-gradient(90deg, #1abc9c 0%, #f39c12 100%);
	border-radius: 3rpx;
	margin: 18rpx auto 0 auto;
}
.media-card {
	width: 92vw;
	max-width: 700rpx;
	background: #fff;
	border-radius: 32rpx;
	box-shadow: 0 8rpx 32rpx 0 rgba(30,60,120,0.10);
	margin-bottom: 48rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0 32rpx 0;
	position: relative;
	transition: box-shadow 0.3s;
}
.media-card:hover {
	box-shadow: 0 16rpx 48rpx 0 rgba(30,60,120,0.16);
}
.video-card {
	margin-top: 16rpx;
	background: linear-gradient(120deg, #eaf6ff 0%, #f8fafc 100%);
}
.audio-card {
	background: linear-gradient(120deg, #fdf6e3 0%, #f8fafc 100%);
	margin-bottom: 0;
}
.video-cover-box {
	position: relative;
	width: 92vw;
	max-width: 650rpx;
	height: 360rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 24rpx 0 rgba(30,60,120,0.10);
}
.video-cover {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 24rpx;
}
.video-play-btn {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 110rpx;
	height: 110rpx;
	transform: translate(-50%, -50%);
	cursor: pointer;
	z-index: 2;
	filter: drop-shadow(0 4rpx 16rpx rgba(30,60,120,0.10));
	transition: transform 0.2s;
}
.video-play-btn:active {
	transform: translate(-50%, -50%) scale(0.92);
}
.media-video {
	width: 92vw;
	max-width: 650rpx;
	height: 360rpx;
	border-radius: 24rpx;
	background: #000;
	object-fit: cover;
	box-shadow: 0 4rpx 24rpx 0 rgba(30,60,120,0.10);
}
.media-audio {
	width: 92vw;
	max-width: 650rpx;
	height: 100%;
	margin-top: 8rpx;
}
.media-label {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	gap: 12rpx;
	font-size: 30rpx;
	color: #1abc9c;
	font-weight: 500;
	letter-spacing: 1rpx;
}
.audio-card .media-label {
	color: #f39c12;
}
/deep/ .uni-audio-default {
	width: 100% !important;
}
</style>