<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto-scroll-to-top-when-reload="false" cache-mode="always"
		style="margin-bottom: 190rpx;" @onRefresh="onRefresh" :auto-clean-list-when-reload="false" use-cache
		:cache-key="`articleList_${mid}`">
		<view style="margin: 20rpx;position: relative;top: 0;" v-if="swiper==0">
			<u-swiper height="200" :list="$store.state.swiper" keyName="image" circular @click="swiperTap"
				@change="swiperIndex = $event.current" radius="10"></u-swiper>
			<view
				style="font-size: 24rpx;background: #ff0800a0;border-radius:20rpx 0rpx 20rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
				v-if="$store.state.swiper.length">
				<text style="color: #fff;">{{swiperIndex+1}}/{{$store.state.swiper.length}}</text>
			</view>
		</view>
		<view style="margin: 30rpx;margin-top: 0;" v-if="$store.state.homepage.length>0 && swiper==0">
			<u-grid col="5">
				<u-grid-item v-for="(item,index) in $store.state.homepage" :key="index">
					<view style="display: flex;flex-direction: column;align-items: center;"
						@tap.stop="homepageTap(item)">
						<u-image :src="item.image" width="90rpx" height="90rpx" radius="10"></u-image>
						<text style="margin-top: 20rpx;font-size: 28rpx;">{{item.name}}</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>

		<view style="margin:30rpx" v-if="$store.state.appInfo&&$store.state.appInfo.announcement&&isSwiper">
			<u-notice-bar :text="$store.state.appInfo.announcement" bgColor="#ff08003c" color="#ff0800" mode="closable"
				customStyle="border-radius: 20rpx;"></u-notice-bar>
		</view>
		<block v-for="(item,index) in content" :key="index" v-if="content.length">
			<view @tap.stop="item.type=='post'?goArticle(item):item.type=='photo'?goPhoto(item):goArticle(item)"
				style="margin:30rpx 30rpx 12rpx 30rpx;padding-bottom: 10rpx;">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
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
				data: null,
				showMenu: false,
				gutter: 40,
				width: 0,

			};
		},
		created() {
			// 获取宽度

			let systemInfo = uni.getSystemInfoSync()
			// 计算宽度 每行五个项目
			this.width = (systemInfo.windowWidth - (this.gutter * 3)) / 5 - 10 + 'px'
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
						order: this.mid ? 'isCircleTop desc,created desc' : 'istop desc, created desc',
					}
				}).then(res => {
					
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data);
						this.is_loaded = true
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			
			swiperTap(index) {
				uni.setStorageSync(`article_${this.$store.state.swiper[index].cid}`, this.$store.state.swiper[index])
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: this.$store.state.swiper[index].cid
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
			homepageTap(data) {
				// 判断类型前往不同页面
				if (!data.type) {
					this.$Router.push({
						path: data.page,
					})
				} else {
					// #ifndef APP || MP
					window.open(data.page)
					// #endif
					// #ifdef APP || MP
					plus.runtime.openWeb(data.page)
					// #endif
				}
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
					this.$store.commit('setSwiper',list)
				})
			},
		}
	}
</script>

<style lang="scss">
	::v-deep .u-grid-item--hover-class {
		opacity: 1 !important;
	}
</style>