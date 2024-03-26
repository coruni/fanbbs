<template>
	<view style="margin-top: 20rpx;position: relative;">
		<view style="padding-bottom: 20rpx;">
			<view style="margin-top: 20rpx;display: flex;justify-content: space-between;color: #999;">
				<u-row>
					<i class="ess mgc_eye_2_line" style="font-size: 40rpx;"></i>
					<text style="font-size: 30rpx;margin-left: 10rpx;">{{article.views}}</text>
				</u-row>
				<u-row customStyle="flex-basis:25%" justify="space-between">
					<u-row>
						<i class="ess mgc_chat_4_line" style="font-size: 40rpx;"></i>
						<text style="font-size: 30rpx;margin-left: 10rpx;">{{article.commentsNum}}</text>
					</u-row>

					<view style="display: flex;" @click.stop.prevent="like()">
						<i :class="[article.isLike?'mgc_thumb_up_2_fill like-active':'mgc_thumb_up_2_line']"
							style="font-size: 40rpx;"></i>
						<text style="font-size: 30rpx;margin-left: 10rpx;">{{article.likes}}</text>
					</view>
				</u-row>
			</view>
		</view>
		<!-- 待审标签 -->
		<view class="waiting-tag" v-if="data.status=='waiting'">
			<text>待审核</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'articleFooter',
		props: {
			data: {
				type: Object,
				default: null,
			},
			waterFall: {
				type: [String, Boolean],
				default: false,
			}
		},
		data() {
			return {
				article: {}
			}
		},
		created() {
			this.article = this.data
		},

		methods: {
			like() {
				this.$http.post('/article/like', {
					id: this.article.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.article.isLike = !this.article.isLike
						this.article.likes += this.article.isLike ? 1 : -1;
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.like-active {
		color: $c-primary;
	}

	.waiting-tag {
		text-align: right;
		font-size: 20rpx;
		color: $c-primary;
	}
</style>