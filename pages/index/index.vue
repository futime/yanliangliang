<template>
	<view class="page">
		<view class="notice bg-white" v-if="notice.length">
			<u-notice-bar mode="horizontal" type="warning" :duration="5000" :is-circular="false" :autoplay="true" :list="notice" @click="click"></u-notice-bar>
		</view>
		
		
		<view class="topBanner" @click="handleClickNengliang">
			<view class="bannerWrap">
				<view class="welcomeSlogan">
					<text>hi,早上好</text>
				</view>
				<view class="conIntro">
					<view class="titleBox">
						<view class="title">每日放松<br>冥想</view>
						<view class="subtitle">告别僵硬酸痛<br>重塑健康体态</view>
					</view>
				</view>
				<view class="imgBg">
					<image :src="staticurl('/common/indexbanng_bg.jpg')" mode="widthFix"></image>
				</view>
			</view>
		</view>
		
		
		<view class="pageContent">
			<view class="spaceLinkBox">
				<view class="spaceDesc">
					<view class="titleBox">
						<text class="title">能量炁疗 解压放松</text>
						<text class="subtitle">感受自然能量 舒缓身体疼痛</text>
					</view>
					<view class="spaceBtn">
						<text>进入能量仓</text>
					</view>
				</view>
				<view class="spaceImg">
					<u-image width="100%" height="260rpx" :src="staticurl('/common/spacerecom_body.png')" mode="aspectFit"></u-image>
				</view>
			</view>
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
		
		<fa-tabbar></fa-tabbar>
		<!-- <faTabbarVue></faTabbarVue> -->
	</view>
</template>

<script>
	// import faTabbarVue from '@/components/fa-tabbar/index.vue'
	export default {
		// components: {
		// 	faTabbarVue
		// },
		data()  {
			return {
				loading: true,
				status: 'loadmore',
				is_update: false,
				has_more: false,
				current: 0,
				scrollTop: 0,
				navigateList: [],
				hots: [],
				recommends: []
			};
		},
		onLoad(opt) {
			this.initShare()
			if(opt.recdkey){
				this.$u.vuex('vuex_recdkey', opt.recdkey);
			}
		},
		onShow() {
			this.getGoodsIndex();
			
			if (this.vuex_token) {
				this.getUserIndex();
			}
		},
		computed: {
			notice() {
				let arr = [];
				if (this.vuex_config.notice) {
					this.vuex_config.notice.map(item => {
						arr.push(item.title);
					});
				}
				return arr;
			},
			navigates() {
				if (this.vuex_config.navigate) {
					let arr1 = [],
						arr2 = [];
					this.vuex_config.navigate.forEach((item, index) => {
						if (((index + 1) % 9 == 0 && index != 0) || index + 1 == this.vuex_config.navigate.length) {
							arr2.push(item);
							arr1.push(arr2);
							arr2 = [];
						} else {
							arr2.push(item);
						}
					});
					this.navigateList = arr1;
				}
				return 1;
			}
		},
		methods: {
			getRemainingTime(targetTime, level) {
				// 将目标时间转换为 Date 对象，假设传入的时间格式是 "yyyy-MM-dd HH:mm:ss"
				const targetDate = new Date(targetTime.replace(/-/g, "/")); // 替换日期中的 "-" 以兼容 Date 解析
				// 获取当前时间
				const currentTime = new Date();
				// 计算时间差（单位：毫秒）
				const timeDifference = targetDate - currentTime;
				// 如果目标时间已过，返回 "已过期"
				if (timeDifference < 0) {
					return false;
				}
				// 计算剩余的小时
				const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60)); // 转换为小时
				// 返回剩余的小时，如果为 0 则不显示
				if(hoursRemaining > 0){
					return true
				}else{
					return false
				} 
			},
			handleClickNengliang() {
				if(!this.vuex_token){
					uni.navigateTo({
						url: '/pages/login/login?redirect=/pages/space/start'
					})
					return
				}
				if(!this.vuex_user.nickname || !this.vuex_user.age) {
					uni.reLaunch({
						url: '/pages/my/profile-add?isnew=true'
					})
					return
				}
				try {
					const flag = this.getRemainingTime(this.vuex_vipinfo.expiredate, this.vuex_vipinfo.level)
					if(flag) {
						uni.navigateTo({
							url: '/pages/space/start'
						})
					}else{
						uni.showModal({
							title: '提示',
							content: `您的体验时间已到期，请开通VIP`,
							cancelText: '再想想',
							confirmText: '去开通',
							success: async function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/vip/activate'
									})
								}
							},
						});
					}
				}catch {
					uni.showModal({
						title: '提示',
						content: `您的体验时间已到期，请开通VIP`,
						cancelText: '再想想',
						confirmText: '去开通',
						success: async function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/vip/activate'
								})
							}
						},
					});
				}
				
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
		},
		onReachBottom() {}
	}
