<template>
	<view class="page">
		<fa-navbar title=" " :background="{ background: scrollTop > 800 ? '#fff' : 'transparent' }" :borderBottom="false"
		:autoBack="true" title-color="#fff" :is-back="true"></fa-navbar>
		
		<view class="columnKv">
			<view class="pageThumbnail">
				<u-image width="100%" :src="staticurl('/course/columnpage_kvbg.jpg')" mode="widthFix" class="image"></u-image>
			</view>
			<view class="conDesc">
				<view class="titleWrap">
					<view class="titleTxt">
						古法健身 升陽补炁操
					</view>
					<view class="introDesc">
						<text>主讲人：宋连喜</text>
						<text>播放量：3578</text>
					</view>
				</view>
				<view class="btnBox">
					<!-- <u-icon :name="staticurl('/course/playerbtn.svg')" size="56"></u-icon> -->
				</view>
			</view>
		</view>
		
		
		<view class="columnIntroWrap">
			<view class="introTitle">
				<view class="titleBox">
					<view class="title">
						专栏内容
					</view>
					<view class="subtitle">
						主讲人介绍
					</view>
				</view>
				
				<view class="introduce">
					<text>
						上海交通大学传统中医药挖掘与传承创新中心特别研究员，中医火灸工作室首席传承人，中医火灸炁疗技术传承人，出身医学世家，祖母为清朝太医，受父亲影响，自小喜爱武术钻研道家功法。80年代起，在全国各地行医传道，90年代曾做过高层领导的保健医生。具备五十年以上的中医临床治疗经验。多年来，宋连喜以其独特的中医火灸炁疗技术，结合深厚的道家功法，在骨科(椎间盘疾病)、神经科、妇科等(中风、脑血管疾病)领域取得显著疗效。
					</text>
				</view>
			</view>
		</view>
		
		
		<view class="gapline"></view>
		
		<view class="courseList">
			<view class="courseTitle">
				<view class="titleBox">
					<view class="title">
						专栏内容
					</view>
				</view>
			</view>
			
			<view class="listWrap">
				<WCard1 v-for="(item, index) in categoryData" :key="item.id" :detail="item"></WCard1>
				
				<view class="itemCard" @click="handleClickDetail">
					<view class="image">
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
		
		
		<view class="gapModular"></view>
		
		<fa-tabbar :visible="true"></fa-tabbar>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data()  {
			return {
				scrollTop: 0,
				categoryData: [
					
				],
			};
		},
		onLoad(opt) {
			
		},
		onShow() {
			
		},
		computed: {
			
		},
		methods: {
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
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
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
	
	/deep/ .u-back-wrap{
		.u-icon-wrap{
			width:60rpx;
			height:60rpx;
			background: rgba(0,0,0,.3);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			.u-icon__icon,.u-iconfont{
				font-size:18px!important;
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
	
	
	.columnKv{
		position: relative;
		top:0;
		bottom: 0;
		z-index: 1;
		margin-top:-186rpx;
		// #ifdef H5
		margin-top:-44px;
		// #endif
		.pageThumbnail{
			.image{
				width:100%;
				height:100%;
				position: relative;
			}
			
			&:before{
				position: absolute;
				top:0rpx;
				width:100%;
				height:calc(100% - 4rpx);
				z-index: 10;
				content:'';
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%,  rgba(0, 0, 0, 0) 12%,rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%);
			}
		}
		
		.conDesc{
			width: 100%;
			position: absolute;
			bottom:0px;
			padding:0rpx 40rpx 80rpx 40rpx;
			z-index: 50;
			.titleWrap{
				color:#fff;
				.titleTxt{
					color:#fff;
					font-size:42rpx;
					font-weight: bold;
					margin-bottom:20rpx;
				}
				.introDesc{
					display:flex;
					gap:24rpx;
					font-size:26rpx;
				}
			}
			.btnBox{
				position: absolute;
				right:40rpx;
				bottom:72rpx;
			}
		}
	}
	
	//
	
	.columnIntroWrap{
		padding:40rpx 36rpx 60rpx 36rpx;
		.introTitle{
			.titleBox{
				display: flex;
				width:100%;
				margin-bottom:40rpx;
				justify-content: space-between;
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
			.introduce{
				font-size:26rpx;
				color:#595959;
				line-height: 1.8;
			}
		}
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
		padding:42rpx 36rpx 40rpx 36rpx;
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
	
	

</style>