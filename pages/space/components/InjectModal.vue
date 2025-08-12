<template>
    <view class="page" v-if="visible">
        <view class="page1" v-if="currentStage === 'page1'">
            <view class="headerbox">
                <view class="time"> {{ displayTime.time }} </view>
                <view class="tip"> 现在你已连接能量场 </view>
            </view>
            <view class="content">
                <scroll-view class="scroll-container" scroll-y="true" :scroll-top="scrollTop"
                    :scroll-with-animation="false" @scrolltolower="onScrollToLower" :show-scrollbar="false"
                    :style="{ height: '80%' }" :lower-threshold="100">
                    <view class="scroll-text-container" v-for="(item, index) in textLines1" :key="index">
                        <view class="text-line" v-for="(line, childIndex) in item"
                            :key="'line-' + index + '-' + childIndex" :class="{ 'space-line': line === 'SPACE' }">
                            {{ line === "SPACE" ? "" : line }}
                        </view>
                    </view>
                </scroll-view>
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
                [
                    "此刻想象一股能量",
                    "正缓缓流入刚点击的身体部位",
                    "感受身体产生的温热感",
                    "SPACE", // 间距标识
                    "让身体进入冥想状态",
                    "保持10至30分钟",
                    "感知体内湿寒驱散",
                    "身体疼痛变化",
                    "SPACE", // 间距标识
                    "如身体温热变化感知不明显",
                    "可点击重新注入按钮",
                    "再次点击需要注入能量的身体部位",
                    "SPACE", // 间距标识
                    "坚持每天能量冥想一次或多次",
                    "身体疼痛变化越明显",
                ],
                [
                    "此刻想象一股能量",
                    "正缓缓流入刚点击的身体部位",
                    "感受身体产生的温热感",
                    "SPACE", // 间距标识
                    "让身体进入冥想状态",
                    "保持10至30分钟",
                    "感知体内湿寒驱散",
                    "身体疼痛变化",
                    "SPACE", // 间距标识
                    "如身体温热变化感知不明显",
                    "可点击重新注入按钮",
                    "再次点击需要注入能量的身体部位",
                    "SPACE", // 间距标识
                    "坚持每天能量冥想一次或多次",
                    "身体疼痛变化越明显",
                ]

            ],
            showLine1: [],
            currentStage: 'page1',
            practiceCount: 1,
            practiceMinutes: 10,
            selectedScene: { text: '能量注入' },
            // 计时器相关
            startTime: null,
            endTime: null,
            practiceTimer: null,
            practiceSeconds: 0,
            visible: false,
            // 滚动相关
            scrollTop: 0,
            scrollTimer: null,
            displayTextLines: [], // 动态显示的文本行
            isScrolling: false, // 是否正在滚动
            loadedGroups: 0, // 已加载的组数
            isLoadingMore: false, // 是否正在加载更多
            clickSound: null,
            promptSound: null,
        };
    },
    mounted() {
        this.initClickSound();
        this.initPromptSound();
    },
    beforeDestroy() {
        this.clearAutoSwitch();
        this.stopPracticeTimer();
        this.clickSound.destroy();
        this.promptSound.destroy();
    },
    methods: {
        initClickSound() {
            this.clickSound = uni.createInnerAudioContext();
            this.clickSound.src = this.audiourl('energy_click.mp3'); // 请替换为你的音效文件路径
            this.clickSound.autoplay = false; // 不自动播放
            this.clickSound.loop = false; // 不循环播放
            this.clickSound.volume = 0.8; // 设置音量为 80%
        },

        initPromptSound() {
			this.scrollTimer = setInterval(() => {
				this.promptSound = uni.createInnerAudioContext();
				this.promptSound.src = this.audiourl('prompt_text.mp3'); // 请替换为你的音效文件路径
				this.promptSound.autoplay = false; // 不自动播放
				this.promptSound.loop = false; // 不循环播放
				this.promptSound.volume = 1; // 设置音量为 80%
				this.backgroundMusic.volume = 0.2;
			}, 50);
        },
        open() {
            this.visible = true
            // 重置滚动位置
            this.scrollTop = 0
            this.displayTextLines = []
            this.loadedGroups = 0
            this.isScrolling = false
            this.startPracticeTimer();
            this.$nextTick(() => {
                this.startScrollAnimation();
                this.promptSound.play();
            })
        },
        close() {
            this.visible = false
            this.stopPracticeTimer()
            this.stopScrollAnimation()

            // 重置所有数据到初始状态
            this.currentStage = 'page1'
            this.currentIndex = 0
            this.practiceSeconds = 0
            this.startTime = null
            this.endTime = null
            this.practiceTimer = null
            this.scrollTop = 0 // 重置滚动位置
            this.displayTextLines = [] // 重置显示文本
            this.loadedGroups = 0
            this.isScrolling = false
            this.isLoadingMore = false

            // 重置动画状态
            this.showLine1 = new Array(this.textLines1.length).fill(false)

            // 清除自动切换定时器
            this.clearAutoSwitch()
        },
        reInject() {
            this.close();
            this.stopPracticeTimer();
            this.$emit('reInject')
        },
        // 开始滚动动画
        startScrollAnimation() {
            // 延迟启动，确保DOM已渲染
            this.$nextTick(() => {

                // 开始自动滚动
                this.startAutoScroll();
            });
        },

        // 加载更多数据
        loadMoreData() {
            console.log(this.textLines1.length)
            // 添加新的一组数据
            this.textLines1.push([
                "此刻想象一股能量",
                "正缓缓流入刚点击的身体部位",
                "感受身体产生的温热感",
                "SPACE", // 间距标识
                "让身体进入冥想状态",
                "保持10至30分钟",
                "感知体内湿寒驱散",
                "身体疼痛变化",
                "SPACE", // 间距标识
                "如身体温热变化感知不明显",
                "可点击重新注入按钮",
                "再次点击需要注入能量的身体部位",
                "SPACE", // 间距标识
                "坚持每天能量冥想一次或多次",
                "身体疼痛变化越明显",
            ]);
        },

        // 开始自动滚动
        startAutoScroll() {
            this.isScrolling = true;
            this.scrollTimer = setInterval(() => {
                if (this.isScrolling) {
                    this.scrollTop += 0.5; // 慢速向下滚动
                }
            }, 30);
        },

        // 停止滚动动画
        stopScrollAnimation() {
            this.isScrolling = false;
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
                this.scrollTimer = null;
            }
        },
        onScrollToLower() {
            this.loadMoreData();
        },
        // 滚动事件处理
        onScroll(e) {
            const { scrollTop, scrollHeight } = e.detail;
            const query = uni.createSelectorQuery().in(this);

            query.select('.scroll-container').boundingClientRect((rect) => {
                if (rect) {
                    const containerHeight = rect.height;
                    const threshold = scrollHeight - containerHeight - 100; // 距离底部100px时触发

                    if (scrollTop >= threshold && !this.isLoadingMore) {
                        console.log('接近底部，加载更多数据');
                        this.isLoadingMore = true;
                        this.loadMoreData();
                        this.isLoadingMore = false;
                    }
                }
            }).exec();
        },

        // 停止滚动动画
        stopScrollAnimation() {
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer);
                this.scrollTimer = null;
            }
        },

        // 动态更新显示文本
        updateDisplayText() {
            // 暂时移除动态追加逻辑，使用静态重复 + 位置重置
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
            this.promptSound.stop();
            this.clickSound.play();
        },
        handleClickOk() {
            this.close();
            this.$emit('ok')
        }
    },
    computed: {
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
    overflow: hidden;
    background: linear-gradient(180deg, #6e7b68 0%, #4e5650 100%);


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
        background: rgba(109, 122, 103, 1);

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
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            .scroll-container {
                width: 100%;
                position: relative;
                overflow: hidden;

                // 添加渐变遮罩层
                &::before,
                &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 120rpx;
                    z-index: 10;
                    pointer-events: none;
                }

                &::before {
                    top: 0;
                    background: linear-gradient(to bottom,
                            rgba(109, 122, 103, 1) 0%,
                            rgba(109, 122, 103, 0.8) 30%,
                            rgba(109, 122, 103, 0.3) 60%,
                            rgba(109, 122, 103, 0) 100%);
                }

                &::after {
                    bottom: 0;
                    background: linear-gradient(to top,
                            rgba(109, 122, 103, 1) 0%,
                            rgba(109, 122, 103, 0.8) 30%,
                            rgba(109, 122, 103, 0.3) 60%,
                            rgba(109, 122, 103, 0) 100%);
                }

                .scroll-text-container {
                    &:first-child {
                        margin-top: 50%;
                    }

                    .text-line {
                        font-size: 28rpx;
                        color: #fff;
                        font-weight: 300;
                        line-height: 48rpx;
                        margin-bottom: 12rpx;
                        text-align: center;
                        opacity: 1;

                        &.space-line {
                            height: 40rpx;
                        }

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }

        .footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

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