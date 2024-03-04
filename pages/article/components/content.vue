<template>
	<view style="margin-top:20rpx;">
		<!-- 内容 overflow:unset防止抖动-->
		<!-- <u-parse>组件错误更换为uv-parse -->
		<block v-if="data &&!data.showText">
			<view style="background: #f7f7f7;
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #999;">
				<i class="ess icon-lock_line" style="font-size: 45rpx;"></i>
				<text>该板块内容仅限会员可见</text>
			</view>
		</block>
		<uv-parse :ImgCache="true"
			:tag-style="{img:!isPreview?'border-radius:20rpx':'',video:'border-radius:20rpx !improtant',uniVideo:'border-radius:20rpx !improtant'}"
			style="overflow: unset;white-space: normal;word-break: break-all" :show-img-menu="!isScroll"
			:content="data.text" img-cache lazyLoad selectable @ready="htmlReady()" @linktap="linkTap"
			v-if="data && data.showText"></uv-parse>
	</view>
</template>

<script>
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
			},
			isPreview: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			autoPreview: {
				handler(status) {
					this.isScroll = status
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
			// 如果没有加载出来就强制发送事件取消加载
			// APP端报Not Found
			setTimeout(() => {
				this.$emit('ready', true)
			}, 1000)
		},
		onReady() {},
		methods: {

			is_last(index) {
				if (index != 2 || index != 5 || index != 8) return '10rpx'
			},
			preview(urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
				})
			},
			htmlReady() {
				setTimeout(() => {
					this.$emit('ready', true)
				})
			},
			buyHide() {
				this.$http.post('/article/buyHide', {
					cid: this.article.cid
				}).then(res => {

				})
			},
			linkTap(data) {
				if (data['data-type'] == '付费' || data.data - type == '回复') {
					this.$emit('hideTap', data['data-type'])
				}

			}
		}
	}
</script>

<style>
</style>