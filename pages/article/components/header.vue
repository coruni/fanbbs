<template>
	<view>
		<text style="font-size: 50rpx;font-weight: 600;word-break: break-all;">{{data &&data.title}}</text>
		<u-row customStyle="color:#c0c4cc;font-size: 26rpx;" align="center" justify="space-between">
			<u-row>
				<u-row>
					<i class="ess icon-time_line"></i>
					<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
				</u-row>
				<text style="margin:0 20rpx">·</text>
				<u-row align="center">
					<i class="ess icon-eye_2_line"></i>
					<text>{{data.views}}</text>
				</u-row>
			</u-row>
			<text @click="goCategory(data.category.mid)">{{data.category && data.category.name?data.category.name:'未分类'}}</text>
		</u-row>
		<u-row justify="space-between"
			style="background: #ff08000a;padding: 40rpx 35rpx;border-radius: 20rpx;margin-top: 20rpx;">
			<u-row @click="goProfile(data.authorId)" style="flex: 1;">
				<view style="position: relative;display: inline-block;">
					<u-avatar :src="data && data.authorInfo&& data.authorInfo.avatar" size="40"
						customStyle="border:4rpx solid #ff080032"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data && data.authorInfo && data.authorInfo.opt  && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx;font-size: 30rpx;width: 0;flex:1">
					<u-row>
						<text
							style="font-weight: 600;">{{data.authorInfo&& data.authorInfo.screenName?data.authorInfo.screenName:data.authorInfo.name}}</text>
						<i v-if="data.authorInfo.level" :class="`level icon-lv-${data.authorInfo.level}`"
							style="font-size: 50rpx; margin-left: 10rpx;"
							:style="{ color: data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1] }">
						</i>
					</u-row>
					<text class="u-info u-line-1"
						style="font-size: 28rpx;">{{data && data.authorInfo && data.authorInfo.introduce}}</text>
				</view>
			</u-row>
			<view>
				<u-button :plain="data && data.authorInfo&& !data.authorInfo.isFollow" shape="circle"
					hover-class="button_hover"
					:color="data && data.authorInfo&& data.authorInfo.isFollow?'#ff08000f':'#ff0800'"
					customStyle="width:160rpx;height:65rpx"
					:style="{color:data && data.authorInfo&& data.authorInfo.isFollow?'black':'#ff0800'}"
					:text="data && data.authorInfo&& data.authorInfo.isFollow?'已关注':'关注'"
					@click="$emit('follow',data.authorId)"></u-button>
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
		methods: {
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
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

<style lang="scss">
	.u-button::before {
		background: $c-primary;
	}
</style>