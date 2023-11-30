<template>
	<view>
		<u-navbar title="更改挂件" placeholder autoBack></u-navbar>
		<view style="margin: 30rpx; height: 100%;">
			<view style="display: flex;justify-content: center;height: 400rpx;align-items: center;">
				<view style="position: relative;">
					<u-avatar :src="userInfo.avatar" :size="85"></u-avatar>
					<image :src="userInfo&& userInfo.opt && userInfo.opt.head_picture"
						class="avatar_head" mode="aspectFill"></image>
				</view>

			</view>
			<view style="margin-top: 30rpx;">
				<text style="background: #a899e61a;color: #a899e6;padding:8rpx 16rpx;border-radius: 10rpx;">自定义</text>
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
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				headPicture: [],
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoUsers/headpictureList', {
					params: {
						page,
						limit:50,
						searchParams: JSON.stringify({
							type: 0
						}),
						uid: this.userInfo.uid ? this.userInfo.uid : 0
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
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
		}
	}
</script>

<style lang="scss">

</style>