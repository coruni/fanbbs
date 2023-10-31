<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto="false">
		<block v-for="(item,index) in content" :key="index">
			<view @click="goArticle(item)"
				style="margin:20rpx 20rpx 0rpx 20rpx;padding:20rpx;box-shadow: 2rpx 2rpx 6rpx 2rpx #f1f1f1;border-radius: 20rpx;">
				<article-header :data="item"></article-header>
				<article-content :data="item"></article-content>
				<article-footer :data="item"></article-footer>
			</view>
		</block>
	</z-paging>
</template>

<script>
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	import swiper from '../../uni_modules/uview-ui/libs/config/props/swiper';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
		},
		name: 'articleIndex',
		props: {
			swiper: {
				type: [Number, String],
				default: 0,
			},
			tabbar: {
				type: [Number, String],
				default: 0,
			}
		},
		watch: {
			tabbar: {
				handler(index) {
					if (index == this.swiper) {
						if (!this.is_loaded) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				content: [],
				is_loaded: false,
			};
		},
		created() {
			console.log(this.swiper, this.tabbar)
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'post'
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.paging.complete(res.data.data);
						this.is_loaded = true
						console.log(res)
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
			}
		}
	}
</script>

<style lang="scss">

</style>