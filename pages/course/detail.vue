<template>
	<view class="page">
		<fa-navbar :title="archivesInfo.title" :borderBottom="false" :autoBack="true" title-color="#333" :is-back="true"
			:placeholder="true"></fa-navbar>
		<view class="detail-top">
			<view class="detailImg" :style="{ height: isvertical == '1' ? '1080rpx' : '640rpx' }">
				<!-- <image :src="staticurl('course/coursedetail_img.jpg')" mode="aspectFill"></image> -->
				<sunny-video ref="VideoRef" title="" :videoHeight="isvertical == '1' ? '1080rpx' : '640rpx'"
					playImgHeight="120rpx" :videoId="id" :loop="true" :autoplay="false" :src="videoSrc"
					:tipText="tipText" btnText="成为会员免费观看" :showMuteBtn="true" :poster="videoPoster"
					:trialTime="trialtime" :seekTime="0"></sunny-video>
			</view>
		</view>

		<view class="detailWrap">
			<view class="titleWrap">
				<view class="title">
					{{ archivesInfo.title || ''}}
				</view>
				<view class="desc">
					
					<text>主讲人：{{ archivesInfo.column_speaker || ''}}</text>
					
					<text>{{ archivesInfo.views || ''}}人看过</text>
				</view>
			</view>

			<view class="introTxt">
				{{ archivesInfo.description || ''}}
			</view>
		</view>

		<view class="gapline"></view>

		<view class="anchorContent">
			<view class="wrapTitle">
				<view class="boxTitle"> 主讲人介绍 </view>
			</view>

			<view class="anchor-view" @click="handleClickColumn">
				<view class="avatar-img">
					<image :src="archivesInfo.speakerimg" mode="aspectFill"></image>
				</view>
				<view class="intro-box">
					<view class="title">
						{{ archivesInfo.column_speaker || ''}}
					</view>
					<view class="subtitle">
						{{ archivesInfo.speaker_subtitle || ''}}
					</view>
					<view class="intro">
						{{ archivesInfo.speaker_desc || ''}}
					</view>
				</view>
			</view>
		</view>

		<view class="gap-placeholder"></view>

		<view class="bottom-fixed-bar">
			<view class="detail-action-bar">
				<view class="action-buttons">
					<button class="btn-share" @click="showShare = true">
						<u-icon :name="staticurl('course/shareico.svg')" size="56"></u-icon>
						分享
					</button>
					<button class="btn-collect" @click="handleCollect">
						<u-icon
							:name="isCollect ? staticurl('course/collectico_on.svg') : staticurl('course/collectico.svg')"
							size="56"></u-icon>
						收藏
					</button>
				</view>
			</view>
		</view>
		
		<view class="" v-if="archivesInfo.id">
			<fa-share
				:goods-id="archivesInfo.id"
				v-model="showShare"
			></fa-share>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import { weixinShare } from '@/common/fa.weixin.mixin.js';
	// #endif
	export default {
		mixins: [
			// #ifdef H5
			weixinShare
			// #endif
		],
		data() {
			return {
				videoStarted: false,
				videoSrc: "",
				videoPoster: "",
				archivesInfo: {},
				isCollect: false,
				id: null,
				isvertical: 0,
				showShare: false,
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
		onUnload() {
			this.$refs.VideoRef && this.$refs.VideoRef.handelStop()
		},
		onHide() {
			this.$refs.VideoRef && this.$refs.VideoRef.handelStop()
		},
		onShareAppMessage() {
			return {
				title: this.archivesInfo.title,
				imageUrl: this.archivesInfo.image,
				path: `/pages/course/detail?id=${this.id}`
			}
		},
		onShareTimeline() {
			return {
				title: this.archivesInfo.title,
				imageUrl: this.archivesInfo.image,
				path: `/pages/course/detail?id=${this.id}`
			}
		},
		onShow() {},
		computed: {
			trialtime() {
				if (this.checkVipExpiry && this.checkVipExpiry()) {
					return 0;
				} else {
					if (this.archivesInfo.isfree == 0) {
						return 0;
					}
					if (this.archivesInfo.trialtime > 0) {
						return this.archivesInfo.trialtime;
					} else {
						return 0.1;
					}
				}
			},
			tipText() {
				if (this.checkVipExpiry && this.checkVipExpiry()) {
					return "本片是会员专享内容";
				} else {
					if (this.archivesInfo.isfree == 0) {
						return "试看已结束，本片是会员专享内容";
					}
					if (this.archivesInfo.trialtime > 0) {
						return "试看已结束，本片是会员专享内容";
					} else {
						return "本片是会员专享内容";
					}
				}
			},
		},
		methods: {

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
				// #ifdef MP-WEIXIN
				this.$u.mpShare = {
					title: res.data.title,
					imageUrl: res.data.image,
					path: '/pages/course/detail?id=' + this.id + '&invite_id=' + (this.vuex_user.id || '')
				};
				// #endif
				this.archivesInfo = res.data.archivesInfo;
				this.videoSrc = res.data.archivesInfo.videourl;
				this.videoPoster = res.data.archivesInfo.image;
				this.isvertical = res.data.archivesInfo.isvertical
			},


			play(e) {
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
					if (typeof wx !== "undefined" && wx.createAudioContext) {
						const ctx = wx.createAudioContext(audio.id, this);
						ctx && ctx.pause && ctx.pause();
					}
					// #endif
				}
			},
			handleClickColumn() {
				uni.navigateTo({
					url: "/pages/course/column",
				});
			},
		},
		onPullDownRefresh() {},
		onReachBottom() {},
	};
