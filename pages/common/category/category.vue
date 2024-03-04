<template>
	<view>
		<u-navbar autoBack placeholder title="板块列表">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<u-row justify="space-between" style="margin-top: 20rpx;flex-wrap: wrap;">
				<block v-for="(item,index) in categories" :key="index">
					<u-col :span="5.8">
						<view style="display: flex;
							 flex-direction: column;
							 justify-content: center;
							 align-items: center;
							 background: white;
							 border-radius: 20rpx;
							 padding: 30rpx;
							 height: 300rpx;
							 margin-bottom: 20rpx;" @click="goCategory(item.mid)">
							<u-image :src="item.imgurl" width="80px" height="80px" radius="10"></u-image>
							<text style="margin-top: 30rpx;">{{item.name}}</text>
							<text style="margin-top: 10rpx;font-size: 28rpx; color: #999;"
								class="u-line-2">{{item.description}}</text>
						</view>
					</u-col>
				</block>
			</u-row>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: [],
			}
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.getCategory()
			},
			getCategory() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 50,
						params: JSON.stringify({
							type: 'category',
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
			}
		}
	}
</script>

<style>
	page {
		background: #f9f9f9 !important;
	}
</style>