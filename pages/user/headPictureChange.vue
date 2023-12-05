<template>
	<view>
		<u-navbar title="更改挂件" placeholder autoBack></u-navbar>
		<view style="margin: 30rpx; height: 100%;">
			<view style="display: flex;justify-content: center;height: 400rpx;align-items: center;">
				<view style="position: relative;">
					<u-avatar :src="userInfo.avatar" :size="85"></u-avatar>
					<image :src="userInfo&& userInfo.opt && userInfo.opt.head_picture" class="avatar_head"
						mode="aspectFill"></image>
				</view>

			</view>
			<view style="margin-top: 30rpx;display: flex; align-items: center; justify-content: space-between;">
				<text style="background: #85a3ff1a;color: #85a3ff;padding:8rpx 16rpx;border-radius: 10rpx;"
					@click="showHeadUpload = true">自定义</text>
				<text style="background: #85a3ff1a;color: #85a3ff;padding:8rpx 16rpx;border-radius: 10rpx;" @click="showMyHead = true">我的头像框</text>
			</view>

		</view>
		<z-paging @query="getData" ref="paging" v-model="headPicture" :fixed="false" :refresher-enabled="false"
			use-page-scroll>
			<u-grid col="4">
				<u-grid-item v-for="(item,index) in headPicture" :key="index"
					customStyle="flex-wrap:wrap;height:180rpx;width:180rpx"
					@click="$u.throttle(setHeadPicture(item),1000,true)">
					<view style="position: relative;top: 0;margin:30rpx;padding-left: 10rpx">
						<u-avatar :src="userInfo.avatar" size="60"></u-avatar>
						<image :src="item.link" class="avatar_head" mode="aspectFit"></image>
					</view>
				</u-grid-item>
			</u-grid>
			<view slot="loadingMoreNoMore"></view>
		</z-paging>
		<!-- 自定义头像框 -->
		<u-popup mode="center" round="10" :show="showHeadUpload" @close="showHeadUpload = false">
			<view style="padding: 30rpx;width: 500rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<text>自定义头像框</text>
					<view style="position: relative;margin: 50rpx 0;" @click="chooseHead()">
						<u-avatar :src="userInfo.avatar" :size="85"></u-avatar>
						<image :src="uploadHeadPic" class="avatar_head" mode="aspectFill"></image>
					</view>
					<view
						style="margin-top: 20rpx;color: #999;font-size: 24rpx;display: flex;align-items:  flex-start;">
						<u-icon name="question-circle" color="#999"></u-icon>
						<text style="margin-left:10rpx;">头像框标准大小为318*318请勿使用其他规格的头像框，在上传之前请先预览头像框是否正常</text>
					</view>
				</view>
				<view style="margin-top: 20rpx;">
					<u-button color="#85a3ff" shape="circle" @click="addHead()">确认上传</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 我的头像框 -->
		<u-popup round="10" :show="showMyHead" @close="showMyHead=false" :closeable="true">
		<view style="padding: 30rpx;height: 60vh;">
			<view style="margin-top: 20rpx;">
				<text>我的头像框</text>
			</view>
			<z-paging :fixed="false" use-page-scroll ref="myhead" v-model="myHead" @query="getMyHead">
				<u-grid col="4">
					<u-grid-item v-for="(item,index) in myHead" :key="index"
						customStyle="flex-wrap:wrap;height:180rpx;width:180rpx"
						@click="$u.throttle(setHeadPicture(item),1000,true)">
						<view style="position: relative;top: 0;margin:30rpx;padding-left: 10rpx">
							<u-avatar :src="userInfo.avatar" size="55"></u-avatar>
							<image :src="item.link" class="avatar_head" mode="aspectFit"></image>
						</view>
					</u-grid-item>
				</u-grid>
			</z-paging>
		</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import album from '../../uni_modules/uview-ui/libs/config/props/album';
	import upload from '../../uni_modules/uview-ui/libs/config/props/upload';
	export default {
		data() {
			return {
				showMyHead: false,
				showHeadUpload: false,
				headPicture: [],
				uploadHeadPic: null,
				myHead: [],
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/TypechoHeadpicture/headList', {
					params: {
						page,
						limit: 50,
						searchParams: JSON.stringify({
							type: 1
						}),
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			getMyHead() {
				this.$http.get('/TypechoHeadpicture/headList', {
					params: {
						limit: 50,
						searchParams: JSON.stringify({
							type: 0
						}),
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : '',
						self: true
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.myHead = res.data.data
					}
				})
			},
			setHeadPicture(data) {
				let opt = this.userInfo.opt
				if (!opt) {
					opt = {}
				}
				opt.head_picture = data.id
				this.$http.post('/typechoUsers/userEdit', {
					params: JSON.stringify({
						name: this.userInfo.name,
						uid: this.userInfo.uid,
						opt: JSON.stringify(opt)
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
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
						uni.$u.toast('头像框已更新')
					}

				}).catch(err => {
					console.log(err)
				})
			},
			chooseHead() {
				uni.chooseImage({
					sizeType: ['original'],
					sourceType: ['album'],
					extension: ['png', 'webp'],
					success: (res) => {
						this.uploadHeadPic = res.tempFilePaths[0]
					}
				})
			},
			async addHead() {
				console.log(this.userInfo.groupKey, this.userInfo.isvip)
				if (!this.userInfo.isvip && this.userInfo.groupKey !== 'administrator' && this.userInfo.groupKey !==
					'editor') {
					uni.$u.toast('非会员用户无法使用');
					return;
				}
				if (this.uploadHeadPic == null || this.uploadHeadPic == '') {
					uni.$u.toast('你还没有选择头像框');
					return;
				}
				uni.showLoading({
					title: '上传中...',
					mask: true,
				})
				let headImg = await this.upload()
				if (headImg) {
					let params = {
						name: `用户${this.userInfo.uid}`,
						link: headImg,
						status: 1,
						type: 0,
						permission: 0,
					}
					this.$http.post('/TypechoHeadpicture/headAdd', {
						params: JSON.stringify(params)
					}).then(res => {
						console.log(res)
						if (res.data.code)[
							this.setHeadPicture(res.data.data)
						]
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast(res.data.msg)
						}, 800)

					}).catch(err => {
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast('网络错误')
						}, 800)
					})

				}
			},
			upload() {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: this.uploadHeadPic,
						name: 'file'
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						}
					}).catch(err => {
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast('网络错误')
						}, 800)
					})
				})
			},
		}
	}
</script>

<style lang="scss">

</style>