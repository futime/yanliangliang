module.exports = {
	onLoad() {
		// 设置默认的转发参数
		this.$u.mpShare = {
			title: '', // 默认为小程序名称
			path: '', // 默认为当前页面路径
			imageUrl: '', // 默认为当前页面的截图
			article: ''
		}
	},
	async onShareAppMessage() {
		if (this.$u.mpShare.article) {
			await this.$api.postShare({
				id: this.$u.mpShare.article
			})
		}
		return this.$u.mpShare
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		return this.$u.mpShare
	}
	// #endif
}