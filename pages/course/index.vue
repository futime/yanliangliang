<template>
	<view class="page">
		<fa-navbar title="每日冥想" :background="{ background: scrollTop > 40 ? '#fff' : '#fff' }" :borderBottom="false"></fa-navbar>
		
		
		<view class="courseSwiper">
			<u-swiper :list="vuex_config.swiper" :height="350" @click="openPage"></u-swiper>
		</view>
		
		<view class="gapline"></view>
		
		<view class="courseList">
			<view class="courseTitle" @click="handleClickColumn">
				<view class="titleBox">
					<view class="title">
						大师养生课
					</view>
					<view class="subtitle">
						中医大师亲授
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('/course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
			
			<view class="listWrap">
				<WCard1 v-for="(item, key, index) in recommend" :key="key" :detail="item"></WCard1>
					
				<view class="itemCard" @click="handleClickDetail">
					<view class="image">
						<view class="innerTag viewtxt">试看</view>
						<u-image width="100%" height="240rpx" :border-radius="12" :src="staticurl('/course/courseinner_img1.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							古法养生操 · 缓解肩颈僵硬
						</view>
						<view class="intro">
							<view class="time">
								<text>4</text>分钟
							</view>
							<view class="viewer">
								<text>528</text>人看过
							</view>
						</view>
						<view class="playBtn">
							<u-icon :name="staticurl('/course/player_gray.svg')" size="32"></u-icon>
						</view>
					</view>
				</view>
				<view class="itemCard" @click="handleClickDetail">
					<view class="image">
						<view class="innerTag viptxt">VIP</view>
						<u-image width="100%" height="240rpx" :border-radius="12" :src="staticurl('/course/courseinner_img2.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							宫廷秘传古法养生操
						</view>
						<view class="intro">
							<view class="time">
								<text>4</text>分钟
							</view>
							<view class="viewer">
								<text>528</text>人看过
							</view>
						</view>
						<view class="playBtn">
							<u-icon :name="staticurl('/course/player_gray.svg')" size="32"></u-icon>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="gapline"></view>
		
		<!---->
		<view class="meditationList">
			<view class="courseTitle" @click="handleClickMeditation">
				<view class="titleBox">
					<view class="title">
						冥想疗愈
					</view>
					<view class="subtitle">
						能量吸引，补炁养神
					</view>
				</view>
				<view class="arrowMore">
					<u-icon :name="staticurl('/course/morearrow.svg')" size="28"></u-icon>
				</view>
			</view>
			
			<view class="listWrap">
				<view class="listInner" @click="handleClickSound">
					<view class="image">
						<view class="innerTag viewtxt">免费</view>
						<u-image width="100%" height="220rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img1.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							财富丰盈冥想
						</view>
						<view class="intro">
							<view class="time">
								<u-icon :name="staticurl('/course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>435</text>人听过
							</view>
						</view>
					</view>
				</view>
				<view class="listInner" @click="handleClickSound">
					<view class="image">
						<view class="innerTag viewtxt">免费</view>
						<u-image width="100%" height="220rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img2.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							缓解焦虑-减压放松
						</view>
						<view class="intro">
							<view class="time">
								<u-icon :name="staticurl('/course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>435</text>人听过
							</view>
						</view>
					</view>
				</view>
				<view class="listInner" @click="handleClickSound">
					<view class="image">
						<view class="innerTag viptxt">VIP</view>
						<u-image width="100%" height="220rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img3.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							晚安好眠冥想
						</view>
						<view class="intro">
							<view class="time">
								<u-icon :name="staticurl('/course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>384</text>人听过
							</view>
						</view>
					</view>
				</view>
				<view class="listInner" @click="handleClickSound">
					<view class="image">
						<view class="innerTag viptxt">VIP</view>
						<u-image width="100%" height="220rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img4.jpg')" mode="aspectFit"></u-image>
					</view>
					<view class="cardBox">
						<view class="name">
							自然能量呼吸冥想
						</view>
						<view class="intro">
							<view class="time">
								<u-icon :name="staticurl('/course/audioplayer.svg')" size="28"></u-icon>
							</view>
							<view class="viewer">
								<text>145</text>人听过
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
				scrollTop: 0,
			};
		},
		onLoad(opt) {
			this.initShare()
		},
		onShow() {
			
		},
		computed: {
			
		},
		methods: {
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
			
			handleClickColumn() {
				uni.navigateTo({
					url: '/pages/course/column'
				})
			},
			handleClickMeditation() {
				uni.navigateTo({
					url: '/pages/course/meditation'
				})
			},
			handleClickDetail() {
				// if(!this.vuex_token){
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url: '/pages/course/detail'
				})
			},
			handleClickSound() {
				uni.navigateTo({
					url: '/pages/course/sound-detail'
				})
			},
			openPage(index) {
				let path = this.bannerList[index].url;
				if (path == '/' || !path) {
					return;
				}
				if (['p', 'i', 'o'].includes(path.substr(0, 1))) {
					path = '/' + path;
				}
				if (path.indexOf('http') != -1) {
					this.$u.vuex('vuex_webs', {
						title: this.bannerList[index].title,
						path: this.bannerList[index].url + '?source=miniapp',
					});
					path = '/pages/webview/webview';
				}
				let data = {},
					arr = path.split('?');
				if (arr[1]) {
					let q = arr[1].split('&');
					for (let item of q) {
						let param = item.split('=');
						data[param[0]] = param[1];
					}
				}
				this.$u.route(arr[0], data);
			},
		},
		onPullDownRefresh() {
			
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
		background: #F7F9FC;
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
				font-size:28rpx;
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
		padding:40rpx 36rpx;
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
					height:240rpx;
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
				height:214rpx;
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
					height:80rpx;
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
	

</style>