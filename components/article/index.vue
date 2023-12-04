<template>
	<view>
		<z-paging ref="paging" v-model="content" @query="getData" :auto="false" :auto-clean-list-when-reload="false"
			:auto-scroll-to-top-when-reload="false" style="margin-bottom: 160rpx;" @onRefresh="onRefresh">
			<view style="margin: 20rpx;position: relative;top: 0;" v-if="isSwiper">
				<u-swiper height="160" :list="swiperList" keyName="image" circular @click="swiperTap"
					@change="swiperIndex = $event.index"></u-swiper>
				<view
					style="font-size: 24rpx;background: #85a3ffa0;border-radius:20rpx 0rpx 8rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
					v-if="swiperList.length">
					<text style="color: #fff;">{{swiperIndex+1}}/{{swiperList.length}}</text>
				</view>

			</view>

			<view style="margin:30rpx" v-if="$store.state.appInfo.announcement">
				<u-notice-bar :text="$store.state.appInfo.announcement" bgColor="#85a3ff3c" color="#85a3ff"
					mode="closable" customStyle="border-radius: 20rpx;"></u-notice-bar>
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
				uni.setStorageSync(`article_${data.cid}`, data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			},
			onRefresh() {
				this.getSwiper()
			}
		}
	}
</script>

<style lang="scss">

</style>