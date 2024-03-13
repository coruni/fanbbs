<template>
	<view>
		<yingbing-video :autoplay="false" style="height: 500rpx;" :poster="video && video.poster"
			:src="video && video.src" :title="article && article.title" ref="video" v-if="article">
		</yingbing-video>
		<u-row style="padding: 5rpx 30rpx;border-bottom: #f7f7f7 1rpx solid;">
			<z-tabs :list="list" :scrollCount="0" active-color="#ff0800" bar-animate-mode="worm"></z-tabs>
			<u-col :span="4.5">
				<uv-input disabled shape="circle" style="padding: 5rpx 10rpx;">
					<view slot="suffix" style="display: flex;align-items: center;padding: 0 10rpx;">
						<i class="mgc_comment_line" style="font-size: 40rpx;"></i>
					</view>
				</uv-input>
			</u-col>

		</u-row>

		<view style="margin: 30rpx;">
			<u-row justify="space-between">
				<u-row>
					<u-avatar :src="article && article.authorInfo && article.authorInfo.avatar" size="30"></u-avatar>
					<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
						<text
							style="font-size: 28rpx;">{{article && article.authorInfo && article.authorInfo.screenName?article.authorInfo.screenName:article && article.authorInfo &&article.authorInfo.name}}</text>
						<text style="font-size: 24rpx;color: #ccc;"
							class="u-line-1">{{article && article.authorInfo &&  article.authorInfo.introduce}}</text>
					</view>
				</u-row>
				<view style="flex-shrink: 0;">
					<u-button :plain="article && article.authorInfo&& !article.authorInfo.isFollow" shape="circle"
						hover-class="button_hover"
						:color="article && article.authorInfo&& article.authorInfo.isFollow?'#ff08000f':'#ff0800'"
						style="width:160rpx;height:65rpx;"
						:style="{color:article && article.authorInfo&& article.authorInfo.isFollow?'black':'#ff0800'}"
						:text="article && article.authorInfo&& article.authorInfo.isFollow?'已关注':'关注'" class="follow"
						@click="$emit('follow',article.authorId)"></u-button>
				</view>

			</u-row>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				article: {},
				video: {},
				list: ['简介', '评论']
			}
		},
		onLoad(params) {
			this.id = params.id;
			this.getData(params.id)
		},
		methods: {
			getData(id) {
				this.$http.get('/article/info', {
					params: {
						id: id ? id : this.id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						this.video = this.article.videos[0]
						console.log(this.article)
					}
				})
			}
		}
	}
</script>

<style>

</style>