</script>

<style lang="scss" scoped>
	
.page {
	
}

.topBanner {
	width: 100%;
	position: relative;
	z-index: 5;
	.bannerWrap{
		position: relative;
		.welcomeSlogan{
			position: absolute;
			z-index: 120;
			top:120rpx;
			left:36rpx;
			// #ifdef H5
			top:2vh;
			// #endif
			color:#fff;
			font-size: 30rpx;
		}
		.conIntro{
			position: absolute;
			z-index: 100;
			padding:0rpx 80rpx 0rpx 80rpx;
			top:240rpx;
			.titleBox{
				display: flex;
				flex-direction: column;
				.title{
					color:#fff;
					margin-bottom:24rpx;
					font-size:64rpx;
					line-height: 76rpx;
					font-weight: bold;
				}
				.subtitle{
					color:rgba(255,255,255,.8);
					font-size:34rpx;
					line-height: 56rpx;
				}
			}
		}
		.imgBg{
			width:100%;
			position: relative;
			z-index: 10;
			image{
				width:100%;
				height:100%;
			}
		}
	}
	
	
}

.pageContent {
	position: relative;
	padding: 0 36rpx;
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	z-index: 10;
	margin-top:-60px;
	background: #fff;
	padding-top:60rpx;
}

.gapline{
	height:30rpx;
	width:100%;
}

.gapModular{
	height:40rpx;
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


.spaceLinkBox{
	display: flex;
	justify-content: space-between;
	background: #E5F3F5;
	border-radius: 24rpx;
	padding:30rpx 20rpx 0rpx 40rpx;
	padding-top:60rpx;
	.spaceDesc{
		padding-bottom:40rpx;
		.titleBox{
			display: flex;
			flex-direction: column;
			.title{
				color:rgba(0,0,0,.8);
				font-size:42rpx;
				font-weight: 600;
				margin-bottom:16rpx;
				
			}
			.subtitle{
				color:rgba(0,0,0,.4);
				font-size:26rpx;
				
			}
		}
		.spaceBtn{
			font-size:28rpx;
			color:#fff;
			background: #12A89D;
			width:220rpx;
			height:68rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 60px;
			margin-top:40rpx;
			
		}
	}
	.spaceImg{
		width:40%;
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
	padding:60rpx 36rpx;
	border-top: 1px solid #f3f3f3;
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


//
/deep/ uni-swiper,/deep/ swiper{
	height:125px!important;
	margin-top:22px;
}
/deep/ .u-grid-item{
	padding:0rpx 8rpx;
}
/deep/ .u-grid-item-box{
	background: #16D1B4!important;
	border-radius: 12rpx;
	color:#fff!important;
	font-size:46rpx!important;
	font-family: 思源黑体 CN;
	font-weight: 400!important;
	line-height: 27px;
	letter-spacing: 0px;
	text-align: center;
	margin-top: 8px;
}
/deep/ .u-grid-item:nth-of-type(2) .u-grid-item-box{
	background: #FCB358!important;
}


	
//框架自带
.indicator-dots {
	display: flex;
	justify-content: center;
	align-items: center;
}

.indicator-dots-item {
	background-color: $u-tips-color;
	height: 6px;
	width: 6px;
	border-radius: 10px;
	margin: 0 3px;
}

.indicator-dots-active {
	background-color: $u-type-primary;
}
.notice {
	
}
</style>