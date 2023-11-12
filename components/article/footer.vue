<template>
	<view style="margin-top: 10rpx;">
		<u-row justify="space-between">
			<u-row v-if="!waterFall">
				<block v-for="(tag,index) in data.tag" :key="index">
					<view style="border-radius: 10rpx;padding:2rpx 8rpx;text-align: center;font-size: 24rpx;">
						<text>#{{tag.name}}</text>
					</view>
				</block>
			</u-row>
			<u-avatar :src="data.authorInfo.avatar" size="24" v-else></u-avatar>
			<u-row>
				<u-icon name="thumb-up" size="20"></u-icon>
				<text>{{data.likes}}</text>
			</u-row>
		</u-row>
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
	.category {
		background: rgba($c-primary, 0.1);
		color: $c-primary;
	}

	.primary {
		color: $c-primary;
	}
</style>