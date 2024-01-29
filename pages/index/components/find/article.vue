<template>
	<z-paging @query="getData" ref="paging" v-model="article" style="margin-bottom: 100rpx;"
		:empty-view-error-text="!$store.state.hasLogin?'你还没有登录哦~':'还没有关注的人，快去关注吧~'">
		<scroll-view scroll-x v-if="!article.length">
			<u-row style="margin: 30rpx;">
				<block v-for="(item,index) in users" :key="index">
					<view
						style="display: flex;flex-direction: column;align-items: center;border-radius: 20rpx;background-color: #85a3ff0a;padding: 20rpx;">
						<view style="position: relative;">
							<u-avatar :src="item.avatar"></u-avatar>
						</view>
						<text style="margin-top: 20rpx;">{{item.screenName?item.screenName:item.name}}</text>
						<u-button style="height: 60rpx;margin-top:20rpx" color="#85a3ff" shape="circle"
							@click="follow(item.uid,index)">关注</u-button>
					</view>
				</block>
			</u-row>

		</scroll-view>

		<block v-for="(item,index) in article" :key="index" v-if="article">
			<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-content :data="item"></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap bgColor="#85a3ff0a" height="6"></u-gap>
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
				users: [],

			}
		},
		created() {
			this.getRandomUser()
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
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},

			getRandomUser() {
				this.$http.get('/user/userList', {
					params: {
						page: 1,
						limit: 10,
						random: 1,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.users = res.data.data.data
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
			follow(id, index) {
				this.$http.post('/user/follow', {
					id
				}).then(res => {
					this.users[index].isFollow = !this.users[index].isFollow
				})
			}
		}
	}
</script>

<style>
</style>