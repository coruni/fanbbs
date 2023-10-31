<template>
	<view>
		<u-row align="top">
			<u-avatar :src="data.avatar" size="30"></u-avatar>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row justify="space-between">
					<text :style="{'color:#FB7299':data.isvip}">{{data.author}}</text>
					<text>这里放时间？</text>
				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;">
					<u-parse :content="data.text"></u-parse>
				</view>
				<u-grid :col="3" :border="false" v-if="data.longtext && data.longtext.images">
					<u-grid-item v-for="(image,imageIndex) in data.longtext.images" :key="imageIndex"
						v-if="imageIndex<9" @click.native.stop="preview"
						:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
						<image :src="image" mode="aspectFill" style="width:210rpx;height:210rpx;border-radius:10rpx"
							class="u-info-light-bg"></image>
					</u-grid-item>
				</u-grid>
			</view>
		</u-row>
	</view>

</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		name: 'comment',
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
</style>