<template>
	<view style="height: 100%;overflow-y: scroll;overflow: scroll;">
		<u-navbar placeholder title="板块列表" bgColor="transparent">
			<view slot="left"></view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<view>
				<text style="font-size: 60rpx;font-weight: 600;">Top</text>
				<block v-for="(item,index) in top" :key="index">
					<u-row style="padding: 10rpx 30rpx;"
						@click="item.type=='post'?goArticle(item):item.type=='photo'?goPhoto(item):goArticle(item)">
						<view class="top">{{index+1}}</view>
						<text style="margin-left: 30rpx;font-size: 30rpx;" class="u-line-1">{{item.title}}</text>
					</u-row>
				</block>
			</view>
			<u-row justify="space-between" style="margin-top: 20rpx;">
				<text style="font-weight: 600;">板块</text>
				<u-row style="color: #999;font-size: 28rpx;" @click="goCategoryList()">
					<text>全部</text>
					<i class="ess mgc_right_line" style="font-size: 40rpx;"></i>
				</u-row>
			</u-row>
			<u-row justify="space-between" style="flex-wrap: wrap;">
				<block v-for="(item,index) in categories" :key="index">
					<u-col :span="5.8" @click="goCategory(item.mid)" style="margin-top: 30rpx;">
						<u-row align="top">
							<image :src="item.imgurl" mode="aspectFill"
								style="width: 100rpx;height: 100rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;">
							</image>
							<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
								<text class="u-line-1">{{item.name}}</text>
								<text style="color: #999;font-size: 28rpx;" class="u-line-1">{{item.description}}</text>
							</view>
						</u-row>
					</u-col>
				</block>
			</u-row>
		</view>
	</view>

</template>

<script>
	export default {
		name: 'homeCategory',
		props: {
			index: {
				type: [String, Number],
				default: 0
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				top: [],
				categories: [],
				tabHeight: 720,
				swiperIndex: 0,
			}
		},
		created() {
			this.tabHeight = uni.getSystemInfoSync().windowHeight - 44 - 60
			this.getData()
			this.getTop()
			this.$nextTick(() => {}, 1)
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/category/list', {
					params: {
						params: JSON.stringify({
							type: 'category',
							parent: 0,
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.categories = res.data.data.data
					}
				})
			},
			getTop() {
				this.$http.get('/article/articleList', {
					params: {
						page: 1,
						limit: 9,
						order: 'created desc,likes desc,views desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.top = res.data.data.data
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
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/categoryInfo',
					query: {
						id
					}
				})
			},
			goCategoryList() {
				this.$Router.push({
					name: 'categoryList'
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
		}
	}
</script>

<style lang="scss">
	.top {
		background: #f7f7f7;
		font-size: 26rpx;
		padding: 4rpx;
		text-align: center;
		line-height: 34rpx;
		width: 30rpx;
		height: 30rpx;
		color: black;
		flex-shrink: 0;
		border-radius: 8rpx;
	}

	.top:first-child {
		background: $c-primary;
		color: white;
	}
</style>