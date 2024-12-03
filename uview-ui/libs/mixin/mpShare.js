module.exports = {
	onLoad() {
		// 设置默认的转发参数
		this.$u.mpShare = {
			title: '眼靓亮 - 能量空间',
			path: '/pages/index/index',
			imageUrl: 'https://yanliangliang.com/static/images/mpshare.jpg'
		}
	},
	onShareAppMessage() {
		return this.$u.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.$u.mpShare
	}
	// #endif
}
