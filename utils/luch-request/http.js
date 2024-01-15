import cConfig from '@/config/config.js'
import Request from '@/utils/luch-request/index.js'
import store from '@/store'
import {
	router
} from '@/router.js'
const http = new Request()
// 全局配置
http.setConfig((config) => {
	config.baseURL = cConfig.api
	config.header = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}
	config.timeout = 60 * 1000
	return config
})


// 请求拦截
//   所有的网络请求都会先走这个方法
http.interceptors.request.use((config) => {
	config.header = {
		...config.header,
		'Authorization': uni.getStorageSync('token')
	}

	if (!store.state.hasLogin && config.method == 'POST') {
		router.push({
			path: '/pages/user/login',
			animationType: 'slide-in-bottom',
			animationDuration: 500
		})
		return Promise.reject(config)
	}
	return config
}, (config) => {
	return Promise.reject(config)
})

// 刷新请求
const is_fresh = false
const refresh = new Request()
refresh.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = cConfig.api
	config.timeout = 60 * 1000
	return config
})

// 请求后刷新
const againHttp = new Request()
againHttp.interceptors.request.use(config => {
	config.baseURL = cConfig.api
	return config
}, error => {
	return Promise.reject(error)
})
// 响应拦截
//   所有的网络请求返回数据之后都会先执行这个方法
http.interceptors.response.use(async (response) => {
	if (store.state.hasLogin && response.data.code==401) {
		let account = uni.getStorageSync('account')
		try {
			const res = await refresh.get('/user/login', {
				params: {
					account: account.name,
					password: account.password
				}
			})
			if (res.data.code==200) {

				store.commit('setToken', res.data.data.token)
				try {
					const againhttp = await againHttp.middleware(response.config)
					return againhttp
				} catch (e) {
					//TODO handle the exception
					return Promise.reject(e)
				}
			} else {
				uni.$u.toast('请重新登录')
				store.commit('logout')
				router.push({
					path: '/pages/user/login',
					animationType: 'slide-in-bottom',
					animationDuration: 500
				})
			}
		} catch (e) {
			//TODO handle the exception
			return Promise.reject(e)
		}
	}

	return response
}, error => {
	return Promise.reject(error)
})

export {
	http
}