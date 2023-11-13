<template>
	<view>
		<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="isScroll"
			style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false">
			<block v-for="(item,index) in article">
				<u-row customStyle="flex-direction:column;margin: 20rpx 30rpx;" align="top" @click="goArticle(item)">
					<text
						style="color: #999;font-size: 26rpx;">{{$u.timeFormat(item.created,'yyyy年mm月dd日')}}·{{item.category[0].name}}</text>
					<text style="font-weight: bold;">{{item.title}}</text>
					<text class="u-line-2">{{item.text}}</text>
					<image v-if="item.images.length>0" :src="item.images[0]" style="width: 100%;height: 350rpx;"
						mode="aspectFill"></image>
				</u-row>
				<u-gap height="6" customStyle="background:#f7f7f7"></u-gap>
			</block>

		</z-paging>
		<u-gap></u-gap>
	</view>
</template>

<script>
	export default {
		name: 'publish',
		props: {
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
		data() {
			return {
				article: [],
				scroll: false,
			}
		},
		created() {
			uni.$on('reloadPublish', data => {
				this.$refs.paging.reload()
				console.log('接收到消息，刷新publish')
			})
		},
		methods: {
			getData() {
				this.$http.post('/typechoContents/contentsList', {
					searchParams: JSON.stringify({
						type: 'post',
						authorId: this.$store.state.userInfo.uid
					}),

				}).then(res => {
					console.log(res, '发布')
					this.$refs.paging.complete(res.data.data)
				})
			},
			goArticle(data) {
				uni.setStorageSync(`article_${data.cid}`, data)
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