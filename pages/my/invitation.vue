<template>
	<view>
		<!-- 顶部导航 -->
		<fa-navbar title="邀请好友" :border-bottom="false"></fa-navbar>
		
		<view class="totalWrap">
			<view class="icon">
				<image :src="staticurl('gifticon.png')" mode="widthFix"></image>
			</view>
			<view class="tipsBox">
				<view class="textCon">
					您已邀请<text>10</text>位好友，共获得
					<text>100</text>积分
				</view>
			</view>
		</view>
		
		<button class="shareBtn" open-type="share" @click="handleClickNext">
			马上邀请好友
		</button>
		
		<view class="shareList">
			<view class="listTitle">
				<text>邀请记录</text>
			</view>
			<view class="listWrap">
				<view class="innerLi">
					<text class="subtitle">分享王麻子</text>
					<text class="desc">获得10积分</text>
				</view>
				<view class="innerLi">
					<text class="subtitle">分享超过3个人</text>
					<text class="desc">额外获得50积分</text>
				</view>
			</view>
		</view>
		
		
		<!-- 小程序在线客服 -->
		<button class="wechatKfLink" open-type="contact"></button>
		
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
	import { avatar } from '@/common/fa.mixin.js';
	
	export default {
		mixins: [avatar],
		computed: {
			userInfo() {
				if (this.vuex_user.avatar && this.vuex_user.avatar.indexOf('data:image/svg+xml;base64') == -1) {
					this.form.avatar = this.vuex_user.avatar;
				}
				this.form.username = this.vuex_user.username || '';
				this.form.nickname = this.vuex_user.nickname == '' || this.vuex_user.nickname == '微信用户' ? '' : this.vuex_user.nickname;
				this.form.bio = this.vuex_user.bio;
				return this.vuex_user;
			}
		},
		data() {
			return {
				scrollTop: 0
			}
		},
		onShow() {
			
		},
		onReady() {
			
		},
	};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
</style>
<style lang="scss" scoped>
	//
	
	.totalWrap{
		position: relative;
		margin:200rpx 40rpx 100rpx 40rpx;
		.icon{
			position: absolute;
			display: flex;
			width:100%;
			top:-100rpx;
			justify-content: center;
			image{
				width:140rpx;
				height:140rpx;
			}
		}
		.tipsBox{
			background: #fff;
			border:2px solid #FFDFB7;
			padding:50rpx 40rpx;
			border-radius: 16rpx;
			text-align: center;
			.textCon{
				text{
					color:#F3941E;
					font-weight: bold;
					font-size:32rpx;
				}
			}
		}
	}
	.shareList{
		margin:0rpx 40rpx;
		.listTitle{
			font-size:34rpx;
			color:#000;
			font-weight: 500;
			padding-bottom:24rpx;
			border-bottom:1px solid #C7C7C7;
		}
		.listWrap{
			padding-top:10rpx;
			.innerLi{
				display:flex;
				margin:30rpx 0rpx;
				justify-content: space-between;
				.subtitle{
					color:#999999;
				}
				.desc{
					color:#999999;
				}
			}
		}
	}
	
	.shareBtn{
		width: 480rpx;
		height: 120rpx;
		border-radius: 300rpx;
		background: rgb(243, 148, 30);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom:120rpx;
		color: #fff;
		font-size: 36rpx;
	}
</style>
