<template>
	<view style="margin-top: 20rpx">
		<view v-if="!waterFall" style="padding-bottom: 20rpx;">
			<view v-if="data.tag.length>0" style="display: flex;flex-wrap: wrap;">
				<block v-for="(item,index) in data.tag" :key="index">
					<view style="
						font-size: 26rpx;
						background:#85a3ff1e;
						color: #85a3ff;
						padding:8rpx 14rpx;
						border-radius: 500rpx;
						margin-right: 20rpx;
						margin-bottom: 10rpx;
						">
						<text style="font-size: 28rpx;font-weight: 600;margin-right: 10rpx;">#</text>
						<text>{{item.name}}</text>
					</view>
				</block>
			</view>
			<view style="margin-top: 20rpx;display: flex;justify-content: space-between;">
				<u-icon name="eye-fill" color="#999" size="18" :label="data.commentsNum"></u-icon>
				<u-row customStyle="flex-basis:25%" justify="space-between">
					<u-icon name="chat" size="20" :label="data.commentsNum"></u-icon>
					<u-icon name="thumb-up" size="20" :label="data.likes"></u-icon>
				</u-row>
			</view>
		</view>
		<view v-else>
			<u-row justify="space-between">
				<u-icon name="thumb-up" size="20" :label="data.views"></u-icon>
				<u-avatar size="20" :src="data&& data.authorInfo && data.authorInfo.avatar"></u-avatar>
			</u-row>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'articleFooter',
		props: {
			data: {
				type: Object,
				default: null,
			},
			waterFall: {
				type: [String, Boolean],
				default: false,
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">

</style>