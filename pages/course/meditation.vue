<template>
	<view class="page">
		<fa-navbar title="冥想疗愈" :background="{ background: scrollTop > 40 ? '#fff' : '#fff' }" :borderBottom="false"></fa-navbar>
		
		<!---->
		<view class="meditationList">
			<view class="courseTitle">
				<view class="titleBox">
					<view class="title">
						冥想疗愈
					</view>
					<view class="subtitle">
						能量吸引，补炁养神
					</view>
				</view>
			</view>
			
			<view class="listWrap">
				<view class="listInner" @click="handleClickSound">
					<view class="image">
						<u-image width="100%" height="214rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img1.jpg')" mode="aspectFit"></u-image>
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
						<u-image width="100%" height="214rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img2.jpg')" mode="aspectFit"></u-image>
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
						<u-image width="100%" height="214rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img3.jpg')" mode="aspectFit"></u-image>
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
						<u-image width="100%" height="214rpx" :border-radius="12" :src="staticurl('/course/meditationlist_img4.jpg')" mode="aspectFit"></u-image>
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
			handleClickSound() {
				// if(!this.vuex_token){
				// 	uni.navigateTo({
				// 		url: '/pages/login/login'
				// 	})
				// 	return
				// }
				uni.navigateTo({
					url: '/pages/course/sound-detail'
				})
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