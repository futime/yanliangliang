<template>
	<view class="page">
		<fa-navbar :title="isnew ? '资料补充': '用户资料'" :isBackFlag="isnew ? false : true" :background="{ color: '#fff' }"></fa-navbar>
		<view class="form">
			<view class="form-item">
				<view class="form-item-label">姓名</view>
				<view class="form-item-content">
					<input class="input" v-model="form.nickname" placeholder="请输入您的姓名" type="text">
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">出生年月</view>
				<!-- <view class="form-item-content" @click="handleClickShowPicker"> -->
					<!-- <input class="input" v-model="form.age" disabled placeholder="请您输入出生年月" type="text"> -->
				<!-- </view>	 -->
				<view class="form-item-group">
					<view class="item-box">
						<input class="input" v-model="form.age1" placeholder="输入年份" type="text">
						<view class="rightIcon">
							年
						</view>
					</view>
					<view class="item-box">
						<input class="input" v-model="form.age2" placeholder="输入月份" type="text">
						<view class="rightIcon">
							月
						</view>
					</view>
				</view>
			</view>
			<!-- 	<view class="form-item">
				<view class="form-item-label">体重 kg</view>
				<view class="form-item-content" @click="handleClickShowKgPicker">
					<input class="input" v-model="form.body_weight" disabled type="number" inputmode="numeric"
						@input="onInput" placeholder="点击选择体重(KG)">
					<view class="rightIcon">
						KG
					</view>
				</view>
			</view> -->
			<view class="form-item">
				<view class="form-item-label">性别</view>
				<view class="form-item-sex-box">
					<view class="sexbox" :class="form.gender == 1 ? 'active' : ''" @click="form.gender = 1">
						<view class="icon">
							<image :src="staticurl('sex_men.png')" mode=""></image>
						</view>
						<view class="label">男</view>
						<view class="check">
							<u-icon name="checkbox-mark" color="#fff"></u-icon>
						</view>
					</view>
					<view class="sexbox" :class="form.gender == 0 ? 'active' : ''" @click="form.gender = 0">
						<view class="icon">
							<image :src="staticurl('sex_madam.png')" mode=""></image>
						</view>
						<view class="label">女</view>
						<view class="check">
							<u-icon name="checkbox-mark" color="#fff"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef APP -->
			<view class="form-item">
				<view class="form-item-label">人脸信息</view>
				<view class="form-item-content face">
					<view class="faceimage" v-if="form.face_image">
						<image :src="cdnurl(form.face_image)" mode="widthFix"></image>
						<view class="mask" @click="selectImageUpload">
							修改
						</view>
					</view>
					<view class="addImage" v-if="!form.face_image" @click="selectImageUpload">
						<image :src="staticurl('uploadimg_icon.png')" mode=""></image>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="form-item" v-if="form.face_image">
				<view class="form-item-label">人脸信息</view>
				<view class="form-item-content face">
					<view class="faceimage" v-if="form.face_image">
						<image :src="cdnurl(form.face_image)" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<view class="btnGroup">
				<view class="loginBtn" @click="handleClickSubmit">
					<view class="label">{{ isnew ? '下一步' : '保存编辑'}}</view>
				</view>
			</view>
		</view>
		<u-picker ref="picker" default-time="1930-01-01 00:00:00" start-year="1920" v-model="showPickerYear" :params="params" mode="time"
			@confirm="selectYear"></u-picker>
		<u-picker ref="picker2" :range="weights" :default-selector="[50]" mode="selector" v-model="showPickerKg"
			@confirm="selectKg"></u-picker>
	</view>
</template>

