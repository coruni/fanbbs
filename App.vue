<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if (uni.getStorageSync('token')) {
				this.$store.commit('setToken', uni.getStorageSync('token'))
				this.$store.commit('setUser', uni.getStorageSync('user'))
				this.$store.commit('setUserMeta', uni.getStorageSync('userMeta'))
				this.$store.commit('loginStatus')
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
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
	@import 'animate.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
</style>