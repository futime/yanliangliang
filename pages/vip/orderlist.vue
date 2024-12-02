<template>
	<view class="page">
		<fa-navbar title="订单列表" :background="{ background: '#fff' }"></fa-navbar>
		<view class="list">
			<view class="list-item" v-for="item in orderlist" :key="item.id">
				<view class="header">
					<view class="orderid"> {{ item.name }}</view>
					<view class="status">
						{{ item.status_text}}
					</view>
				</view>
				<view class="desc">
					<view class="desc-item">
						<view class="label">创建时间：</view>
						<view class="content">{{ item.createtime }}</view>
					</view>
					<view class="desc-item">
						<view class="label">会员天数：</view>
						<view class="content">{{ item.days }}</view>
					</view>
					<view class="desc-item">
						<view class="label">下单金额：</view>
						<view class="content">{{ item.amount }}元</view>
					</view>
					<view class="desc-item">
						<view class="label">订单号：</view>
						<view class="content order" @click="copyText(item.orderid)">{{ item.orderid }}</view>
					</view>
				</view>
				<view class="action" v-if="item.status == 'created'">
					<view class="del" @click="handleClickDel(item)">
						删除订单
					</view>
				</view>
			</view>
			<view class="more">
				 没有更多了～
			</view>
		</view>
		<u-modal v-model="showDel" content="确认取消订单吗？" @confirm="cancel" :show-cancel-button="true"></u-modal>
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
				font-size: 32rpx;
			}
			
			.status {
				background-color: rgba(rgb(243, 148, 30), 0.2);
				padding: 4rpx 12rpx;
				color: rgb(243, 148, 30);
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
					color: rgba(blue, 0.4);
				}
			}
		}
		
		.action { 
			padding-top: 20rpx;
			
			.del {
				padding: 6rpx 12rpx;
				background-color: rgba(red, 0.2);
				color: red;
				display: inline-block;
			}
		}
	}
	.more {
		font-size: 28rpx;
		text-align: center;
		color: #ddd;
	}
</style>