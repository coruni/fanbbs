<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false" :use-page-scroll="!scroll" :refresher-enabled="false">
			<block v-for="(item,index) in article" :key="index">
				<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
					<article-header :data="item"></article-header>
					<article-content :data="item"></article-content>
					<article-footer :data="item"></article-footer>
				</view>
				<view :style="`border-bottom:1rpx ${border} solid`"></view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	export default {
		name: 'hotArticle',
		props: {
			mid: {
				type: [String, Number],
				default: 0
			},
			isScroll: {
				type: Boolean,
				default: false,
			},
			border: {
				type: String,
				default: null,
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
					params:{
						page,
						limit,
						searchParams: JSON.stringify({
							mid: this.mid,
						}),
						random: 1,
						order: 'likes desc,replyTime desc,text desc,views desc,created desc',
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
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
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style>
</style>