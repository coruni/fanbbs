<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<text class="u-line-2">{{data.title}}</text>
		<u-parse :content="replaceEmoji(data.text)" class="u-line-2" style="overflow: hidden;"></u-parse>
		<u-album :urls="data.images" maxCount="6" borderRadius="10" multipleSize="100" singleSize="200"></u-album>	</view>
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
			replaceEmoji(html) {
				return html.replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
				  const emoji = this.$emoji.data.find(e => e.name === name)
				
				  if (emoji) {
				    const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
				    return `<img src="${src}" style="width:60rpx;height:60rpx">`
				  }
				  // 如果没有找到,直接返回空字符串
				  // 即删除整个匹配文本
				  return ''
				
				}).replace(/\|</g, '<').replace(/>\|/g, '>')
			},
		}
	}
</script>

<style lang="scss">
</style>