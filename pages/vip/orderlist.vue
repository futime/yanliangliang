<template>
	<view class="page">
		<fa-navbar title="VIP充值订单" :background="{ background: '#fff' }"></fa-navbar>
		<view class="list">
			<view class="list-item" v-for="item in orderlist" :key="item.id">
				<view class="header">
					<view class="orderid"> {{ item.days }}天{{ item.name }}</view>
					
					<view  v-if="item.status_text == '已支付'">
						<view class="status status_pay">
							{{ item.status_text}}
						</view>
					</view>
					<view  v-else>
						<view class="status">
							{{ item.status_text}}
						</view>
					</view>
					
					
				</view>
				<view class="desc">
					<view class="desc-item">
						<view class="label">创建时间：</view>
						<view class="content">{{ item.createtime }}</view>
					</view>
					<view class="desc-item">
						<view class="label">VIP体验天数：</view>
						<view class="content">{{ item.days }}</view>
					</view>
					<view class="desc-item">
						<view class="label">订单金额：</view>
						<view class="content">{{ item.amount }}元</view>
					</view>
					<view class="desc-item">
						<view class="label">订单号：</view>
						<view class="content order" @click="copyText(item.orderid)">
							{{ item.orderid }}
						</view>
					</view>
				</view>
				<view class="action">
					<view class="copybtn"  @click="copyText(item.orderid)">
						复制订单号
					</view>
					<view class="del" @click="handleClickDel(item)" v-if="item.status == 'created'">
						删除订单
					</view>
				</view>
			</view>
			<view class="more">
				 没有更多了～
			</view>
		</view>
		
		
		<!-- 小程序在线客服 -->
		<button class="wechatKfLink" @click="showModal = true"></button>
		<u-modal v-model="showDel" content="确认取消订单吗？不可恢复哦" @confirm="cancel" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDel: false,
				is_update: false,
				status: 'loadmore',
				has_more: false,
				scrollTop: 0,
				page: 1,
				orderlist: []
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
			if (this.has_more) {
				this.status = 'loading';
				this.page++;
				this.getOrderList();
			}
		},
		onLoad() {
			this.getOrderList();
		},
		methods: {
			getOrderList() {
				this.$api.vipOrderList({
					page: this.page
				}).then(res => {
					if (res.code == 1) {
						if (this.is_update) {
							this.is_update = false;
							this.orderlist = [];
						}
						this.orderlist = [...this.orderlist, ...res.data.list.data];
						if (res.data.list.total == this.orderlist.length) {
							this.has_more = false
						} else {
							this.has_more = true
						}
					}
				});
			},
			handleClickDel(item) {
				this.showDel = true
				this.order_id = item.orderid
			},
			cancel() {
				this.$api.delVipOrder({ orderid: this.order_id }).then(res => {
					this.$u.toast('删除成功！');
					if (res.code) {
						this.orderlist = this.orderlist.filter(item => item.orderid != this.order_id);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 32rpx;
	}
	.list-item {
		border: 1px solid #ddd;
		border-radius: 12rpx;
		padding: 24rpx;
		margin-bottom: 32rpx;
		.header {
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #ddd;
			
			.orderid {
				font-size: 36rpx;
				font-weight: 600;
			}
			
			.status {
				background: none;
				padding: 4rpx 16rpx;
				border:1px solid #F3941E;
				color:#F3941E;
				font-size:32rpx;
				font-weight: 600;
			}
			.status_pay{
				background:#20A53A;
				border:1px solid #20A53A;
				color:#fff;
			}
		}
		
		.desc  {
			padding-top: 20rpx;
			.desc-item{
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #666;
				margin-bottom: 20rpx;
				&:last-child {
					margin-bottom: 0;
				}
				
				.order {
					color:#F28701;
					font-weight: 500;
				}
				.content{
					font-size:30rpx;
					color:#000;
				}
			}
		}
		
		.action { 
			margin-top:40rpx;
			margin-bottom:30rpx;
			display: flex;
			
			.del {
				padding: 6rpx 12rpx;
				background-color: #fff;
				border:1px solid rgba(red,.4);
				color: red;
				font-size:28rpx;
				display: inline-block;
			}
			
			.copybtn{
				font-size:28rpx;
				color:#20A53A;
				border: 1px solid #20A53A;
				padding:6rpx 12rpx;
				margin-left:10rpx;
				margin-right:16rpx;
			}
		}
	}
	.more {
		font-size: 28rpx;
		text-align: center;
		color: #ddd;
	}
	
	.wechatKfLink{
		  border:none;
		  outline:none;
		  box-shadow:none;
		  position: fixed;
		  bottom:6vh;
		  right:30rpx;
		  width:110rpx;
		  height:110rpx;
		  background: url(https://yanliangliang.com/static/images/wechatkf_icon_s2.svg) center center no-repeat;
		  background-size: cover;
		  z-index:5000;
		  &:after{
			  display:none;
		  }
	}
</style>