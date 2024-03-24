<template>
	<z-paging @query="getData" ref="paging" v-model="article" :auto-scroll-to-top-when-reload="false"
		:auto-clean-list-when-reload="false" user-cache :cache-key="`category_${mid}`" :use-page-scroll="!scroll" :refresher-enabled="false">
		<block v-for="(item,index) in article" :key="Math.random() + item.cid">
			<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 12rpx 30rpx;padding-bottom: 10rpx;">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		</block>
	</z-paging>
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
			},
			order: {
				type: String,
				default: 'isCircleTop desc,likes desc,replyTime desc,text desc,views desc,created desc'
			},
			random: {
				type: Number,
				default: 0,
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
						random: this.random,
						newArticle: !this.random?1:0,
						order: this.order,
						

					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			goArticle(data) {
				let path
				switch (data.type) {
					case 'photo':
						path = '/pages/article/photo';
						break;
					case 'video':
						path = '/pages/article/video';
						break;
					default:
						path = '/pages/article/article';
						break;
				}
				this.$Router.push({
					path: path,
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