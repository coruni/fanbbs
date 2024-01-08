<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false" :use-page-scroll="!scroll" :refresher-enabled="false">
			<block v-for="(item,index) in article" :key="index">
				<view @tap.stop="item.type=='post'?goArticle(item):item.type=='photo'?goPhoto(item):goArticle(item)"
					style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
					<article-header :data="item" @follow="$refs.paging.reload()"
						@menuTap="$emit('edit',$event)"></article-header>
					<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
					<article-content :data="item" v-else></article-content>
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
	import articlePhoto from '@/components/article/photo.vue';
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
			articlePhoto
		},
		data() {
			return {
				article: [],
				scroll: false,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							mid: this.mid,
						}),
						random: 1,
						order: 'likes desc,replyTime desc,text desc,views desc,created desc',

					}
				}).then(res => {
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data.data)
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
			goPhoto(data) {
				this.$Router.push({
					path: '/pages/article/photo',
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