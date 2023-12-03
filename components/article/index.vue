<template>
	<view>
		<z-paging ref="paging" v-model="content" @query="getData" :auto="false" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false" style="margin-bottom: 160rpx;">
			<view style="margin: 20rpx;" v-if="isSwiper" @onRefresh="onRefresh">
				<u-swiper height="160" :list="swiperList" keyName="image" :autoplay="false" circular
					@click="swiperTap"></u-swiper>
			</view>
			<block v-for="(item,index) in content" :key="index">
				<view @tap.stop="goArticle(item)" style="margin:30rpx 30rpx 0rpx 30rpx;padding-bottom: 10rpx;">
					<article-header :data="item" @follow="$refs.paging.reload()"
						@menuTap="$emit('edit',$event)"></article-header>
					<article-content :data="item"></article-content>
					<article-footer :data="item"></article-footer>
				</view>
				<view style="border-bottom:1rpx #f7f7f7 solid"></view>
			</block>
		</z-paging>
	</view>

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
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							mid: this.mid ? this.mid : '',
						}),
						order: 'istop desc,created desc',
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.paging.complete(res.data.data);
						this.is_loaded = true
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			getSwiper() {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						searchParams: JSON.stringify({
							isswiper: 1
						})
					}
				}).then(res => {
					const data = res.data.data
					data.forEach(item => {
						item.image = item.images[0]
						this.swiperList.push({
							...item
						});
					});
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
				uni.setStorageSync(`article_${data.cid}`, data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			},
			onRefresh(){
				this.getSwiper()
			}
		}
	}
</script>

<style lang="scss">

</style>