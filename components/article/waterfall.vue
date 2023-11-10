<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto="false">
		<uv-waterfall ref="waterfall" v-model="content" :add-time="10" :left-gap="leftGap" :rightGap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list1" :key="item.cid" :style="[imageStyle(item)]"
						style="background: #fff;margin-top: 20rpx;border-radius: 10rpx;overflow: hidden;" @click="goArticle(item)">
						<image
							:src="item.images.length?item.images[0]:'https://gitcode.net/qq_44112897/images/-/raw/master/comic/63.jpg'"
							mode="widthFix" :style="{width:item.width+'px'}" style="border-radius: 10rpx 10rpx 0 0 ;">
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
					<view v-for="(item,index) in list2" :key="item.cid" :style="[imageStyle(item)]"
						style="background: #fff;margin-top: 20rpx;border-radius: 10rpx;overflow: hidden;" @click="goArticle(item)">
						<image
							:src="item.images.length?item.images[0]:'https://gitcode.net/qq_44112897/images/-/raw/master/comic/63.jpg'"
							mode="widthFix" :style="{width:item.width+'px'}" style="border-radius: 10rpx 10rpx 0 0 ;">
						</image>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.title}}</text>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
	</z-paging>
</template>

<script>
	import list from '../../uni_modules/uview-ui/libs/config/props/list';
	import articleFooter from '@/components/article/footer.vue';
	export default {
		name: 'waterFall',
		props: {
			swiper: {
				type: [Number, String],
				default: 0,
			},
			tabbar: {
				type: [Number, String],
				default: 0,
			},
		},
		components:{
			articleFooter
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
				list1: [],
				list2: [],
				leftGap: 10,
				rightGap: 10,
				columnGap: 10,
				is_loaded: false
			}
		},
		created() {
			
		},
		computed: {
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: h + 'px'
					}
				}
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'post'
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.paging.complete(res.data.data);
						this.is_loaded = true
						console.log(res)
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
			changeList(e) {
				this[e.name].push(e.value);
			},
		}
	}
</script>

<style>
</style>