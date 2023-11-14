<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view style="position: relative;" @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo.avatar" size="34"></u-avatar>
					<image class="avatar_head" mode="aspectFill" :src="data.authorInfo.customize.head">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx">
					<text style="font-size: 30rpx;"
						:class="{'vipname':data.authorInfo.isvip}">{{data.authorInfo.name}}</text>
					<text style="font-size: 26rpx;color: #999;">{{$u.timeFormat(data.created,'mm-dd')}}</text>
				</view>

			</u-row>

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