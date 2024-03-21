<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto-scroll-to-top-when-reload="false"
		cache-mode="always" @onRefresh="onRefresh" safe-area-inset-bottom :auto-clean-list-when-reload="false" use-cache
		:cache-key="`articleList_${mid}`">
		<view class="swiper" v-if="swiper==0">
			<u-swiper height="100%" :list="$store.state.swiper" keyName="image" circular @click="swiperTap"
				@change="swiperIndex = $event.current" radius="10" showTitle></u-swiper>
			<view class="swiper-dot" v-if="$store.state.swiper.length">
				<text style="color: #fff;">{{swiperIndex+1}}/{{$store.state.swiper.length}}</text>
			</view>
		</view>
		<view style="margin-top: 20rpx;" v-if="$store.state.homepage.length>0 && swiper==0">
			<u-grid col="5">
				<u-grid-item v-for="(item,index) in $store.state.homepage" :key="index">
					<view class="home-content" @tap.stop="homepageTap(item)">
						<image mode="aspectFill" :src="item.image" class="image"></u-image>
							<text style="margin-top: 20rpx;font-size: 28rpx;">{{item.name}}</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view style="margin:30rpx" v-if="$store.state.appInfo&&$store.state.appInfo.announcement&&isSwiper">
			<u-notice-bar :text="$store.state.appInfo.announcement" bgColor="#ff08003c" color="#ff0800" mode="closable"
				style="border-radius: 20rpx;"></u-notice-bar>
		</view>
		<block v-for="(item,index) in content" :key="index" v-if="content.length">
			<view @tap.stop="goArticle(item)" class="article">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		</block>
		<!-- 底部占位高度 100rpx -->
		<template #bottom style="opacity: 0;">
			<view style="background: transparent !important;height: 80rpx;"></view>
		</template>
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
						order: this.mid ? 'isCircleTop desc,istop desc,created desc,replyTime desc' :
							'istop desc, created desc',

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

			onRefresh() {
				this.getSwiper()
			},
			homepageTap(data) {
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
				this.$Router.$lockStatus = false
			},
			getSwiper() {
				this.$http.get('/article/articleList', {
					params: {
						params: JSON.stringify({
							isswiper: 1
						})
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {

						const data = res.data.data.data || []
						let list = [];
						data.forEach(item => {
							item.image = item.images[0]
							list.push({
								...item
							});
						});
						this.$store.commit('setSwiper', list)
					}
				})
			},
			reload() {
				this.$refs.paging.reload()
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-grid-item--hover-class {
		opacity: 1 !important;
	}

	.article {
		margin: 30rpx 30rpx 12rpx 30rpx;
		padding-bottom: 10rpx;
	}

	.image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}

	.home-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.swiper {
		margin: 30rpx;
		height: 400rpx;
		position: relative;
		top: 0;

		&-dot {
			font-size: 24rpx;
			background: #ff0800a0;
			border-radius: 20rpx 0rpx 20rpx 0;
			padding: 6rpx 20rpx;
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 10;
		}

		&-mask {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 76%, rgba(0, 0, 0, 0.48783263305322133) 100%);

			&-title {
				position: absolute;
				bottom: 0;
				color: white;
				font-weight: 600;
				padding: 30rpx;
			}
		}
	}
</style>