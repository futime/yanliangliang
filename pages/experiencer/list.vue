<template>
	<view class="page">
		<fa-navbar title="体验者列表" :borderBottom="true"></fa-navbar>
		
		
		<view class="tipBox notipBox" v-if="!load && !list.length">
			<view class="icon">
				<u-icon name="edit-pen" color="#F3941E" size="45"></u-icon>
			</view>
			<view class="text">
				请先点击添加按钮，完成后进入能量空间
			</view>
		</view>
		
		<view class="tipBox" v-else>
			<view class="icon">
				<u-icon name="bookmark" color="#F3941E" size="55"></u-icon>
			</view>
			<view class="text">
				添加完资料后，点击选择按钮进入能量空间
			</view>
		</view>
		
		<view class="empty" v-if="!load && !list.length">
			<image :src="staticurl('nodata_icon.png')" mode=""></image>
			<view style="font-size: 38rpx; color: #666;">
				暂无数据
			</view>
		</view>
		<view class="listBox">
			<view class="listItem" v-for="(item, index) in list" :key="index">
				<view class="listItem-content" @click="handleClickSelect(item.id)">
					<view class="userinfo">
						<view class="name">{{ item.name }}</view>
						<view class="phone">{{ item.phone }}</view>
					</view>
					<view class="icon">
						<u-icon name="arrow-right" color="#999999" size="40"></u-icon>
					</view>
				</view>
				<view class="listItem-action">
					<view class="left">
						<view class="buttonitem select" @click="handleClickSelect(item.id)">选择</view>
					</view>
					<view class="right">
						<view class="buttonitem del" @click="handleClickDel(item.id)">删除</view>
						<view class="buttonitem edit" @click="handleClickAdd(item)">编辑</view>
					</view>
				</view>
			</view>

			<view class="tishi">
				<view class="tishititle">
					温馨提示:
				</view>
				<view class="desc">
					<text>1. 体验者信息仅用于平台能量空间体验服务，<br>不会外传，请您填写真实个人资料。<br> </text>
					<text>2. 为确保数据准确性，建议上传体验者照片，<br>添加体验者时，请确认信息无误后再提交。 </text>
				</view>
			</view>
		</view>

		<view class="btnGroup">
			<view class="addbottom" @click="handleClickAdd">
				<view class="icon">
					<image :src="staticurl('adduser_icon.png')" mode=""></image>
				</view>
				<view class="text">
					新增体验者资料
				</view>
			</view>
			<view class="addbtnTips"><text></text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectColor: {
					color: 'rgb(243, 148, 30)'
				},
				list: [],
				load: true
			}
		},
		onLoad() {
			this.getList()
		},
		onShow() {
			this.getList()
		},
		methods: {
			handleClickSelect(id) {
				uni.redirectTo({
					url: '/pages/space/index?userid=' + id
				})
			},
			handleClickDel(id) {

				uni.showModal({
					title: '提示',
					content: '确认删除吗？',
					success: async (res) => {
						if (res.confirm) {
							this.$api.deletepatient({
								id
							}).then(res => {
								if (!res.code) {
									this.$u.toast(res.msg);
								}
								this.$u.toast('操作成功');
								this.getList()
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			async getList() {
				this.load = true
				const res = await this.$api.listpatient()
				this.list = res.data
				this.load = false
			},
			handleClickAdd(item) {
				if (item) {
					this.$u.route('/pages/experiencer/add', {
						...item
					});
					return
				}
				uni.navigateTo({
					url: '/pages/experiencer/add'
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F6F8FB;
	}
</style>
<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 180rpx;
	}

	.tipBox {
		width:100%;
		display: flex;
		align-items: center;
		color: #F3941E;
		font-family: 思源黑体;
		font-size: 30rpx;
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
	
	.notipBox{
	
	}
	
	.empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items:  center;
		image {
			width: 300rpx;
			height: 300rpx;
			margin-bottom: 40rpx;
		}
	}

	.listBox {
		width: 100%;
		padding: 40rpx 40rpx;
		
		

		.listItem {
			padding: 20rpx;
			border-radius: 20rpx;
			box-shadow: 0px 4rpx 4rpx 2rpx rgba(0, 0, 0, 0.08);
			background: rgb(255, 255, 255);
			margin-bottom: 40rpx;

			.listItem-content {
				display: flex;
				justify-content: space-between;
				align-items: center;

				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				padding-bottom: 30rpx;

				.userinfo {
					color: rgb(0, 0, 0);
					font-family: Arial;
					font-size: 38rpx;
					font-weight: 400;
					line-height: 44rpx;
					letter-spacing: 0%;
					text-align: left;
					color: rgb(85, 99, 111);

					.name {
						margin-bottom: 20rpx;
					}

					.phone {
						font-size: 32rpx;
					}
				}
			}

			.listItem-action {
				padding-top: 20rpx;
				display: flex;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;
					justify-content: flex-start;
				}

				.right {
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				.buttonitem {
					margin-right: 30rpx;
					// width: 122rpx;
					padding: 20rpx;
					height: 70rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					box-sizing: border-box;
					border: 1px solid rgba(0, 0, 0, 0.2);
					color: rgb(102, 102, 102);
					border-radius: 8rpx;

					&.select {
						border: 2px solid rgb(243, 148, 30);
						color: rgb(243, 148, 30);
						padding:0rpx 36rpx;
						font-size:30rpx;
						line-height: 70rpx;
					}

					&.del {
						color: #d8d8d8;
						border: 1px solid #d8d8d8;
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}

	.tishi {
		margin-top: 80rpx;

		.tishititle {
			color: #666;
			font-size: 36rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: left;
			margin-bottom: 20rpx;
		}

		.desc {
			color: #666;
			font-size: 32rpx;
			font-weight: 400;
			line-height: 1.8;
			letter-spacing: 0px;
			text-align: left;

			text {
				display: block;
				margin-bottom: 12rpx;
			}
		}
	}

	.btnGroup {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0vh;
		left: 0px;
		height: 180rpx;
		background: #fff;
		flex-direction: column;
	}
	
	.addbtnTips{
		
	}

	.addbottom {
		width: 80%;
		height: 123rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #F3941E;
		border-radius: 100rpx;
		margin: 0 50rpx;

		.icon {
			width: 45rpx;
			height: 48rpx;
			margin-right: 30rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.text {
			color: rgb(255, 255, 255);
			font-family: 思源黑体 CN;
			font-size: 42rpx;
			font-weight: 400;
			line-height: 50rpx;
			letter-spacing: 0px;
			text-align: center;
		}
	}
</style>