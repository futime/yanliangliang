<template>
  <view class="page">
	<fa-navbar title=" " fontSize="4px"  :autoBack="true" :background="{ color: 'transparent' }" title-color=""
		:borderBottom="false" :placeholder="true" backIconColor="#fff" :is-back="true"></fa-navbar>

    <!-- 初始设置页面 -->
    <view v-if="currentStage === 'initial'" class="stage-container">
      <view class="breath-circle">
        <view class="breath-text">
          <text class="guide-text">跟随引导调整呼吸</text>
          <text class="guide-text">静心清气,缓解压力</text>
          <text class="guide-text">再将气息自然调整回正常</text>
        </view>
      </view>

      <view class="settings">
        <view class="setting-item" @click="showSceneSheet = true">
          <image class="icon" :src="staticurl('hxcj_icon.svg')"></image>
          <text class="setting-text">呼吸场景</text>
          <text class="setting-value">{{ selectedScene.text }}</text>
          <image class="arrow-right" :src="staticurl('arrow_icon.svg')"></image>
        </view>

        <view class="setting-item" @click="showTimeSheet = true">
          <image class="icon" :src="staticurl('hxsj_icon.svg')"></image>
          <text class="setting-text">呼吸时间</text>
          <text class="setting-value">{{ selectedTime.text }}</text>
          <image class="arrow-right" :src="staticurl('arrow_icon.svg')"></image>
        </view>
      </view>

      <view class="start-btn" @click="startCountdown">
        <text class="start-text">开始</text>
      </view>
    </view>

    <!-- 练习页面 -->
    <view v-if="currentStage === 'practice'" class="practice-container">
      <view class="timer-container">
        <text class="timer-text">{{ formatTime(remainingTime) }}</text>
      </view>

      <view class="practice-content">
        <view
          class="practice-circle"
          :style="{
            transform: `scale(${circleScale})`,
            borderRadius: circleBorderRadius,
          }"
        >
          <text class="breath-action"
            >{{ currentBreathAction }}{{ phaseRemaining }}s</text
          >
        </view>
      </view>

      <view class="exit-btn" @click="exitPractice">
        <text class="exit-text">退出</text>
      </view>

      <!-- 倒计时遮罩层 -->
      <view v-if="showCountdown" class="countdown-mask">
        <view class="countdown-container">
          <text class="countdown-number">{{ countdownNumber }}</text>
          <view class="countdown-guide">
            <text class="guide-text">跟随引导调整呼吸,</text>
            <text class="guide-text">静心屏气数秒,</text>
            <text class="guide-text">再将气息用嘴呼出。</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 完成页面 -->
    <view v-if="currentStage === 'complete'" class="complete-box">
      <view class="complete-container">
        <text class="complete-title">非常好</text>
        <text class="complete-subtitle">本次呼吸练习完成</text>
        <!-- <text class="complete-subtitle">第{{ practiceCount }}次呼吸练习完成</text> -->

        <view class="complete-content">
          <text class="complete-text"
            >在专注呼吸的时光，找寻真实的自己，所有简单的事务里，都有巨大的奇观。</text
          >
        </view>

        <view class="stats">
          <view class="stat-item">
            <text class="stat-label">{{ selectedScene.text }}</text>
            <text class="stat-value">练习</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">{{ practiceMinutes }}分钟</text>
            <text class="stat-value">呼吸时长</text>
          </view>
        </view>
      </view>

      <view class="complete-btn" @click="finishPractice">
        <text class="complete-text-btn">完成</text>
      </view>
    </view>
    <u-action-sheet
      :list="sceneList"
      v-model="showSceneSheet"
      @click="onSceneSelect"
      safeAreaInsetBottom
    ></u-action-sheet>
    <u-action-sheet
      :list="timeList"
      v-model="showTimeSheet"
      @click="onTimeSelect"
      safeAreaInsetBottom
    ></u-action-sheet>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStage: "initial", // initial, practice, complete
      selectedTime: { text: "1分钟", value: 60 },
      showCountdown: false,
      countdownNumber: 3,
      remainingTime: 60, // 60秒
      practiceCount: 1,
      practiceMinutes: 1,
      isBreathing: true,
      currentBreathAction: "吸气",
      // 定时器
      countdownTimer: null,
      practiceTimer: null,
      breathTimer: null,

      sceneList: [
        {
          text: "减压助眠",
          value: "https://yanliangliang.com/static/mp3/zhumian_bg01.mp3",
        },
        {
          text: "放松身心",
          value: "https://yanliangliang.com/static/mp3/fangsong_bg02.mp3",
        },
        {
          text: "平衡情绪",
          value: "https://yanliangliang.com/static/mp3/qingxu_bg03.mp3",
        },
      ],
      selectedScene: {
        text: "减压助眠",
        value: "https://yanliangliang.com/static/mp3/zhumian_bg01.mp3",
      },
      showSceneSheet: false,
      timeList: [
        { text: "1分钟", value: 60 },
        { text: "5分钟", value: 300 },
        { text: "10分钟", value: 600 },
      ],
      showTimeSheet: false,
      innerAudioContext: null,
      innerAudioContext2: null,
      breathPhases: [
        {
          name: "吸气",
          duration: 4,
          audio: "https://yanliangliang.com/static/mp3/xiqi_02.mp3",
        },
        {
          name: "屏气",
          duration: 8,
          audio: "https://yanliangliang.com/static/mp3/bingqi_03.mp3",
        },
        {
          name: "呼气",
          duration: 8,
          audio: "https://yanliangliang.com/static/mp3/huqi_01.mp3",
        },
      ],
      breathGroupCount: 5, // 默认1分钟5组
      currentGroup: 1,
      currentPhaseIndex: 0,
      phaseTimer: null,
      phaseRemaining: 0,
      phaseAudioContext: null,
      endAudioContext: null,
      circleScale: 0.8, // 初始为最小
      animating: false,
      circleBorderRadius: "50%", // 初始为正圆
      baseBorderArr: [50,50,50,50,50,50,50,50],
      phaseArr: [0,0,0,0,0,0,0,0],
      freqArr: [1,1,1,1,1,1,1,1],
      borderRadiusInterval: null,
      currentBorderArr: [50,50,50,50,50,50,50,50],
      targetBorderArr: [50,50,50,50,50,50,50,50],
    };
  },

  mounted() {
    this.initAudio();
  },

  methods: {
    startCountdown() {
      this.currentStage = "practice";
      this.showCountdown = true;
      this.countdownNumber = 3;
      this.currentGroup = 1;
      this.currentPhaseIndex = 0;
      if (this.phaseTimer) clearTimeout(this.phaseTimer);
      if (this.phaseAudioContext) this.phaseAudioContext.stop();
      this.countdownTimer = setInterval(() => {
        this.countdownNumber--;
        if (this.countdownNumber <= 0) {
          clearInterval(this.countdownTimer);
          this.showCountdown = false;
          this.startPractice();
        }
      }, 1000);
    },
    startPractice() {
      this.playAudio(); // 确保每次练习开始都播放背景音乐
      this.startBorderRadiusAnimation();
      // 计算 breathGroupCount
      const totalSec = this.selectedTime.value;
      this.breathGroupCount = Math.floor(totalSec / 20);
      this.remainingTime = totalSec; // 初始化总倒计时
      this.currentGroup = 1;
      this.currentPhaseIndex = 0;
      this.startBreathGroup();
    },
    startBreathGroup() {
      if (this.currentGroup > this.breathGroupCount) {
        this.completePractice();
        return;
      }
      this.currentPhaseIndex = 0;
      this.startBreathPhase();
    },
    startBreathPhase() {
      const phase = this.breathPhases[this.currentPhaseIndex];
      this.currentBreathAction = phase.name;
      this.phaseRemaining = phase.duration;
      this.playPhaseAudio(phase.audio);

      // 动画控制
      if (phase.name === "吸气") {
        // 吸气阶段，若上一组刚结束，scale 可能是0.8，需从0.8拉到1.3
        this.animateCircle(this.circleScale, 1.3, phase.duration * 1000);
      } else if (phase.name === "屏气") {
        this.setCircleScale(1.3);
      } else if (phase.name === "呼气") {
        this.animateCircle(1.3, 0.8, phase.duration * 1000);
      }

      if (this.phaseInterval) clearInterval(this.phaseInterval);
      this.phaseInterval = setInterval(() => {
        if (this.phaseRemaining > 1) {
          this.phaseRemaining--;
          if (this.remainingTime > 0) this.remainingTime--;
        } else {
          this.phaseRemaining = 0;
          if (this.remainingTime > 0) this.remainingTime--;
          clearInterval(this.phaseInterval);
          this.phaseInterval = null;
        }
      }, 1000);
      this.phaseTimer = setTimeout(() => {
        if (this.phaseInterval) {
          clearInterval(this.phaseInterval);
          this.phaseInterval = null;
        }
        this.currentPhaseIndex++;
        if (this.currentPhaseIndex >= this.breathPhases.length) {
          this.currentGroup++;
          this.startBreathGroup();
        } else {
          this.startBreathPhase();
        }
      }, phase.duration * 1000);
    },
    playPhaseAudio(src) {
      if (this.phaseAudioContext) {
        this.phaseAudioContext.stop();
        this.phaseAudioContext.destroy();
      }
      this.phaseAudioContext = uni.createInnerAudioContext();
      this.phaseAudioContext.src = src;
      this.phaseAudioContext.volume = 1;
      this.phaseAudioContext.play();
    },
    playEndAudio() {
      if (this.endAudioContext) {
        this.endAudioContext.stop();
        this.endAudioContext.destroy();
      }
      this.endAudioContext = uni.createInnerAudioContext();
      this.endAudioContext.src =
        "https://yanliangliang.com/static/mp3/huxiend_01.MP3";
      this.endAudioContext.volume = 1;
      this.endAudioContext.play();
    },
    playAudio() {
      // 背景音乐，音量0.5
      if (!this.innerAudioContext2) {
        this.initAudio();
      } else {
        this.innerAudioContext2.src = this.selectedScene.value;
        this.innerAudioContext2.volume = 0.5;
        this.innerAudioContext2.play();
      }
    },
    initAudio() {
      if (this.innerAudioContext2) {
        this.innerAudioContext2.destroy();
      }
      this.innerAudioContext2 = uni.createInnerAudioContext();
      this.innerAudioContext2.src = this.selectedScene.value;
      this.innerAudioContext2.loop = true;
      this.innerAudioContext2.volume = 0.5;
      this.innerAudioContext2.play();
    },
    completePractice() {
      this.clearAllTimers();
      // 彻底停止所有音频
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
        this.innerAudioContext.destroy();
        this.innerAudioContext = null;
      }
      if (this.innerAudioContext2) {
        this.innerAudioContext2.stop();
        this.innerAudioContext2.destroy();
        this.innerAudioContext2 = null;
      }
      if (this.phaseAudioContext) {
        this.phaseAudioContext.stop();
        this.phaseAudioContext.destroy();
        this.phaseAudioContext = null;
      }
      if (this.endAudioContext) {
        this.endAudioContext.stop();
        this.endAudioContext.destroy();
        this.endAudioContext = null;
      }
      this.currentStage = "complete";
      this.playEndAudio();
    },
    exitPractice() {
      this.clearAllTimers();
      // 彻底停止所有音频
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
        this.innerAudioContext.destroy();
        this.innerAudioContext = null;
      }
      if (this.innerAudioContext2) {
        this.innerAudioContext2.stop();
        this.innerAudioContext2.destroy();
        this.innerAudioContext2 = null;
      }
      if (this.phaseAudioContext) {
        this.phaseAudioContext.stop();
        this.phaseAudioContext.destroy();
        this.phaseAudioContext = null;
      }
      if (this.endAudioContext) {
        this.endAudioContext.stop();
        this.endAudioContext.destroy();
        this.endAudioContext = null;
      }
      this.currentStage = "complete";
      this.playEndAudio();
      // uni.navigateBack();
    },

    finishPractice() {
      uni.navigateBack();
    },

    clearAllTimers() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      if (this.practiceTimer) {
        clearInterval(this.practiceTimer);
        this.practiceTimer = null;
      }
      if (this.breathTimer) {
        clearInterval(this.breathTimer);
        this.breathTimer = null;
      }
      if (this.phaseTimer) {
        clearTimeout(this.phaseTimer);
        this.phaseTimer = null;
      }
      if (this.phaseAudioContext) {
        this.phaseAudioContext.stop();
        this.phaseAudioContext.destroy();
        this.phaseAudioContext = null;
      }
      if (this.endAudioContext) {
        this.endAudioContext.stop();
        this.endAudioContext.destroy();
        this.endAudioContext = null;
      }
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
      }
      this.stopBorderRadiusAnimation();
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    },
    onSceneSelect(index) {
      this.selectedScene = this.sceneList[index];
      this.playAudio();
    },
    onTimeSelect(index) {
      this.selectedTime = this.timeList[index];
      this.remainingTime = this.selectedTime.value;
    },
    animateCircle(from, to, duration) {
      // 保证每次都能执行动画
      this.animating = true;
      // 不再赋值border-radius，持续变化由interval控制
      const start = Date.now();
      const step = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        this.circleScale = from + (to - from) * progress;
        if (progress < 1) {
          setTimeout(step, 16);
        } else {
          this.circleScale = to;
          this.animating = false;
        }
      };
      step();
    },
    setCircleScale(val) {
      this.circleScale = val;
      this.animating = false;
    },
    startBorderRadiusAnimation() {
      if (this.borderRadiusInterval) clearInterval(this.borderRadiusInterval);
      // 随机初始化每个点的基础值、相位、频率
      this.baseBorderArr = Array.from({length:8},()=>50+Math.random()*10-5); // 45~55
      this.phaseArr = Array.from({length:8},()=>Math.random()*Math.PI*2);
      this.freqArr = Array.from({length:8},()=>0.5+Math.random()*1.2); // 0.5~1.7
      let startTime = Date.now();
      this.borderRadiusInterval = setInterval(() => {
        const t = (Date.now() - startTime) / 1000; // 秒
        let arr = [];
        for(let i=0;i<8;i++) {
          // 正弦波驱动，幅度可调
          arr[i] = this.baseBorderArr[i] + Math.sin(this.phaseArr[i] + t*this.freqArr[i]) * 7;
        }
        this.circleBorderRadius = this.arrToBorderRadius(arr);
      }, 16);
    },
    stopBorderRadiusAnimation() {
      if (this.borderRadiusInterval) {
        clearInterval(this.borderRadiusInterval);
        this.borderRadiusInterval = null;
      }
    },
    randomBorderArr() {
      return Array.from({length:8},()=>50+Math.random()*10-5); // 45~55初始
    },
    arrToBorderRadius(arr) {
      return `${arr[0].toFixed(1)}% ${arr[1].toFixed(1)}% ${arr[2].toFixed(1)}% ${arr[3].toFixed(1)}% / ${arr[4].toFixed(1)}% ${arr[5].toFixed(1)}% ${arr[6].toFixed(1)}% ${arr[7].toFixed(1)}%`;
    },
  },

  beforeDestroy() {
    this.clearAllTimers();
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
    if (this.innerAudioContext2) {
      this.innerAudioContext2.destroy();
      this.innerAudioContext2 = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #6e7b68 0%, #4e5650 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 背景canvas样式 */
.background-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.stage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 120rpx);
  padding: 0 60rpx;
  color: #fff;
  position: relative;
  z-index: 2;
}

