	<template>
		<view class="container">
			<fa-navbar :title="title" fontSize="4px" :background="{ color: 'transparent' }" title-color="#fff"
				:borderBottom="false" :styleBack="true"></fa-navbar>
			<view class="bg">
				<!-- #ifdef APP -->
				<image :src="showBgVideo" mode=""></image>
				<!-- #endif -->
				<!-- #ifndef APP -->
				<video id="myVideo" :src="showBgVideo" :controls="false" loop muted autoplay
					@ended="handleVideoEnd"></video>
				<!-- #endif -->
			</view>
			<view class="guanghuanBox">
				<uni-transition :styles="{ 'width': '788rpx', 'height': '439rpx'}" ref="guanghuan" :show="showGuanghuan"
					custom-class="guanghuan" :duration="2000" mode-class="slide-bottom">
					<image :src="staticurl('energy_aperturebg.png')" mode=""></image>
				</uni-transition>
			</view>
			<view class="sanjiaoBox" :class="zhuruStatus ? 'zhuru' : ''">
				<uni-transition :styles="{ 'width': '600rpx', 'height': '600rpx'}" ref="sanjiao" :show="showSanjiao"
					:duration="4000" mode-class="zoom-in">
					<view class="pyramid-gyro">
						<view class="pyramid-axis">
							<view class="pyramid-wall front"></view>
							<view class="pyramid-wall back"></view>
							<view class="pyramid-wall left"></view>
							<view class="pyramid-wall right"></view>
							<view class="bottom"></view>
							<!-- <view class="shadow"></view> -->
						</view>
					</view>
				</uni-transition>
			</view>
			
			<!-- Canvas用于绘制图片 -->
			<view class="renwu">
				<!-- <image class="" :src="yourImageSrc" mode="heightFix"></image> -->
				<canvas type="2d" id="renwu" :class="zhuruStatus ? 'zhuru' : ''" canvas-id="renwu"
					@touchstart="handleTouch"></canvas>

				<template v-if="!zhuruStatus && showIcon">
					<view class="yuan" :style="{ left: item.x + '%', top: item.y + '%'}" :class="item.type ? 'big' : ''"
						:key="index" v-for="(item, index) in showPoints">
						<image :src="staticurl('energy_halo.png')" mode=""></image>
					</view>
				</template>

				<!-- <view class="guanghuan">
				<image :src="staticurl('energy_aperturebg.png')" mode=""></image>
			</view> -->


				<!-- 
			<view class="sanjiao">
			</view> -->
				<!-- <view class="progress" v-if="zhuruStatus">
				<view class="bg">
					<image :src="staticurl('energy_numbg.svg')" mode=""></image>
				</view>
				<view class="text">
					{{ percentage }}
				</view>
			</view> -->
			</view>

			<view class="leftbtns">
				<view class="btnitem" @click="handleClickZhuru">
					<image :src="staticurl('energy_icon_inject.png')" v-if="!zhuruStatus" mode=""></image>
					<image :src="staticurl('energy_icon_choose.png')" v-else mode=""></image>
				</view>
				<view class="btnitem" @click="handleClickMute" v-if="zhuruStatus">
					<image :src="staticurl('energy_icon_mute.png')" mode="" v-if="!muteFlag"></image>
					<image :src="staticurl('energy_icon_mute_on.png')" mode="" v-else></image>
				</view>
				<view class="btnitem" @click="handleClickClear" v-if="!zhuruStatus">
					<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
				</view>
				<!-- <view class="btnitem" @click="handleClickSex('man')">
				<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
			</view>
			<view class="btnitem" @click="handleClickSex('madem')">
				<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
			</view> -->
			</view>
			<view class="rightbtns" v-if="!zhuruStatus">
				<view class="btnitem" @click="handleClickShowIcons('headCoord')">
					<image :src="staticurl('energy_icon_eyes.png')" mode=""></image>
				</view>
				<!-- <view class="btnitem" @click="handleClickShowIcons('limbCoord')">
				<image :src="staticurl('energy_icon_limbs.png')" mode=""></image>
			</view> -->
				<!-- <view class="btnitem" @click="handleClickShowIcons('trunkCoord')">
				<image :src="staticurl('energy_icon_torso.png')" mode=""></image>
			</view> -->
				<view class="btnitem" @tap="handleClickTurnaround">
					<image :src="staticurl('energy_icon_turnaround.png')" mode=""></image>
				</view>
			</view>
		</view>
	</template>


	<script>
		import {
			loginfunc
		} from '@/common/fa.mixin.js';
		let backgroundMusic = null;
		export default {
			mixins: [loginfunc],
			data() {
				return {
					clickSound: null,
					backgroundTracks: [
						this.audiourl('music_bgm1.mp3'),
						this.audiourl('music_bgm2.mp3'),
						this.audiourl('music_bgm3.mp3'),
					],
					backgroundVideoTracks: [
						this.videourl('energy_pagebg1.mp4'),
						this.videourl('energy_pagebg2.mp4'),
						this.videourl('energy_pagebg3.mp4'),
					],
					backgroundImageTracks: [
						this.staticurl('energy_pagebg1.jpg'),
						this.staticurl('energy_pagebg2.jpg'),
						this.staticurl('energy_pagebg3.jpg'),
						this.staticurl('energy_pagebg4.jpg'),
					],
					imgWidth: 0,
					imgHeight: 0,
					canvas: null,
					ctx: null,
					bodys: {
						man: {
							front: {
								img: this.staticurl('energymodel_men.png'),
								trunkCoord: [
									[49.77811102331037, 21.35556864064603],
									[49.77811102331037, 25.035750336473754],
									[49.77811102331037, 29.277422611036343],
									[49.77811102331037, 34.12264468371467],
									[49.77811102331037, 38.953154244300976],
									[49.77811102331037, 43.79836810228802],
								],
								headCoord: [
									[46.22950819672131, 5.617559523809524], // 鱼腰穴
									[51.2687969924812, 6.271331058020478], //攒竹穴左
									[51.2687969924812, 7.636518771331058], //晴明穴左
									[48.63721804511278, 6.271331058020478], //攒竹穴右
									[48.26127819548872, 7.636518771331058], //晴明穴右
									[40.32786885245901, 21.540178571428573], // 右胸上
									[62.295081967213115, 23.028273809523807], // 左胸上
									[22.62295081967213, 38.80208333333333], //右臂
									[82.29508196721311, 39.546130952380956], //左臂
									[50.49180327868853, 44.754464285714285], //肚脐下
									[61.31147540983607, 64.99255952380952], //左大腿上
									[54.42622950819672, 80.31994047619048], //左小腿肚
									[49.77811102331037, 21.35556864064603],
									[49.77811102331037, 25.035750336473754],
									[49.77811102331037, 29.277422611036343],
									[49.77811102331037, 34.12264468371467],
									[49.77811102331037, 38.953154244300976],
									[49.77811102331037, 43.79836810228802],
									[8.58912721893491, 53.25118587283395], // 四肢
									[91.14276953702849, 53.34581911644095], // 四肢
									[40.384619899050016, 95.65319610636777], // 四肢
									[60.077667236328125, 95.4449865410498], // 四肢

								],
								limbCoord: [
									[8.58912721893491, 53.25118587283395],
									[91.14276953702849, 53.34581911644095],
									[40.384619899050016, 95.65319610636777],
									[60.077667236328125, 95.4449865410498]
								],
								points: []
							},
							back: {
								img: this.staticurl('energymodel_menback.png'),
								trunkCoord: [
									[52.77811102331037, 21.35556864064603],
									[52.77811102331037, 25.035750336473754],
									[52.77811102331037, 29.277422611036343],
									[52.77811102331037, 34.12264468371467],
									[51.57811102331037, 38.953154244300976],
									[51.57811102331037, 43.79836810228802],
								],
								headCoord: [
									[48.19672131147541, 29.129464285714285], //左背上
									[57.049180327868854, 45.05208333333333], //右腰下
									[53.77049180327869, 79.87351190476191], //右小腿上
									[52.31829908557404, 14.633111009825619], //后脖颈
									[52.31829908557404, 12.699090742820765], //后脖颈
									[52.77811102331037, 21.35556864064603],
									[52.77811102331037, 25.035750336473754],
									[52.77811102331037, 29.277422611036343],
									[52.77811102331037, 34.12264468371467],
									[51.57811102331037, 38.953154244300976],
									[51.57811102331037, 43.79836810228802],
									[8.58912721893491, 53.25118587283395], //四肢
									[91.14276953702849, 53.34581911644095], //四肢
									[40.384619899050016, 95.65319610636777], //四肢
									[60.077667236328125, 95.4449865410498] //四肢
								],
								limbCoord: [
									[8.58912721893491, 53.25118587283395],
									[91.14276953702849, 53.34581911644095],
									[40.384619899050016, 95.65319610636777],
									[60.077667236328125, 95.4449865410498]
								],
								points: []
							}
						},
						madem: {
							front: {
								img: this.staticurl('energymodel_madem_n.png'),
								trunkCoord: [
									[49.41752507136418, 20.423956931359356],
									[49.41752507136418, 24.9621467025572],
									[49.41752507136418, 28.587651413189768],
									[49.41752507136418, 33.182621130551816],
									[49.41752507136418, 38.074108344549124],
									[49.41752507136418, 42.055021673641484],
								],
								headCoord: [
									//X坐标、Y坐标
									[46.557377049180324, 5.022321428571429], // 鱼腰穴
									[51.80327868852459, 5.171130952380952], //攒竹穴左
									[52.78688524590164, 7.552083333333333], //晴明穴左
									[49.3890977443609, 5.171130952380952], //攒竹穴右
									[48.63721804511278, 7.552083333333333], //晴明穴右
									[41.967213114754095, 19.159226190476193], // 右胸上
									[59.67213114754099, 20.052083333333336], // 左胸上
									[28.196721311475407, 36.27232142857143], //右臂
									[71.47540983606558, 35.825892857142854], //左臂
									[51.147540983606554, 40.736607142857146], //肚脐下
									[59.34426229508196, 63.802083333333336], //左大腿上
									[53.77049180327869, 80.31994047619048], //左小腿肚
									[49.41752507136418, 20.423956931359356],
									[49.41752507136418, 24.9621467025572],
									[49.41752507136418, 28.587651413189768],
									[49.41752507136418, 33.182621130551816],
									[49.41752507136418, 38.074108344549124],
									[49.41752507136418, 42.055021673641484],
									[21.458954218576647, 51.764392467719546], //四肢
									[79.4563790044841, 52.531973221420756], //四肢
									[43.86558306993112, 95.6300471063257], //四肢
									[56.97115836058848, 95.65948855989232] //四肢
								],
								limbCoord: [
									[21.458954218576647, 51.764392467719546],
									[79.4563790044841, 52.531973221420756],
									[43.86558306993112, 95.6300471063257],
									[56.97115836058848, 95.65948855989232]
								],
								points: []
							},
							back: {
								img: this.staticurl('energymodel_mademback_n.png'),
								trunkCoord: [
									[49.41752507136418, 20.423956931359356],
									[49.41752507136418, 24.9621467025572],
									[49.41752507136418, 28.587651413189768],
									[49.41752507136418, 33.182621130551816],
									[49.41752507136418, 38.074108344549124],
									[49.41752507136418, 42.055021673641484],
								],
								headCoord: [
									[45.90163934426229, 23.47470238095238], //左背上
									[55.40983606557377, 40.88541666666667], //右腰下
									[54.75409836065573, 78.83184523809523], //右小腿上
									[47.30576393299533, 11.675199957837831], //后脖颈
									[47.30576393299533, 14.291814081497972], //后脖颈
									[49.41752507136418, 20.423956931359356],
									[49.41752507136418, 24.9621467025572],
									[49.41752507136418, 28.587651413189768],
									[49.41752507136418, 33.182621130551816],
									[49.41752507136418, 38.074108344549124],
									[49.41752507136418, 42.055021673641484],
									[21.458954218576647, 51.764392467719546], //四肢
									[79.4563790044841, 52.531973221420756], //四肢
									[43.86558306993112, 95.6300471063257], //四肢
									[56.97115836058848, 95.65948855989232] //四肢
								],
								limbCoord: [
									[21.458954218576647, 51.764392467719546],
									[79.4563790044841, 52.531973221420756],
									[43.86558306993112, 95.6300471063257],
									[56.97115836058848, 95.65948855989232]
								],
								points: []
							}
						}
					},
					canvasWidth: 0,
					canvasHeight: 0,
					canvasRect: {
						left: 0,
						top: 0,
						width: 0,
						height: 0
					},
					points: [],
					active: 'man',
					positive: 'front',
					zhuruStatus: false,
					showIcon: true,
					percentage: 50.2665, // 初始值，确保它有小数部分
					interval: null,
					increment: 0.0001, // 每次增加的幅度
					title: '',
					muteFlag: false,
					showSanjiao: false,
					showGuanghuan: false,
					selectBodyPoints: {
						front: {
							trunkCoord: [],
							headCoord: [],
							limbCoord: [],
							other: []
						},
						back: {
							trunkCoord: [],
							headCoord: [],
							limbCoord: [],
							other: []
						}
					},
					userid: null,
					videoContext: null
				};
			},
			computed: {
				showPoints() {
					let arr = []
					Object.keys(this.selectBodyPoints[this.positive]).forEach(item => {
						let newArr = this.selectBodyPoints[this.positive][item].map(item2 => {
							console.log(item)
							return {
								x: item2[0],
								y: item2[1],
								type: item == 'other' ? '' : item
							}
						})
						arr = arr.concat(newArr)
					})
					return arr
				},
				showBgVideo() {
					// #ifdef MP-WEIXIN
					const randomIndex = Math.floor(Math.random() * this.backgroundVideoTracks.length);
					const selectedTrack = this.backgroundVideoTracks[randomIndex];
					// #endif
					// #ifdef APP
					const randomIndex = Math.floor(Math.random() * this.backgroundImageTracks.length);
					const selectedTrack = this.backgroundImageTracks[randomIndex];
					// #endif
					return selectedTrack
				}
			},
			onLoad(opt) {
				backgroundMusic = uni.createInnerAudioContext();
				if (opt.userid) {
					this.userid = opt.userid
				}
			},
			onUnload() {
				backgroundMusic && backgroundMusic.destroy()
			},
			onReady() {
				this.getinject(this.userid || '')
				this.initClickSound()
				this.initBackgroundAudioSound()
				this.startSlowIncrease();
				//#ifndef APP
				this.videoContext = uni.createVideoContext('myVideo')
				//#endif
			},
			methods: {
				handleVideoEnd() {
					this.videoContext.play()
				},
				async getinject(id) {
					let reqForm = {}

					if (id) {
						reqForm.id = id
						const res1 = await this.$api.getpatient({
							id
						})

						if (res1.data.sex == 0) {
							this.active = 'madem'
						} else {
							this.active = 'man'
						}
					} else {
						if (this.vuex_user?.gender == 1) {
							this.active = 'man'
						} else if (this.vuex_user?.gender == 0) {
							this.active = 'madem'
						} else {
							this.active = 'man'
						}
					}

					const res = await this.$api.getinject(reqForm)
					if (res.data) {
						this.zhuruStatus = true
						this.showIcon = false
						if (res.data.body_image == 1) {
							this.positive = 'front'
						} else {
							this.positive = 'back'
						}
						let mapData = JSON.parse(res.data.click_info)
						// console.log(mapData)
						this.selectBodyPoints = mapData
						// this.title = this.getRemainingTime2(res.data.createtime, this.vuex_vipinfo.level)
						this.title = `VIP有效至${ this.checkVipExpiry() ? this.checkVipExpiry().split(' ')[0] : '已过期'}`

						this.initCanvasNew()
					} else {
						this.initCanvasNew()
					}
				},
				getRemainingTime2(createTime, level) {
					const currentTime = new Date(); // 获取当前时间
					const createDate = new Date(createTime * 1000); // 将Unix时间戳转换为Date对象（单位为毫秒）

					// 计算createtime 24小时后的时间
					const countdownTime = new Date(createDate.getTime() + 24 * 60 * 60 * 1000);

					// 计算当前时间和目标时间的差值，单位为毫秒
					const timeDiff = countdownTime - currentTime;

					// 如果时间差小于或等于0，表示倒计时已经结束
					if (timeDiff <= 0) {
						return '已过期';
					}

					// 转换为小时数并取整
					const countdownHours = Math.floor(timeDiff / (1000 * 60 * 60));

					return (level == 0 ? '体验剩余' : '体验剩余') + (countdownHours > 0 ? `${countdownHours}小时` : '0小时');
				},
				getRemainingTime(targetTime, level) {

					// 将目标时间转换为 Date 对象，假设传入的时间格式是 "yyyy-MM-dd HH:mm:ss"
					const targetDate = new Date(targetTime.replace(/-/g, "/")); // 替换日期中的 "-" 以兼容 Date 解析

					// 获取当前时间
					const currentTime = new Date();

					// 计算时间差（单位：毫秒）
					const timeDifference = targetDate - currentTime;

					// 如果目标时间已过，返回 "已过期"
					if (timeDifference < 0) {
						return '已过期';
					}

					// 计算剩余的小时
					const hoursRemaining = Math.floor(timeDifference / (1000 * 60 * 60)); // 转换为小时
					console.log(hoursRemaining)
					// 返回剩余的小时，如果为 0 则不显示
					return (level == 0 ? '剩余' : '剩余') + (hoursRemaining > 0 ? `${hoursRemaining}小时` : '0小时');
				},
				startSlowIncrease() {
					let currentValue = this.percentage;

					// 每隔 100 毫秒更新一次
					this.interval = setInterval(() => {
						// 如果当前值小于 100，就增加
						if (currentValue < 100) {
							currentValue += this.increment; // 每次增加一个非常小的数值
							if (currentValue > 100) currentValue = 100; // 防止超出 100
							this.percentage = currentValue.toFixed(4); // 更新当前值并保留4位小数
						}
					}, 100); // 每 100 毫秒更新一次
				},
				// 注入
				handleClickZhuru() {
					if (!this.zhuruStatus && !this.showIcon) return
					this.zhuruStatus = !this.zhuruStatus
					if (this.showIcon) {
						this.showIcon = false
						// const randomIndex = Math.floor(Math.random() * this.backgroundTracks.length);
						// const selectedTrack = this.backgroundTracks[randomIndex];
						// backgroundMusic.src = selectedTrack
						// backgroundMusic.play()
						let form = {
							map: this.selectBodyPoints,
							body_image: this.positive == 'front' ? 1 : 2
						}
						if (this.userid) {
							form.p_id = this.userid
						}
						this.$api.clickrecord(form)
						backgroundMusic.play()
						this.muteFlag = false
					} else {
						setTimeout(() => {
							if (!this.muteFlag) {
								// backgroundMusic.stop()
							}
							this.showIcon = true
						}, 500)
					}
				},
				// 清除
				handleClickClear() {
					console.log(this.selectBodyPoints[this.positive])
					this.selectBodyPoints[this.positive].headCoord = []
					this.selectBodyPoints[this.positive].limbCoord = []
					this.selectBodyPoints[this.positive].trunkCoord = []
					this.selectBodyPoints[this.positive].other = []
					this.$forceUpdate()
				},
				// 点击躯干 头部这些
				handleClickShowIcons(type) {
					let points = this.bodys[this.active][this.positive][type]
					let selectPonits = this.selectBodyPoints[this.positive][type]

					if (!selectPonits.length) {
						points.forEach(item => {
							this.selectBodyPoints[this.positive][type].push([item[0], item[1]])
						})
					} else {
						this.selectBodyPoints[this.positive][type] = []
					}
					// let points = this.bodys[this.active][this.positive][type]
					// const findIndex = this.bodys[this.active][this.positive].points.findIndex(item => item.type == type)
					// if (findIndex == -1) {
					// 	points.forEach(item => {
					// 		console.log(item)
					// 		this.bodys[this.active][this.positive].points.push({
					// 			x: item[0],
					// 			y: item[1],
					// 			type
					// 		})
					// 	})
					// } else {
					// 	this.bodys[this.active][this.positive].points = this.bodys[this.active][this.positive].points.filter(
					// 		item => item.type != type)
					// }


				},
				handleClickMute() {
					if (this.muteFlag) {
						this.muteFlag = false
						backgroundMusic.play()
					} else {
						this.muteFlag = true
						backgroundMusic.pause()
					}
				},
				initBackgroundAudioSound() {
					// 随机选择一个背景音乐文件
					const randomIndex = Math.floor(Math.random() * this.backgroundTracks.length);
					const selectedTrack = this.backgroundTracks[randomIndex];
					// 创建背景音乐音频对象
					if (backgroundMusic) {
						// backgroundMusic.destroy()
					}
					backgroundMusic.src = selectedTrack; // 替换为背景音乐文件路径
					backgroundMusic.autoplay = true; // 自动播放
					backgroundMusic.loop = true; // 循环播放
					backgroundMusic.volume = 0.8;
				},
				initClickSound() {
					this.clickSound = uni.createInnerAudioContext();
					this.clickSound.src = this.audiourl('energy_click.mp3'); // 请替换为你的音效文件路径
					this.clickSound.autoplay = false; // 不自动播放
					this.clickSound.loop = false; // 不循环播放
					this.clickSound.volume = 0.8; // 设置音量为 80%
				},
				// 播放点击音效
				playClickSound() {
					this.clickSound.play(); // 播放音效
				},
				// 触发震动
				triggerVibration() {
					uni.vibrateShort({
						type: 'heavy',
						success() {
							console.log('震动成功');
						},
						fail() {
							console.log('震动失败');
						}
					});
				},
				handleClickTurnaround() {
					if (this.positive == 'front') {
						this.positive = 'back'
					} else {
						this.positive = 'front'
					}
					this.initCanvasNew()
				},
				handleClickSex(sex) {
					this.active = sex
					this.positive = 'front'
					this.initCanvasNew()
				},
				initCanvasNew() {
					// #ifdef MP-WEIXIN
					const imgUrl = this.bodys[this.active][this.positive].img
					if (this.ctx) {
						this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // 清空 canvas
						const image = this.canvas.createImage()
						image.onload = () => {
							this.ctx.drawImage(
								image,
								0,
								0,
								this.canvasWidth, this.canvasHeight
							)
							this.showSanjiao = true
							this.showGuanghuan = true
						}
						image.src = imgUrl
						return
					}
					// 旧版 canvas 不能修改宽高
					uni.createSelectorQuery()
						.select('#renwu') // 在 WXML 中填入的 id
						.fields({
							node: true,
							size: true,
							rect: true
						})
						.exec((res) => {
							// Canvas 对象
							const canvas = res[0].node
							this.canvas = canvas
							// Canvas 画布的实际绘制宽高
							const renderWidth = res[0].width
							const renderHeight = res[0].height
							// Canvas 绘制上下文
							const ctx = canvas.getContext('2d')
							this.ctx = ctx
							// 初始化画布大小
							// const dpr = wx.getWindowInfo().pixelRatio
							canvas.width = renderWidth
							canvas.height = renderHeight
							// ctx.scale(dpr, dpr)

							this.canvasWidth = res[0].width
							this.canvasHeight = res[0].height
							console.log(res)
							this.canvasRect = {
								left: res[0].left,
								top: res[0].top,
								width: res[0].width,
								height: res[0].height
							};

							this.ctx.clearRect(0, 0, res.width, res.height); // 清空 canvas
							const image = canvas.createImage()
							image.onload = () => {
								this.ctx.drawImage(
									image,
									0,
									0,
									this.canvasWidth,
									this.canvasHeight
								)
								this.showSanjiao = true
								this.showGuanghuan = true
							}
							image.src = imgUrl
						})
					// #endif

					// #ifdef APP
					const imgUrl = this.bodys[this.active][this.positive].img
					this.canvas = uni.createSelectorQuery().select('#renwu');

					this.ctx = uni.createCanvasContext('renwu', this);
					// 获取图片信息并绘制到 canvas 上
					// 获取 canvas 宽高
					this.canvas.fields({
						size: true, // 获取 canvas 宽高
						rect: true
					}).exec((res) => {
						const canvasWidth = res[0].width; // 获取 canvas 宽度
						const canvasHeight = res[0].height; // 获取 canvas 高度
						this.canvasWidth = res[0].width
						this.canvasHeight = res[0].height
						this.canvasRect = {
							left: res[0].left,
							top: res[0].top,
							width: res[0].width,
							height: res[0].height
						};
						uni.getImageInfo({
							src: imgUrl,
							success: (res) => {
								this.imgWidth = res.width
								this.imgHeight = res.height
								// 图片加载成功后，绘制图片
								this.ctx.clearRect(0, 0, res.width, res.height); // 清空 canvas
								this.ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight); // 绘制图片

								this.ctx.draw()
								this.showSanjiao = true
								this.showGuanghuan = true

							}
						});
					});
					// #endif
				},
				initCanvas() {},
				handleTouch(e) {
					// #ifdef MP-WEIXIN
					const touchX = e.touches[0].clientX;
					const touchY = e.touches[0].clientY;
					const offsetX = touchX - this.canvasRect.left;
					const offsetY = touchY - this.canvasRect.top;
					this.checkPixel(offsetX, offsetY)
					// #endif
					// #ifdef APP
					console.log(e)
					const touchX = e.touches[0].x;
					const touchY = e.touches[0].y;
					const offsetX = touchX;
					const offsetY = touchY;
					this.checkPixel(offsetX, offsetY)
					// #endif
				},
				checkPixel(x, y) {
					const _this = this
					// #ifdef MP-WEIXIN
					const imageData = this.ctx.getImageData(x, y, 1, 1);
					const pixel = imageData.data;
					// 判断透明度 (pixel[3] 是 alpha 值)
					if (pixel[3] === 0) {
						console.log('点击的地方是透明的');
					} else {
						console.log('点击的地方不是透明的');
						_this.drawCircle(x, y)
					}
					console.log(pixel)
					// #endif
					// #ifdef APP
					uni.canvasGetImageData({
						canvasId: 'renwu',
						x: x,
						y: y,
						width: 1,
						height: 1,
						success(res) {
							console.log(res)
							const pixel = res.data;
							if (pixel[3] === 0) {
								console.log('点击的是透明区域');
							} else {
								console.log('点击的是不透明区域');
								_this.drawCircle(x, y)
							}
						},
						fail(err) {
							console.log(err)
						}
					})
					// #endif


				},
				drawCircle(x, y) {
					const {
						left,
						top,
						width,
						height
					} = this.canvasRect
					// 计算相对坐标
					// const offsetX = x - left;
					// const offsetY = y - top;

					// 限制坐标范围，避免溢出
					const validOffsetX = Math.max(0, Math.min(x, width));
					const validOffsetY = Math.max(0, Math.min(y, height));

					// 转换为百分比
					const percentX = (validOffsetX / width) * 100;
					const percentY = (validOffsetY / height) * 100;

					console.log(percentX)
					console.log(percentY)
					// 播放点击音效
					this.playClickSound();

					// 触发震动
					this.triggerVibration();

					// this.selectBodyPoints[this.positive]['other'].push({
					// 	x: percentX,
					// 	y: percentY
					// })

					this.selectBodyPoints[this.positive]['other'].push([percentX, percentY])
				}
			}
		};
	</script>


	<style scoped lang="scss">
		.container {
			position: relative;
			width: 100vw;
			height: 100vh;
			// background: #000;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: relative;
			overflow: hidden;

			.bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;

				video {
					width: 100%;
					height: 100%;
					object-fit: fill;
					mix-blend-mode: screen;
					display: block;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}


		.guanghuanBox {
			width: 788rpx;
			height: 439rpx;
			position: fixed;
			bottom: 5vh;
			right: 0;
			// transform: translateX(-50%);
			z-index: -1;
			display: flex;
			justify-content: center;
			align-items: center;

			/deep/ .guanghuan {
				width: 788rpx;
				height: 439rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.sanjiaoBox {
			width: 600rpx;
			height: 600rpx;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: -1;
			display: flex;
			justify-content: center;
			align-items: center;

			&.zhuru {
				z-index: 9999;
			}
		}

		.sanjiaoBox2 {
			width: 600rpx;
			height: 600rpx;
			display: block;
			transform-style: preserve-3d;
			transform: rotateX(-20deg) translate(-50%, -50%);
			position: fixed;
			top: 40%;
			left: 50%;
			z-index: -1;

			&.zhuru {
				z-index: 10;
			}

			.wrapper {
				position: relative;
				width: 100%;
				height: 100%;
				transform-style: preserve-3d;
				animation: spin 4s infinite;

				.side {
					width: 500rpx;
					height: 500rpx;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					margin: auto;
					transform-origin: center top;
					clip-path: polygon(50% 0%, 0% 100%, 100% 100%);

					&.side1 {
						transform: rotateZ(-30deg) rotateY(90deg); //*设置绕Z轴旋转-30度绕Y轴旋转90度*
						background: linear-gradient(to bottom,
								rgba(255, 224, 102, 0.7) 0%,
								/* 顶部较亮 */
								rgba(255, 215, 0, 0.4) 60%,
								/* 中间渐变 */
								rgba(255, 179, 0, 0.15) 90%,
								/* 底部淡淡的金色 */
								rgba(255, 179, 0, 0.08) 100%
								/* 最底部有一点点颜色，不是完全透明 */
							);
					}

					&.side2 {
						transform: rotateZ(30deg) rotateY(90deg); //*设置绕Z轴旋转-30度绕Y轴旋转90度*
						background: linear-gradient(to bottom,
								rgba(255, 224, 102, 0.7) 0%,
								/* 顶部较亮 */
								rgba(255, 215, 0, 0.4) 60%,
								/* 中间渐变 */
								rgba(255, 179, 0, 0.15) 90%,
								/* 底部淡淡的金色 */
								rgba(255, 179, 0, 0.08) 100%
								/* 最底部有一点点颜色，不是完全透明 */
							);
					}

					&.side3 {
						transform: rotateX(30deg); //*设置绕Z轴旋转-30度绕Y轴旋转90度*
						background: linear-gradient(to bottom,
								rgba(255, 224, 102, 0.7) 0%,
								/* 顶部较亮 */
								rgba(255, 215, 0, 0.4) 60%,
								/* 中间渐变 */
								rgba(255, 179, 0, 0.15) 90%,
								/* 底部淡淡的金色 */
								rgba(255, 179, 0, 0.08) 100%
								/* 最底部有一点点颜色，不是完全透明 */
							);
					}

					&.side4 {
						transform: rotateX(-30deg); //*设置绕Z轴旋转-30度绕Y轴旋转90度*
						background: linear-gradient(to bottom,
								rgba(255, 224, 102, 0.7) 0%,
								/* 顶部较亮 */
								rgba(255, 215, 0, 0.4) 60%,
								/* 中间渐变 */
								rgba(255, 179, 0, 0.15) 90%,
								/* 底部淡淡的金色 */
								rgba(255, 179, 0, 0.08) 100%
								/* 最底部有一点点颜色，不是完全透明 */
							);

					}
				}
			}

		}

		@-webkit-keyframes spin {
			from {
				-webkit-transform: rotateY(0);
			}

			to {
				-webkit-transform: rotateY(360deg);
			}
		}

		.renwu {
			width: 533.7rpx;
			height: 1172.7rpx;
			// overflow: hidden;
			position: fixed;


			.progress {
				width: 500rpx;
				height: 146rpx;
				position: absolute;
				bottom: 200rpx;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;

				.bg {
					position: absolute;
					width: 140%;
					height: 100%;
					left: 50%;
					transform: translateX(-50%);

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					color: rgb(255, 255, 255);
					font-family: Space Grotesk;
					font-size: 60rpx;
					font-weight: 500;
					line-height: -1rpx;
					letter-spacing: 0px;
					text-align: center;
					text-shadow: 2rpx 2rpx 2rpx #000000;
				}
			}

			image {
				// width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}

			canvas {
				width: 100%;
				height: 100%;
				position: relative;
				z-index: 1;
			}
		}

		.leftbtns {
			position: absolute;
			top: 12%;
			left: 12rpx;
			z-index: 9999;

			.btnitem {
				width: 193rpx;
				height: 96rpx;

				image {
					width: 100%;
					height: 100%;
				}

			}
		}

		.rightbtns {
			position: absolute;
			top: 12%;
			right: 12rpx;
			z-index: 9999;

			.btnitem {
				width: 182rpx;
				height: 96rpx;

				image {
					width: 100%;
					height: 100%;
				}

			}
		}

		.yuan {
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			transform: translate(-50%, -50%);
			pointer-events: none;
			animation: rotate 2s linear infinite;
			transform-origin: top left;
			z-index: 999;

			&.big {
				width: 80rpx;
				height: 80rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}
			}

			image {
				width: 80rpx;
				height: 80rpx;
			}
		}

		@keyframes rotate {
			0% {
				transform: rotate(0deg) translate(-50%, -50%);
			}

			100% {
				transform: rotate(360deg) translate(-50%, -50%);
			}
		}

		#renwu {
			transition: all 1s ease-in-out;

			&.zhuru {
				transform: scale(0.35);
				z-index: -99;
			}
		}


		.pyramid-gyro {
			position: fixed;
			top: -36px;
			left: 50%;
			margin-left: -100px;
			-webkit-perspective: 1000px;
			-webkit-perspective-origin: 50% -40px;
			transform: scale(1.3);
			z-index: -1;

			&.zhuru {
				z-index: 999999;
			}

			.pyramid-axis {
				position: relative;
				width: 200px;
				-webkit-transform-style: preserve-3d;
				-webkit-animation: spin 16s infinite linear;
			}

			.pyramid-wall {
				position: absolute;
				border: 100px solid transparent;
			}

			.front {
				bottom: -20px;
				border-bottom: 200px solid rgba(255, 165, 90, 0.5);
				-webkit-transform: translateZ(25px) rotateX(30deg);
			}

			.back {
				bottom: -20px;
				border-bottom: 200px solid rgba(255, 165, 90, 0.5);
				-webkit-transform: translateZ(-25px) rotateY(180deg) rotateX(30deg);
			}

			.left {
				bottom: -20px;
				left: 75px;
				border-bottom: 200px solid rgba(254, 136, 37, 0.5);
				-webkit-transform: rotateY(270deg) translateX(-100px) rotateX(30deg);
				-webkit-transform-origin: center left;
			}

			.right {
				bottom: -40px;
				right: 150px;
				border-bottom: 200px solid rgba(254, 136, 37, 0.5);
				-webkit-transform: rotateY(-270deg) translateX(100px) rotateX(30deg);
				-webkit-transform-origin: top right;
			}

			.bottom {
				width: 200px;
				height: 200px;
				background: #eec26f;
				-webkit-transform: rotateX(90deg) translateY(100px);
				-webkit-transform-origin: bottom center;
			}

			.shadow {
				position: absolute;
				top: 250px;
				width: 0;
				height: 0;
				box-shadow: 0 0 50px 100px rgba(0, 0, 0, 0.5);
				-webkit-transform: rotateX(90deg) translateX(100px);
			}

		}
	</style>