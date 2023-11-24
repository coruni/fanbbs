<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if (uni.getStorageSync('token')) {
				this.$store.commit('setToken', uni.getStorageSync('token'))
				this.$store.commit('setUser', uni.getStorageSync('user'))
				this.$store.commit('setUserMeta', uni.getStorageSync('userMeta'))
				this.$store.commit('loginStatus')
				//检测登录状态
				setTimeout(() => {
					this.checkStstus()
				}, 200)

			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['setToken', 'setUser', 'setUserMeta']),
			checkStstus() {
				this.$http.post('/typechoUsers/userStatus').then(res => {
					if (!res.data.code) {
						//状态不通过重新登录
						this.login()
					}
				})
			},
			login() {
				let account = uni.getStorageSync('account')
				if (!account) return;
				this.$http.post('/typechoUsers/userLogin', {
					params: JSON.stringify({
						...account
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.setToken(res.data.data.token);
						this.getUserInfo(res.data.data.uid);
						this.getUserMeta()
						uni.$emit('login', true)
						setTimeout(() => {
							this.$Router.back(1)
						}, 2000)
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
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: uid
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.setUser(res.data.data);
					}
				})
			},
			getUserMeta() {
				this.$http.post('/typechoUsers/userData').then(res => {
					if (res.data.code) {
						this.setUserMeta(res.data.data)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'moe';
		src: url('/static/font/moe.ttf');

	}

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

	@import 'animate.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
</style>