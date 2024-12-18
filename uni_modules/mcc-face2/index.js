export default {
	web: false,
	getis() {
		return new Promise((a, b) => {
			plus.io.resolveLocalFileSystemURL('_www/uni_modules/mcc-face/static/face.js', function(entry) {
				a(true)
			}, function() {
				a(false)

			})
		})
	},
	close() {
		this.web.evalJS('faceDetection.ClosedataStream()');
		plus.webview.close(this.web)
	},
	sethtml(e) {
		this.web.evalJS(e);
	},
	getimg(fn = function() {}) {
		this.web.evalJS('faceDetection.getimg()');
		uni.$on('getimgdata', function(data) {
			uni.$off('getimgdata')
			fn(data)
		})
	},
	opendataStream(fn) {
		let _this=this;
		let _open = true;
		this.web.evalJS('faceDetection.opendataStream()');
		uni.$on('getStreamdata', function(data) {
			if (_open) {
				fn(data, () => {
					_open = false;
					_this.ClosedataStream()
					 uni.$off('getStreamdata')
				})
			}
		})
	},
	ClosedataStream() {
		this.web.evalJS('faceDetection.ClosedataStream()');
	},
	open(callback = function() {}) {
		let _this = this;
		return new Promise(async (a, b) => {
			if (await this.getis()) {
				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
					fs.root.getFile('face.html', {
						create: true
					}, function(fileEntry) {
						fileEntry.file(function(file) {
							fileEntry.createWriter(function(writer) {
								writer.write(
									'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head><body></body></html>'
								);
								_this.web = plus.webview.create(
									'_doc/face.html', Math.round(Math
										.random() *
										80 + 20), {
										'uni-app': 'none',
										"background": '#0000',
										"backButtonAutoControl": 'close',
										top: 0
									}, 'zoom-fade-out');
								let _open = false;
								plus.globalEvent.addEventListener(
									'plusMessage',
									function(e) {
										if (e.data.ok) {
											a()
										}
										if (e.data.data!=='') {
											uni.$emit('getStreamdata', e.data.data)
										}
										if (e.data.img) {
											uni.$emit('getimgdata', e.data.img)
										}
									})

								_this.web.appendJsFile(
									'_www/uni_modules/mcc-face2/static/face.js'
									);
								_this.web.setCssFile(
									'_www/uni_modules/mcc-face2/static/index.css'
									);
								_this.web.appendJsFile(
									'_www/uni_modules/mcc-face2/static/index.js'
									);
								_this.web.show();
							})
						})
					})
				})
			}
		})

	}
}