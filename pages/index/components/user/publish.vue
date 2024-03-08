<template>
	<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="scroll"
		style="margin-bottom: 60rpx;" :auto-hide-loading-after-first-loaded="false"
		:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false" use-cache
		:cache-key="`user_publish`">
		<block v-for="(item,index) in article" :key="index">
			<view style="margin: 30rpx;"  @tap.stop="item.type=='post'?goArticle(item):item.type=='photo'?goPhoto(item):goArticle(item)">
				<u-row justify="space-between" customStyle="margin-bottom:20rpx">
					<u-row align="bottom">
						<text style="font-size:40rpx;font-weight: 600;">{{$u.timeFormat(item.created,'dd')}}</text>
						<text style="color: #999;margin-left: 10rpx;">{{$u.timeFormat(item.created,'mm')}}</text>
						<view v-if="item.category" style="color: #999;font-size: 26rpx;">
							<text style="margin: 0 10rpx;">·</text>
							<text>{{item.category.name}}</text>
						</view>
					</u-row>
					<i class="ess mgc_more_1_line" style="font-size: 60rpx;"
						@click.stop="sendEmit('articleMenu',item)"></i>
				</u-row>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<articleFooter :data="item"></articleFooter>
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
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			articlePhoto
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
				this.$http.post('/article/articleList', {
					page,
					limit,
					params: JSON.stringify({
						authorId: this.$store.state.userInfo.uid
					}),
					order: 'created desc',

				}).then(res => {
					this.$refs.paging.complete(res.data.data.data)
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
				this.$refs.paging.reload();
			},
			sendEmit(event,data){
				this.$emit(event,data)
			}
			
		}
	}
</script>

<style>
</style>