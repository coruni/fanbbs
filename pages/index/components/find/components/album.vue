<template>
	<view style="width: 100%;" v-if="data.images.length" id="album">
		<uv-album :urls="data.images" maxCount="6" borderRadius="15" :singleSize="elWidth*0.8" singleMode="scaleToFill"
			:multipleSize="(elWidth-12)/3"></uv-album>
	</view>
</template>

<script>
	export default {
		name: 'album',
		props: {
			data: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				elWidth: 280,
			}
		},
		created() {
			this.$nextTick(() => {
				this.getAlbumWidth()
			},200)
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
					console.log(data.width)
				}).exec();
			},
		}

	}
</script>

<style>
</style>