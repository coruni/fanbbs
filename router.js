import {
	RouterMount,
	createRouter,
	runtimeQuit
} from 'uni-simple-router';
import store from './store';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routerErrorEach: ({
		type,
		level,
		...args
	}) => {
		console.log({
			type,
			level,
			...args
		})
		// #ifdef APP-PLUS
		if (type === 3) {
			router.$lockStatus = false;
			runtimeQuit();
		}
		// #endif
	},
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (!store.state.hasLogin && to.perm == 'login') {
		next({
			path: '/pages/user/login',
			animationType: 'slide-in-bottom',
			animationDuration: 500
		})
		router.$lockStatus = false
	} else {
		next();
	}

});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}