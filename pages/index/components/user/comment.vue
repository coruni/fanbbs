<template>
	<view>
		<z-paging @query="getData" v-model="comments" ref="paging" :refresher-enabled="false" :scrollable="scroll"
			style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false" use-cache
			:cache-key="`user_comment}`">
			<block v-for="(item,index) in comments">
				<view style="margin: 30rpx;">
					<u-row align="bottom">
						<text style="font-weight: 600;font-size: 40rpx;">{{$u.timeFormat(item.created,'dd')}}</text>
						<text
							style="font-size: 26rpx;color: #999;margin-left: 10rpx;">{{$u.timeFormat(item.created,'mm')}}</text>
					</u-row>
					<view style="margin-top: 20rpx;">
						<uv-parse :content="item.text" :showImgMenu="false" :preview-img="false"></uv-parse>
					</view>

					<view v-if="item.images && item.images.length">
						<u-album :urls="item.images"></u-album>
					</view>
					<view v-if="item.parentComment && item.parentComment.userInfo"
						style="font-size: 28rpx;display: flex;align-items: center;color: #999;padding-left: 10rpx;border-left: 4rpx #99999932 solid;">
						<text style="flex-shrink: 0;">@{{item.parentComment.userInfo.screenName?item.parentComment.userInfo.screenName:item.parentComment.userInfo.name}}：</text>

						<uv-parse :content="item.parentComment.text" class="u-line-1"
							style="white-space: nowrap;overflow: hidden;overflow-y: unset;"></uv-parse>
					</view>

					<view style="background: #85a3ff0a;border-radius: 20rpx;margin-top: 10rpx;"
						@click="goArticle(item.article)">
						<u-row>
							<image mode="aspectFill"
								style="height: 100rpx;width: 100rpx;background: #f7f7f7;border-radius: 20rpx 0 0 20rpx;">
							</image>
							<text style="margin-left: 20rpx;color: #999;">{{item.article.title}}</text>
						</u-row>
					</view>

					<view style="margin-top: 20rpx;color: #999;"
						v-if="item.article.category&&item.article.category">
						<text>{{item.article.category.name}}</text>
					</view>
				</view>
				<view style="border-bottom: 1rpx #f7f7f7 solid;"></view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			},
			isScroll: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			isScroll: {
				handler(e) {
					this.scroll = e
				}
			}
		},
		created() {

		},
		data() {
			return {
				comments: [],
				scroll: false,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/comments/list', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							type: 0,
							uid: this.data.uid
						}),
						order: 'created desc'
					}

				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			reload() {
				this.$refs.paging.reload();
			},
			goArticle(data) {
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			}
		}
	}
</script>

<style>
</style>
<view v-if="item.parentComments" style="display: flex;align-items