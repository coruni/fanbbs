<template>
	<view>
		<u-navbar title="个人资料" autoBack placeholder>
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="display: flex;justify-content: center;flex-direction: column;margin: 30rpx;">
			<view style="margin-top: 100rpx;display: flex;justify-content: center;">
				<view style="position: relative;">
					<u-avatar :src="userInfo.avatar" mode="aspectFill" size="85">
					</u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="userInfo.opt&&userInfo.opt.head_picture">
					</image>
				</view>

			</view>
			<view style="margin-top: 50rpx; display: flex; justify-content: space-between;align-items: center;">
				<view style="background: #85a3ff1e;border-radius: 20rpx;flex: 1;text-align: center;padding: 10rpx;"
					@click="choose(true)">
					<text style="font-size: 28rpx;">修改头像</text>
				</view>
				<view @click="goHeadPicture()"
					style="margin-left:20rpx;background: #85a3ff1e;border-radius: 20rpx;flex: 1;text-align: center;padding: 10rpx;">
					<text style="font-size: 28rpx;">修改头像框</text>
				</view>
			</view>
		</view>
		<view style="margin:30rpx;">
			<view>
				<u-text text="昵称" bold color="#999"></u-text>
				<u-input type="text" v-model="info.screenName" placeholder="输入昵称" maxlength="20" :showWordLimit="true"
					customStyle="padding:10rpx 20rpx;border-radius:10rpx">
					<view slot="suffix">
						<text
							style="font-size: 26rpx;color: #999;">{{info.screenName&&info.screenName.length}}/20</text>
					</view>
				</u-input>
			</view>
			<u-gap height="10"></u-gap>
			<view>
				<u-text text="性别" bold color="#999"></u-text>
				<view @tap.stop="showSexChoose = true">
					<u-input type="idcard" v-model="info.sex" placeholder="选择性别"
						customStyle="padding:10rpx 20rpx;border-radius:10rpx" :disabled="showSexChoose" disabledColor="none">
						<view slot="suffix">
							<u-icon name="arrow-right" color="#999" size="12"></u-icon>
						</view>
					</u-input>
				</view>
			</view>
			<u-gap height="10"></u-gap>
			<view>
				<u-text text="个性签名" bold color="#999"></u-text>
				<u--textarea v-model="info.introduce" placeholder="输入简介"
					customStyle="padding:10rpx 20rpx;border-radius:10rpx" count maxlength="48"></u--textarea>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;">
			<view style="margin: 30rpx;">
				<u-button color="#85a3ff" text="保存" shape="circle" @click="save()"></u-button>
			</view>
		</view>
		<u-popup mode="bottom" round="10" :show="showSexChoose" @close="showSexChoose = false">
			<view style="margin: 30rpx;">
				<text style="font-weight: 600;">性别</text>
			</view>
			<block v-for="(item,index) in sexList" :key="index">
				<view style="padding: 20rpx 30rpx;" @click="info.sex = item;showSexChoose = false"
					hover-class="button-hover">
					<text>{{item}}</text>
				</view>
			</block>
			<u-gap height="20"></u-gap>
		</u-popup>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg"
			@success="upload($event.url,false); backgroundShow = false" @cancel="backgroundShow = false" is-limit-move
			is-lock-ratio :width="1280" :height="720" :min-width="1280" :min-height="720" :max-width="1920"
			:max-height="720" />

		<l-clipper v-if="showClipper" :imageUrl="avatarImage"
			@success="upload($event.url,true);showClipper=false;showLoading=true" @canel="showClipper = false"
			is-limit-move is-lock-ratio />

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
				avatarImage: null,
				cropperBg: null,
				backgroundShow: false,
				showClipper: false,
				showSexChoose: false,
				sexList: ['男', '女', '其他', '保密']

			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.info = this.userInfo
			console.log(this.info)
		},
		methods: {
			choose(isAvatar) {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						if (isAvatar) {
							this.avatarImage = res.tempFilePaths[0];
							this.showClipper = true
						} else {
							this.cropperBg = res.tempFilePaths[0];
							this.backgroundShow = true
						}

					}
				})
			},
			upload(url, isAvatar) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					if (res.data.code) {
						if (isAvatar) this.info.avatar = res.data.data.url;
						else this.info.userBg = res.data.data.url;
						this.save()
					}
				})
			},
			save() {
				this.$http.post('/user/update', {
					introduce: this.info.introduce,
					sex: this.info.sex,
					nickname: this.info.screenName,
					avatar: this.info.avatar,
					background: this.info.userBg
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.getUserInfo()
					}
				})
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/user/userInfo', {
					params: {
						id: this.userInfo.uid,
					}
				}).then(res => {
					console.log(res)
					if (res.data.code==200) {
						this.$store.commit('setUser', res.data.data)
						uni.$u.toast('资料已更新')
					}

				}).catch(err => {
					console.log(err)
				})
			},
			goHeadPicture() {
				this.$Router.push({
					name: 'headPictureChange'
				})
			}

		}
	}
</script>

<style lang="scss">
	.button-hover {
		background: #85a3ff0a;
	}
</style>