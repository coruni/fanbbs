<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(uni.getStorageSync('user')) this.$store.commit('setUser',uni.getStorageSync('user'));
			if(uni.getStorageSync('token')) this.$store.commit('setToken',uni.getStorageSync('token'))
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
	body{
		font-family: 'moe';
	}
	@import 'animate.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
</style>