<template>
	<view style="margin-top: 10rpx;">
		<u-row justify="space-between">
			<u-row>
				<view>
					<text style="border-radius: 10rpx;padding: 8rpx 20rpx ;text-align: center;font-size: 14px;background-color: rgba(168,153,230,0.1);color: #a899e6; " v-if="data.category.length>0">{{data.category[0].name}}</text>
				</view>
				<block v-for="(tag,index) in data.tag" :key="index" v-if="data.tag">
					<view>
						<text style="border-radius: 10rpx;padding:8rpx 8rpx;text-align: center;font-size: 14px;">#{{tag.name}}</text>
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

</style>