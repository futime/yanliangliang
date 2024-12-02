class ActionContainer {
	//动作组 actions
	//起始动作下标 index
	//初始提示 tip
	//绑定 完成所有动作的回调 endFun
	//绑定 动作进行中 ingFun
	//绑定 动作完成时 successFun
	//绑定 动作失败时 failFun
	constructor(actions, index, tip, endFun, ingFun, successFun, failFun) {
		this.actions = actions || []
		this.index = index || 0
		this.tip = tip || '检测不到人脸'
		this.endFun = endFun || this.__tempFun
		this.ingFun = ingFun || this.__tempFun
		this.successFun = successFun || this.__tempFun
		this.failFun = failFun || this.__tempFun
	}
	__tempFun(){
		
	}
	next(faceData) {
		if (this.index >= this.actions.length) {
			this.endFun()
			return this
		}
		if (this.actions[this.index].state === 'ing') {
			this.tip = this.actions[this.index].tip
			this.actions[this.index].check(faceData)
			this.ingFun()
			return this
		} else if (this.actions[this.index].state === 'success') {
			this.index++;
			this.successFun()
			return this
		} else if (this.actions[this.index].state === 'fail') {
			this.failFun()
			return this
		}
		return this
	}
	end(fun) { //绑定 完成所有动作的回调
		this.endFun = fun || this.__tempFun
		return this
	}
	ing(fun) { //绑定 动作进行中
		this.ingFun = fun || this.__tempFun
		return this
	}
	success(fun) { //绑定 动作完成时
		this.successFun = fun || this.__tempFun
		return this
	}
	fail(fun) { //绑定 动作失败时
		this.failFun = fun || this.__tempFun
		return this
	}
}

export default ActionContainer
