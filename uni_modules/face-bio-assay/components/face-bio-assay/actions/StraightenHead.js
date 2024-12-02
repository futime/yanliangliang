import Action from "./Action.js"
class StraightenHead extends Action {
	constructor(second = 10, fun, limit=10) {
		super(second, fun, limit, '请平视摄像头')
	}
	takeFrame(faceData) {
		let face = faceData.faceInfo[0]
		if (Math.abs(face.angleArray.pitch) >= 0.3 || Math.abs(face.angleArray.roll) >= 0.2 || Math.abs(face
				.angleArray.yaw) >= 0.2) {
			this.frames = []
			return
		} 
		if (Math.abs(face.confArray.global) <= 0.8 || Math.abs(face.confArray.leftEye) <= 0.8 || Math.abs(
				face.confArray.mouth) <=
			0.8 || Math.abs(face.confArray.nose) <= 0.8 || Math.abs(face.confArray.rightEye) <= 0.8) {
			this.tip = '请勿遮挡五官'
			this.frames = []
			return
		} 
		this.tip = '正在核验，请保持'
		this.frames.push('正')
	
	}
}


export default StraightenHead
