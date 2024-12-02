const STATE = {
	ING:'ing',
	SUCCESS:'success',
	FAIL:'fail'
}
class Action {
	constructor(second=10,fun,limit,initTip) {
		this.second = second
		this.endTime = Infinity
		this.frames = []
		this.tip = initTip
		this.initTip = initTip
		this.state = STATE.ING
		this.fun = fun
		this.limit = limit
	}
	end(){
		if(this.fun){
			this.fun(this.state)
		}
	}
	check(faceData){
		if(this.endTime === Infinity){
			this.endTime = new Date().getTime() + (this.second*1000)
		}
		if(this.state !== STATE.ING ){
			return
		}
		if(new Date().getTime()>this.endTime){
			this.state = STATE.FAIL
			this.end()
			return
		}
		if(this.frames.length>=this.limit){
			this.state = STATE.SUCCESS
			this.end()
			return
		}
		this.takeFrameAfter(faceData)?.takeFrame(faceData)
	}
	takeFrame(faceData){
		
	}
	takeFrameAfter(faceData){
		let face = faceData.faceInfo[0]
		this.tip = this.initTip
		if(faceData.x == -1 || faceData.y == -1) {
		    this.tip = '检测不到人脸'
			return null
		}
		if(faceData.faceInfo.length > 1) {
		    this.tip = '请保证只有一人做核验'
			return null
		}
		return this
	}
}

export default Action