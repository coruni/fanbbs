<template>
	<view>
		<z-paging @query="getData()" v-model="tags" ref="paging" :refresher-enabled="false">
			<block v-for="(item,index) in tags">
				<view style="margin:30rpx;padding: 30rpx;background: #fff;border-radius: 20rpx;">
					<u-row>
						<u--image :src="item.imgurl && item.imgurl?item.imgurl:'/static/login.jpg'" mode="aspectFill"
							height="50px" width="50px" radius="10"></u--image>
						<view style="margin-left:20rpx">
							<text>{{item.name}}</text>
						</view>
					</u-row>
				</view>
			</block>
			<template #loadingMoreNoMore></template>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: 'tagItem',
		data() {
			return {
				tags: [],
				key: ''
			}
		},
		props: {
			search: {
				type: [String, Number],
				default: 0,
			},

		},
		watch: {
			search: {
				handler(e) {
					this.key = e
					this.getData(1, 20)
				},
				immediate: true,
				deep: true,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/category/list', {
					params: {
						page,
						limit,
						params: JSON.stringify({
							type: 'tag',
							name: this.key && this.key
						}),

					}
				}).then(res => {
					
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			}
		}
	}
</script>

<style>
</style>