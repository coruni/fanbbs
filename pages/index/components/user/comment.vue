<template>
	<view>
		<z-paging @query="getData" v-model="comments" ref="paging" :refresher-enabled="false" :scrollable="scroll"
			style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false">
			<block v-for="(item,index) in comments">
				<view
					style="margin: 20rpx 40rpx;display: flex;flex-direction: column;border-bottom: 2rpx solid #f7f7f7;padding-bottom: 20rpx;">
					<text
						style="color: #999;font-size: 26rpx;">{{$u.timeFormat(item.created,'yyyy年mm月dd日')}}·{{item.contentsInfo.category[0].name}}</text>
					<text>{{item.text}}</text>
					<view style="padding: 10rpx;background: #f7f7f7;border-radius: 10rpx;">
						<text class="u-line-2"
							style="color: #999;font-size: 28rpx;">{{item.parentComments.author?`回复评论：${item.parentComments.text}`:`回复帖子：${item.contentsInfo.title}`}}</text>
					</view>
				</view>
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
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'comment',
							authorId: this.data.uid
						})
					}

				}).then(res => {
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			reload() {
				this.$refs.paging.reload();
			},
		}
	}
</script>

<style>
</style>