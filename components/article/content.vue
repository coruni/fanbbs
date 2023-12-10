<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<u-row justify="space-between">
			<text style="font-weight: 600;word-break: break-all;word-wrap: break-word;"
				class="u-line-2">{{data.title}}</text>
			<view v-if="data.istop">
				<u-icon name="arrow-up-fill" color="#a899e6" labelColor="#a899e6" size="14" label="置顶" label-size="14"
					customStyle="background: #85a3ff1e;padding:4rpx;border-radius:10rpx"></u-icon>
			</view>
		</u-row>
		<uv-parse :content="replaceEmoji(data.text)" class="u-line-2"
			style="overflow: hidden;white-space: normal;word-break: break-all;word-wrap: break-word;"
			:previewImg="false" :showImgMenu="false"></uv-parse>
		<view id="album" style="width: 100%;">
			<uv-album :urls="data.images" maxCount="6" borderRadius="15" :singleSize="elWidth*0.8"
				singleMode="scaleToFill" :multipleSize="(elWidth-12)/3" v-if="data.images.length"></uv-album>
		</view>

		<view v-if="data.tag.length>0" style="display: flex;flex-wrap: wrap;margin-top: 20rpx;">
			<block v-for="(item,index) in data.tag" :key="index">
				<view style="
					font-size: 26rpx;
					background:#85a3ff1e;
					color: #85a3ff;
					padding:8rpx 14rpx;
					border-radius: 500rpx;
					margin-right: 20rpx;
					margin-bottom: 10rpx;
					font-size: 24rpx;
					">
					<i class="ess icon-hashtag_line" style="font-size: 26rpx;"></i>
					<text>{{item.name}}</text>
				</view>
			</block>
		</view>
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
				elWidth: 333,
			}
		},
		onReady() {},
		created() {
			this.$nextTick(() => {
				this.getAlbumWidth();
			},200)
		},
		mounted() {

		},
		methods: {
			getAlbumWidth() {
				uni.createSelectorQuery().in(this).select('#album').boundingClientRect(data => {
					if (data.width === 0) {
						// 如果宽度为0，则重新获取
						setTimeout(() => {
							this.getAlbumWidth();
						}, 200)
					} else {
						// 如果宽度不为0，保存宽度到 elWidth
						this.elWidth = data.width;
					}
				}).exec();
			},
			replaceEmoji(html) {
				return html.replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name)

					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
						return `<img src=".${src}" style="width:60rpx;height:60rpx">`
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