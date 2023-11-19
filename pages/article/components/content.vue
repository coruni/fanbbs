<template>
	<view style="margin-top:10rpx;">
		<view>
			<text style="font-weight: bold;">{{data.title}}</text>
		</view>
		<u-row justify="center" class="u-light-color" customStyle="margin:10rpx 0;">
			<text style="font-size:26rpx;color: #c0c4cc;">发布于:{{formatTime(data.created)}}</text>

			<view v-if="data.created!=data.modified">
				<text style="margin:0rpx 10rpx 0 10rpx;font-size:26rpx;color: #c0c4cc;">|</text>
				<text style="font-size:26rpx;color: #c0c4cc;">最后更新:{{formatTime(data.modified)}}</text>
			</view>
		</u-row>
		<!-- 内容 overflow:unset防止抖动-->
		<!-- <u-parse>组件错误更换为uv-parse -->
		<uv-parse :show-img-menu="!isScroll" :content="data.text" lazyLoad selectable
			:tag-style="{img:'border-radius:10rpx',video:'border-radius:10px'}"
			style="overflow: unset;white-space: normal;word-break: break-all"></uv-parse>
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
			},
			autoPreview: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			autoPreview: {
				handler(status) {
					this.isScroll = status
					console.log(this.isScroll)
				},
				deep: true,
				immediate: true
			},
		},
		computed: {

		},

		data() {
			return {
				isScroll: false,
			}
		},
		created() {
			console.log(this.data)
		},
		methods: {
			formatTime,
			is_last(index) {
				if (index != 2 || index != 5 || index != 8) return '10rpx'
			}
		}
	}
</script>

<style>
</style>