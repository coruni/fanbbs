<template>
	<view style="margin-top: 20rpx;">
		<u-row style="background: #f7f7f7;border-radius: 20rpx;" align="top">
			<image :src="data.images && data.images[0]" mode="aspectFill"
				style="height: 200rpx;width: 160rpx; border-radius: 20rpx 0 0 20rpx;"></image>
			<view
				style="padding: 30rpx; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start;flex: 1;height: 140rpx;">
				<view>
					<text>{{data.title}}</text>
				</view>
				<view v-if="data.tag && data.tag.length>0" style="display: flex;flex-wrap: wrap;margin-top: 20rpx;">
					<block v-for="(item,index) in data.tag" :key="index" v-if="index<4">
						<view style="
							font-size: 26rpx;
							background:#ff08001e;
							color: #ff0800;
							padding:8rpx 14rpx;
							border-radius: 500rpx;
							margin-right: 20rpx;
							margin-bottom: 10rpx;
							font-size: 24rpx;
							">
							<i class="ess mgc_hashtag_line" style="font-size: 26rpx;"></i>
							<text>{{item.name}}</text>
						</view>
					</block>
				</view>
			</view>
		</u-row>
	</view>
</template>

<script>
	export default {
		name: "photo",
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		data() {
			return {};
		},
		created() {}
	}
</script>

<style lang="scss">

</style>