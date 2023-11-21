<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view style="position: relative;" @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo.avatar" size="34"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.authorInfo.opt && data.authorInfo.opt.headStatus && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx">
					<text style="font-size: 30rpx;font-weight: 600;"
						:class="{'vipname':data.authorInfo.isvip}">{{data.authorInfo.name}}</text>
					<text style="font-size: 26rpx;color: #999;">{{$u.timeFormat(data.created,'mm-dd')}}</text>
				</view>
			</u-row>
			
			<view style="display: flex;align-items: center;">
				<u-button plain color="#a899e6" size="mini" shape="circle" customStyle="font-size:28rpx;height:50rpx"  @click.stop.prevent="">关注</u-button>
				<u-icon name="more-dot-fill" size="20" customStyle="margin-left:30rpx"  @click.stop.prevent=""></u-icon>
			</view>
			
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
		created() {},
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