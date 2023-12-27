<template>
	<z-paging-swiper>
		<u-navbar placeholder title="板块列表">
			<view slot="left"></view>
		</u-navbar>
		<uv-vtabs chain :list="list" :height="tabHeight">
			<template v-for="(item,index) in list">
				<uv-vtabs-item :index="index" :key="index">
					<view style="margin: 0 30rpx;">
						<block v-for="(sub,subIndex) in item.subCategory" :key="index">
							<u-row @click="goCategory(sub.mid)">
								<u-avatar shape="square" :src="sub.imgurl" size="35"></u-avatar>
								<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
									<text class="u-line-1">{{sub.name}}</text>
									<text class="u-line-1 u-info" style="font-size: 30rpx;">{{sub.description}}</text>
								</view>
							</u-row>
						</block>
					</view>
				</uv-vtabs-item>
			</template>
		</uv-vtabs>
		<view>
			text
		</view>
	</z-paging-swiper>
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
				list: [],
				tabHeight:720,
			}
		},

		created() {
			this.tabHeight = uni.getSystemInfoSync().windowHeight - 44 - 60
			console.log(this.tabHeight)
			this.getData()
			this.$nextTick(() => {

			}, 1)
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/category/list', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'category',
							parent: 0,
						})
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.list = res.data.data
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