/* 初始设置页面样式 */
.breath-circle {
  width: 420rpx;
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 120rpx;
  position: relative;
  z-index: 3;
  border-radius: 50%;
  background: rgba(217, 217, 217, 0.01);
  box-shadow: 0px 0px 30rpx 18rpx rgba(255, 255, 255, 0.15) inset;
}

.breath-text {
  text-align: center;
  line-height: 1.6;
}

.guide-text {
  font-size: 28rpx;
  color: #fff;
  display: block;
  margin-bottom: 10rpx;
}

.settings {
  width: 100%;
  margin-bottom: 120rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 40rpx 0;
  .icon {
    width: 30rpx;
    height: 30rpx;
  }
  .setting-text {
    flex: 1;
    font-size: 32rpx;
    color: #fff;
    margin-left: 20rpx;
  }

  .setting-value {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
    margin-right: 20rpx;
  }

  .arrow-right {
    width: 32rpx;
    height: 32rpx;
  }
}

.start-btn {
  width: 450rpx;
  height: 98rpx;
  background: rgba(114, 130, 110, 1);
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  .start-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 500;
  }
}

/* 倒计时遮罩层样式 */
.countdown-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.countdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-number {
  font-size: 320rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 80rpx;
}

.countdown-guide {
  text-align: center;
  line-height: 1.6;
}

.exit-btn {
  width: 500rpx;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .exit-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 500;
  }
}

/* 练习页面样式 */
.timer-container {
  margin-bottom: 100rpx;
  margin-top: 100rpx;
}

.timer-text {
  font-size: 80rpx;
  color: #fff;
  font-weight: bold;
}
.practice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding-bottom: 120rpx;
}
.practice-content {
  flex: auto;
}
.practice-circle {
  width: 420rpx;
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 120rpx;
  position: relative;
  z-index: 3;
  border-radius: 50%;
  background: rgba(217, 217, 217, 0.01);
  box-shadow: 0px 0px 30rpx 18rpx rgba(255, 255, 255, 0.15) inset;
  transition: border-radius 0.4s cubic-bezier(0.4,0,0.2,1);
}

.breath-action {
  font-size: 40rpx;
  color: #fff;
  font-weight: 500;
}

.complete-box {
  padding-left: 100rpx;
  padding-right: 80rpx;
  padding-top: 100rpx;
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
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
  }
}
</style>