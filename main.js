import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import * as Util from '@/common/util.js'
//原型追加工具函数
Vue.prototype.$util = Util;
Vue.prototype.$api = {};//定义api对象


// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

Vue.filter('formatreceive',function(value){
	console.log(value)
	if(!value){
		return '';
	}
	let arr = value.replace(/\s\d{2}:\d{2}:\d{2}/g,'').split(' - ');
	if (arr.length == 2) {		
		return arr[0] + '至' + arr[1] + '有效';
	}
	return '';
})

import {tools} from '@/common/fa.mixin.js'
Vue.mixin(tools)

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)


//皮肤色处理
let styleMixin = require('@/common/fa.style.mixin.js')
Vue.mixin(styleMixin)

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store'

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)


const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

//路由拦截
import route from '@/common/fa.route.js'
Vue.use(route, app);

app.$mount()
