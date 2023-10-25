<template>
	<view style="margin-top:10rpx">
		<view>
			<text style="font-weight: bold;">{{data.title}}</text>
		</view>
		<u-row justify="center" class="u-light-color" customStyle="font-size:20rpx;margin:10rpx 0;">
			<text>发布于:{{formatTime(data.created)}}</text>
			<view v-if="data.created!=data.modified||data.modified!=null">
				<text style="margin:0rpx 10rpx">|</text>
				<text>最后更新:{{formatTime(data.modified)}}</text>
			</view>
		</u-row>
		<!-- 内容 -->
		<u-parse :content="data.text"></u-parse>
		<!-- 图片 -->
		<!-- <block v-if="data.images.length==1">
			<image :src="data.images[0]" mode="aspectFill"
				style="margin-top:10rpx;height: 340rpx;border-radius: 20rpx;"></image>
		</block>
		<u-grid :col="data.images.length" :border="false" v-if="data.images.length==2||data.images.length==4"
			customStyle="margin-top:10rpx">
			<u-grid-item v-for="(image,imageIndex) in data.images" :key="imageIndex"
				customStyle="margin-right: 10rpx;width:240rpx;height:240rpx;border-radius:20rpx">
				<image :src="image" mode="aspectFill" style="height: 240rpx;width: 240rpx;border-radius:10rpx"
					class="u-info-light-bg"></image>
			</u-grid-item>
		</u-grid>
		<u-grid align="center" :col="3" :border="false" v-if="data.images.length>=3&&data.images.length<=9">
			<u-grid-item v-for="(image,imageIndex) in data.images" :key="imageIndex"
				:customStyle="{width:'220rpx',height:'220rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:is_last(imageIndex)}">
				<image :src="image" mode="aspectFill" style="width:220rpx;height:220rpx;border-radius:10rpx"
					class="u-info-light-bg"></image>
			</u-grid-item>
		</u-grid> -->
	</view>
</template>

<script>
	import {
		formatTime
	} from '@/common/common.js';
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
		created() {
			console.log(this.data)
		},
		methods: {
			formatTime,
			is_last(index){
				if(index!=2||index!=5||index!=8) return '10rpx'
			}
		}
	}
</script>

<style>
</style>