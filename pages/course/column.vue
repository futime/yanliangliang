<template>
	<view class="page" v-if="Object.keys(channel).length > 0">
		<fa-navbar title=" " :background="{ background: scrollTop > 800 ? '#fff' : 'transparent' }"
			:borderBottom="false" :autoBack="true" title-color="#fff" :is-back="true"></fa-navbar>

		<view class="columnKv">
			<view class="pageThumbnail">
				<u-image width="100%" :src="channel.image" mode="widthFix" class="image"></u-image>
			</view>
			<view class="conDesc">
				<view class="titleWrap">
					<view class="titleTxt">
						{{ channel.description }}
					</view>
					<view class="introDesc">
						<text>主讲人：{{ channel.column_speaker }}</text>
						<!-- <text>播放量：3578</text> -->
					</view>
				</view>
				<view class="btnBox">
					<!-- <u-icon :name="staticurl('course/playerbtn.svg')" size="56"></u-icon> -->
				</view>
			</view>
		</view>

		<view class="columnIntroWrap">
			<view class="introTitle">
				<view class="titleBox">
					<view class="title"> 专栏介绍 </view>
					<view class="subtitle"> 主讲人介绍 </view>
				</view>

				<view class="introduce">
					<text>
						{{ channel.columnIntro }}
					</text>
				</view>
			</view>
		</view>

		<view class="gapline"></view>

		<view class="courseList">
			<view class="courseTitle">
				<view class="titleBox">
					<view class="title"> 专栏内容 </view>
				</view>
			</view>

			<view class="listWrap">
				<view class="itemCard" @click="handleClickDetail(item.id)" v-for="item in categoryData" :key="item.id">
					<view class="image" v-if="channel.istag == 1">
						<view class="innerTag viewtxt" v-if="item.isfree == 0">免费</view>
						<view class="innerTag viewtxt" v-else-if="item.trialtime > 0">试看</view>
						<view class="innerTag viptxt" v-else>VIP</view>
						<u-image width="100%" height="240rpx" :border-radius="12" :src="item.image"
							mode="widthFix"></u-image>
					</view>
					<view class="image" v-else>
						<u-image width="100%" height="240rpx" :border-radius="12" :src="item.image"
							mode="widthFix"></u-image>
					</view>


					<view class="cardBox">
						<view class="name">
							{{ item.title }}
						</view>
						<view class="intro">
							<view class="time">
								<text>{{ item.videoduration }}</text>
							</view>
							<view class="viewer">
								<text>{{ item.views }}</text>人{{channel.viewstips}}
							</view>
						</view>
						<view class="playBtn">
							<u-icon :name="staticurl('course/player_gray.svg')" size="32"></u-icon>
						</view>
					</view>
				</view>
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
				page: 1,
				limit: 10,
				hasMore: true,
				loading: false,
				status: "loadmore", // loadmore/loading/nomore
				channel: {},
			};
		},
		onLoad() {
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
					// 这里请根据实际API参数调整
					channel: 2,
					page: this.page,
					limit: this.limit,
				});
				this.channel = res.data.channel;
				const list = res.data.pageList.data || [];
				if (isLoadMore) {
					this.categoryData = this.categoryData.concat(list);
				} else {
					this.categoryData = list;
				}
				if (list.length === this.limit) {
					this.status = "loadmore";
					this.hasMore = true;
				} else {
					this.status = "nomore";
					this.hasMore = false;
				}
				this.loading = false;
			},
			handleClickDetail(id) {
				// if(!this.vuex_token){
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url: "/pages/course/detail?id=" + id,
				});
			},
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {},
		onReachBottom() {
			if (!this.hasMore || this.loading) return;
			this.page++;
			this.getCategoryLists(true);
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		background: #fff;
	}

	/deep/ .u-back-wrap {
		.u-icon-wrap {
			width: 60rpx;
			height: 60rpx;
			background: rgba(0, 0, 0, 0.3);
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

	.gapline {
		height: 20rpx;
		background: #f7f9fc;
		width: 100%;
	}

	.gapModular {
		height: 80rpx;
		width: 100%;
	}

	.columnKv {
		position: relative;
		top: 0;
		bottom: 0;
		z-index: 1;
		margin-top: -186rpx;
		// #ifdef H5
		margin-top: -44px;

		// #endif
		.pageThumbnail {
			.image {
				width: 100%;
				height: 100%;
				position: relative;
			}

			&:before {
				position: absolute;
				top: 0rpx;
				width: 100%;
				height: calc(100% - 4rpx);
				z-index: 10;
				content: "";
				background: linear-gradient(180deg,
						rgba(0, 0, 0, 0.2) 0%,
						rgba(0, 0, 0, 0) 12%,
						rgba(0, 0, 0, 0) 50%,
						rgba(0, 0, 0, 0.6) 100%);
			}
		}

		.conDesc {
			width: 100%;
			position: absolute;
			bottom: 0px;
			padding: 0rpx 40rpx 80rpx 40rpx;
			z-index: 50;

			.titleWrap {
				color: #fff;

				.titleTxt {
					color: #fff;
					font-size: 42rpx;
					font-weight: bold;
					margin-bottom: 20rpx;
				}

				.introDesc {
					display: flex;
					gap: 24rpx;
					font-size: 26rpx;
				}
			}

			.btnBox {
				position: absolute;
				right: 40rpx;
				bottom: 72rpx;
			}
		}
	}

	//

	.columnIntroWrap {
		padding: 40rpx 36rpx 60rpx 36rpx;

		.introTitle {
			.titleBox {
				display: flex;
				width: 100%;
				margin-bottom: 40rpx;
				justify-content: space-between;

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

			.introduce {
				font-size: 26rpx;
				color: #595959;
				line-height: 1.8;
			}
		}
	}

	//
	.courseTitle {
		display: flex;
		gap: 16rpx;
		margin-bottom: 16rpx;

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

	.courseList {
		padding: 42rpx 36rpx 40rpx 36rpx;

		.listWrap {
			.itemCard {
				display: flex;
				gap: 40rpx;
				position: relative;
				padding: 30rpx 0rpx 40rpx 0rpx;
				margin-bottom: 10rpx;
				border-bottom: 1px solid #f3f3f3;

				&:nth-last-of-type(1) {
					border: none;
				}

				.image {
					width: 220rpx;
					height: 240rpx;
					position: relative;
				}

				.cardBox {
					margin-top: 20rpx;

					.name {
						font-size: 32rpx;
						color: #333333;
						font-weight: bold;
						line-height: 1.5;
						width: 90%;
					}
				}

				.intro {
					color: #b7b7ba;
					display: flex;
					gap: 16rpx;
					font-size: 28rpx;
					margin-top: 30rpx;

					.time {}

					.viewer {}
				}

				.playBtn {
					position: absolute;
					right: 12rpx;
					bottom: 40rpx;
					background: #f5f7fa;
					border-radius: 50%;
					width: 64rpx;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					image {}
				}
			}
		}
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