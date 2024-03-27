<template>
	<view class="page-container">
		<!-- 状态栏占位 --> <!-- 搜索 -->
		<u-navbar placeholder bgColor="transparent">
			<view slot="left"></view>
			<view slot="center" style="flex: 1;display: flex;padding: 10rpx 30rpx;">
				<view style="flex: 1;">
					<uv-search placeholder="搜索你感兴趣的圈子" :showAction="false" ></uv-search>
				</view>
				<u-row style="margin-left: 20rpx;font-size: 28rpx;">
					<i class="mgc_add_line"></i>
					<text>创建圈子</text>
				</u-row>
			</view>
		</u-navbar>
		<u-sticky>
			<view style="padding: 30rpx;padding-bottom: 10rpx;">
				<text class="myPage">我的</text>
			</view>
		</u-sticky>
		<u-gap height="6" class="article-gap" bgColor="#f7f7f7"></u-gap>
		<!-- 我的关注 -->
		<view style="padding: 20rpx 30rpx;min-height: 300rpx;display: flex;flex-direction: column;">
			<text>我关注的</text>
			<u-gap height="6"></u-gap>
			<scroll-view scroll-x class="scroll" v-if="follow.length!=0">
				<view style="display: flex;">
					<block v-for="(item, index) in uniqueFollow1" :key="index">
						<view class="category-item" @tap="goCategory(item.mid)">
							<u-image :src="item.imgurl" width="50" height="50" radius="5"></u-image>
							<text style="font-size: 28rpx; margin-top: 10rpx;">{{item.name}}</text>
						</view>
					</block>
				</view>
				<view style="display: flex;">
					<block v-for="(item, index) in uniqueFollow2" :key="index">
						<view class="category-item" @tap="goCategory(item.mid)">
							<u-image :src="item.imgurl" width="50" height="50" radius="5"></u-image>
							<text style="font-size: 28rpx; margin-top: 10rpx;">{{item.name}}</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view v-else
				style="flex: 1;display: flex;align-items: center;justify-content: center;color: 26rpx;color: #999;">
				<text>暂无关注</text>
			</view>
		</view>
		<u-gap bgColor="#f7f7f7" height="6" class="article-gap"></u-gap>
		<!-- 全部板块 -->
		<view style="padding: 20rpx 30rpx;min-height: 300rpx;">
			<u-row justify="space-between" @click="goCategoryList()">
				<text>板块列表</text>
				<i class="mgc_right_line"></i>
			</u-row>

			<u-gap height="6"></u-gap>
			<u-row justify="space-between" style="flex-wrap: wrap;">
				<block v-for="(item,index) in categories" :key="index">
					<u-col :span="5.9">
						<u-row @click="goCategory(item.mid)" style="padding: 10rpx;">
							<u-image width="50" height="50" :src="item.imgurl" radius="5"></u-image>
							<view style="margin-left: 10rpx;font-size: 28rpx;display: flex;flex-direction: column;">
								<text class="u-line-1">{{item.name}}</text>
								<u-row style="font-size: 22rpx;color: #999;">
									<text style="padding-right: 4rpx;">{{item.follows}}人关注</text>
									<text>{{item.count}}讨论</text>
								</u-row>
							</view>
						</u-row>
					</u-col>
				</block>
			</u-row>

		</view>
	</view>

</template>

<script>
	const statusHeight = uni.getSystemInfoSync().statusBarHeight
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
				statusBarHeight: statusHeight,
				top: [],
				categories: [],
				tabHeight: 720,
				swiperIndex: 0,
				color: ['#aa96da', '#ff8800', '#FFCC00'],
				tags: [],
				follow: []
			}
		},
		computed: {
			uniqueFollow1() {
				return this.follow.filter((item, index) => index % 2 === 0);
			},
			uniqueFollow2() {
				return this.follow.filter((item, index) => index % 2 === 1);
			}
		},
		created() {
			this.tabHeight = uni.getSystemInfoSync().windowHeight - 44 - 60
			this.getData()
			this.getFollowCategory()
			this.getTop()
			this.getTags()
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
			getFollowCategory() {
				this.$http.get('/category/followList').then(res => {
					this.follow = res.data.data.data
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						params: JSON.stringify({
							type: 'tag',
							parent: 0
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.tags = res.data.data.data
					}
				})
			},
			getTop() {
				this.$http.get('/article/articleList', {
					params: {
						page: 1,
						limit: 6,
						order: 'created desc,likes desc,views desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.top = res.data.data.data
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
			goTag(id) {
				this.$Router.push({
					path: '/pages/common/tag/tag',
					query: {
						id
					}
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
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;

	}

	.myPage {
		color: $c-primary;
	}

	.input {
		background-color: #f7f7f7;
		padding: 15rpx !important;
	}

	.scroll {
		display: flex;
		overflow-y: scroll;

	}

	.category-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: center;
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

	.tag {
		font-size: 26rpx;
		background: #aa96da1e;
		color: #aa96da;
		padding: 8rpx 14rpx;
		min-width: 100rpx;
		max-width: 160rpx;
		min-height: 30rpx;
		border-radius: 500rpx;
		margin-right: 20rpx;
		margin-bottom: 10rpx;
		font-size: 30rpx;
	}
</style>