<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="分享好友" :border-bottom="false"></fa-navbar>

		<view class="totalWrap">
			<view class="icon">
				<image :src="staticurl('gifticon.png')" mode="widthFix"></image>
			</view>
			<view class="tipsBox">
				<view class="textCon">
					您已分享<text>{{ totalNum }}</text>位好友，共获得
					<text>{{ totalScore }}</text>积分
				</view>
			</view>
		</view>

		<button class="shareBtn" open-type="share">
			马上分享好友
		</button>

		<view class="shareList">
			<view class="listTitle">
				<text>分享记录</text>
			</view>
			<view class="listWrap">
				<view class="innerLi" v-for="(item, index) in list" :key="index">
					<text class="subtitle">{{ item.memo }}</text>
					<text class="desc">获得{{ item.score }}积分</text>
				</view>
			</view>
		</view>
		<!-- 空数据 -->
		<view class="u-flex u-row-center fa-empty" v-if="!list.length">
			<image src="../../static/image/data.png" mode=""></image>
			<view class="u-tips-color">暂无更多数据~</view>
		</view>
		<!-- 加载更多 -->
		<view class="u-p-b-30 u-p-t-60" v-if="list.length"><u-loadmore bg-color="#ffffff" :status="has_more ? status : 'nomore'" /></view>


		<!-- 小程序在线客服 -->
		<button class="wechatKfLink" open-type="contact"></button>

		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
	import {
		avatar
	} from '@/common/fa.mixin.js';

	export default {
		mixins: [avatar],
		computed: {
			userInfo() {
				if (this.vuex_user.avatar && this.vuex_user.avatar.indexOf('data:image/svg+xml;base64') == -1) {
					this.form.avatar = this.vuex_user?.avatar;
				}
				this.form.username = this.vuex_user.username || '';
				this.form.nickname = this.vuex_user.nickname == '' || this.vuex_user.nickname == '微信用户' ? '' : this
					.vuex_user.nickname;
				this.form.bio = this.vuex_user.bio;
				return this.vuex_user;
			}
		},
		data() {
			return {
				form: {},
				scrollTop: 0,
				totalNum: 0,
				totalScore: 0,
				page: 1,
				list: [],
				status: 'loadmore',
				is_update: false,
				has_more: false,
			}
		},
		onShow() {

		},
		onReady() {

		},
		onLoad() {
			this.getrecommend()
			this.getscore()
		},
		onReachBottom() {
			if (this.has_more) {
				this.status = 'loading';
				this.page++;
				this.getGoods();
			}
		},
		methods: {
			async getrecommend() {
				const res = await this.$api.getrecommend()
				this.totalNum = res.data.total
			},
			async getscore() {

				const res = await this.$api.getscore({
					page: this.page
				})

				if (this.is_update) {
					this.list = [];
					this.is_update = false;
				}

				this.list = [...this.list, ...res.data.list.data];
				this.has_more = res.data.list.current_page < res.data.list.last_page;
				this.totalScore = res.data.count
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	//

	.totalWrap {
		position: relative;
		margin: 200rpx 40rpx 100rpx 40rpx;

		.icon {
			position: absolute;
			display: flex;
			width: 100%;
			top: -100rpx;
			justify-content: center;
			image {
				width: 140rpx;
				height: 140rpx;
				background: #fff;
			}
		}

		.tipsBox {
			background: #fff;
			border: 2px solid #12A89D;
			padding: 50rpx 40rpx;
			border-radius: 16rpx;
			text-align: center;

			.textCon {
				text {
					color: #12A89D;
					font-weight: bold;
					font-size: 32rpx;
					margin:0px 4rpx;
				}
			}
		}
	}

	.shareList {
		margin: 0rpx 40rpx;

		.listTitle {
			font-size: 34rpx;
			color: #000;
			font-weight: 500;
			padding-bottom: 24rpx;
			border-bottom: 1px solid #e3e3e3;
		}

		.listWrap {
			padding-top: 10rpx;

			.innerLi {
				display: flex;
				margin: 30rpx 0rpx;
				justify-content: space-between;

				.subtitle {
					color: #999999;
				}

				.desc {
					color: #999999;
				}
			}
		}
	}

	.shareBtn {
		width: 480rpx;
		height: 120rpx;
		border-radius: 300rpx;
		background: #12A89D;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 120rpx;
		color: #fff;
		font-size: 36rpx;
	}
</style>