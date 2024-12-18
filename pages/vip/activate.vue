<template>
	<view class="page">
		<fa-navbar title="开通VIP" :background="{ color: '#fff' }"></fa-navbar>

		<view class="tipBox" v-if="vuex_token && vuex_vipinfo">
			<view class="icon">
				<u-icon name="edit-pen" color="#F3941E" size="45"></u-icon>
			</view>
			<view class="text">
				您当前VIP有效期至：{{ checkVipExpiry() || '已过期'}}
			</view>
		</view>

		<view class="select_vip_box">
			<view class="select_vip_box_item" :class="selectVip == item.points ? 'active' : ''"
				v-for="(item, index) in vipList" :key="item.points" @click="handleClickSelectVip(item)">
				<view class="check">
					<u-icon name="checkbox-mark" color="#fff"></u-icon>
				</view>
				<view class="select_vip_box_item_left">
					<view class="radio">

					</view>
				</view>
				<view class="select_vip_box_item_right">
					<view class="label">{{ item.pricedata[0].days }}天{{ item.name }}</view>
					<view class="price">{{ item.pricedata[0].price }}元</view>
				</view>
			</view>
		</view>
		<view class="tipsTxt">
			特别提示：
			<br> 1、如遇到问题，点击右下角在线客服沟通。
			<br> 2、VIP为线上付费线下体验服务，非虚拟商品。
			<br> 3、10积分可抵扣1元。
		</view>

		<view class="btns">
			<view class="btn btn1" @click="handleClickWxPay('wechat')">
				微信支付
			</view>
			<view class="btn btn2" @click="handleClickWxPay('score')">
				积分兑换
			</view>
			<view class="tiptxt">
				<view>您的当前积分：{{ vuex_user.score }}</view>
				<view></view>
			</view>
		</view>

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
		methods: {
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

		.btns {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 60rpx;

			.btn {
				width: 620rpx;
				height: 100rpx;
				border-radius: 300px;
				margin-bottom: 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 42rpx;
				font-weight: 400;
				line-height: 50rpx;
				letter-spacing: 0px;
				text-align: center;

				&.btn1 {
					background: rgb(243, 148, 30);
					color: rgb(255, 255, 255);
				}

				&.btn2 {
					border: 4rpx solid rgb(243, 148, 30);
					color: rgb(243, 148, 30);
				}
			}

			.tiptxt {
				color: #333;
				// font-family: Dream Han Sans CN;
				font-size: 38rpx;
				font-weight: 54200;
				line-height: 50rpx;
				letter-spacing: 0px;
				text-align: center;
				margin-top: 12rpx;
			}
		}

		.tipBox {
			width: 100%;
			display: flex;
			align-items: center;
			color: #F3941E;
			font-family: 思源黑体;
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


		.tipsTxt {
			margin-top: 60rpx;
			color: #666;
			font-size: 30rpx;
			font-weight: 400;
			line-height: 60rpx;
			letter-spacing: 0px;
			text-align: left;
			padding: 26rpx 50rpx;
		}

		.select_vip_box {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 32rpx;
			grid-row-gap: 32rpx;
			margin: 50rpx 32rpx;

			&_item {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				border: 4rpx solid rgb(221, 221, 221);
				border-radius: 12rpx;
				padding: 37rpx 0;
				padding-left: 20rpx;
				display: flex;
				position: relative;


				.check {
					width: 40rpx;
					height: 40rpx;
					border-radius: 8rpx;
					background-color: rgb(255, 141, 0);
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

					.check {
						display: flex;
					}

					.radio {
						border: 6rpx solid #F3941E;
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
							background-color: #F3941E;
						}
					}

					.label {
						color: #F3941E;
						font-weight: bold;
					}

					.price {
						color: #999;
						font-weight: 500;
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
						text-align: left;
						margin-bottom: 8rpx;
					}

					.price {
						font-size: 34rpx;
						font-weight: 600;
						letter-spacing: 0px;
						text-align: left;
						color: #F3941E;
					}
				}
			}
		}
	}


	.wechatKfLink {
		border: none;
		outline: none;
		box-shadow: none;
		position: fixed;
		bottom: 6vh;
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