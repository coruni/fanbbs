import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		userInfo: {},
		token: null,
		config: {},
		hasLogin: false,
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
		loginStatus(state,payload){
			state.hasLogin = true
		},
		logout(state, payload) {
			uni.clearStorage('user');
			uni.clearStorage('token');
			state.userInfo = {};
			state.token = null;
		}
	}
})
export default store