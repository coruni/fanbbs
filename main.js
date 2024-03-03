import moment from 'moment';
import App from './App';
import store from './store';
import config from "./config/config.js";

//引入websocket文件
import wsRequest from './utils/websocket/websocket.js'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import {
	router,
	RouterMount
} from '@/router.js' //路径换成自己的
Vue.use(router)
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app,
		store
	}
}
// #endif

// http模块
import {
	http
} from '@/utils/luch-request/http.js'
Vue.prototype.$http = http

//全局挂载表情数据
import emoji from '@/static/emoji/emoji.json'
Vue.prototype.$emoji = emoji

import level from '@/config/level.js'
Vue.prototype.$level = level
Vue.prototype.$config = config

if(store.state.hasLogin){
	//开启websocket
	let websocket = new wsRequest(config.websocket+`?token=${uni.getStorageSync('token')}`, 3000)
	//挂载到全局
	Vue.prototype.$socket = websocket
}
// 引入全局函数
import common from "./common/common.js"
Vue.prototype.$common = common