<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto-scroll-to-top-when-reload="false"
		style="margin-bottom: 170rpx;" @onRefresh="onRefresh" :auto-clean-list-when-reload="false">
		<view style="margin: 20rpx;position: relative;top: 0;" v-if="isSwiper">
			<u-swiper height="200" :list="swiperList" keyName="image" circular @click="swiperTap"
				@change="swiperIndex = $event.current" radius="10"></u-swiper>
			<view
				style="font-size: 24rpx;background: #85a3ffa0;border-radius:20rpx 0rpx 20rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
				v-if="swiperList.length">
				<text style="color: #fff;">{{swiperIndex+1}}/{{swiperList.length}}</text>
			</view>
		</view>
		<view style="margin:30rpx" v-if="$store.state.appInfo&&$store.state.appInfo.announcement&&isSwiper">
			<u-notice-bar :text="$store.state.appInfo.announcement" bgColor="#85a3ff3c" color="#85a3ff" mode="closable"
				customStyle="border-radius: 20rpx;"></u-notice-bar>
		</view>
		<block v-for="(item,index) in content" :key="index" v-if="content.length">
			<view @tap.stop="item.type=='post'?goArticle(item):item.type=='photo'?goPhoto(item):goArticle(item)"
				style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<view style="border-bottom:1rpx #f7f7f7 solid"></view>
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
			articlePhoto,
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
			},
			waterFall: {
				type: [Boolean, String],
				default: false,
			},
			isSwiper: {
				type: Boolean,
				default: false,
			},
			mid: {
				type: [String, Number],
				default: 0,
			}
		},
		watch: {

		},
		data() {
			return {
				swiperIndex: 0,
				content: [],
				is_loaded: false,
				swiperList: [],
				data: null,
				showMenu: false,

			};
		},
		created() {
			this.getSwiper()
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							mid: this.mid ? this.mid : '',
						}),
						order: 'istop desc, created desc',
					}
				}).then(res => {
					if (res.data.code == 200) {
						console.log(res.data.data.data)
						this.$refs.paging.complete(res.data.data.data);
						this.is_loaded = true
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			getSwiper() {
				this.$http.get('/article/articleList', {
					params: {
						params: JSON.stringify({
							isswiper: 1
						})
					}
				}).then(res => {
					const data = res.data.data.data
					let list = [];
					data.forEach(item => {
						item.image = item.images[0]
						list.push({
							...item
						});
					});
					this.swiperList = list;
				})
			},
			swiperTap(index) {
				uni.setStorageSync(`article_${this.swiperList[index].cid}`, this.swiperList[index])
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: this.swiperList[index].cid
					}
				})
			},
			goArticle(data) {

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
			onRefresh() {
				this.getSwiper()
			},
			con(e) {
				console.log(e)
			}
		}
	}
</script>

<style lang="scss">

</style>