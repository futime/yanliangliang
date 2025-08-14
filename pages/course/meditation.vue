<template>
	<view class="page">
		<fa-navbar title=" " :background="{ background: scrollTop > 40 ? '#fff' : '#fff' }"
			:borderBottom="false"></fa-navbar>

		<!---->
		<view class="meditationList">
			<view class="courseTitle" v-if="Object.keys(channel).length > 0">
				<view class="titleBox">
					<view class="title"> {{ channel.name }} </view>
					<view class="subtitle"> {{ channel.description }} </view>
				</view>
			</view>

			<view class="listWrap">
				<view class="listInner" v-for="item in categoryData" :key="item.id" @click="handleClickSound(item)">
					<view class="image" v-if="channel.istag == 1">
						<view class="innerTag viewtxt" v-if="item.isfree == 0">免费</view>
						<view class="innerTag viewtxt" v-else-if="item.trialtime > 0">试看</view>
						<view class="innerTag viptxt" v-else>VIP</view>
						<u-image width="100%" height="214rpx" :border-radius="12" :src="item.image"
							mode="aspectFill"></u-image>
					</view>
					<view class="image" v-else>
						<u-image width="100%" height="214rpx" :border-radius="12" :src="item.image"
							mode="aspectFill"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							{{ item.title }}
						</view>
						<view class="intro">
							<view class="time" v-if="channel.isAudioShow == 1">
								<u-icon :name="staticurl('course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>{{ item.views }}</text>人{{channel.viewstips}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载状态 -->
			<view style="margin-top: 40rpx">
				<u-loadmore :status="status" />
			</view>
		</view>

		<view class="gapModular"></view>

		<fa-tabbar :visible="true"></fa-tabbar>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				scrollTop: 0,
				categoryData: [],
				channel: "",
				page: 1,
				limit: 10,
				hasMore: true,
				loading: false,
				status: "loadmore", // loadmore/loading/nomore
				channel: {}
			};
		},
		onLoad(opt) {
			this.channel = opt.channel;
			this.page = 1;
			this.getCategoryLists();
		},
		onShow() {},
		computed: {},
		methods: {
			async getCategoryLists(isLoadMore = false) {
				if (this.loading || this.status === "nomore") return;
				this.loading = true;
				this.status = "loading";
				let res = await this.$api.getCategoryList({
					channel: this.channel,
					page: this.page,
					limit: this.limit,
				});
				this.channel = res.data.channel
				const list = res.data.pageList.data || [];
				if (isLoadMore) {
					this.categoryData = this.categoryData.concat(list);
				} else {
					this.categoryData = list;
				}
				// 判断是否还有更多
				if (list.length === this.limit) {
					this.status = "loadmore";
					this.hasMore = true;
				} else {
					this.status = "nomore";
					this.hasMore = false;
				}
				this.loading = false;
			},
			handleClickSound(item) {
				if (item.videourl) {
					if (item.isvertical) {
						uni.navigateTo({
							url: `/pages/course/detail?id=${item.id}`
						})
					} else {
						uni.navigateTo({
							url: `/pages/course/detail?id=${item.id}`
						})
					}
					return
				}
				uni.navigateTo({
					url: `/pages/course/sound-detail?id=${item.id}`
				})
			},
			onReachBottom() {
				if (!this.hasMore || this.loading) return;
				this.page++;
				this.getCategoryLists(true);
			},
		},
		onPullDownRefresh() {},
		onReachBottom() {},
	};
</script>

<style lang="scss" scoped>
	.page {
		background: #fff;
	}

	.gapline {
		height: 20rpx;
		background: #f7f9fc;
		width: 100%;
	}

	.gapModular {
		height: 80rpx;
		width: 100%;
	}

	//

	.courseTitle {
		display: flex;
		gap: 16rpx;

		.titleBox {
			display: flex;
			width: 100%;

			.title {
				color: #000000;
				font-size: 40rpx;
				font-weight: bold;
				margin-right: 16rpx;
			}

			.subtitle {
				font-size: 28rpx;
				color: #808080;
				display: flex;
				align-items: flex-end;
				margin-bottom: 4rpx;
			}
		}

		.arrowMore {
			display: flex;
			align-items: center;
		}
	}

	//
	.meditationList {
		padding: 40rpx 36rpx;

		.listWrap {
			display: flex;
			gap: 30rpx 24rpx;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 40rpx;
		}

		.listInner {
			width: calc(50% - 20rpx);
			position: relative;

			.image {
				width: 100%;
				height: 214rpx;
				position: relative;
			}

			.cardBox {
				padding: 16rpx 24rpx 20rpx 24rpx;
				border: 1px solid #edf1f7;
				border-bottom-left-radius: 12rpx;
				border-bottom-right-radius: 12rpx;

				.name {
					font-size: 32rpx;
					color: #333333;
					font-weight: bold;
					line-height: 1.5;
					width: 100%;
					height: 80rpx;
				}
			}

			.intro {
				color: #b7b7ba;
				display: flex;
				gap: 16rpx;
				font-size: 28rpx;
				margin-top: 30rpx;

				.time {
					margin-top: 4rpx;
				}
			}
		}
	}

	.load-status {
		width: 100%;
		text-align: center;
		color: #b7b7ba;
		font-size: 28rpx;
		padding: 32rpx 0 0 0;
	}

	.innerTag {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 10;
		font-size: 12px;
		padding: 6rpx 16rpx;
		background: #000000;
		color: #fff;
		border-top-left-radius: 16rpx;
	}

	.viewtxt {}

	.viptxt {
		background: #fe8825;
	}
</style>