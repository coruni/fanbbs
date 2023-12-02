<template>
	<view>
		<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="scroll"
			style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false">
			<block v-for="(item,index) in article">
				<view style="margin: 30rpx;" @click="goArticle(item)">
					<u-row align="bottom" customStyle="margin-bottom:20rpx">
						<text style="font-size:40rpx;font-weight: 600;">{{$u.timeFormat(item.created,'dd')}}</text>
						<text style="color: #999;margin-left: 10rpx;">{{$u.timeFormat(item.created,'mm')}}</text>
						<view v-if="item.category.length" style="color: #999;">
							<text style="margin: 0 10rpx;">·</text>
							<text>{{item.category[0].name}}</text>
						</view>
					</u-row>
					<articleContent :data="item"></articleContent>
					<articleFooter :data="item"></articleFooter>
				</view>
				<view style="border-bottom:1rpx #f7f7f7 solid"></view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter
		},
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

		},
		methods: {
			getData(page, limit) {
				this.$http.post('/typechoContents/contentsList', {
					page,
					limit,
					searchParams: JSON.stringify({
						type: 'post',
						authorId: this.$store.state.userInfo.uid
					}),
					order: 'created desc'

				}).then(res => {
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
			},
			reload() {
				this.$refs.paging.reload();
			},
		}
	}
</script>

<style>
</style>