<template>
	<view class="page">
		<fa-navbar :title="title" :borderBottom="true"></fa-navbar>
		<view class="content">
			<u-form :model="form" ref="uForm" :label-width="140">
				<u-form-item label="姓名" prop="name" required><u-input v-model="form.name"
						placeholder="请输入体验者姓名" /></u-form-item>
				<u-form-item label="手机号" prop="phone" required><u-input v-model="form.phone"
						placeholder="请输入体验者手机号" /></u-form-item>
				<u-form-item label="性别"  prop="sex" required>
					<u-radio-group v-model="form.sex">
						<u-radio v-for="(item, index) in radioList" :key="index" :name="item.value">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="出生日期"  prop="age" required><u-input v-model="form.age" type="select" placeholder="选择出生年月日"
						@click="handleClickShowAge" /></u-form-item>
				<u-form-item label="体重"  prop="body_weight" required><u-input v-model="form.body_weight" type="select"
						placeholder="请选择体重（单位kg）" @click="handleClickShowWeight" /></u-form-item>
				<u-form-item label="点击上传体验者照片"  prop="image"  label-position="top" required>
					<view class="uploadBox">
						<view class="uploadImage" v-if="form.image">
							<image :src="cdnurl(form.image)" mode=""></image>
						</view>
						<view class="addImage" @click="selectImageUpload">
							<image :src="staticurl('uploadimg_icon.png')" mode=""></image>
						</view>
					</view>
				</u-form-item>
			</u-form>
		</view>

		<view class="submitBtn" @click="submit">
			保存资料
		</view>
		<u-picker ref="picker" default-time="1970-01-01 00:00:00" v-model="showAge" :params="params" mode="time"
			@confirm="selectYear"></u-picker>
		<u-picker ref="picker2" :range="weights" :default-selector="[50]" mode="selector" v-model="showWeight"
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
				title: '新增体验者信息',
				form: {
					name: '',
					phone: '',
					sex: '',
					age: '',
					body_weight: '',
					image: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					age: [{
						required: true,
						message: '请选择出生日期',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					body_weight: [{
						required: true,
						message: '请选择体重',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					image: [{
						required: true,
						message: '请上传照片',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					// 字段名称
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					]
				},
				radioList: [{
						name: '男',
						value: '1'
					},
					{
						name: '女',
						value: '0'
					}
				],
				showAge: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				weights: [],
				showWeight: false,
				userid: null
			}
		},
		computed: {},
		onLoad(opt) {
			this.weights = generateWeights(1, 400);
			
			if(opt.id) {
				this.title = '编辑体验者信息'
				this.form.name = opt.name
				this.form.phone = opt.phone
				this.form.sex = opt.sex
				this.form.age = opt.age
				this.form.body_weight = opt.body_weight
				this.form.image = opt.image
				this.userid = opt.id
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				this.$refs.uForm.validate( async valid => {
					if (valid) {
						const res = await this.$api.addpatient({
							...this.form,
							id: this.userid
						})
						if(!res.code) {
							this.$u.toast(res.msg);
						}
						this.$u.toast(this.userid ? '编辑成功' : '添加成功');
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						console.log('验证失败');
					}
				});
			},
			handleClickShowAge() {
				this.showAge = true
			},
			selectYear(e) {
				if (e) {
					this.form.age = `${e.year}-${e.month}-${e.day}`
				}
			},
			handleClickShowWeight() {
				this.showWeight = true
			},
			selectKg(e) {
				if (e) {
					this.form.body_weight = e[0].toString()
				}
			},
			selectImageUpload() {
				const _this = this
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

						_this.form.image = res2.data.url
					}
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
		padding: 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.content {
		background-color: #fff;
		width: 100%;
		padding: 30rpx 50rpx;
		border-radius: 20rpx;

		box-shadow: 0px 4rpx 4rpx 2rpx rgba(0, 0, 0, 0.08);
		background: rgb(255, 255, 255);
	}

	.uploadBox {
		display: flex;
		align-items: center;

		.uploadImage {
			width: 210rpx;
			height: 210rpx;
			margin-right: 50rpx;
			border-radius: 16rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}

		.addImage {
			width: 210rpx;
			height: 210rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.submitBtn {
		width: 598rpx;
		height: 123rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		color: rgb(255, 255, 255);
		font-family: 思源黑体 CN;
		font-size: 42rpx;
		font-weight: 400;
		line-height: 50rpx;
		letter-spacing: 0px;
		text-align: center;
		border-radius: 300rpx;
		margin-top: 50rpx;

		background: rgb(243, 148, 30);
	}
</style>