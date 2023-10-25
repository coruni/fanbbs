<template>
	<view style="margin-top: 10rpx;">
		<u-row justify="space-between">
			<u-row>
				<view style="border-radius: 10rpx;padding:2rpx 8rpx;text-align: center;" class="category">
					<text style="font-size: 20rpx;">{{data.category[0].name}}</text>
				</view>
				<block v-for="(tag,index) in data.tag" :key="index">
					<view style="border-radius: 10rpx;padding:2rpx 8rpx;text-align: center;">
						<text style="font-size: 20rpx;">#{{tag.name}}</text>
					</view>
				</block>
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