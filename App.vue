<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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