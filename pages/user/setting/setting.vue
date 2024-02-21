<template>
	<view>
		<u-navbar title="设置" placeholder autoBack>
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;" @click="goPage('account')">
				<text>账号与安全</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
		</view>
		<u-gap height="7" bgColor="#f7f7f7"></u-gap>
		<u-row justify="space-between" style="padding: 15rpx 30rpx;">
			<text>护眼模式</text>
			<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-row justify="space-between" style="padding: 15rpx 30rpx;">
			<text>动图自动播放</text>
			<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-row justify="space-between" style="padding: 15rpx 30rpx;">
			<text>列表视频自动播放</text>
			<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-gap height="7" bgColor="#f7f7f7"></u-gap>
		<view>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>关于{{appName}}</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>清除缓存</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>建议与反馈</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>检查更新</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
		</view>
		<u-gap height="7" bgColor="#f7f7f7"></u-gap>
		<view>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>用户协议</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>隐私政策</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>个人信息收集清单</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 15rpx 30rpx;">
				<text>第三方共享个人信息清单</text>
				<i class="ess icon-right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
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
				appName: null,
			}
		},
		computed: {
			...mapState(['appInfo'])
		},
		created() {
			this.appName = uni.getSystemInfoSync().appName
		},
		methods: {
			goPage(page){
				this.$Router.push({
					name:page
				})
			}
		}
	}
</script>

<style>
</style>