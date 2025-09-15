export default {
	install(Vue) {
		// 在 Vue 原型上挂载全局方法
		Vue.prototype.$watchPermission = function(callback) {
			if (uni.getSystemInfoSync().platform === 'android') {
				const permissionListener = uni.createRequestPermissionListener();

				permissionListener.onConfirm((e) => {
					console.log('Permission Confirmed:', e);
					if (callback && typeof callback === 'function') {
						callback('confirmed', e);
					}
				});

				permissionListener.onComplete((e) => {
					console.log('Permission Check Complete:', e);
					if (callback && typeof callback === 'function') {
						callback('complete', e);
					}
				});
			} else {
				callback('complete');
			}
		};


	}
};