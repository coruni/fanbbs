<template>
	<view>
		<u-navbar placeholder title="板块列表">
			<view slot="left"></view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<u-swiper radius="10" height="180"></u-swiper>
			<u-row justify="space-between" style="margin-top: 20rpx;">
				<text style="font-weight: 600;">板块</text>
				<u-row style="color: #999;font-size: 28rpx;" @click="goCategoryList()">
					<text>全部</text>
					<i class="ess icon-right_line" style="font-size: 40rpx;"></i>
				</u-row>
			</u-row>
			<u-row justify="space-between" style="flex-wrap: wrap;">
				<block v-for="(item,index) in categories" :key="index">
					<u-col :span="5.8" @click="goCategory(item.mid)" style="margin-top: 30rpx;">
						<u-row align="top">
							<image :src="item.imgurl" mode="aspectFill" style="width: 100rpx;height: 100rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;"></image>
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
			}
		},

		created() {
			this.tabHeight = uni.getSystemInfoSync().windowHeight - 44 - 60
			this.getData()
			this.$nextTick(() => {
			}, 1)
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
						this.categories =res.data.data.data
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
		}
	}
</script>

<style>
</style>