<template>
	<view>
		<u-navbar autoBack placeholder title="板块列表">
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<u-grid col="4" customStyle="margin:20rpx">
			<u-grid-item v-for="(item,index) in categories" :key="index">
				<u-row justify="center" @click="goCategory(item.mid)"
					customStyle="flex-direction:column; background:#f7f7f7;width:160rpx;height:200rpx;border-radius:20rpx;">
					<u--image :src="item.imgurl" width="90rpx" mode="aspectFill" height="90rpx" radius="10"></u--image>
					<text style="margin:10rpx 0;font-size: 28rpx;">{{item.name}}</text>
				</u-row>
			</u-grid-item>
		</u-grid>

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
						searchParams: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.categories = res.data.data
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

</style>