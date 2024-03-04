<template>
	<view>
		<u-navbar placeholder title="板块列表">
			<view slot="left"></view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<view style="position: relative;top: 0;">
				<u-swiper height="200" :list="$store.state.swiper" keyName="image" circular @click="swiperTap"
					@change="swiperIndex = $event.current" radius="10"></u-swiper>
				<view
					style="font-size: 24rpx;background: #ff0800a0;border-radius:20rpx 0rpx 20rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
					v-if="$store.state.swiper.length">
					<text style="color: #fff;">{{swiperIndex+1}}/{{$store.state.swiper.length}}</text>
				</view>
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
				categories: [],
				tabHeight: 720,
				swiperIndex: 0,
			}
		},

		created() {
			this.tabHeight = uni.getSystemInfoSync().windowHeight - 44 - 60
			this.getData()
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

<style>
</style>