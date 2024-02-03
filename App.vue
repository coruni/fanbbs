<script>
	import {
		mapMutations
	} from 'vuex';
	import config from '@/config/config.js'
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	import {
		http
	} from '@/utils/luch-request/http.js'
	import store from './store';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let token = uni.getStorageSync('token')
			if (token) {
				this.$store.commit('setToken', uni.getStorageSync('token'));
				this.$store.commit('setUser', uni.getStorageSync('user'));
				this.$store.commit('setUserMeta', uni.getStorageSync('userMeta'));
				this.$store.commit('loginStatus');
				this.getNoticeNum();
				this.getUserTasks()
			}
			setTimeout(() => {
				this.getAppData()
			}, 200)
		},
		onShow: function() {
			// #ifdef APP
			setTimeout(() => {
				this.getUpdate()
			}, 200)
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['setToken', 'setUser', 'setUserMeta']),

			getNoticeNum() {
				if (!store.state.hasLogin) return;
				http.get('/user/noticeNum', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setNoticeNum', res.data.data)
					}
				})
			},
			login() {
				let account = uni.getStorageSync('account')
				console.log(account, '账号信息')
				if (!account) return;
				http.get('/user/login', {
					params: {
						account: account.name,
						password: account.password
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.setToken(res.data.data.token);
						this.getUserInfo(res.data.data.uid);
						this.getUserMeta()
						uni.$emit('login', true)
					} else {
						this.$Router.push({
							path: '/pages/user/login'
						})
						// 还是登陆错误就到登录页面登录
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getUserInfo(uid) {
				http.get('/user/userInfo', {
					params: {
						id: uid
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.setUser(res.data.data);
					}
				})
			},
			getUserMeta() {
				http.post('/user/userData').then(res => {
					if (res.data.code) {
						this.setUserMeta(res.data.data)
					}
				})
			},
			getAppData() {
				http.get('/system/app', {
					params: {
						key: config.app
					}
				}).then(res => {
					this.$store.commit('setAppInfo', res.data.data.app)
					this.$store.commit('setHomepage', res.data.data.appHomepage)
				})
			},
			getUserTasks() {
				http.get('/user/tasks', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setTasks', res.data.data);
					}
				})
			},
			getUpdate() {
				let platform = uni.getSystemInfoSync().platform
				let data = {
					describe: '', // 版本更新内容 支持<br>自动换行
					edition_url: '', //apk、wgt包下载地址或者应用市场地址  安卓应用市场 market://details?id=xxxx 苹果store itms-apps://itunes.apple.com/cn/app/xxxxxx
					edition_force: 0, //是否强制更新 0代表否 1代表是
					package_type: 1, //0是整包升级（apk或者appstore或者安卓应用市场） 1是wgt升级
					edition_issue: 1, //是否发行  0否 1是 为了控制上架应用市场审核时不能弹出热更新框
					edition_number: 1, //版本号 最重要的manifest里的版本号 （检查更新主要以服务器返回的edition_number版本号是否大于当前app的版本号来实现是否更新）
					edition_name: '1.0.0', // 版本名称 manifest里的版本名称
					edition_silence: 0, // 是否静默更新 0代表否 1代表是
				}
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					this.$http.get('/system/app', {}).then(res => {
						if (res.data.code==200) {
							data.describe = res.data.data.app.versionIntro
							data.edition_url = platform == 'android' ? res.data.data.app.androidUrl : res.data
								.data.app
								.iosUrl
							data.edition_force = res.data.data.app.forceUpdate
							data.package_type = res.data.data.app.updateType
							data.edition_number = res.data.data.app.versionCode
							data.edition_name = res.data.data.app.version
							data.edition_silence = res.data.data.app.silence
							data.edition_issue = res.data.data.app.issue

							// 判断版本号
							if (Number(data.edition_number) > Number(inf.versionCode) && data
								.edition_issue == 1) {
								// 判断是否热更新
								if (data.package_type == 1 && data.edition_silence == 1) {
									silenceUpdate(data.edition_url)
								} else {
									setTimeout(() => {
										console.log('执行跳转')
										this.$Router.push({
											path: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update',
											query: {
												obj: JSON.stringify(data)
											}
										})
									}, 2000)

								}
							}
						}
					})

				});

			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'moe';
		src: url('/static/font/moe.ttf');

	}

	@import 'animate.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	/*引入等级图标*/
	@import './static/font/level/level.css';
	/*引入基础图标*/
	@import './static/font/ess/ess.css';

	body {
		font-family: 'moe';
	}

	.avatar_head {
		position: absolute;
		display: block;
		left: 50%;
		top: 50%;
		width: calc((100% - 2px) * 1.3);
		height: calc((100% - 2px) * 1.3);
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 2;
		image-rendering: -webkit-optimize-contrast;
	}

	.vipname {
		color: $c-primary;
	}

	.category {
		background: rgba($c-primary, 0.1);
		color: $c-primary;
	}

	.primary {
		color: $c-primary;
	}

	.primary-bg {
		background: $c-primary;
		color: white;
	}
</style>