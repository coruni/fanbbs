<template>
	<view>
		<z-paging ref="paging" @query="getData" v-model="article">
			<template #top>
				<u-navbar title="我的收藏" placeholder autoBack>
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<block v-for="(item,index) in article" :key="index">
				<view style="margin: 30rpx;" @click="goArticle(item)">
					<article-header :data="item"></article-header>
					<article-content :data="item"></article-content>
					<article-footer :data="item"></article-footer>
				</view>
				<view style="border-bottom: 1rpx solid #f7f7f7;"></view>
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
		data() {
			return {
				article: []
			};
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/userlog/markList', {
					page,
					limit,

				}).then(res => {
					console.log(res)
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
			}
		}
	}
</script>

<style lang="scss">

</style>