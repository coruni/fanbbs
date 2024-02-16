<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<u-row justify="space-between">
			<text style="font-weight: 600;word-break: break-all;word-wrap: break-word;"
				class="u-line-2">{{data.title}}</text>
			<view v-if="data.istop||data.isCircleTop" style="flex-shrink: 0;">
				<u-icon name="arrow-up-fill" color="#a899e6" labelColor="#a899e6" size="14" label="置顶" label-size="14"
					customStyle="background: #85a3ff1e;padding:4rpx;border-radius:10rpx"></u-icon>
			</view>
		</u-row>

		<uv-parse :content="replaceEmoji(data.text)" class="u-line-2"
			style="overflow: hidden;white-space: normal;word-break: break-all;word-wrap: break-word;"
			:previewImg="false" :showImgMenu="false"></uv-parse>
		<!-- 三张图片以上才显示 -->
		<view id="album" style="width: 100%;" v-if="data.images.length>=3">
			<uv-album :urls="data.images" maxCount="6" borderRadius="15" :singleSize="elWidth*0.8"
				singleMode="scaleToFill" :multipleSize="elWidth" v-if="data.images.length"></uv-album>
		</view>
		<!-- 一张图片 -->
		<view v-if="data.images.length==1">
			<!-- <u-image :src="data.images[0]" :mode="mode" width="100%" radius="10" height="200"></u-image> -->
			<image :src="data.images[0]" :mode="mode"
				style="width: 100%; max-height: 400rpx;border-radius: 20rpx;background: #f7f7f7;"
				@click.stop="picPreview(data.images,0)">
			</image>
		</view>
		<!-- 两张图片 -->
		<view v-if="data.images.length==2">
			<u-row justify="space-between">
				<u-col span="5.9">
					<image mode="aspectFill" style="width: 100%;height: 300rpx;border-radius: 20rpx 0 0 20rpx;"
						:src="data.images[0]" @click.stop="picPreview(data.images,0)">
					</image>
				</u-col>
				<u-col span="5.9">
					<image mode="aspectFill" style="width: 100%;height: 300rpx;border-radius: 0 20rpx 20rpx 0;"
						:src="data.images[1]" @click.stop="picPreview(data.images,1)">
					</image>
				</u-col>
			</u-row>
		</view>


		<view v-if="data.tag && data.tag.length>0" style="display: flex;flex-wrap: wrap;margin-top: 20rpx;">
			<block v-for="(item,index) in data.tag" :key="index">
				<view style="
					font-size: 26rpx;
					background:#ff08001e;
					color: #ff0800;
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
				elWidth: uni.getStorageSync('albumWidth') ? (uni.getStorageSync('albumWidth') - 12) / 3 : 100,
				mode: 'aspectFill'
			}
		},
		created() {
			// 直接计算图片大小
			if (this.data.images.length >= 3) {
				if (uni.getStorageSync('albumWidth') > 0) {
					this.elWidth = (uni.getStorageSync('albumWidth') - 12) / 3
				}
				this.$nextTick(() => {
					this.getAlbumWidth();
				}, 200)
			}
			this.getImageInfo()
		},
		methods: {
			getImageInfo() {
				if (this.data.images.length == 1) {
					uni.getImageInfo({
						src: this.data.images[0],
						success: (res) => {
							if (res.width < res.height) {
								this.mode = 'heightFix'
							} else {
								this.mode = 'aspectFill'
							}
						}
					})
				}

			},
			getAlbumWidth() {
				uni.createSelectorQuery().in(this).select('#album').boundingClientRect(data => {
					if (data.width == 0) {
						// 如果宽度为0，直接使用本地存储的宽度 笨办法
						if (uni.getStorageSync('albumWidth')) {
							this.elWidth = (uni.getStorageSync('albumWidth') - 12) / 3
						}
					} else {
						// 如果宽度不为0，保存宽度到 elWidth
						this.elWidth = (data.width - 12) / 3;
						uni.setStorageSync('albumWidth', data.width)
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
			picPreview(urls, current) {
				uni.previewImage({
					urls,
					current,
					longPressActions: {
						itemList: ['保存原图'],
						success(data) {
							const save = path => {
								uni.saveImageToPhotosAlbum({
									filePath: path,
									success() {
										uni.showToast({
											title: '保存成功'
										})
									}
								})
							}
							if (urls[current].startsWith('http')) {
								let imageUrl = urls[current];
								imageUrl = imageUrl.replace('_compress.webp', '');
								uni.downloadFile({
									url: imageUrl,
									success: res => save(res.tempFilePath)
								})
							} else {
								save(urls[current])
							}
						}
					},
				})
			}
		}
	}
</script>

<style lang="scss">
</style>