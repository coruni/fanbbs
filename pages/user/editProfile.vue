<template>
	<view>
		<u-navbar title="个人资料" autoBack placeholder></u-navbar>
		<view style="position: relative;top: 0;">
			<image src="/static/login.png" mode="aspectFill"
				style="width: 100%;height: 380rpx;border-radius: 0 0 40rpx 40rpx;box-shadow: #aaa 0rpx 4rpx 6rpx 0rpx;">
			</image>
			<view style="position: absolute;left: 50%;top:50%;transform: translate(-50%, -60%);">
				<image :src="info.avatar" mode="aspectFill"
					style="height: 180rpx;width: 180rpx;border-radius: 500rpx;border: 8rpx solid #fff;">
				</image>
				<u-icon name="plus" size="12" color="white"
					customStyle="background:#FB7299;position:absolute;top:70%;left:75%;border-radius:50rpx;padding:8rpx"></u-icon>
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
				<u-upload name="background" :maxCount="1" width="365" height="150">
					<image src="/static/login.png" mode="aspectFill"
						style="width:710rpx;height: 300rpx;"></image>
				</u-upload>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				info: null,
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.info = this.userInfo
		}
	}
</script>

<style lang="scss">

</style>
<image src="/static/login.png" mode="aspectFill"
	style="width: 100%;height: 380rpx;border-radius: 0 0 40rpx 40rpx;box-shadow: #f4f4f4 0rpx 4rpx 8rpx 4rpx;">
</image>