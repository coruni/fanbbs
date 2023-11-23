<template>
	<view>
		<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="scroll"
			style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false">
			<block v-for="(item,index) in article">
				<view style="margin: 30rpx;" @click="goArticle(item)">
					<articleHeader :data="item"></articleHeader>
					<articleContent :data="item"></articleContent>
					<articleFooter :data="item"></articleFooter>
				</view>
			</block>
		</z-paging>
		<u-gap></u-gap>
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
					order:'created desc'

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