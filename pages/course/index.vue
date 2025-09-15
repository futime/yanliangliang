<template>
	<view class="page">
		<fa-navbar :title="vuex_config.coursePageTitle" :background="{ background: scrollTop > 40 ? '#fff' : '#fff' }" :borderBottom="false"></fa-navbar>
		
		
		<view class="courseSwiper">
			<u-swiper :list="vuex_config.swiper" :height="350" @click="openPage"></u-swiper>
		</view>
		
		<view class="gapline"></view>
		
		
		<view class="courseList" v-if="channel2.channel.islist == 1">
			<view class="courseTitle" @click="handleClickColumn">
				<view class="titleBox">
					<view class="title">
						{{channel2.channel.name || ''}}
					</view>
					<view class="subtitle">
						{{channel2.channel.description || ''}}
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
			
			<view class="listWrap">
				<view class="itemCard" v-for="item in channel2.list" :key="item.id" @click="handleClickDetail(item.id)">
					<view class="image" v-if="channel2.channel.istag == 1">
						<view class="innerTag viewtxt" v-if="item.isfree == 0">{{ vuex_config.videoFreeTips }}</view>
						<view class="innerTag viewtxt" v-else-if="item.trialtime  > 0">{{ vuex_config.videoTryTips }}</view>
						<view class="innerTag viptxt" v-else>{{ vuex_config.videoVipTips }}</view>
						<u-image width="100%" height="230rpx" :border-radius="12" :src="item.image" mode="widthFix"></u-image>
					</view>
					<view class="image" v-else="">
						<u-image width="100%" height="230rpx" :border-radius="12" :src="item.image" mode="widthFix"></u-image>
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
								<text>{{ item.views }}</text>人{{channel1.channel.viewstips}}
							</view>
						</view>
						<view class="playBtn">
							<u-icon :name="staticurl('course/player_gray.svg')" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
			
		<view class="gapline"></view>
		
		
		<!---->
		<view class="meditationList sheepingList" v-if="channel1.channel.islist == 1">
			<view class="courseTitle" @click="handleClickMeditation(3)">
				<view class="titleBox">
					<view class="title">
						{{channel1.channel.name || ''}}
					</view>
					<view class="subtitle">
						{{channel1.channel.description || ''}}
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
			
			<view class="listWrap">
				<scroll-view scroll-x style="width: 100%; white-space: nowrap;">
					<view class="listInner" style="display: inline-block; margin-right: 20rpx;" v-for="item in channel1.list" :key="item.id" @click="handleClickSound(item)">
						<view class="image" v-if="channel1.channel.istag == 1">
							<view class="innerTag viewtxt" v-if="item.isfree == 0">{{ vuex_config.videoFreeTips }}</view>
							<view class="innerTag viewtxt" v-else-if="item.trialtime  > 0">{{ vuex_config.videoTryTips }}</view>
							<view class="innerTag viptxt" v-else>{{ vuex_config.videoVipTips }}</view>
							<u-image width="100%" height="215rpx" :border-radius="12" :src="item.image" mode="aspectFill"></u-image>
						</view>
						<view class="image" v-else>
							<u-image width="100%" height="215rpx" :border-radius="12" :src="item.image" mode="aspectFill"></u-image>
						</view>
						<view class="cardBox">
							<view class="name">
								{{  item.title }}
							</view>
							<view class="intro">
								<view class="time" v-if="channel1.channel.isAudioShow == 1">
									<u-icon :name="staticurl('course/audioplayer.svg')" size="28"></u-icon>
								</view>
								<view class="viewer">
									<text>{{ item.views }}</text>人{{channel1.channel.viewstips}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		
		</view>
		
		
		<!---->
		<view class="meditationList" v-if="channel3.channel.islist == 1">
			<view class="courseTitle" @click="handleClickMeditation(1)">
				<view class="titleBox">
					<view class="title">
						{{channel3.channel.name || ''}}
					</view>
					<view class="subtitle">
						{{channel3.channel.description || ''}}
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
			
			<view class="listWrap">
				<view class="listInner" v-for="item in channel3.list" :key="item.id" @click="handleClickSound(item)">
					<view class="image" v-if="channel3.channel.istag == 1">
						<view class="innerTag viewtxt" v-if="item.isfree == 0">{{ vuex_config.videoFreeTips }}</view>
						<view class="innerTag viewtxt" v-else-if="item.trialtime  > 0">{{ vuex_config.videoTryTips }}</view>
						<view class="innerTag viptxt" v-else>{{ vuex_config.videoVipTips }}</view>
						<u-image width="100%" height="208rpx" :border-radius="12" :src="item.image" mode="widthFix"></u-image>
					</view>
					<view class="image" v-else>
						<u-image width="100%" height="208rpx" :border-radius="12" :src="item.image" mode="widthFix"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							{{ item.title }}
						</view>
						<view class="intro">
							<view class="time">
								<u-icon :name="staticurl('course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>{{ item.views }}</text>人听过
							</view>
						</view>
					</view>
				</view>
			</view>
		
		</view>
		
		
		<view class="gapline"></view>
		
		<!---->
		<view class="meditationList" v-if="channel4.channel.isnav == 1">
			<view class="courseTitle" @click="handleClickMeditation(24)">
				<view class="titleBox">
					<view class="title">
						{{channel4.channel.name || ''}}
					</view>
					<view class="subtitle">
						{{channel4.channel.description || ''}}
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
		
			<view class="listWrap">
				<view class="listInner" v-for="item in channel4.list" :key="item.id" @click="handleClickVideo(item)">
					<view class="image" v-if="channel4.channel.istag == 1">
						<view class="innerTag viewtxt" v-if="item.isfree == 0">{{ vuex_config.videoFreeTips }}</view>
						<view class="innerTag viewtxt" v-else-if="item.trialtime  > 0">{{ vuex_config.videoTryTips }}</view>
						<view class="innerTag viptxt" v-else>{{ vuex_config.videoVipTips }}</view>
						<u-image width="100%" height="208rpx" :border-radius="12" :src="item.image"
							mode="aspectFill"></u-image>
					</view>
					<view class="image" v-else>
						<u-image width="100%" height="208rpx" :border-radius="12" :src="item.image"
							mode="aspectFill"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							{{ item.title }}
						</view>
						<view class="intro">
							<view class="time" v-if="channel4.channel.isAudioShow == 1">
								<u-icon :name="staticurl('course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>{{ item.views }}</text>人{{channel4.channel.viewstips}}
							</view>
						</view>
					</view>
				</view>
			</view>
		
		</view>
		
		<view class="gapModular"></view>
		
		<fa-tabbar :visible="true"></fa-tabbar>
		
	</view>
</template>

<script>
	import { archives } from '@/common/fa.mixin.js';
	export default {
		mixins: [archives],
		components: {
			
		},
		data()  {
			return {
				showModal: false,
				loading: true,
				status: 'loadmore',
				is_update: false,
				has_more: false,
				current: 0,
				scrollTop: 0,
				navigateList: [],
				hots: [],
				recommends: [],
				channel1: {
					channel: {},
					list: []
				},
				channel2: {
					channel: {},
					list: []
				},
				channel3: {
					channel: {},
					list: []
				},
				channel4: {
					channel: {},
					list: []
				},
				list1: [],
				list2: [],
				list3: [],
				list4: [],
			};
		},
		onLoad(opt) {
			this.initShare()
			if(opt.recdkey){
				this.$u.vuex('vuex_recdkey', opt.recdkey);
			}
			this.queryCategoryLists()
		},
		onShow() {
			if (this.vuex_token) {
				this.getUserIndex();
			}
		},
		computed: {
			
		},
		methods: {
			async queryCategoryLists() {
				let req = await Promise.all([
					this.$api.getCategoryList({
						channel: 3,
						page: 1,
						limit: 2,
						flag: 'hot',
					}),
					this.$api.getCategoryList({
						channel: 2,
						page: 1,
						limit: 2,
						flag: 'hot',
					}),
					this.$api.getCategoryList({
						channel: 1,
						page: 1,
						limit: 2,
						flag: 'hot',
					}),
					this.$api.getCategoryList({
						channel: 24,
						page: 1,
						limit: 2,
						flag: 'hot',
					}),
				])
				this.channel1.channel = req[0].data.channel
				this.channel1.list = req[0].data.pageList.data
				this.channel2.channel = req[1].data.channel
				this.channel2.list = req[1].data.pageList.data
				this.channel3.channel = req[2].data.channel
				this.channel3.list = req[2].data.pageList.data
				this.channel4.channel = req[3].data.channel
				this.channel4.list = req[3].data.pageList.data
			},
			// 分享
			initShare() {
				// #ifdef MP-WEIXIN
				this.$u.mpShare = {
					title: '每日冥想',
					imageUrl: 'https://yanliangliang.com/static/images/mpshare.jpg',
					path: '/pages/course/index'
				};
				// #endif
			},
			
			handleClickVip() {
				if(!this.vuex_token){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				
				uni.navigateTo({
					url: '/pages/vip/activate'
				})
			},
			handleClickColumn() {
				uni.navigateTo({
					url: '/pages/course/column'
				})
			},
			handleClickMeditation(channel) {
				uni.navigateTo({
					url: `/pages/course/meditation?channel=${channel}`
				})
			},
			handleClickDetail(id) {
				// if(!this.vuex_token){
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url: `/pages/course/detail?id=${id}`
				})
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
			handleClickVideo(item) {
				if (item.videourl) {
					uni.navigateTo({
						url: `/pages/course/detail?id=${item.id}`
					})
					return
				}
				uni.navigateTo({
					url: `/pages/course/sound-detail?id=${item.id}`
				})
			},
			//商城自带
			change(e) {
				this.current = e.detail.current;
			},
			grids(e) {
				let path = e.path;
				if (path == '/' || !path) {
					return;
				}
				if (path.substr(0, 1) == 'p') {
					path = '/' + path;
				}
				if (path.includes('http')) {
					this.$u.vuex('vuex_webs', {
						path: e.path,
						title: e.name
					});
					this.$u.route('/pages/webview/webview');
					return;
				}
				this.$u.route(path);
			},
			openPage(index) {
				this.grids({
					path: this.vuex_config.swiper[index].url,
					name: this.vuex_config.swiper[index].title
				});
			},
			click(index) {
				if (this.vuex_config.notice) {
					let url = this.vuex_config.notice[index].path;
					if (url) {
						this.grids({
							path: url,
							name: this.vuex_config.notice[index].title
						});
					}
				}
			},
			getGoodsIndex() {
				this.$api.getGoodsIndex().then(({code,data:res,msg}) => {
					if (code) {
						this.hots = res.hots;
						this.recommends = res.recommends;
					}
				});
			}
		},
		onPullDownRefresh() {
			if (this.vuex_token) {
				this.getUserIndex();
			}
			this.queryCategoryLists()
		},
		onReachBottom() {}
	}
</script>

<style lang="scss" scoped>
	.page{
		background: #fff;
	}
	
	.courseSwiper{
		padding:40rpx 36rpx 30rpx 36rpx;
		/deep/ uni-swiper{
			height:240px!important;
			border-radius: 24rpx;
		}
		/deep/ .u-swiper-indicator{
			justify-content: flex-start!important;
			left: 12px;
			bottom:24px!important;
		}
		/deep/ .u-indicator-item-round {
		    height:4px;
			margin: 0 5px;
		}
		/deep/ .u-list-image-wrap{
			border-radius: 24rpx!important;
		}
		.swiper-item{
			width:100%;
			image{
				width:100%;
				height:100%;
				border-radius: 24rpx;
			}
		}
	}
	
	.gapline{
		height:20rpx;
		background: #fff;
		width:100%;
	}
	
	.gapModular{
		height:80rpx;
		width:100%;
	}
	
	//
	.courseTitle{
		display: flex;
		gap:16rpx;
		margin-bottom:16rpx;
		.titleBox{
			display: flex;
			width:100%;
			.title{
				color:#000000;
				font-size:40rpx;
				font-weight: bold;
				margin-right:16rpx;
			}
			.subtitle{
				font-size:26rpx;
				color:#808080;
				display: flex;
				align-items: flex-end;
				margin-bottom:4rpx;
			}
		}
		.arrowMore{
			display: flex;
			align-items: center;
		}
		
	}
	
	
	
	.courseList{
		padding:40rpx 36rpx 20rpx 36rpx;
		.listWrap{
			.itemCard{
				display: flex;
				gap:40rpx;
				position: relative;
				padding:30rpx 0rpx 40rpx 0rpx;
				margin-bottom:10rpx;
				border-bottom:1px solid #F3F3F3;
				&:nth-last-of-type(1){
					border:none;
				}
				.image{
					width:220rpx;
					height:230rpx;
					position: relative;
				}
				.innerTag{
					position: absolute;
					right:0;
					bottom:-2px;
					z-index: 10;
					font-size:12px;
					padding:6rpx 16rpx;
					background: #000000;
					color:#fff;
					border-top-left-radius: 16rpx;
				}
				.viewtxt{
					
				}
				.viptxt{
					background: #FE8825;
				}
				
				.cardBox{
					margin-top:20rpx;
					.name{
						font-size: 32rpx;
						color:#333333;
						font-weight: bold;
						line-height: 1.5;
						width:90%;
						
					}
				}
				
				.intro{
					color:#b7b7ba;
					display: flex;
					gap:16rpx;
					font-size:28rpx;
					margin-top:30rpx;
					
					.time{
						
					}
					.viewer{
						
					}
				}
				.playBtn{
					position: absolute;
					right:12rpx;
					bottom:40rpx;
					background: #F5F7FA;
					border-radius: 50%;
					width:64rpx;
					height:64rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						
					}
				}
			}
		}
	}
	
	
	
	
	
	//
	.meditationList{
		padding:40rpx 36rpx;
		.listWrap{
			display: flex;
			gap:30rpx 24rpx;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top:40rpx;
		}
		.listInner{
			width:calc(50% - 20rpx);
			position: relative;
			.image{
				width:100%;
				position: relative;
			}
			.innerTag{
				position: absolute;
				right:0;
				bottom:0;
				z-index: 10;
				font-size:12px;
				padding:6rpx 16rpx;
				background: #000000;
				color:#fff;
				border-top-left-radius: 16rpx;
			}
			.viewtxt{
				
			}
			.viptxt{
				background: #FE8825;
			}
			.cardBox{
				padding:16rpx 24rpx 20rpx 24rpx;
				border:1px solid #EDF1F7;
				border-bottom-left-radius: 12rpx;
				border-bottom-right-radius: 12rpx;
				.name{
					font-size: 32rpx;
					color:#333333;
					font-weight: bold;
					line-height: 1.5;
					width:100%;
					height:100rpx;
					white-space: pre-wrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			
			.intro{
				color:#b7b7ba;
				display: flex;
				gap:16rpx;
				font-size:28rpx;
				margin-top:30rpx;
				.time{
					margin-top:4rpx;
				}
			}
		}
	}
	
	.sheepingList{
		padding-right:0px;
		padding-top:0px;
		.courseTitle{
			padding-right:36rpx;
		}
		.listInner{
			width:calc(50% - 60rpx);
		}
	}
	
	

</style>