<script>
	// 生成体重数组的函数
	function generateWeights(min, max) {
		const weights = [];
		for (let i = min; i <= max; i++) {
			weights.push(i);
		}
		return weights;
	}
	export default {

		data() {
			return {
				showPickerYear: false,
				showPickerKg: false,
				weights: [],
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				form: {
					gender: 1,
					nickname: '',
					age1: '',
					age2: '',
					body_weight: '',
					face_image: ''
				},
				isnew: false
			}
		},
		onLoad(opt) {
			this.weights = generateWeights(1, 400);
			if (!opt.isnew) {
				this.initUserData()
			} else {
				this.isnew = true
			}
		},
		methods: {
			selectImageUpload() {
				const _this = this
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					camera: 'front',
					async success(res) {
						console.log(res)
						let res2 = await _this.$api.goUpload({
							filePath: res.tempFiles[0].tempFilePath
						});
						if (!res2.code) {
							_this.$u.toast(res2.msg);
						}

						_this.form.face_image = res2.data.url
					}
				})
				// #endif
				// #ifdef APP
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					async success(res) {
						console.log(JSON.stringify(res.tempFilePaths));
						let res2 = await _this.$api.goUpload({
							filePath: res.tempFilePaths[0]
						});
						if (!res2.code) {
							_this.$u.toast(res2.msg);
						}

						_this.form.face_image = res2.data.url
					}
				});
				// #endif
			},
			selectKg(e) {
				if (e) {
					this.form.body_weight = e[0].toString()
				}
			},
			handleClickShowPicker() {
				this.showPickerYear = true
			},
			handleClickShowKgPicker() {
				this.showPickerKg = true
			},
			initUserData() {
				this.form.nickname = this.vuex_user.nickname
				this.form.gender = this.vuex_user.gender
				this.form.age1 = this.vuex_user.age.split('-')[0]
				this.form.age2 = this.vuex_user.age.split('-')[1]
				this.form.body_weight = this.vuex_user.body_weight
				this.form.face_image = this.vuex_user.face_image
			},
			async handleClickSubmit() {
				if (!this.form.nickname) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}

				if (!this.form.age1) {
					uni.showToast({
						title: '请选择出生年月',
						icon: 'none'
					})
					return
				}
				
				if (!this.form.age2) {
					uni.showToast({
						title: '请选择出生年月',
						icon: 'none'
					})
					return
				}
				// if (!this.form.body_weight) {
				// 	uni.showToast({
				// 		title: '请输入体重',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (!this.form.gender.toString()) {
					uni.showToast({
						title: '请选择性别',
						icon: 'none'
					})
					return
				}
				// #ifdef APP
				if (!this.form.face_image.toString()) {
					uni.showToast({
						title: '请上传人脸图片',
						icon: 'none'
					})
					return
				}
				// #endif
				let res = await this.$api.getUserProfile({
					...this.form,
					gender: this.form.gender,
					age: this.form.age1 + '-' + this.form.age2
				});
				if (res.code) {
					await this.getUserIndex()
					if (this.isnew) {
						this.$u.toast(`恭喜您获得${this.vuex_config.vipday}天VIP体验时间`)
						setTimeout(() => {
							this.$u.route({
								type: 'redirectTo',
								url: '/pages/space/start'
							});
						}, 1500)
					} else {
						this.$u.toast(res.msg);
						this.$u.route({
							type: 'switchTab',
							url: '/pages/index/index'
						});
					}
				}
			},
			getUserIndex: async function() {
				let res = await this.$api.getUserIndex();
				if (res.code == 1) {
					const res2 = await this.$api.getVipInfo()
					this.$u.vuex('vuex_vipinfo', res2.data.vipInfo);
					this.$u.vuex('vuex_user', res.data.userInfo || {});
				} else {
					this.$u.toast(res.msg);
					return;
				}
			},
			selectYear(e) {
				if (e) {
					this.form.age = `${e.year}-${e.month}-${e.day}`
				}
			},
			onInput(event) {
				let value = event.detail.value;
				// 正则匹配正整数
				if (/^\d+$/.test(value) || value === '') {
					this.form.body_weight = value;
				} else {
					// 如果输入的不是数字，则保持原来的值
					this.form.body_weight = this.form.body_weight;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-top: 54rpx;
		padding-left: 70rpx;
		padding-right: 70rpx;
		padding-bottom: 150rpx;
	}

	.form {
		&-item {
			margin-bottom: 36rpx;

			&-label {
				color: rgb(17, 17, 17);
				font-size: 38rpx;
				font-weight: 500;
				line-height: 1.2;
				letter-spacing: 0px;
				text-align: left;
				margin-bottom: 24rpx;
			}
			
			&-group {
				display: flex;
				gap:20rpx;
				.item-box{
					width: 50%;
					height: 132rpx;
					box-sizing: border-box;
					border: 2rpx solid rgb(221, 221, 221);
					border-radius: 12rpx;
					padding: 0 33rpx;
					position: relative;
					display: flex;
					align-items: center;
					.rightIcon {
						position: absolute;
						right: 20rpx;
						top: 50%;
						transform: translateY(-50%);
						font-size:32rpx;
						color: #303133;
					}
					.input {
						width: 100%;
						height: 100%;
						font-size: 38rpx;
					}
				}
			}

			&-content {
				width: 100%;
				height: 132rpx;
				box-sizing: border-box;
				border: 2rpx solid rgb(221, 221, 221);
				border-radius: 12rpx;
				padding: 0 33rpx;
				position: relative;

				.rightIcon {
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				&.face {
					height: auto;
					border: 2rpx solid transparent;
					padding: 0;

					.faceimage {
						width: 100%;
						position: relative;

						.mask {
							height: 60rpx;
							width: 100%;
							position: absolute;
							bottom: 0;
							left: 0;
							background-color: rgba(0, 0, 0, 0.2);
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							font-size: 32rpx;
							border-radius: 0 0 16rpx 16rpx;
						}

						image {
							width: 100%;
						}
					}
				}

				.input {
					width: 100%;
					height: 100%;
					font-size: 38rpx;
				}
			}

			&-sex-box {
				display: flex;
				flex-wrap: nowrap;

				.sexbox {
					height: 360rpx;
					box-sizing: border-box;
					// border: 3rpx solid rgb(255, 141, 0);
					border: 3rpx solid rgb(221, 221, 221);
					border-radius: 12rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
					margin-right: 69rpx;
					flex-direction: column;
					position: relative;

					&:last-child {
						margin-right: 0;
					}

					&.active {
						border: 3rpx solid rgb(255, 141, 0);

						.label {
							color: rgb(17, 17, 17);

						}

						.check {
							display: flex;
						}
					}

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

					.icon {
						width: 223rpx;
						height: 223rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.label {
						color: rgb(153, 153, 153);
						font-family: Dream Han Sans CN;
						font-size: 48rpx;
						font-weight: 400;
						line-height: 50rpx;
						letter-spacing: 0px;
						text-align: left;
						margin-top: 30rpx;
					}
				}
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
		height: 160rpx;
		background: #fff;
	}

	.loginBtn {
		width: 80%;
		height: 110rpx;
		border-radius: 300px;
		background: rgb(243, 148, 30);
		color: rgb(255, 255, 255);
		font-family: 思源黑体 CN;
		font-size: 40rpx;
		font-weight: 400;
		line-height: 50rpx;
		letter-spacing: 0px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.addImage {
		width: 210rpx;
		height: 210rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>