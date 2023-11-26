import moment from 'moment';
import App from './App';
import store from './store';
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
