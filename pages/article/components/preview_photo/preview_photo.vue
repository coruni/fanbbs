<template>
	<view>
		<u-navbar placeholder bgColor="#3c4151" autoBack :title="data.title" :titleStyle="{color:'#fff'}">
			<view slot="left">
				<i class="ess mgc_close_line" style="font-size: 50rpx;color: white;"></i>
			</view>
		</u-navbar>
		<view @touchend="touchEnd" @touchmove="touchMove">
			<articleContent :data="data" :autoPreview="isScroll" :isPreview="true"></articleContent>
		</view>
	</view>
</template>

<script>
	import articleContent from '@/pages/article/components/content.vue';
	export default {
		components: {
			articleContent
		},
		data() {
			return {
				data: {},
				isScroll: false,
			};
		},
		onLoad(){
			this.data = uni.getStorageSync('photo_read');
			let newText = this.data.text.replace(/_compress\.webp/g, '');
			this.data.text = newText;
		},
		methods:{
			touchEnd() {
				// 停止移动
				this.isScroll = false;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isScroll = true;
			},
		}
	}
</script>

<style lang="scss">

</style>