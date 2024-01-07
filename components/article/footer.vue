<template>
	<view style="margin-top: 20rpx">
		<view v-if="!waterFall" style="padding-bottom: 20rpx;">
			<view style="margin-top: 20rpx;display: flex;justify-content: space-between;color: #999;">
				<u-row>
					<i class="ess icon-eye_2_line" style="font-size: 40rpx;"></i>
					<text style="font-size: 30rpx;margin-left: 10rpx;">{{data.views}}</text>
				</u-row>
				<u-row customStyle="flex-basis:25%" justify="space-between">
					<u-row>
						<i class="ess icon-chat_4_line" style="font-size: 40rpx;"></i>
						<text style="font-size: 30rpx;margin-left: 10rpx;">{{data.commentsNum}}</text>
					</u-row>
					<u-row>
						<i class="ess icon-thumb_up_2_line" style="font-size: 40rpx;"></i>
						<text style="font-size: 30rpx;margin-left: 10rpx;">{{data.likes}}</text>
					</u-row>
				</u-row>
			</view>
		</view>
		<view v-else>
			<u-row justify="space-between">
				<u-icon name="thumb-up" size="20" :label="data.likes"></u-icon>
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