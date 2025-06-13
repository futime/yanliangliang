<template>
	<view class="page">
		<fa-navbar :title="vuex_config.vipPageTxt || '开通VIP'" :background="{ color: '#fff' }"></fa-navbar>

		<view class="tipBox" v-if="vuex_token && vuex_vipinfo">
			<view class="icon">
				<u-icon name="edit-pen" color="#F3941E" size="45"></u-icon>
			</view>
			<view class="text">
				您当前VIP有效期至：{{ checkVipExpiry() || '已过期'}}
			</view>
		</view>
		
		<view class="selectTipsBox">
			选择会员计划
		</view>

		<view class="select_vip_box">
			<view class="select_vip_box_item" :class="selectVip == item.points ? 'active' : ''"
				v-for="(item, index) in vipList" :key="item.points" @click="handleClickSelectVip(item)">
				<view class="check">
					<u-icon name="checkbox-mark" color="#fff"></u-icon>
				</view>
				<!-- <view class="select_vip_box_item_left">
					<view class="radio">
					</view>
				</view> -->
				<view class="select_vip_box_item_right">
					<view class="label">{{ item.pricedata[0].days }}天{{ item.name }}</view>
					<view class="price">{{ item.pricedata[0].price }}{{ vuex_config.payCurrencyTxt }}</view>
				</view>
			</view>
		</view>
		
		
		<view class="memberbBenefits">
			<view class="titleWrap">
				<view class="title">
					会员专属
				</view>
				<view class="subtitle">
					VIP专属福利
				</view>
			</view>
			
			<view class="benefitsListWrap">
				<view class="benefitsInner">
					<view class="iconImg">
						<u-icon :name="staticurl('/common/benefitsinner_img1.svg')"  size="56" color="#fff"></u-icon>
					</view>
					<view class="titleTxt">
						中医大师亲授古法养生操课程
					</view>
				</view>
				<view class="benefitsInner">
					<view class="iconImg">
						<u-icon :name="staticurl('/common/benefitsinner_img2.svg')" size="56" color="#fff"></u-icon>
					</view>
					<view class="titleTxt">
						匠心打造的能量仓冥想空间
					</view>
				</view>
				<view class="benefitsInner">
					<view class="iconImg">
						<u-icon :name="staticurl('/common/benefitsinner_img3.svg')" size="56" color="#fff"></u-icon>
					</view>
					<view class="titleTxt">
						陪伴放松、专注与助眠的冥想音乐
					</view>
				</view>
				<view class="benefitsInner">
					<view class="iconImg">
						<u-icon :name="staticurl('/common/benefitsinner_img4.svg')" size="56" color="#fff"></u-icon>
					</view>
					<view class="titleTxt">
						好物商城会员享专属商品折扣
					</view>
				</view>
			</view>
		</view>
		
		<view class="tipsTxt">
			特别提示：
			<u-parse :html="vuex_config.vipPageTipsTxt"></u-parse>
		</view>
		
		<view class="bottom-fixed-bar">
			<view class="groupbtns">
				<view class="btn btn1" v-if="vuex_config.isVipPay == 1" @click="handleClickWxPay('wechat')">
					微信支付
				</view>
				<view class="btn btn2" @click="handleClickWxPay('score')">
					积分兑换
				</view>
			</view>
			
			<view class="scoreTipsTxt">
				<view>您当前的积分：{{ vuex_user.score }}</view>
				<view></view>
			</view>
			
		</view>
		
		<view class="gapModular"></view>
		

		<!-- 小程序在线客服 -->
		<button class="wechatKfLink" open-type="contact"></button>
	</view>

</template>

