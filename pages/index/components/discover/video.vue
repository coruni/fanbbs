<template>
	<z-paging ref="paging" v-model="videos" @query="getData">
		<uv-waterfall ref="waterfall" v-model="videos" :add-time="10" :left-gap="leftGap" :rightGap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list1" :key="index" :style="[imageStyle(item)]" class="waterfall"
						@tap.stop="goArticle(item)">
						<image :src="item.images.length?item.images[0]:''" mode="widthFix"
							:style="{width:item.width+'px'}" style="border-radius: 20rpx 20rpx 0 0 ;">
						</image>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<article-footer :data="item" :water-fall="true" style="margin-top: 10rpx;"></article-footer>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list2" :key="index" :style="[imageStyle(item)]" class="waterfall"
						@tap.stop="goArticle(item)">
						<image :src="item.images.length?item.images[0]:'@/static/login.jpg'" mode="widthFix"
							:style="{width:item.width+'px'}" style="border-radius: 20rpx 20rpx 0 0 ;">
						</image>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<article-footer :data="item" :water-fall="true" style="margin-top: 10rpx;"></article-footer>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
		<template #bottom>
			<view class="tabbar-placeholder"></view>
		</template>
	</z-paging>
</template>

<script>
	import articleFooter from '@/components/article/footer.vue';
	export default {
		data() {
			return {
				videos: [],
				list1: [],
				list2: [],
				leftGap: 6,
				rightGap: 6,
				columnGap: 6,

			}
		},
		computed: {
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: '100%',
						height: h + 'px'
					}
				}
			}
		},
		components: {
			articleFooter
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							type: 'video'
						})
					}
				}).then(res => {
					if (res.data.code == 200)
						this.$refs.paging.complete(res.data.data.data)
				}).catch(() => {
					this.$refs.paging.complete(false)
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
			changeList(e) {
				this[e.name].push(e.value);
			},

		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.tabbar-placeholder {
			background-color: #292929;
		}
	}

	.waterfall {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.tabbar-placeholder {
		height: 100rpx;
		background: #fff;
	}
</style>