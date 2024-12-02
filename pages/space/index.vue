<template>
	<view class="container">
		<fa-navbar :title="'剩余时间24小时'" :background="{ color: 'transparent' }" title-color="#fff" :borderBottom="false"
			:styleBack="true"></fa-navbar>
		<view class="bg">
			<image :src="staticurl('startpage_bg.jpeg')" mode=""></image>
		</view>
		<!-- Canvas用于绘制图片 -->
		<view class="renwu">
			<!-- <image class="" :src="yourImageSrc" mode="heightFix"></image> -->
			<canvas id="renwu" :class="zhuruStatus ? 'zhuru' : ''" canvas-id="renwu" @touchstart="handleTouch"></canvas>
			<template v-if="!zhuruStatus && showIcon">
				<view class="yuan" :style="{ left: item.x + '%', top: item.y + '%'}" :class="item.type ? 'big' : ''"
					:key="index" v-for="(item, index) in showPoints">
					<image :src="staticurl('energy_halo.png')" mode=""></image>
				</view>
			</template>
			<view class="guanghuan">
				<image :src="staticurl('energy_aperturebg.png')" mode=""></image>
			</view>
			<view class="sanjiao">
				<image :src="staticurl('energy_triangle.png')" mode=""></image>
			</view>

			<view class="progress" v-if="zhuruStatus">
				<view class="bg">
					<image :src="staticurl('energy_numbg.svg')" mode=""></image>
				</view>
				<view class="text">
					{{ percentage }}%
				</view>
			</view>
		</view>

		<view class="leftbtns">
			<view class="btnitem" @click="handleClickZhuru">
				<image :src="staticurl('energy_icon_inject.png')" mode=""></image>
			</view>
			<view class="btnitem" @click="handleClickClear">
				<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
			</view>
			<!-- <view class="btnitem" @click="handleClickSex('man')">
				<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
			</view>
			<view class="btnitem" @click="handleClickSex('madem')">
				<image :src="staticurl('energy_icon_remove.png')" mode=""></image>
			</view> -->
		</view>
		<view class="rightbtns">
			<view class="btnitem" @click="handleClickShowIcons('headCoord')">
				<image :src="staticurl('energy_icon_head.png')" mode=""></image>
			</view>
			<view class="btnitem" @click="handleClickShowIcons('limbCoord')">
				<image :src="staticurl('energy_icon_limbs.png')" mode=""></image>
			</view>
			<view class="btnitem" @click="handleClickShowIcons('trunkCoord')">
				<image :src="staticurl('energy_icon_torso.png')" mode=""></image>
			</view>
			<view class="btnitem" @tap="handleClickTurnaround">
				<image :src="staticurl('energy_icon_turnaround.png')" mode=""></image>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				clickSound: null,
				backgroundMusic: null, // 背景音乐音频对象
				backgroundTracks: [
					this.audiourl('music_bgm1.mp3'),
					this.audiourl('music_bgm2.mp3'),
					this.audiourl('music_bgm3.mp3'),
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
								[51.55325895230446, 7.572764503201758]
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
								[49.77811102331037, 21.35556864064603],
								[49.77811102331037, 25.035750336473754],
								[49.77811102331037, 29.277422611036343],
								[49.77811102331037, 34.12264468371467],
								[49.77811102331037, 38.953154244300976],
								[49.77811102331037, 43.79836810228802],
							],
							headCoord: [
								[51.55325895230446, 7.572764503201758]
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
								[50.28661694047014, 7.015475739059346]
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
								[50.28661694047014, 7.015475739059346]
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
				increment: 0.0001 // 每次增加的幅度
			};
		},
		computed: {
			showPoints() {
				return this.bodys[this.active][this.positive].points
			}
		},
		onLoad() {

		},
		onReady() {
			this.initClickSound()
			this.initBackgroundAudioSound()
			this.initCanvas()
			this.startSlowIncrease();
		},
		methods: {
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
				if (!this.zhuruStatus) {
					this.showIcon = false
				} else {
					setTimeout(() => {
						this.showIcon = true
					}, 2000)
				}
			},
			// 清除
			handleClickClear() {
				this.bodys[this.active][this.positive].points = []
			},
			// 点击躯干 头部这些
			handleClickShowIcons(type) {
				let points = this.bodys[this.active][this.positive][type]
				const findIndex = this.bodys[this.active][this.positive].points.findIndex(item => item.type == type)


				if (findIndex == -1) {
					points.forEach(item => {
						console.log(item)
						this.bodys[this.active][this.positive].points.push({
							x: item[0],
							y: item[1],
							type
						})
					})
				} else {
					this.bodys[this.active][this.positive].points = this.bodys[this.active][this.positive].points.filter(
						item => item.type != type)
				}


			},
			initBackgroundAudioSound() {
				// 随机选择一个背景音乐文件
				const randomIndex = Math.floor(Math.random() * this.backgroundTracks.length);
				const selectedTrack = this.backgroundTracks[randomIndex];
				// 创建背景音乐音频对象
				this.backgroundMusic = uni.createInnerAudioContext();
				this.backgroundMusic.src = selectedTrack; // 替换为背景音乐文件路径
				this.backgroundMusic.autoplay = true; // 自动播放
				this.backgroundMusic.loop = true; // 循环播放
				this.backgroundMusic.volume = 1;
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
				this.initCanvas()
			},
			handleClickSex(sex) {
				this.active = sex
				this.positive = 'front'
				this.initCanvas()
			},
			initCanvas() {
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
						}
					});
				});

			},
			handleTouch(e) {
				const touchX = e.touches[0].clientX;
				const touchY = e.touches[0].clientY;
				const offsetX = touchX - this.canvasRect.left;
				const offsetY = touchY - this.canvasRect.top;
				this.checkPixel(offsetX, offsetY)
			},
			checkPixel(x, y) {
				const _this = this
				uni.canvasGetImageData({
					canvasId: 'renwu',
					x: x,
					y: y,
					width: 1,
					height: 1,
					success(res) {
						const pixel = res.data;
						if (pixel[3] === 0) {
							console.log('点击的是透明区域');
						} else {
							console.log('点击的是不透明区域');
							_this.drawCircle(x, y)
						}
					}
				})
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

				this.bodys[this.active][this.positive].points.push({
					x: percentX,
					y: percentY
				})
			}
		}
	};
</script>


<style scoped lang="scss">
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		// background: red;
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

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.renwu {
		width: 593rpx;
		height: 1303rpx;
		// overflow: hidden;
		position: relative;

		.sanjiao {
			width: 600rpx;
			height: 572rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.guanghuan {
			width: 788rpx;
			height: 439rpx;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

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
		}
	}

	.leftbtns {
		position: absolute;
		top: 12%;
		left: 29rpx;

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
		right: 29rpx;

		.btnitem {
			width: 193rpx;
			height: 96rpx;

			image {
				width: 100%;
				height: 100%;
			}

		}
	}

	.yuan {
		width: 135rpx;
		height: 135rpx;
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
		animation: rotate 2s linear infinite;
		transform-origin: top left;

		&.big {
			width: 200rpx;
			height: 200rpx;

			image {
				width: 200rpx;
				height: 200rpx;
			}
		}

		image {
			width: 135rpx;
			height: 135rpx;
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
			z-index: -1;
		}
	}
</style>