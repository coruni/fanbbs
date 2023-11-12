<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo.avatar" size="30"></u-avatar>
				</view>
				<text style="margin-left:20rpx"
					:class="{'vipname':data.authorInfo.isvip}">{{data.authorInfo.name}}</text>
			</u-row>
			<text
				style="font-size:24rpx;color:white;margin-left:10rpx;background:#FB7299;padding:0 10rpx;border-radius:8rpx;box-shadow:0 0 9rpx 0 #FB7299">
				{{data.category[0].name}}
			</text>

		</u-row>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		data() {
			return {

			}
		},
		methods: {
			goArticle(data) {
				uni.setStorageSync(`article_${data.cid}`, data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.vipname {
		color: $c-primary;
	}
</style>