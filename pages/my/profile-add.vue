<template>
	<view class="page">
		<fa-navbar title="资料补充" :background="{ color: '#fff' }"></fa-navbar>
		<view class="form">
			<view class="form-item">
				<view class="form-item-label">姓名</view>
				<view class="form-item-content">
					<input class="input" v-model="form.nickname" placeholder="请输入姓名" type="text">
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">年龄</view>
				<view class="form-item-content" @click="showPickerYear = !showPickerYear">
					<input class="input" v-model="form.age" disabled placeholder="请选择年份" type="text">
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">体重 kg</view>
				<view class="form-item-content">
					<input class="input" v-model="form.body_weight" type="number" inputmode="numeric" @input="onInput"
						placeholder="请输入体重(KG)">
				</view>
			</view>
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

			<view class="loginBtn" @click="handleClickSubmit">
				<view class="label">下一步</view>
			</view>
		</view>
		<u-picker v-model="showPickerYear" :params="params" mode="time" @confirm="selectYear"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPickerYear: false,
				params: {
					year: true,
					month: false,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				form: {
					gender: 1,
					nickname: '',
					age: '',
					body_weight: ''
				}
			}
		},
		methods: {
			async handleClickSubmit(){
					if(!this.form.nickname){
						uni.showToast({
							title: '请输入名称',
							icon: 'none'
						})
						return
					}
					
					if(!this.form.age){
						uni.showToast({
							title: '请选择年龄',
							icon: 'none'
						})
						return
					}
					if(!this.form.body_weight){
						uni.showToast({
							title: '请输入体重',
							icon: 'none'
						})
						return
					}
					if(!this.form.gender){
						uni.showToast({
							title: '请选择性别',
							icon: 'none'
						})
						return
					}
					let res = await this.$api.getUserProfile(this.form);
					this.$u.toast(res.msg);
					if (res.code) {
						setTimeout(() => {
							this.$u.route({
								type: 'switchTab',
								url: '/pages/my/my'
							});
						}, 800)
					}
			},
			selectYear(e) {
				if (e) {
					this.form.age = e.year
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
		padding-top: 94rpx;
		padding-left: 70rpx;
		padding-right: 70rpx;
		padding-bottom: 100rpx;
	}

	.form {
		&-item {
			margin-bottom: 66rpx;

			&-label {
				color: rgb(17, 17, 17);
				font-family: Dream Han Sans CN;
				font-size: 48rpx;
				font-weight: 400;
				line-height: 50rpx;
				letter-spacing: 0px;
				text-align: left;
				margin-bottom: 42rpx;
			}

			&-content {
				width: 100%;
				height: 132rpx;
				box-sizing: border-box;
				border: 2rpx solid rgb(221, 221, 221);
				border-radius: 12rpx;
				padding: 0 33rpx;

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
					height: 447rpx;
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

	.loginBtn {
		width: 648rpx;
		height: 130rpx;
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
		margin-top: 105rpx;
	}
</style>