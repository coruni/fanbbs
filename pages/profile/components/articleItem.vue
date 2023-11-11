<template>
	<z-paging @query="getData" ref="paging" v-model="content" :refresher-enabled="false" :use-page-scroll="pageScroll">
		<view style="margin: 20rpx;">
			<block v-for="(item,index) in content" :key="index">
				<view style="margin-top: 20rpx;padding:10rpx;box-shadow: 0 0 9rpx 0 #f4f4f4;">
					<u-row align="top">
						<u-col span="5">
							<image :src="item.images.length>0?item.images[0]:''" mode="aspectFill"
								style="height: 180rpx;width:100%;background: #f4f4f4;"></image>
						</u-col>
						<view style="display: flex;flex:1;flex-direction: column;padding:0 20rpx;height: 180rpx;">
							<text style="font-weight: bold;">{{item.title}}</text>
							<text class="u-line-2">{{item.text}}</text>
							<text>{{item.created | date}}</text>
						</view>
					</u-row>
				</view>
			</block>
		</view>
	</z-paging>
</template>

<script>
	export default {
		name: 'articleItem',
		props: {
			uid: {
				type: [String, Number],
				default: 0
			},
			pageScroll: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				content: [],
			}
		},
		created() {
			console.log('已挂载article')
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'post',
							uid: this.uid
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
		}
	}
</script>

<style>
</style>