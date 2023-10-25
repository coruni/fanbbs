<template>
	<view>
		<u-row align="top">
			<u-avatar :src="data.avatar" size="30"></u-avatar>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row justify="space-between">
					<text>{{data.author}}</text>
					<text>占位</text>
				</u-row>
				<view style="margin-top:10rpx">
					<u-parse :content="data.text"></u-parse>
				</view>
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