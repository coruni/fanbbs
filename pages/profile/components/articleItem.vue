<template>
	<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="scroll"
		:auto-hide-loading-after-first-loaded="false" :auto-scroll-to-top-when-reload="false"
		:auto-clean-list-when-reload="false">
		<block v-for="(item,index) in article">
			<view style="margin: 30rpx;" @click="goArticle(item)">
				<u-row align="bottom" customStyle="margin-bottom:20rpx">
					<text style="font-size:40rpx;font-Weight: bold;">{{$u.timeFormat(item.created,'dd')}}</text>
					<text style="color: #999;margin-left: 10rpx;">{{$u.timeFormat(item.created,'mm')}}</text>
					<view v-if="item.category" style="color: #999;">
						<text style="margin: 0 10rpx;">·</text>
						<text>{{item.category.name}}</text>
					</view>
				</u-row>
				<articleContent :data="item"></articleContent>
				<articleFooter :data="item"></articleFooter>
			</view>
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		</block>
	</z-paging>
</template>

<script>
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	export default {
		components: {
			articleContent,
			articleFooter
		},
		name: 'publish',
		props: {
			isScroll: {
				type: Boolean,
				default: false,
			},
			uid: {
				type: [String, Number],
				default: 0,
			}
		},
		watch: {
			isScroll: {
				handler(e) {
					this.scroll = e
				},
				deep: true,
				immediate: true
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
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							type: 'post',
							authorId: this.uid
						}),
						order: 'created desc'
					}
				}).then(res => {
					this.$refs.paging.complete(res.data.data.data)
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
				this.$refs.paging.reload();
			},
		}
	}
</script>

<style>
</style>