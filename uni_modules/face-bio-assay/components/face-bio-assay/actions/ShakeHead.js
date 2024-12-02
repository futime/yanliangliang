import Action from "./Action.js"
class ShakeHead extends Action {
	constructor(second = 10, fun,limit=1) {
		super(second,fun,limit,'请摇头')
		this.minYaw = 0
		this.maxYaw = 0
	}
	takeFrame(faceData) {
		let face = faceData.faceInfo[0]
		if(face.angleArray.yaw>this.maxYaw){
			this.maxYaw = face.angleArray.yaw
		}
		if(face.angleArray.yaw<this.minYaw){
			this.minYaw = face.angleArray.yaw
		}
		if(Math.abs(this.minYaw-this.maxYaw)>0.45 && (this.minYaw || this.maxYaw) ){
			this.frames.push('摇头')
			this.minYaw = 0
			this.maxYaw = 0
		}
	}
}

export default ShakeHead
