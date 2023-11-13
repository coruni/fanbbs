<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<text class="u-line-2">{{data.title}}</text>
		<u-parse :content="data.text" class="u-line-2"></u-parse>
		<u-album :urls="data.images" maxCount="6" multipleSize="100" space="10"></u-album>
		<!-- <block v-if="data.images.length==1">
			<image :src="data.images[0]" mode="aspectFill" style="margin-top:10rpx;height: 340rpx;border-radius: 20rpx;"
				@click.native.stop="preview"></image>
		</block>
		<u-grid :col="data.images.length" :border="false" v-if="data.images.length==2||data.images.length==4"
			customStyle="margin-top:10rpx">
			<u-grid-item v-for="(image,imageIndex) in data.images" :key="imageIndex" @click.native.stop="preview"
				customStyle="margin-right: 10rpx;width:240rpx;height:240rpx;border-radius:20rpx">
				<image :src="image" mode="aspectFill" style="height: 240rpx;width: 240rpx;border-radius:10rpx"
					class="u-info-light-bg"></image>
			</u-grid-item>
		</u-grid>
		<u-grid :col="3" :border="false" v-if="data.images.length>=3">
			<u-grid-item v-for="(image,imageIndex) in data.images" :key="imageIndex" v-if="imageIndex<6"
				@click.native.stop="preview"
				:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
				<image :src="image" mode="aspectFill" style="width:210rpx;height:210rpx;border-radius:10rpx"
					class="u-info-light-bg"></image>
			</u-grid-item>
		</u-grid> -->
	</view>
</template>

<script>
	export default {
		name: 'articleContent',
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		computed: {

		},
		data() {
			return {

			}
		},
		methods: {
			preview(){
				
			}
		}
	}
</script>

<style lang="scss">
</style>