import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		userInfo: {},
		userMeta: {},
		token: null,
		config: {},
		hasLogin: false,
		appInfo: {},
		noticeNum: {},
		homepage: [],
		tasks: {},
		swiper: [],
		homeTabs: [],
	},
	mutations: {
		setToken(state, payload) {
			state.token = payload
			state.hasLogin = true
			uni.setStorage({
				key: 'token',
				data: payload
			})
		},
		setUser(state, payload) {
			state.userInfo = payload
			uni.setStorage({
				key: 'user',
				data: payload
			})
		},
		setAppInfo(state, payload) {
			state.appInfo = payload
			uni.setStorage({
				key: 'appInfo',
				data: payload
			})
		},
		setHomepage(state, payload) {
			state.homepage = payload
			uni.setStorage({
				key: 'appHomepage',
				data: payload
			})
		},
		setUserMeta(state, payload) {
			state.userMeta = payload
			uni.setStorage({
				key: 'userMeta',
				data: payload
			})
		},
		loginStatus(state, payload) {
			state.hasLogin = true
		},
		setNoticeNum(state, payload) {
			state.noticeNum = payload
		},
		setTasks(state, payload) {
			state.tasks = payload
			uni.setStorage({
				key: 'userTasks',
				data: payload
			})
		},
		logout(state, payload) {
			uni.clearStorage('user');
			uni.clearStorage('token');
			uni.clearStorage('account');
			state.userInfo = {};
			state.token = null;
			state.hasLogin = false
			uni.reLaunch({
				url: '/pages/index/index'
			})
		},
		setSwiper(state, payload) {
			uni.setStorage({
				key: 'swiper',
				data: payload,
			})
			state.swiper = payload
		},
		setTabs(state, payload) {
			uni.setStorage({
				data: payload,
				key: 'homeTabs'
			})
			state.homeTabs = payload
		}
	}
})
export default store