<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article" :scrollable="scroll" :refresher-enabled="false">
			<block v-for="(item,index) in article" :key="index">
				<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
					<article-header :data="item"></article-header>
					<article-content :data="item"></article-content>
					<article-footer :data="item"></article-footer>
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
		name: 'newArticle',
		props: {
			mid: {
				type: [String, Number],
				default: 0
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
				},
				deep: true,
				immediate: true,
			}
		},
		components: {
			articleHeader,
			articleContent,
			articleFooter,
		},
		data() {
			return {
				article: [],
				scroll: false,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							mid: this.mid,
							type: 'post'
						}),
						uid: this.$store.state.hasLogin ? this.$store.state.userInfo.uid : 0,
						order: 'created desc'
					}
				}).then(res => {
					console.log(res)
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