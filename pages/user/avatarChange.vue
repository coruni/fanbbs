<template>
	<view>
		<u-navbar autoBack bgColor="transparent" leftIconColor="white" leftIcon="close" placeholder></u-navbar>
		<u-row customStyle="margin-top:40%">
			<u-avatar :src="$store.state.userInfo.avatar" size="280" customStyle="flex:1"></u-avatar>
		</u-row>
		<view
			style="padding:26rpx 20rpx; font-size:30rpx;color: white;background: rgba(255, 255, 255, 0.1);margin:40rpx;margin-top: 30% !important;border-radius: 20rpx;">
			<u-row customStyle="flex-direction:column">
				<text>更改头像挂件</text>
				<u-gap height="18"></u-gap>
				<text @click="choose()">修改头像</text>
			</u-row>
		</view>
		<l-clipper v-if="showClipper" :imageUrl="image" @success="upload($event.url);showClipper=false"
			@canel="showClipper = false" is-disable-scale is-limit-move is-lock-ratio></l-clipper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				showClipper: false,
				image: null,
			};
		},
		created() {
			if (this.$store.state.hasLogin) {
				this.info = this.$store.state.userInfo
			}
		},
		methods: {
			choose() {
				uni.chooseImage({
					count: 1,
					success: res => {
						this.image = res.tempFilePaths[0]
						this.showClipper = true
					}
				})
			},
			upload(url) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					if (res.data.code) {
						console.log(res.data.msg)
						this.save(res.data.data.url)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			save(url) {
				this.$http.post('/typechoUsers/userEdit', {
					params: JSON.stringify({
						uid: this.info.uid,
						name: this.info.name,
						avatar: url,
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('资料已更新')
						this.getUserInfo()
					}
				})
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.info.uid
					}
				}).then(res => {
					if (res.data.code) {
						this.$store.commit('setUser', res.data.data)
					}
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #1b1b1b;
	}
</style>