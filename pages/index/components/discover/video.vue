<template>
	<z-paging ref="paging" v-model="videos" @query="getData">
		<u-row style="flex-wrap: wrap;padding: 20rpx;" justify="space-between">
			<block v-for="(item,index) in videos" :key="index">
				<u-col :span="5.9" @click="goArticle(item)">
					<view class="video-item">
						<image :src="item.images[0]" style="width: 100%;height: 200rpx;border-radius: 10rpx 10rpx 0 0;"
							mode="aspectFill"></image>
						<view class="video-item-content">
							<text class="u-line-2">{{item.title}}</text>
							<view class="video-item-content-avatar">
								<view class="video-item-content-avatar-left">
									<u-avatar :src="item.authorInfo.avatar" size="24"></u-avatar>
									<text style="margin-left: 10rpx;" class="u-line-1" :class="{'vipname':item.authorInfo.isVip}">{{item.authorInfo.screenName||item.authorInfo.name}}</text>
								</view>
								<view class="video-item-content-avatar-right">
									<i class="mgc_thumb_up_2_line" style="font-size: 36rpx;"></i>
								</view>
							</view>
						</view>
					</view>
				</u-col>
			</block>
		</u-row>
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

		.video-item {
			background: #525252;
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

	.video-item {
		display: flex;
		flex-direction: column;
		height: 380rpx;
		background-color: #fff;
		margin-bottom: 12rpx;
		border-radius: 10rpx;

		&-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;
			font-size: 30rpx;
			padding: 10rpx;
			&-avatar {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				&-left{
					display: flex;
					align-items: center;
				}
				
			}

		}

	}
</style>