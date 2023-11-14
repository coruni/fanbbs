<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<text class="u-line-2">{{data.title}}</text>
		<u-parse :content="data.text" class="u-line-2"></u-parse>
		<u-album :urls="data.images" maxCount="6" borderRadius="10" multipleSize="100" space="10"></u-album>
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
			preview() {

			}
		}
	}
</script>

<style lang="scss">
</style>