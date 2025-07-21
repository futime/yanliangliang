<template>
    <view class="page" v-if="visible">
        <view class="page1" v-if="currentStage === 'page1'">
            <view class="headerbox">
                <view class="time"> {{ displayTime.time }} </view>
                <view class="tip"> 现在你已连接能量场 </view>
            </view>
            <view class="content">
                <swiper class="swiper-container" :current="currentIndex" @change="handleSwiperChange" :autoplay="false"
                    :circular="false" :duration="500">
                    <!-- 第一段文案 - 有动画 -->
                    <swiper-item class="swiper-item">
                        <view class="text-container">
                            <view :class="[
                                'text-line',
                                { animate: showLine1[index] },
                                { 'space-line': line === 'SPACE' },
                            ]" v-for="(line, index) in textLines1" :key="index"
                                :style="{ 'animation-delay': index * 0.8 + 's' }">
                                {{ line === "SPACE" ? "" : line }}
                            </view>
                        </view>
                    </swiper-item>

                    <!-- 第二段文案 - 无动画 -->
                    <swiper-item class="swiper-item">
                        <view class="text-container">
                            <view :class="[
                                'text-line',
                                'no-animate',
                                { 'space-line': line === 'SPACE' },
                            ]" v-for="(line, index) in textLines2" :key="index">
                                {{ line === "SPACE" ? "" : line }}
                            </view>
                        </view>
                    </swiper-item>
                </swiper>

                <!-- 指示器小圆点 -->
                <view class="dots-indicator">
                    <view class="dot" :class="{ active: currentIndex === index }" v-for="(item, index) in 2"
                        :key="index" @click="switchToPage(index)"></view>
                </view>
            </view>
            <view class="footer">
                <view class="btn" @click="finishPractice"> 退出 </view>
                <view class="btn2" @click="reInject"> 重新注入 </view>
            </view>
        </view>
        <!-- 完成页面 -->
        <view v-if="currentStage === 'complete'" class="complete-box">
            <view class="complete-container">
                <text class="complete-title">非常好</text>
                <text class="complete-subtitle">你已完成今日能量注入</text>

                <view class="complete-content">
                    <text class="complete-text">坚持每天冥想一次以上 身体感知越明显。</text>
                </view>

                <view class="stats">
                    <view class="stat-item">
                        <text class="stat-label">{{ displayTime.time2 }}</text>
                        <text class="stat-value">注入时长</text>
                    </view>
                    <view class="stat-item">
                        <text class="stat-label">1天</text>
                        <text class="stat-value">连续注入天数</text>
                    </view>
                </view>
            </view>

            <view class="complete-btn" @click="handleClickOk">
                <text class="complete-text-btn">好的</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentIndex: 0,
            autoSwitchTimer: null,
            textLines1: [
                "此刻想象一股能量",
                "正缓缓流入刚点击的身体部位",
                "感受身体产生的温热感",
                "SPACE", // 间距标识
                "让身体进入冥想状态",
                "保持10至30分钟",
                "感知体内湿寒驱散",
                "身体疼痛变化",
            ],
            textLines2: [
                "如身体温热变化感知不明显",
                "可点击重新注入按钮",
                "再次点击需要注入能量的身体部位",
                "SPACE", // 间距标识
                "坚持每天能量冥想一次或多次",
                "身体疼痛变化越明显",
            ],
            showLine1: [],
            currentStage: 'page1',
            practiceCount: 1,
            practiceMinutes: 10,
            selectedScene: { text: '呼吸练习' },
            // 计时器相关
            startTime: null,
            endTime: null,
            practiceTimer: null,
            practiceSeconds: 0,
            visible: false,
        };
    },
    mounted() {
    },
    beforeDestroy() {
        this.clearAutoSwitch();
        this.stopPracticeTimer();
    },
    methods: {
        open() {
            this.visible = true
            this.startAnimation();
            this.startAutoSwitch();
            this.startPracticeTimer();
        },
        close() {
            this.visible = false
        },
        reInject() {
            this.close();
            this.stopPracticeTimer();
            this.$emit('reInject')
        },
        // 开始第一段文案的逐句动画
        startAnimation() {
            this.showLine1 = new Array(this.textLines1.length).fill(false);

            // 延迟启动第一段动画
            setTimeout(() => {
                this.textLines1.forEach((_, index) => {
                    setTimeout(() => {
                        this.$set(this.showLine1, index, true);
                    }, index * 800);
                });
            }, 500);
        },

        // 处理 swiper 切换
        handleSwiperChange(e) {
            this.currentIndex = e.detail.current;
            // 重置自动切换定时器
            this.restartAutoSwitch();
        },

        // 开始自动切换
        startAutoSwitch() {
            this.autoSwitchTimer = setInterval(() => {
                this.currentIndex = this.currentIndex === 0 ? 1 : 0;
            }, 10000); // 10秒切换
        },

        // 清除自动切换定时器
        clearAutoSwitch() {
            if (this.autoSwitchTimer) {
                clearInterval(this.autoSwitchTimer);
                this.autoSwitchTimer = null;
            }
        },

        // 重启自动切换定时器
        restartAutoSwitch() {
            this.clearAutoSwitch();
            this.startAutoSwitch();
        },

        // 点击小圆点切换页面
        switchToPage(index) {
            this.currentIndex = index;
            this.restartAutoSwitch();
        },

        // 开始计时
        startPracticeTimer() {
            this.startTime = Date.now();
            this.practiceTimer = setInterval(() => {
                this.practiceSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            }, 1000);
        },

        // 停止计时
        stopPracticeTimer() {
            if (this.practiceTimer) {
                clearInterval(this.practiceTimer);
                this.practiceTimer = null;
                this.endTime = Date.now();
            }
        },

        // 格式化显示时间（分:秒）
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return {
                time: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
                time2: `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`
            };
        },

        // 完成练习
        finishPractice() {
            this.stopPracticeTimer();
            this.currentStage = 'complete';
        },
        handleClickOk() {
            this.close();
            this.$emit('ok')
        }
    },
    computed: {
        // 实时显示的练习时长
        displayTime() {
            return this.formatTime(this.practiceSeconds);
        }
    },
};
</script>

