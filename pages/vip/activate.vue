<template>
	<view class="page">
		<fa-navbar title="开通VIP" :background="{ color: '#fff' }"></fa-navbar>
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
					<view class="label">{{ item.name }}</view>
					<view class="price">{{ item.pricedata[0].price }}元</view>
				</view>
			</view>
		</view>
		<view class="tips">
			特别提示：<br> 1、如遇到问题，点击在线客服沟通；<br> 2、本商品为线上付费线下体验商品，<br> 非虚拟商品。
		</view>

		<view class="btns">
			<view class="btn btn1" @click="handleClickWxPay">
				微信支付
			</view>
			<!-- <view class="btn btn2">
				积分兑换
			</view>
			<view class="tip">
				积分不足？使用或分享小程序获取
			</view> -->
		</view>
	</view>
</template>

<script>
	import { loginfunc } from '@/common/fa.mixin.js';
	
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
			async handleClickWxPay() {
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
					paytype: 'wechat',
					method: 'miniapp',
					openid: this.vuex_openid || "",
					logincode: await this.getMpCode(),
					
				})
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}
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
								console.log(res)
								if (res.errMsg == 'requestSubscribeMessage:ok') {
									this.$api.subscribe({ tpl_ids: res, order_sn: this.order.order_sn, openid: this.vuex_openid }).then(res => {
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
			},
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
		padding: 50rpx 34rpx;

		.btns {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 100rpx;

			.btn {
				width: 648rpx;
				height: 122.73rpx;
				border-radius: 300px;
				margin-bottom: 32rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				font-size: 48rpx;
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

			.tip {
				color: rgb(153, 153, 153);
				font-family: Dream Han Sans CN;
				font-size: 36rpx;
				font-weight: 400;
				line-height: 50rpx;
				letter-spacing: 0px;
				text-align: center;
			}
		}

		.tips {
			margin-top: 200rpx;
			color: rgb(153, 153, 153);
			font-size: 36rpx;
			font-weight: 300;
			line-height: 60rpx;
			letter-spacing: 0px;
			text-align: left;
		}

		.select_vip_box {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 32rpx;
			grid-row-gap: 32rpx;

			&_item {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				border: 4rpx solid rgb(221, 221, 221);
				border-radius: 12rpx;
				padding: 37rpx 0;
				padding-left: 50rpx;
				display: flex;
				position: relative;


				.check {
					width: 50rpx;
					height: 50rpx;
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
					}

					.price {
						color: #F3941E;
					}
				}

				&_left {
					margin-right: 24rpx;

					.radio {
						width: 50rpx;
						height: 50rpx;
						border-radius: 100%;
						border: 3rpx solid #ddd;
					}
				}

				&_right {
					.label {
						color: #333;
						font-size: 38rpx;
						font-weight: 400;
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
						color:#F3941E;
					}
				}
			}
		}
	}
</style>