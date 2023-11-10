<template>
	<z-paging only-refresh>
		<template #top>
			<u-navbar autoBack bg-color="rgba(255,255,255,0)"></u-navbar>
		</template>
		<image :src="info.avatar" mode="aspectFill" style="width: 100%;height: 380rpx;background: #000;"></image>
		<view style="position: relative;top: -50rpx;background: #fff;border-radius: 40rpx 40rpx 0 0;">
			<u-avatar :src="info.avatar" size="80"
				customStyle="position:absolute;top:-80rpx;margin-left:60rpx;border:6rpx solid #fff"></u-avatar>
			<u-row justify="end" customStyle="padding:20rpx">
				<view>
					<u-button color="#FB7299C4" plain size="normal"
						customStyle="height:50rpx;border-radius:20rpx">私信</u-button>
				</view>
				<view style="margin-left:30rpx">
					<u-button color="#FB7299C4" size="normal"
						customStyle="height:50rpx;padding:0 60rpx ;border-radius:20rpx">关注</u-button>
				</view>
			</u-row>
			<view style="margin:20rpx">
				<u-row>
					<text :style="{color:info.isVip?'#FB7299':'',fontSize:58+'rpx'}">{{info.screenName}}</text>
					<u-text :text="'Lv.'+ info.lv" size="10" color="white"
						customStyle="margin-left:10rpx;background:#FB7299;padding:0 10rpx;border-radius:8rpx;box-shadow:0 0 9rpx 0 #FB7299"></u-text>
				</u-row>
				<u-icon name="checkmark-circle-fill" label="管理员" color="red"
					v-if="info.groupKey=='administrator'"></u-icon>
				{{info}}
			</view>
		</view>
	</z-paging>
</template>

<script>
	export default {
		props: {
			nav: {
				type: Boolean,
				default: false
			},
			id: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				info: {},
			};
		},
		onLoad(params) {
			if (params) this.getAuthor(params.id)
		},
		created() {
			if (this.id) this.getAuthor(params.id)
		},
		methods: {
			getAuthor(id) {
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: id
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.info = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>