<script>
	import {
		loginfunc
	} from '@/common/fa.mixin.js';

	export default {
		mixins: [loginfunc],
		data() {
			return {
				vipList: [],
				selectVip: '',
				selectVipObj: null
			}
		},
		onLoad() {
			this.queryVips()
		},
		onPullDownRefresh() {
			if (this.vuex_token) {
				this.getUserIndex();
			}
		},
		methods: {
			// #ifdef H5
			async handleClickWxPay(paytype) {
				if (!this.selectVip) {
					uni.showToast({
						title: '请选择会员类型',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中...'
				})
			
				const res = await this.$api.submitOrder({
					level: this.selectVipObj.level,
					days: this.selectVipObj.pricedata[0].days,
					paytype: paytype,
					method: 'H5',
					// openid: this.vuex_openid || "",
					// #ifdef MP-WEIXIN
					// logincode: await this.getMpCode(),
					// #endif
			
				})
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}
			
				if (paytype == 'wechat') {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success: rest => {
							this.$u.toast('支付成功！');
							wx.requestSubscribeMessage({
								tmplIds: this.vuex_config.tpl_ids,
								complete: (res) => {
									if (res.errMsg == 'requestSubscribeMessage:ok') {
										this.$api.subscribe({
											tpl_ids: res,
											order_sn: this.order.order_sn,
											openid: this.vuex_openid
										}).then(res => {
											console.log(res)
										})
									}
									this.$u.route('/pages/vip/orderlist');
								}
							})
						},
						fail: err => {
							this.$u.toast('取消支付！');
							// this.$api.cancelOrder({orderid: })
							// this.$u.toast('fail:' + JSON.stringify(err));
						}
					});
				} else {
					this.$u.toast('兑换成功！')
					this.$u.route('/pages/vip/orderlist');
				}
			
			
			},
			// #endif
			// #ifdef MP-WEIXIN
			async handleClickWxPay(paytype) {
				if (!this.selectVip) {
					uni.showToast({
						title: '请选择会员类型',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中...'
				})

				const res = await this.$api.submitOrder({
					level: this.selectVipObj.level,
					days: this.selectVipObj.pricedata[0].days,
					paytype: paytype,
					method: 'miniapp',
					openid: this.vuex_openid || "",
					// #ifdef MP-WEIXIN
					logincode: await this.getMpCode(),
					// #endif

				})
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}

				if (paytype == 'wechat') {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.data.timeStamp,
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success: rest => {
							this.$u.toast('支付成功！');
							wx.requestSubscribeMessage({
								tmplIds: this.vuex_config.tpl_ids,
								complete: (res) => {
									if (res.errMsg == 'requestSubscribeMessage:ok') {
										this.$api.subscribe({
											tpl_ids: res,
											order_sn: this.order.order_sn,
											openid: this.vuex_openid
										}).then(res => {
											console.log(res)
										})
									}
									this.$u.route('/pages/vip/orderlist');
								}
							})
						},
						fail: err => {
							this.$u.toast('取消支付！');
							// this.$api.cancelOrder({orderid: })
							// this.$u.toast('fail:' + JSON.stringify(err));
						}
					});
				} else {
					this.$u.toast('兑换成功！')
					this.$u.route('/pages/vip/orderlist');
				}


			},
			// #endif
			// #ifdef APP
			async handleClickWxPay() {
				let appid = plus.runtime.appid;
				
				let res = await this.$api.payment({
					order_sn: this.order_sn,
					paytype: this.paytype,
					method: 'app',
					appid: appid
				});
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}
				uni.requestPayment({
					provider: this.paytype == 'alipay' ? 'alipay' : 'wxpay',
					orderInfo: res.data, //微信、支付宝订单数据
					success: function(rest) {
						this.$u.toast('支付成功！');
						this.$u.route('/pages/order/list');
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			// #endif
			handleClickSelectVip(item) {
				this.selectVip = item.points
				this.selectVipObj = item
			},
			async queryVips() {
				const res = await this.$api.getVipBuyList()
				this.vipList = res.data.vipList
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.page {
		padding: 0rpx 0rpx;

		
		
		.tiptxt {
			color: #333;
			font-size: 32rpx;
			font-weight: 54200;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: center;
			margin-top: 12rpx;
		}
		
		.selectTipsBox{
			text-align: center;
			margin:40rpx 0rpx 0rpx 0rpx;
			color:#CCCCCC;
			font-size:32rpx;
		}

		.tipBox {
			width: 100%;
			display: flex;
			align-items: center;
			color: #F3941E;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 43rpx;
			letter-spacing: 0px;
			text-align: left;
			background: rgb(253, 241, 225);
			padding: 26rpx 50rpx;

			.icon {
				margin-right: 10rpx;
			}
		}



		.select_vip_box {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 32rpx;
			grid-row-gap: 32rpx;
			margin: 40rpx 32rpx 50rpx 32rpx;

			&_item {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				border: 4rpx solid rgb(221, 221, 221);
				border-radius: 12rpx;
				padding: 37rpx 0;
				padding-left: 0rpx;
				display: flex;
				position: relative;
				justify-content: center;

				.check {
					width: 40rpx;
					height: 40rpx;
					border-radius: 8rpx;
					background-color: #12A89D;
					background: linear-gradient(3.93deg, rgb(247, 198, 72),rgb(233, 99, 164));
					position: absolute;
					border-top-left-radius: 0;
					border-bottom-right-radius: 0;
					top: 0;
					right: 0;
					display: none;
					justify-content: center;
					align-items: center;
				}
				
				

				&.active {
					border: 4rpx solid #F3941E;
					background: #FFF7EE;
					.check {
						display: flex;
					}
					
					/deep/ .u-icon__icon{
					    color:#fff!important;
					}

					.radio {
						border: 6rpx solid #12A89D;
						position: relative;

						&:before {
							content: '';
							position: absolute;
							width: 100%;
							height: 100%;
							left: 0;
							top: 0;
							border-radius: 100%;
							box-sizing: border-box;
							border: 6rpx solid #fff;
							background-color: #12A89D;
							
						}
					}

					.label {
						color: #000;
						font-weight: bold;
					}

					.price {
						color: #F3941E;
						font-weight:700;
					}
				}

				&_left {
					margin-right: 16rpx;

					.radio {
						width: 50rpx;
						height: 50rpx;
						border-radius: 100%;
						border: 3rpx solid #ddd;
					}
				}

				&_right {
					.label {
						color: #000;
						font-size: 36rpx;
						font-weight: 00;
						line-height: 50rpx;
						letter-spacing: 0px;
						text-align: center;
						margin-bottom: 8rpx;
					}

					.price {
						font-size: 34rpx;
						font-weight: 600;
						letter-spacing: 0px;
						color: #F3941E;
						text-align: center;
					}
				}
			}
		}
	}
	

	.bottom-fixed-bar {
		  position: fixed;
		  left: 0;
		  right: 0;
		  bottom: 0;
		  z-index: 999;
		  background: #fff;
		  color: #fff;
		  padding: 0rpx 32rpx 80rpx 32rpx;
		  box-sizing: border-box;
		  height: 220rpx;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  border-top: 1px solid #f5f5f5;
	}
	
	
	.tipsTxt {
		margin-top: 30rpx;
		color: #999999;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 56rpx;
		letter-spacing: 0px;
		text-align: left;
		padding: 16rpx 50rpx;
	}
	
	
	.gapModular{
		height:360rpx;
		width:100%;
	}
	
	.groupbtns {
		width: 100%;
		display: flex;
		align-items: center;
		margin-top: 60rpx;
		gap:12rpx;
		.btn {
			width: 50%;
			height: 100rpx;
			border-radius: 300px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: center;
			&.btn1 {
				background:#24C88A;
				color: rgb(255, 255, 255);
			}
	
			&.btn2 {
				border: 4rpx solid #24C88A;
				color:#24C88A;
			}
		}
	}
	
	
	.memberbBenefits{
		margin:80rpx 36rpx;
		.titleWrap{
			display: flex;
			justify-content: space-between;
			width:100%;
			margin-bottom:32rpx;
			.title{
				color:#000;
				font-size:36rpx;
				font-weight: 500;
			}
			.subtitle{
				color:#D0A860;
				font-size:30rpx;
				font-weight: 500;
			}
		}
	}
	
	
	.benefitsListWrap{
		background: #FBF8F3;
		padding:40rpx 40rpx;
		display: flex;
		gap:12rpx 0rpx;
		flex-direction: column;
		.benefitsInner{
			display:flex;
			align-items: center;
			gap:0rpx 24rpx;
			.iconImg{
				
			}
			.titleTxt{
				color:#252524;
				font-size:30rpx;
			}
		}
	}
	
	
	.scoreTipsTxt{
		color:#999;
		margin-top:16rpx;
	}
	

	.wechatKfLink {
		border: none;
		outline: none;
		box-shadow: none;
		position: fixed;
		bottom: 15vh;
		right: 30rpx;
		width: 110rpx;
		height: 110rpx;
		background: url(https://yanliangliang.com/static/images/wechatkf_icon_s2.svg) center center no-repeat;
		background-size: cover;
		z-index: 5000;

		&:after {
			display: none;
		}
	}
</style>