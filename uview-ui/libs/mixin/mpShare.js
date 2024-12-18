module.exports = {
	onLoad() {
		// 设置默认的转发参数
		console.log(this.vuex_user.recdkey)
		this.$u.mpShare = {
			title: '眼靓亮 - 能量空间',
			path: '/pages/index/index?recdkey=' + this.vuex_user.recdkey,
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