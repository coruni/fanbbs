<template>
	<view>
		<u-navbar title="个人资料" autoBack placeholder>
			<view slot="right">
				<u-button size="mini" color="#a899e6" text="保存" @click="save()"></u-button>
			</view>
		</u-navbar>
		<view style="position: relative;top: 0;">
			<image src="/static/login.png" mode="aspectFill"
				style="width: 100%;height: 380rpx;border-radius: 0 0 40rpx 40rpx;box-shadow: #aaa 0rpx 4rpx 6rpx 0rpx;">
			</image>
			<view style="position: absolute;left: 50%;top:50%;transform: translate(-50%, -60%);">
				<image :src="info.avatar" mode="aspectFill"
					style="height: 180rpx;width: 180rpx;border-radius: 500rpx;border: 8rpx solid #fff;">
				</image>
				<u-icon name="plus" size="12" color="white"
					customStyle="background:#a899e6;position:absolute;top:70%;left:75%;border-radius:50rpx;padding:8rpx"></u-icon>
			</view>
		</view>
		<view style="margin:20rpx;">
			<u-text text="用户信息" bold size="18"></u-text>
			<u-gap height="10"></u-gap>
			<view>
				<u-text text="昵称" bold></u-text>
				<u-input border="bottom" v-model="info.screenName" placeholder="输入昵称"
					customStyle="padding:10rpx 0"></u-input>
			</view>
			<u-gap height="8"></u-gap>
			<view>
				<u-text text="简介" bold></u-text>
				<u--textarea border="bottom" v-model="info.introduce" placeholder="输入简介" customStyle="padding:10rpx 0"
					count maxlength="60"></u--textarea>
			</view>
			<u-gap height="8"></u-gap>
			<view>
				<u-text text="背景" bold></u-text>
				<view style="position: relative;top:0;" @click="backgroundChoose()">
					<image :src="info.userBg" mode="aspectFill" style="width: 100%;height: 350rpx;background: #f4f4f4;">
					</image>
					<u-icon name="camera" size="50" v-if="!info.userBg"
						style="position:absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);"></u-icon>
				</view>
			</view>
		</view>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg" @success="uploadBg($event.url); backgroundShow = false"
			@cancel="backgroundShow = false" is-disable-scale is-limit-move is-lock-ratio />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				info: {
					userBg: null,
				},
				backgroundImg: null,
				cropperBg: null,
				backgroundShow: false,
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.info = this.userInfo
		},
		methods: {
			backgroundChoose() {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						console.log(res.tempFilePaths)
						this.cropperBg = res.tempFilePaths[0]
						this.backgroundShow = true
						// this.uploadBg(res.tempFilePaths[0])
					}
				})
			},
			uploadBg(url) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					console.log(res)
					this.info.userBg = res.data.data.url
					// this.backgroundImg = res.data.data.url

				})
			},
			save(type, data) {
				this.$http.post('/typechoUsers/userEdit', {
					params: JSON.stringify({
						uid: this.info.uid,
						name: this.info.name,
						screenName: this.info.screenName,
						introduce: this.info.introduce,
						userBg: this.info.userBg,
					})
					}).then(res=>{
						console.log(res)
						if(res.data.code){
							uni.$u.toast('资料已更新')
							this.getUserInfo()
						}
				})
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.userInfo.uid
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

</style>
<image src="/static/login.png" mode="aspectFill"
	style="width: 100%;height: 380rpx;border-radius: 0 0 40rpx 40rpx;box-shadow: #f4f4f4 0rpx 4rpx 8rpx 4rpx;">
</image>