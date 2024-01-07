<template>
	<z-paging @query="getData" ref="paging" v-model="article" style="margin-bottom: 100rpx;">
		<block v-for="(item,index) in article" :key="index" v-if="article">
			<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-content :data="item"></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<view style="border-top: #f7f7f7 solid 1rpx;"></view>
		</block>
	</z-paging>
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
		props: {
			type: {
				type: String,
				default: 'all'
			},
		},

		data() {
			return {
				article: [],
				showComemnts: false,
				id: 0,
				elWidth: 300,

			}
		},

		methods: {
			getData(page, limit) {
				let params = {
					page,
					limit,
				}
				this.$http.get('/article/follow', {
					params
				}).then(res => {
					let list = [];
					console.log(res)
					if (res.data.code == 200) {
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

			reload() {
				this.$refs.paging.reload()
			},
			goShare(data) {
				console.log('getData')
			},
			formatEmoji(html) {
				return html.replace(/\[([^\]]+)_([^\]]+)\]/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name);
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`;
						return `<img src=".${src}" style="width:80rpx;height:80rpx">`;
					}
					// 如果找不到对应的 emoji，可能需要返回原始的字符串或者给出一些提示
					return match;
				})
			},
		}
	}
</script>

<style>
</style>