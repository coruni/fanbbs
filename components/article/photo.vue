<template>
	<view class="photo-content">
		<view style="height: 100%;position: relative;">
			<image :src="data.images[0]" style="height: 100%;width: 180rpx;border-radius: 10rpx 0 0 10rpx;"
				mode="aspectFill"></image>
			<view class="photo-content-num">
				<i class="mgc_photo_album_line" style="color: white;"></i>
				<text style="font-size: 24rpx;">{{data.images.length}}</text>
			</view>
		</view>
		<view class="photo-content-title">
			<text>{{data.title}}</text>
			<scroll-view scroll-x style="overflow-x: scroll;">
				<block v-for="(item,index) in data.tag" :key="index">
					<u-row @click="goTag(item.mid)" class="tag" justify="center">
						<i class="mgc_hashtag_line" style="font-size: 26rpx;"></i>
						<text>{{item.name}}</text>
					</u-row>
				</block>
			</scroll-view>
		</view>
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
	@media (prefers-color-scheme: dark) {
		.photo-content {
			background: #525252 !important;
			border-radius: 0 10rpx 10rpx 0;
		}
	}

	.photo-content {
		margin-top: 20rpx;
		border-radius: 10rpx;
		display: flex;
		height: 180rpx;
		background-color: #f7f7f7;
		position: relative;

		&-title {
			flex: 1;
			height: 100%;
			padding: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
		}

		&-num {
			position: absolute;
			bottom: 0;
			right: 0;
			background-color: rgba(0, 0, 0, 0.1);
			border-top-left-radius: 10rpx;
			padding: 5rpx;
			font-size: 30rpx;
			color: white;
		}

		&-right {
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			margin-left: 20rpx;
			flex: 1;
			width: 100%;
		}

	}
</style>