<template>
	<view class="page">
		<view class="notice bg-white" v-if="notice.length">
			<u-notice-bar mode="horizontal" type="warning" :duration="5000" :is-circular="false" :autoplay="true" :list="notice" @click="click"></u-notice-bar>
		</view>
		<view class="topView" @click="handleClickNengliang">
			<view class="bg">
				<image :src="vuex_config.homekvBg" mode=""></image>
			</view>
			<view class="person">
				<image :src="vuex_config.homekvManBody" mode="" v-if="vuex_user.gender == 1" ></image>
				<image :src="vuex_config.homekvMadamBody" mode="" v-else-if="vuex_user.gender == 0" ></image>
				<image :src="vuex_config.homekvManBody" mode="" v-else ></image>
			</view>
		</view>
		<view class="content">
			<view class="sanjiaoBox">
				<view class="bgsanjiao">
					<image :src="staticurl('homekvbottom_logo.svg')" mode=""></image>
				</view>
				<view class="text">
					{{vuex_config.title || '宇宙能量疗愈空间'}}
				</view>
			</view>
			<view class="" :data-navigates="navigates" v-if="vuex_config.isGoodsLisHome == 1">
				<swiper class="swiper" @change="change" :style="{ height: (vuex_config.navigate && vuex_config.navigate.length > 6 ? 580 : 360) + 'rpx' }">
					<swiper-item v-for="(res, key) in navigateList" :key="key">
						<u-grid :col="2" hover-class="hover-class">
							<u-grid-item v-for="(item, index) in res" :custom-style="{ padding: '35rpx 0' }" @click="grids(item)" :key="index">
								<u-icon :name="item.image" color="#ffffff" :size="item.size"></u-icon>
								<view class="u-m-t-20">{{ item.name }}</view>
							</u-grid-item>
						</u-grid>
					</swiper-item>
				</swiper>
				<view class="indicator-dots" v-if="navigateList.length > 1">
					<view class="indicator-dots-item" v-for="(res, key) in navigateList" :key="key" :class="[current == key ? 'indicator-dots-active' : '']"></view>
				</view>
			</view>
			<view class="menus">
				<view class="menus-item" @click="handleClickNengliang">
					<view class="icon">
						<image :src="staticurl('energy_logo.png')" mode=""></image>
					</view>
					<view class="label" v-if="!vuex_token">{{ vuex_config.energyButtonNologinTxt}}</view>
					<view class="label" v-else>{{ vuex_config.energyButtonTxtHome || '注入能量'}}</view>
				</view>
				
				<view class="menus-item" v-if="vuex_config.isVipGrade == 1" @click="handleClickVip">
					<view class="icon">
						<image :src="staticurl('vip_icon.png')" mode=""></image>
					</view>
					<view class="label">{{ vuex_config.vipButtonTxtHome || '开通VIP' }}</view>
				</view>
			</view> 
			
			<view class="helpbox"  v-if="vuex_config.isInstructions == 1" @click="goPage('/pages/page/page?diyname=aboutus')">
				<view class="icon">
					<image :src="staticurl('shuoming_icon.png')" mode=""></image>
				</view>
				<view class="helpbox-content">
					眼靓亮使用说明
				</view>
				<view class="rightIcon">
					<image :src="staticurl('shuoming_btn_arrow.png')" mode=""></image>
				</view>
			</view>
		</view>
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
			if(opt.recdkey){
				this.$u.vuex('vuex_recdkey', opt.recdkey);
			}
		},
		onShow() {
			this.getGoodsIndex();
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
		//下拉刷新
		onPullDownRefresh() {},
		onReachBottom() {}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 120rpx;
	}
	.topView {
		width: 100%;
		height: 887rpx;
		position: relative;
		.bg {
			width: 100%;
			height: 100%;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.person {
			position: absolute;
			width: 330rpx;
			height: 688rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.content {
		position: relative;
		top: -4vh;
		padding: 0 30rpx 0 30rpx;
		.sanjiaoBox {
			width: 100%;
			height: 150rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.bgsanjiao {
				width: 400rpx;
				height: 150rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.text {
				position: absolute;
				bottom: -20rpx;
				font-size: 36rpx;
				color: #009E96;
			}
		}
		.menus {
			width:calc(100% - 20rpx);
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 20rpx;
			margin:0 auto;
			margin-top: 40rpx;
			.menus-item {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				border-radius: 12rpx;
				padding: 27rpx 0 27rpx 0;
				&:first-child {
					background: rgb(22, 209, 180);
				}
				&:last-child {
					background: rgb(252, 179, 88);
				}
				.icon {
					width: 88rpx;
					height: 85rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.label {
					color: rgb(255, 255, 255);
					font-family: 思源黑体 CN;
					font-size: 48rpx;
					font-weight: 400;
					line-height: 50rpx;
					letter-spacing: 0px;
					text-align: center;
					margin-top: 15rpx;
				}
			}
		}
		
		.helpbox { 
			width: calc(100% - 20rpx);
			height: 160rpx;
			background-color: #C0EFFF;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			padding: 0 48rpx;
			margin:0rpx auto;
			margin-top: 20rpx;
			.icon {
				width: 100rpx;
				height: 100rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.helpbox-content { 
				color: rgb(51, 51, 51);
				font-family: 思源黑体 CN;
				font-size: 48rpx;
				font-weight: 400;
				display: flex;
				align-items: center;
				flex: 1;
				margin-left: 48rpx;
			}
			
			.rightIcon {
				width: 20rpx;
				height: 40rpx;
				flex-shrink: 0;
				image {
					width: 100%;
					height: 100%;
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
/deep/ .u-icon__img{
	width: 88rpx!important;
	height: 85rpx!important;
	image {
		width: 100%;
		height: 100%;
	}
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
.index-content {
	margin-top: 30rpx;
	background-color: #ffffff;
	.title {
		position: relative;
		padding: 30rpx 50rpx;
		border-bottom: 1px solid #f4f6f8;
		.stroke {
			&::before {
				content: '';
				width: 8rpx;
				height: 30rpx;
				background-color: #374486;
				position: absolute;
				top: 36%;
				left: 30rpx;
				border-radius: 20rpx;
			}
		}
	}
}

.goods-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 30rpx;
	padding: 0 30rpx;
	.item {
		width: calc((100vw - 90rpx) / 2);
		background-color: #ffffff;
		box-shadow: 0px 0px 5px rgb(233, 235, 243);
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		overflow: hidden;
		border: 1px solid #e9ebf3;
		.name {
			min-height: 110rpx;
		}
		.foot {
			padding: 0 15rpx;
		}
		.images {
			width: 100%;
			height: 350rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.market_price {
			text-decoration: line-through;
			margin-left: 10rpx;
		}
	}
}
.hots-list{	
	margin-top: 30rpx;
	padding: 0 30rpx 30rpx;
	.item {
		width: 100%;
		background-color: #ffffff;
		box-shadow: 0px 0px 5px rgb(233, 235, 243);
		margin-bottom: 30rpx;
		border-radius: 10rpx;
		overflow: hidden;
		border: 1px solid #e9ebf3;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.images {
			width: 250rpx;
			height: 220rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.content{
			flex: 1;
			.name {
				min-height: 110rpx;
			}
			.foot {
				padding: 0 15rpx;
			}
			.market_price {
				text-decoration: line-through;
				margin-left: 10rpx;
			}
		}
	}
}
</style>