</script>

<style lang="scss" scoped>
	/deep/ .u-back-wrap {
		.u-icon-wrap {
			width: 60rpx;
			height: 60rpx;
			// background: rgba(0, 0, 0, 0.3);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.u-icon__icon,
			.u-iconfont {
				font-size: 18px !important;
			}
		}
	}

	.detailWrap {
		padding: 48rpx 36rpx 60rpx 36rpx;

		.titleWrap {
			.title {
				color: #000000;
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 24rpx;
			}

			.desc {
				font-size: 26rpx;
				color: #8d8d8d;
				line-height: 1.8;
				display: flex;
				gap: 24rpx;
				margin-bottom: 40rpx;
			}
		}

		.introTxt {
			font-size: 28rpx;
			color: #787878;
			line-height: 1.5;
		}
	}

	.gapline {
		height: 20rpx;
		background: #f7f9fc;
		width: 100%;
	}

	.detail-top {
		.detailImg {

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.anchorContent {
		padding: 60rpx 36rpx 40rpx 36rpx;

		.wrapTitle {
			margin-bottom: 40rpx;

			.boxTitle {
				font-size: 32rpx;
				font-weight: bold;
				color: #000;
				line-height: 1.5;
			}
		}

		.anchor-view {
			display: flex;
			gap: 30rpx;

			.avatar-img {
				width: 30%;

				image {
					width: 180rpx;
					height: 180rpx;
					object-fit: cover;
					border-radius: 50%;
				}
			}

			.intro-box {
				width: 70%;

				.title {
					font-size: 38rpx;
					color: #000000;
					margin-bottom: 12rpx;
				}

				.subtitle {
					margin-bottom: 16rpx;
					font-size: 26rpx;
					color: #595959;
				}

				.intro {
					font-size: 24rpx;
					color: #808080;
					line-height: 1.5;
				}
			}
		}
	}

	.gap-placeholder {
		height: 240rpx;
		width: 100%;
	}

	.bottom-fixed-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background: #fff;
		color: #fff;
		padding: 16rpx 32rpx 60rpx 32rpx;
		box-sizing: border-box;
		height: 180rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid #f5f5f5;
	}

	.detail-action-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		.action-buttons {
			display: flex;
			align-items: center;
			justify-content: center;

			button {
				width: 236.84rpx;
				height: 70rpx;
				line-height: 70rpx;
				padding: 0 30rpx;
				border-radius: 35rpx;
				font-size: 28rpx;
				margin-left: 20rpx;
				background: none !important;
				border: none !important;
				outline: none !important;
				box-shadow: none !important;

				&:after {
					display: none !important;
				}
			}

			/deep/ uni-button:after {
				display: none !important;
			}

			.btn-share {
				background: transparent;
				color: rgba(0, 0, 0, 0.5);
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
			}

			.btn-collect {
				color: rgba(0, 0, 0, 0.5);
				border: none;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8rpx;
			}
		}
	}
</style>