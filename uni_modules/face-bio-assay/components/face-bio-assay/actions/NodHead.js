import Action from "./Action.js"
class NodHead extends Action {
	constructor(second=10,fun,limit=1) {
		super(second,fun,limit,'请点头')
		this.maxPitch = 0
		this.minPitch = 0
	}
	takeFrame(faceData){
		let face = faceData.faceInfo[0]
		if(face.angleArray.pitch>this.maxPitch){
			this.maxPitch = face.angleArray.pitch
		}
		if(face.angleArray.pitch<this.minPitch){
			this.minPitch = face.angleArray.pitch
		}
		if(Math.abs(this.minPitch-this.maxPitch)>0.45 &&  (this.minPitch || this.maxPitch)  ){
			this.frames.push('点头')
			this.maxPitch = 0
			this.minPitch = 0
		}
	}
}

export default NodHead