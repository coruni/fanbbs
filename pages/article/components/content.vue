<template>
	<view style="margin-top:20rpx;">
		<!-- 内容 overflow:unset防止抖动-->
		<!-- <u-parse>组件错误更换为uv-parse -->
		<uv-parse :tag-style="{img:'border-radius:20rpx',video:'border-radius:20rpx !improtant',uniVideo:'border-radius:20rpx !improtant'}"
			style="overflow: unset;white-space: normal;word-break: break-all" :show-img-menu="!isScroll"
			:content="data.text" lazyLoad selectable></uv-parse>
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