<style lang="scss" scoped>
.page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000000;
    background: linear-gradient(180deg, #6e7b68 0%, #4e5650 100%);
    overflow: hidden;

    .page1 {
        padding-top: 30%;
        padding-bottom: 15%;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .headerbox {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .time {
                font-size: 130rpx;
                color: #fff;
                font-weight: 600;
                margin-bottom: 20rpx;
            }

            .tip {
                font-size: 38rpx;
                color: #fff;
                font-weight: 300;
            }
        }

        .content {
            flex: 1;
            padding: 0 60rpx;
            width: 100%;
            position: relative;

            .swiper-container {
                width: 100%;
                height: 100%;

                .swiper-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .text-container {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;

                        .text-line {
                            font-size: 28rpx;
                            color: #fff;
                            font-weight: 300;
                            line-height: 48rpx;
                            margin-bottom: 10rpx;
                            text-align: center;
                            opacity: 0;
                            transform: translateY(60rpx);
                            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

                            &.animate {
                                opacity: 1;
                                transform: translateY(0);
                            }

                            &.no-animate {
                                opacity: 1;
                                transform: translateY(0);
                                transition: none;
                            }

                            &.space-line {
                                height: 60rpx;
                                margin-bottom: 30rpx;

                                &.animate {
                                    opacity: 0; // 间距行始终保持透明
                                }

                                &.no-animate {
                                    opacity: 0; // 间距行始终保持透明
                                }
                            }

                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }

            .dots-indicator {
                position: absolute;
                bottom: 15%;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 16rpx;

                .dot {
                    width: 6rpx;
                    height: 6rpx;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.4);
                    transition: all 0.3s ease;
                    cursor: pointer;

                    &.active {
                        background-color: rgba(255, 255, 255, 1);
                        width: 20rpx;
                        border-radius: 8rpx;
                    }
                }
            }
        }

        .footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .btn {
                width: 450rpx;
                height: 98rpx;
                background: rgba(114, 130, 110, 1);
                color: #fff;
                border-radius: 60rpx;
                font-size: 42rpx;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn2 {
                color: rgba(255, 255, 255, 0.5);
                font-size: 28rpx;
                font-weight: 300;
                margin-top: 30rpx;
            }
        }
    }
}

.complete-box {
    padding-left: 100rpx;
    padding-right: 80rpx;
    padding-top: 30%;
}

/* 完成页面样式 */
.complete-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 120rpx;
}

.complete-title {
    font-size: 72rpx;
    color: #fff;
    margin-bottom: 20rpx;
}

.complete-subtitle {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 180rpx;
}

.complete-content {
    margin-bottom: 80rpx;
    line-height: 1.6;
}

.complete-text {
    font-size: 48rpx;
    line-height: 64rpx;
    color: #fff;
    display: block;
    margin-bottom: 10rpx;
    font-weight: 300;
}

.stats {
    display: flex;
    align-items: center;
    gap: 60rpx;
}

.stat-item {
    display: flex;
    flex-direction: column;
    padding-right: 60rpx;
    border-right: 1px solid rgba(255, 255, 255, 0.3);

    &:last-child {
        border-right: none;
    }

    .stat-label {
        font-size: 32rpx;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 10rpx;
    }

    .stat-value {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.5);
        font-weight: 500;
    }
}

.complete-btn {
    width: 559rpx;
    height: 120rpx;
    background: #fff;
    border-radius: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 120rpx;
    left: 50%;
    transform: translateX(-50%);

    .complete-text-btn {
        font-size: 45rpx;
        color: #333;
        font-weight: 500;
    }
}
</style>